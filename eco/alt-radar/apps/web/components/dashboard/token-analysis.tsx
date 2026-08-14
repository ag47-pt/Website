"use client";

import dynamic from "next/dynamic";
import { ExternalLink, Star, FileDown, Download, Check, FileJson, Code, Camera } from "lucide-react";
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
import { SwapSimulator } from "./swap-simulator";
import { LiquidityDepthChart } from "./liquidity-depth-chart";
import { SmartMoneyTracker } from "./smart-money-tracker";
import { MarketCorrelationMatrix } from "./market-correlation-matrix";
import { generateChartSnapshotPng } from "@/eco/alt-radar/apps/web/lib/chart-snapshot";

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
      className={`mono text-[0.68rem] font-bold ${value === null ? "text-zinc-500" : value > 0 ? "text-[#d1ff00]" : value < 0 ? "text-rose-400" : "text-zinc-400"}`}
    >
      {formatPercent(value, true)}
    </span>
  );
}

function MarketMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 px-3 py-2">
      <dt className="text-[0.58rem] font-mono font-bold uppercase tracking-wider text-zinc-500">
        {label}
      </dt>
      <dd className="mono mt-1 truncate text-xs font-bold text-white" title={value}>
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const token = detail.token;
                const market = detail.latest_market;
                const risk = detail.latest_risk;
                const scoreData = detail.latest_score;
                const now = new Date().toISOString();

                const markdown = `# 📡 AG47 Alt Radar — Dossiê de Auditoria Técnica
**Data de Emissão:** ${now}
**Token:** ${token.name} (${token.symbol})
**Blockchain:** ${token.chain.toUpperCase()}
**Contrato:** \`${token.contract_address}\`

---

## 🎯 Scoring & Classificação AG47
- **Score Final:** **${scoreData?.final_score ?? 'N/D'}/10**
- **Classificação:** ${scoreData?.classification ?? 'N/D'}
- **Confiança do Modelo:** ${scoreData?.confidence ? `${Math.round(scoreData.confidence * 100)}%` : 'N/D'}
- **Versão do Motor:** ${scoreData?.scoring_version ?? '2.4.0'}
- **Explicação:** ${scoreData?.explanation ?? 'N/D'}

### Fatores de Destaque
- **Positivos:** ${(scoreData?.positive_factors ?? []).join(', ') || 'Nenhum'}
- **Negativos:** ${(scoreData?.negative_factors ?? []).join(', ') || 'Nenhum'}

---

## 🛡️ Auditoria Zero-Trust & Risco
- **Score de Risco:** **${risk?.risk_score ?? 'N/D'}/10**
- **Status do Pool (LP Lock):** ${risk?.liquidity_lock_status ?? 'Desconhecido'}
- **Honeypot Check:** ${risk?.honeypot_status ?? 'Clean'}
- **Mint Authority:** ${risk?.mintable === false ? 'Revogada (Seguro)' : risk?.mintable === true ? 'Ativa (Risco)' : 'Desconhecido'}
- **Top 10 Holders:** ${risk?.top_holders_percentage != null ? `${risk.top_holders_percentage}%` : 'N/D'}
- **Deployer Balance:** ${risk?.deployer_percentage != null ? `${risk.deployer_percentage}%` : 'N/D'}
- **Buy Tax / Sell Tax:** ${risk?.buy_tax ?? 0}% / ${risk?.sell_tax ?? 0}%

---

## 📊 Telemetria de Mercado
- **Preço USD:** $${market?.price_usd ?? 0}
- **Liquidez:** $${market?.liquidity_usd ? market.liquidity_usd.toLocaleString() : 0}
- **Volume 24h:** $${market?.volume_24h ? market.volume_24h.toLocaleString() : 0}
- **Market Cap:** $${market?.market_cap ? market.market_cap.toLocaleString() : 0}
- **Holders Ativos:** ${holdersCount ?? risk?.holders_count ? (holdersCount ?? risk?.holders_count)?.toLocaleString() : 'N/D'}

---
*Gerado deterministicamente por AG47 Alt Radar — Ecosystem Intelligence.*
`;

                const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dossie-tecnico-${token.symbol.toLowerCase()}.md`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-zinc-800 bg-zinc-900/90 text-[0.65rem] font-mono font-bold text-zinc-300 hover:border-[#d1ff00]/40 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Exportar Dossiê de Auditoria em Markdown"
            >
              <FileDown className="size-3.5 text-[#d1ff00]" />
              <span>Dossiê .md</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const payload = {
                  token: detail.token,
                  latest_market: detail.latest_market,
                  latest_risk: detail.latest_risk,
                  latest_score: detail.latest_score,
                  holders_count: holdersCount ?? detail.latest_risk?.holders_count ?? null,
                  exported_at: new Date().toISOString(),
                  system: "AG47 Alt Radar — EvoPro Ecosystem",
                };
                const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dossie-${detail.token.symbol.toLowerCase()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-zinc-800 bg-zinc-900/90 text-[0.65rem] font-mono font-bold text-zinc-300 hover:border-cyan-500/40 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Exportar Payload JSON do Dossiê"
            >
              <FileJson className="size-3.5 text-cyan-400" />
              <span>.json</span>
            </button>
            <button
              type="button"
              onClick={() => {
                generateChartSnapshotPng(
                  detail.token,
                  detail.latest_market,
                  detail.latest_risk,
                  detail.latest_score
                );
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-[#d1ff00]/40 bg-[#d1ff00]/10 text-[0.65rem] font-mono font-bold text-[#d1ff00] hover:bg-[#d1ff00]/20 transition-all cursor-pointer shadow-sm"
              title="Gerar e Descarregar Snapshot PNG com Marca d'Água AG47 R-A"
            >
              <Camera className="size-3.5" />
              <span>Snapshot</span>
            </button>
            <DataBadges
              demo={detail.data_mode === "demo"}
              partial={score.isError || history.isError}
            />
          </div>
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

        <div className="mt-3 grid grid-cols-3 divide-x divide-zinc-800/80 rounded-xl border border-zinc-800/80 bg-zinc-950/60 py-2.5 text-center">
          <div>
            <p className="text-[0.58rem] font-mono font-bold uppercase text-zinc-500">5 min</p>
            <ChangeValue value={market?.price_change_5m ?? null} />
          </div>
          <div>
            <p className="text-[0.58rem] font-mono font-bold uppercase text-zinc-500">1 hora</p>
            <ChangeValue value={market?.price_change_1h ?? null} />
          </div>
          <div>
            <p className="text-[0.58rem] font-mono font-bold uppercase text-zinc-500">24 horas</p>
            <ChangeValue value={market?.price_change_24h ?? null} />
          </div>
        </div>

        {/* Swap & Slippage Simulator */}
        <div className="mt-3.5">
          <SwapSimulator token={detail.token} market={market} risk={detail.latest_risk} />
        </div>

        <section className="mt-3.5" aria-labelledby={`history-title-${tokenId}`}>
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

        <div className="mt-3.5 space-y-3.5">
          <LiquidityDepthChart token={detail.token} market={market} />
          <SmartMoneyTracker token={detail.token} />
          <MarketCorrelationMatrix token={detail.token} />
        </div>

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
