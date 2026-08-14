"use client";

import { useState } from "react";
import { ArrowRight, Calculator, Check, Copy, HelpCircle, ShieldAlert, Sparkles } from "lucide-react";
import type { Market, Risk, Token } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { formatCurrency, formatNumber, formatPercent } from "@/eco/alt-radar/apps/web/lib/format";

interface SwapSimulatorProps {
  token: Token;
  market: Market | null;
  risk: Risk | null;
}

export function SwapSimulator({ token, market, risk }: SwapSimulatorProps) {
  const [orderAmountUsd, setOrderAmountUsd] = useState<number>(500);
  const [copied, setCopied] = useState(false);

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
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3.5 font-mono">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
        <div className="flex items-center gap-1.5">
          <Calculator className="size-4 text-[#d1ff00]" />
          <h4 className="text-xs font-bold text-white">Simulador de Impacto & Slippage</h4>
        </div>
        <button
          type="button"
          onClick={copySimulation}
          className="inline-flex items-center gap-1 text-[0.62rem] text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Copiar JSON do Trade Simulado"
        >
          {copied ? <Check className="size-3 text-[#d1ff00]" /> : <Copy className="size-3" />}
          <span>{copied ? "Copiado!" : "Payload JSON"}</span>
        </button>
      </div>

      <div className="mt-3 grid gap-3">
        {/* Preset Buttons */}
        <div>
          <span className="text-[0.6rem] uppercase tracking-wider text-zinc-500 font-bold">
            Tamanho da Ordem (USD):
          </span>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {[100, 250, 500, 1000, 2500, 5000].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setOrderAmountUsd(amount)}
                className={`px-2.5 py-1 rounded-lg border text-[0.68rem] font-bold transition-all cursor-pointer ${
                  orderAmountUsd === amount
                    ? "border-[#d1ff00]/60 bg-[#d1ff00]/15 text-[#d1ff00] shadow-[0_0_8px_rgba(209,255,0,0.15)]"
                    : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-white"
                }`}
              >
                ${amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-2">
            <span className="text-[0.58rem] text-zinc-500 uppercase">Tokens Estimados</span>
            <p className="mt-0.5 text-xs font-bold text-white truncate">
              {formatNumber(netTokensReceived)} {token.symbol}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-2">
            <span className="text-[0.58rem] text-zinc-500 uppercase">Price Impact</span>
            <p
              className={`mt-0.5 text-xs font-bold ${
                isHighImpact ? "text-rose-400" : priceImpact > 1 ? "text-amber-400" : "text-[#d1ff00]"
              }`}
            >
              {priceImpact.toFixed(2)}%
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-2">
            <span className="text-[0.58rem] text-zinc-500 uppercase">Taxas do Contrato</span>
            <p className="mt-0.5 text-xs font-bold text-zinc-300">
              {buyTax}% / {sellTax}%
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-2">
            <span className="text-[0.58rem] text-zinc-500 uppercase">Gas Estimado</span>
            <p className="mt-0.5 text-xs font-bold text-cyan-400">
              ${networkGasUsd} ({token.chain.toUpperCase()})
            </p>
          </div>
        </div>

        {isHighImpact && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-[0.65rem] text-rose-300">
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
