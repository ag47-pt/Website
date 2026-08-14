"use client";

import { Activity, ArrowUpRight, Coins, Flame, Layers, Network, Shuffle } from "lucide-react";
import { formatCurrency, formatNumber, formatPercent } from "@/eco/alt-radar/apps/web/lib/format";

export function ChainCapitalFlow() {
  const chains = [
    {
      name: "Solana",
      chain: "solana",
      share: 62.4,
      volume24h: 18450000,
      netInflow24h: 14200000,
      activePools: 1420,
      color: "bg-[#62a4ff]",
      borderColor: "border-[#62a4ff]/40",
      textColor: "text-[#62a4ff]",
      status: "Líder de Influxo",
    },
    {
      name: "BNB Chain",
      chain: "bsc",
      share: 21.8,
      volume24h: 6420000,
      netInflow24h: 4800000,
      activePools: 840,
      color: "bg-[#f4b941]",
      borderColor: "border-[#f4b941]/40",
      textColor: "text-[#f4b941]",
      status: "Consolidado",
    },
    {
      name: "Ethereum",
      chain: "ethereum",
      share: 15.8,
      volume24h: 4680000,
      netInflow24h: 3900000,
      activePools: 510,
      color: "bg-[#9fbfff]",
      borderColor: "border-[#9fbfff]/40",
      textColor: "text-[#9fbfff]",
      status: "Alta Liquidez",
    },
  ];

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/80 p-3.5 font-mono text-xs text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-[#d1ff00]" />
          <div>
            <h4 className="font-bold text-white">Fluxo de Capital On-Chain (24h)</h4>
            <p className="text-[0.6rem] text-zinc-500">Distribuição de liquidez e migração entre ecossistemas</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-md border border-[#d1ff00]/40 bg-[#d1ff00]/10 px-2 py-0.5 text-[0.62rem] font-bold text-[#d1ff00]">
          <Flame className="size-3" />
          Volume Total: $29.5M / 24h
        </span>
      </div>

      {/* Proportional Segmented Bar (Treemap Bar) */}
      <div className="mt-3">
        <div className="h-3.5 w-full rounded-lg bg-zinc-900 flex overflow-hidden border border-zinc-800/80">
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
            className={`rounded-lg border ${c.borderColor} bg-zinc-900/40 p-2.5 space-y-1.5`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-bold ${c.textColor}`}>{c.name}</span>
              <span className="text-[0.58rem] rounded bg-zinc-800/90 px-1.5 py-0.5 text-zinc-400">
                {c.share}% Share
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1 border-t border-zinc-800/60">
              <span className="text-[0.58rem] text-zinc-500 uppercase">Volume 24h</span>
              <span className="font-bold text-white">${(c.volume24h / 1e6).toFixed(2)}M</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-[0.58rem] text-zinc-500 uppercase">Influxo Líquido</span>
              <span className="font-bold text-[#d1ff00]">+${(c.netInflow24h / 1e6).toFixed(2)}M</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-[0.58rem] text-zinc-500 uppercase">Pools Monitoradas</span>
              <span className="text-zinc-400">{c.activePools} pools</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2.5 rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-2 text-[0.62rem] text-zinc-400">
        ⚡ <strong className="text-white">Rotação Dominante:</strong> Solana absorve <span className="text-[#d1ff00] font-bold">62.4% do fluxo de capital novo</span> nas últimas 24 horas com $14.2M de influxo líquido.
      </div>
    </div>
  );
}
