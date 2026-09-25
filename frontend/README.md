# Codenix Frontend — Next.js App

Dual-theme UI (oklch tokens, dark + light): marketing landing page +
sidebar history, code highlighting, PDF upload and suggestion starters.

```text
frontend/
├── app/
│   ├── layout.tsx          # root layout (fonts, theme boot, NO auth bundle)
│   ├── (marketing)/page.tsx  # landing page (hero, features, how-it-works, FAQ, CTA)
│   ├── (dashboard)/        # route group WITH ClerkProvider (auth code-split):
│   │   ├── layout.tsx      # Clerk boundary — clerk-js loads only here
│   │   ├── dashboard/      # chat (page.tsx + loading.tsx)
│   │   └── sign-in/[[...sign-in]]/  # minimal centered sign-in
│   ├── icon.svg            # Codenix tab icon (favicon, auto-served by Next.js)
│   ├── globals.css         # dual-theme tokens + semantic classes (see Theming)
├── components/
│   ├── chat/               # ChatHeader (sidebar/width/theme/search controls),
│   │                       # ConversationSidebar (collapsible, search entry),
│   │                       # ConfirmDialog, SearchDialog (Ctrl+K palette),
│   │                       # ChatList, ChatMessage, StreamingText,
│   │                       # renderWithCode (CodeBlock + copy button),
│   │                       # ChatInput (Qoder-style composer card), ModeSwitch,
│   │                       # (Ask/Agent), ModelSwitch (model picker),
│   │                       # AttachPdfButton, ChatSkeleton
│   └── layout/             # Logo (gradient brand), ThemeToggle, VersionBadge
│                          # (v1.0 chip from APP_VERSION in lib/config.ts)
├── hooks/
│   ├── useChat.ts                # messages/input/send (+sendText), RAG, errors,
│   │                             # typewriter reveal state
│   ├── useConversationHistory.ts # sidebar list (+loading), select/new/delete, persistence
│   ├── usePdfAttachment.ts       # pending-PDF chip + upload with 0-100% progress
│   └── useTheme.ts               # dark/light theme, persisted (codenix-theme)
├── lib/
│   ├── config.ts    # API_BASE_URL, limits (env-driven)
│   ├── api.ts       # typed backend client; ApiError carries backend `detail`;
│   │                 # uploadPdfWithProgress (XHR) for live upload progress
│   ├── types.ts     # ChatMessage, Conversation (+DTO mapper), ChatMode
│   └── messages.ts  # pure helpers: payload hygiene, AGENT_SYSTEM, answer rules,
│                     # titles, timestamps
├── layouts/Header.tsx + Footer.tsx  # static site chrome (landing, Clerk-free)
```

## Setup

```bash
cd frontend
cp .env.example .env.local   # fill in the values below
npm install
npm run dev                  # http://localhost:3000 (Turbopack)
```

| Script | Purpose |
|---|---|
| `npm run dev` | dev server with HMR |
| `npm run build` | production build |
| `npm start` | serve the production build |
| `npm run lint` | eslint |
| `npm test` | unit tests once (Vitest) |
| `npm run test:watch` | unit tests in watch mode |
| `npm run test:e2e` | end-to-end tests (Playwright, Chromium) |

## Testing

- **Unit** (`tests/`, Vitest + jsdom + Testing Library, `vitest.config.ts`):
  `lib/messages` (payload hygiene, titles, time), `lib/api` (mocked fetch,
  `ApiError` details), `usePdfAttachment` (validation), `ModeSwitch` /
  `SearchDialog` / `ConfirmDialog` (render + interaction + keyboard).
- **E2E** (`e2e/`, Playwright, `playwright.config.ts`, dev server auto-started
  on :3009): landing hero/CTAs/theme-persistence/FAQ/features run
  **without** Clerk keys; dashboard redirect + sign-in render skip unless
  `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set (provide via `.env.local` or CI
  secrets). First run needs `npx playwright install chromium`.

## Environment variables (`.env.local`)

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | yes | — | Clerk publishable key |
| `CLERK_SECRET_KEY` | yes | — | Clerk secret key |
| `NEXT_PUBLIC_API_URL` | no | `http://localhost:3000`→ backend at `http://localhost:8000` | Backend base URL |

The backend must be running (see `backend/README.md`); the dashboard calls it
directly from the browser, so CORS must allow the frontend origin.

## Architecture & data flow

- **Auth:** `ClerkProvider` lives in `app/(dashboard)/layout.tsx`, so the
  landing page ships zero auth JS. `SignedIn`/`SignedOut` gate the dashboard
  (`RedirectToSignIn` when signed out). The Clerk `user.id` is the backend's
  `user_id` everywhere. No `middleware.ts` — route guards are client-side.
  The `(dashboard)` group is `force-dynamic` (per-user routes are never
  prerendered), so `next build` succeeds without Clerk keys present —
  keys are still required at runtime.
- **State:** `useConversationHistory` owns the sidebar (register user → load
  history once per login; optimistic track/select/delete; `loading` drives
  skeletons). `useChat` owns the transcript (send → best-effort RAG context →
  `POST /ask` → persist clean history; `streamIndex`/`revealing` drive the
  typewriter reveal). `dashboard/page.tsx` only wires them to presentational
  components.
