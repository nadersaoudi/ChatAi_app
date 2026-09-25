"""Chat-related request/response schemas."""

from typing import Literal

from pydantic import BaseModel, Field

Role = Literal["user", "assistant", "system"]


class Message(BaseModel):
    role: Role
    content: str = Field(min_length=1)


class ChatRequest(BaseModel):
    messages: list[Message] = Field(min_length=1)
    # Optional model override — must be one of GET /api/models ids.
    # Empty/omitted = server default (GROQ_MODEL) with automatic fallback.
    model: str | None = None


class ModelOption(BaseModel):
    id: str
    label: str


class ModelListResponse(BaseModel):
    models: list[ModelOption]
    default: str


class ChatResponse(BaseModel):
    response: str
    model: str
