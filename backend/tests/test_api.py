"""Route tests with mocked services: no Groq, no Mongo, no disk writes."""

import time

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services import ai_service, mongo_service, rag_service
from app.services.ai_service import AIConfigurationError, AIUpstreamError


@pytest.fixture()
def client():
    return TestClient(app)


class FakeResult:
    def __init__(self, **fields):
        self.__dict__.update(fields)


class FakeCollection:
    """Minimal pymongo stand-in keyed by (user_id, conversation_id)."""

    def __init__(self):
        self.docs = {}

    def update_one(self, filt, update, upsert=False):
        key = (filt.get("user_id"), filt.get("conversation_id"))
        matched = key in self.docs
        self.docs[key] = {**filt, **update["$set"]}
        return FakeResult(matched_count=int(matched), modified_count=int(matched))

    def find(self, filt, projection=None):
        return [v for v in self.docs.values() if v.get("user_id") == filt.get("user_id")]

    def delete_one(self, filt):
        key = (filt.get("user_id"), filt.get("conversation_id"))
        return FakeResult(deleted_count=int(self.docs.pop(key, None) is not None))


@pytest.fixture()
def fake_db(monkeypatch):
    convs, users = FakeCollection(), FakeCollection()
    monkeypatch.setattr(mongo_service, "get_conversations_collection", lambda: convs)
    monkeypatch.setattr(mongo_service, "get_users_collection", lambda: users)
    return convs, users


def ok_complete(reply="hi", model="m"):
    async def _complete(*args, **kwargs):
        return (reply, model)

    return _complete


def boom_complete(exc):
    async def _complete(*args, **kwargs):
        raise exc

    return _complete


# ---------------- chat ----------------


def test_health_and_models(client):
    assert client.get("/health").json()["status"] == "ok"
    data = client.get("/api/models").json()
    assert data["default"]
    assert any("id" in m and "label" in m for m in data["models"])


def test_ask_ok(client, monkeypatch):
    monkeypatch.setattr(ai_service, "complete", ok_complete("hi", "m"))
    r = client.post("/ask", json={"messages": [{"role": "user", "content": "hi"}]})
    assert r.status_code == 200
    assert r.json() == {"response": "hi", "model": "m"}


def test_ask_upstream_maps_to_502(client, monkeypatch):
    monkeypatch.setattr(ai_service, "complete", boom_complete(AIUpstreamError("down")))
    r = client.post("/ask", json={"messages": [{"role": "user", "content": "hi"}]})
    assert r.status_code == 502
    assert r.json() == {"detail": "down"}


def test_ask_config_maps_to_503(client, monkeypatch):
    monkeypatch.setattr(
        ai_service, "complete", boom_complete(AIConfigurationError("no key"))
    )
    r = client.post("/ask", json={"messages": [{"role": "user", "content": "hi"}]})
    assert r.status_code == 503


def test_ask_unknown_model_400(client):
    r = client.post(
        "/ask",
        json={"messages": [{"role": "user", "content": "hi"}], "model": "nope/x"},
    )
    assert r.status_code == 400


def test_ask_empty_history_422(client):
    assert client.post("/ask", json={"messages": []}).status_code == 422


# ---------------- conversations ----------------


def test_user_and_conversation_roundtrip(client, fake_db):
    assert client.post(
        "/api/store_user",
        json={"user_id": "u1", "email": "a@b.c", "name": "A"},
    ).json()["success"] is True

    ts = int(time.time() * 1000)
    body = {
        "user_id": "u1",
        "conversation_id": "c1",
        "title": "T",
        "messages": [{"role": "user", "content": "hi"}],
        "timestamp": ts,
    }
    assert client.post("/api/save_conversation", json=body).json()["success"] is True
    convs = client.get("/api/get_conversations", params={"user_id": "u1"}).json()[
        "conversations"
    ]
    assert len(convs) == 1 and convs[0]["title"] == "T"

    assert client.post(
        "/api/delete_conversation",
        json={"user_id": "u1", "conversation_id": "c1"},
    ).json() == {"success": True}
    assert client.post(
        "/api/delete_conversation",
        json={"user_id": "u1", "conversation_id": "c1"},
    ).json()["success"] is False


def test_conversations_sorted_desc(client, fake_db):
    for cid, ts in (("old", 1000), ("new", 2000)):
        client.post(
            "/api/save_conversation",
            json={
                "user_id": "u9",
                "conversation_id": cid,
                "title": cid,
                "messages": [],
                "timestamp": ts,
            },
        )
    convs = client.get("/api/get_conversations", params={"user_id": "u9"}).json()[
        "conversations"
    ]
    assert [c["conversation_id"] for c in convs] == ["new", "old"]


# ---------------- rag ----------------


def test_upload_rejects_non_pdf(client):
    r = client.post(
        "/api/upload_pdf",
        data={"user_id": "u1"},
        files={"file": ("notes.txt", b"hello", "text/plain")},
    )
    assert r.json()["success"] is False


def test_upload_maps_ingest_errors(client, monkeypatch):
    def _boom(*args, **kwargs):
        raise ValueError("too big")

    monkeypatch.setattr(rag_service, "ingest_pdf", _boom)
    r = client.post(
        "/api/upload_pdf",
        data={"user_id": "u1"},
        files={"file": ("d.pdf", b"%PDF", "application/pdf")},
    )
    assert r.json() == {"success": False, "pdf_id": None, "chunks": 0, "error": "too big"}


def test_query_list_health_empty(client):
    assert client.post(
        "/api/query_rag", data={"user_id": "ghost-xyz", "query": "hi"}
    ).json()["results"] == []
    assert client.get("/api/list_chunks", params={"user_id": "ghost-xyz"}).json()[
        "count"
    ] == 0
    assert client.get("/api/vector_health", params={"user_id": "ghost-xyz"}).json()[
        "status"
    ] == "empty"
