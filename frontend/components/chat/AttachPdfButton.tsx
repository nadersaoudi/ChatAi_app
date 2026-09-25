/**
 * Compact toolbar attach button: picks the PDF (no upload yet) and shows
 * live upload progress as an animated 0-100% ring around the icon.
 */
import { useRef } from "react";
import {
  FiCheckCircle,
  FiFileText,
  FiPaperclip,
  FiXCircle,
} from "react-icons/fi";
import { PdfStatus } from "@/hooks/usePdfAttachment";

const RING = 2 * Math.PI * 15; // r=15 circle

interface Props {
  status: PdfStatus;
  progress: number;
  notice: string;
  disabled: boolean;
  hasFile: boolean;
  onSelect: (file: File | undefined) => void;
}

export default function AttachPdfButton({
  status,
  progress,
  notice,
  disabled,
  hasFile,
  onSelect,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const title =
    status === "done"
      ? notice || "PDF indexed."
      : status === "error"
        ? notice || "Upload failed."
        : status === "uploading"
          ? `Uploading PDF… ${progress}%`
          : hasFile
            ? "PDF attached — it will upload when you send."
            : "Attach a PDF to send it with your message";

  return (
    <label
      htmlFor="pdf-upload"
      title={title}
      className={`relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border transition-colors ${
        status === "done"
          ? "border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--accent)]"
          : status === "error"
            ? "border-red-500/50 bg-red-500/10 text-red-500"
            : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--line-strong)] hover:text-[var(--foreground)]"
      }`}
    >
      {/* progress ring */}
      {(status === "uploading" || status === "done") && (
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 36 36"
        >
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="var(--border)"
            strokeWidth="2.5"
          />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={RING}
            strokeDashoffset={RING * (1 - (status === "done" ? 100 : progress) / 100)}
            style={{ transition: "stroke-dashoffset 0.2s linear" }}
          />
        </svg>
      )}
      {status === "uploading" ? (
        <span className="text-[9px] font-bold text-[var(--accent)]">{progress}</span>
      ) : status === "done" ? (
        <FiCheckCircle className="h-4 w-4" />
      ) : status === "error" ? (
        <FiXCircle className="h-4 w-4" />
      ) : hasFile ? (
        <FiFileText className="h-4 w-4" />
      ) : (
        <FiPaperclip className="h-4 w-4" />
      )}
      <input
        id="pdf-upload"
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        disabled={disabled || status === "uploading"}
        onChange={(e) => {
          onSelect(e.target.files?.[0]);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
    </label>
  );
}
