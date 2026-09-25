import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ModeSwitch from "@/components/chat/ModeSwitch";

describe("ModeSwitch", () => {
  it("renders both modes and reports selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ModeSwitch mode="ask" onChange={onChange} />);
    expect(screen.getByRole("tab", { name: "Ask" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await user.click(screen.getByRole("tab", { name: "Agent" }));
    expect(onChange).toHaveBeenCalledWith("agent");
  });

  it("marks agent active", () => {
    render(<ModeSwitch mode="agent" onChange={() => undefined} />);
    expect(screen.getByRole("tab", { name: "Agent" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});
