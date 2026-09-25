/** Single chat bubble. Fresh replies animate via typewriter reveal. */
import { memo } from "react";
import { UserButton } from "@clerk/nextjs";
import Logo from "@/components/layout/Logo";
import { isErrorBubble } from "@/lib/messages";
import { ChatMessage as Message } from "@/lib/types";
import { renderWithCode } from "./renderWithCode";
import StreamingText from "./StreamingText";

interface Props {
  message: Message;
  animate?: boolean;
  onAnimated?: () => void;
}

export default memo(function ChatMessage({ message, animate, onAnimated }: Props) {
  const isUser = message.role === "user";
  const failed = isErrorBubble(message);
  const streaming = !isUser && !failed && animate;
  return (
    <div
      className={`flex animate-fade-up ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="mb-1 mr-3 flex-shrink-0 self-end">
          <span className="brand-gradient block rounded-full p-1.5 shadow-lg">
            <Logo size="h-4 w-4" />
          </span>
        </div>
      )}
      <div
        className={`rounded-2xl ${
          isUser
            ? "ml-auto max-w-[85%] px-4 py-3 sm:max-w-xl"
            : "min-w-0 flex-1 px-4 py-3 sm:px-5 sm:py-4"
        } text-[15px] ${
          isUser
            ? "bubble-user rounded-br-md"
            : failed
              ? "bubble-error rounded-bl-md"
              : "bubble-assistant rounded-bl-md"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
        ) : streaming ? (
          <StreamingText
            content={message.content}
            onDone={() => onAnimated?.()}
          />
        ) : (
          <div>{renderWithCode(message.content)}</div>
        )}
      </div>
      {isUser && (
        <div className="mb-1 ml-3 flex-shrink-0 self-end">
          <UserButton />
        </div>
      )}
    </div>
  );
});
