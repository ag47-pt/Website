"use client";

import { CircleAlert, Layers } from "lucide-react";
import type { Market, Token } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { formatCurrency } from "@/eco/alt-radar/apps/web/lib/format";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

interface LiquidityDepthChartProps {
  token: Token;
  market: Market | null;
}

export function LiquidityDepthChart({ token, market }: LiquidityDepthChartProps) {
  const { primary } = useEcoTheme();
  const source = market?.source ?? "não informada";
  const marketMode = market?.is_demo ? "DEMO • SEM PROFUNDIDADE" : "SEM PROFUNDIDADE";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 font-mono text-xs text-white shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Layers className="size-4" style={{ color: primary }} />
          <div>
            <h4 className="font-bold text-white font-sans text-xs">
              Profundidade da Pool &amp; Curva AMM
            </h4>
            <p className="text-[0.6rem] text-zinc-400">
              A fonte atual não fornece reservas nem níveis por preço
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-xl border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[0.62rem] font-bold text-amber-300">
          <CircleAlert className="size-3" /> {marketMode}
        </span>
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-2 text-center text-[0.62rem]">
        <div>
          <span className="text-zinc-400 uppercase">Suporte Bids (-15%)</span>
          <p className="mt-0.5 font-bold text-zinc-500">N/D</p>
        </div>
        <div>
          <span className="text-zinc-400 uppercase">Pressão do Livro</span>
          <p className="mt-0.5 font-bold text-zinc-500">N/D</p>
        </div>
        <div>
          <span className="text-zinc-400 uppercase">Resistência Asks (+15%)</span>
          <p className="mt-0.5 font-bold text-zinc-500">N/D</p>
        </div>
      </div>

      <div className="mt-3 flex min-h-24 items-center gap-3 rounded-xl border border-dashed border-amber-500/25 bg-amber-500/[0.05] p-3">
        <CircleAlert className="size-5 shrink-0 text-amber-300" />
        <div>
          <p className="font-bold text-amber-200">Profundidade indisponível</p>
          <p className="mt-1 text-[0.62rem] leading-4 text-zinc-300">
            A fonte {source} entrega apenas o mercado agregado de {token.symbol}; reservas da pool,
            bids, asks e volume por nível não fazem parte do contrato. Nenhuma curva foi estimada.
          </p>
        </div>
      </div>

      <dl className="mt-2.5 grid grid-cols-2 gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-2 text-[0.6rem] sm:grid-cols-4">
        <div>
          <dt className="uppercase text-zinc-500">Preço observado</dt>
          <dd className="mt-0.5 font-bold text-zinc-300">
            {formatCurrency(market?.price_usd ?? null)}
          </dd>
        </div>
        <div>
          <dt className="uppercase text-zinc-500">Liquidez agregada</dt>
          <dd className="mt-0.5 font-bold text-zinc-300">
            {formatCurrency(market?.liquidity_usd ?? null, true)}
          </dd>
        </div>
        <div>
          <dt className="uppercase text-zinc-500">Fonte</dt>
          <dd className="mt-0.5 truncate font-bold text-zinc-300" title={source}>
            {source}
          </dd>
        </div>
        <div>
          <dt className="uppercase text-zinc-500">Qualidade</dt>
          <dd className="mt-0.5 font-bold uppercase text-zinc-300">
            {market?.data_quality ?? "N/D"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
