"use client";

import { CircleAlert, Layers } from "lucide-react";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

const CHAINS = [
  {
    name: "Solana",
    borderColor: "border-cyan-500/30",
    textColor: "text-cyan-300",
  },
  {
    name: "BNB Chain",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-300",
  },
  {
    name: "Ethereum",
    borderColor: "border-indigo-500/30",
    textColor: "text-indigo-300",
  },
] as const;

export function ChainCapitalFlow() {
  const { primary } = useEcoTheme();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 font-mono text-xs text-white shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Layers className="size-4" style={{ color: primary }} />
          <div>
            <h4 className="font-bold text-white font-sans text-xs">
              Fluxo de Capital On-Chain (24h)
            </h4>
            <p className="text-[0.6rem] text-zinc-400">
              Distribuição entre ecossistemas depende de telemetria dedicada
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-xl border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[0.62rem] font-bold text-amber-300">
          <CircleAlert className="size-3" /> Fonte não configurada
        </span>
      </div>

      <div className="mt-3">
        <div
          aria-label="Distribuição de capital indisponível"
          className="flex h-3.5 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-white/[0.03]"
        >
          <span className="text-[0.48rem] font-bold tracking-[0.22em] text-zinc-500">
            SEM TELEMETRIA
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {CHAINS.map((chain) => (
          <div
            key={chain.name}
            className={`space-y-1.5 rounded-xl border ${chain.borderColor} bg-white/[0.03] p-2.5 transition-all hover:border-white/20`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-bold ${chain.textColor}`}>{chain.name}</span>
              <span className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[0.58rem] text-zinc-400">
                N/D Share
              </span>
            </div>

            <div className="flex items-baseline justify-between border-t border-white/5 pt-1">
              <span className="text-[0.58rem] uppercase text-zinc-400">Volume 24h</span>
              <span className="font-bold text-zinc-500">N/D</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-[0.58rem] uppercase text-zinc-400">Influxo Líquido</span>
              <span className="font-bold text-zinc-500">N/D</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-[0.58rem] uppercase text-zinc-400">Pools Monitoradas</span>
              <span className="text-zinc-500">N/D</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-2.5 text-[0.62rem] leading-4 text-zinc-300">
        O contrato atual não entrega fluxo líquido, participação por chain ou contagem consolidada
        de pools. O Radar mantém essas métricas indisponíveis em vez de estimá-las.
      </div>
    </div>
  );
}
