import os
import logging
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("MONGO_DB_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
# Set up HuggingFace embeddings (no API key required)
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Set up MongoDB vector store
vectorstore = MongoDBAtlasVectorSearch(
    collection=db["pdf_chunks"],
    embedding=embeddings,
    index_name="vector_index",  # You must create this index in Atlas
)

def process_and_store_pdf(file_path, user_id, pdf_id):
    try:
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        if not docs:
            logging.error(f"[ERROR] No documents loaded from PDF: {file_path}")
            return 0, [], "No documents loaded from PDF."
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = splitter.split_documents(docs)
        if not chunks:
            logging.error(f"[ERROR] No chunks created from PDF: {file_path}")
            return 0, [], "No chunks created from PDF."
        for i, chunk in enumerate(chunks):
            chunk.metadata["user_id"] = user_id
            chunk.metadata["pdf_id"] = pdf_id
            chunk.metadata["chunk_id"] = i
            chunk.metadata["original_text"] = getattr(chunk, 'text', getattr(chunk, 'page_content', ''))
            chunk.page_content = chunk.metadata["original_text"]
        try:
            vectorstore.add_documents(chunks)
            logging.info(f"[INFO] Stored {len(chunks)} chunks for user {user_id}, pdf_id {pdf_id}")
            if chunks:
                logging.info(f"[INFO] First chunk metadata: {chunks[0].metadata}")
        except Exception as ve:
            logging.error(f"[ERROR] Failed to add documents to vectorstore: {ve}")
            return 0, [], f"Vectorstore error: {ve}"
        return len(chunks), [chunk.metadata for chunk in chunks[:1]], None
    except Exception as e:
        logging.error(f"[ERROR] process_and_store_pdf failed: {e}")
        return 0, [], str(e)

def query_rag(user_id, query, top_k=4):
    try:
        filter = {"user_id": user_id}
        results = vectorstore.similarity_search(query, k=top_k, filter=filter)
        logging.info(f"[INFO] RAG query for user {user_id}: '{query}' returned {len(results)} results.")
        if not results:
            # Count chunks for this user for debug
            from services.mongo_util import get_pdf_chunks_collection
            col = get_pdf_chunks_collection()
            chunk_count = col.count_documents({"metadata.user_id": user_id})
            return [], f"No results found. Chunks for user: {chunk_count}, Query: {query}"
        return [r.page_content for r in results], None
    except Exception as e:
        logging.error(f"[ERROR] query_rag failed: {e}")
        return [], str(e)

def list_chunks_for_user(user_id, pdf_id=None):
    from services.mongo_util import get_pdf_chunks_collection
    col = get_pdf_chunks_collection()
    query = {"metadata.user_id": user_id}
    if pdf_id:
        query["metadata.pdf_id"] = pdf_id
    return list(col.find(query, {"_id": 0, "metadata": 1})) 