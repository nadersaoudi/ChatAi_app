/** Qoder-style Ask/Agent segmented mode switch. */
import { FiCpu, FiMessageCircle } from "react-icons/fi";
import { ChatMode } from "@/lib/types";

const MODES: { id: ChatMode; label: string; icon: typeof FiCpu; hint: string }[] = [
  { id: "ask", label: "Ask", icon: FiMessageCircle, hint: "Q&A — answers without changing anything" },
  { id: "agent", label: "Agent", icon: FiCpu, hint: "Autonomous coding assistant — plans then codes" },
];

export default function ModeSwitch({
  mode,
  onChange,
  disabled,
}: {
  mode: ChatMode;
  onChange: (mode: ChatMode) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-0.5 rounded-xl border border-[var(--border)] bg-[var(--secondary)] p-0.5"
      role="tablist"
      aria-label="Chat mode"
    >
      {MODES.map((m) => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            role="tab"
            aria-selected={active}
            title={`${m.label} — ${m.hint}`}
            disabled={disabled}
            onClick={() => onChange(m.id)}
            className={`flex items-center gap-1.5 rounded-[calc(var(--radius)-4px)] px-2.5 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${
              active
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <m.icon className="h-3.5 w-3.5" />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
