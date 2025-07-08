from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from typing import List
import os

def load_and_split_pdf(file_path: str) -> List[Document]:
    """
    Load and split a PDF file into chunks
    
    Args:
        file_path: Path to the PDF file
        
    Returns:
        List of Document objects containing the chunked text
    """
    try:
        # Check if file exists
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"PDF file not found: {file_path}")
        
        # Load PDF
        loader = PyPDFLoader(file_path)
        pages = loader.load()
        
        # Check if pages were loaded
        if not pages:
            raise ValueError("No content found in PDF file")
        
        # Split documents into chunks
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
        
        chunks = splitter.split_documents(pages)
        
        # Add metadata to chunks
        for i, chunk in enumerate(chunks):
            chunk.metadata.update({
                "chunk_id": i,
                "source_file": os.path.basename(file_path),
                "total_chunks": len(chunks)
            })
        
        return chunks
        
    except Exception as e:
        raise Exception(f"Error processing PDF {file_path}: {str(e)}")

def validate_pdf_file(file_path: str) -> bool:
    """
    Validate if the file is a valid PDF
    
    Args:
        file_path: Path to the file
        
    Returns:
        Boolean indicating if file is valid PDF
    """
    try:
        if not os.path.exists(file_path):
            return False
        
        # Check file extension
        if not file_path.lower().endswith('.pdf'):
            return False
        
        # Try to load first page to validate
        loader = PyPDFLoader(file_path)
        pages = loader.load()
        
        return len(pages) > 0
        
    except Exception:
        return False