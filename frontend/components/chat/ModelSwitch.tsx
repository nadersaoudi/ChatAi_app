"use client";

/** Model picker dropdown: Auto (= server default) or a specific model. */
import { useEffect, useRef, useState } from "react";
import { FiCheck, FiChevronDown, FiCpu } from "react-icons/fi";
import { ModelOption } from "@/lib/types";

interface Props {
  models: ModelOption[];
  value: string; // "" = Auto
  disabled?: boolean;
  onChange: (id: string) => void;
}

export default function ModelSwitch({ models, value, disabled, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = models.find((m) => m.id === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open ]);

  const pick = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        title="Choose the model to ask"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--secondary)] px-2.5 py-[7px] text-xs font-semibold text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] disabled:opacity-50"
      >
        <FiCpu className="h-3.5 w-3.5" />
        <span className="max-w-28 truncate">{current ? current.label : "Auto"}</span>
        <FiChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          className="absolute bottom-full left-0 z-50 mb-2 w-56 animate-fade-up border border-[var(--border)] bg-[var(--popover)] p-1.5 text-[var(--popover-foreground)] shadow-2xl"
          style={{ borderRadius: "var(--radius)" }}
          role="listbox"
          aria-label="Choose model"
        >
          <button
            role="option"
            aria-selected={value === ""}
            onClick={() => pick("")}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors hover:bg-[var(--secondary)]"
          >
            <FiCheck className={`h-3.5 w-3.5 ${value === "" ? "text-[var(--accent)]" : "invisible"}`} />
            <span>
              <span className="block font-semibold">Auto</span>
              <span className="block text-[11px] text-[var(--muted-foreground)]">
                Server default + fallback
              </span>
            </span>
          </button>
          {models.map((m) => (
            <button
              key={m.id}
              role="option"
              aria-selected={value === m.id}
              onClick={() => pick(m.id)}
              title={m.id}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors hover:bg-[var(--secondary)]"
            >
              <FiCheck className={`h-3.5 w-3.5 shrink-0 ${value === m.id ? "text-[var(--accent)]" : "invisible"}`} />
              <span className="truncate font-medium">{m.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
