import { describe, expect, it } from "vitest";
import { resolveRadarApiUrl } from "./base-url";

describe("resolveRadarApiUrl", () => {
  it.each([
    "http://localhost:8000",
    "http://127.0.0.1:8000/",
    "http://0.0.0.0:8000",
    "http://[::1]:8000",
  ])("não publica endpoint loopback em produção: %s", (configuredUrl) => {
    expect(resolveRadarApiUrl(configuredUrl, "production")).toBe("/api/eco/alt-radar");
  });

  it("mantém localhost explicitamente configurado no desenvolvimento", () => {
    expect(resolveRadarApiUrl("http://localhost:8000/", "development")).toBe(
      "http://localhost:8000",
    );
  });

  it("preserva um endpoint HTTPS válido e remove a barra final", () => {
    expect(resolveRadarApiUrl("https://radar-api.example.com/", "production")).toBe(
      "https://radar-api.example.com",
    );
  });

  it("falha para o proxy same-origin quando a configuração é inválida", () => {
    expect(resolveRadarApiUrl("javascript:alert(1)", "production")).toBe("/api/eco/alt-radar");
  });
});
