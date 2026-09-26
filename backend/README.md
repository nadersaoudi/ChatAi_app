# Codenix Backend — FastAPI API

Chat completions (Groq), user + conversation persistence (MongoDB) and
per-user PDF retrieval (FAISS). Thin HTTP layer over a service layer:

```text
backend/
├── main.py            # thin uvicorn entry (re-exports the app)
├── requirements.txt   # app deps (locust lives in requirements-loadtest.txt)
├── .env.example       # copy to .env and fill in
├── loadtest/
│   └── locustfile.py  # 1000-user load test (see Load testing)
└── app/
    ├── main.py        # create_app(): CORS + router wiring
    ├── core/
    │   ├── config.py  # all env settings in one dataclass (never crashes import)
    │   └── logging.py # shared logger
    ├── schemas/       # chat.py, conversations.py, rag.py (pydantic models)
    ├── api/
    │   ├── deps.py    # handle_service_errors: domain errors → HTTP codes
    │   └── routes/    # chat.py, conversations.py, rag.py, health.py
    └── services/
        ├── ai_service.py    # Groq client, model fallback chain, history sanitizing
        ├── mongo_service.py # lazy Mongo client (boots even if DB is down)
        └── rag_service.py   # PDF ingest + FAISS per-user indexes
```

## Setup

```bash
cd backend
cp .env.example .env        # fill in the values below
pip install -r requirements.txt
uvicorn main:app --reload   # http://localhost:8000, docs at /docs
```

Interactive API docs (Swagger UI at `/docs`, ReDoc at `/redoc`,
machine schema at `/openapi.json` — 11 paths, tags: chat, conversations,
rag, health; title `Codenix API v1.0.0`).

## Testing

```bash
pip install -r requirements-test.txt
pytest   # 30 tests: pytest.ini (testpaths, asyncio auto mode)
```

- `tests/test_ai_service.py` — history sanitizing, model labels/order,
  fallback chain, auth/rate-limit mapping, missing-key guard (Groq client
  always faked — no network, no key needed).
- `tests/test_rag_service.py` — caption extraction (EN/FR), cited blocks,
  image counting, index paths, upload validation.
- `tests/test_api.py` — routes with fake Mongo collections: `/ask`
  (200/400/422/502/503), user + conversation round-trip, history ordering,
  upload/query/chunks/health edge cases.

## Environment variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `GROQ_API_KEY` | yes | — | Groq API key |
| `GROQ_MODEL` | no | `openai/gpt-oss-20b` | Primary chat model (must be accessible for the key) |
| `GROQ_FALLBACK_MODELS` | no | `llama-3.1-8b-instant,meta-llama/llama-4-scout-17b-16e-instruct,qwen/qwen3-32b,openai/gpt-oss-120b` | Tried in order when the primary is unavailable |
| `GROQ_TIMEOUT_SECONDS` | no | `60` | Provider HTTP timeout |
| `GROQ_MAX_TOKENS` | no | `4096` | Max completion tokens (reasoning models need headroom; 1024 truncated long answers) |
| `MONGO_URI` | yes | — | MongoDB connection string |
| `MONGO_DB_NAME` | no | `chatai_app` | Database name |
| `FAISS_INDEX_PATH` | no | _(empty)_ | Base dir for per-user FAISS indexes; empty keeps the historical `faiss_index_<user_id>` layout next to `backend/` |
| `CORS_ORIGINS` | no | `http://localhost:3000` | Comma-separated allowed origins |
| `MAX_HISTORY_MESSAGES` | no | `50` | Cap on history sent to the model |
| `MAX_PDF_MB` | no | `20` | Upload size limit |

## API reference

| Method + path | Body | Returns |
|---|---|---|
| `GET /health` | — | `{status, groq_configured, groq_model, mongo_configured}` |
| `GET /api/models` | — | `{models: [{id, label}], default}` — switchable models (primary + fallbacks) |
| `POST /ask` | `{messages: [{role, content}], model?}` | `{response, model}` — optional model override (allow-listed, tried first, fallback still applies); 502 with `detail` when the provider fails |
| `POST /api/store_user` | `{user_id, email, name}` | `{success, matched}` (upsert) |
| `POST /api/save_conversation` | `{user_id, conversation_id, title, messages, timestamp}` | `{success, matched}` (upsert) |
| `GET /api/get_conversations?user_id=…` | — | `{conversations: [...]}` newest first |
| `POST /api/delete_conversation` | `{user_id, conversation_id}` | `{success}` |
| `POST /api/upload_pdf` | form: `user_id`, `file` (.pdf) | `{success, pdf_id, chunks}` or `{success: false, error}` |
| `POST /api/query_rag` | form: `user_id`, `query` | `{results: [...]}` (empty + `error` when nothing indexed) |
| `GET /api/list_chunks?user_id=…&pdf_id=…` | — | `{chunks, count}` (debug) |
| `GET /api/vector_health?user_id=…` | — | on-disk FAISS index status (debug) |

Error mapping: missing/unreachable dependencies → **503**, provider failures
(auth, rate limit, retired model, network) → **502** with the reason in
`detail`, unexpected bugs → **500** with traceback in the server log.

## Design notes

- **Model fallback:** `ai_service.complete()` tries the requested model first
  (if any), then `GROQ_MODEL`, then each fallback on `model_not_found`, so a
  decommissioned model ID degrades instead of 500ing. This was the root cause
  of the original `/ask` outage (hard-coded `llama-3.3-70b-versatile`).
  `POST /ask` accepts an optional `model` (must be a `GET /api/models` id,
  else 400); the effectively used model is returned in the response.
- **History sanitizing:** empty parts and `❌` UI error bubbles are stripped
  and history is capped before every provider call; requests with no user turn
  are rejected with a clear error.
