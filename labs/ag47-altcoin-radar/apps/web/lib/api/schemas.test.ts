import { describe, it, expect } from "vitest";
import { chainSchema, providerStatusSchema, severitySchema, tokenSchema } from "./schemas";

describe("schemas", () => {
  it("parses chain correctly", () => {
    expect(chainSchema.parse("solana")).toBe("solana");
    expect(() => chainSchema.parse("invalid")).toThrow();
  });

  it("parses providerStatus correctly", () => {
    expect(providerStatusSchema.parse("active")).toBe("active");
    expect(() => providerStatusSchema.parse("unknown_status")).toThrow();
  });

  it("parses severity correctly", () => {
    expect(severitySchema.parse("critico")).toBe("critico");
    expect(() => severitySchema.parse("low")).toThrow();
  });

  it("parses token correctly with valid data", () => {
    const validToken = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      chain: "solana",
      contract_address: "0x123",
      symbol: "SOL",
      name: "Solana",
      decimals: 9,
      created_at: "2023-01-01T00:00:00Z",
      first_seen_at: "2023-01-01T00:00:00Z",
      source: "test",
      is_demo: false,
    };

    const parsed = tokenSchema.parse(validToken);
    expect(parsed.name).toBe("Solana");
    expect(parsed.metadata).toEqual({});
  });

  it("fails token parsing with missing required fields", () => {
    const invalidToken = {
      chain: "solana",
    };

    expect(() => tokenSchema.parse(invalidToken)).toThrow();
  });
});
