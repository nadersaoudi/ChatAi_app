import Link from "next/link";
import {
  FiArrowRight,
  FiCheck,
  FiClock,
  FiCode,
  FiFileText,
  FiLock,
  FiMessageSquare,
  FiZap,
} from "react-icons/fi";
import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import Logo from "@/components/layout/Logo";

/* ------------------------------ data ------------------------------ */

const FEATURES = [
  {
    icon: FiMessageSquare,
    title: "Smart conversations",
    text: "Natural, context-aware chat that remembers your thread and follows up like a real assistant.",
  },
  {
    icon: FiCode,
    title: "Code assistant",
    text: "Debugging, reviews, and explanations across languages — with clean syntax-highlighted snippets.",
  },
  {
    icon: FiFileText,
    title: "Chat with your PDFs",
    text: "Attach documents to your message and get answers grounded in their content.",
  },
  {
    icon: FiZap,
    title: "Blazing fast",
    text: "Served on Groq's LPUs for sub-second responses, even on long reasoning-heavy answers.",
  },
  {
    icon: FiClock,
    title: "History that sticks",
    text: "Every conversation is saved to your account. Pick up exactly where you left off, anytime.",
  },
  {
    icon: FiLock,
    title: "Private by design",
    text: "Your chats and documents are scoped to your account — sign in and everything is yours alone.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Sign in",
    text: "One click with Clerk. Your workspace and history are created instantly.",
  },
  {
    n: "02",
    title: "Ask or attach",
    text: "Type any question — or attach a PDF to send it with your message.",
  },
  {
    n: "03",
    title: "Get answers",
    text: "Animated replies with code highlighting, ready to copy and use.",
  },
];

const FAQS = [
  {
    q: "Is it free to use?",
    a: "Yes — sign in and start chatting right away. Usage is covered by the app's pooled Groq quota.",
  },
  {
    q: "Which AI model answers me?",
    a: "The backend uses current Groq-hosted open models (starting with GPT-OSS 20B) with automatic fallback, so answers keep working even when a model is retired.",
  },
  {
    q: "What happens to my PDFs?",
    a: "Attached PDFs are chunked and indexed per-user for retrieval. Only your account can query your documents.",
  },
];

const STATS = [
  { value: "<1s", label: "Median first reply" },
  { value: "20MB", label: "PDF upload limit" },
  { value: "∞", label: "Saved conversations" },
];

/* --------------------------- components --------------------------- */

function CtaButtons({ primary }: { primary: string }) {
  // Static link (no auth needed): signed-out visitors hitting /dashboard
  // are bounced through sign-in and land back on the dashboard.
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        href="/dashboard"
        className="btn-gradient group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-semibold shadow-xl"
      >
        {primary}
        <FiArrowRight className="transition-transform group-hover:translate-x-1" />
      </Link>
      <a
        href="#how-it-works"
        className="surface inline-flex items-center justify-center rounded-xl px-7 py-3.5 font-semibold transition-all hover:border-[var(--line-strong)]"
      >
        How it works
      </a>
    </div>
  );
}

function ChatPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[var(--accent)]/25 via-[var(--accent-2)]/15 to-[var(--accent)]/25 blur-2xl" />
      <div className="surface relative rounded-2xl p-5 shadow-2xl">
        <div className="mb-4 flex items-center gap-3 border-b border-[var(--line)] pb-4">
          <span className="brand-gradient rounded-xl p-2">
            <Logo />
          </span>
          <div>
            <p className="font-semibold">Codenix</p>
            <p className="flex items-center gap-1.5 text-xs text-[var(--accent)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />{" "}
              Online
            </p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="surface-2 max-w-[85%] rounded-2xl rounded-bl-sm p-3">
            Explain binary search in Python
          </div>
          <div className="surface-2 max-w-[92%] rounded-2xl rounded-bl-sm p-3">
            <p className="mb-2">
              Binary search halves the search space each step —{" "}
              <span className="font-semibold text-[var(--accent)]">
                O(log n)
              </span>{" "}
              time:
            </p>
            <pre className="overflow-x-auto rounded-lg bg-black/70 p-3 font-mono text-xs text-[var(--accent-2)]">
              {`def binary_search(a, x):\n    lo, hi = 0, len(a)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if a[mid] < x:\n            lo = mid + 1\n        else:\n            hi = mid\n    return lo`}
            </pre>
          </div>
          <div className="flex items-center gap-1.5 pl-1 pt-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 animate-typing-dot rounded-full bg-[var(--accent)]"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- page ------------------------------- */

export default function Home() {
  return (
    <div className="app-bg min-h-screen">
      <Header />

      {/* Hero */}
      <main className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="chip mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium">
              <FiZap /> Powered by Groq — answers in under a second
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your AI assistant for{" "}
              <span className="text-gradient">everything</span>
            </h1>
            <p className="text-dim mb-8 mt-5 max-w-lg text-lg leading-relaxed">
              Instant answers, code help, creative writing — plus attach your
              own PDFs to any message. Fast, private, and always in sync with
              your history.
            </p>
            <CtaButtons primary="Start chatting free" />
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-[var(--line)] pt-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="text-2xl font-bold">{s.value}</dt>
                  <dd className="text-faint mt-1 text-xs">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ChatPreview />
        </div>
      </main>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
            Features
          </p>
          <h2 className="text-3xl font-bold lg:text-4xl">
            Everything you need to think faster
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="surface group rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-xl"
            >
              <div className="brand-gradient mb-4 inline-flex rounded-xl p-2.5 text-white shadow-lg">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-dim text-sm leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y border-[var(--line)] bg-[var(--surface-soft)]"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
              How it works
            </p>
            <h2 className="text-3xl font-bold lg:text-4xl">
              From question to answer in seconds
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="surface rounded-2xl p-6">
                <p className="text-gradient mb-3 font-mono text-sm font-bold">
                  {s.n}
                </p>
                <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                  <FiCheck className="text-[var(--accent)]" /> {s.title}
                </h3>
                <p className="text-dim text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h2 className="mb-8 text-center text-3xl font-bold">
          Questions, answered
        </h2>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="surface rounded-xl px-5 py-4 open:border-[var(--line-strong)]"
            >
              <summary className="cursor-pointer list-none font-medium transition-colors hover:text-[var(--accent)]">
                {f.q}
              </summary>
              <p className="text-dim mt-2 text-sm leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1e33] via-[#10314d] to-[#0b1e33] p-10 text-center text-white lg:p-16">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent)]/25 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[var(--accent-2)]/20 blur-3xl" />
          <div className="relative">
            <h2 className="mx-auto mb-4 max-w-2xl text-3xl font-bold lg:text-4xl">
              Ready to chat at the speed of thought?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/70">
              Join in seconds — your assistant, your documents, your history.
            </p>
            <CtaButtons primary="Get started now" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
