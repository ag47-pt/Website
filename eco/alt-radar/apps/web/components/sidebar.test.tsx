import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Sidebar } from "./sidebar";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("tab=dashboard"),
  usePathname: () => "/oportunidades",
}));

vi.mock("@/eco/alt-radar/apps/web/lib/api/query", () => ({
  useEvolution: () => ({ data: undefined }),
}));

vi.mock("@/eco/alt-radar/apps/web/lib/use-eco-theme", () => ({
  useEcoTheme: () => ({ primary: "#c7ff00" }),
}));

vi.mock("./radar-state", () => ({
  useRadarState: () => ({
    isNavigationOpen: false,
    setNavigationOpen: vi.fn(),
    isSidebarCollapsed: false,
    toggleSidebar: vi.fn(),
    setSidebarWidth: vi.fn(),
  }),
}));

afterEach(cleanup);

describe("Sidebar", () => {
  it("navega pelas rotas do app standalone por padrão", () => {
    render(<Sidebar />);

    expect(screen.getByTestId("nav-oportunidades")).toHaveAttribute("href", "/oportunidades");
    expect(screen.getByTestId("nav-oportunidades")).toHaveAttribute("aria-current", "page");
    expect(screen.getByTestId("nav-landing")).toHaveAttribute("href", "/");
    expect(screen.queryByText("LIVE")).not.toBeInTheDocument();
  });

  it("preserva os query tabs quando incorporado no host", () => {
    render(<Sidebar navigationMode="embedded" />);

    expect(screen.getByTestId("nav-oportunidades")).toHaveAttribute(
      "href",
      "/eco/alt-radar?tab=oportunidades",
    );
    expect(screen.getByTestId("nav-dashboard")).toHaveAttribute("aria-current", "page");
    expect(screen.getByTestId("nav-landing")).toHaveAttribute("href", "/eco/alt-radar");
  });
});
