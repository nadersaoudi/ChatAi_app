/** Scrollable message list: welcome hero + suggestions when empty, auto-scroll. */
import { useEffect, useRef } from "react";
import { FiCpu, FiFileText, FiCode, FiCompass } from "react-icons/fi";
import Logo from "@/components/layout/Logo";
import { ChatMessage as Message } from "@/lib/types";
import ChatMessage from "./ChatMessage";

const SUGGESTIONS = [
  { icon: FiCode, label: "Explain recursion with a Python example" },
  { icon: FiFileText, label: "How do I get the most from my PDFs here?" },
  { icon: FiCompass, label: "Give me 5 startup ideas using AI chatbots" },
  { icon: FiCpu, label: "What is retrieval-augmented generation?" },
];

interface Props {
  messages: Message[];
  sending: boolean;
  revealing: boolean;
  streamIndex: number | null;
  widthClass: string;
  onRevealDone: () => void;
  onSuggest: (text: string) => void;
}

export default function ChatList({
  messages,
  sending,
  revealing,
  streamIndex,
  widthClass,
  onRevealDone,
  onSuggest,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const isFresh = messages.filter((m) => m.role === "user").length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // Stick to bottom while the reply is revealing itself.
  useEffect(() => {
    if (!revealing) return;
    const timer = setInterval(() => {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }, 150);
    return () => clearInterval(timer);
  }, [revealing]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className={`mx-auto space-y-6 px-4 py-8 sm:px-6 ${widthClass}`}>
        {isFresh && !sending && (
          <div className="pb-2 pt-6 text-center">
            <span className="brand-gradient mx-auto mb-5 block w-fit rounded-2xl p-3 shadow-xl">
              <Logo size="h-8 w-8" />
            </span>
            <h2 className="text-2xl font-bold sm:text-3xl">
              What can I <span className="text-gradient">help with</span> today?
            </h2>
            <p className="text-dim mx-auto mt-2 max-w-md text-sm">
              Ask anything — or try one of these to get going.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-2.5 text-left sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => onSuggest(s.label)}
                  className="surface group flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-all hover:-translate-y-0.5 hover:border-[var(--line-strong)]"
                >
                  <s.icon className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                  <span className="line-clamp-2">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, idx) =>
          isFresh && idx === 0 && !sending ? null : (
            <ChatMessage
              key={idx}
              message={msg}
              animate={idx === streamIndex}
              onAnimated={onRevealDone}
            />
          )
        )}
        {sending && !revealing && (
          <div className="flex animate-fade-up items-center justify-start">
            <span className="brand-gradient mr-3 block rounded-full p-1.5">
              <Logo size="h-4 w-4" />
            </span>
            <div className="bubble-assistant flex items-center gap-1.5 rounded-2xl rounded-bl-md px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 animate-typing-dot rounded-full bg-[var(--accent)]"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
