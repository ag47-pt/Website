"use client";

import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useOpportunities, useWatchlistMutation } from "@/eco/alt-radar/apps/web/lib/api/query";
import type { Opportunity, OpportunityFilters } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import {
  formatAge,
  formatClassification,
  formatCurrency,
  formatDateTime,
  formatNumber,
  formatPercent,
  formatScore,
  getErrorMessage,
  shortenAddress,
} from "@/eco/alt-radar/apps/web/lib/format";
import { ChainBadge } from "@/eco/alt-radar/apps/web/components/shared/chain-badge";
import { DataBadges } from "@/eco/alt-radar/apps/web/components/shared/data-badges";
import {
  EmptyState,
  ErrorState,
  PanelSkeleton,
} from "@/eco/alt-radar/apps/web/components/shared/query-state";
import { useRadarState } from "@/eco/alt-radar/apps/web/components/radar-state";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";
import {
  PUBLIC_OPERATOR_ACTION_TITLE,
  PUBLIC_PORTAL_READ_ONLY,
} from "@/eco/alt-radar/apps/web/lib/public-access";
import { Sparkline } from "@/eco/alt-radar/apps/web/components/shared/sparkline";
import { playTokenSelectSound } from "@/eco/alt-radar/apps/web/lib/sonar-audio";

interface OpportunityTableProps {
  selectedTokenId: string | null;
  onSelect: (opportunity: Opportunity) => void;
  onRowsLoaded?: (opportunities: Opportunity[]) => void;
  compact?: boolean;
}

interface AdvancedFilters {
  minScore: string;
  maxRisk: string;
  maxPairAgeHours: string;
  minLiquidity: string;
}

const DEFAULT_FILTERS: AdvancedFilters = {
  minScore: "",
  maxRisk: "",
  maxPairAgeHours: "",
  minLiquidity: "",
};

const sortingMap: Record<string, string> = {
  price: "price",
  change1h: "price_change_1h",
  liquidity: "liquidity",
  volume1h: "volume_1h",
  volume24h: "volume_24h",
  age: "pair_age",
  score: "score",
  updated: "updated_at",
};

function numericFilter(value: string) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function changeTone(value: number | null) {
  if (value === null) return "text-zinc-500 font-mono";
  if (value > 0) return "text-emerald-400 font-mono font-semibold";
  if (value < 0) return "text-rose-400 font-mono font-semibold";
  return "text-zinc-400 font-mono";
}

function scoreTone(value: number | null) {
  if (value === null) return "border-white/10 bg-white/5 text-zinc-500";
  if (value >= 8)
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold shadow-[0_0_8px_rgba(16,185,129,0.15)]";
  if (value >= 6.5)
    return "border-cyan-500/40 bg-cyan-500/10 text-cyan-400 font-bold shadow-[0_0_8px_rgba(0,217,255,0.15)]";
  if (value >= 5)
    return "border-amber-500/40 bg-amber-500/10 text-amber-400 font-bold shadow-[0_0_8px_rgba(245,158,11,0.15)]";
  return "border-rose-500/40 bg-rose-500/10 text-rose-400 font-bold";
}

function statusTone(classification: string | null) {
  const normalized = classification?.toLowerCase() ?? "";
  if (normalized.includes("forte"))
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold";
  if (normalized.includes("observar"))
    return "border-cyan-500/40 bg-cyan-500/10 text-cyan-400 font-bold";
  if (normalized.includes("especul"))
    return "border-amber-500/40 bg-amber-500/10 text-amber-400 font-bold";
  return "border-rose-500/40 bg-rose-500/10 text-rose-400 font-bold";
}

