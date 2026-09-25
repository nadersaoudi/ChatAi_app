/**
 * Pure message helpers: greeting, error bubbles, history hygiene, titles.
 * No React, no I/O — trivially testable.
 */
import { MAX_HISTORY_MESSAGES } from "./config";
import { ChatMessage } from "./types";

export const ERROR_PREFIX = "❌";

/** System instruction prepended in Agent mode (Qoder-style). */
export const AGENT_SYSTEM =
  "Act as an autonomous coding agent: break the task into short steps, " +
  "show the plan briefly, then deliver complete, runnable code with " +
  "explanations of key decisions.";

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    content: "I'm your AI assistant. Ask me anything about programming, tech, or more!",
  },
];

export function isErrorBubble(msg: ChatMessage): boolean {
  return msg.error === true || msg.content.startsWith(ERROR_PREFIX);
}

export function toApiPayload(messages: ChatMessage[]) {
  return messages
    .filter((m) => !isErrorBubble(m) && m.content.trim().length > 0)
    .slice(-MAX_HISTORY_MESSAGES)
    .map(({ role, content }) => ({ role, content }));
}

/**
 * Build the provider payload: optional mode instruction + house answer rules
 * + optional RAG context as one system prompt, then the capped history.
 */
export function withRagContext(
  messages: ChatMessage[],
  ragContext: string,
  systemExtra = ""
): Pick<ChatMessage, "role" | "content">[] {
  const payload = toApiPayload(messages);
  const pdfPart = ragContext.trim()
    ? `If the answer to the user's question is in the following PDF content, use it. Otherwise answer from general knowledge.\n\nPDF content:\n${ragContext.trim()}`
    : "";
  const rules = [
    "Answer in the same language as the user's last message.",
    "Be clear and structured: short headings, bullet or numbered lists for steps, tables when comparing items.",
    "When you use the PDF content, cite it like [p. N]. When the text refers to a figure, table or diagram, name it (e.g. Figure 2) and explain it element by element (for UML: actors, use cases, classes, relations).",
    "Put code in fenced blocks with the language name. Keep code complete and runnable.",
    "If the answer is long, end with a one-line summary. Never cut an answer short.",
  ].join(" ");
  const system = [systemExtra.trim(), rules, pdfPart].filter(Boolean).join("\n\n");
  if (!system) return payload;
  return [{ role: "system" as const, content: `You are Codenix, an expert explainer. ${system}` }, ...payload];
}

export function conversationTitle(messages: ChatMessage[]): string {
  const first = messages.find((m) => m.role === "user" && !isErrorBubble(m));
  if (!first) return "New Chat";
  const text = first.content.trim();
  return text.length > 30 ? `${text.slice(0, 30)}…` : text;
}

export function formatRelativeTime(timestamp: number): string {
  const hours = Math.floor((Date.now() - timestamp) / 3_600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hours ago`;
  if (hours < 48) return "Yesterday";
  if (hours < 168) return `${Math.floor(hours / 24)} days ago`;
  return `${Math.floor(hours / 168)} weeks ago`;
}

export function errorText(err: unknown): string {
  const detail =
    err instanceof Error && err.message ? ` ${err.message}` : "";
  return `${ERROR_PREFIX} Failed to get a response.${detail} Please try again.`;
}
