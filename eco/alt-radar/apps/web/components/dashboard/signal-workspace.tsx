"use client";

import { useState } from "react";
import { useOpportunities } from "@/eco/alt-radar/apps/web/lib/api/query";
import { useRadarState } from "@/eco/alt-radar/apps/web/components/radar-state";
import { ChainBadge } from "@/eco/alt-radar/apps/web/components/shared/chain-badge";
import { DataBadges } from "@/eco/alt-radar/apps/web/components/shared/data-badges";
import { EmptyState, ErrorState, PanelSkeleton } from "@/eco/alt-radar/apps/web/components/shared/query-state";
import { getErrorMessage } from "@/eco/alt-radar/apps/web/lib/format";
import { RiskPanel } from "./risk-panel";
import { SocialPanel } from "./social-panel";

export function SignalWorkspace({ kind }: { kind: "social" | "risk" }) {
  const { search, chains } = useRadarState();
  const opportunities = useOpportunities({
    q: search || undefined,
    chains: chains.length ? chains : undefined,
    page: 1,
    pageSize: 50,
    sortBy: "score",
    sortOrder: "desc",
  });
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const activeTokenId = selectedTokenId ?? opportunities.data?.items[0]?.token.id ?? null;
  const isSocial = kind === "social";

  return (
    <div className="space-y-3 font-mono">
      <header>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-zinc-400">{isSocial ? "Inteligência de comunidade" : "Análise defensiva"}</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-white font-sans">
          {isSocial ? "Social" : "Risco"}
        </h1>
        <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-400">
          {isSocial
            ? "Compare atividade, crescimento, participação e sinais de automação. Providers demo permanecem explicitamente identificados."
            : "Inspecione permissões, concentração, liquidez e contrato. Qualquer sinal ausente permanece desconhecido, nunca seguro."}
        </p>
      </header>
      <div className="grid gap-3 xl:grid-cols-[19rem_minmax(0,1fr)]">
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden" aria-label="Selecionar token monitorado">
          <div className="border-b border-white/10 p-3">
            <DataBadges
              demo={opportunities.data?.demo_mode}
              partial={opportunities.data?.partial}
              stale={opportunities.data?.stale}
            />
          </div>
          {opportunities.isLoading ? (
            <PanelSkeleton rows={6} />
          ) : opportunities.isError ? (
            <ErrorState
              message={getErrorMessage(opportunities.error)}
              retry={() => void opportunities.refetch()}
            />
          ) : !opportunities.data?.items.length ? (
            <EmptyState />
          ) : (
            <div className="max-h-[70vh] overflow-y-auto p-2 custom-scrollbar space-y-1">
              {opportunities.data.items.map((item) => (
                <button
                  key={item.token.id}
                  aria-pressed={activeTokenId === item.token.id}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition-all cursor-pointer ${activeTokenId === item.token.id ? "border-cyan-500/50 bg-[#050c12] text-white shadow-[0_0_12px_rgba(0,217,255,0.15)] ring-1 ring-cyan-500/30" : "border-white/5 bg-white/[0.02] hover:border-white/15"}`}
                  onClick={() => setSelectedTokenId(item.token.id)}
                  type="button"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold text-white">
                      {item.token.symbol}
                    </span>
                    <span className="block truncate text-[0.59rem] text-zinc-400">
                      {item.token.name}
                    </span>
                  </span>
                  <ChainBadge chain={item.token.chain} />
                </button>
              ))}
            </div>
          )}
        </section>
        <div className="min-w-0">
          {isSocial ? (
            <SocialPanel tokenId={activeTokenId} />
          ) : (
            <RiskPanel tokenId={activeTokenId} />
          )}
        </div>
      </div>
    </div>
  );
}
