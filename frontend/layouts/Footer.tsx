import Link from "next/link";
import Logo from "@/components/layout/Logo";

const COLUMNS: { title: string; links: string[] }[] = [
  { title: "Product", links: ["Features", "Chat", "PDF Q&A", "Changelog"] },
  { title: "Resources", links: ["Documentation", "API", "Status", "Blog"] },
  { title: "Company", links: ["About", "Contact", "Privacy", "Terms"] },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface-soft)]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="rounded-xl border border-[var(--line-strong)] bg-[var(--surface-2)] p-2">
                <Logo />
              </span>
              <span className="text-lg font-semibold">
                Code<span className="text-gradient">nix</span>
              </span>
            </div>
            <p className="text-dim max-w-xs text-sm leading-relaxed">
              Your intelligent AI companion — instant answers, code help, and
              answers grounded in your own PDFs.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="/"
                      className="text-dim text-sm transition-colors hover:text-[var(--accent)]"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-faint mt-12 flex flex-col items-center justify-between gap-3 border-t border-[var(--line)] pt-6 sm:flex-row">
          <p className="text-sm">© 2026 Codenix. All rights reserved.</p>
          <p className="text-sm">Built with Groq-speed inference.</p>
        </div>
      </div>
    </footer>
  );
}
