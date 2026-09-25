"""Unit tests for ai_service: sanitize, fallback chain, error mapping.

The Groq client is always faked — no network, no key needed.
"""

from types import SimpleNamespace

import pytest

from app.services import ai_service
from app.services.ai_service import (
    AIConfigurationError,
    AIUpstreamError,
    available_models,
    complete,
    sanitize_messages,
)


def stub_settings(**overrides):
    base = dict(
        groq_api_key="test-key",
        groq_model="primary",
        groq_fallback_models=["fb1", "fb2"],
        groq_timeout_seconds=5,
        groq_max_tokens=50,
        max_history_messages=50,
    )
    base.update(overrides)
    return SimpleNamespace(**base)


class FakeCompletions:
    def __init__(self, script):
        self.script = list(script)
        self.calls = []

    async def create(self, **kwargs):
        self.calls.append(kwargs)
        item = self.script.pop(0)
        if isinstance(item, Exception):
            raise item
        return SimpleNamespace(
            choices=[SimpleNamespace(message=SimpleNamespace(content=item))]
        )


class FakeClient:
    def __init__(self, script):
        self.chat = SimpleNamespace(completions=FakeCompletions(script))


def fake_client(monkeypatch, script):
    client = FakeClient(script)
    monkeypatch.setattr(ai_service, "_get_async_client", lambda: client)
    monkeypatch.setattr(ai_service, "settings", stub_settings())
    return client


def model_not_found(model="primary"):
    return Exception(
        f"Error code: 404 - {{'error': {{'message': 'The model `{model}` "
        "does not exist or you do not have access to it.', "
        "'type': 'invalid_request_error', 'code': 'model_not_found'}}}}"
    )


# ---------------- sanitize_messages ----------------


def test_drops_error_bubbles_empty_and_invalid():
    out = sanitize_messages(
        [
            {"role": "assistant", "content": "Hello"},
            {"role": "assistant", "content": "❌ Failed", "extra": 1},
            {"role": "user", "content": "   "},
            {"role": "bot", "content": "nope"},
            {"role": "user", "content": 123},
            "not-a-dict",
            {"role": "user", "content": "  hi  "},
        ]
    )
    assert out == [
        {"role": "assistant", "content": "Hello"},
        {"role": "user", "content": "hi"},
    ]


def test_caps_history_and_requires_user_turn(monkeypatch):
    monkeypatch.setattr(ai_service, "settings", stub_settings(max_history_messages=3))
    msgs = [{"role": "user", "content": f"m{i}"} for i in range(10)]
    out = sanitize_messages(msgs)
    assert [m["content"] for m in out] == ["m7", "m8", "m9"]
    assert sanitize_messages([{"role": "assistant", "content": "x"}]) == []


# ---------------- available_models ----------------


def test_available_models_order_labels_dedup(monkeypatch):
    monkeypatch.setattr(
        ai_service,
        "settings",
        stub_settings(
            groq_model="openai/gpt-oss-20b",
            groq_fallback_models=["openai/gpt-oss-20b", "custom/x"],
        ),
    )
    assert available_models() == [
        {"id": "openai/gpt-oss-20b", "label": "GPT-OSS 20B"},
        {"id": "custom/x", "label": "x"},
    ]


# ---------------- complete ----------------


async def test_complete_success(monkeypatch):
    client = fake_client(monkeypatch, ["hello world"])
    reply, model = await complete([{"role": "user", "content": "hi"}])
    assert (reply, model) == ("hello world", "primary")
    assert client.chat.completions.calls[0]["model"] == "primary"
    assert client.chat.completions.calls[0]["max_tokens"] == 50


async def test_complete_falls_back_on_model_not_found(monkeypatch):
    client = fake_client(monkeypatch, [model_not_found(), "fallback hi"])
    reply, model = await complete([{"role": "user", "content": "hi"}])
    assert (reply, model) == ("fallback hi", "fb1")
    tried = [c["model"] for c in client.chat.completions.calls]
    assert tried == ["primary", "fb1"]


async def test_complete_tries_requested_model_first(monkeypatch):
    client = fake_client(monkeypatch, ["picked"])
    reply, model = await complete([{"role": "user", "content": "hi"}], model="fb2")
    assert (reply, model) == ("picked", "fb2")
    assert client.chat.completions.calls[0]["model"] == "fb2"


async def test_complete_raises_when_all_models_fail(monkeypatch):
    fake_client(monkeypatch, [model_not_found("primary"), model_not_found("fb1"), model_not_found("fb2")])
    with pytest.raises(AIUpstreamError, match="None of the configured models"):
        await complete([{"role": "user", "content": "hi"}])


async def test_complete_rejects_empty_history(monkeypatch):
    monkeypatch.setattr(ai_service, "settings", stub_settings())
    with pytest.raises(AIUpstreamError, match="No usable messages"):
        await complete([{"role": "assistant", "content": "❌ Failed"}])


async def test_complete_empty_reply_is_error(monkeypatch):
    fake_client(monkeypatch, ["   "])
    with pytest.raises(AIUpstreamError, match="empty reply"):
        await complete([{"role": "user", "content": "hi"}])


async def test_complete_maps_auth_and_rate_limits(monkeypatch):
    fake_client(monkeypatch, [Exception("401 invalid_api_key")])
    with pytest.raises(AIUpstreamError, match="API key"):
        await complete([{"role": "user", "content": "hi"}])
    fake_client(monkeypatch, [Exception("429 rate_limit_exceeded")])
    with pytest.raises(AIUpstreamError, match="rate limit"):
        await complete([{"role": "user", "content": "hi"}])


async def test_complete_missing_key_configuration(monkeypatch):
    monkeypatch.setattr(ai_service, "settings", stub_settings(groq_api_key=""))
    ai_service._get_async_client.cache_clear()
    with pytest.raises(AIConfigurationError, match="GROQ_API_KEY"):
        await complete([{"role": "user", "content": "hi"}])
