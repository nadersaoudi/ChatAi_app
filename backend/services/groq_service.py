from groq import Groq
import os
from dotenv import load_dotenv
from typing import List, Dict

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def get_groq_response(messages: List[Dict[str, str]]) -> str:
 
    chat_completion = client.chat.completions.create(
        messages=messages,
        model="llama-3.3-70b-versatile",
    )
    return chat_completion.choices[0].message.content