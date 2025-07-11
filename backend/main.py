from fastapi import FastAPI, HTTPException, Query, UploadFile, File, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Literal, Any, Optional
from services.groq_service import get_groq_response
from services.mongo_util import get_users_collection, get_conversations_collection
from services.pdf_rag import process_and_store_pdf, query_rag, list_chunks_for_user
import uuid
import os
import tempfile
import logging

app = FastAPI()

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class UserIn(BaseModel):
    user_id: str
    email: str
    name: str

class ConversationIn(BaseModel):
    user_id: str
    conversation_id: str
    title: str
    messages: list[Any]
    timestamp: int

@app.post("/ask")
def ask_question(chat: ChatRequest):
    try:
        print("[DEBUG] Messages received by backend:", chat.messages)
        response = get_groq_response([msg.dict() for msg in chat.messages])
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/store_user")
def store_user(user: UserIn):
    users_col = get_users_collection()
    result = users_col.update_one(
        {"user_id": user.user_id},
        {"$set": {"email": user.email, "name": user.name}},
        upsert=True
    )
    return {"success": True, "matched_count": result.matched_count, "modified_count": result.modified_count}

@app.post("/api/save_conversation")
def save_conversation(conv: ConversationIn):
    conversations_col = get_conversations_collection()
    result = conversations_col.update_one(
        {"user_id": conv.user_id, "conversation_id": conv.conversation_id},
        {"$set": {
            "title": conv.title,
            "messages": conv.messages,
            "timestamp": conv.timestamp
        }},
        upsert=True
    )
    return {"success": True, "matched_count": result.matched_count, "modified_count": result.modified_count}

@app.get("/api/get_conversations")
def get_conversations(user_id: str = Query(...)):
    conversations_col = get_conversations_collection()
    conversations = list(conversations_col.find({"user_id": user_id}, {"_id": 0}))
    conversations.sort(key=lambda c: c.get("timestamp", 0), reverse=True)
    return {"conversations": conversations}

@app.post("/api/upload_pdf")
def upload_pdf(user_id: str = Form(...), file: UploadFile = File(...)):
    import os
    pdf_id = str(uuid.uuid4())
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(file.file.read())
            temp_path = tmp.name
        # Process and store
        num_chunks, chunk_meta, error = process_and_store_pdf(temp_path, user_id, pdf_id)
        os.remove(temp_path)
        if error:
            logging.error(f"[ERROR] upload_pdf failed: {error}")
            return {"success": False, "error": error, "chunks": num_chunks, "chunk_meta": chunk_meta}
        logging.info(f"[INFO] Uploaded PDF for user {user_id}, pdf_id {pdf_id}, chunks: {num_chunks}")
        return {"success": True, "pdf_id": pdf_id, "chunks": num_chunks, "chunk_meta": chunk_meta}
    except Exception as e:
        logging.error(f"[ERROR] upload_pdf failed: {e}")
        return {"success": False, "error": str(e)}

@app.post("/api/query_rag")
def rag_query(user_id: str = Form(...), query: str = Form(...)):
    try:
        logging.info(f"[INFO] RAG query for user {user_id}: {query}")
        results, error = query_rag(user_id, query)
        if error:
            logging.error(f"[ERROR] rag_query failed: {error}")
            return {"results": [], "error": error}
        logging.info(f"[INFO] RAG results: {results}")
        return {"results": results}
    except Exception as e:
        logging.error(f"[ERROR] rag_query failed: {e}")
        return {"results": [], "error": str(e)}

@app.get("/api/list_chunks")
def list_chunks(user_id: str, pdf_id: str = None):
    try:
        chunks = list_chunks_for_user(user_id, pdf_id)
        return {"chunks": chunks, "count": len(chunks)}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/vector_health")
def vector_health():
    try:
        from services.mongo_util import get_pdf_chunks_collection
        col = get_pdf_chunks_collection()
        count = col.count_documents({})
        # Check for vector index
        index_info = list(col.list_indexes())
        vector_index = None
        for idx in index_info:
            if idx.get('name') == 'vector_index' and any(f.get('type') == 'vector' for f in idx.get('fields', [])):
                vector_index = idx
                break
        if not vector_index:
            return {"status": "error", "error": "Vector index 'vector_index' is missing on 'embedding' field. Please create it in MongoDB Atlas.", "pdf_chunks_count": count, "indexes": index_info}
        return {"status": "ok", "pdf_chunks_count": count, "vector_index": vector_index}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.post("/api/delete_conversation")
def delete_conversation(
    user_id: str = Body(...),
    conversation_id: str = Body(...)
):
    conversations_col = get_conversations_collection()
    result = conversations_col.delete_one({"user_id": user_id, "conversation_id": conversation_id})
    if result.deleted_count == 1:
        return {"success": True}
    else:
        return {"success": False, "error": "Conversation not found or could not be deleted."}