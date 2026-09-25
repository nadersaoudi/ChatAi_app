/** Sidebar: gradient new-chat button + glowing active history item. */
import { FiMessageSquare, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { formatRelativeTime } from "@/lib/messages";
import { Conversation } from "@/lib/types";

interface Props {
  conversations: Conversation[];
  currentId: string | null;
  loading: boolean;
  onNew: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onSearch: () => void;
}

export default function ConversationSidebar({
  conversations,
  currentId,
  loading,
  onNew,
  onSelect,
  onDelete,
  onSearch,
}: Props) {
  return (
    <aside className="bg-[var(--surface-soft)] hidden w-72 shrink-0 flex-col border-r border-[var(--line)] sm:flex">
      <div className="flex flex-col gap-2 border-b border-[var(--line)] p-4">
        <button
          onClick={onSearch}
          title="Search conversations (Ctrl+K)"
          className="flex w-full items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--secondary)] px-4 py-2.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
        >
          <FiSearch className="h-4 w-4" />
          <span className="flex-1 text-left">Search chats…</span>
          <kbd className="rounded border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px]">
            Ctrl K
          </kbd>
        </button>
        <button
          onClick={onNew}
          className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-lg"
        >
          <FiPlus className="h-4 w-4" /> New chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <p className="text-faint px-2 pb-2 text-[11px] font-semibold uppercase tracking-widest">
          History
        </p>
        {loading ? (
          <div className="space-y-1.5" aria-label="Loading history">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="skeleton-bar h-14 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-faint rounded-xl border border-dashed border-[var(--line-strong)] px-3 py-8 text-center text-xs leading-relaxed">
            No conversations yet.
            <br />
            Your chats will appear here.
          </div>
        ) : (
          <div className="space-y-1.5">
            {conversations.map((conv) => {
              const active = currentId === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => onSelect(conv.id)}
                  className={`group relative cursor-pointer rounded-xl border p-3 transition-all ${
                    active
                      ? "border-[var(--line-strong)] bg-[var(--surface-2)]"
                      : "border-transparent hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <div className="flex items-start gap-2 pr-6">
                    <FiMessageSquare
                      className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${active ? "text-[var(--accent)]" : "text-faint"}`}
                    />
                    <div className="min-w-0">
                      <div className="truncate text-sm">{conv.title}</div>
                      <div className="text-faint mt-0.5 text-[11px]">
                        {formatRelativeTime(conv.timestamp)}
                      </div>
                    </div>
                  </div>
                  <button
                    title="Delete conversation"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="text-faint absolute right-2 top-2.5 rounded-md p-1.5 opacity-0 transition-all hover:bg-red-500/15 hover:text-red-400 group-hover:opacity-100"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
