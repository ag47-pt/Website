"use client";

import { Eye, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { useWatchlist, useWatchlistMutation } from "@/eco/alt-radar/apps/web/lib/api/query";
import type { WatchlistItem } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import {
  formatCurrency,
  formatDateTime,
  formatPercent,
  formatScore,
  getErrorMessage,
  shortenAddress,
} from "@/eco/alt-radar/apps/web/lib/format";
import { ChainBadge } from "@/eco/alt-radar/apps/web/components/shared/chain-badge";
import { DataBadges } from "@/eco/alt-radar/apps/web/components/shared/data-badges";
import { EmptyState, ErrorState, PanelSkeleton } from "@/eco/alt-radar/apps/web/components/shared/query-state";
import { TokenAnalysis } from "@/eco/alt-radar/apps/web/components/dashboard/token-analysis";

function WatchlistCard({
  item,
  selected,
  onSelect,
  onRemove,
}: {
  item: WatchlistItem;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const hourlyChange = item.latest_market?.price_change_1h ?? null;
  return (
    <article
      className={`rounded-xl border p-3.5 ${selected ? "border-radar-positive/50 bg-[#10261e]" : "border-radar-border bg-[#0a161f]"}`}
      data-testid={`watchlist-card-${item.token.symbol.toLowerCase()}`}
    >
      <div className="flex items-start justify-between gap-3">
        <button className="min-w-0 flex-1 text-left" onClick={onSelect} type="button">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-full border border-radar-warning/25 bg-[#35270e] font-extrabold text-radar-warning">
              {item.token.symbol[0]}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold">
                {item.token.symbol}{" "}
                <span className="font-semibold text-radar-muted">{item.token.name}</span>
              </span>
              <span className="mono block text-[0.58rem] text-radar-subtle">
                {shortenAddress(item.token.contract_address, 7)}
              </span>
            </span>
          </div>
        </button>
        <ChainBadge chain={item.token.chain} />
      </div>
      <button
        className="mt-3 grid w-full grid-cols-3 gap-2 text-left"
        onClick={onSelect}
        type="button"
      >
        <span>
          <span className="block text-[0.56rem] uppercase text-radar-subtle">Preço</span>
          <span className="mono mt-0.5 block text-[0.66rem] font-bold">
            {formatCurrency(item.latest_market?.price_usd ?? null)}
          </span>
        </span>
        <span>
          <span className="block text-[0.56rem] uppercase text-radar-subtle">Variação 1h</span>
          <span
            className={`mono mt-0.5 block text-[0.66rem] font-bold ${hourlyChange === null ? "text-radar-subtle" : hourlyChange > 0 ? "text-radar-positive" : hourlyChange < 0 ? "text-radar-critical" : "text-radar-muted"}`}
          >
            {formatPercent(hourlyChange, true)}
          </span>
        </span>
        <span>
          <span className="block text-[0.56rem] uppercase text-radar-subtle">Score</span>
          <span className="mono mt-0.5 block text-[0.66rem] font-extrabold text-radar-positive">
            {formatScore(item.latest_score?.final_score ?? null)}
          </span>
        </span>
      </button>
      {item.notes && (
        <p className="mt-3 rounded-lg bg-black/15 px-2.5 py-2 text-[0.62rem] leading-4 text-radar-muted">
          {item.notes}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between border-t border-radar-border pt-2.5">
        <time className="text-[0.58rem] text-radar-subtle" dateTime={item.created_at}>
          Adicionado {formatDateTime(item.created_at)}
        </time>
        <div className="flex gap-1">
          <button
            aria-label={`Analisar ${item.token.symbol}`}
            className="grid size-8 place-items-center rounded-md border border-radar-border text-radar-neutral"
            onClick={onSelect}
            type="button"
          >
            <Eye className="size-3.5" />
          </button>
          <button
            aria-label={`Remover ${item.token.symbol} da watchlist`}
            className="grid size-8 place-items-center rounded-md border border-radar-critical/25 text-radar-critical"
            onClick={onRemove}
            type="button"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function WatchlistView() {
  const watchlist = useWatchlist();
  const mutation = useWatchlistMutation();
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const activeTokenId = selectedTokenId ?? watchlist.data?.items[0]?.token_id ?? null;

  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-3 font-mono">
        <div>
          <p className="eyebrow text-zinc-400">Lista de observação persistente</p>
          <h1 className="mt-1 flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <Star className="size-5 text-amber-400" fill="currentColor" /> Watchlist
          </h1>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-400">
            Tokens guardados para acompanhamento e exportação para cópia ou bots de trading.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {watchlist.data?.items && watchlist.data.items.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => {
                  const items = watchlist.data?.items ?? [];
                  const headers = "Symbol,Name,Chain,Contract,PriceUSD,Change1h,Score,AddedAt\n";
                  const rows = items
                    .map(
                      (i) =>
                        `"${i.token.symbol}","${i.token.name}","${i.token.chain}","${i.token.contract_address}",${i.latest_market?.price_usd ?? 0},${i.latest_market?.price_change_1h ?? 0},${i.latest_score?.final_score ?? 0},"${i.created_at}"`
                    )
                    .join("\n");
                  const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `ag47-watchlist-${new Date().toISOString().slice(0, 10)}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:border-[#d1ff00]/40 hover:text-white transition-all cursor-pointer"
                title="Exportar Lista em CSV"
              >
                CSV
              </button>
              <button
                type="button"
                onClick={() => {
                  const items = watchlist.data?.items ?? [];
                  const blob = new Blob([JSON.stringify(items, null, 2)], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `ag47-watchlist-${new Date().toISOString().slice(0, 10)}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:border-cyan-500/40 hover:text-white transition-all cursor-pointer"
                title="Exportar Lista em JSON"
              >
                JSON
              </button>
            </>
          )}
          <DataBadges
            demo={watchlist.data?.demo_mode}
            partial={watchlist.data?.partial}
            stale={watchlist.data?.stale}
          />
        </div>
      </header>

      {mutation.isError && (
        <p
          className="rounded-lg border border-radar-critical/25 bg-[#35171d] p-3 text-xs text-radar-critical"
          role="alert"
        >
          {getErrorMessage(mutation.error)}
        </p>
      )}

      <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,.72fr)_minmax(480px,1.28fr)]">
        <section className="panel min-w-0 p-3" aria-label="Tokens na watchlist">
          {watchlist.isLoading ? (
            <PanelSkeleton rows={5} />
          ) : watchlist.isError ? (
            <ErrorState
              message={getErrorMessage(watchlist.error)}
              retry={() => void watchlist.refetch()}
            />
          ) : !watchlist.data?.items.length ? (
            <EmptyState
              title="Watchlist vazia"
              message="Use a estrela na tabela de oportunidades para guardar um token."
            />
          ) : (
            <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-1">
              {watchlist.data.items.map((item) => (
                <WatchlistCard
                  key={item.id}
                  item={item}
                  selected={activeTokenId === item.token_id}
                  onSelect={() => setSelectedTokenId(item.token_id)}
                  onRemove={() => mutation.mutate({ tokenId: item.token_id, isWatchlisted: true })}
                />
              ))}
            </div>
          )}
        </section>
        <div className="min-w-0">
          <TokenAnalysis tokenId={activeTokenId} />
        </div>
      </div>
    </div>
  );
}
