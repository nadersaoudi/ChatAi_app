"""Chat completion service (Groq).

Responsibilities:
- lazily create the Groq client so a missing/invalid key fails at request
  time with a clear error instead of crashing the whole server at import;
- sanitize history (drop UI error placeholders, empty parts, cap length);
- transparently fall back to other models when the configured one is not
  accessible for the key (this was the root cause of the old HTTP 500 on
  ``/ask``: the hard-coded model had been decommissioned for the key).
"""

from __future__ import annotations

from functools import lru_cache
from typing import Iterable

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

# Frontend error bubbles start with this marker. They must never be sent back
# to the model, otherwise one failure permanently poisons the conversation.
ERROR_PLACEHOLDER_PREFIX = "❌"

_VALID_ROLES = {"user", "assistant", "system"}

_MODEL_LABELS = {
    "openai/gpt-oss-20b": "GPT-OSS 20B",
    "openai/gpt-oss-120b": "GPT-OSS 120B",
    "llama-3.1-8b-instant": "Llama 3.1 8B",
    "llama-3.3-70b-versatile": "Llama 3.3 70B",
    "meta-llama/llama-4-scout-17b-16e-instruct": "Llama 4 Scout",
    "meta-llama/llama-4-maverick-17b-128e-instruct": "Llama 4 Maverick",
    "qwen/qwen3-32b": "Qwen3 32B",
    "moonshotai/kimi-k2-instruct": "Kimi K2",
}


def short_label(model_id: str) -> str:
    return _MODEL_LABELS.get(model_id, model_id.split("/")[-1])


def available_models() -> list[dict]:
    """Configured models (primary + fallbacks, de-duplicated, order kept)."""
    ids = dict.fromkeys([settings.groq_model, *settings.groq_fallback_models])
    return [{"id": mid, "label": short_label(mid)} for mid in ids]


class AIConfigurationError(Exception):
    """GROQ_API_KEY missing or otherwise unusable."""


class AIUpstreamError(Exception):
    """The provider answered with an error (auth, rate limit, model, network)."""


@lru_cache(maxsize=1)
def _get_async_client():
    """Single shared async client: thousands of concurrent /ask calls
    multiplex on one event loop instead of queuing on a ~40-thread pool."""
    from groq import AsyncGroq

    if not settings.groq_api_key:
        raise AIConfigurationError(
            "GROQ_API_KEY is not set. Add it to backend/.env and restart."
        )
    return AsyncGroq(api_key=settings.groq_api_key, timeout=settings.groq_timeout_seconds)


def sanitize_messages(messages: Iterable[dict]) -> list[dict]:
    """Return provider-safe history: valid roles, non-empty content, capped."""
    clean: list[dict] = []
    for msg in messages:
        if not isinstance(msg, dict):
            continue
        role = msg.get("role")
        content = msg.get("content")
        if role not in _VALID_ROLES or not isinstance(content, str):
            continue
        content = content.strip()
        if not content or content.startswith(ERROR_PLACEHOLDER_PREFIX):
            continue
        clean.append({"role": role, "content": content})
    # Keep the tail (most recent context) within the configured budget.
    clean = clean[-settings.max_history_messages :]
    # Groq requires the conversation to contain at least one user turn.
    if not any(m["role"] == "user" for m in clean):
        return []
    return clean


def _is_model_not_found(error: Exception) -> bool:
    text = f"{type(error).__name__}: {error}".lower()
    return "model_not_found" in text or "does not exist" in text


async def complete(messages: list[dict], model: str | None = None) -> tuple[str, str]:
    """Get an assistant reply. Returns (reply, model_used).

    A requested model is tried first (must be in available_models());
    the normal fallback chain still applies when it is not accessible.
    """
    clean = sanitize_messages(messages)
    if not clean:
        raise AIUpstreamError("No usable messages to send (history was empty).")

    try:
        client = _get_async_client()
    except AIConfigurationError:
        raise
    except Exception as exc:  # pragma: no cover - defensive
        raise AIUpstreamError(f"Could not initialise AI client: {exc}") from exc

    candidates = [model, settings.groq_model, *settings.groq_fallback_models]
    candidates = [m for m in dict.fromkeys(candidates) if m]
    last_error: Exception | None = None
    for model in dict.fromkeys(candidates):  # de-duplicated, order kept
        try:
            completion = await client.chat.completions.create(
                messages=clean,
                model=model,
                max_tokens=settings.groq_max_tokens,
            )
            content = (completion.choices[0].message.content or "").strip()
            if not content:
                raise AIUpstreamError(f"Model {model!r} returned an empty reply.")
            logger.info("Chat completion via model %s", model)
            return content, model
        except Exception as exc:
            last_error = exc
            if _is_model_not_found(exc):
                logger.warning("Model %s not accessible, trying fallback", model)
                continue
            logger.exception("Chat completion failed on model %s", model)
            raise AIUpstreamError(_friendly_message(exc)) from exc

    raise AIUpstreamError(
        "None of the configured models are accessible for this API key. "
        f"Tried: {', '.join(dict.fromkeys(candidates))}. "
        f"Last error: {last_error}"
    )


def _friendly_message(exc: Exception) -> str:
    text = str(exc)
    lowered = text.lower()
    if "401" in lowered or "invalid_api_key" in lowered or "authentication" in lowered:
        return "AI provider rejected the API key (401). Check GROQ_API_KEY."
    if "429" in lowered or "rate_limit" in lowered:
        return "AI provider rate limit reached (429). Please wait and retry."
    if "timeout" in lowered or "connection" in lowered:
        return "Could not reach the AI provider (timeout/connection)."
    return f"AI provider error: {text[:500]}"
