"""Unit tests for rag_service pure helpers + validation paths."""

from pathlib import Path
from types import SimpleNamespace

import pytest

from app.services import rag_service
from app.services.rag_service import (
    count_page_images,
    extract_captions,
    format_cited_block,
    index_dir_for_user,
    index_stats,
    ingest_pdf,
    list_chunks,
    query,
)


def test_extract_captions_en_fr():
    assert extract_captions("x\nFigure 2: Use case diagram\ny") == [
        "Figure 2: Use case diagram"
    ]
    assert extract_captions("a\nTableau 1 : Acteurs\nb") == ["Tableau 1 : Acteurs"]
    assert extract_captions("Fig. 3 - Class diagram") == ["Fig. 3 - Class diagram"]
    assert extract_captions("UML deployment overview\ntext") == [
        "UML deployment overview"
    ]
    assert extract_captions("plain text\nno captions") == []


def test_extract_captions_dedups():
    text = "Figure 1: A\nblah\nFigure 1: A"
    assert extract_captions(text) == ["Figure 1: A"]


def test_format_cited_block():
    block = format_cited_block("cv.pdf", 3, "Hello", ["Figure 1: Arch"], 2)
    assert block.startswith("[cv.pdf — p. 3]\nFigures/diagrams on this page: Figure 1: Arch\nHello")
    short = format_cited_block("d.pdf", 1, "x" * 5000, [], 0)
    assert len(short) <= len("[d.pdf — p. 1]\n") + 1800


class FakeXObject:
    def __init__(self, subtype):
        self.subtype = subtype

    def get_object(self):
        return self

    def get(self, key, default=None):
        return self.subtype if key == "/Subtype" else default


class FakePage:
    def __init__(self, subtypes):
        self.objs = {f"o{i}": FakeXObject(s) for i, s in enumerate(subtypes)}

    def get(self, key, default=None):
        if key == "/Resources":
            return {"/XObject": self.objs}
        return default


def test_count_page_images():
    assert count_page_images(FakePage(["/Image", "/Image", "/Font"])) == 2
    assert count_page_images(FakePage([])) == 0


def test_count_page_images_malformed():
    class Broken:
        def get(self, *a, **k):
            raise ValueError("broken")

    assert count_page_images(Broken()) == 0


def test_index_dir_for_user(monkeypatch):
    monkeypatch.setattr(
        rag_service,
        "settings",
        SimpleNamespace(faiss_base_dir="", backend_root=Path("/tmp/x")),
    )
    assert index_dir_for_user("abc-123_X") == Path("/tmp/x/faiss_index_abc-123_X")
    assert index_dir_for_user("!!!") == Path("/tmp/x/faiss_index_anon")
    monkeypatch.setattr(
        rag_service,
        "settings",
        SimpleNamespace(faiss_base_dir="base", backend_root=Path("/tmp/x")),
    )
    assert index_dir_for_user("u1") == Path("/tmp/x/base/faiss_index_u1")


def test_query_list_stats_missing_index():
    assert query("no-such-user-xyz", "hello") == []
    assert query("no-such-user-xyz", "   ") == []
    assert list_chunks("no-such-user-xyz") == []
    assert index_stats("no-such-user-xyz")["count"] == 0


def test_ingest_rejects_bad_files(monkeypatch):
    with pytest.raises(ValueError, match="Only .pdf"):
        ingest_pdf(b"xxx", "notes.txt", "u1")
    monkeypatch.setattr(
        rag_service, "settings", SimpleNamespace(max_pdf_mb=1)
    )
    with pytest.raises(ValueError, match="exceeds"):
        ingest_pdf(b"x" * (2 * 1024 * 1024), "big.pdf", "u1")
