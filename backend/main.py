"""Run with:  uvicorn main:app --reload   (from the backend/ directory)."""

from app.main import app  # noqa: F401  (re-exported for uvicorn)
