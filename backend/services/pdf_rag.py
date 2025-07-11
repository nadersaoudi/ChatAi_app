# NOTE: Requires 'faiss-cpu' and 'langchain_community' packages. Install with:
# pip install faiss-cpu langchain_community
import os
import logging
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import pickle

def get_faiss_index_path(user_id):
    return os.getenv("FAISS_INDEX_PATH", f"faiss_index_{user_id}")

# Set up HuggingFace embeddings (no API key required)
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Helper to load or create FAISS index for a user
def load_faiss_index(user_id):
    index_path = get_faiss_index_path(user_id)
    if os.path.exists(index_path):
        try:
            return FAISS.load_local(
                index_path,
                embeddings,
                allow_dangerous_deserialization=True
            )
        except Exception as e:
            logging.error(f"[ERROR] Failed to load FAISS index for user {user_id}: {e}")
    return None

def save_faiss_index(faiss_index, user_id):
    index_path = get_faiss_index_path(user_id)
    faiss_index.save_local(index_path)


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
        # Remove old FAISS index for this user before creating a new one
        index_path = get_faiss_index_path(user_id)
        if os.path.exists(index_path):
            os.remove(index_path)
        faiss_index = FAISS.from_documents(chunks, embeddings)
        save_faiss_index(faiss_index, user_id)
        logging.info(f"[INFO] Stored {len(chunks)} chunks for user {user_id}, pdf_id {pdf_id}")
        if chunks:
            logging.info(f"[INFO] First chunk metadata: {chunks[0].metadata}")
        return len(chunks), [chunk.metadata for chunk in chunks[:1]], None
    except Exception as e:
        logging.error(f"[ERROR] process_and_store_pdf failed: {e}")
        return 0, [], str(e)


def query_rag(user_id, query, top_k=4):
    try:
        faiss_index = load_faiss_index(user_id)
        if faiss_index is None:
            logging.error(f"[ERROR] FAISS index not found for user {user_id}.")
            return [], "FAISS index not found."
        # Filter by user_id in metadata (should only be this user's docs)
        all_results = faiss_index.similarity_search_with_score(query, k=top_k*3)
        filtered = [doc for doc, score in all_results if doc.metadata.get("user_id") == user_id]
        filtered = filtered[:top_k]
        logging.info(f"[INFO] RAG query for user {user_id}: '{query}' returned {len(filtered)} results.")
        return [r.page_content for r in filtered], None
    except Exception as e:
        logging.error(f"[ERROR] query_rag failed: {e}")
        return [], str(e)


def list_chunks_for_user(user_id, pdf_id=None):
    faiss_index = load_faiss_index(user_id)
    if faiss_index is None:
        return []
    all_docs = faiss_index.docstore._dict.values()
    results = []
    for doc in all_docs:
        if doc.metadata.get("user_id") == user_id:
            if pdf_id is None or doc.metadata.get("pdf_id") == pdf_id:
                results.append({"metadata": doc.metadata})
    return results 