"""Shared fixtures: isolate stateful singletons between tests."""

import pytest


@pytest.fixture(autouse=True)
def _clean_state():
    from app.services import rag_service

    rag_service._index_cache.clear()
    yield
    rag_service._index_cache.clear()
