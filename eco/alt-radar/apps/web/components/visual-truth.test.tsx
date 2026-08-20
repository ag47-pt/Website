import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "@/context/ThemeContext";
import type { Market, Token } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { ChainCapitalFlow } from "./dashboard/chain-capital-flow";
import { LiquidityDepthChart } from "./dashboard/liquidity-depth-chart";
import { getObservedPositionValuation, type VirtualPosition } from "./dashboard/paper-trading";
import { SwapSimulator } from "./dashboard/swap-simulator";
import { LogoMark } from "./logo-mark";
import { Sparkline } from "./shared/sparkline";

const token = {
  id: "00000000-0000-4000-8000-000000000001",
  chain: "solana",
  contract_address: "So11111111111111111111111111111111111111112",
  symbol: "SOL",
  name: "Solana",
  decimals: 9,
  created_at: "2026-08-20T00:00:00Z",
  first_seen_at: "2026-08-20T00:00:00Z",
  metadata: {},
  source: "geckoterminal",
  is_demo: false,
} satisfies Token;

const market = {
  id: "00000000-0000-4000-8000-000000000002",
  pair_id: "00000000-0000-4000-8000-000000000003",
  price_usd: 145.25,
  liquidity_usd: 2_500_000,
  volume_5m: 50_000,
  volume_1h: 400_000,
  volume_24h: 5_000_000,
  price_change_5m: 0.2,
  price_change_1h: 1.1,
  price_change_24h: 12.3,
  market_cap: null,
  fdv: null,
  buyers: 120,
  sellers: 100,
  captured_at: "2026-08-20T00:00:00Z",
  source: "geckoterminal",
  data_quality: "high",
  is_demo: false,
} satisfies Market;

function withTheme(node: React.ReactNode) {
  return <ThemeProvider>{node}</ThemeProvider>;
}

describe("verdade visual das métricas", () => {
  it("mantém fluxo cross-chain como indisponível sem números fabricados", () => {
    render(withTheme(<ChainCapitalFlow />));

    expect(screen.getByText(/fonte não configurada/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/distribuição de capital indisponível/i)).toBeInTheDocument();
    expect(screen.queryByText(/29\.5M|62\.4%|14\.2M/)).not.toBeInTheDocument();
  });

  it("mostra somente a variação escalar e identifica a ausência de série histórica", () => {
    const { container } = render(
      <Sparkline change24h={12.3} change1h={1.1} change5m={0.2} seed="SOL" />,
    );

    expect(screen.getByText(/série n\/d/i)).toBeInTheDocument();
    expect(screen.getByText("+12.3%")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAccessibleName(/série histórica indisponível/i);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("não inventa curva AMM, livro ou valores padrão a partir do mercado agregado", () => {
    render(withTheme(<LiquidityDepthChart token={token} market={market} />));

    expect(screen.getByText(/profundidade indisponível/i)).toBeInTheDocument();
    expect(screen.getByText(/nenhuma curva foi estimada/i)).toBeInTheDocument();
    expect(screen.getByText("geckoterminal")).toBeInTheDocument();
    expect(screen.queryByText(/compradora|vendedora/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/vol camada/i)).not.toBeInTheDocument();
  });

  it("substitui o selo LIVE estático por um estado de acesso", () => {
    render(withTheme(<LogoMark />));

    expect(screen.getByText("READ ONLY")).toBeInTheDocument();
    expect(screen.queryByText("LIVE")).not.toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/dashboard");
  });

  it("não calcula PnL com preço de entrada ou cotação de outro token", () => {
    const position = {
      id: "position-1",
      tokenId: token.id,
      symbol: token.symbol,
      name: token.name,
      chain: token.chain,
      contractAddress: token.contract_address,
      entryPrice: 100,
      currentPrice: 100,
      amountUsd: 500,
      tokenCount: 5,
      takeProfitPct: 30,
      stopLossPct: 10,
      openedAt: "2026-08-20T00:00:00Z",
      status: "open",
    } satisfies VirtualPosition;

    expect(getObservedPositionValuation(position, "outro-token", 150)).toBeNull();
    expect(getObservedPositionValuation(position, token.id, null)).toBeNull();
    expect(getObservedPositionValuation(position, token.id, 150)).toMatchObject({
      price: 150,
      currentValue: 750,
      pnlUsd: 250,
      pnlPct: 50,
    });
  });

  it("mantém impacto, saída e impostos como N/D sem dados de mercado ou risco", () => {
    render(withTheme(<SwapSimulator token={token} market={null} risk={null} />));

    expect(screen.getByText("Tokens Estimados").nextElementSibling).toHaveTextContent("N/D");
    expect(screen.getByText("Price Impact").nextElementSibling).toHaveTextContent("N/D");
    expect(screen.getByText("Taxas do Contrato").nextElementSibling).toHaveTextContent("N/D / N/D");
    expect(screen.getByText(/aproximação teórica local/i)).toBeInTheDocument();
  });
});
