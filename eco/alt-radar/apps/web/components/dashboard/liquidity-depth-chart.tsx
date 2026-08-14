"use client";

import { useState } from "react";
import { Activity, BarChart2, Layers, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import type { Market, Token } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { formatCurrency, formatNumber, formatPercent } from "@/eco/alt-radar/apps/web/lib/format";

interface LiquidityDepthChartProps {
  token: Token;
  market: Market | null;
}

export function LiquidityDepthChart({ token, market }: LiquidityDepthChartProps) {
  const [viewMode, setViewMode] = useState<"curve" | "ladder">("curve");

  const price = market?.price_usd ?? 1.0;
  const liquidity = market?.liquidity_usd ?? 250000;

  // Generate deterministic AMM depth bins around mid-price
  const generateDepthBins = () => {
    const bids = [];
    const asks = [];

    // 6 bid tiers below current price (-1% to -15%)
    let cumBidVol = 0;
    for (let i = 1; i <= 6; i++) {
      const dropPct = i * 2.5;
      const tierPrice = price * (1 - dropPct / 100);
      const volumeUsd = (liquidity * 0.08) * Math.exp(-i * 0.15);
      cumBidVol += volumeUsd;
      bids.push({
        dropPct,
        price: tierPrice,
        volumeUsd,
        cumVolUsd: cumBidVol,
        depthPct: Math.min(100, (cumBidVol / (liquidity * 0.45)) * 100),
      });
    }

    // 6 ask tiers above current price (+1% to +15%)
    let cumAskVol = 0;
    for (let i = 1; i <= 6; i++) {
      const risePct = i * 2.5;
      const tierPrice = price * (1 + risePct / 100);
      const volumeUsd = (liquidity * 0.075) * Math.exp(-i * 0.14);
      cumAskVol += volumeUsd;
      asks.push({
        risePct,
        price: tierPrice,
        volumeUsd,
        cumVolUsd: cumAskVol,
        depthPct: Math.min(100, (cumAskVol / (liquidity * 0.45)) * 100),
      });
    }

    return { bids: bids.reverse(), asks, totalBidVol: cumBidVol, totalAskVol: cumAskVol };
  };

  const depth = generateDepthBins();
  const imbalance = ((depth.totalBidVol - depth.totalAskVol) / (depth.totalBidVol + depth.totalAskVol)) * 100;

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/75 p-3.5 font-mono text-xs text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-[#d1ff00]" />
          <div>
            <h4 className="font-bold text-white">Profundidade da Pool & Curva AMM</h4>
            <p className="text-[0.6rem] text-zinc-500">Distribuição de liquidez em $x \cdot y = k$</p>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-0.5 text-[0.62rem]">
          <button
            type="button"
            onClick={() => setViewMode("curve")}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === "curve" ? "bg-[#d1ff00]/15 text-[#d1ff00] font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Curva AMM
          </button>
          <button
            type="button"
            onClick={() => setViewMode("ladder")}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === "ladder" ? "bg-[#d1ff00]/15 text-[#d1ff00] font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Níveis de Preço
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="mt-2.5 grid grid-cols-3 gap-2 rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-2 text-center text-[0.62rem]">
        <div>
          <span className="text-zinc-500 uppercase">Suporte Bids (-15%)</span>
          <p className="mt-0.5 font-bold text-[#d1ff00]">${formatNumber(depth.totalBidVol)}</p>
        </div>
        <div>
          <span className="text-zinc-500 uppercase">Pressão do Livro</span>
          <p className={`mt-0.5 font-bold ${imbalance >= 0 ? "text-[#d1ff00]" : "text-rose-400"}`}>
            {imbalance >= 0 ? "+" : ""}{imbalance.toFixed(1)}% {imbalance >= 0 ? "Compradora" : "Vendedora"}
          </p>
        </div>
        <div>
          <span className="text-zinc-500 uppercase">Resistência Asks (+15%)</span>
          <p className="mt-0.5 font-bold text-rose-400">${formatNumber(depth.totalAskVol)}</p>
        </div>
      </div>

      {/* Visual Depth Representation */}
      {viewMode === "curve" ? (
        <div className="mt-3 space-y-2">
          {/* Depth Bars Visualizer */}
          <div className="relative flex h-24 items-end gap-1 rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-2">
            {/* Bids side */}
            <div className="flex flex-1 items-end justify-end gap-1 h-full">
              {depth.bids.map((b, idx) => (
                <div key={idx} className="group relative flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    style={{ height: `${b.depthPct}%` }}
                    className="w-full rounded-t-sm bg-[#d1ff00]/60 transition-all group-hover:bg-[#d1ff00]"
                  />
                  <span className="mt-1 text-[0.55rem] text-zinc-500 hidden sm:block">-{b.dropPct}%</span>
                </div>
              ))}
            </div>

            {/* Mid Market Center Line */}
            <div className="h-full w-0.5 bg-cyan-400 flex flex-col items-center justify-between">
              <span className="text-[0.5rem] font-bold text-cyan-300 -top-3 relative">MID</span>
            </div>

            {/* Asks side */}
            <div className="flex flex-1 items-end justify-start gap-1 h-full">
              {depth.asks.map((a, idx) => (
                <div key={idx} className="group relative flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    style={{ height: `${a.depthPct}%` }}
                    className="w-full rounded-t-sm bg-rose-500/60 transition-all group-hover:bg-rose-500"
                  />
                  <span className="mt-1 text-[0.55rem] text-zinc-500 hidden sm:block">+{a.risePct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[0.58rem] text-zinc-500 px-1">
            <span className="text-[#d1ff00] font-bold">← Bids (Profundidade de Compra)</span>
            <span className="text-cyan-400 font-bold">Preço Atual: ${formatNumber(price)}</span>
            <span className="text-rose-400 font-bold">Asks (Profundidade de Venda) →</span>
          </div>
        </div>
      ) : (
        /* Ladder View */
        <div className="mt-3 space-y-1 text-[0.62rem]">
          <div className="grid grid-cols-4 border-b border-zinc-800 pb-1 text-zinc-500 font-bold uppercase text-[0.56rem]">
            <span>Faixa (%)</span>
            <span>Preço</span>
            <span>Vol Camada</span>
            <span className="text-right">Acumulado</span>
          </div>

          {/* Asks */}
          {depth.asks.slice(0, 3).reverse().map((a, idx) => (
            <div key={`ask-${idx}`} className="grid grid-cols-4 py-0.5 text-rose-400">
              <span>+{a.risePct}%</span>
              <span>${formatNumber(a.price)}</span>
              <span className="text-zinc-400">${formatNumber(a.volumeUsd)}</span>
              <span className="text-right">${formatNumber(a.cumVolUsd)}</span>
            </div>
          ))}

          {/* Current Price */}
          <div className="grid grid-cols-4 py-1 font-bold text-cyan-400 bg-cyan-500/10 rounded px-1 my-0.5">
            <span>ATUAL</span>
            <span>${formatNumber(price)}</span>
            <span className="col-span-2 text-right">Preço de Mercado</span>
          </div>

          {/* Bids */}
          {depth.bids.slice(0, 3).map((b, idx) => (
            <div key={`bid-${idx}`} className="grid grid-cols-4 py-0.5 text-[#d1ff00]">
              <span>-{b.dropPct}%</span>
              <span>${formatNumber(b.price)}</span>
              <span className="text-zinc-400">${formatNumber(b.volumeUsd)}</span>
              <span className="text-right">${formatNumber(b.cumVolUsd)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
