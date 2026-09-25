"use client";

import Link from "next/link";
import Logo from "@/components/layout/Logo";
import ThemeToggle from "@/components/layout/ThemeToggle";
import VersionBadge from "@/components/layout/VersionBadge";
import { useTheme } from "@/hooks/useTheme";

/**
 * Public site header — intentionally Clerk-free so the landing page
 * never downloads the auth bundle. Signed-in users land on /dashboard
 * via the sign-in redirect anyway.
 */
const NAV = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const { theme, toggle } = useTheme();
  return (
    <header className="glass-bar sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="rounded-xl border border-[var(--line-strong)] bg-[var(--surface-2)] p-2">
            <Logo />
          </span>
          <span className="flex items-center gap-1.5 text-lg font-semibold tracking-tight">
            <span>
              Code<span className="text-gradient">nix</span>
            </span>
            <VersionBadge />
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-dim text-sm transition-colors hover:text-[var(--accent)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} onToggle={toggle} />
          <Link
            href="/sign-in"
            className="text-dim rounded-lg px-4 py-2 text-sm transition-colors hover:text-[var(--txt)]"
          >
            Log in
          </Link>
          <Link
            href="/sign-in"
            className="btn-gradient rounded-lg px-4 py-2 text-sm font-semibold shadow-lg"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