- **Attach-then-send (PDF + message together):** picking a file only validates
  it and shows a pending chip (`usePdfAttachment` — nothing is uploaded yet).
  On send, the page uploads the pending file first via
  `uploadPdfWithProgress` (XHR, 0-100% ring around the attach icon), then sends
  the message, so the fresh chunks are RAG context for that very reply
  (e.g. attach your CV + "is my CV good?"). Switching chats clears the pending
  file. The old `PdfUploadControl` (upload-on-select box) was removed.
- **Reply reveal:** fresh assistant replies render through `StreamingText`
  (typewriter, click to skip) with the list pinned to the bottom while
  revealing; `animate-typing-dot` dots show while waiting for the provider.
- **Answer quality (prompt + rendering):** every request carries house rules
  (`withRagContext`) — same-language answers, headings/lists/tables, `[p. N]`
  citations with named figures, element-by-element UML explanations, complete
  fenced code, one-line summary for long answers. `renderWithCode` renders
  markdown (bold/italic/code, headings, bullets, numbered lists, tables,
  quotes) with copy-button code blocks, so results read clearly.
- **Loading states:** `ChatSkeleton` + sidebar skeleton rows while history
  loads after login, and `(dashboard)/dashboard/loading.tsx` as the route-level
  fallback during navigation. Every remote action (send, upload, delete) has
  its own inline indicator — no dead clicks.
- **History hygiene (important):** failure bubbles are UI-only (`error: true`,
  `❌` prefix). They are rendered in red, shown with the real backend message,
  but *excluded* from API payloads (`toApiPayload`/`withRagContext`) and from
  what gets persisted — one failure can never poison later requests. Effect
  dependencies are primitives so login fires exactly one `store_user` + one
  `get_conversations`.
- **Theming (user palette, dark + light):** oklch design tokens in
  `globals.css` (`:root` light + `.dark` override — card, primary,
  secondary, muted, destructive, sidebar, …). `useTheme` owns the mode
  (`.dark` class on `<html>`, persisted as `codenix-theme`, default dark;
  a boot script in `layout.tsx` applies it before first paint — no flash,
  no hydration mismatch since stored values are adopted post-hydration).
  Components use semantic classes (`.app-bg`, `.surface`, `.input-box`,
  `.bubble-user/assistant/error`, `.chip`, `.btn-gradient`,
  `.brand-gradient`, …) inside `@layer components` so Tailwind
  `hover:`/`focus:` utilities keep working. Brand mark is `Logo` (chat
  bubble + spark). To restyle: change the `:root`/`.dark` tokens —
  components need no edits.
- **Composer (Qoder-style):** `ChatInput` is a card — attachment chips on
  top, borderless textarea, bottom toolbar with attach button, `ModeSwitch`
  (**Ask** = plain Q&A, **Agent** = prepends `AGENT_SYSTEM` instruction so
  replies plan step-by-step then deliver code), `Auto` model badge and a
  circular send button. Mode persists as `codenix-mode`. Agent behavior is
  prompt-only — no backend change.
- **Model switch:** `ModelSwitch` dropdown in the composer toolbar lists
  `GET /api/models` (`Auto` = server default + fallback, persisted as
  `codenix-model`). The choice is sent as `model` on every `/ask`; the
  header badge shows the active label. Unknown ids are rejected by the
  backend (400).
- **Readable responses:** assistant bubbles are full-width (`flex-1`, roomy
  padding) so tables and code breathe edge-to-edge; user bubbles stay compact.
- **Workspace controls (persisted):** sidebar open/close toggle
  (`codenix-sidebar`), chat width cycle narrow → wide → full
  (`codenix-width`), both in `ChatHeader`. Conversation search lives in
  `SearchDialog`: recent chats listed, live filter by title or message text
  (with match snippet), ↑↓ + Enter + Esc keyboard support — opened from the
  sidebar/header search buttons or anywhere via **Ctrl/⌘+K**. Destructive
  actions are gated by `ConfirmDialog` (popover/card tokens, overlay,
  Escape/backdrop to cancel, busy state) — deleting a conversation always
  asks first. Code blocks render a header with language label + copy button
  (`renderWithCode`).

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Sign-in loop / Clerk errors | keys missing in `.env.local`; restart `npm run dev` after adding |
| Chat shows backend error text | read it — it carries the backend `detail` (e.g. bad model, rate limit) |
| `Failed to fetch` on every call | backend down or `NEXT_PUBLIC_API_URL` wrong / CORS blocked |
| Empty conversation list after login | backend Mongo unreachable — check backend `/health` |
| `tsc`/`lint` failures after edits | run `npx tsc --noEmit`; API shapes live in `lib/api.ts` + `lib/types.ts` |

## Performance notes

- Code highlighting uses the Prism **Light** build with ~14 registered
  languages (`renderWithCode.tsx`) instead of the full 500KB+ bundle.
- `SearchDialog`/`ConfirmDialog` load via `next/dynamic` (`ssr: false`) —
  excluded from first paint. `ChatMessage` is memoized so typing doesn't
  re-render the transcript.
- `next.config.ts` sets `experimental.optimizePackageImports` for
  `react-icons`, `react-syntax-highlighter`, `@clerk/nextjs`.
- **Auth code-splitting:** `ClerkProvider` lives in `app/(dashboard)/layout.tsx`,
  so clerk-js (~300KB) loads only for dashboard/sign-in — the landing page
  ships zero auth JS. Route guards are client-side (`SignedIn` /
  `RedirectToSignIn`); no `middleware.ts` (a bare middleware only added Edge
  cost on every request with no protection logic).
- Measure on production only: `npm run build && npm start`, then Lighthouse
  (dev/Turbopack numbers are meaningless).
