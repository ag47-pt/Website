"use client";

import dynamic from "next/dynamic";
import { ExternalLink, Star } from "lucide-react";
import { useState } from "react";
import { useMarketHistory, useScore, useToken, useWatchlistMutation } from "@/eco/alt-radar/apps/web/lib/api/query";
import {
  formatAge,
  formatCurrency,
  formatDateTime,
  formatNumber,
  formatPercent,
  getErrorMessage,
  shortenAddress,
} from "@/eco/alt-radar/apps/web/lib/format";
import { ChainBadge } from "@/eco/alt-radar/apps/web/components/shared/chain-badge";
import { CopyButton } from "@/eco/alt-radar/apps/web/components/shared/copy-button";
import { DataBadges } from "@/eco/alt-radar/apps/web/components/shared/data-badges";
import { EmptyState, ErrorState, PanelSkeleton } from "@/eco/alt-radar/apps/web/components/shared/query-state";
import { ScoreBreakdown } from "./score-breakdown";
import { TokenTimeline } from "./token-timeline";

const MarketChart = dynamic(() => import("./market-chart").then((module) => module.MarketChart), {
  ssr: false,
  loading: () => <div className="skeleton h-52 w-full" />,
});

const intervals = ["1h", "6h", "24h", "7d"] as const;

function getMarketSourceUrl(source: string, chain: string, pairAddress: string) {
  const normalized = source.toLowerCase();
  if (normalized.includes("dexscreener")) {
    return `https://dexscreener.com/${encodeURIComponent(chain)}/${encodeURIComponent(pairAddress)}`;
  }
  if (normalized.includes("gecko")) {
    const networks: Record<string, string> = {
      bsc: "bsc",
      solana: "solana",
      ethereum: "eth",
    };
    return `https://www.geckoterminal.com/${networks[chain] ?? encodeURIComponent(chain)}/pools/${encodeURIComponent(pairAddress)}`;
  }
  return null;
}

function ChangeValue({ value }: { value: number | null }) {
  return (
    <span
      className={`mono text-[0.68rem] font-bold ${value === null ? "text-radar-subtle" : value > 0 ? "text-radar-positive" : value < 0 ? "text-radar-critical" : "text-radar-muted"}`}
    >
      {formatPercent(value, true)}
    </span>
  );
}

function MarketMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.045] bg-black/10 px-2.5 py-2">
      <dt className="text-[0.56rem] font-bold uppercase tracking-wide text-radar-subtle">
        {label}
      </dt>
      <dd className="mono mt-1 truncate text-[0.68rem] font-bold text-radar-ink" title={value}>
        {value}
      </dd>
    </div>
  );
}

