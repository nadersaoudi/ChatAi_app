"""PDF ingestion + retrieval (FAISS, per-user indexes).

Beyond storage, ingestion preserves what answers need to be *clear*:
- 1-indexed page numbers on every chunk (for [p. N] citations);
- figure/diagram captions (Figure/Table/UML…) detected per page;
- embedded-image counts per page (so the model knows figures exist even
  when only their caption text was extracted).
"""

from __future__ import annotations

import os
import re
import shutil
import tempfile
import uuid
from functools import lru_cache
from pathlib import Path

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

_CHUNK_SIZE = 1000
_CHUNK_OVERLAP = 200
_MAX_BLOCK_CHARS = 1800

# Figure/diagram/table captions, EN + FR (UML docs are often French).
_CAPTION_RE = re.compile(
    r"(?im)^\s*((?:figure|fig\.?|tables?|tableaux?|diagram(?:me)?s?|"
    r"sch[ée]mas?|use[\s-]?cases?|cas d'utilisation|uml)[^\n]{0,120})"
)


def extract_captions(page_text: str) -> list[str]:
    """Figure-like caption lines on one page (pure, testable)."""
    found = []
    for match in _CAPTION_RE.finditer(page_text or ""):
        caption = " ".join(match.group(1).split())
        if caption and caption not in found:
            found.append(caption)
    return found[:8]


def count_page_images(reader_page) -> int:
    """Embedded images on a pypdf page (0 on any parse problem)."""
    try:
        xobjects = reader_page.get("/Resources", {}).get("/XObject", {}) or {}
        total = 0
        for obj in xobjects.values():
            try:
                if obj.get_object().get("/Subtype") == "/Image":
                    total += 1
            except Exception:
                continue
        return total
    except Exception:
        return 0


def format_cited_block(
    source: str, page_num: int, text: str, captions: list[str], figures: int
) -> str:
    """One retrieval unit, self-describing for the answer model."""
    head = f"[{source} — p. {page_num}]"
    if captions:
        head += "\nFigures/diagrams on this page: " + "; ".join(captions[:5])
    elif figures:
        head += f"\n({figures} embedded figure(s) on this page)"
    return f"{head}\n{(text or '').strip()[:_MAX_BLOCK_CHARS]}"


def index_dir_for_user(user_id: str) -> Path:
    """Isolated FAISS directory for one user (created on demand)."""
    safe_user = "".join(c for c in user_id if c.isalnum() or c in ("-", "_")) or "anon"
    if settings.faiss_base_dir:
        base = Path(settings.faiss_base_dir)
        if not base.is_absolute():
            base = settings.backend_root / base
        return base / f"faiss_index_{safe_user}"
    return settings.backend_root / f"faiss_index_{safe_user}"


@lru_cache(maxsize=1)
def _get_embeddings():
    try:
        from langchain_huggingface import HuggingFaceEmbeddings
    except ImportError:  # older langchain layouts
        from langchain_community.embeddings import HuggingFaceEmbeddings
    return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")


def _splitter():
    try:
        from langchain_text_splitters import RecursiveCharacterTextSplitter
    except ImportError:
        from langchain.text_splitter import RecursiveCharacterTextSplitter
    return RecursiveCharacterTextSplitter(
        chunk_size=_CHUNK_SIZE, chunk_overlap=_CHUNK_OVERLAP
    )


def _load_index(user_id):
    from langchain_community.vectorstores import FAISS

    return _load_index_cached(user_id, FAISS)


# In-memory index cache: reloading + re-embedding from disk on every query
# is pure waste under load. Invalidated by file mtime (ingest rewrites).
_index_cache: dict[str, tuple[float, object]] = {}


def _load_index_cached(user_id, FAISS):
    path = index_dir_for_user(user_id)
    try:
        mtime = (path / "index.faiss").stat().st_mtime_ns
    except OSError:
        _index_cache.pop(user_id, None)
        return None
    cached = _index_cache.get(user_id)
    if cached is not None and cached[0] == mtime:
        return cached[1]
    try:
        index = FAISS.load_local(
            str(path), _get_embeddings(), allow_dangerous_deserialization=True
        )
    except Exception as exc:
        logger.error("Failed to load FAISS index for user %s: %s", user_id, exc)
        _index_cache.pop(user_id, None)
        return None
    _index_cache[user_id] = (mtime, index)
    return index


