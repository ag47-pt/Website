import { afterEach, describe, expect, it, vi } from "vitest";
import { DELETE, GET, PATCH, POST } from "../../../../../../app/api/eco/alt-radar/[...path]/route";

function routeContext(path: string[]) {
  return { params: Promise.resolve({ path }) };
}

function proxyRequest(input: string, init?: RequestInit) {
  const request = new Request(input, init);
  return Object.assign(request, { nextUrl: new URL(input) }) as unknown as Parameters<
    typeof GET
  >[0];
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("Alt Radar server proxy", () => {
  it("uses the server-only upstream URL configured at runtime", async () => {
    vi.stubEnv("ALT_RADAR_API_URL", "https://radar.internal.example/base/");
    vi.resetModules();
    const { GET: configuredGet } =
      await import("../../../../../../app/api/eco/alt-radar/[...path]/route");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await configuredGet(
      proxyRequest("https://ag47.pt/api/eco/alt-radar/health"),
      routeContext(["health"]),
    );

    expect(fetchMock.mock.calls[0]?.[0]).toBe("https://radar.internal.example/base/health");
  });

  it("preserves GET query strings and forwards only the public API key", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json", "X-Internal": "hidden" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const request = proxyRequest(
      "https://ag47.pt/api/eco/alt-radar/api/v1/opportunities?page=2&chain=bsc",
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer must-not-leak",
          Cookie: "session=must-not-leak",
          "x-ag47-api-key": "public-operator-key",
        },
      },
    );

    const response = await GET(request, routeContext(["api", "v1", "opportunities"]));
    const [targetUrl, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const forwardedHeaders = new Headers(init.headers);

    expect(targetUrl).toMatch(/\/api\/v1\/opportunities\?page=2&chain=bsc$/);
    expect(init.method).toBe("GET");
    expect(forwardedHeaders.get("x-ag47-api-key")).toBe("public-operator-key");
    expect(forwardedHeaders.has("authorization")).toBe(false);
    expect(forwardedHeaders.has("cookie")).toBe(false);
    expect(response.status).toBe(200);
    expect(response.headers.get("x-ag47-response-origin")).toBe("upstream");
    expect(response.headers.get("x-ag47-fallback")).toBe("none");
    expect(response.headers.has("x-internal")).toBe(false);
    await expect(response.json()).resolves.toEqual({ status: "ok" });
  });

  it.each([
    ["POST", POST],
    ["PATCH", PATCH],
    ["DELETE", DELETE],
  ] as const)(
    "blocks public %s requests without contacting the upstream",
    async (method, handler) => {
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);
      const request = proxyRequest("https://ag47.pt/api/eco/alt-radar/api/v1/resource", {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "DELETE" ? undefined : JSON.stringify({ enabled: true }),
      });

      const response = await handler(request, routeContext(["api", "v1", "resource"]));
      const body = (await response.json()) as { mode: string; success: boolean };

      expect(fetchMock).not.toHaveBeenCalled();
      expect(response.status).toBe(405);
      expect(response.headers.get("allow")).toBe("GET");
      expect(response.headers.get("x-ag47-access-mode")).toBe("read-only");
      expect(body).toEqual(expect.objectContaining({ mode: "read_only", success: false }));
    },
  );

  it("preserves upstream client errors instead of replacing them with demo data", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ detail: "Credencial inválida" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(
      proxyRequest("https://ag47.pt/api/eco/alt-radar/api/v1/system/status"),
      routeContext(["api", "v1", "system", "status"]),
    );

    expect(response.status).toBe(401);
    expect(response.headers.get("x-ag47-fallback")).toBe("none");
    await expect(response.json()).resolves.toEqual({ detail: "Credencial inválida" });
  });

  it.each([
    [new TypeError("network unavailable"), 502],
    [new DOMException("timed out", "TimeoutError"), 504],
  ])("returns an explicit unavailable state when the upstream fails", async (error, status) => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(error));

    const response = await GET(
      proxyRequest("https://ag47.pt/api/eco/alt-radar/api/v1/system/status"),
      routeContext(["api", "v1", "system", "status"]),
    );
    const body = (await response.json()) as { mode: string; success: boolean };

    expect(response.status).toBe(status);
    expect(response.headers.get("x-ag47-response-origin")).toBe("proxy");
    expect(response.headers.get("x-ag47-fallback")).toBe("unavailable");
    expect(body).toMatchObject({ mode: "unavailable", success: false });
    expect(body).not.toHaveProperty("demo_mode");
  });
});