export function TokenAnalysis({
  tokenId,
  holdersCount = null,
}: {
  tokenId: string | null;
  holdersCount?: number | null;
}) {
  const [interval, setInterval] = useState<(typeof intervals)[number]>("24h");
  const token = useToken(tokenId);
  const history = useMarketHistory(tokenId, interval);
  const score = useScore(tokenId);
  const watchlist = useWatchlistMutation();

  if (tokenId === null) {
    return (
      <div className="panel">
        <EmptyState
          title="Selecione uma oportunidade"
          message="A análise atualiza sem recarregar a página."
        />
      </div>
    );
  }
  if (token.isLoading)
    return (
      <div className="panel">
        <PanelSkeleton rows={8} />
      </div>
    );
  if (token.isError)
    return (
      <div className="panel">
        <ErrorState message={getErrorMessage(token.error)} retry={() => void token.refetch()} />
      </div>
    );
  if (!token.data)
    return (
      <div className="panel">
        <EmptyState title="Token não encontrado" />
      </div>
    );

  const detail = token.data;
  const market = detail.latest_market;
  const pair = detail.pairs[0] ?? null;
  const sourceUrl =
    pair?.source_url ??
    (market && pair
      ? getMarketSourceUrl(market.source, detail.token.chain, pair.pair_address)
      : null);

  return (
    <article
      className="panel min-w-0 overflow-hidden"
      aria-labelledby={`token-analysis-${tokenId}`}
      data-testid="token-analysis"
    >
      <header className="border-b border-radar-border px-3.5 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">Análise do token selecionado</p>
            <div className="mt-2 flex items-center gap-2.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-radar-positive/45 bg-[#112b1e] text-lg font-extrabold text-radar-positive">
                {detail.token.symbol.slice(0, 1)}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2
                    id={`token-analysis-${tokenId}`}
                    className="truncate text-base font-extrabold tracking-[-0.03em]"
                  >
                    {detail.token.name}{" "}
                    <span className="text-radar-muted">{detail.token.symbol}</span>
                  </h2>
                  <button
                    aria-label={
                      detail.watchlisted ? "Remover da watchlist" : "Adicionar à watchlist"
                    }
                    aria-pressed={detail.watchlisted}
                    className={detail.watchlisted ? "text-radar-warning" : "text-radar-subtle"}
                    disabled={watchlist.isPending}
                    onClick={() => watchlist.mutate({ tokenId, isWatchlisted: detail.watchlisted })}
                    type="button"
                  >
                    <Star className="size-4" fill={detail.watchlisted ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <ChainBadge chain={detail.token.chain} />
                  <span className="text-[0.6rem] text-radar-subtle">
                    {pair ? `${detail.token.symbol} / ${pair.quote_token}` : "Par aguardando dados"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DataBadges
            demo={detail.data_mode === "demo"}
            partial={score.isError || history.isError}
          />
        </div>

        <div className="mt-3 grid gap-1.5 text-[0.61rem] text-radar-muted">
          <div className="flex min-w-0 items-center gap-1">
            <span className="w-14 shrink-0">Contrato</span>
            <span className="mono truncate text-radar-ink" title={detail.token.contract_address}>
              {shortenAddress(detail.token.contract_address, 10)}
            </span>
            <CopyButton value={detail.token.contract_address} label="Copiar contrato" />
          </div>
          <div className="flex min-w-0 items-center gap-1">
            <span className="w-14 shrink-0">Par</span>
            {pair ? (
              <>
                <span className="mono truncate text-radar-ink" title={pair.pair_address}>
                  {shortenAddress(pair.pair_address, 10)}
                </span>
                <CopyButton value={pair.pair_address} label="Copiar endereço do par" />
              </>
            ) : (
              <span className="text-radar-subtle">Aguardando dados</span>
            )}
          </div>
        </div>
      </header>

      <div className="p-3.5">
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MarketMetric label="Preço" value={formatCurrency(market?.price_usd ?? null)} />
          <MarketMetric
            label="Liquidez"
            value={formatCurrency(market?.liquidity_usd ?? null, true)}
          />
          <MarketMetric
            label="Volume 24h"
            value={formatCurrency(market?.volume_24h ?? null, true)}
          />
          <MarketMetric
            label="Holders"
            value={formatNumber(holdersCount ?? detail.latest_risk?.holders_count ?? null)}
          />
          <MarketMetric label="Idade do par" value={formatAge(pair?.created_at ?? null)} />
          <MarketMetric
            label="Market cap"
            value={formatCurrency(market?.market_cap ?? null, true)}
          />
          <MarketMetric label="FDV" value={formatCurrency(market?.fdv ?? null, true)} />
          <MarketMetric
            label="Última atualização"
            value={formatDateTime(market?.captured_at ?? null)}
          />
        </dl>

        <div className="mt-3 grid grid-cols-3 divide-x divide-radar-border rounded-lg border border-radar-border bg-black/10 py-2 text-center">
          <div>
            <p className="text-[0.57rem] font-bold uppercase text-radar-subtle">5 min</p>
            <ChangeValue value={market?.price_change_5m ?? null} />
          </div>
          <div>
            <p className="text-[0.57rem] font-bold uppercase text-radar-subtle">1 hora</p>
            <ChangeValue value={market?.price_change_1h ?? null} />
          </div>
          <div>
            <p className="text-[0.57rem] font-bold uppercase text-radar-subtle">24 horas</p>
            <ChangeValue value={market?.price_change_24h ?? null} />
          </div>
        </div>

        <section className="mt-3" aria-labelledby={`history-title-${tokenId}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 id={`history-title-${tokenId}`} className="text-xs font-extrabold">
                Preço e volume
              </h3>
              <p className="mt-0.5 text-[0.59rem] text-radar-subtle">
                Histórico fornecido pela API, sem interpolação local.
              </p>
            </div>
            <div className="flex rounded-lg border border-radar-border bg-[#08141c] p-0.5">
              {intervals.map((item) => (
                <button
                  key={item}
                  aria-pressed={interval === item}
                  className={`rounded-md px-2 py-1 text-[0.59rem] font-bold uppercase ${interval === item ? "bg-[#173427] text-radar-positive" : "text-radar-subtle hover:text-radar-ink"}`}
                  onClick={() => setInterval(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2">
            {history.isLoading ? (
              <div className="skeleton h-52 w-full" />
            ) : history.isError ? (
              <ErrorState
                message={getErrorMessage(history.error)}
                retry={() => void history.refetch()}
              />
            ) : history.data ? (
              <>
                <MarketChart history={history.data} />
                <div className="mt-1">
                  <DataBadges demo={history.data.demo_mode} />
                </div>
              </>
            ) : (
              <EmptyState title="Sem histórico disponível" />
            )}
          </div>
        </section>

        <div className="mt-3">
          {score.isLoading ? (
            <PanelSkeleton rows={4} />
          ) : score.isError ? (
            <ErrorState message={getErrorMessage(score.error)} retry={() => void score.refetch()} />
          ) : (
            <ScoreBreakdown score={score.data ?? null} />
          )}
        </div>

        <TokenTimeline tokenId={tokenId} />

        <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-radar-border pt-2.5 text-[0.59rem] text-radar-subtle">
          <span>Fonte de mercado: {market?.source ?? "Provider indisponível"}</span>
          {sourceUrl && (
            <a
              className="inline-flex items-center gap-1 font-bold text-radar-positive hover:underline"
              href={sourceUrl}
              rel="noreferrer noopener"
              target="_blank"
            >
              Abrir fonte <ExternalLink className="size-3" />
            </a>
          )}
        </footer>
      </div>
    </article>
  );
}
