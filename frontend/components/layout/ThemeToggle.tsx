"use client";

import { FiMoon, FiSun } from "react-icons/fi";
import { Theme } from "@/hooks/useTheme";

export default function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="icon-btn rounded-lg p-2"
    >
      {theme === "dark" ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
    </button>
  );
}