function SortableHeader({
  label,
  column,
}: {
  label: string;
  column: {
    getIsSorted: () => false | "asc" | "desc";
    toggleSorting: (descending?: boolean) => void;
  };
}) {
  const direction = column.getIsSorted();
  const Icon = direction === "asc" ? ArrowUp : direction === "desc" ? ArrowDown : ArrowUpDown;
  return (
    <button
      className="flex items-center gap-1 whitespace-nowrap text-[0.61rem] font-bold text-radar-muted hover:text-radar-ink"
      onClick={() => column.toggleSorting(direction === "asc")}
      type="button"
    >
      {label} <Icon className="size-3" />
    </button>
  );
}

function buildColumns(toggleWatchlist: (row: Opportunity) => void): ColumnDef<Opportunity>[] {
  return [
    {
      id: "favorite",
      header: () => <span className="sr-only">Favorito</span>,
      cell: ({ row }) => (
        <button
          aria-label={
            row.original.watchlisted
              ? `Remover ${row.original.token.symbol} da watchlist`
              : `Adicionar ${row.original.token.symbol} à watchlist`
          }
          aria-pressed={row.original.watchlisted}
          data-testid={`watchlist-toggle-${row.original.token.symbol.toLowerCase()}`}
          className={`grid size-7 place-items-center rounded-md hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 ${row.original.watchlisted ? "text-radar-warning" : "text-radar-subtle"}`}
          disabled={PUBLIC_PORTAL_READ_ONLY}
          onClick={(event) => {
            event.stopPropagation();
            toggleWatchlist(row.original);
          }}
          title={PUBLIC_OPERATOR_ACTION_TITLE}
          type="button"
        >
          <Star className="size-3.5" fill={row.original.watchlisted ? "currentColor" : "none"} />
        </button>
      ),
      size: 40,
      enableSorting: false,
    },
    {
      id: "token",
      accessorFn: (row) => row.token.symbol,
      header: "Token",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex min-w-28 items-center gap-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-radar-neutral/30 bg-[#122843] text-xs font-extrabold text-radar-neutral">
            {row.original.token.symbol.slice(0, 1)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[0.7rem] font-extrabold text-radar-ink">
              {row.original.token.symbol}
            </span>
            <span className="block max-w-24 truncate text-[0.59rem] text-radar-subtle">
              {row.original.token.name}
            </span>
          </span>
        </div>
      ),
    },
    {
      id: "address",
      header: "Contrato",
      cell: ({ row }) => (
        <span className="mono text-[0.6rem] text-radar-subtle">
          {shortenAddress(row.original.token.contract_address)}
        </span>
      ),
      enableSorting: false,
    },
    {
      id: "chain",
      accessorFn: (row) => row.token.chain,
      header: "Chain",
      enableSorting: false,
      cell: ({ row }) => <ChainBadge chain={row.original.token.chain} />,
    },
    {
      id: "price",
      accessorFn: (row) => row.market?.price_usd,
      header: ({ column }) => <SortableHeader label="Preço" column={column} />,
      cell: ({ row }) => (
        <span className="mono text-[0.65rem] font-semibold">
          {formatCurrency(row.original.market?.price_usd ?? null)}
        </span>
      ),
    },
    {
      id: "change1h",
      accessorFn: (row) => row.market?.price_change_1h,
      header: ({ column }) => <SortableHeader label="Var. 1h" column={column} />,
      cell: ({ row }) => (
        <span
          className={`mono text-[0.65rem] font-bold ${changeTone(row.original.market?.price_change_1h ?? null)}`}
        >
          {formatPercent(row.original.market?.price_change_1h ?? null, true)}
        </span>
      ),
    },
    {
      id: "sparkline",
      accessorFn: (row) => row.market?.price_change_24h,
      header: "Tendência 24h",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 min-w-[76px]">
          <Sparkline
            change24h={row.original.market?.price_change_24h}
            change1h={row.original.market?.price_change_1h}
            change5m={row.original.market?.price_change_5m}
            seed={row.original.token.id}
            width={70}
            height={20}
          />
        </div>
      ),
    },
    {
      id: "liquidity",
      accessorFn: (row) => row.market?.liquidity_usd,
      header: ({ column }) => <SortableHeader label="Liquidez" column={column} />,
      cell: ({ row }) => (
        <span className="mono text-[0.65rem]">
          {formatCurrency(row.original.market?.liquidity_usd ?? null, true)}
        </span>
      ),
    },
    {
      id: "volume1h",
      accessorFn: (row) => row.market?.volume_1h,
      header: ({ column }) => <SortableHeader label="Volume 1h" column={column} />,
      cell: ({ row }) => (
        <span className="mono text-[0.65rem]">
          {formatCurrency(row.original.market?.volume_1h ?? null, true)}
        </span>
      ),
    },
    {
      id: "volume24h",
      accessorFn: (row) => row.market?.volume_24h,
      header: ({ column }) => <SortableHeader label="Volume 24h" column={column} />,
      cell: ({ row }) => (
        <span className="mono text-[0.65rem]">
          {formatCurrency(row.original.market?.volume_24h ?? null, true)}
        </span>
      ),
    },
    {
      id: "age",
      accessorFn: (row) => row.pair.created_at,
      header: ({ column }) => <SortableHeader label="Idade do par" column={column} />,
      cell: ({ row }) => (
        <span className="mono text-[0.64rem] text-radar-muted">
          {formatAge(row.original.pair.created_at)}
        </span>
      ),
    },
    {
      id: "holders",
      accessorFn: (row) => row.holders_count,
      header: "Holders",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="mono text-[0.65rem]">
          {formatNumber(row.original.holders_count, true)}
        </span>
      ),
    },
    {
      id: "score",
      accessorFn: (row) => row.score?.final_score,
      header: ({ column }) => <SortableHeader label="Score" column={column} />,
      cell: ({ row }) => (
        <span
          className={`mono inline-flex min-w-10 justify-center rounded-md border px-2 py-1 text-[0.65rem] font-extrabold ${scoreTone(row.original.score?.final_score ?? null)}`}
        >
          {formatScore(row.original.score?.final_score ?? null)}
        </span>
      ),
    },
    {
      id: "status",
      accessorFn: (row) => row.score?.classification,
      header: "Status",
      enableSorting: false,
      cell: ({ row }) => (
        <span
          className={`inline-flex whitespace-nowrap rounded-md border px-2 py-1 text-[0.6rem] font-extrabold ${statusTone(row.original.score?.classification ?? null)}`}
        >
          {formatClassification(row.original.score?.classification ?? null)}
        </span>
      ),
    },
    {
      id: "updated",
      accessorFn: (row) => row.updated_at,
      header: ({ column }) => <SortableHeader label="Atualizado" column={column} />,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-[0.59rem] text-radar-subtle">
          {formatDateTime(row.original.updated_at)}
        </span>
      ),
    },
  ];
}