def ingest_pdf(file_bytes: bytes, filename: str, user_id: str) -> tuple[str, int]:
    """Store an uploaded PDF in the user's FAISS index. Returns (pdf_id, chunks)."""
    from langchain_community.document_loaders import PyPDFLoader
    from langchain_community.vectorstores import FAISS

    if not filename.lower().endswith(".pdf"):
        raise ValueError("Only .pdf files are supported.")
    if len(file_bytes) > settings.max_pdf_mb * 1024 * 1024:
        raise ValueError(f"PDF exceeds the {settings.max_pdf_mb} MB limit.")

    pdf_id = str(uuid.uuid4())
    tmp_path = ""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name
        docs = PyPDFLoader(tmp_path).load()
        if not docs:
            raise ValueError("No readable content found in the PDF.")
        # Per-page figure info (captions + embedded image counts).
        page_captions: dict[int, list[str]] = {}
        page_figures: dict[int, int] = {}
        try:
            from pypdf import PdfReader
            reader = PdfReader(tmp_path)
            for pno, page in enumerate(reader.pages):
                try:
                    text = page.extract_text() or ""
                except Exception:
                    text = ""
                page_captions[pno] = extract_captions(text)
                page_figures[pno] = count_page_images(page)
        except Exception as exc:
            logger.warning("Figure scan skipped for %s: %s", filename, exc)
        chunks = _splitter().split_documents(docs)
        if not chunks:
            raise ValueError("Could not split the PDF into chunks.")
        for i, chunk in enumerate(chunks):
            text = getattr(chunk, "page_content", "")
            page_idx = int(chunk.metadata.get("page", 0) or 0)
            chunk.metadata.update(
                {
                    "user_id": user_id,
                    "pdf_id": pdf_id,
                    "chunk_id": i,
                    "source": filename,
                    "page_num": page_idx + 1,
                    "captions": page_captions.get(page_idx, []),
                    "figures": page_figures.get(page_idx, 0),
                }
            )
            chunk.page_content = text
        index_path = index_dir_for_user(user_id)
        if index_path.exists():
            # Replace this user's index atomically-ish: rebuild then swap.
            if index_path.is_dir():
                shutil.rmtree(index_path)
            else:
                index_path.unlink()
        FAISS.from_documents(chunks, _get_embeddings()).save_local(str(index_path))
        logger.info("Stored %d chunks for user %s (pdf %s)", len(chunks), user_id, pdf_id)
        return pdf_id, len(chunks)
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)


def query(user_id: str, question: str, top_k: int = 4) -> list[str]:
    if not (question or "").strip():
        return []
    index = _load_index(user_id)
    if index is None:
        return []
    scored = index.similarity_search_with_score(question, k=top_k * 3)
    # FAISS L2: lower score = closer. Keep best, user-scoped, cited.
    mine = sorted(
        ((doc, score) for doc, score in scored if doc.metadata.get("user_id") == user_id),
        key=lambda pair: pair[1],
    )[:top_k]
    blocks = [
        format_cited_block(
            doc.metadata.get("source", "document"),
            int(doc.metadata.get("page_num", 0) or 0),
            doc.page_content,
            list(doc.metadata.get("captions") or []),
            int(doc.metadata.get("figures", 0) or 0),
        )
        for doc, _ in mine
    ]
    logger.info("RAG query for user %s returned %d chunks", user_id, len(blocks))
    return blocks


def list_chunks(user_id: str, pdf_id: str | None = None) -> list[dict]:
    index = _load_index(user_id)
    if index is None:
        return []
    out = []
    for doc in index.docstore._dict.values():
        meta = doc.metadata or {}
        if meta.get("user_id") != user_id:
            continue
        if pdf_id and meta.get("pdf_id") != pdf_id:
            continue
        out.append({"metadata": meta, "preview": (doc.page_content or "")[:300]})
    return out


def index_stats(user_id: str | None = None) -> dict:
    """Health info for debug UIs: which user indexes exist on disk."""
    if settings.faiss_base_dir:
        base = Path(settings.faiss_base_dir)
        if not base.is_absolute():
            base = settings.backend_root / base
        dirs = sorted(p.name for p in base.glob("faiss_index_*")) if base.exists() else []
    else:
        dirs = sorted(p.name for p in settings.backend_root.glob("faiss_index_*") if p.is_dir())
    if user_id:
        dirs = [d for d in dirs if d == f"faiss_index_{user_id}"]
    return {"index_dirs": dirs, "count": len(dirs)}
