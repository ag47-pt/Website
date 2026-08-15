"use client";

import { useMemo, useState } from "react";
import {
  Users,
  MessageSquare,
  TrendingUp,
  Sparkles,
  Layers,
  Radio,
  Share2,
  Bot,
  Flame,
  ShieldCheck,
} from "lucide-react";
import { useOpportunities } from "@/eco/alt-radar/apps/web/lib/api/query";
import type { Opportunity } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import {
  formatCurrency,
  formatPercent,
  shortenAddress,
} from "@/eco/alt-radar/apps/web/lib/format";
import { SocialPanel } from "@/eco/alt-radar/apps/web/components/dashboard/social-panel";
import { SmartMoneyTracker } from "@/eco/alt-radar/apps/web/components/dashboard/smart-money-tracker";
import { ChainBadge } from "@/eco/alt-radar/apps/web/components/shared/chain-badge";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

export function SocialView() {
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
              <Users className="size-4" />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Inteligência Social &amp; Baleias
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white font-sans">
            Sentimento de Comunidade &amp; Smart Money
          </h1>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-400">
            Rastreamento de carteiras institucionais de alta performance, detecção de bots,
            volume social em tempo real e análise de sentimento em canais Telegram e X.
          </p>
        </div>

        {/* Global Live Indicators */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-[9px] uppercase text-zinc-400 block font-bold">Rastreamento</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Radio className="size-3 animate-pulse" />
              SMART_MONEY_ACTIVE
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-[9px] uppercase text-zinc-400 block font-bold">Token Selecionado</span>
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
            Monitorar Token:
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

      {/* Main Grid: Social Panel + Smart Money Tracker */}
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="min-w-0">
          <SocialPanel tokenId={selectedOpportunity?.token.id ?? null} />
        </div>

        {selectedOpportunity && (
          <div className="min-w-0">
            <SmartMoneyTracker token={selectedOpportunity.token} />
          </div>
        )}
      </div>
    </div>
  );
}
