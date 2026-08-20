"use client";

import { CircleAlert, Wallet } from "lucide-react";
import type { Token } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

interface SmartMoneyTrackerProps {
  token: Token;
}

export function SmartMoneyTracker({ token }: SmartMoneyTrackerProps) {
  const { primary } = useEcoTheme();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 font-mono text-xs text-white shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Wallet className="size-4" style={{ color: primary }} />
          <div>
            <h4 className="font-bold text-white font-sans text-xs">
              Smart Money &amp; Top Traders (24h)
            </h4>
            <p className="text-[0.6rem] text-zinc-400">Proveniência de carteiras e desempenho</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-xl border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[0.62rem] font-bold text-amber-300">
          <CircleAlert className="size-3" /> Não configurado
        </span>
      </div>

      <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-3 text-[0.65rem] leading-5 text-zinc-300">
        Não existe provider autorizado de carteiras para {token.chain}. Endereços, posições, PNL e
        win-rate permanecem indisponíveis; o Radar não fabrica nem infere esses valores.
      </div>
    </div>
  );
}
