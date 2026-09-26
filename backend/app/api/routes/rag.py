"""PDF upload + RAG retrieval endpoints."""

from fastapi import APIRouter, File, Form, UploadFile

from app.api.deps import handle_service_errors
from app.core.logging import get_logger
from app.schemas.rag import PdfUploadResponse, RagQueryResponse
from app.services import rag_service

logger = get_logger(__name__)
router = APIRouter(tags=["rag"])


@router.post("/api/upload_pdf", response_model=PdfUploadResponse)
@handle_service_errors("upload_pdf")
def upload_pdf(
    user_id: str = Form(...), file: UploadFile = File(...)
) -> PdfUploadResponse:
    try:
        pdf_id, chunks = rag_service.ingest_pdf(
            file_bytes=file.file.read(),
            filename=file.filename or "upload.pdf",
            user_id=user_id,
        )
        return PdfUploadResponse(success=True, pdf_id=pdf_id, chunks=chunks)
    except ValueError as exc:
        logger.warning("Rejected PDF upload for user %s: %s", user_id, exc)
        return PdfUploadResponse(success=False, error=str(exc))


@router.post("/api/query_rag", response_model=RagQueryResponse)
@handle_service_errors("query_rag")
def rag_query(user_id: str = Form(...), query: str = Form(...)) -> RagQueryResponse:
    results = rag_service.query(user_id, query)
    if not results:
        return RagQueryResponse(results=[], error="No indexed PDF content found.")
    return RagQueryResponse(results=results)


@router.get("/api/list_chunks")
@handle_service_errors("list_chunks")
def list_chunks(user_id: str, pdf_id: str | None = None) -> dict:
    chunks = rag_service.list_chunks(user_id, pdf_id)
    return {"chunks": chunks, "count": len(chunks)}


@router.get("/api/vector_health")
def vector_health(user_id: str | None = None) -> dict:
    """Debug endpoint: which FAISS indexes exist on disk."""
    stats = rag_service.index_stats(user_id)
    if stats["count"] == 0:
        return {"status": "empty", **stats}
    return {"status": "ok", **stats}
