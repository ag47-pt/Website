import { afterEach, describe, expect, it, vi } from "vitest";
import { radarApi } from "./client";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("public Radar API client", () => {
  it.each([
    ["alert update", () => radarApi.updateAlert("alert-id", "read")],
    ["watchlist add", () => radarApi.addToWatchlist("token-id")],
    ["watchlist removal", () => radarApi.removeFromWatchlist("token-id")],
    ["provider reset", () => radarApi.resetProviderCircuit("dexscreener")],
    [
      "notification settings",
      () =>
        radarApi.updateUserNotificationSettings({
          min_severity: 0.5,
          min_confidence: 0.5,
          allowed_chains: ["bsc"],
        }),
    ],
    ["webhook test", () => radarApi.testWebhook()],
    ["weight optimization", () => radarApi.optimizeWeights(24)],
    ["weight application", () => radarApi.applyWeights({ momentum: 1 })],
  ])("blocks %s before any network request", async (_label, action) => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(action()).rejects.toMatchObject({
      name: "ApiError",
      status: 405,
      message: "O portal público do Radar é somente leitura.",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps GET consultations available", async () => {
    const payload = {
      phase: "Hardening",
      phase_title: "Estabilização operacional",
      now: "Portal público read-only",
      completed_steps: 1,
      total_steps: 1,
      goal: "Consultas públicas seguras",
    };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(payload), {
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(radarApi.getEvolution()).resolves.toEqual(payload);
    expect(fetchMock).toHaveBeenCalledOnce();
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(init.method ?? "GET").toBe("GET");
  });
});
