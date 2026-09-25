"""User and conversation schemas."""

from typing import Any

from pydantic import BaseModel


class UserIn(BaseModel):
    user_id: str
    email: str = ""
    name: str = ""


class ConversationIn(BaseModel):
    user_id: str
    conversation_id: str
    title: str = "New Chat"
    messages: list[Any] = []
    timestamp: int = 0


class ConversationDeleteIn(BaseModel):
    user_id: str
    conversation_id: str
