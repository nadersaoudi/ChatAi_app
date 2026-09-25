/**
 * Pending-PDF attachment state for the attach-then-send flow.
 *
 * Selecting a file does NOT upload it. The file waits as a pending chip in
 * the composer; the actual upload (with 0-100% progress) happens when the
 * user presses send, so the message and the document travel together.
 */
import { useCallback, useState } from "react";
import { uploadPdfWithProgress } from "@/lib/api";
import { MAX_PDF_MB } from "@/lib/config";

export type PdfStatus = "idle" | "ready" | "uploading" | "done" | "error";

const isPdf = (file: File) =>
  file.type === "application/pdf" ||
  file.name.toLowerCase().endsWith(".pdf");

export function usePdfAttachment() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<PdfStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [notice, setNotice] = useState("");

  const select = useCallback((next: File | undefined) => {
    if (!next) return;
    if (!isPdf(next)) {
      setNotice("Please choose a .pdf file.");
      setStatus("error");
      return;
    }
    if (next.size > MAX_PDF_MB * 1024 * 1024) {
      setNotice(`PDF exceeds the ${MAX_PDF_MB} MB limit.`);
      setStatus("error");
      return;
    }
    setFile(next);
    setNotice("");
    setProgress(0);
    setStatus("ready");
  }, []);

  const remove = useCallback(() => {
    setFile(null);
    setProgress(0);
    setNotice("");
    setStatus("idle");
  }, []);

  /**
   * Upload the pending file. Returns chunk count, or null when there was
   * nothing to upload / the upload failed (notice already set for the UI).
   */
  const uploadPending = useCallback(
    async (userId: string): Promise<number | null> => {
      if (!file) return null;
      setStatus("uploading");
      setProgress(0);
      try {
        const result = await uploadPdfWithProgress(userId, file, setProgress);
        const chunks = result.chunks ?? 0;
        setNotice(`Indexed · ${chunks} chunks`);
        setStatus("done");
        setFile(null);
        return chunks;
      } catch (err) {
        setNotice(err instanceof Error ? err.message : "Upload failed.");
        setStatus("error");
        return null;
      }
    },
    [file]
  );

  return {
    file,
    hasFile: file !== null,
    status,
    progress,
    notice,
    select,
    remove,
    uploadPending,
  };
}
