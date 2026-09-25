/**
 * Qoder-style composer card: attachment chips on top, borderless textarea,
 * bottom toolbar (attach · Ask/Agent · model · send).
 */
import type { KeyboardEvent, ReactNode } from "react";
import { FiArrowUp } from "react-icons/fi";
import { ChatMode } from "@/lib/types";
import ModeSwitch from "./ModeSwitch";

interface Props {
  value: string;
  sending: boolean;
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  onChange: (value: string) => void;
  onSend: () => void;
  /** Attach (+) button for the toolbar. */
  attachSlot?: ReactNode;
  /** Model picker for the toolbar. */
  modelSlot?: ReactNode;
  /** Pending-attachment chips rendered above the textarea. */
  chipSlot?: ReactNode;
}

export default function ChatInput({
  value,
  sending,
  mode,
  onModeChange,
  onChange,
  onSend,
  attachSlot,
  modelSlot,
  chipSlot,
}: Props) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="surface rounded-2xl transition-colors focus-within:border-[var(--line-strong)]">
      {chipSlot}
      <textarea
        placeholder={
          mode === "agent"
            ? "Describe the coding task for the agent…"
            : "Message Codenix…"
        }
        className="max-h-44 min-h-[64px] w-full resize-none bg-transparent px-4 pb-1 pt-3.5 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] disabled:opacity-60"
        rows={2}
        value={value}
        disabled={sending}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="flex items-center gap-2 px-3 pb-3">
        {attachSlot}
        <ModeSwitch mode={mode} onChange={onModeChange} disabled={sending} />
        {modelSlot}
        <div className="flex-1" />
        <span className="hidden text-[11px] text-[var(--muted-foreground)] md:inline">
          Enter to send · Shift+Enter for new line
        </span>
        <button
          onClick={onSend}
          disabled={sending || !value.trim()}
          title="Send message"
          className="btn-gradient flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          <FiArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
