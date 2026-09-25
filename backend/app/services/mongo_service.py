"""MongoDB access. Lazy client so the app boots even when the DB is down."""

from __future__ import annotations

import time
from functools import lru_cache

from pymongo import ASCENDING, DESCENDING, MongoClient
from pymongo.collection import Collection
from pymongo.errors import PyMongoError

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

# Reachability re-check interval: keeps the 503-on-outage guarantee without
# paying a ping round-trip on every single request (that doubled DB traffic).
_PING_TTL_SECONDS = 30.0
_last_ping_ok: float = 0.0


class DatabaseUnavailableError(Exception):
    """Raised when MongoDB cannot be reached or is not configured."""


@lru_cache(maxsize=1)
def _get_client() -> MongoClient:
    if not settings.mongo_uri:
        raise DatabaseUnavailableError(
            "MONGO_URI is not set. Add it to backend/.env and restart."
        )
    client = MongoClient(
        settings.mongo_uri,
        serverSelectionTimeoutMS=5000,
        # Bounded pool: every pooled connection is a socket in THIS process.
        # On Windows the asyncio selector caps at ~512 FDs per process, so an
        # unbounded pool + hundreds of HTTP keep-alives = select() crash.
        maxPoolSize=50,
    )
    try:
        client.admin.command("ping")
    except PyMongoError as exc:
        raise DatabaseUnavailableError(f"Cannot reach MongoDB: {exc}") from exc
    return client


def _ensure_reachable(client: MongoClient) -> None:
    global _last_ping_ok
    if time.monotonic() - _last_ping_ok < _PING_TTL_SECONDS:
        return
    try:
        client.admin.command("ping")
        _last_ping_ok = time.monotonic()
    except PyMongoError as exc:
        raise DatabaseUnavailableError(f"Cannot reach MongoDB: {exc}") from exc


def _collection(name: str) -> Collection:
    try:
        client = _get_client()
        _ensure_reachable(client)
        return client[settings.mongo_db_name][name]
    except DatabaseUnavailableError:
        raise
    except PyMongoError as exc:
        raise DatabaseUnavailableError(f"Cannot reach MongoDB: {exc}") from exc


def ensure_indexes() -> None:
    """Idempotent indexes for the hot query paths. Safe to call at startup."""
    try:
        client = _get_client()
    except DatabaseUnavailableError as exc:
        logger.warning("Skipping index creation: %s", exc)
        return
    db = client[settings.mongo_db_name]
    db["users"].create_index("user_id", unique=True)
    # get_conversations filters by user_id and sorts by timestamp desc.
    db["conversations"].create_index(
        [("user_id", ASCENDING), ("timestamp", DESCENDING)]
    )
    logger.info("Mongo indexes ensured.")


def get_users_collection() -> Collection:
    return _collection("users")


def get_conversations_collection() -> Collection:
    return _collection("conversations")
