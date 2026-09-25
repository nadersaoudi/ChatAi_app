/** Tiny version chip shown next to the brand name. */
import { APP_VERSION } from "@/lib/config";

export default function VersionBadge() {
  return (
    <span
      title={`Codenix v${APP_VERSION}`}
      className="rounded-md border border-[var(--border)] bg-[var(--secondary)] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--muted-foreground)]"
    >
      v{APP_VERSION}
    </span>
  );
}
