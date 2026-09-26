# Codenix backend — production-ish image ( slim, no dev deps ).
FROM python:3.13-slim

# Silence pip's root-user warning (containers run as root by design).
ENV PIP_ROOT_USER_ACTION=ignore

WORKDIR /code

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY main.py ./

EXPOSE 8000

# Render/Railway inject $PORT; default 8000 locally.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
