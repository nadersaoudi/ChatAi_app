/**
 * App theme (dark/light), persisted in localStorage. Default: dark.
 * Driven by the `.dark` class on <html> (shadcn convention).
 *
 * Hydration-safe: the initial render ALWAYS uses the default (matching the
 * server output). The stored value is adopted in a mount effect — reading
 * localStorage during render would make the first client HTML differ from
 * the SSR HTML and crash hydration. The boot script in layout.tsx already
 * sets the class before paint, so there is no flash.
 */
import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";
const STORAGE_KEY = "codenix-theme";

function readStored(): Theme {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "light"
      ? "light"
      : "dark";
  } catch {
    return "dark";
  }
}

function persist(theme: Theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode — theme just won't persist */
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);

  // Client-only: adopt the stored theme after hydration.
  useEffect(() => {
    setTheme(readStored());
    setReady(true);
  }, []);

  // Apply to the document only after the stored value is adopted.
  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    persist(theme);
  }, [theme, ready]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  return { theme, toggle };
}
