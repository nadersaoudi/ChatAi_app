import { afterEach, describe, expect, it, vi, Mock } from "vitest";
import { ApiError, askChat, fetchModels } from "@/lib/api";

type FetchMock = Mock<
  (url: string | URL | Request, init?: RequestInit) => Promise<Response>
>;

function mockFetch(body: unknown, status = 200): FetchMock {
  const fetchMock: FetchMock = vi.fn(
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
      })
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("askChat", () => {
  it("posts messages + model and returns the reply", async () => {
    const fetchMock = mockFetch({ response: "hi", model: "m" });
    const data = await askChat([{ role: "user", content: "hello" }], "my-model");
    expect(data).toEqual({ response: "hi", model: "m" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/ask");
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({
      messages: [{ role: "user", content: "hello" }],
      model: "my-model",
    });
  });

  it("sends model: null when auto", async () => {
    const fetchMock = mockFetch({ response: "hi" });
    await askChat([{ role: "user", content: "hello" }]);
    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse((init as RequestInit).body as string).model).toBeNull();
  });
});

describe("ApiError", () => {
  it("carries backend detail + status", async () => {
    mockFetch({ detail: "provider exploded" }, 502);
    const err = await askChat([{ role: "user", content: "x" }]).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(502);
    expect((err as ApiError).message).toBe("provider exploded");
  });

  it("falls back to the legacy error field", async () => {
    mockFetch({ error: "gone" }, 404);
    const err = await askChat([{ role: "user", content: "x" }]).catch((e) => e);
    expect((err as ApiError).message).toBe("gone");
  });
});

describe("fetchModels", () => {
  it("returns the model list", async () => {
    mockFetch({ models: [{ id: "a", label: "A" }], default: "a" });
    await expect(fetchModels()).resolves.toEqual({
      models: [{ id: "a", label: "A" }],
      default: "a",
    });
  });
});
