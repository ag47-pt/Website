import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@/context/ThemeContext";
import { OpportunitiesView } from "./opportunities-view";

// Mock das dependências principais para isolar a view
vi.mock("@/eco/alt-radar/apps/web/components/radar-state", () => ({
  useRadarState: vi.fn(() => ({ search: "", chains: [] })),
}));

vi.mock("@/eco/alt-radar/apps/web/lib/api/query", () => ({
  useOpportunities: vi.fn(() => ({
    data: {
      items: [
        {
          token: {
            id: "1",
            symbol: "BTC",
            name: "Bitcoin",
            contract_address: "0x123",
            chain: "ethereum",
          },
          pair: { created_at: "2026-08-01T00:00:00Z" },
          market: {
            price_usd: 50000,
            price_change_1h: 0.5,
            liquidity_usd: 1000000,
            volume_24h: 500000,
          },
          risk: { risk_score: 5, liquidity_risk: 0, volatility_risk: 0 },
          social: { sentiment: "neutral", social_score: 5, mentions_24h: 10 },
          score: { final_score: 8.5, classification: "Oportunidade forte" },
          holders_count: 1000,
          updated_at: "2026-08-05T00:00:00Z",
          watchlisted: false,
        },
      ],
      pages: 1,
      total: 1,
    },
    isLoading: false,
    isError: false,
  })),
  useWatchlistMutation: vi.fn(() => ({ mutate: vi.fn() })),
}));

// Mock dos painéis que não são o foco deste teste
vi.mock("@/eco/alt-radar/apps/web/components/dashboard/risk-panel", () => ({
  RiskPanel: () => <div data-testid="risk-panel" />,
}));
vi.mock("@/eco/alt-radar/apps/web/components/dashboard/social-panel", () => ({
  SocialPanel: () => <div data-testid="social-panel" />,
}));
vi.mock("@/eco/alt-radar/apps/web/components/dashboard/token-analysis", () => ({
  TokenAnalysis: () => <div data-testid="token-analysis" />,
}));

function renderView() {
  return render(
    <ThemeProvider>
      <OpportunitiesView />
    </ThemeProvider>,
  );
}

describe("OpportunitiesView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza o estado inicial corretamente (carregamento da lista)", () => {
    renderView();

    // Verifica elementos base
    expect(screen.getByText("Oportunidades")).toBeInTheDocument();
    expect(screen.getByTestId("opportunities-panel")).toBeInTheDocument();

    // Verifica que carregou o mock
    expect(screen.getAllByText("BTC").length).toBeGreaterThan(0);
  });

  it("abre os detalhes do ativo ao clicar na linha", () => {
    renderView();

    const row = screen.getAllByTestId("opportunity-row-btc")[0];
    fireEvent.click(row);

    // paineis auxiliares sao renderizados
    expect(screen.getAllByTestId("token-analysis")[0]).toBeInTheDocument();
    expect(screen.getAllByTestId("social-panel")[0]).toBeInTheDocument();
    expect(screen.getAllByTestId("risk-panel")[0]).toBeInTheDocument();
  });

  it("permite interação de pesquisa e filtros (abre painel de filtros)", () => {
    renderView();

    const filtersBtn = screen.getAllByRole("button", { name: /Filtros/i })[0];
    fireEvent.click(filtersBtn);

    // Ao abrir filtros, as selects aparecem
    expect(screen.getByTestId("score-filter")).toBeInTheDocument();
    expect(screen.getByTestId("risk-filter")).toBeInTheDocument();
  });

  it("mantém a watchlist visível, mas bloqueada no portal público", () => {
    renderView();

    const watchlistButtons = screen.getAllByTestId("watchlist-toggle-btc");
    expect(watchlistButtons.length).toBeGreaterThan(0);
    watchlistButtons.forEach((button) => {
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("title", expect.stringMatching(/operador/i));
    });
  });
});