function MobileOpportunityCard({
  row,
  selected,
  onSelect,
  onToggle,
}: {
  row: Opportunity;
  selected: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  return (
    <article
      className={`rounded-2xl border p-3.5 backdrop-blur-md transition-all ${selected ? "border-cyan-500/50 bg-cyan-950/30 shadow-[0_0_18px_rgba(0,217,255,0.12)] ring-1 ring-cyan-500/30" : "border-white/10 bg-white/[0.03] hover:border-white/20"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <button className="min-w-0 flex-1 text-left" onClick={onSelect} type="button">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl border border-cyan-500/30 bg-cyan-950/50 font-extrabold text-cyan-300">
              {row.token.symbol[0]}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold text-white">
                {row.token.symbol}
              </span>
              <span className="block truncate font-mono text-[0.58rem] text-zinc-400">
                {shortenAddress(row.token.contract_address, 7)}
              </span>
            </span>
            <ChainBadge chain={row.token.chain} />
            <Sparkline
              change24h={row.market?.price_change_24h}
              change1h={row.market?.price_change_1h}
              change5m={row.market?.price_change_5m}
              seed={row.token.id}
              width={56}
              height={18}
            />
          </div>
        </button>
        <button
          aria-label={row.watchlisted ? "Remover da watchlist" : "Adicionar à watchlist"}
          className={`${row.watchlisted ? "text-amber-400" : "text-zinc-500 hover:text-zinc-300"} disabled:cursor-not-allowed disabled:opacity-50`}
          disabled={PUBLIC_PORTAL_READ_ONLY}
          onClick={onToggle}
          title={PUBLIC_OPERATOR_ACTION_TITLE}
          type="button"
        >
          <Star className="size-5" fill={row.watchlisted ? "currentColor" : "none"} />
        </button>
      </div>
      <button
        className="mt-3 grid w-full grid-cols-3 gap-x-3 gap-y-2 text-left font-mono"
        onClick={onSelect}
        type="button"
      >
        <span>
          <span className="block text-[0.56rem] font-bold uppercase text-zinc-500">Preço</span>
          <span className="text-[0.65rem] font-bold text-white">
            {formatCurrency(row.market?.price_usd ?? null)}
          </span>
        </span>
        <span>
          <span className="block text-[0.56rem] font-bold uppercase text-zinc-500">
            Variação 1h
          </span>
          <span
            className={`text-[0.65rem] font-bold ${changeTone(row.market?.price_change_1h ?? null)}`}
          >
            {formatPercent(row.market?.price_change_1h ?? null, true)}
          </span>
        </span>
        <span>
          <span className="block text-[0.56rem] font-bold uppercase text-zinc-500">Score</span>
          <span
            className={`text-[0.68rem] font-extrabold ${changeTone(row.score?.final_score ?? null)}`}
          >
            {formatScore(row.score?.final_score ?? null)}
          </span>
        </span>
        <span>
          <span className="block text-[0.56rem] font-bold uppercase text-zinc-500">Liquidez</span>
          <span className="text-[0.63rem] text-zinc-300">
            {formatCurrency(row.market?.liquidity_usd ?? null, true)}
          </span>
        </span>
        <span>
          <span className="block text-[0.56rem] font-bold uppercase text-zinc-500">Vol. 24h</span>
          <span className="text-[0.63rem] text-zinc-300">
            {formatCurrency(row.market?.volume_24h ?? null, true)}
          </span>
        </span>
        <span>
          <span className="block text-[0.56rem] font-bold uppercase text-zinc-500">Risco</span>
          <span className="text-[0.63rem] text-zinc-300">
            {row.risk?.risk_score === null || row.risk === null
              ? "N/D"
              : `${formatScore(row.risk.risk_score)}/10`}
          </span>
        </span>
        <span>
          <span className="block text-[0.56rem] font-bold uppercase text-zinc-500">Idade</span>
          <span className="text-[0.63rem] text-zinc-400">{formatAge(row.pair.created_at)}</span>
        </span>
        <span>
          <span className="block text-[0.56rem] font-bold uppercase text-zinc-500">Holders</span>
          <span className="text-[0.63rem] text-zinc-300">
            {formatNumber(row.holders_count, true)}
          </span>
        </span>
        <span>
          <span className="block text-[0.56rem] font-bold uppercase text-zinc-500">Atualizado</span>
          <span className="text-[0.59rem] text-zinc-400">{formatDateTime(row.updated_at)}</span>
        </span>
      </button>
    </article>
  );
}

export function OpportunityTable({
  selectedTokenId,
  onSelect,
  onRowsLoaded,
  compact = false,
}: OpportunityTableProps) {
  const { search, chains } = useRadarState();
  const deferredSearch = useDeferredValue(search.trim());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(compact ? 5 : 10);
  const [sorting, setSorting] = useState<SortingState>([{ id: "score", desc: true }]);
  const [filters, setFilters] = useState<AdvancedFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const watchlist = useWatchlistMutation();
  const { primary } = useEcoTheme();

  const queryFilters: OpportunityFilters = {
    q: deferredSearch || undefined,
    chains: chains.length ? chains : undefined,
    minScore: numericFilter(filters.minScore),
    maxRisk: numericFilter(filters.maxRisk),
    maxPairAgeHours: numericFilter(filters.maxPairAgeHours),
    minLiquidity: numericFilter(filters.minLiquidity),
    sortBy: sorting[0] ? sortingMap[sorting[0].id] : undefined,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
    page,
    pageSize,
  };
  const opportunities = useOpportunities(queryFilters);

  useEffect(() => {
    if (opportunities.data?.items.length) onRowsLoaded?.(opportunities.data.items);
  }, [onRowsLoaded, opportunities.data?.items]);

  const columns = useMemo(
    () =>
      buildColumns((row) => {
        watchlist.mutate({ tokenId: row.token.id, isWatchlisted: row.watchlisted });
      }),
    [watchlist],
  );

  // TanStack Table intentionally returns imperative getters that React Compiler does not memoize.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: opportunities.data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: opportunities.data?.pages ?? -1,
    onSortingChange: (updater) => {
      setSorting(updater);
      setPage(1);
    },
    state: { sorting },
  });

  function updateFilter(key: keyof AdvancedFilters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setSorting([{ id: "score", desc: true }]);
    setPage(1);
  }

  return (
    <section
      className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl"
      aria-labelledby="opportunities-title"
      data-testid="opportunities-panel"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-white/[0.02] px-3.5 py-3">
        <div>
          <p className="text-[0.62rem] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400">
            Descoberta e Observação
          </p>
          <h2 id="opportunities-title" className="mt-1 text-sm font-bold text-white font-sans">
            Oportunidades em Destaque
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DataBadges
            demo={opportunities.data?.demo_mode}
            partial={opportunities.data?.partial}
            stale={opportunities.data?.stale}
          />
          <button
            aria-expanded={showFilters}
            className={`inline-flex h-8 items-center gap-1.5 rounded-xl border px-3 text-xs font-mono font-bold transition-all cursor-pointer ${
              showFilters
                ? "text-white"
                : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white hover:bg-white/10"
            }`}
            style={
              showFilters
                ? {
                    borderColor: `${primary}60`,
                    backgroundColor: `${primary}15`,
                    boxShadow: `0 0 10px ${primary}20`,
                  }
                : {}
            }
            onClick={() => setShowFilters((current) => !current)}
            type="button"
          >
            <SlidersHorizontal className="size-3.5" /> Filtros
          </button>
        </div>
      </div>

      {/* Quick Strategy Presets */}
      <div className="flex flex-wrap items-center gap-1.5 px-3.5 py-2.5 border-b border-white/5 bg-white/[0.02] font-mono text-xs">
        <span className="text-zinc-500 font-bold uppercase tracking-wider text-[0.62rem] mr-1">
          Estratégias:
        </span>
        <button
          type="button"
          onClick={() => {
            setFilters({
              minScore: "8",
              maxRisk: "4",
              minLiquidity: "500000",
              maxPairAgeHours: "",
            });
            setPage(1);
          }}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[0.68rem] transition-all cursor-pointer ${
            filters.minScore === "8" && filters.minLiquidity === "500000"
              ? "font-bold"
              : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white hover:bg-white/10"
          }`}
          style={
            filters.minScore === "8" && filters.minLiquidity === "500000"
              ? {
                  borderColor: `${primary}60`,
                  backgroundColor: `${primary}15`,
                  color: primary,
                  boxShadow: `0 0 10px ${primary}20`,
                }
              : {}
          }
        >
          🚀 Breakout Momentum
        </button>
        <button
          type="button"
          onClick={() => {
            setFilters({
              minScore: "8",
              maxRisk: "3",
              minLiquidity: "100000",
              maxPairAgeHours: "",
            });
            setPage(1);
          }}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[0.68rem] transition-all cursor-pointer ${
            filters.maxRisk === "3" && filters.minScore === "8" && filters.minLiquidity === "100000"
              ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-bold shadow-[0_0_10px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30"
              : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white hover:bg-white/10"
          }`}
        >
          🛡️ Zero-Trust Clean
        </button>
        <button
          type="button"
          onClick={() => {
            setFilters({
              minScore: "",
              maxRisk: "5",
              minLiquidity: "50000",
              maxPairAgeHours: "24",
            });
            setPage(1);
          }}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[0.68rem] transition-all cursor-pointer ${
            filters.maxPairAgeHours === "24"
              ? "border-amber-500/60 bg-amber-500/15 text-amber-300 font-bold shadow-[0_0_10px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/30"
              : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white hover:bg-white/10"
          }`}
        >
          ⚡ Fresh Launch
        </button>
        {(filters.minScore ||
          filters.maxRisk ||
          filters.minLiquidity ||
          filters.maxPairAgeHours) && (
          <button
            type="button"
            onClick={resetFilters}
            className="ml-auto inline-flex items-center gap-1 text-[0.62rem] font-bold text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3" /> Limpar Presets
          </button>
        )}
      </div>

      {showFilters && (
        <div className="grid gap-2 border-b border-white/10 bg-[#050c12]/80 p-3 sm:grid-cols-2 xl:grid-cols-4 font-mono">
          <label className="text-[0.6rem] font-bold text-zinc-400">
            Score mínimo
            <select
              className="mt-1 h-9 w-full rounded-xl border border-white/10 bg-black/40 px-2 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
              data-testid="score-filter"
              onChange={(event) => updateFilter("minScore", event.target.value)}
              value={filters.minScore}
            >
              <option value="">Qualquer score</option>
              <option value="5">5+</option>
              <option value="6.5">6,5+</option>
              <option value="8">8+</option>
            </select>
          </label>
          <label className="text-[0.6rem] font-bold text-zinc-400">
            Risco máximo
            <select
              className="mt-1 h-9 w-full rounded-xl border border-white/10 bg-black/40 px-2 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
              data-testid="risk-filter"
              onChange={(event) => updateFilter("maxRisk", event.target.value)}
              value={filters.maxRisk}
            >
              <option value="">Qualquer risco</option>
              <option value="3">Até 3</option>
              <option value="5">Até 5</option>
              <option value="7">Até 7</option>
            </select>
          </label>
          <label className="text-[0.6rem] font-bold text-zinc-400">
            Idade máxima do par
            <select
              className="mt-1 h-9 w-full rounded-xl border border-white/10 bg-black/40 px-2 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
              onChange={(event) => updateFilter("maxPairAgeHours", event.target.value)}
              value={filters.maxPairAgeHours}
            >
              <option value="">Qualquer idade</option>
              <option value="1">1 hora</option>
              <option value="24">24 horas</option>
              <option value="168">7 dias</option>
              <option value="720">30 dias</option>
            </select>
          </label>
          <label className="text-[0.6rem] font-bold text-zinc-400">
            Liquidez mínima (USD)
            <div className="mt-1 flex gap-1.5">
              <input
                className="h-9 min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-2 text-xs text-white placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-none"
                inputMode="decimal"
                min="0"
                onChange={(event) => updateFilter("minLiquidity", event.target.value)}
                placeholder="Ex.: 100000"
                type="number"
                value={filters.minLiquidity}
              />
              <button
                aria-label="Limpar filtros"
                className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                onClick={resetFilters}
                type="button"
              >
                <RotateCcw className="size-3.5" />
              </button>
            </div>
          </label>
        </div>
      )}

      {watchlist.isError && (
        <p
          className="border-b border-rose-500/20 bg-rose-950/40 px-3 py-2 text-[0.64rem] text-rose-300 font-mono"
          role="alert"
        >
          Não foi possível atualizar a watchlist: {getErrorMessage(watchlist.error)}
        </p>
      )}

      {opportunities.isLoading ? (
        <PanelSkeleton rows={compact ? 5 : 8} />
      ) : opportunities.isError ? (
        <ErrorState
          message={getErrorMessage(opportunities.error)}
          retry={() => void opportunities.refetch()}
        />
      ) : !opportunities.data?.items.length ? (
        <EmptyState
          title="Nenhuma oportunidade encontrada"
          message="A busca e os filtros não encontraram tokens monitorados neste recorte."
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block custom-scrollbar">
            <table
              className="w-full min-w-[1320px] border-collapse text-left font-mono"
              data-testid="opportunities-table"
            >
              <thead className="bg-black/50 backdrop-blur-md border-b border-white/10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="border-b border-white/10 px-3 py-3 text-[0.64rem] font-bold uppercase tracking-wider text-zinc-400"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-white/5">
                {table.getRowModel().rows.map((row) => {
                  const isSelected = row.original.token.id === selectedTokenId;
                  return (
                    <tr
                      key={row.id}
                      aria-selected={isSelected}
                      data-testid={`opportunity-row-${row.original.token.symbol.toLowerCase()}`}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-white/[0.08] text-white"
                          : "hover:bg-white/[0.04] text-zinc-300"
                      }`}
                      style={isSelected ? { boxShadow: `inset 3px 0 0 ${primary}` } : {}}
                      onClick={() => {
                        playTokenSelectSound();
                        onSelect(row.original);
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="whitespace-nowrap px-3 py-3 align-middle text-xs"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-2 p-2.5 md:hidden">
            {opportunities.data.items.map((row) => (
              <MobileOpportunityCard
                key={row.token.id}
                row={row}
                selected={row.token.id === selectedTokenId}
                onSelect={() => {
                  playTokenSelectSound();
                  onSelect(row);
                }}
                onToggle={() =>
                  watchlist.mutate({ tokenId: row.token.id, isWatchlisted: row.watchlisted })
                }
              />
            ))}
          </div>
        </>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-white/[0.02] px-3.5 py-2.5">
        <p className="text-[0.63rem] font-mono text-zinc-400">
          {opportunities.data
            ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, opportunities.data.total)} de ${opportunities.data.total}`
            : "Aguardando dados"}
        </p>
        <div className="flex items-center gap-1.5 font-mono">
          {!compact && (
            <label className="mr-2 text-[0.61rem] text-zinc-400">
              <span className="sr-only">Linhas por página</span>
              <select
                className="h-8 rounded-xl border border-white/10 bg-black/40 px-2 text-[0.62rem] text-white focus:border-cyan-500/50 focus:outline-none"
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                value={pageSize}
              >
                <option value="10">10 / página</option>
                <option value="20">20 / página</option>
                <option value="50">50 / página</option>
              </select>
            </label>
          )}
          <button
            aria-label="Página anterior"
            className="grid size-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-35 transition-colors cursor-pointer"
            disabled={page <= 1 || opportunities.isFetching}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            type="button"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-14 text-center text-[0.63rem] text-zinc-300 font-bold">
            {page} / {Math.max(1, opportunities.data?.pages ?? 1)}
          </span>
          <button
            aria-label="Página seguinte"
            className="grid size-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-35 transition-colors cursor-pointer"
            disabled={page >= (opportunities.data?.pages ?? 1) || opportunities.isFetching}
            onClick={() => setPage((current) => current + 1)}
            type="button"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </footer>
      {opportunities.isFetching && !opportunities.isLoading && (
        <div className="h-0.5 overflow-hidden bg-white/10">
          <span className="block h-full w-1/3 animate-pulse bg-cyan-400 shadow-[0_0_8px_rgba(0,217,255,0.8)]" />
        </div>
      )}
    </section>
  );
}
