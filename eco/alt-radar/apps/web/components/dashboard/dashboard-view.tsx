"use client";

import { DatabaseZap } from "lucide-react";
import { useCallback, useState } from "react";
import type { Opportunity } from "@/lib/api/schemas";
import { useSystemStatus } from "@/lib/api/query";
import { formatDateTime } from "@/lib/format";
import { OpportunityTable } from "@/components/opportunities/opportunity-table";
import { useRadarState } from "@/components/radar-state";
import { AlertFeed } from "@/components/alerts/alert-feed";
import { MetricsGrid } from "./metrics-grid";
import { RiskPanel } from "./risk-panel";
import { SocialPanel } from "./social-panel";
import { TokenAnalysis } from "./token-analysis";

export function DashboardView() {
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const { search, chains } = useRadarState();
  const status = useSystemStatus();
  const selectFirstRow = useCallback((rows: Opportunity[]) => {
    setSelected((current) => current ?? rows[0] ?? null);
  }, []);
  const tableKey = `${search.trim()}-${chains.join("-")}`;
  const tokenId = selected?.token.id ?? null;

  return (
    <div className="space-y-3">
      <MetricsGrid />

      <div className="rise rise-2 grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,.92fr)] 2xl:grid-cols-[minmax(500px,1.12fr)_minmax(460px,1fr)_minmax(245px,.52fr)]">
        <div className="min-w-0">
          <OpportunityTable
            key={tableKey}
            compact
            onRowsLoaded={selectFirstRow}
            onSelect={setSelected}
            selectedTokenId={tokenId}
          />
        </div>
        <div className="min-w-0">
          <TokenAnalysis holdersCount={selected?.holders_count ?? null} tokenId={tokenId} />
        </div>
        <aside
          className="grid min-w-0 gap-3 md:grid-cols-2 xl:col-span-2 2xl:col-span-1 2xl:grid-cols-1"
          aria-label="Sinais complementares"
        >
          <div className="panel min-w-0 overflow-hidden">
            <SocialPanel compact tokenId={tokenId} />
          </div>
          <div className="panel min-w-0 overflow-hidden">
            <RiskPanel compact tokenId={tokenId} />
          </div>
        </aside>
        <div className="min-w-0 xl:col-span-2 2xl:col-span-3">
          <AlertFeed compact />
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 pb-1 text-[0.6rem] text-radar-subtle">
        <DatabaseZap
          className={`size-3 ${status.data?.status === "operational" ? "text-radar-positive" : "text-radar-warning"}`}
        />
        <span>
          {status.data?.demo_mode ? "Fontes reais e demo rotuladas" : "Dados operacionais"}
        </span>
        <span aria-hidden="true">•</span>
        <span>Atualizado: {formatDateTime(status.data?.last_sync_at ?? null)}</span>
        <span aria-hidden="true">•</span>
        <span>Blockchain read-only</span>
      </footer>
    </div>
  );
}
