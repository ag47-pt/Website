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
import { EmptyState, ErrorState, PanelSkeleton } from "@/eco/alt-radar/apps/web/components/shared/query-state";
import { useRadarState } from "@/eco/alt-radar/apps/web/components/radar-state";

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
  if (value > 0) return "text-[#d1ff00] font-mono font-semibold";
  if (value < 0) return "text-rose-400 font-mono font-semibold";
  return "text-zinc-400 font-mono";
}

function scoreTone(value: number | null) {
  if (value === null) return "border-zinc-800 bg-zinc-900 text-zinc-500";
  if (value >= 8) return "border-[#d1ff00]/40 bg-[#d1ff00]/10 text-[#d1ff00] font-bold shadow-[0_0_8px_rgba(209,255,0,0.15)]";
  if (value >= 6.5) return "border-cyan-500/40 bg-cyan-500/10 text-cyan-400 font-bold";
  if (value >= 5) return "border-amber-500/40 bg-amber-500/10 text-amber-400 font-bold";
  return "border-rose-500/40 bg-rose-500/10 text-rose-400 font-bold";
}

function statusTone(classification: string | null) {
  const normalized = classification?.toLowerCase() ?? "";
  if (normalized.includes("forte"))
    return "border-[#d1ff00]/40 bg-[#d1ff00]/10 text-[#d1ff00] font-bold";
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
          className={`grid size-7 place-items-center rounded-md hover:bg-white/5 ${row.original.watchlisted ? "text-radar-warning" : "text-radar-subtle"}`}
          onClick={(event) => {
            event.stopPropagation();
            toggleWatchlist(row.original);
          }}
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
      className={`rounded-xl border p-3 ${selected ? "border-radar-positive/60 bg-[#0e251d]" : "border-radar-border bg-[#0a161f]"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <button className="min-w-0 flex-1 text-left" onClick={onSelect} type="button">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-[#142c49] font-extrabold text-radar-neutral">
              {row.token.symbol[0]}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold">{row.token.symbol}</span>
              <span className="mono block truncate text-[0.58rem] text-radar-subtle">
                {shortenAddress(row.token.contract_address, 7)}
              </span>
            </span>
            <ChainBadge chain={row.token.chain} />
          </div>
        </button>
        <button
          aria-label={row.watchlisted ? "Remover da watchlist" : "Adicionar à watchlist"}
          className={row.watchlisted ? "text-radar-warning" : "text-radar-subtle"}
          onClick={onToggle}
          type="button"
        >
          <Star className="size-5" fill={row.watchlisted ? "currentColor" : "none"} />
        </button>
      </div>
      <button
        className="mt-3 grid w-full grid-cols-3 gap-x-3 gap-y-2 text-left"
        onClick={onSelect}
        type="button"
      >
        <span>
          <span className="block text-[0.56rem] uppercase text-radar-subtle">Preço</span>
          <span className="mono text-[0.65rem] font-bold">
            {formatCurrency(row.market?.price_usd ?? null)}
          </span>
        </span>
        <span>
          <span className="block text-[0.56rem] uppercase text-radar-subtle">Variação 1h</span>
          <span
            className={`mono text-[0.65rem] font-bold ${changeTone(row.market?.price_change_1h ?? null)}`}
          >
            {formatPercent(row.market?.price_change_1h ?? null, true)}
          </span>
        </span>
        <span>
          <span className="block text-[0.56rem] uppercase text-radar-subtle">Score</span>
          <span
            className={`mono text-[0.68rem] font-extrabold ${changeTone(row.score?.final_score ?? null)}`}
          >
            {formatScore(row.score?.final_score ?? null)}
          </span>
        </span>
        <span>
          <span className="block text-[0.56rem] uppercase text-radar-subtle">Liquidez</span>
          <span className="mono text-[0.63rem]">
            {formatCurrency(row.market?.liquidity_usd ?? null, true)}
          </span>
        </span>
        <span>
          <span className="block text-[0.56rem] uppercase text-radar-subtle">Vol. 24h</span>
          <span className="mono text-[0.63rem]">
            {formatCurrency(row.market?.volume_24h ?? null, true)}
          </span>
        </span>
        <span>
          <span className="block text-[0.56rem] uppercase text-radar-subtle">Risco</span>
          <span className="mono text-[0.63rem]">
            {row.risk?.risk_score === null || row.risk === null
              ? "N/D"
              : `${formatScore(row.risk.risk_score)}/10`}
          </span>
        </span>
        <span>
          <span className="block text-[0.56rem] uppercase text-radar-subtle">Idade</span>
          <span className="mono text-[0.63rem]">{formatAge(row.pair.created_at)}</span>
        </span>
        <span>
          <span className="block text-[0.56rem] uppercase text-radar-subtle">Holders</span>
          <span className="mono text-[0.63rem]">{formatNumber(row.holders_count, true)}</span>
        </span>
        <span>
          <span className="block text-[0.56rem] uppercase text-radar-subtle">Atualizado</span>
          <span className="text-[0.59rem] text-radar-muted">{formatDateTime(row.updated_at)}</span>
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
      className="panel min-w-0 overflow-hidden"
      aria-labelledby="opportunities-title"
      data-testid="opportunities-panel"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 px-3.5 py-3">
        <div>
          <p className="eyebrow text-zinc-400">Descoberta e observação</p>
          <h2 id="opportunities-title" className="mt-1 text-sm font-mono font-bold text-white">
            Oportunidades em destaque
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
            className={`inline-flex h-8 items-center gap-1.5 rounded-xl border px-3 text-xs font-mono font-bold transition-all ${
              showFilters 
                ? "border-[#d1ff00]/40 bg-[#d1ff00]/10 text-[#d1ff00]" 
                : "border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:border-zinc-700 hover:text-white"
            }`}
            onClick={() => setShowFilters((current) => !current)}
            type="button"
          >
            <SlidersHorizontal className="size-3.5" /> Filtros
          </button>
        </div>
      </div>

      {/* Quick Strategy Presets */}
      <div className="flex flex-wrap items-center gap-1.5 px-3.5 py-2.5 border-b border-zinc-800/80 bg-zinc-950/70 font-mono text-xs">
        <span className="text-zinc-500 font-bold uppercase tracking-wider text-[0.62rem] mr-1">Estratégias:</span>
        <button
          type="button"
          onClick={() => {
            setFilters({ minScore: "8", maxRisk: "4", minLiquidity: "500000", maxPairAgeHours: "" });
            setPage(1);
          }}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[0.68rem] transition-all cursor-pointer ${
            filters.minScore === "8" && filters.minLiquidity === "500000"
              ? "border-[#d1ff00]/60 bg-[#d1ff00]/15 text-[#d1ff00] font-bold shadow-[0_0_10px_rgba(209,255,0,0.15)]"
              : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-white"
          }`}
        >
          🚀 Breakout Momentum
        </button>
        <button
          type="button"
          onClick={() => {
            setFilters({ minScore: "8", maxRisk: "3", minLiquidity: "100000", maxPairAgeHours: "" });
            setPage(1);
          }}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[0.68rem] transition-all cursor-pointer ${
            filters.maxRisk === "3" && filters.minScore === "8" && filters.minLiquidity === "100000"
              ? "border-cyan-500/60 bg-cyan-500/15 text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.15)]"
              : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-white"
          }`}
        >
          🛡️ Zero-Trust Clean
        </button>
        <button
          type="button"
          onClick={() => {
            setFilters({ minScore: "", maxRisk: "5", minLiquidity: "50000", maxPairAgeHours: "24" });
            setPage(1);
          }}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[0.68rem] transition-all cursor-pointer ${
            filters.maxPairAgeHours === "24"
              ? "border-amber-500/60 bg-amber-500/15 text-amber-300 font-bold shadow-[0_0_10px_rgba(245,158,11,0.15)]"
              : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-white"
          }`}
        >
          ⚡ Fresh Launch
        </button>
        {(filters.minScore || filters.maxRisk || filters.minLiquidity || filters.maxPairAgeHours) && (
          <button
            type="button"
            onClick={resetFilters}
            className="ml-auto inline-flex items-center gap-1 text-[0.62rem] font-bold text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3" /> Limpar Presets
          </button>
        )}
      </div>

      {showFilters && (
        <div className="grid gap-2 border-b border-radar-border bg-black/10 p-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="text-[0.6rem] font-bold text-radar-muted">
            Score mínimo
            <select
              className="mt-1 h-9 w-full rounded-lg border border-radar-border bg-[#09151e] px-2 text-xs text-radar-ink"
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
          <label className="text-[0.6rem] font-bold text-radar-muted">
            Risco máximo
            <select
              className="mt-1 h-9 w-full rounded-lg border border-radar-border bg-[#09151e] px-2 text-xs text-radar-ink"
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
          <label className="text-[0.6rem] font-bold text-radar-muted">
            Idade máxima do par
            <select
              className="mt-1 h-9 w-full rounded-lg border border-radar-border bg-[#09151e] px-2 text-xs text-radar-ink"
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
          <label className="text-[0.6rem] font-bold text-radar-muted">
            Liquidez mínima (USD)
            <div className="mt-1 flex gap-1.5">
              <input
                className="h-9 min-w-0 flex-1 rounded-lg border border-radar-border bg-[#09151e] px-2 text-xs text-radar-ink placeholder:text-radar-subtle"
                inputMode="decimal"
                min="0"
                onChange={(event) => updateFilter("minLiquidity", event.target.value)}
                placeholder="Ex.: 100000"
                type="number"
                value={filters.minLiquidity}
              />
              <button
                aria-label="Limpar filtros"
                className="grid size-9 shrink-0 place-items-center rounded-lg border border-radar-border text-radar-muted hover:text-radar-ink"
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
          className="border-b border-radar-critical/20 bg-[#35171d] px-3 py-2 text-[0.64rem] text-radar-critical"
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
          <div className="hidden overflow-x-auto md:block">
            <table
              className="w-full min-w-[1320px] border-collapse text-left font-mono"
              data-testid="opportunities-table"
            >
              <thead className="bg-zinc-900/90 border-b border-zinc-800">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="border-b border-zinc-800/80 px-3 py-3 text-[0.64rem] font-bold uppercase tracking-wider text-zinc-400"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {table.getRowModel().rows.map((row) => {
                  const isSelected = row.original.token.id === selectedTokenId;
                  return (
                    <tr
                      key={row.id}
                      aria-selected={isSelected}
                      data-testid={`opportunity-row-${row.original.token.symbol.toLowerCase()}`}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? "bg-zinc-900/90 shadow-[inset_3px_0_0_#d1ff00] text-white" 
                          : "hover:bg-zinc-900/40 text-zinc-300"
                      }`}
                      onClick={() => onSelect(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="whitespace-nowrap px-3 py-3 align-middle text-xs">
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
                onSelect={() => onSelect(row)}
                onToggle={() =>
                  watchlist.mutate({ tokenId: row.token.id, isWatchlisted: row.watchlisted })
                }
              />
            ))}
          </div>
        </>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-radar-border px-3.5 py-2.5">
        <p className="text-[0.63rem] text-radar-muted">
          {opportunities.data
            ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, opportunities.data.total)} de ${opportunities.data.total}`
            : "Aguardando dados"}
        </p>
        <div className="flex items-center gap-1.5">
          {!compact && (
            <label className="mr-2 text-[0.61rem] text-radar-muted">
              <span className="sr-only">Linhas por página</span>
              <select
                className="h-8 rounded-md border border-radar-border bg-[#09151e] px-2 text-[0.62rem]"
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
            className="grid size-8 place-items-center rounded-md border border-radar-border text-radar-muted disabled:opacity-35"
            disabled={page <= 1 || opportunities.isFetching}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            type="button"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="mono min-w-14 text-center text-[0.63rem] text-radar-muted">
            {page} / {Math.max(1, opportunities.data?.pages ?? 1)}
          </span>
          <button
            aria-label="Página seguinte"
            className="grid size-8 place-items-center rounded-md border border-radar-border text-radar-muted disabled:opacity-35"
            disabled={page >= (opportunities.data?.pages ?? 1) || opportunities.isFetching}
            onClick={() => setPage((current) => current + 1)}
            type="button"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </footer>
      {opportunities.isFetching && !opportunities.isLoading && (
        <div className="h-0.5 overflow-hidden bg-radar-border">
          <span className="block h-full w-1/3 animate-pulse bg-radar-positive" />
        </div>
      )}
    </section>
  );
}
