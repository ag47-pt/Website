"use client";

import { useMemo, useState } from "react";
import { Cpu, FlaskConical, Layers } from "lucide-react";
import { useOpportunities, useRisk } from "@/eco/alt-radar/apps/web/lib/api/query";
import { formatCurrency } from "@/eco/alt-radar/apps/web/lib/format";
import { SwapSimulator } from "@/eco/alt-radar/apps/web/components/dashboard/swap-simulator";
import { LiquidityDepthChart } from "@/eco/alt-radar/apps/web/components/dashboard/liquidity-depth-chart";
import { MarketCorrelationMatrix } from "@/eco/alt-radar/apps/web/components/dashboard/market-correlation-matrix";
import { ChainCapitalFlow } from "@/eco/alt-radar/apps/web/components/dashboard/chain-capital-flow";
import { ChainBadge } from "@/eco/alt-radar/apps/web/components/shared/chain-badge";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

export function LabView() {
  const { primary } = useEcoTheme();
  const opportunitiesQuery = useOpportunities({ page: 1, pageSize: 50 });
  const allOpportunities = useMemo(
    () => opportunitiesQuery.data?.items ?? [],
    [opportunitiesQuery.data?.items],
  );

  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

  const selectedOpportunity = useMemo(() => {
    if (!selectedTokenId && allOpportunities.length > 0) {
      return allOpportunities[0];
    }
    return allOpportunities.find((o) => o.token.id === selectedTokenId) ?? null;
  }, [allOpportunities, selectedTokenId]);

  const riskQuery = useRisk(selectedOpportunity?.token.id ?? null);
  const riskData = riskQuery.data ?? selectedOpportunity?.risk ?? null;

  return (
    <div className="space-y-4 font-mono">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="grid size-7 place-items-center rounded-lg border text-xs"
              style={{
                borderColor: `${primary}50`,
                backgroundColor: `${primary}15`,
                color: primary,
              }}
            >
              <FlaskConical className="size-4" />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Laboratório Quantitativo de Execução
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white font-sans">
            Simulação de Swaps &amp; Análise de Liquidez
          </h1>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-400">
            Ambiente analítico para simular impacto no preço de pools DEX, slippage efetivo,
            profundidade de ordens e migração de capital institucional entre blockchains.
          </p>
        </div>

        {/* Global Live Indicators */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-[9px] uppercase text-zinc-400 block font-bold">Motor DEX</span>
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <Cpu className="size-3" />
              AMM_ROUTING_v2
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-[9px] uppercase text-zinc-400 block font-bold">
              Ativo em Teste
            </span>
            <span className="text-white font-bold" style={{ color: primary }}>
              {selectedOpportunity?.token.symbol ?? "Nenhum"}
            </span>
          </div>
        </div>
      </header>

      {/* Asset Quick Selector Bar */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 shadow-md overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mr-2 flex items-center gap-1.5">
            <Layers className="size-3" style={{ color: primary }} />
            Testar Ativo:
          </span>
          {allOpportunities.map((opp) => {
            const isSelected = (selectedOpportunity?.token.id ?? "") === opp.token.id;
            return (
              <button
                key={opp.token.id}
                type="button"
                onClick={() => setSelectedTokenId(opp.token.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white/[0.12] text-white border-white/30 shadow-md"
                    : "bg-white/[0.03] border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]"
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: `${primary}60`,
                        backgroundColor: `${primary}20`,
                        color: primary,
                      }
                    : {}
                }
              >
                <span>{opp.token.symbol}</span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {formatCurrency(opp.market?.price_usd ?? null)}
                </span>
                <ChainBadge chain={opp.token.chain} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Grid: Swap Simulator + Liquidity Depth Chart */}
      {selectedOpportunity && (
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="min-w-0">
            <SwapSimulator
              token={selectedOpportunity.token}
              market={selectedOpportunity.market ?? null}
              risk={riskData}
            />
          </div>

          <div className="min-w-0">
            <LiquidityDepthChart
              token={selectedOpportunity.token}
              market={selectedOpportunity.market ?? null}
            />
          </div>
        </div>
      )}

      {/* Bottom Grid: Market Correlation Matrix + Chain Capital Flow */}
      <div className="grid gap-4 xl:grid-cols-2">
        {selectedOpportunity && (
          <div className="min-w-0">
            <MarketCorrelationMatrix token={selectedOpportunity.token} />
          </div>
        )}

        <div className="min-w-0">
          <ChainCapitalFlow />
        </div>
      </div>
    </div>
  );
}
