import { describe, expect, it } from "vitest";
import {
  AGENT_SYSTEM,
  conversationTitle,
  errorText,
  formatRelativeTime,
  isErrorBubble,
  toApiPayload,
  withRagContext,
} from "@/lib/messages";
import { ChatMessage } from "@/lib/types";

const user = (content: string): ChatMessage => ({ role: "user", content });
const ai = (content: string): ChatMessage => ({ role: "assistant", content });

describe("isErrorBubble", () => {
  it("flags error bubbles by marker and flag", () => {
    expect(isErrorBubble({ role: "assistant", content: "❌ Failed", error: true })).toBe(true);
    expect(isErrorBubble(ai("❌ Failed"))).toBe(true);
    expect(isErrorBubble(ai("All good"))).toBe(false);
    expect(isErrorBubble(user("❌ not an error bubble?"))).toBe(true); // prefix wins
  });
});

describe("toApiPayload", () => {
  it("drops error bubbles and empty messages, keeps role+content", () => {
    const out = toApiPayload([
      ai("Hello!"),
      { role: "assistant", content: "❌ Failed", error: true },
      user("  "),
      user("Hi there"),
    ]);
    expect(out).toEqual([
      { role: "assistant", content: "Hello!" },
      { role: "user", content: "Hi there" },
    ]);
  });

  it("caps history at 50 messages (tail kept)", () => {
    const many = Array.from({ length: 60 }, (_, i) => user(`m${i}`));
    const out = toApiPayload(many);
    expect(out).toHaveLength(50);
    expect(out[0]).toEqual({ role: "user", content: "m10" });
    expect(out[49]).toEqual({ role: "user", content: "m59" });
  });
});

describe("withRagContext", () => {
  it("always prepends house rules as system prompt", () => {
    const msgs = [ai("Hi"), user("Hello")];
    const out = withRagContext(msgs, "");
    expect(out[0].role).toBe("system");
    expect(out[0].content).toContain("same language");
    expect(out.slice(1)).toEqual([
      { role: "assistant", content: "Hi" },
      { role: "user", content: "Hello" },
    ]);
  });

  it("prepends a system prompt with rules + pdf context", () => {
    const out = withRagContext([user("Summarize")], "chunk one");
    expect(out[0].role).toBe("system");
    expect(out[0].content).toContain("same language");
    expect(out[0].content).toContain("[p. N]");
    expect(out[0].content).toContain("chunk one");
    expect(out[1]).toEqual({ role: "user", content: "Summarize" });
  });

  it("includes the agent instruction in agent mode", () => {
    const out = withRagContext([user("Build X")], "", AGENT_SYSTEM);
    expect(out[0].role).toBe("system");
    expect(out[0].content).toContain("autonomous coding agent");
  });
});

describe("conversationTitle", () => {
  it("uses the first user message, truncated", () => {
    expect(conversationTitle([ai("Hi"), user("Short")])).toBe("Short");
    expect(conversationTitle([user("x".repeat(40))])).toBe(`${"x".repeat(30)}…`);
    expect(conversationTitle([ai("Hi")])).toBe("New Chat");
  });
});

describe("formatRelativeTime", () => {
  const now = Date.now();
  it("formats buckets", () => {
    expect(formatRelativeTime(now)).toBe("Just now");
    expect(formatRelativeTime(now - 5 * 3600_000)).toBe("5 hours ago");
    expect(formatRelativeTime(now - 30 * 3600_000)).toBe("Yesterday");
    expect(formatRelativeTime(now - 3 * 24 * 3600_000)).toBe("3 days ago");
    expect(formatRelativeTime(now - 14 * 24 * 3600_000)).toBe("2 weeks ago");
  });
});

describe("errorText", () => {
  it("includes the backend detail when present", () => {
    expect(errorText(new Error("boom"))).toContain("boom");
    expect(errorText(new Error("boom")).startsWith("❌")).toBe(true);
    expect(errorText("weird")).toContain("try again");
  });
});
