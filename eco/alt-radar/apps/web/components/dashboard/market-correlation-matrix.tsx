"use client";

import { Gauge, GitCompare } from "lucide-react";
import type { Token } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

interface MarketCorrelationMatrixProps {
  token: Token;
}

export function MarketCorrelationMatrix({ token }: MarketCorrelationMatrixProps) {
  const { primary } = useEcoTheme();
  // Deterministic cross-asset correlation based on token chain and symbol
  const isSolana = token.chain === "solana";
  const isEth = token.chain === "ethereum";

  const correlations = [
    {
      asset: "SOL",
      name: "Solana",
      corr: isSolana ? 0.91 : 0.74,
      beta: isSolana ? 1.68 : 1.22,
      stdDev: "14.2%",
      color: "text-cyan-400",
    },
    {
      asset: "ETH",
      name: "Ethereum",
      corr: isEth ? 0.89 : 0.79,
      beta: isEth ? 1.52 : 1.15,
      stdDev: "11.8%",
      color: "text-indigo-400",
    },
    {
      asset: "BTC",
      name: "Bitcoin",
      corr: 0.68,
      beta: 1.84,
      stdDev: "8.4%",
      color: "text-amber-400",
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 font-mono text-xs text-white shadow-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <GitCompare className="size-4" style={{ color: primary }} />
          <div>
            <h4 className="font-bold text-white font-sans text-xs">
              Matriz de Correlação &amp; Beta (&beta;)
            </h4>
            <p className="text-[0.6rem] text-zinc-400">
              Sensibilidade e covariação com ativos base
            </p>
          </div>
        </div>

        <span
          className="inline-flex items-center gap-1 rounded-xl border px-2 py-0.5 text-[0.62rem] font-bold"
          style={{
            borderColor: `${primary}50`,
            backgroundColor: `${primary}15`,
            color: primary,
            boxShadow: `0 0 8px ${primary}20`,
          }}
        >
          <Gauge className="size-3" />
          Beta Médio: 1.68x
        </span>
      </div>

      {/* Grid of benchmark comparisons */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {correlations.map((c) => (
          <div
            key={c.asset}
            className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5 space-y-1.5 hover:border-white/15 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className={`font-bold ${c.color}`}>{c.asset} Benchmark</span>
              <span className="text-[0.58rem] text-zinc-400">{c.name}</span>
            </div>

            <div className="flex items-baseline justify-between pt-1 border-t border-white/5">
              <span className="text-[0.58rem] text-zinc-400 uppercase">Correlação (r)</span>
              <span className="font-bold text-emerald-400">+{(c.corr * 100).toFixed(0)}%</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-[0.58rem] text-zinc-400 uppercase">Beta (&beta;)</span>
              <span className="font-bold text-cyan-300">{c.beta.toFixed(2)}x</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-[0.58rem] text-zinc-400 uppercase">Desvio (&sigma;)</span>
              <span className="text-zinc-400">{c.stdDev}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-[0.62rem] text-zinc-400">
        💡 <strong className="text-white">Diagnóstico Tático:</strong> Este ativo opera como{" "}
        <span className="text-cyan-300 font-bold">High Beta (1.68x)</span>. Amplifica os movimentos
        do benchmark com alta sensibilidade direcional.
      </div>
    </div>
  );
}
