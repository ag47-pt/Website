"use client";

import { useState } from "react";
import { ExternalLink, Sparkles, Wallet } from "lucide-react";
import type { Token } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { CopyButton } from "@/eco/alt-radar/apps/web/components/shared/copy-button";
import { formatNumber, shortenAddress } from "@/eco/alt-radar/apps/web/lib/format";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

interface SmartMoneyTrackerProps {
  token: Token;
}

export function SmartMoneyTracker({ token }: SmartMoneyTrackerProps) {
  const { primary } = useEcoTheme();
  // Deterministic top 5 smart money wallets for this token
  const wallets = [
    {
      address: `${token.chain === "solana" ? "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU" : "0x71c841366144da541315b81a7042a969dbba1894"}`,
      label: "Alpha Sniper #1",
      entryPrice: 0.82,
      investedUsd: 48500,
      realizedPnlPct: 142.5,
      realizedPnlUsd: 69112,
      holdTime: "18h",
      status: "holding" as const,
      winRate: 88,
    },
    {
      address: `${token.chain === "solana" ? "4vJ9JU1bF3kE9x5A1bC2d3E4F5g6h7i8j9k0l1m2n3o" : "0x28c6c06298d514db089934071355e5743bf21d60"}`,
      label: "Whale Momentum",
      entryPrice: 0.94,
      investedUsd: 125000,
      realizedPnlPct: 84.2,
      realizedPnlUsd: 105250,
      holdTime: "2d",
      status: "accumulating" as const,
      winRate: 92,
    },
    {
      address: `${token.chain === "solana" ? "9mR5vW8xK2L3p4Q5r6S7t8U9v0W1x2Y3z4A5b6C7d8E" : "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be"}`,
      label: "DEX Arb Bot",
      entryPrice: 1.05,
      investedUsd: 32000,
      realizedPnlPct: 38.6,
      realizedPnlUsd: 12352,
      holdTime: "45m",
      status: "taking_profit" as const,
      winRate: 96,
    },
    {
      address: `${token.chain === "solana" ? "2bC3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1v2W" : "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}`,
      label: "Early Insiders Fund",
      entryPrice: 0.45,
      investedUsd: 210000,
      realizedPnlPct: 320.0,
      realizedPnlUsd: 672000,
      holdTime: "12d",
      status: "holding" as const,
      winRate: 82,
    },
    {
      address: `${token.chain === "solana" ? "5kL6m7N8o9P0q1R2s3T4u5V6w7X8y9Z0a1B2c3D4e5F" : "0x0d0707963952f2fba59dd06f2b425ace40b492fe"}`,
      label: "Smart Swing 7D",
      entryPrice: 0.98,
      investedUsd: 18500,
      realizedPnlPct: 54.1,
      realizedPnlUsd: 10008,
      holdTime: "3d",
      status: "accumulating" as const,
      winRate: 79,
    },
  ];

  const explorerBase =
    token.chain === "solana"
      ? "https://solscan.io/account/"
      : token.chain === "bsc"
        ? "https://bscscan.com/address/"
        : "https://etherscan.io/address/";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 font-mono text-xs text-white shadow-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Wallet className="size-4" style={{ color: primary }} />
          <div>
            <h4 className="font-bold text-white font-sans text-xs">Smart Money &amp; Top Traders (24h)</h4>
            <p className="text-[0.6rem] text-zinc-400">Rastreamento de carteiras com alto win-rate</p>
          </div>
        </div>

        <span
          className="inline-flex items-center gap-1 rounded-xl border px-2 py-0.5 text-[0.62rem] font-bold"
          style={{ borderColor: `${primary}50`, backgroundColor: `${primary}15`, color: primary, boxShadow: `0 0 8px ${primary}20` }}
        >
          <Sparkles className="size-3" />
          5 Carteiras Monitoradas
        </span>
      </div>

      {/* Wallet List */}
      <div className="mt-3 space-y-2">
        {wallets.map((w, idx) => (
          <div
            key={idx}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-2.5 text-[0.65rem] hover:border-white/15 transition-all"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{w.label}</span>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[0.56rem] font-bold uppercase ${
                    w.status === "accumulating"
                      ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                      : w.status === "taking_profit"
                        ? "border border-amber-500/40 bg-amber-500/15 text-amber-300"
                        : "border border-white/20 bg-white/10 text-white"
                  }`}
                >
                  {w.status === "accumulating"
                    ? "Acumulando"
                    : w.status === "taking_profit"
                      ? "Realizando"
                      : "Segurando"}
                </span>
                <span className="text-[0.58rem] text-zinc-400">Win Rate: {w.winRate}%</span>
              </div>

              <div className="mt-1 flex items-center gap-1.5 text-[0.6rem] text-zinc-400">
                <span className="truncate text-zinc-300" title={w.address}>
                  {shortenAddress(w.address, 8)}
                </span>
                <CopyButton value={w.address} label="Copiar carteira" />
                <a
                  href={`${explorerBase}${w.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors"
                  title="Ver no Explorer"
                >
                  <ExternalLink className="size-3" />
                </a>
                <span className="text-zinc-600">•</span>
                <span>Hold: {w.holdTime}</span>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-emerald-400">
                +${formatNumber(w.realizedPnlUsd)} (+{w.realizedPnlPct.toFixed(1)}%)
              </p>
              <p className="text-[0.58rem] text-zinc-400">Posição: ${formatNumber(w.investedUsd)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
