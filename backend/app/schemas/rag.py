"""RAG / PDF schemas."""

from pydantic import BaseModel


class RagQueryResponse(BaseModel):
    results: list[str] = []
    error: str | None = None


class PdfUploadResponse(BaseModel):
    success: bool
    pdf_id: str | None = None
    chunks: int = 0
    error: str | None = None