- **FAISS isolation:** each user gets `faiss_index_<user_id>/` (under
  `FAISS_INDEX_PATH` when set). Re-uploading replaces only that user's index.
  Embedding model (`all-MiniLM-L6-v2`) loads lazily on first RAG use.
- **Answer-grade chunks:** every chunk carries `page_num` (1-indexed),
  `captions` (Figure/Table/UML caption lines detected per page, EN+FR) and
  `figures` (embedded-image count via pypdf). Retrieval returns cited blocks
  (`[source — p. N]` + figure notes, best-score first, ~1800 chars max) so
  answers can reference exact pages and diagrams.
- **Mongo collections:** `users`, `conversations`. The client pings on first
  use with a 5s selection timeout so outages surface fast as 503s.
- **Under-load design (post-1000-user test):**
  - `POST /ask` is `async` on a shared `AsyncGroq` client — 1000 concurrent
    chats multiplex on the event loop instead of queuing on FastAPI's
    ~40-thread pool (the sync client was the #1 bottleneck).
  - DB reachability is re-pinged at most every 30s (`_ensure_reachable`),
    not on every request (that doubled Mongo traffic).
  - Hot paths are indexed at startup (`ensure_indexes`, idempotent):
    `users(user_id!)`, `conversations(user_id, timestamp↓)`.
  - FAISS indexes are cached in memory, invalidated by file mtime — no disk
    reload + re-embedding on every `query_rag`.
  - `GZipMiddleware` (≥1000 bytes) compresses big histories.

## Client flows (no backend change needed — sequence contract)

- **Attach-then-send (PDF + message together):** the frontend uploads the
  pending file first (`POST /api/upload_pdf`, progress tracked client-side
  via XHR since `fetch` can't report upload progress), then immediately calls
  `POST /api/query_rag` with the message text — the fresh chunks are returned
  because ingest commits before responding — and finally `POST /ask` with the
  chunks as a system prompt. One user message can therefore reference a PDF
  attached seconds earlier (e.g. a CV + "is my CV good?").
  Note: each upload *replaces* that user's FAISS index (single active
  document set per user).
- **Ask/Agent modes:** frontend-only. Agent mode prepends an instruction to
  the same system prompt (`withRagContext(..., systemExtra)`); the backend
  treats every request identically — no endpoint or schema change.

## Load testing (1000 simultaneous users)

Locust simulates full user sessions against a running backend: register →
chat (`POST /ask`, tagged `ai`) → save/list history (`infra`) → health.
Histories stay short so token usage is bounded on long runs.

```bash
cd backend
pip install -r requirements-loadtest.txt
# UI mode: open http://localhost:8089, set Users = 1000, spawn 50/s
locust -f loadtest/locustfile.py --host http://localhost:8000
# Headless 5-minute run:
locust -f loadtest/locustfile.py --host http://localhost:8000 \
  --headless -u 1000 -r 50 -t 5m
# Infra only (skips Groq calls — pure FastAPI + Mongo numbers):
locust -f loadtest/locustfile.py --host http://localhost:8000 \
  --headless -u 1000 -r 50 -t 5m --exclude-tags ai
```

Read the results like this: `infra` tasks show what *your* code handles
(p95 latency, failures); `ai` tasks additionally show the *provider* cap —
HTTP 429s on a free Groq key are expected and counted as provider limits,
not app failures (the script marks them successful for that reason).
If `/ask` 429s early, lower `-u` or upgrade the key; the app itself
degrades via 502 + model fallback instead of crashing.

For production runs serve with multiple workers
(`uvicorn main:app --workers 4`) and repeat the test.

### Windows runbook: `ValueError: too many file descriptors in select()`

If a worker dies with this during the 1000-user run, it is a **Windows OS
cap, not an app bug**: the asyncio selector loop supports max ~512 sockets
per process, and 1000 keep-alive connections (+ Mongo pool sockets) blow
past it. Linux (epoll) has no such cap. On Windows, run the backend so no
single process can cross it:

```bash
uvicorn main:app --workers 4 --limit-concurrency 350 --timeout-keep-alive 2
```

- `--workers 4` spreads connections across processes (each with its own
  512-FD budget; Windows accept-balancing is uneven, so workers alone are
  not a guarantee).
- `--limit-concurrency 350` caps in-flight connections per worker — excess
  gets an instant HTTP 503 instead of killing the worker. 503s under extreme
  load are the *honest* measurement of saturation.
- `--timeout-keep-alive 2` recycles idle keep-alive sockets faster, keeping
  the steady-state FD count down.
- The Mongo pool is already capped (`maxPoolSize=50` in `mongo_service.py`)
  so DB sockets can't eat the FD budget.

Ramp gradually (`-r 25`, watch worker logs) instead of jumping straight to
1000. For a true 1000-concurrent soak, prefer Linux/Docker for the backend.

## Troubleshooting

- `GET /health` shows `groq_configured: false` → `.env` not loaded; check the
  file name/location and restart uvicorn (env is read at startup).
- `401 / invalid_api_key` in 502 detail → rotate `GROQ_API_KEY`.
- `429` in 502 detail → Groq rate limit; wait and retry.
- First PDF upload/query is slow → one-time embedding-model download; later
  calls reuse the local cache.
- **Upload kills the service on small instances (OOM)** → first RAG use loads
  torch + transformers + the embedding model (RAM spike). Render dashboard →
  Metrics → Memory pegged at the limit, or logs with `Out of memory` / exit
  137 / restart loop = OOM confirmed. Fix: bigger instance (Standard 2GB+),
  or keep chat-only on small RAM. `GET /` noise (`404`) from port scanners
  is benign — the root route now answers service info.
