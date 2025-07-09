import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("MONGO_DB_NAME", "chatai_app")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_users_collection():
    return db["users"]

def get_conversations_collection():
    return db["conversations"]

def get_pdf_chunks_collection():
    return db["pdf_chunks"] 