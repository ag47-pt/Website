"use client";

import { useState } from "react";
import { useOpportunities } from "@/lib/api/query";
import { useRadarState } from "@/components/radar-state";
import { ChainBadge } from "@/components/shared/chain-badge";
import { DataBadges } from "@/components/shared/data-badges";
import { EmptyState, ErrorState, PanelSkeleton } from "@/components/shared/query-state";
import { getErrorMessage } from "@/lib/format";
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
    <div className="space-y-3">
      <header>
        <p className="eyebrow">{isSocial ? "Inteligência de comunidade" : "Análise defensiva"}</p>
        <h1 className="mt-1 text-xl font-extrabold tracking-[-0.04em]">
          {isSocial ? "Social" : "Risco"}
        </h1>
        <p className="mt-1 max-w-2xl text-xs leading-5 text-radar-muted">
          {isSocial
            ? "Compare atividade, crescimento, participação e sinais de automação. Providers demo permanecem explicitamente identificados."
            : "Inspecione permissões, concentração, liquidez e contrato. Qualquer sinal ausente permanece desconhecido, nunca seguro."}
        </p>
      </header>
      <div className="grid gap-3 xl:grid-cols-[19rem_minmax(0,1fr)]">
        <section className="panel overflow-hidden" aria-label="Selecionar token monitorado">
          <div className="border-b border-radar-border p-3">
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
            <div className="max-h-[70vh] overflow-y-auto p-2">
              {opportunities.data.items.map((item) => (
                <button
                  key={item.token.id}
                  aria-pressed={activeTokenId === item.token.id}
                  className={`mb-1.5 flex w-full items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-left ${activeTokenId === item.token.id ? "border-radar-positive/45 bg-[#10261e]" : "border-transparent bg-black/10 hover:border-radar-border"}`}
                  onClick={() => setSelectedTokenId(item.token.id)}
                  type="button"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-extrabold">
                      {item.token.symbol}
                    </span>
                    <span className="block truncate text-[0.59rem] text-radar-subtle">
                      {item.token.name}
                    </span>
                  </span>
                  <ChainBadge chain={item.token.chain} />
                </button>
              ))}
            </div>
          )}
        </section>
        <div className="panel min-w-0 overflow-hidden">
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
