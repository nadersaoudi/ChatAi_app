import ChatSkeleton from "@/components/chat/ChatSkeleton";

/** Route-level fallback shown while the dashboard chunk loads. */
export default function DashboardLoading() {
  return (
    <div className="app-bg flex h-screen flex-col">
      <div className="glass-bar flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="skeleton-bar h-8 w-40 animate-pulse rounded-lg" />
        <div className="skeleton-bar h-8 w-8 animate-pulse rounded-full" />
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="hidden w-72 flex-col gap-2 border-r border-[var(--line)] bg-[var(--surface-soft)] p-3 sm:flex">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton-bar h-14 animate-pulse rounded-xl"
            />
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <ChatSkeleton />
        </div>
      </div>
    </div>
  );
}
