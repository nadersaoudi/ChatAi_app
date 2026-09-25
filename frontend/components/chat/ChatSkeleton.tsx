/** Pulsing placeholder bubbles shown while history loads. */
export default function ChatSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto" aria-label="Loading conversations">
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-8 sm:px-6">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex animate-pulse ${i % 2 ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`skeleton-bar rounded-2xl ${
                i % 2
                  ? "h-12 w-2/5 rounded-br-md"
                  : "h-20 w-3/5 rounded-bl-md"
              }`}
            />
          </div>
        ))}
        <p className="text-faint pt-2 text-center text-xs">
          Loading your conversations…
        </p>
      </div>
    </div>
  );
}
