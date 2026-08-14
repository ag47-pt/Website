"use client";

import { usePortfolioMetrics, usePortfolioPositions } from "@/eco/alt-radar/apps/web/lib/api/query";
import { formatNumber, formatPercent } from "@/eco/alt-radar/apps/web/lib/format";
import { Briefcase, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function PortfolioPage() {
  const { data: metrics, isLoading: isMetricsLoading } = usePortfolioMetrics();
  const { data: positions, isLoading: isPositionsLoading } = usePortfolioPositions();

  if (isMetricsLoading || isPositionsLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative size-12">
            <div className="absolute inset-0 animate-ping rounded-full bg-radar-positive/20" />
            <div className="absolute inset-2 animate-pulse rounded-full bg-radar-positive/40" />
            <Briefcase className="absolute inset-0 m-auto size-6 text-radar-positive" />
          </div>
          <p className="font-mono text-sm tracking-widest text-radar-muted uppercase">Sincronizando Módulo Observacional</p>
        </div>
      </div>
    );
  }

  const isProfit = (metrics?.total_pnl ?? 0) >= 0;

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-b from-[#0d2c26] to-[#0a1e22] ring-1 ring-radar-positive/20">
            <Briefcase className="size-5 text-radar-positive" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-radar-ink">
            Paper Trading
          </h1>
          <span className="ml-2 rounded-full border border-radar-border-strong bg-white/[0.02] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-radar-subtle">
            Lóbulo Observacional (Read-Only)
          </span>
        </div>
        <p className="text-sm text-radar-muted">
          Acompanhamento simulado da performance das oportunidades selecionadas pelo sistema.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Current Balance */}
        <div className="group relative overflow-hidden rounded-2xl border border-radar-border bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-5 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-radar-positive/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <p className="text-[0.7rem] font-bold uppercase tracking-wider text-radar-subtle">Capital Simulado</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-radar-ink">
              ${formatNumber(metrics?.current_balance ?? 10000)}
            </span>
          </div>
        </div>

        {/* PNL */}
        <div className="group relative overflow-hidden rounded-2xl border border-radar-border bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-5 backdrop-blur-xl">
          <div className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${isProfit ? "from-radar-positive/5" : "from-red-500/5"} to-transparent`} />
          <p className="text-[0.7rem] font-bold uppercase tracking-wider text-radar-subtle">PnL Global</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-bold tracking-tight ${isProfit ? "text-radar-positive" : "text-red-400"}`}>
              {isProfit ? "+" : "-"}${formatNumber(Math.abs(metrics?.total_pnl ?? 0))}
            </span>
          </div>
        </div>

        {/* Win Rate */}
        <div className="group relative overflow-hidden rounded-2xl border border-radar-border bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-5 backdrop-blur-xl">
          <p className="text-[0.7rem] font-bold uppercase tracking-wider text-radar-subtle">Taxa de Acerto (Win Rate)</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-radar-ink">
              {formatPercent(metrics?.win_rate ?? 0)}
            </span>
          </div>
        </div>

        {/* Profit Factor */}
        <div className="group relative overflow-hidden rounded-2xl border border-radar-border bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-5 backdrop-blur-xl">
          <p className="text-[0.7rem] font-bold uppercase tracking-wider text-radar-subtle">Profit Factor</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-radar-ink">
              {formatNumber(metrics?.profit_factor ?? 0)}x
            </span>
          </div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold tracking-wide text-radar-ink">Posições Virtuais ({positions?.length ?? 0})</h2>
        <div className="overflow-hidden rounded-xl border border-radar-border bg-[#0a151d] shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/[0.04] bg-white/[0.02]">
              <tr>
                <th className="px-4 py-3 font-semibold text-radar-subtle">Ativo</th>
                <th className="px-4 py-3 font-semibold text-radar-subtle">Estado</th>
                <th className="px-4 py-3 text-right font-semibold text-radar-subtle">Tamanho</th>
                <th className="px-4 py-3 text-right font-semibold text-radar-subtle">Preço Entrada</th>
                <th className="px-4 py-3 text-right font-semibold text-radar-subtle">PnL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {!positions?.length ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-radar-muted">
                    Nenhuma posição simulada aberta.
                  </td>
                </tr>
              ) : (
                positions.map((pos) => {
                  const posProfit = (pos.pnl ?? 0) >= 0;
                  return (
                    <tr key={pos.id} className="transition-colors hover:bg-white/[0.01]">
                      <td className="px-4 py-3 font-medium text-radar-ink">{pos.token_symbol}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-bold tracking-wider ${pos.status === 'OPEN' ? 'bg-radar-positive/10 text-radar-positive ring-1 ring-radar-positive/30' : 'bg-white/5 text-radar-subtle'}`}>
                          {pos.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-radar-muted">
                        ${formatNumber(pos.simulated_size)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-radar-muted">
                        ${formatNumber(pos.entry_price)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex items-center gap-1 font-mono ${posProfit ? "text-radar-positive" : "text-red-400"}`}>
                          {posProfit ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                          ${formatNumber(Math.abs(pos.pnl ?? 0))}
                          <span className="text-xs opacity-60">({formatPercent(pos.pnl_percentage ?? 0)})</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
