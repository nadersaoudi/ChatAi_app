import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { usePdfAttachment } from "@/hooks/usePdfAttachment";

const pdf = (size = 1024) =>
  new File([new Uint8Array(size)], "doc.pdf", { type: "application/pdf" });

describe("usePdfAttachment", () => {
  it("selects a valid pdf as pending (no upload)", () => {
    const { result } = renderHook(() => usePdfAttachment());
    act(() => result.current.select(pdf()));
    expect(result.current.hasFile).toBe(true);
    expect(result.current.status).toBe("ready");
    expect(result.current.file?.name).toBe("doc.pdf");
  });

  it("rejects non-pdf files", () => {
    const { result } = renderHook(() => usePdfAttachment());
    act(() =>
      result.current.select(new File(["x"], "a.txt", { type: "text/plain" }))
    );
    expect(result.current.hasFile).toBe(false);
    expect(result.current.status).toBe("error");
    expect(result.current.notice).toMatch(/\.pdf/);
  });

  it("rejects oversized files", () => {
    const { result } = renderHook(() => usePdfAttachment());
    act(() => result.current.select(pdf(21 * 1024 * 1024)));
    expect(result.current.status).toBe("error");
    expect(result.current.notice).toMatch(/20 MB/);
  });

  it("remove() resets to idle", () => {
    const { result } = renderHook(() => usePdfAttachment());
    act(() => result.current.select(pdf()));
    act(() => result.current.remove());
    expect(result.current.hasFile).toBe(false);
    expect(result.current.status).toBe("idle");
    expect(result.current.progress).toBe(0);
  });
});
