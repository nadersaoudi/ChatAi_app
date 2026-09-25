/**
 * Chat state machine: input, send (with RAG), error handling.
 *
 * Bug fixes vs the old page:
 * - the just-sent user message is never dropped on failure (the old catch
 *   handler rebuilt state from a stale `messages` closure);
 * - failure bubbles are UI-only: the history handed to `onSettled` for
 *   persistence excludes them, so one failure can no longer poison future
 *   requests.
 */
import { useCallback, useState } from "react";
import { askChat, queryRag } from "@/lib/api";
import {
  INITIAL_MESSAGES,
  errorText,
  isErrorBubble,
  withRagContext,
} from "@/lib/messages";
import { ChatMessage } from "@/lib/types";

const withoutErrorBubbles = (messages: ChatMessage[]) =>
  messages.filter((m) => !isErrorBubble(m));

export function useChat(userId: string | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  // Typewriter reveal: index of the fresh reply + whether it is animating.
  const [streamIndex, setStreamIndex] = useState<number | null>(null);
  const [revealing, setRevealing] = useState(false);

  const reset = useCallback((next: ChatMessage[]) => {
    setMessages(next);
    setInput("");
    setStreamIndex(null);
    setRevealing(false);
  }, []);

  const finishReveal = useCallback(() => {
    setRevealing(false);
    setStreamIndex(null);
  }, []);

  const sendText = useCallback(
    async (
      text: string,
      onSettled: (persistable: ChatMessage[]) => void,
      opts?: { systemExtra?: string; model?: string }
    ) => {
      const clean = text.trim();
      if (!clean || sending) return;
      const next: ChatMessage[] = [...messages, { role: "user", content: clean }];
      setMessages(next);
      setInput("");
      setStreamIndex(null);
      setRevealing(false);
      setSending(true);
      try {
        // RAG is best-effort: chat must work even without indexed PDFs.
        let ragContext = "";
        if (userId) {
          try {
            ragContext = (await queryRag(userId, clean)).join("\n---\n");
          } catch {
            ragContext = "";
          }
        }
        const { response } = await askChat(
          withRagContext(next, ragContext, opts?.systemExtra ?? ""),
          opts?.model
        );
        const final: ChatMessage[] = [
          ...next,
          { role: "assistant", content: response },
        ];
        setMessages(final);
        setStreamIndex(final.length - 1);
        setRevealing(true);
        onSettled(withoutErrorBubbles(final));
      } catch (err) {
        // Keep the user's message on screen; show the failure as a bubble.
        setMessages([
          ...next,
          { role: "assistant", content: errorText(err), error: true },
        ]);
        onSettled(withoutErrorBubbles(next));
      } finally {
        setSending(false);
      }
    },
    [messages, sending, userId]
  );

  const send = useCallback(
    (onSettled: (persistable: ChatMessage[]) => void) =>
      sendText(input, onSettled),
    [input, sendText]
  );

  return { messages, input, setInput, sending, send, sendText, reset, streamIndex, revealing, finishReveal };
}
