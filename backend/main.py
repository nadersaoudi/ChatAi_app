from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from services.groq_service import get_groq_response

app = FastAPI()

class Question(BaseModel):
    content: str

@app.post("/ask")
def ask_question(question: Question):
    try:
        response = get_groq_response(question.content)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))