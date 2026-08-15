"use client";

import { useState } from "react";
import { Calculator, Check, Copy, ShieldAlert } from "lucide-react";
import type { Market, Risk, Token } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { formatNumber } from "@/eco/alt-radar/apps/web/lib/format";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

interface SwapSimulatorProps {
  token: Token;
  market: Market | null;
  risk: Risk | null;
}

export function SwapSimulator({ token, market, risk }: SwapSimulatorProps) {
  const [orderAmountUsd, setOrderAmountUsd] = useState<number>(500);
  const [copied, setCopied] = useState(false);
  const { primary } = useEcoTheme();

  const price = market?.price_usd ?? 0.000001;
  const liquidity = market?.liquidity_usd ?? 100000;
  const buyTax = risk?.buy_tax ?? 0;
  const sellTax = risk?.sell_tax ?? 0;

  // Slippage approximation formula: (Order Amount / Liquidity) * 100 * K factor (0.8)
  const priceImpact = Math.min(100, Number(((orderAmountUsd / Math.max(liquidity, 1)) * 80).toFixed(2)));
  const effectivePrice = price * (1 + priceImpact / 100);
  const grossTokens = orderAmountUsd / (effectivePrice || 1);
  const taxDeductionTokens = grossTokens * (buyTax / 100);
  const netTokensReceived = grossTokens - taxDeductionTokens;

  // Gas estimation per chain
  const networkGasUsd =
    token.chain === "solana" ? 0.002 : token.chain === "bsc" ? 0.18 : 3.85;

  const isHighImpact = priceImpact >= 2.5;

  const copySimulation = () => {
    const payload = JSON.stringify(
      {
        token: token.symbol,
        contract: token.contract_address,
        chain: token.chain,
        simulated_input_usd: orderAmountUsd,
        estimated_output_tokens: netTokensReceived,
        price_impact_percent: priceImpact,
        buy_tax_percent: buyTax,
        sell_tax_percent: sellTax,
        estimated_gas_usd: networkGasUsd,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    );
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 font-mono shadow-md">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-1.5">
          <Calculator className="size-4" style={{ color: primary }} />
          <h4 className="text-xs font-bold text-white font-sans">Simulador de Impacto &amp; Slippage</h4>
        </div>
        <button
          type="button"
          onClick={copySimulation}
          className="inline-flex items-center gap-1 text-[0.62rem] text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Copiar JSON do Trade Simulado"
        >
          {copied ? <Check className="size-3 text-cyan-400" /> : <Copy className="size-3" />}
          <span>{copied ? "Copiado!" : "Payload JSON"}</span>
        </button>
      </div>

      <div className="mt-3 grid gap-3">
        {/* Preset Buttons */}
        <div>
          <span className="text-[0.6rem] uppercase tracking-wider text-zinc-400 font-bold">
            Tamanho da Ordem (USD):
          </span>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {[100, 250, 500, 1000, 2500, 5000].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setOrderAmountUsd(amount)}
                className={`px-2.5 py-1 rounded-xl border text-[0.68rem] font-bold transition-all cursor-pointer ${
                  orderAmountUsd === amount
                    ? "text-white"
                    : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white hover:bg-white/10"
                }`}
                style={orderAmountUsd === amount ? { borderColor: `${primary}60`, backgroundColor: `${primary}15`, color: primary, boxShadow: `0 0 8px ${primary}20` } : {}}
              >
                ${amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2">
            <span className="text-[0.58rem] text-zinc-400 uppercase">Tokens Estimados</span>
            <p className="mt-0.5 text-xs font-bold text-white truncate">
              {formatNumber(netTokensReceived)} {token.symbol}
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2">
            <span className="text-[0.58rem] text-zinc-400 uppercase">Price Impact</span>
            <p
              className={`mt-0.5 text-xs font-bold ${
                isHighImpact ? "text-rose-400" : priceImpact > 1 ? "text-amber-400" : "text-emerald-400"
              }`}
            >
              {priceImpact.toFixed(2)}%
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2">
            <span className="text-[0.58rem] text-zinc-400 uppercase">Taxas do Contrato</span>
            <p className="mt-0.5 text-xs font-bold text-zinc-300">
              {buyTax}% / {sellTax}%
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2">
            <span className="text-[0.58rem] text-zinc-400 uppercase">Gas Estimado</span>
            <p className="mt-0.5 text-xs font-bold text-cyan-400">
              ${networkGasUsd} ({token.chain.toUpperCase()})
            </p>
          </div>
        </div>

        {/* Break-Even Analysis Box */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-[0.62rem]">
          <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
            <span className="font-bold text-zinc-300">🎯 Preço de Break-Even (Zero a Zero):</span>
            <span className="font-bold text-cyan-300">
              ${formatNumber(price * (1 + (buyTax + sellTax + priceImpact * 1.5) / 100))} (+{((buyTax + sellTax + priceImpact * 1.5)).toFixed(1)}%)
            </span>
          </div>

          <div className="mt-2 grid grid-cols-4 gap-1.5 text-center">
            {[
              { target: "+10%", multiplier: 1.1 },
              { target: "+25%", multiplier: 1.25 },
              { target: "+50%", multiplier: 1.5 },
              { target: "+100%", multiplier: 2.0 },
            ].map((t) => {
              const targetGrossValue = orderAmountUsd * t.multiplier;
              const netPnl = targetGrossValue * (1 - (sellTax + priceImpact) / 100) - orderAmountUsd;
              const isProfit = netPnl > 0;

              return (
                <div key={t.target} className="rounded-lg border border-white/5 bg-white/[0.03] p-1.5">
                  <span className="text-[0.56rem] text-zinc-400">{t.target} Alvo</span>
                  <p className={`font-bold ${isProfit ? "text-emerald-400" : "text-rose-400"}`}>
                    {isProfit ? "+" : ""}${netPnl.toFixed(0)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {isHighImpact && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 p-2.5 text-[0.65rem] text-rose-300">
            <ShieldAlert className="size-4 shrink-0 text-rose-400" />
            <span>
              Atenção: A ordem representa &gt;{((orderAmountUsd / liquidity) * 100).toFixed(1)}% do pool. Risco de slippage acentuado.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
