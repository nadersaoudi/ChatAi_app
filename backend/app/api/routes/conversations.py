"""User + conversation persistence (MongoDB)."""

from fastapi import APIRouter, Query

from app.api.deps import handle_service_errors
from app.schemas.conversations import ConversationDeleteIn, ConversationIn, UserIn
from app.services import mongo_service

router = APIRouter()


@router.post("/api/store_user")
@handle_service_errors("store_user")
def store_user(user: UserIn) -> dict:
    col = mongo_service.get_users_collection()
    result = col.update_one(
        {"user_id": user.user_id},
        {"$set": {"email": user.email, "name": user.name}},
        upsert=True,
    )
    return {"success": True, "matched": result.matched_count}


@router.post("/api/save_conversation")
@handle_service_errors("save_conversation")
def save_conversation(conv: ConversationIn) -> dict:
    col = mongo_service.get_conversations_collection()
    result = col.update_one(
        {"user_id": conv.user_id, "conversation_id": conv.conversation_id},
        {
            "$set": {
                "title": conv.title,
                "messages": conv.messages,
                "timestamp": conv.timestamp,
            }
        },
        upsert=True,
    )
    return {"success": True, "matched": result.matched_count}


@router.get("/api/get_conversations")
@handle_service_errors("get_conversations")
def get_conversations(user_id: str = Query(...)) -> dict:
    col = mongo_service.get_conversations_collection()
    conversations = list(col.find({"user_id": user_id}, {"_id": 0}))
    conversations.sort(key=lambda c: c.get("timestamp", 0), reverse=True)
    return {"conversations": conversations}


@router.post("/api/delete_conversation")
@handle_service_errors("delete_conversation")
def delete_conversation(body: ConversationDeleteIn) -> dict:
    col = mongo_service.get_conversations_collection()
    result = col.delete_one(
        {"user_id": body.user_id, "conversation_id": body.conversation_id}
    )
    if result.deleted_count == 1:
        return {"success": True}
    return {"success": False, "error": "Conversation not found."}
