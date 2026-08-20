import { describe, expect, it } from "vitest";
import {
  RADAR_BROWSER_API_BASE,
  SYSTEM_STATUS_STALE_AFTER_MS,
  isSystemStatusStale,
} from "./system-workspace";

describe("system workspace operational truth", () => {
  it("uses the same-origin public proxy when no public override is configured", () => {
    expect(RADAR_BROWSER_API_BASE).toBe("/api/eco/alt-radar");
    expect(RADAR_BROWSER_API_BASE).not.toContain("localhost");
  });

  it("marks absent, invalid and older synchronization timestamps as stale", () => {
    const now = Date.parse("2026-08-20T12:00:00.000Z");

    expect(isSystemStatusStale(null, now)).toBe(true);
    expect(isSystemStatusStale("invalid", now)).toBe(true);
    expect(
      isSystemStatusStale(new Date(now - SYSTEM_STATUS_STALE_AFTER_MS - 1).toISOString(), now),
    ).toBe(true);
    expect(
      isSystemStatusStale(new Date(now - SYSTEM_STATUS_STALE_AFTER_MS).toISOString(), now),
    ).toBe(false);
  });
});
