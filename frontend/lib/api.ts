/**
 * Typed HTTP client for the FastAPI backend.
 * Every helper throws ApiError (with the backend's `detail` message) on failure,
 * so the UI can show *why* a request failed instead of a generic message.
 */
import { API_BASE_URL } from "./config";
import {
  ChatMessage,
  Conversation,
  ConversationDTO,
  ModelOption,
  conversationFromDTO,
} from "./types";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.detail === "string") return data.detail;
    if (typeof data?.error === "string") return data.error;
  } catch {
    /* not JSON — fall through */
  }
  return `Request failed (HTTP ${res.status})`;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, init);
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json() as Promise<T>;
}

/* ---------------- chat ---------------- */

export interface AskResponse {
  response: string;
  model?: string;
}

export function askChat(
  messages: Pick<ChatMessage, "role" | "content">[],
  model?: string
) {
  return apiFetch<AskResponse>("/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, model: model ?? null }),
  });
}

export interface ModelList {
  models: ModelOption[];
  default: string;
}

/** Models the current backend offers (primary + fallbacks). */
export function fetchModels() {
  return apiFetch<ModelList>("/api/models");
}

/* ---------------- users ---------------- */

export function storeUser(user: { user_id: string; email: string; name: string }) {
  return apiFetch<{ success: boolean }>("/api/store_user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
}

/* ---------------- conversations ---------------- */

export async function fetchConversations(userId: string): Promise<Conversation[]> {
  const data = await apiFetch<{ conversations: ConversationDTO[] }>(
    `/api/get_conversations?user_id=${encodeURIComponent(userId)}`
  );
  return (data.conversations ?? []).map(conversationFromDTO);
}

export function saveConversationRemote(args: {
  user_id: string;
  conversation_id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: number;
}) {
  return apiFetch<{ success: boolean }>("/api/save_conversation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
}

export async function deleteConversationRemote(
  userId: string,
  conversationId: string
): Promise<void> {
  const data = await apiFetch<{ success: boolean; error?: string }>(
    "/api/delete_conversation",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, conversation_id: conversationId }),
    }
  );
  if (!data.success) throw new ApiError(404, data.error ?? "Could not delete.");
}

/* ---------------- RAG / PDFs ---------------- */

export interface RagResult {
  results: string[];
}

export async function queryRag(userId: string, query: string): Promise<string[]> {
  const form = new FormData();
  form.append("user_id", userId);
  form.append("query", query);
  const data = await apiFetch<RagResult>("/api/query_rag", {
    method: "POST",
    body: form,
  });
  return data.results ?? [];
}

export interface UploadResult {
  success: boolean;
  pdf_id?: string;
  chunks?: number;
  error?: string;
}

/**
 * PDF upload with live progress (0-100). Uses XMLHttpRequest because
 * fetch() cannot report upload progress.
 */
export function uploadPdfWithProgress(
  userId: string,
  file: File,
  onProgress: (pct: number) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/api/upload_pdf`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      let data: UploadResult;
      try {
        data = JSON.parse(xhr.responseText) as UploadResult;
      } catch {
        reject(new ApiError(xhr.status, "Invalid upload response."));
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.success) {
        onProgress(100);
        resolve(data);
      } else {
        reject(
          new ApiError(
            xhr.status,
            data.error ?? `Upload failed (HTTP ${xhr.status}).`
          )
        );
      }
    };
    xhr.onerror = () => reject(new ApiError(0, "Network error during upload."));
    const form = new FormData();
    form.append("user_id", userId);
    form.append("file", file);
    xhr.send(form);
  });
}
