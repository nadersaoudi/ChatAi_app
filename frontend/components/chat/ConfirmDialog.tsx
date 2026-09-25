"use client";

/** Confirm dialog bound explicitly to theme popover tokens. */
import { useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  busy = false,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="w-full max-w-sm animate-fade-up border border-[var(--border)] bg-[var(--popover)] p-6 text-[var(--popover-foreground)] shadow-2xl"
        style={{ borderRadius: "var(--radius)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-xl border border-red-500/40 bg-red-500/10 p-2 text-red-500">
            <FiAlertTriangle className="h-5 w-5" />
          </span>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {message}
        </p>
        <div className="flex justify-end gap-2.5">
          <button
            onClick={onCancel}
            disabled={busy}
            className="border border-[var(--border)] bg-[var(--secondary)] px-4 py-2 text-sm font-medium text-[var(--secondary-foreground)] transition-colors hover:brightness-95 disabled:opacity-50"
            style={{ borderRadius: "var(--radius)" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="bg-[var(--destructive)] px-4 py-2 text-sm font-semibold text-white shadow-lg transition-colors hover:brightness-110 disabled:opacity-50"
            style={{ borderRadius: "var(--radius)" }}
          >
            {busy ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
