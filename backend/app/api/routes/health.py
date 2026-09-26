"""Liveness + readiness probes."""

from fastapi import APIRouter

from app.core.config import settings

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "groq_configured": bool(settings.groq_api_key),
        "groq_model": settings.groq_model,
        "mongo_configured": bool(settings.mongo_uri),
    }
