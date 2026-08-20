"use client";

import { useEffect, useState } from "react";
import { Calculator, ShieldCheck, TrendingUp, X } from "lucide-react";
import type { Opportunity } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { ChainBadge } from "@/eco/alt-radar/apps/web/components/shared/chain-badge";
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
  const score = opportunity.score;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end xl:hidden">
      {/* Dark backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Card */}
      <div className="relative z-10 flex max-h-[88vh] w-full flex-col rounded-t-3xl border-t border-white/10 bg-[#050c12]/95 backdrop-blur-2xl p-4 text-white shadow-2xl font-mono">
        {/* Drag handle */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/20" />

        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-cyan-500/30 bg-cyan-950/50 text-cyan-300 font-bold text-sm shadow-[0_0_8px_rgba(0,217,255,0.2)]">
              {token.symbol.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate text-sm font-bold text-white font-sans">{token.name}</h3>
                <span className="text-xs text-zinc-400 font-normal">{token.symbol}</span>
                <ChainBadge chain={token.chain} />
              </div>
              <p className="text-[0.62rem] text-zinc-400 truncate font-mono">
                Preço: ${market?.price_usd ?? "N/D"} • Score: {score?.final_score ?? "N/D"}/10
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Fechar Gaveta"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Drawer Tab Switcher */}
        <div className="mt-2.5 flex items-center gap-1 overflow-x-auto border-b border-white/10 pb-2 text-[0.68rem] custom-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("analysis")}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "analysis"
                ? "border border-cyan-500/40 bg-cyan-500/15 text-cyan-300 font-bold shadow-[0_0_8px_rgba(0,217,255,0.15)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            📊 Visão Geral
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("swap")}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "swap"
                ? "border border-cyan-500/40 bg-cyan-500/15 text-cyan-300 font-bold shadow-[0_0_8px_rgba(0,217,255,0.15)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Calculator className="mr-1 inline size-3" />
            Slippage
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("trade")}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "trade"
                ? "border border-cyan-500/40 bg-cyan-500/15 text-cyan-300 font-bold shadow-[0_0_8px_rgba(0,217,255,0.15)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <TrendingUp className="mr-1 inline size-3" />
            Paper Trade
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("risk")}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "risk"
                ? "border border-cyan-500/40 bg-cyan-500/15 text-cyan-300 font-bold shadow-[0_0_8px_rgba(0,217,255,0.15)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="mr-1 inline size-3" />
            Auditoria & Risco
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="mt-3 overflow-y-auto pr-1 pb-4 custom-scrollbar">
          {activeTab === "analysis" && (
            <TokenAnalysis holdersCount={opportunity.holders_count} tokenId={token.id} />
          )}
          {activeTab === "swap" && (
            <SwapSimulator
              token={token}
              market={market}
              risk={
                opportunity.risk
                  ? {
                      ...opportunity.risk,
                      id: "risk_mobile",
                      token_id: token.id,
                      liquidity_lock_status: "locked",
                      top_holders_percentage: 15,
                      deployer_percentage: 1,
                      owner_privileges: "None",
                      mintable: false,
                      blacklist_capability: false,
                      holders_count: opportunity.holders_count,
                      can_change_tax: false,
                      buy_tax: 0,
                      sell_tax: 0,
                      proxy_contract: false,
                      contract_age_days: 120,
                      honeypot_status: "Clean",
                      flags: [],
                    }
                  : null
              }
            />
          )}
          {activeTab === "trade" && <PaperTrading selectedOpportunity={opportunity} />}
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
