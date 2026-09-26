"""Application factory: middleware + router wiring in one place."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.api.routes import chat, conversations, health, rag
from app.core.config import settings
from app.core.logging import get_logger
from app.services import mongo_service

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Idempotent; never blocks boot when the DB is down.
    try:
        mongo_service.ensure_indexes()
    except Exception as exc:
        logger.warning("Index setup skipped: %s", exc)
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="Codenix API",
        version="1.0.0",
        description=(
            "Chat IA (Groq), historique MongoDB et RAG PDF par utilisateur. "
            "Documentation interactive : essayez les endpoints ci-dessous."
        ),
        lifespan=lifespan,
        openapi_tags=[
            {"name": "chat", "description": "Complétions + modèles commutables"},
            {"name": "conversations", "description": "Persistance utilisateurs et historique"},
            {"name": "rag", "description": "Ingestion PDF et recherche vectorielle"},
            {"name": "health", "description": "Sondes de vivacité"},
        ],
    )

    app.add_middleware(GZipMiddleware, minimum_size=1000)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    for router in (health.router, chat.router, conversations.router, rag.router):
        app.include_router(router)

    return app


app = create_app()
