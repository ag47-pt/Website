"use client";

import dynamic from "next/dynamic";
import { ExternalLink, Star, FileDown, FileJson, Camera, FileText } from "lucide-react";
import { useState } from "react";
import {
  useMarketHistory,
  useScore,
  useToken,
  useWatchlistMutation,
} from "@/eco/alt-radar/apps/web/lib/api/query";
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
import {
  EmptyState,
  ErrorState,
  PanelSkeleton,
} from "@/eco/alt-radar/apps/web/components/shared/query-state";
import { ScoreBreakdown } from "./score-breakdown";
import { TokenTimeline } from "./token-timeline";
import { SwapSimulator } from "./swap-simulator";
import { LiquidityDepthChart } from "./liquidity-depth-chart";
import { SmartMoneyTracker } from "./smart-money-tracker";
import { MarketCorrelationMatrix } from "./market-correlation-matrix";
import { generateChartSnapshotPng } from "@/eco/alt-radar/apps/web/lib/chart-snapshot";
import { generateExecutiveReportPdf } from "@/eco/alt-radar/apps/web/lib/executive-dossier-pdf";
import { playTokenSelectSound } from "@/eco/alt-radar/apps/web/lib/sonar-audio";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";
import {
  PUBLIC_OPERATOR_ACTION_TITLE,
  PUBLIC_PORTAL_READ_ONLY,
} from "@/eco/alt-radar/apps/web/lib/public-access";

const MarketChart = dynamic(() => import("./market-chart").then((module) => module.MarketChart), {
  ssr: false,
  loading: () => <div className="h-52 w-full animate-pulse rounded-2xl bg-white/5" />,
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
      className={`font-mono text-[0.68rem] font-bold ${value === null ? "text-zinc-500" : value > 0 ? "text-emerald-400" : value < 0 ? "text-rose-400" : "text-zinc-400"}`}
    >
      {formatPercent(value, true)}
    </span>
  );
}

function MarketMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-2.5 hover:border-white/10 transition-colors">
      <dt className="text-[0.58rem] font-mono font-bold uppercase tracking-wider text-zinc-400">
        {label}
      </dt>
      <dd className="mt-1 truncate font-mono text-xs font-bold text-white" title={value}>
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
  const { primary } = useEcoTheme();

  if (tokenId === null) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
        <EmptyState
          title="Selecione uma oportunidade"
          message="A análise atualiza sem recarregar a página."
        />
      </div>
    );
  }
  if (token.isLoading)
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
        <PanelSkeleton rows={8} />
      </div>
    );
  if (token.isError)
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
        <ErrorState message={getErrorMessage(token.error)} retry={() => void token.refetch()} />
      </div>
    );
  if (!token.data)
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
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
      className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl"
      aria-labelledby={`token-analysis-${tokenId}`}
      data-testid="token-analysis"
    >
      <header className="border-b border-white/10 bg-white/[0.02] px-3.5 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.62rem] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400">
              Análise Detalhada
            </p>
            <div className="mt-2 flex items-center gap-2.5">
              <span
                className="grid size-10 shrink-0 place-items-center rounded-2xl border text-lg font-black shadow-xl"
                style={{
                  borderColor: `${primary}50`,
                  backgroundColor: `${primary}15`,
                  color: primary,
                  boxShadow: `0 0 12px ${primary}25`,
                }}
              >
                {detail.token.symbol.slice(0, 1)}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2
                    id={`token-analysis-${tokenId}`}
                    className="truncate text-base font-black tracking-tight text-white font-sans"
                  >
                    {detail.token.name}{" "}
                    <span className="font-mono text-zinc-400 text-sm font-normal">
                      ({detail.token.symbol})
                    </span>
                  </h2>
                  <button
                    aria-label={
                      detail.watchlisted ? "Remover da watchlist" : "Adicionar à watchlist"
                    }
                    aria-pressed={detail.watchlisted}
                    className={`${
                      detail.watchlisted ? "text-amber-400" : "text-zinc-500 hover:text-zinc-300"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                    disabled={PUBLIC_PORTAL_READ_ONLY || watchlist.isPending}
                    onClick={() => watchlist.mutate({ tokenId, isWatchlisted: detail.watchlisted })}
                    title={PUBLIC_OPERATOR_ACTION_TITLE}
                    type="button"
                  >
                    <Star className="size-4" fill={detail.watchlisted ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <ChainBadge chain={detail.token.chain} />
                  <span className="font-mono text-[0.62rem] text-zinc-400">
                    {pair ? `${detail.token.symbol} / ${pair.quote_token}` : "Par aguardando dados"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono">
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
- **Score Final:** **${scoreData?.final_score ?? "N/D"}/10**
- **Classificação:** ${scoreData?.classification ?? "N/D"}
- **Confiança do Modelo:** ${scoreData?.confidence ? `${Math.round(scoreData.confidence * 100)}%` : "N/D"}
- **Versão do Motor:** ${scoreData?.scoring_version ?? "2.4.0"}
- **Explicação:** ${scoreData?.explanation ?? "N/D"}

### Fatores de Destaque
- **Positivos:** ${(scoreData?.positive_factors ?? []).join(", ") || "Nenhum"}
- **Negativos:** ${(scoreData?.negative_factors ?? []).join(", ") || "Nenhum"}

---

## 🛡️ Auditoria Zero-Trust & Risco
- **Score de Risco:** **${risk?.risk_score ?? "N/D"}/10**
- **Status do Pool (LP Lock):** ${risk?.liquidity_lock_status ?? "Desconhecido"}
- **Honeypot Check:** ${risk?.honeypot_status ?? "Desconhecido"}
- **Mint Authority:** ${risk?.mintable === false ? "Revogada (Seguro)" : risk?.mintable === true ? "Ativa (Risco)" : "Desconhecido"}
- **Top 10 Holders:** ${risk?.top_holders_percentage != null ? `${risk.top_holders_percentage}%` : "N/D"}
- **Deployer Balance:** ${risk?.deployer_percentage != null ? `${risk.deployer_percentage}%` : "N/D"}
- **Buy Tax / Sell Tax:** ${risk?.buy_tax != null ? `${risk.buy_tax}%` : "N/D"} / ${risk?.sell_tax != null ? `${risk.sell_tax}%` : "N/D"}

---

## 📊 Telemetria de Mercado
- **Preço USD:** ${market?.price_usd != null ? `$${market.price_usd}` : "N/D"}
- **Liquidez:** ${market?.liquidity_usd != null ? `$${market.liquidity_usd.toLocaleString()}` : "N/D"}
- **Volume 24h:** ${market?.volume_24h != null ? `$${market.volume_24h.toLocaleString()}` : "N/D"}
- **Market Cap:** ${market?.market_cap != null ? `$${market.market_cap.toLocaleString()}` : "N/D"}
- **Holders Ativos:** ${(holdersCount ?? risk?.holders_count) ? (holdersCount ?? risk?.holders_count)?.toLocaleString() : "N/D"}

---
*Gerado deterministicamente por AG47 Alt Radar — Ecosystem Intelligence.*
`;

                const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `dossie-tecnico-${token.symbol.toLowerCase()}.md`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-white/10 bg-white/5 text-[0.65rem] font-bold text-zinc-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Exportar Dossiê de Auditoria em Markdown"
            >
              <FileDown className="size-3.5" style={{ color: primary }} />
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
                const blob = new Blob([JSON.stringify(payload, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `dossie-${detail.token.symbol.toLowerCase()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-white/10 bg-white/5 text-[0.65rem] font-bold text-zinc-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Exportar Payload JSON do Dossiê"
            >
              <FileJson className="size-3.5" style={{ color: primary }} />
              <span>.json</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playTokenSelectSound();
                generateChartSnapshotPng(
                  detail.token,
                  detail.latest_market,
                  detail.latest_risk,
                  detail.latest_score,
                );
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-white/10 bg-white/5 text-[0.65rem] font-bold text-zinc-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Gerar e Descarregar Imagem Snapshot PNG com Marca d'Água AG47 R-A"
            >
              <Camera className="size-3.5" style={{ color: primary }} />
              <span>PNG</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playTokenSelectSound();
                generateExecutiveReportPdf({
                  token: detail.token,
                  market: detail.latest_market,
                  risk: detail.latest_risk,
                  score: detail.latest_score,
                  holdersCount: holdersCount ?? detail.latest_risk?.holders_count ?? null,
                  themePrimaryHex: primary,
                });
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[0.65rem] font-bold transition-all cursor-pointer shadow-sm"
              style={{
                borderColor: `${primary}50`,
                backgroundColor: `${primary}15`,
                color: primary,
                boxShadow: `0 0 10px ${primary}20`,
              }}
              title="Gerar e Imprimir Dossiê Técnico Executivo em PDF (Blueprint A4)"
            >
              <FileText className="size-3.5" />
              <span>Dossiê PDF</span>
            </button>
            <DataBadges
              demo={detail.data_mode === "demo"}
              partial={score.isError || history.isError}
            />
          </div>
        </div>

        <div className="mt-3 grid gap-1.5 font-mono text-[0.61rem] text-zinc-400">
          <div className="flex min-w-0 items-center gap-1">
            <span className="w-14 shrink-0 text-zinc-500">Contrato</span>
            <span className="truncate text-zinc-200" title={detail.token.contract_address}>
              {shortenAddress(detail.token.contract_address, 10)}
            </span>
            <CopyButton value={detail.token.contract_address} label="Copiar contrato" />
          </div>
          <div className="flex min-w-0 items-center gap-1">
            <span className="w-14 shrink-0 text-zinc-500">Par</span>
            {pair ? (
              <>
                <span className="truncate text-zinc-200" title={pair.pair_address}>
                  {shortenAddress(pair.pair_address, 10)}
                </span>
                <CopyButton value={pair.pair_address} label="Copiar endereço do par" />
              </>
            ) : (
              <span className="text-zinc-500">Aguardando dados</span>
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

        <div className="mt-3 grid grid-cols-3 divide-x divide-white/5 rounded-2xl border border-white/5 bg-white/[0.02] py-2.5 text-center">
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
              <h3
                id={`history-title-${tokenId}`}
                className="text-xs font-bold text-white font-sans"
              >
                Preço e Volume
              </h3>
              <p className="mt-0.5 font-mono text-[0.59rem] text-zinc-400">
                Histórico fornecido pela API, sem interpolação local.
              </p>
            </div>
            <div className="flex rounded-xl border border-white/10 bg-black/40 p-0.5 font-mono">
              {intervals.map((item) => (
                <button
                  key={item}
                  aria-pressed={interval === item}
                  className={`rounded-lg px-2.5 py-1 text-[0.59rem] font-bold uppercase transition-all cursor-pointer ${interval === item ? "text-white" : "text-zinc-400 hover:text-white"}`}
                  style={
                    interval === item
                      ? {
                          borderColor: `${primary}60`,
                          backgroundColor: `${primary}20`,
                          color: primary,
                          boxShadow: `0 0 10px ${primary}25`,
                        }
                      : {}
                  }
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
              <div className="h-52 w-full animate-pulse rounded-2xl bg-white/5" />
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

        <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2.5 font-mono text-[0.59rem] text-zinc-400">
          <span>Fonte de mercado: {market?.source ?? "Provider indisponível"}</span>
          {sourceUrl && (
            <a
              className="inline-flex items-center gap-1 font-bold hover:underline"
              style={{ color: primary }}
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
