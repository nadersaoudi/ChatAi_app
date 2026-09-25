"""Shared API helpers: consistent error mapping for service failures."""

import functools
import inspect

from fastapi import HTTPException

from app.core.logging import get_logger
from app.services.ai_service import AIConfigurationError, AIUpstreamError
from app.services.mongo_service import DatabaseUnavailableError

logger = get_logger(__name__)


def _raise_mapped(exc: Exception, action: str) -> None:
    """Translate a domain error into HTTP. Always raises."""
    if isinstance(exc, (AIConfigurationError, DatabaseUnavailableError)):
        logger.error("%s: %s", action, exc)
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    if isinstance(exc, AIUpstreamError):
        logger.error("%s: %s", action, exc)
        # Bad gateway: we are fine, the upstream provider failed.
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    if isinstance(exc, HTTPException):
        raise exc
    logger.exception("%s failed unexpectedly", action)
    raise HTTPException(status_code=500, detail=str(exc)) from exc  # safety net


def handle_service_errors(action: str):
    """Decorator mapping domain errors to HTTP codes (sync + async routes)."""

    def wrapper(fn):
        if inspect.iscoroutinefunction(fn):

            @functools.wraps(fn)
            async def inner_async(*args, **kwargs):
                try:
                    return await fn(*args, **kwargs)
                except Exception as exc:
                    _raise_mapped(exc, action)

            return inner_async

        @functools.wraps(fn)
        def inner(*args, **kwargs):
            try:
                return fn(*args, **kwargs)
            except Exception as exc:
                _raise_mapped(exc, action)

        return inner

    return wrapper
