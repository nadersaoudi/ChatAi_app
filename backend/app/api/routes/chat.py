"""Chat completions + model listing."""

from fastapi import APIRouter, HTTPException

from app.api.deps import handle_service_errors
from app.core.logging import get_logger
from app.schemas.chat import ChatRequest, ChatResponse, ModelListResponse, ModelOption
from app.services import ai_service
from app.core.config import settings

logger = get_logger(__name__)
router = APIRouter(tags=["chat"])


@router.get("/api/models", response_model=ModelListResponse)
def list_models() -> ModelListResponse:
    options = ai_service.available_models()
    return ModelListResponse(
        models=[ModelOption(**opt) for opt in options],
        default=settings.groq_model,
    )


@router.post("/ask", response_model=ChatResponse)
@handle_service_errors("ask")
async def ask_question(chat: ChatRequest) -> ChatResponse:
    logger.info("Chat request with %d message(s)", len(chat.messages))
    if chat.model:
        allowed = {opt["id"] for opt in ai_service.available_models()}
        if chat.model not in allowed:
            raise HTTPException(
                status_code=400,
                detail=f"Unknown model {chat.model!r}. See GET /api/models.",
            )
    reply, model = await ai_service.complete(
        [m.model_dump() for m in chat.messages], model=chat.model
    )
    return ChatResponse(response=reply, model=model)
