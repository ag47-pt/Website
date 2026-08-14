"use client";

import { useCallback, useState } from "react";
import type { Opportunity } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { useRadarState } from "@/eco/alt-radar/apps/web/components/radar-state";
import { RiskPanel } from "@/eco/alt-radar/apps/web/components/dashboard/risk-panel";
import { SocialPanel } from "@/eco/alt-radar/apps/web/components/dashboard/social-panel";
import { TokenAnalysis } from "@/eco/alt-radar/apps/web/components/dashboard/token-analysis";
import { OpportunityTable } from "./opportunity-table";

export function OpportunitiesView({ initialTokenId = null }: { initialTokenId?: string | null }) {
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(initialTokenId);
  const { search, chains } = useRadarState();

  const selectOpportunity = useCallback((opportunity: Opportunity) => {
    setSelected(opportunity);
    setSelectedTokenId(opportunity.token.id);
  }, []);

  const selectFirstRow = useCallback((rows: Opportunity[]) => {
    setSelectedTokenId((current) => current ?? rows[0]?.token.id ?? null);
    setSelected((current) => current ?? rows[0] ?? null);
  }, []);

  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Scanner operacional</p>
          <h1 className="mt-1 text-xl font-extrabold tracking-[-0.04em]">Oportunidades</h1>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-radar-muted">
            Ordene e filtre tokens monitorados; cada seleção atualiza histórico, score, social e
            risco sem recarregar a página.
          </p>
        </div>
      </header>
      <div className="grid min-w-0 gap-3 2xl:grid-cols-[minmax(650px,1.25fr)_minmax(470px,.75fr)]">
        <div className="min-w-0">
          <OpportunityTable
            key={`${search}-${chains.join("-")}`}
            onRowsLoaded={selectFirstRow}
            onSelect={selectOpportunity}
            selectedTokenId={selectedTokenId}
          />
        </div>
        <div className="min-w-0">
          <TokenAnalysis holdersCount={selected?.holders_count ?? null} tokenId={selectedTokenId} />
        </div>
      </div>
      <div className="grid min-w-0 gap-3 xl:grid-cols-2">
        <div className="panel min-w-0 overflow-hidden">
          <SocialPanel tokenId={selectedTokenId} />
        </div>
        <div className="panel min-w-0 overflow-hidden">
          <RiskPanel tokenId={selectedTokenId} />
        </div>
      </div>
    </div>
  );
}
