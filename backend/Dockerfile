# Codenix backend — production-ish image ( slim, no dev deps ).
FROM python:3.13-slim

# Silence pip's root-user warning (containers run as root by design).
ENV PIP_ROOT_USER_ACTION=ignore
# HuggingFace cache inside the image (baked at build, see below).
ENV HF_HOME=/code/.cache/huggingface

WORKDIR /code

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the embedding model at BUILD time, so the first PDF upload
# never stalls on a ~90MB download behind a proxy timeout (which browsers
# misreport as a CORS error) — it only pays the RAM load instead.
RUN python -c "from langchain_huggingface import HuggingFaceEmbeddings; HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')"

COPY app ./app
COPY main.py ./

EXPOSE 8000

# Render/Railway inject $PORT; default 8000 locally.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
