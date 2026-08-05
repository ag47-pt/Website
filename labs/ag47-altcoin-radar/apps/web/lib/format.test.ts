import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatRatio,
  formatScore,
  formatAge,
  shortenAddress,
  getErrorMessage,
  formatClassification,
} from "./format";

describe("format utilities", () => {
  describe("formatCurrency", () => {
    it("formats null as N/D", () => {
      expect(formatCurrency(null)).toBe("N/D");
    });

    it("formats numbers as currency", () => {
      expect(formatCurrency(1234.56).replace(/\s/g, " ")).toContain("1");
      expect(formatCurrency(1234.56).replace(/\s/g, " ")).toContain("234,56");
    });

    it("formats small numbers with more precision", () => {
      expect(formatCurrency(0.005)).toContain("0,005");
    });
  });

  describe("formatNumber", () => {
    it("formats null as N/D", () => {
      expect(formatNumber(null)).toBe("N/D");
    });

    it("formats numbers correctly", () => {
      expect(formatNumber(1234.56).replace(/\u00A0/g, " ")).toContain("1");
      expect(formatNumber(1234.56)).toContain("234,56");
    });
  });

  describe("formatPercent", () => {
    it("formats null as N/D", () => {
      expect(formatPercent(null)).toBe("N/D");
    });

    it("formats percentages correctly", () => {
      expect(formatPercent(15.5)).toBe("15,5%");
    });

    it("adds sign if requested", () => {
      expect(formatPercent(15.5, true)).toBe("+15,5%");
      expect(formatPercent(-15.5, true)).toBe("-15,5%");
    });
  });

  describe("formatRatio", () => {
    it("formats null as N/D", () => {
      expect(formatRatio(null)).toBe("N/D");
    });

    it("formats ratios as percentages", () => {
      expect(formatRatio(0.155)).toBe("15,5%");
    });
  });

  describe("formatScore", () => {
    it("formats null as N/D", () => {
      expect(formatScore(null)).toBe("N/D");
    });

    it("formats score with 1 decimal", () => {
      expect(formatScore(8.56)).toBe("8,6");
      expect(formatScore(8)).toBe("8,0");
    });
  });

  describe("formatAge", () => {
    it("returns Desconhecido for null", () => {
      expect(formatAge(null)).toBe("Desconhecido");
    });

    it("formats age correctly", () => {
      const now = Date.now();
      const minsAgo = new Date(now - 30 * 60 * 1000).toISOString();
      const hoursAgo = new Date(now - 2 * 60 * 60 * 1000).toISOString();
      const daysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString();

      expect(formatAge(minsAgo)).toBe("30 min");
      expect(formatAge(hoursAgo)).toBe("2 h");
      expect(formatAge(daysAgo)).toBe("3 d");
    });
  });

  describe("shortenAddress", () => {
    it("shortens address correctly", () => {
      expect(shortenAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe("0x123…45678");
    });

    it("does not shorten if address is too small", () => {
      expect(shortenAddress("0x123")).toBe("0x123");
    });
  });

  describe("getErrorMessage", () => {
    it("extracts message from Error object", () => {
      expect(getErrorMessage(new Error("Test error"))).toBe("Test error");
    });

    it("returns default message for non-Error", () => {
      expect(getErrorMessage("String error")).toBe("Ocorreu um erro inesperado.");
    });
  });

  describe("formatClassification", () => {
    it("returns correct label for valid classification", () => {
      expect(formatClassification("oportunidade_forte")).toBe("Oportunidade forte");
      expect(formatClassification("observar")).toBe("Observar");
      expect(formatClassification("especulativo")).toBe("Especulativo");
      expect(formatClassification("risco_elevado")).toBe("Risco elevado");
    });

    it("returns value itself if not found", () => {
      expect(formatClassification("unknown_val")).toBe("unknown_val");
    });

    it("returns default if null", () => {
      expect(formatClassification(null)).toBe("Aguardando score");
    });
  });
});
