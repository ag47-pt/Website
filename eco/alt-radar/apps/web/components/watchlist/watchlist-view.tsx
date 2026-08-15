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
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

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
  const { primary } = useEcoTheme();

  return (
    <article
      className={`rounded-2xl border p-3.5 transition-all font-mono ${
        selected
          ? "bg-white/[0.08] text-white"
          : "border-white/10 bg-white/5 hover:border-white/20"
      }`}
      style={selected ? { borderColor: `${primary}60`, boxShadow: `0 0 15px ${primary}20` } : {}}
      data-testid={`watchlist-card-${item.token.symbol.toLowerCase()}`}
    >
      <div className="flex items-start justify-between gap-3">
        <button className="min-w-0 flex-1 text-left cursor-pointer" onClick={onSelect} type="button">
          <div className="flex items-center gap-2">
            <span
              className="grid size-9 place-items-center rounded-xl border font-bold shadow-sm"
              style={{ borderColor: `${primary}40`, backgroundColor: `${primary}15`, color: primary }}
            >
              {item.token.symbol[0]}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-white font-sans">
                {item.token.symbol}{" "}
                <span className="font-semibold text-zinc-400">{item.token.name}</span>
              </span>
              <span className="block text-[0.58rem] text-zinc-500">
                {shortenAddress(item.token.contract_address, 7)}
              </span>
            </span>
          </div>
        </button>
        <ChainBadge chain={item.token.chain} />
      </div>
      <button
        className="mt-3 grid w-full grid-cols-3 gap-2 text-left cursor-pointer"
        onClick={onSelect}
        type="button"
      >
        <span>
          <span className="block text-[0.56rem] uppercase text-zinc-400">Preço</span>
          <span className="mt-0.5 block text-[0.66rem] font-bold text-white">
            {formatCurrency(item.latest_market?.price_usd ?? null)}
          </span>
        </span>
        <span>
          <span className="block text-[0.56rem] uppercase text-zinc-400">Variação 1h</span>
          <span
            className={`mt-0.5 block text-[0.66rem] font-bold ${
              hourlyChange === null
                ? "text-zinc-500"
                : hourlyChange > 0
                  ? "text-emerald-400"
                  : hourlyChange < 0
                    ? "text-rose-400"
                    : "text-zinc-400"
            }`}
          >
            {formatPercent(hourlyChange, true)}
          </span>
        </span>
        <span>
          <span className="block text-[0.56rem] uppercase text-zinc-400">Score</span>
          <span className="mt-0.5 block text-[0.66rem] font-bold" style={{ color: primary }}>
            {formatScore(item.latest_score?.final_score ?? null)}
          </span>
        </span>
      </button>
      {item.notes && (
        <p className="mt-3 rounded-xl bg-white/[0.03] border border-white/5 px-2.5 py-2 text-[0.62rem] leading-4 text-zinc-400">
          {item.notes}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
        <time className="text-[0.58rem] text-zinc-500" dateTime={item.created_at}>
          Adicionado {formatDateTime(item.created_at)}
        </time>
        <div className="flex gap-1">
          <button
            aria-label={`Analisar ${item.token.symbol}`}
            className="grid size-8 place-items-center rounded-xl border border-white/10 bg-white/5 hover:text-white cursor-pointer transition-colors"
            style={{ color: primary }}
            onClick={onSelect}
            type="button"
          >
            <Eye className="size-3.5" />
          </button>
          <button
            aria-label={`Remover ${item.token.symbol} da watchlist`}
            className="grid size-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:border-rose-500/40 hover:text-rose-400 cursor-pointer transition-colors"
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
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const watchlist = useWatchlist();
  const mutation = useWatchlistMutation();
  const { primary } = useEcoTheme();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.62rem] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400">
            Monitoramento Pessoal
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white font-sans">
            Tokens Salvos &amp; Watchlist
          </h1>
        </div>
        <DataBadges demo={watchlist.data?.demo_mode} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl min-w-0 p-3.5"
          aria-label="Tokens na watchlist"
        >
          {watchlist.isLoading ? (
            <PanelSkeleton rows={6} />
          ) : watchlist.isError ? (
            <ErrorState
              message={getErrorMessage(watchlist.error)}
              retry={() => void watchlist.refetch()}
            />
          ) : !watchlist.data?.items.length ? (
            <EmptyState
              title="Watchlist vazia"
              message="Marque tokens com a estrela na tabela de oportunidades ou no dossiê técnico para acompanhá-los de perto."
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {watchlist.data.items.map((item) => (
                <WatchlistCard
                  key={item.id}
                  item={item}
                  selected={item.token.id === selectedTokenId}
                  onSelect={() => setSelectedTokenId(item.token.id)}
                  onRemove={() =>
                    mutation.mutate({ tokenId: item.token.id, isWatchlisted: true })
                  }
                />
              ))}
            </div>
          )}
        </section>

        <div className="min-w-0">
          <TokenAnalysis tokenId={selectedTokenId} />
        </div>
      </div>
    </div>
  );
}
