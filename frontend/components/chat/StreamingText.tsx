/**
 * Typewriter reveal for a fresh assistant reply. Click to skip to full text.
 */
import { useEffect, useRef, useState } from "react";
import { renderWithCode } from "./renderWithCode";

const CHARS_PER_TICK = 14;
const TICK_MS = 16;

export default function StreamingText({
  content,
  onDone,
}: {
  content: string;
  onDone: () => void;
}) {
  const [shown, setShown] = useState(0);
  const firedRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setShown(0);
    firedRef.current = false;
  }, [content]);

  useEffect(() => {
    if (shown >= content.length) {
      if (!firedRef.current) {
        firedRef.current = true;
        onDoneRef.current();
      }
      return;
    }
    const timer = setTimeout(
      () => setShown((c) => Math.min(c + CHARS_PER_TICK, content.length)),
      TICK_MS
    );
    return () => clearTimeout(timer);
  }, [shown, content]);

  const complete = shown >= content.length;

  return (
    <div
      className="cursor-default text-sm"
      title={complete ? undefined : "Click to show full reply"}
      onClick={() => setShown(content.length)}
    >
      {renderWithCode(content.slice(0, shown))}
      {!complete && (
        <span className="ml-0.5 inline-block h-4 w-[7px] animate-pulse bg-[var(--accent)] align-text-bottom" />
      )}
    </div>
  );
}
