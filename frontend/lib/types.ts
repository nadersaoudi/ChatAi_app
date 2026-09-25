/** Shared domain types (client side). */

export type Role = "user" | "assistant" | "system";

/** Composer mode (Qoder-style): Q&A vs autonomous coding agent. */
export type ChatMode = "ask" | "agent";

/** One selectable chat model (GET /api/models). Empty id = server default. */
export interface ModelOption {
  id: string;
  label: string;
}

export interface ChatMessage {
  role: Role;
  /** UI-only flag: reply that represents a failed request. Never sent to the API. */
  error?: boolean;
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: number;
  lastUpdated: number;
}

/** Wire shape returned by GET /api/get_conversations. */
export interface ConversationDTO {
  conversation_id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: number;
}

export function conversationFromDTO(dto: ConversationDTO): Conversation {
  return {
    id: dto.conversation_id,
    title: dto.title,
    messages: dto.messages,
    timestamp: dto.timestamp,
    lastUpdated: dto.timestamp,
  };
}
