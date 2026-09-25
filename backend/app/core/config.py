"""Application configuration.

Single place for all environment-driven settings. Uses only the standard
library (+ python-dotenv) so importing this module can never crash the app
when optional dependencies are missing.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()  # safe no-op when no .env file is present


def _get_list(name: str, default: str) -> list[str]:
    raw = os.getenv(name, default)
    return [item.strip() for item in raw.split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    # Primary chat model. Must be a model ID the API key can access.
    groq_model: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
    # Tried in order when the primary model is not found / not accessible.
    groq_fallback_models: list[str] = field(
        default_factory=lambda: _get_list(
            "GROQ_FALLBACK_MODELS",
            "llama-3.1-8b-instant,"
            "meta-llama/llama-4-scout-17b-16e-instruct,"
            "qwen/qwen3-32b,"
            "openai/gpt-oss-120b",
        )
    )
    groq_timeout_seconds: float = float(os.getenv("GROQ_TIMEOUT_SECONDS", "60"))
    # Reasoning models spend tokens thinking — 1024 truncated long answers.
    groq_max_tokens: int = int(os.getenv("GROQ_MAX_TOKENS", "4096"))

    mongo_uri: str = os.getenv("MONGO_URI", "")
    mongo_db_name: str = os.getenv("MONGO_DB_NAME", "chatai_app")

    # Base directory for per-user FAISS indexes. Each user gets
    # ``<base>/faiss_index_<user_id>/``. If the legacy FAISS_INDEX_PATH env
    # var points at a *shared* directory, it is still honored as the base so
    # old data keeps working, but indexes are now isolated per user.
    # When FAISS_INDEX_PATH is unset, indexes live next to this file's parent
    # as ``faiss_index_<user_id>`` (the historical layout).
    faiss_base_dir: str = os.getenv("FAISS_INDEX_PATH", "")
    backend_root: Path = Path(__file__).resolve().parents[2]

    cors_origins: list[str] = field(
        default_factory=lambda: _get_list(
            "CORS_ORIGINS", "http://localhost:3000"
        )
    )
    max_history_messages: int = int(os.getenv("MAX_HISTORY_MESSAGES", "50"))
    max_pdf_mb: int = int(os.getenv("MAX_PDF_MB", "20"))


settings = Settings()
