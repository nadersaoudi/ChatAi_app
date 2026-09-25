/**
 * Conversation-history state: sidebar list, selection, persistence.
 * The backend is the source of truth; local state is an optimistic mirror.
 */
import { useCallback, useEffect, useState } from "react";
import {
  deleteConversationRemote,
  fetchConversations,
  saveConversationRemote,
  storeUser,
} from "@/lib/api";
import { INITIAL_MESSAGES, conversationTitle } from "@/lib/messages";
import { ChatMessage, Conversation } from "@/lib/types";

interface ClerkUser {
  id: string;
  email: string;
  name: string;
}

export function useConversationHistory(clerkUser: ClerkUser | null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  // True while the first history fetch after login is in flight (skeletons).
  const [loading, setLoading] = useState(false);

  // Destructure to primitives: the caller may pass a fresh object identity
  // on every render, and effect/callback deps must be value-stable to avoid
  // refetch loops (a new object identity each render = infinite requests).
  const userId = clerkUser?.id ?? null;
  const userEmail = clerkUser?.email ?? "";
  const userName = clerkUser?.name ?? "";

  // Register the user + load their history on sign-in (runs once per user).
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoading(true);
    storeUser({ user_id: userId, email: userEmail, name: userName }).catch(
      () => undefined
    );
    fetchConversations(userId)
      .then((list) => {
        if (!cancelled) setConversations(list);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, userEmail, userName]);

  /** Persist messages (local + remote). Returns the conversation id. */
  const track = useCallback(
    (messages: ChatMessage[], conversationId: string | null): string => {
      const id = conversationId ?? Date.now().toString();
      const timestamp = Date.now();
      const entry: Conversation = {
        id,
        title: conversationTitle(messages),
        messages,
        timestamp,
        lastUpdated: timestamp,
      };
      setConversations((prev) => {
        const rest = prev.filter((c) => c.id !== id);
        return [{ ...entry }, ...rest];
      });
      if (!conversationId) setCurrentId(id);
      if (userId) {
        saveConversationRemote({
          user_id: userId,
          conversation_id: id,
          title: entry.title,
          messages,
          timestamp,
        }).catch(() => undefined);
      }
      return id;
    },
    [userId]
  );

  const select = useCallback(
    (id: string): ChatMessage[] | null => {
      const found = conversations.find((c) => c.id === id) ?? null;
      if (found) {
        setCurrentId(id);
        return found.messages;
      }
      return null;
    },
    [conversations]
  );

  const startNew = useCallback((): ChatMessage[] => {
    setCurrentId(null);
    return INITIAL_MESSAGES;
  }, []);

  const remove = useCallback(
    async (id: string): Promise<void> => {
      if (!userId) return;
      await deleteConversationRemote(userId, id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
    },
    [userId]
  );

  return { conversations, currentId, loading, track, select, startNew, remove };
}
