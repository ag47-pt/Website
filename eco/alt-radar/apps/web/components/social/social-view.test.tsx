import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "@/context/ThemeContext";
import { SocialView } from "./social-view";

vi.mock("@/eco/alt-radar/apps/web/lib/api/query", () => ({
  useOpportunities: () => ({
    data: {
      items: [
        {
          token: {
            id: "00000000-0000-4000-8000-000000000001",
            chain: "solana",
            symbol: "SOL",
          },
          market: { price_usd: 145.25 },
        },
      ],
    },
  }),
}));

vi.mock("@/eco/alt-radar/apps/web/components/dashboard/social-panel", () => ({
  SocialPanel: () => <div data-testid="social-panel" />,
}));

vi.mock("@/eco/alt-radar/apps/web/components/dashboard/smart-money-tracker", () => ({
  SmartMoneyTracker: () => <div data-testid="smart-money-tracker" />,
}));

describe("SocialView", () => {
  it("não apresenta Smart Money ou dados sociais como live sem provider", () => {
    render(
      <ThemeProvider>
        <SocialView />
      </ThemeProvider>,
    );

    expect(screen.getByText(/não configurado/i)).toBeInTheDocument();
    expect(screen.getByText(/provider autorizado/i)).toBeInTheDocument();
    expect(screen.queryByText(/smart_money_active/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/tempo real/i)).not.toBeInTheDocument();
  });
});
