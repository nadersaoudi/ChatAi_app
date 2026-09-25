/**
 * Dashboard: thin composition layer.
 * State lives in hooks (useChat, useConversationHistory, usePdfAttachment,
 * useTheme) — this file only wires them to components/chat.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import { FiFileText, FiX } from "react-icons/fi";
import AttachPdfButton from "@/components/chat/AttachPdfButton";
import ChatHeader, {
  ContentWidth,
  WIDTH_ORDER,
} from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatList from "@/components/chat/ChatList";
import ChatSkeleton from "@/components/chat/ChatSkeleton";
import ConversationSidebar from "@/components/chat/ConversationSidebar";
import ModelSwitch from "@/components/chat/ModelSwitch";
import { useChat } from "@/hooks/useChat";
import { useConversationHistory } from "@/hooks/useConversationHistory";
import { usePdfAttachment } from "@/hooks/usePdfAttachment";
import { useTheme } from "@/hooks/useTheme";
import { fetchModels } from "@/lib/api";
import { AGENT_SYSTEM } from "@/lib/messages";
import { ChatMessage, ChatMode, ModelOption } from "@/lib/types";

// Below-the-fold dialogs load on demand (smaller first paint).
const ConfirmDialog = dynamic(
  () => import("@/components/chat/ConfirmDialog"),
  { ssr: false }
);
const SearchDialog = dynamic(
  () => import("@/components/chat/SearchDialog"),
  { ssr: false }
);

const WIDTH_CLASS: Record<ContentWidth, string> = {
  narrow: "max-w-3xl",
  wide: "max-w-5xl",
  full: "max-w-none",
};

function readStored<T extends string>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return (window.localStorage.getItem(key) as T) ?? fallback;
  } catch {
    return fallback;
  }
}

export default function DashboardPage() {
  const { user } = useUser();
  // Memoized on primitive values: a fresh object identity every render would
  // re-trigger every effect that depends on the profile (request flood).
  const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses[0]?.emailAddress ?? "";
  const name = user?.fullName ?? user?.username ?? "";
  const clerkUser = useMemo(
    () => (user ? { id: user.id, email, name } : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.id, email, name]
  );

  const history = useConversationHistory(clerkUser);
  const chat = useChat(clerkUser?.id);
  const pdf = usePdfAttachment();
  const { theme, toggle: toggleTheme } = useTheme();
  const [notice, setNotice] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // Hydration-safe defaults (match SSR); stored prefs adopted on mount.
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [width, setWidth] = useState<ContentWidth>("narrow");
  const [mode, setMode] = useState<ChatMode>("ask");
  // "" = Auto (server default). Hydration-safe: adopted on mount.
  const [modelId, setModelId] = useState("");
  const [models, setModels] = useState<ModelOption[]>([]);

  useEffect(() => {
    setSidebarOpen(readStored("codenix-sidebar", "open") === "open");
    setWidth(readStored<ContentWidth>("codenix-width", "narrow"));
    setMode(readStored<ChatMode>("codenix-mode", "ask"));
    const storedModel = readStored("codenix-model", "");
    if (storedModel) setModelId(storedModel);
    fetchModels()
      .then((list) => {
        setModels(list.models);
        // Drop a stored value the backend no longer offers.
        if (storedModel && !list.models.some((m) => m.id === storedModel)) {
          setModelId("");
        }
      })
      .catch(() => undefined);
  }, []);

  // Global search shortcut: Ctrl/⌘+K opens the palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const flashNotice = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(null), 4000);
  };

  const trackPersistable = (persistable: ChatMessage[]) => {
    history.track(persistable, history.currentId);
  };

  /**
   * Attach-then-send: if a PDF is pending, upload it first (progress ring
   * on the attach button), then send the message so the fresh chunks are
   * used as RAG context for this very reply.
   */
  const sendFlow = (text: string) => {
    if (!text.trim() || chat.sending || pdf.status === "uploading") return;
    void (async () => {
      if (pdf.hasFile) {
        if (!clerkUser) return;
        const chunks = await pdf.uploadPending(clerkUser.id);
        if (chunks === null) return; // upload error already shown on icon
      }
      void chat.sendText(text, trackPersistable, {
        systemExtra: mode === "agent" ? AGENT_SYSTEM : "",
        model: modelId || undefined,
      });
    })();
  };

  const changeModel = (id: string) => {
    setModelId(id);
    try {
      window.localStorage.setItem("codenix-model", id);
    } catch {
      /* ignore */
    }
  };

  const modelLabel =
    models.find((m) => m.id === modelId)?.label ?? "Auto";

  const changeMode = (next: ChatMode) => {
    setMode(next);
    try {
      window.localStorage.setItem("codenix-mode", next);
    } catch {
      /* ignore */
    }
  };

  const handleSend = () => sendFlow(chat.input);
  const handleSuggest = (text: string) => sendFlow(text);

  const handleNew = () => {
    pdf.remove();
    chat.reset(history.startNew());
  };

  const handleSelect = (id: string) => {
    const messages = history.select(id);
    if (messages) {
      pdf.remove();
      chat.reset(messages);
    }
  };

  const handleSearchSelect = (id: string) => {
    setSearchOpen(false);
    handleSelect(id);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id); // opens the confirm dialog
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    setDeleting(true);
    history
      .remove(deleteId)
      .then(() => {
        if (history.currentId === deleteId) handleNew();
      })
      .catch((err: unknown) =>
        flashNotice(err instanceof Error ? err.message : "Delete failed.")
      )
      .finally(() => {
        setDeleting(false);
        setDeleteId(null);
      });
  };

  const toggleSidebar = () => {
    setSidebarOpen((open) => {
      try {
        window.localStorage.setItem("codenix-sidebar", open ? "closed" : "open");
      } catch {
        /* ignore */
      }
      return !open;
    });
  };

  const cycleWidth = () => {
    setWidth((w) => {
      const next = WIDTH_ORDER[(WIDTH_ORDER.indexOf(w) + 1) % WIDTH_ORDER.length];
      try {
        window.localStorage.setItem("codenix-width", next);
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <>
      <SignedIn>
        <div className="app-bg flex h-screen flex-col">
          <ChatHeader
            sidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
            width={width}
            onCycleWidth={cycleWidth}
            theme={theme}
            onToggleTheme={toggleTheme}
            modelLabel={modelLabel}
            onSearch={() => setSearchOpen(true)}
            onNew={handleNew}
          />
          <div className="flex min-h-0 flex-1">
            {sidebarOpen && (
              <ConversationSidebar
                conversations={history.conversations}
                currentId={history.currentId}
                loading={history.loading}
                onNew={handleNew}
                onSelect={handleSelect}
                onDelete={handleDelete}
                onSearch={() => setSearchOpen(true)}
              />
            )}
            <main className="flex min-w-0 flex-1 flex-col">
              {history.loading ? (
                <ChatSkeleton />
              ) : (
                <ChatList
                  messages={chat.messages}
                  sending={chat.sending}
                  revealing={chat.revealing}
                  streamIndex={chat.streamIndex}
                  widthClass={WIDTH_CLASS[width]}
                  onRevealDone={chat.finishReveal}
                  onSuggest={handleSuggest}
                />
              )}
              <div className="border-t border-[var(--line)] bg-[var(--surface-soft)] px-4 py-4 sm:px-6">
                <div className={`mx-auto flex flex-col gap-3 ${WIDTH_CLASS[width]}`}>
                  {notice && (
                    <p className="text-sm font-medium text-red-500">{notice}</p>
                  )}
                  <ChatInput
                    value={chat.input}
                    sending={chat.sending || pdf.status === "uploading"}
                    mode={mode}
                    onModeChange={changeMode}
                    onChange={chat.setInput}
                    onSend={handleSend}
                    attachSlot={
                      <AttachPdfButton
                        status={pdf.status}
                        progress={pdf.progress}
                        notice={pdf.notice}
                        disabled={!clerkUser}
                        hasFile={pdf.hasFile}
                        onSelect={pdf.select}
                      />
                    }
                    modelSlot={
                      <ModelSwitch
                        models={models}
                        value={modelId}
                        disabled={chat.sending}
                        onChange={changeModel}
                      />
                    }
                    chipSlot={
                      pdf.file && (
                        <div className="px-3 pt-3">
                          <div className="chip flex w-fit items-center gap-2 rounded-full py-1.5 pl-3 pr-2 text-xs">
                            <FiFileText className="h-3.5 w-3.5 text-[var(--accent)]" />
                            <span className="max-w-56 truncate">{pdf.file.name}</span>
                            <span className="text-faint">
                              {(pdf.file.size / 1024 / 1024).toFixed(1)} MB
                            </span>
                            <button
                              title="Remove attachment"
                              onClick={pdf.remove}
                              className="rounded-full p-0.5 transition-colors hover:bg-black/10"
                            >
                              <FiX className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )
                    }
                  />
                </div>
              </div>
            </main>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete conversation?"
        message="This will permanently remove the chat and all its messages. This action cannot be undone."
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          if (!deleting) setDeleteId(null);
        }}
      />
      <SearchDialog
        open={searchOpen}
        conversations={history.conversations}
        onSelect={handleSearchSelect}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
