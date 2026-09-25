import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SearchDialog from "@/components/chat/SearchDialog";
import { Conversation } from "@/lib/types";

const CONVS: Conversation[] = [
  {
    id: "1",
    title: "Python recursion",
    messages: [
      { role: "user", content: "Explain recursion please" },
      { role: "assistant", content: "Sure" },
    ],
    timestamp: Date.now(),
    lastUpdated: Date.now(),
  },
  {
    id: "2",
    title: "CV review",
    messages: [{ role: "user", content: "Is my CV good?" }],
    timestamp: Date.now(),
    lastUpdated: Date.now(),
  },
];

describe("SearchDialog", () => {
  it("lists recent conversations and filters by text", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <SearchDialog
        open
        conversations={CONVS}
        onSelect={onSelect}
        onClose={() => undefined}
      />
    );
    expect(screen.getByText("Python recursion")).toBeVisible();
    expect(screen.getByText("CV review")).toBeVisible();

    await user.type(screen.getByPlaceholderText(/search conversations/i), "cv");
    expect(screen.queryByText("Python recursion")).toBeNull();
    expect(screen.getByText("CV review")).toBeVisible();
  });

  it("matches message content and opens on Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <SearchDialog
        open
        conversations={CONVS}
        onSelect={onSelect}
        onClose={() => undefined}
      />
    );
    await user.type(
      screen.getByPlaceholderText(/search conversations/i),
      "recursion please"
    );
    expect(screen.getByText("Python recursion")).toBeVisible();
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith("1");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <SearchDialog
        open
        conversations={CONVS}
        onSelect={() => undefined}
        onClose={onClose}
      />
    );
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });
});
