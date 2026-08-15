"use client";

import { useMemo, useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  FileCode,
  Layers,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Cpu,
  Search,
} from "lucide-react";
import { useOpportunities, useScore } from "@/eco/alt-radar/apps/web/lib/api/query";
import type { Opportunity } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import {
  formatCurrency,
  formatPercent,
  shortenAddress,
} from "@/eco/alt-radar/apps/web/lib/format";
import { RiskPanel } from "@/eco/alt-radar/apps/web/components/dashboard/risk-panel";
import { ScoreBreakdown } from "@/eco/alt-radar/apps/web/components/dashboard/score-breakdown";
import { ChainBadge } from "@/eco/alt-radar/apps/web/components/shared/chain-badge";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

export function RiskView() {
  const { primary } = useEcoTheme();
  const opportunitiesQuery = useOpportunities({ page: 1, pageSize: 50 });
  const allOpportunities = opportunitiesQuery.data?.items ?? [];

  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

  const selectedOpportunity = useMemo(() => {
    if (!selectedTokenId && allOpportunities.length > 0) {
      return allOpportunities[0];
    }
    return allOpportunities.find((o) => o.token.id === selectedTokenId) ?? null;
  }, [allOpportunities, selectedTokenId]);

  const scoreQuery = useScore(selectedOpportunity?.token.id ?? null);
  const scoreData = scoreQuery.data ?? selectedOpportunity?.score ?? null;

  return (
    <div className="space-y-4 font-mono">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="grid size-7 place-items-center rounded-lg border text-xs"
              style={{
                borderColor: `${primary}50`,
                backgroundColor: `${primary}15`,
                color: primary,
              }}
            >
              <ShieldAlert className="size-4" />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Auditoria de Risco Zero-Trust
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white font-sans">
            Segurança de Smart Contracts &amp; Score Audit
          </h1>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-400">
            Varredura algorítmica profunda de contratos, verificação de honeypot, bloqueio de liquidez LP,
            taxas de transação ocultas e decomposição de score multivariável.
          </p>
        </div>

        {/* Global Live Indicators */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-[9px] uppercase text-zinc-400 block font-bold">Protocolo</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="size-3" />
              ZERO_TRUST_ENGINE
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-[9px] uppercase text-zinc-400 block font-bold">Ativo sob Auditoria</span>
            <span className="text-white font-bold" style={{ color: primary }}>
              {selectedOpportunity?.token.symbol ?? "Nenhum"}
            </span>
          </div>
        </div>
      </header>

      {/* Asset Quick Selector Bar */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 shadow-md overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mr-2 flex items-center gap-1.5">
            <Layers className="size-3" style={{ color: primary }} />
            Auditar Token:
          </span>
          {allOpportunities.map((opp) => {
            const isSelected = (selectedOpportunity?.token.id ?? "") === opp.token.id;
            return (
              <button
                key={opp.token.id}
                type="button"
                onClick={() => setSelectedTokenId(opp.token.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white/[0.12] text-white border-white/30 shadow-md"
                    : "bg-white/[0.03] border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]"
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: `${primary}60`,
                        backgroundColor: `${primary}20`,
                        color: primary,
                      }
                    : {}
                }
              >
                <span>{opp.token.symbol}</span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {formatCurrency(opp.market?.price_usd ?? null)}
                </span>
                <ChainBadge chain={opp.token.chain} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Risk Panel + Score Breakdown */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <div className="min-w-0">
          <RiskPanel tokenId={selectedOpportunity?.token.id ?? null} />
        </div>

        <div className="min-w-0 space-y-4">
          {/* Detailed Score Breakdown */}
          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="size-4" style={{ color: primary }} />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Decomposição Algorítmica de Score
                </h2>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                {selectedOpportunity?.token.symbol ?? ""}
              </span>
            </div>

            <div className="mt-3">
              <ScoreBreakdown score={scoreData} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
