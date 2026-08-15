"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  X,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  Star,
  Layers,
  ArrowRight,
  Flame,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useOpportunities, useWatchlist, useWatchlistMutation } from "@/eco/alt-radar/apps/web/lib/api/query";
import type { Opportunity, Chain } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatScore,
  shortenAddress,
} from "@/eco/alt-radar/apps/web/lib/format";
import { ChainBadge } from "./chain-badge";
import { CopyButton } from "./copy-button";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

interface SpotlightSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken?: (opp: Opportunity) => void;
}

export function SpotlightSearchModal({
  isOpen,
  onClose,
  onSelectToken,
}: SpotlightSearchModalProps) {
  const router = useRouter();
  const { primary } = useEcoTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [selectedChain, setSelectedChain] = useState<Chain | "all">("all");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Fetch up to 100 opportunities sorted by score
  const { data, isLoading } = useOpportunities({
    page: 1,
    pageSize: 100,
    sortBy: "score",
    sortOrder: "desc",
  });

  const watchlistQuery = useWatchlist();
  const watchlistMutation = useWatchlistMutation();
  const watchlistedIds = useMemo(
    () => new Set(watchlistQuery.data?.items.map((i) => i.token.id) ?? []),
    [watchlistQuery.data],
  );

  // Filter & sort
  const filteredOpportunities = useMemo(() => {
    const items = data?.items ?? [];
    const q = query.trim().toLowerCase();

    return items.filter((opp) => {
      if (selectedChain !== "all" && opp.token.chain !== selectedChain) {
        return false;
      }
      if (!q) return true;

      const symbol = opp.token.symbol.toLowerCase();
      const name = opp.token.name.toLowerCase();
      const contract = opp.token.contract_address.toLowerCase();
      const pair = opp.pair?.pair_address?.toLowerCase() ?? "";

      return (
        symbol.includes(q) ||
        name.includes(q) ||
        contract.includes(q) ||
        pair.includes(q)
      );
    });
  }, [data?.items, query, selectedChain]);

  // Focus on mount/open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setHighlightedIndex(0);
    } else {
      setQuery("");
      setSelectedChain("all");
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOpportunities.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOpportunities.length - 1,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredOpportunities[highlightedIndex];
        if (selected) {
          handleSelect(selected);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredOpportunities, highlightedIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector(
      `[data-index="${highlightedIndex}"]`,
    );
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  const handleSelect = (opp: Opportunity) => {
    if (onSelectToken) {
      onSelectToken(opp);
    }
    // Navigate to opportunities tab focusing this token
    router.push(`/eco/alt-radar?tab=oportunidades`);
    onClose();
  };

  const toggleWatchlist = (e: React.MouseEvent, tokenId: string) => {
    e.stopPropagation();
    const isWatchlisted = watchlistedIds.has(tokenId);
    watchlistMutation.mutate({ tokenId, isWatchlisted });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-10 font-mono">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative z-10 w-full max-w-3xl rounded-2xl border border-white/20 bg-[#0a0a0a]/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200"
        style={{ borderColor: `${primary}40`, boxShadow: `0 0 40px ${primary}15` }}
      >
        {/* Modal Header & Search Input */}
        <div className="relative border-b border-white/10 p-3.5 sm:p-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <Search className="size-5 shrink-0" style={{ color: primary }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlightedIndex(0);
              }}
              placeholder="Buscar por símbolo, nome, contrato (0x...) ou rede..."
              className="w-full bg-transparent text-sm sm:text-base font-mono text-white placeholder:text-zinc-500 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="grid size-6 place-items-center rounded-lg bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Limpar busca"
              >
                <X className="size-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="grid size-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Fechar (Esc)"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Quick Filter Chips */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-2.5 text-[10px]">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-zinc-500 font-bold uppercase tracking-wider mr-1">
                Redes:
              </span>
              {[
                { id: "all", label: "Todas" },
                { id: "bsc", label: "BSC" },
                { id: "solana", label: "SOL" },
                { id: "ethereum", label: "ETH" },
              ].map((c) => {
                const active = selectedChain === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedChain(c.id as Chain | "all");
                      setHighlightedIndex(0);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold uppercase transition-all ${
                      active
                        ? "text-white border shadow-sm"
                        : "bg-white/5 text-zinc-400 border border-white/5 hover:text-zinc-200"
                    }`}
                    style={
                      active
                        ? {
                            borderColor: `${primary}60`,
                            backgroundColor: `${primary}20`,
                            color: primary,
                          }
                        : {}
                    }
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            <div className="text-zinc-500 text-[10px]">
              <span className="font-bold text-zinc-300">
                {filteredOpportunities.length}
              </span>{" "}
              ativos ordenados por score
            </div>
          </div>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-3 divide-y divide-white/5 no-scrollbar"
        >
          {isLoading ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              <Sparkles className="size-6 animate-spin mx-auto mb-2 opacity-50" />
              Indexando base de dados de oportunidades...
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="p-10 text-center text-xs text-zinc-500">
              <p className="font-bold text-zinc-300">Nenhum token encontrado</p>
              <p className="mt-1 text-[11px]">
                Tente ajustar o termo de pesquisa ou o filtro de blockchain.
              </p>
            </div>
          ) : (
            filteredOpportunities.map((opp, index) => {
              const isHighlighted = index === highlightedIndex;
              const isWatchlisted = watchlistedIds.has(opp.token.id);
              const change24h = opp.market?.price_change_24h ?? null;
              const isPositive = (change24h ?? 0) >= 0;
              const score = opp.score?.final_score ?? 0;

              return (
                <div
                  key={opp.token.id}
                  data-index={index}
                  onClick={() => handleSelect(opp)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                    isHighlighted
                      ? "bg-white/[0.08] border border-white/20"
                      : "hover:bg-white/[0.03] border border-transparent"
                  }`}
                  style={
                    isHighlighted
                      ? {
                          borderColor: `${primary}50`,
                          boxShadow: `0 0 20px ${primary}15`,
                        }
                      : {}
                  }
                >
                  {/* Left: Token Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="grid size-10 place-items-center rounded-xl border font-black text-sm shrink-0 uppercase transition-transform group-hover:scale-105"
                      style={{
                        borderColor: `${primary}40`,
                        backgroundColor: `${primary}15`,
                        color: primary,
                      }}
                    >
                      {opp.token.symbol.slice(0, 2)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white font-sans truncate">
                          {opp.token.symbol}
                        </span>
                        <span className="text-xs text-zinc-400 truncate max-w-[140px]">
                          {opp.token.name}
                        </span>
                        <ChainBadge chain={opp.token.chain} />
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-500">
                        <span title={opp.token.contract_address}>
                          {shortenAddress(opp.token.contract_address, 6)}
                        </span>
                        <CopyButton value={opp.token.contract_address} />
                        {opp.score?.positive_factors && opp.score.positive_factors.length > 0 && (
                          <span className="inline-flex items-center gap-1 rounded bg-white/5 px-1.5 py-0.2 text-[9px] text-zinc-300 font-mono">
                            <Zap className="size-2.5 text-amber-400" />
                            {opp.score.positive_factors[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Metrics & Score */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 shrink-0 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    {/* Price & Change */}
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-bold text-white font-mono">
                        {formatCurrency(opp.market?.price_usd ?? null)}
                      </p>
                      <div
                        className={`flex items-center sm:justify-end gap-1 text-[10px] font-bold ${
                          change24h === null
                            ? "text-zinc-500"
                            : isPositive
                              ? "text-emerald-400"
                              : "text-rose-400"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="size-3" />
                        ) : (
                          <TrendingDown className="size-3" />
                        )}
                        <span>{formatPercent(change24h, true)}</span>
                      </div>
                    </div>

                    {/* Liquidity & Volume */}
                    <div className="hidden md:block text-right text-[10px]">
                      <p className="text-zinc-400">
                        Liq:{" "}
                        <span className="text-zinc-200 font-bold">
                          {formatNumber(opp.market?.liquidity_usd ?? null, true)}
                        </span>
                      </p>
                      <p className="text-zinc-400">
                        Vol:{" "}
                        <span className="text-zinc-200 font-bold">
                          {formatNumber(opp.market?.volume_24h ?? null, true)}
                        </span>
                      </p>
                    </div>

                    {/* Score Badge */}
                    <div
                      className="flex flex-col items-center justify-center rounded-xl border px-2.5 py-1 font-mono text-center shrink-0 min-w-[58px]"
                      style={{
                        borderColor:
                          score >= 8
                            ? "#10b98160"
                            : score >= 5
                              ? "#f59e0b60"
                              : "#f43f5e60",
                        backgroundColor:
                          score >= 8
                            ? "#10b98115"
                            : score >= 5
                              ? "#f59e0b15"
                              : "#f43f5e15",
                      }}
                    >
                      <span className="text-[8px] uppercase tracking-wider font-bold text-zinc-400">
                        SCORE
                      </span>
                      <span
                        className={`text-xs font-black ${
                          score >= 8
                            ? "text-emerald-400"
                            : score >= 5
                              ? "text-amber-400"
                              : "text-rose-400"
                        }`}
                      >
                        {formatScore(score)}
                      </span>
                    </div>

                    {/* Watchlist & Action Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => toggleWatchlist(e, opp.token.id)}
                        className={`grid size-8 place-items-center rounded-xl border transition-colors ${
                          isWatchlisted
                            ? "border-amber-500/50 bg-amber-500/20 text-amber-300"
                            : "border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                        }`}
                        title={
                          isWatchlisted
                            ? "Remover da Watchlist"
                            : "Adicionar à Watchlist"
                        }
                      >
                        <Star
                          className="size-3.5"
                          fill={isWatchlisted ? "currentColor" : "none"}
                        />
                      </button>

                      <div
                        className="grid size-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 group-hover:text-white group-hover:bg-white/10 transition-colors"
                        title="Ver no Radar"
                      >
                        <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer with Keyboard Shortcuts */}
        <div className="border-t border-white/10 p-3 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3 text-[10px] text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-white/10 bg-black/50 px-1.5 py-0.5 text-[9px] font-bold text-zinc-300">
                ↑↓
              </kbd>{" "}
              Navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-white/10 bg-black/50 px-1.5 py-0.5 text-[9px] font-bold text-zinc-300">
                ↵
              </kbd>{" "}
              Selecionar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-white/10 bg-black/50 px-1.5 py-0.5 text-[9px] font-bold text-zinc-300">
                ESC
              </kbd>{" "}
              Fechar
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="size-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: primary }}
            />
            <span className="text-[9px] text-zinc-500 font-mono">
              MOTOR DE BUSCA TELEMÉTRICO AG47
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
