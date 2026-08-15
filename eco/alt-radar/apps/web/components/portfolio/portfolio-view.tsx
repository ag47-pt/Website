"use client";

import { useMemo, useState } from "react";
import {
  Briefcase,
  TrendingUp,
  Shield,
  Zap,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  PieChart,
  Sliders,
  DollarSign,
  Wallet,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  useOpportunities,
  usePortfolioMetrics,
  usePortfolioPositions,
  usePortfolioEquityCurve,
  useOptimizeWeightsMutation,
  useApplyWeightsMutation,
} from "@/eco/alt-radar/apps/web/lib/api/query";
import type { Opportunity } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatScore,
  shortenAddress,
} from "@/eco/alt-radar/apps/web/lib/format";
import { PaperTrading } from "@/eco/alt-radar/apps/web/components/dashboard/paper-trading";
import { ChainBadge } from "@/eco/alt-radar/apps/web/components/shared/chain-badge";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

export function PortfolioView() {
  const { primary } = useEcoTheme();
  const opportunitiesQuery = useOpportunities({ page: 1, pageSize: 50 });
  const allOpportunities = opportunitiesQuery.data?.items ?? [];

  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

  // Selected opportunity for paper trading
  const selectedOpportunity = useMemo(() => {
    if (!selectedTokenId && allOpportunities.length > 0) {
      return allOpportunities[0];
    }
    return allOpportunities.find((o) => o.token.id === selectedTokenId) ?? null;
  }, [allOpportunities, selectedTokenId]);

  // Optimization state
  const [horizonHours, setHorizonHours] = useState<number>(24);
  const optimizeMutation = useOptimizeWeightsMutation();
  const applyMutation = useApplyWeightsMutation();

  const handleRunOptimizer = () => {
    optimizeMutation.mutate(horizonHours);
  };

  const topCandidate = optimizeMutation.data?.top_candidates?.[0] ?? null;

  const handleApplyWeights = () => {
    if (!topCandidate) return;
    applyMutation.mutate(topCandidate.weights);
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Top Banner & Header */}
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
              <Briefcase className="size-4" />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Terminal de Gestão &amp; Simulação
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white font-sans">
            Portfólio &amp; Paper Trading
          </h1>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-400">
            Ambiente completo de simulação de trades em tempo real com ordens a mercado, limites de DCA,
            rebalanceamento automatizado de pesos e gestão de risco zero-loss.
          </p>
        </div>

        {/* Global Strategy Metric Cards */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-[9px] uppercase text-zinc-400 block font-bold">Modo de Execução</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SIMULATED_PAPER
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-[9px] uppercase text-zinc-400 block font-bold">Universo Radar</span>
            <span className="text-white font-bold">{allOpportunities.length} Ativos Monitorados</span>
          </div>
        </div>
      </header>

      {/* Main Grid: Paper Trading Engine + Token Quick Selector */}
      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
        {/* Paper Trading Main Terminal */}
        <div className="min-w-0 space-y-4">
          <PaperTrading selectedOpportunity={selectedOpportunity} />
        </div>

        {/* Right Sidebar: Token Quick Selector & Rebalancing Optimizer */}
        <div className="space-y-4 min-w-0">
          {/* Quick Opportunity Selector for Trading */}
          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="size-4" style={{ color: primary }} />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Selecionar Ativo para Operação
                </h2>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">
                {allOpportunities.length} tokens
              </span>
            </div>

            <div className="mt-3 max-h-[320px] overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
              {allOpportunities.map((opp) => {
                const isSelected = (selectedOpportunity?.token.id ?? "") === opp.token.id;
                const change = opp.market?.price_change_24h ?? 0;
                const isPos = change >= 0;

                return (
                  <button
                    key={opp.token.id}
                    type="button"
                    onClick={() => setSelectedTokenId(opp.token.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? "bg-white/[0.08] text-white border-white/20 shadow-sm"
                        : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04] text-zinc-300"
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: `${primary}60`,
                            backgroundColor: `${primary}15`,
                          }
                        : {}
                    }
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="grid size-7 place-items-center rounded-lg border font-bold text-[10px] shrink-0"
                        style={{
                          borderColor: `${primary}30`,
                          backgroundColor: `${primary}10`,
                          color: primary,
                        }}
                      >
                        {opp.token.symbol[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white truncate font-sans">
                            {opp.token.symbol}
                          </span>
                          <ChainBadge chain={opp.token.chain} />
                        </div>
                        <p className="text-[9px] text-zinc-400 truncate max-w-[120px]">
                          {opp.token.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-white font-mono">
                        {formatCurrency(opp.market?.price_usd ?? null)}
                      </p>
                      <p
                        className={`text-[9px] font-bold ${
                          isPos ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {formatPercent(change, true)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Algorithmic Weight Optimizer */}
          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="size-4" style={{ color: primary }} />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Otimizador Quantitativo de Pesos
                </h2>
              </div>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase"
                style={{
                  borderColor: `${primary}40`,
                  backgroundColor: `${primary}10`,
                  color: primary,
                }}
              >
                Markowitz / Sharpe
              </span>
            </div>

            <p className="mt-2.5 text-[11px] text-zinc-400 leading-relaxed">
              Calcula a fronteira eficiente de alocação de capital minimizando volatilidade e
              maximizando o índice Sharpe baseado no score algorítmico.
            </p>

            <div className="mt-3.5 space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">
                  Horizonte Temporal de Avaliação
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { h: 6, label: "6 Horas" },
                    { h: 24, label: "24 Horas" },
                    { h: 72, label: "72 Horas" },
                  ].map((item) => (
                    <button
                      key={item.h}
                      type="button"
                      onClick={() => setHorizonHours(item.h)}
                      className={`py-1.5 px-2 rounded-xl text-[10px] font-bold uppercase transition-all ${
                        horizonHours === item.h
                          ? "bg-white/15 text-white border border-white/30 shadow-sm"
                          : "bg-white/5 text-zinc-400 border border-white/5 hover:text-zinc-200"
                      }`}
                      style={
                        horizonHours === item.h
                          ? {
                              borderColor: `${primary}60`,
                              backgroundColor: `${primary}20`,
                              color: primary,
                            }
                          : {}
                      }
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunOptimizer}
                disabled={optimizeMutation.isPending}
                className="w-full mt-2 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
                style={{
                  backgroundColor: primary,
                  color: "#000",
                  boxShadow: `0 0 20px ${primary}30`,
                }}
              >
                <RefreshCw
                  className={`size-3.5 ${optimizeMutation.isPending ? "animate-spin" : ""}`}
                />
                {optimizeMutation.isPending ? "Calculando Combinações..." : "Executar Grid Search"}
              </button>

              {/* Recommended Weights Result */}
              {topCandidate && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400 font-bold">Fator de Lucro:</span>
                    <span className="font-bold text-emerald-400">
                      {topCandidate.profit_factor.toFixed(2)}x
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400 font-bold">Taxa de Acerto:</span>
                    <span className="font-bold text-cyan-400">
                      {(topCandidate.win_rate * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {Object.entries(topCandidate.weights).map(([sym, weight]) => (
                      <div key={sym} className="space-y-0.5">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-zinc-300 font-bold">{sym}</span>
                          <span className="text-zinc-400 font-mono">
                            {(weight * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.max(5, weight * 100)}%`,
                              backgroundColor: primary,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyWeights}
                    disabled={applyMutation.isPending}
                    className="w-full mt-3 py-2 px-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="size-3 text-emerald-400" />
                    {applyMutation.isPending ? "Aplicando..." : "Salvar Pesos Recomendados"}
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
