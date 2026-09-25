"use client";

/**
 * Command-palette conversation search (Ctrl/⌘+K).
 * Lists recent conversations; typing filters by title or message content.
 * ↑↓ to move, Enter to open, Esc to close.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { FiMessageSquare, FiSearch } from "react-icons/fi";
import { formatRelativeTime } from "@/lib/messages";
import { Conversation } from "@/lib/types";

interface Props {
  open: boolean;
  conversations: Conversation[];
  onSelect: (id: string) => void;
  onClose: () => void;
}

function matchSnippet(conv: Conversation, q: string): string {
  if (!q) return "";
  const hit = conv.messages.find((m) => m.content.toLowerCase().includes(q));
  if (!hit) return "";
  const text = hit.content.trim().replace(/\s+/g, " ");
  return text.length > 80 ? `${text.slice(0, 80)}…` : text;
}

export default function SearchDialog({
  open,
  conversations,
  onSelect,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open ]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [conversations, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-idx="${active}"]`)
      // jsdom (unit tests) and very old browsers lack scrollIntoView.
      ?.scrollIntoView?.({ block: "nearest" });
  }, [active]);

  if (!open) return null;
  const q = query.trim().toLowerCase();

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (results.length ? (a + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) =>
        results.length ? (a - 1 + results.length) % results.length : 0
      );
    } else if (e.key === "Enter" && results[active]) {
      onSelect(results[active].id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search conversations"
    >
      <div
        className="w-full max-w-lg animate-fade-up overflow-hidden border border-[var(--border)] bg-[var(--popover)] text-[var(--popover-foreground)] shadow-2xl"
        style={{ borderRadius: "var(--radius)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 border-b border-[var(--border)] px-4">
          <FiSearch className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search conversations…"
            className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-[var(--muted-foreground)]"
          />
          <kbd className="hidden shrink-0 rounded border border-[var(--border)] bg-[var(--secondary)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)] sm:inline">
            ESC
          </kbd>
        </div>
        <div ref={listRef} className="max-h-80 overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-[var(--muted-foreground)]">
              {conversations.length === 0
                ? "No conversations yet."
                : "No conversations match your search."}
            </p>
          ) : (
            results.map((conv, i) => (
              <button
                key={conv.id}
                data-idx={i}
                onClick={() => onSelect(conv.id)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  i === active ? "bg-[var(--secondary)]" : ""
                }`}
              >
                <FiMessageSquare className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {conv.title}
                  </span>
                  {q && matchSnippet(conv, q) && (
                    <span className="block truncate text-xs text-[var(--muted-foreground)]">
                      {matchSnippet(conv, q)}
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-[11px] text-[var(--muted-foreground)]">
                  {formatRelativeTime(conv.timestamp)}
                </span>
              </button>
            ))
          )}
        </div>
        <div className="hidden items-center gap-4 border-t border-[var(--border)] px-4 py-2 text-[11px] text-[var(--muted-foreground)] sm:flex">
          <span>↑↓ navigate</span>
          <span>Enter to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
