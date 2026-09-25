"use client";

/** Dashboard top bar: sidebar toggle, width control, theme, new chat. */
import { UserButton } from "@clerk/nextjs";
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiMaximize2,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import Logo from "@/components/layout/Logo";
import ThemeToggle from "@/components/layout/ThemeToggle";
import VersionBadge from "@/components/layout/VersionBadge";
import { Theme } from "@/hooks/useTheme";

export type ContentWidth = "narrow" | "wide" | "full";
export const WIDTH_ORDER: ContentWidth[] = ["narrow", "wide", "full"];

interface Props {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  width: ContentWidth;
  onCycleWidth: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  modelLabel: string;
  onSearch: () => void;
  onNew: () => void;
}

export default function ChatHeader({
  sidebarOpen,
  onToggleSidebar,
  width,
  onCycleWidth,
  theme,
  onToggleTheme,
  modelLabel,
  onSearch,
  onNew,
}: Props) {
  return (
    <header className="glass-bar flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleSidebar}
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="icon-btn rounded-lg p-2"
        >
          {sidebarOpen ? (
            <FiChevronsLeft className="h-5 w-5" />
          ) : (
            <FiChevronsRight className="h-5 w-5" />
          )}
        </button>
        <span className="rounded-xl border border-[var(--line-strong)] bg-[var(--surface-2)] p-1.5">
          <Logo />
        </span>
        <div className="leading-tight">
          <p className="flex items-center gap-1.5 font-semibold">
            <span>
              Code<span className="text-gradient">nix</span>
            </span>
            <VersionBadge />
          </p>
          <p className="text-dim flex items-center gap-1.5 text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            {modelLabel} · Groq
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          onClick={onCycleWidth}
          title={`Chat width: ${width} (click to change)`}
          className="icon-btn rounded-lg p-2"
        >
          <FiMaximize2 className="h-5 w-5" />
        </button>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <button
          onClick={onSearch}
          title="Search conversations (Ctrl+K)"
          className="icon-btn rounded-lg p-2"
        >
          <FiSearch className="h-5 w-5" />
        </button>
        <button
          onClick={onNew}
          title="New chat"
          className="icon-btn rounded-lg p-2"
        >
          <FiPlus className="h-5 w-5" />
        </button>
        <UserButton />
      </div>
    </header>
  );
}
