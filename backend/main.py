from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Literal
from services.groq_service import get_groq_response

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
    role: Literal["user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

@app.post("/ask")
def ask_question(chat: ChatRequest):
    try:
        response = get_groq_response([msg.dict() for msg in chat.messages])
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))