"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Calculator, FileDown, ShieldCheck, TrendingUp, X } from "lucide-react";
import type { Opportunity } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { ChainBadge } from "@/eco/alt-radar/apps/web/components/shared/chain-badge";
import { CopyButton } from "@/eco/alt-radar/apps/web/components/shared/copy-button";
import { TokenAnalysis } from "./token-analysis";
import { SwapSimulator } from "./swap-simulator";
import { PaperTrading } from "./paper-trading";
import { RiskPanel } from "./risk-panel";
import { SocialPanel } from "./social-panel";

interface TokenMobileDrawerProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TokenMobileDrawer({ opportunity, isOpen, onClose }: TokenMobileDrawerProps) {
  const [activeTab, setActiveTab] = useState<"analysis" | "swap" | "trade" | "risk">("analysis");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !opportunity) return null;

  const token = opportunity.token;
  const market = opportunity.market;
  const risk = opportunity.risk;
  const score = opportunity.score;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end xl:hidden">
      {/* Dark backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Card */}
      <div className="relative z-10 flex max-h-[88vh] w-full flex-col rounded-t-3xl border-t border-zinc-800 bg-zinc-950 p-4 text-white shadow-2xl font-mono">
        {/* Drag handle */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-zinc-800" />

        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#d1ff00]/15 text-[#d1ff00] font-bold text-sm">
              {token.symbol.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate text-sm font-bold text-white">{token.name}</h3>
                <span className="text-xs text-zinc-400 font-normal">{token.symbol}</span>
                <ChainBadge chain={token.chain} />
              </div>
              <p className="text-[0.62rem] text-zinc-500 truncate">
                Preço: ${market?.price_usd ?? "N/D"} • Score: {score?.final_score ?? "N/D"}/10
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Fechar Gaveta"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Drawer Tab Switcher */}
        <div className="mt-2.5 flex items-center gap-1 overflow-x-auto border-b border-zinc-800/80 pb-2 text-[0.68rem]">
          <button
            type="button"
            onClick={() => setActiveTab("analysis")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "analysis"
                ? "border border-[#d1ff00]/40 bg-[#d1ff00]/15 text-[#d1ff00] font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            📊 Visão Geral
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("swap")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "swap"
                ? "border border-[#d1ff00]/40 bg-[#d1ff00]/15 text-[#d1ff00] font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Calculator className="mr-1 inline size-3" />
            Slippage
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("trade")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "trade"
                ? "border border-[#d1ff00]/40 bg-[#d1ff00]/15 text-[#d1ff00] font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <TrendingUp className="mr-1 inline size-3" />
            Paper Trade
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("risk")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "risk"
                ? "border border-[#d1ff00]/40 bg-[#d1ff00]/15 text-[#d1ff00] font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="mr-1 inline size-3" />
            Auditoria & Risco
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="mt-3 overflow-y-auto pr-1 pb-4">
          {activeTab === "analysis" && (
            <TokenAnalysis holdersCount={opportunity.holders_count} tokenId={token.id} />
          )}
          {activeTab === "swap" && (
            <SwapSimulator token={token} market={market} risk={opportunity.risk ? { ...opportunity.risk, id: "risk_mobile", token_id: token.id, liquidity_lock_status: "locked", top_holders_percentage: 15, deployer_percentage: 1, owner_privileges: "None", mintable: false, blacklist_capability: false, holders_count: opportunity.holders_count, can_change_tax: false, buy_tax: 0, sell_tax: 0, proxy_contract: false, contract_age_days: 120, honeypot_status: "Clean", flags: [] } : null} />
          )}
          {activeTab === "trade" && (
            <PaperTrading selectedOpportunity={opportunity} />
          )}
          {activeTab === "risk" && (
            <div className="space-y-3">
              <RiskPanel compact={false} tokenId={token.id} />
              <SocialPanel compact={false} tokenId={token.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
