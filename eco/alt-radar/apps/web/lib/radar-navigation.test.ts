import { describe, expect, it } from "vitest";
import { getRadarHref, getStandaloneRadarTab } from "./radar-navigation";

describe("getRadarHref", () => {
  it("usa as rotas reais do app standalone por padrão", () => {
    expect(getRadarHref("dashboard", "standalone")).toBe("/dashboard");
    expect(getRadarHref("oportunidades", "standalone")).toBe("/oportunidades");
    expect(getRadarHref("landing", "standalone")).toBe("/");
  });

  it("preserva os query tabs do host embedded", () => {
    expect(getRadarHref("dashboard", "embedded")).toBe("/eco/alt-radar?tab=dashboard");
    expect(getRadarHref("oportunidades", "embedded")).toBe("/eco/alt-radar?tab=oportunidades");
    expect(getRadarHref("landing", "embedded")).toBe("/eco/alt-radar");
  });
});

describe("getStandaloneRadarTab", () => {
  it("deriva o item ativo da rota standalone", () => {
    expect(getStandaloneRadarTab("/oportunidades")).toBe("oportunidades");
    expect(getStandaloneRadarTab("/configuracoes/")).toBe("configuracoes");
    expect(getStandaloneRadarTab("/")).toBe("landing");
  });
});
