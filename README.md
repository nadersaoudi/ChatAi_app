# Codenix — AI Chat App

Full-stack AI chat app: a **Next.js + Clerk** frontend and a **FastAPI** backend
powered by **Groq** (chat), **MongoDB** (users + conversation history) and
**FAISS** (per-user PDF retrieval / RAG).

## Features

- Streaming-fast chat with code highlighting and conversation history
- Chat with your own PDFs (upload → indexed → answers grounded in your docs)
- Per-user workspaces behind Clerk authentication
- Resilient AI layer: configurable model + automatic fallback chain, so a
  retired model ID can never take the app down with a bare 500 again
- Dual-theme UI (oklch tokens, dark + light) with landing page, dashboard,
  suggestion starters

## Repository layout

```text
.
├── README.md            # this file — overview + quickstart
├── backend/             # FastAPI API (see backend/README.md)
│   ├── main.py          # thin uvicorn entry: `uvicorn main:app`
│   └── app/
│       ├── main.py      # app factory (CORS + routers)
│       ├── core/        # env config, logging
│       ├── schemas/     # pydantic request/response models
│       ├── api/routes/  # chat, conversations, rag, health (thin HTTP layer)
│       └── services/    # ai_service, mongo_service, rag_service
└── frontend/            # Next.js app (see frontend/README.md)
    ├── app/             # (marketing) landing · (dashboard) chat+sign-in (auth code-split)
    ├── components/      # chat UI + shared layout brand
    ├── hooks/           # useChat, useConversationHistory, useTheme, ...
    ├── lib/             # config, types, typed API client, message helpers
    └── layouts/         # static site header + footer (Clerk-free)
```

## Quickstart

Prerequisites: Python 3.12+, Node 18+, a Groq API key, a MongoDB connection
string, and Clerk keys. Each side documents its own setup in detail —
`backend/README.md` and `frontend/README.md`.

```bash
# 1) Backend → http://localhost:8000 (health: /health)
cd backend
cp .env.example .env        # then fill in GROQ_API_KEY, MONGO_URI, ...
pip install -r requirements.txt
uvicorn main:app --reload

# 2) Frontend → http://localhost:3000
cd frontend
cp .env.example .env.local  # then fill in Clerk keys (and API URL if needed)
npm install
npm run dev
```

Sign in on the landing page, open the dashboard, and start chatting. Upload a
PDF with the paperclip button to ask questions about its content.

## How it fits together

```text
Browser (Next.js) ──REST/JSON──▶ FastAPI ──▶ Groq chat completions
        │                            ├──────▶ MongoDB (users, conversations)
        │                            └──────▶ FAISS per-user index (PDF chunks)
        └─ Clerk session (client-side guards; auth JS loads only in dashboard)
```

- Chat: frontend sends the message history to `POST /ask`, shows the reply,
  then persists the conversation via `POST /api/save_conversation`.
- RAG: `POST /api/upload_pdf` chunks a PDF into the user's FAISS index;
  before each chat call the frontend fetches relevant chunks via
  `POST /api/query_rag` and the backend receives them as a system prompt.
- Failure bubbles (`❌ …`) are UI-only on both sides: they are stripped before
  history is sent to the model or persisted, so one failure can never poison
  later requests.

## CI/CD pipeline (`.github/workflows/ci.yml`)

```text
push / PR
 ├─ backend:   pip install → pytest (30 tests)
 ├─ frontend:  npm ci → tsc → eslint → vitest (26) → next build
 ├─ sonar:     SonarQube scan (needs both above green)
 └─ loadtest-10k (main pushes + manual dispatch only):
     backend ×2 workers → Locust 10k users, 8 min, infra endpoints
     → report.html + CSV uploaded as Actions artifacts
```

Manual 10k run with custom size: Actions → CI → Run workflow → set
`users` / `duration`. Results download from the run's Artifacts
(`loadtest-10k-results`: `report.html` + `load-*.csv`).

### Required GitHub secrets (repo → Settings → Secrets → Actions)

| Secret | Used by | Notes |
|---|---|---|
| `SONAR_TOKEN` | sonar | User token (SonarQube → My Account → Security) |
| `SONAR_HOST_URL` | sonar | e.g. your SonarQube server URL |
| `MONGO_URI` | loadtest-10k | Atlas must allow CI egress IPs (or `0.0.0.0/0` for tests) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | frontend build | Test keys are fine |
| `CLERK_SECRET_KEY` | frontend build | Required to prerender dashboard/sign-in |
| `NEXT_PUBLIC_API_URL` | frontend build | Backend URL baked into the build (optional) |

`GROQ_API_KEY` is intentionally **not** needed: the 10k run uses
`--exclude-tags ai` (no Groq calls, no quota burn). For an AI-inclusive soak,
run Locust locally with your key (see backend README).

### Same pipeline locally (your SonarQube on localhost:9000)

```bash
# 1) backend tests
cd backend && pip install -r requirements.txt -r requirements-test.txt && python -m pytest -q
# 2) frontend build + tests
cd frontend && npm ci && npx tsc --noEmit && npm run lint && npm test && npm run build
# 3) Sonar scan (token from http://localhost:9000 → My Account → Security)
sonar-scanner -Dsonar.projectKey=codenix -Dsonar.host.url=http://localhost:9000 -Dsonar.token=YOUR_TOKEN
# 4) 10k load test (backend running with runbook flags)
uvicorn main:app --workers 4 --limit-concurrency 2000
locust -f loadtest/locustfile.py --host http://localhost:8000 \
  --headless -u 10000 -r 500 -t 8m --exclude-tags ai \
  --csv results/load --html results/report.html
# open results/report.html for charts + percentiles
```

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| `/ask` returns 502 with a model message | Key can't access the model — set `GROQ_MODEL` in `backend/.env` (see backend README) |
| `/ask` 503 "GROQ_API_KEY is not set" | `backend/.env` missing or backend not restarted after editing it |
| Mongo 503 "Cannot reach MongoDB" | Wrong `MONGO_URI` or IP not allow-listed in Atlas |
| Dashboard shows sign-in loop | Clerk keys missing in `frontend/.env.local` |
| Endless `store_user` / `get_conversations` calls | Fixed: effect deps are value-stable; update to latest frontend code |
