"use client";

import { Flame, Layers } from "lucide-react";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

export function ChainCapitalFlow() {
  const { primary } = useEcoTheme();
  const chains = [
    {
      name: "Solana",
      chain: "solana",
      share: 62.4,
      volume24h: 18450000,
      netInflow24h: 14200000,
      activePools: 1420,
      color: "bg-cyan-400 shadow-[0_0_10px_rgba(0,217,255,0.4)]",
      borderColor: "border-cyan-500/30",
      textColor: "text-cyan-300",
      status: "Líder de Influxo",
    },
    {
      name: "BNB Chain",
      chain: "bsc",
      share: 21.8,
      volume24h: 6420000,
      netInflow24h: 4800000,
      activePools: 840,
      color: "bg-amber-400",
      borderColor: "border-amber-500/30",
      textColor: "text-amber-300",
      status: "Consolidado",
    },
    {
      name: "Ethereum",
      chain: "ethereum",
      share: 15.8,
      volume24h: 4680000,
      netInflow24h: 3900000,
      activePools: 510,
      color: "bg-indigo-400",
      borderColor: "border-indigo-500/30",
      textColor: "text-indigo-300",
      status: "Alta Liquidez",
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 font-mono text-xs text-white shadow-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Layers className="size-4" style={{ color: primary }} />
          <div>
            <h4 className="font-bold text-white font-sans text-xs">Fluxo de Capital On-Chain (24h)</h4>
            <p className="text-[0.6rem] text-zinc-400">Distribuição de liquidez e migração entre ecossistemas</p>
          </div>
        </div>

        <span
          className="inline-flex items-center gap-1 rounded-xl border px-2 py-0.5 text-[0.62rem] font-bold"
          style={{ borderColor: `${primary}50`, backgroundColor: `${primary}15`, color: primary, boxShadow: `0 0 8px ${primary}20` }}
        >
          <Flame className="size-3" />
          Volume Total: $29.5M / 24h
        </span>
      </div>

      {/* Proportional Segmented Bar (Treemap Bar) */}
      <div className="mt-3">
        <div className="h-3.5 w-full rounded-xl bg-white/5 flex overflow-hidden border border-white/10">
          {chains.map((c) => (
            <div
              key={c.name}
              style={{ width: `${c.share}%` }}
              className={`h-full ${c.color} transition-all hover:brightness-125 cursor-pointer relative group`}
              title={`${c.name}: ${c.share}% ($${(c.volume24h / 1e6).toFixed(1)}M)`}
            />
          ))}
        </div>
      </div>

      {/* Grid of Chains */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {chains.map((c) => (
          <div
            key={c.name}
            className={`rounded-xl border ${c.borderColor} bg-white/[0.03] p-2.5 space-y-1.5 hover:border-white/20 transition-all`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-bold ${c.textColor}`}>{c.name}</span>
              <span className="text-[0.58rem] rounded-md bg-white/10 px-1.5 py-0.5 text-zinc-300 font-mono">
                {c.share}% Share
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1 border-t border-white/5">
              <span className="text-[0.58rem] text-zinc-400 uppercase">Volume 24h</span>
              <span className="font-bold text-white">${(c.volume24h / 1e6).toFixed(2)}M</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-[0.58rem] text-zinc-400 uppercase">Influxo Líquido</span>
              <span className="font-bold text-emerald-400">+${(c.netInflow24h / 1e6).toFixed(2)}M</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-[0.58rem] text-zinc-400 uppercase">Pools Monitoradas</span>
              <span className="text-zinc-400">{c.activePools} pools</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-[0.62rem] text-zinc-400">
        ⚡ <strong className="text-white">Rotação Dominante:</strong> Solana absorve <span className="text-cyan-300 font-bold">62.4% do fluxo de capital novo</span> nas últimas 24 horas com $14.2M de influxo líquido.
      </div>
    </div>
  );
}
