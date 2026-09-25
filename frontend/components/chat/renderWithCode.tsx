"use client";

/**
 * Lightweight markdown for assistant messages: code fences (with copy),
 * headings, bold/italic/inline-code, bullet + numbered lists, tables,
 * quotes. Code fences are split out first so markup inside code is kept raw.
 */
import { useState } from "react";
// Light build + only the languages we register below (the full Prism build
// with every language is several hundred KB — the biggest bundle offender).
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import markup from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import { FiCheck, FiCopy } from "react-icons/fi";
import type { ReactNode } from "react";

SyntaxHighlighter.registerLanguage("markup", markup);
SyntaxHighlighter.registerLanguage("html", markup);
SyntaxHighlighter.registerLanguage("xml", markup);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("ts", typescript);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("py", python);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("sh", bash);
SyntaxHighlighter.registerLanguage("shell", bash);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("yml", yaml);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("md", markdown);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("c++", cpp);

const KNOWN_LANGUAGES = new Set([
  "markup", "html", "xml", "css", "javascript", "js", "jsx",
  "typescript", "ts", "tsx", "python", "py", "json", "bash", "sh",
  "shell", "sql", "yaml", "yml", "markdown", "md", "java", "cpp", "c++",
]);

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-black/40">
      <div className="flex items-center justify-between bg-black/30 px-3 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--dim)]">
          {language}
        </span>
        <button
          onClick={copy}
          title={copied ? "Copied!" : "Copy code"}
          className="flex items-center gap-1 text-[11px] text-[var(--dim)] transition-colors hover:text-white"
        >
          {copied ? <FiCheck className="text-[var(--accent)]" /> : <FiCopy />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {KNOWN_LANGUAGES.has(language) ? (
        <SyntaxHighlighter
          language={language}
          style={atomDark}
          customStyle={{ margin: 0, padding: "1rem", fontSize: "0.85rem" }}
        >
          {code}
        </SyntaxHighlighter>
      ) : (
        <pre className="m-0 overflow-x-auto bg-[#2d2d2d] p-4 font-mono text-[0.85rem] text-slate-200">
          {code}
        </pre>
      )}
    </div>
  );
}

const INLINE_RE = /(`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g;

function renderInline(text: string, key: string): ReactNode[] {
  return text.split(INLINE_RE).map((part, i) => {
    const k = `${key}-in${i}`;
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={k}
          className="rounded bg-black/30 px-1 py-0.5 font-mono text-[0.85em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={k} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={k}>{part.slice(1, -1)}</em>;
    }
    return <span key={k}>{part}</span>;
  });
}

function isTableRow(line: string): boolean {
  return /^\s*\|.*\|\s*$/.test(line);
}

function isTableSep(line: string): boolean {
  return /^\s*\|?[\s:|-]+\|?[\s:|-]*$/.test(line) && line.includes("-");
}

function renderTable(lines: string[], key: string): ReactNode {
  const rows = lines
    .map((l) =>
      l
        .trim()
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((c) => c.trim())
    )
    .filter((cells) => !(cells.length === 1 && cells[0] === ""));
  const body = rows.length > 1 && isTableSep(lines[1]) ? rows.slice(0, 1).concat(rows.slice(2)) : rows;
  const hasHeader = rows.length > 1 && isTableSep(lines[1]);
  const head = hasHeader ? body[0] : null;
  const rest = hasHeader ? body.slice(1) : body;
  const cellCls = "border border-[var(--border)] px-2 py-1 text-left align-top";
  return (
    <div key={key} className="my-2 overflow-x-auto">
      <table className="w-full border-collapse text-[13px] leading-relaxed">
        {head && (
          <thead>
            <tr>
              {head.map((c, i) => (
                <th key={i} className={`${cellCls} bg-[var(--secondary)] font-semibold`}>
                  {renderInline(c, `${key}-h${i}`)}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rest.map((cells, r) => (
            <tr key={r}>
              {cells.map((c, i) => (
                <td key={i} className={cellCls}>
                  {renderInline(c, `${key}-r${r}c${i}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Render one non-code segment (headings, lists, tables, paragraphs). */
function renderRichText(segment: string, key: string): ReactNode {
  const lines = segment.split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let n = 0;
  const push = (node: ReactNode) => {
    out.push(node);
    n += 1;
  };

  while (i < lines.length) {
    const line = lines[i];
    const k = `${key}-b${n}`;

    if (!line.trim()) {
      i += 1;
      continue;
    }
    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const cls =
        level <= 2
          ? "mb-1 mt-3 text-base font-bold"
          : "mb-1 mt-2 text-sm font-bold";
      push(
        <p key={k} className={cls}>
          {renderInline(heading[2], k)}
        </p>
      );
      i += 1;
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      push(<hr key={k} className="my-3 border-[var(--line)]" />);
      i += 1;
      continue;
    }
    if (line.trim().startsWith(">")) {
      push(
        <p
          key={k}
          className="my-1 border-l-2 border-[var(--line-strong)] pl-3 text-[var(--dim)]"
        >
          {renderInline(line.trim().replace(/^>\s?/, ""), k)}
        </p>
      );
      i += 1;
      continue;
    }
    if (isTableRow(line)) {
      const group: string[] = [];
      while (i < lines.length && (isTableRow(lines[i]) || isTableSep(lines[i]))) {
        group.push(lines[i]);
        i += 1;
      }
      push(renderTable(group, k));
      continue;
    }
    const bullet = line.match(/^\s*[-*+]\s+(.*)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet || ordered) {
      const items: { ordered: boolean; text: string }[] = [];
      while (i < lines.length) {
        const b = lines[i].match(/^\s*[-*+]\s+(.*)$/);
        const o = lines[i].match(/^\s*\d+[.)]\s+(.*)$/);
        if (b) items.push({ ordered: false, text: b[1] });
        else if (o) items.push({ ordered: true, text: o[1] });
        else break;
        i += 1;
      }
      const List = items[0].ordered ? "ol" : "ul";
      push(
        <List
          key={k}
          className={`${items[0].ordered ? "list-decimal" : "list-disc"} my-1 space-y-1 pl-5`}
        >
          {items.map((it, j) => (
            <li key={j}>{renderInline(it.text, `${k}-li${j}`)}</li>
          ))}
        </List>
      );
      continue;
    }
    push(
      <p key={k} className="my-1 whitespace-pre-line leading-relaxed">
        {renderInline(line, k)}
      </p>
    );
    i += 1;
  }
  return out;
}

export function renderWithCode(content: string): ReactNode {
  const segments = content.split("```");
  if (segments.length === 1) return renderRichText(content, "s0");
  return segments.map((segment, i) => {
    if (i % 2 === 0) {
      return segment ? <span key={`text-${i}`}>{renderRichText(segment, `s${i}`)}</span> : null;
    }
    const match = segment.match(/^(\w+)\n/);
    const language = match ? match[1] : "code";
    const code = match ? segment.slice(match[0].length) : segment;
    return <CodeBlock key={`code-${i}`} language={language} code={code} />;
  });
}
