"use client";
import {
  AlertTriangle,
  Bell,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  TrendingUp,
  X,
  ShieldCheck,
  HelpCircle,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useEdgeInbox, useAlertMutation } from "@/eco/alt-radar/apps/web/lib/api/query";
import type { Alert } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { formatDateTime, formatTime, getErrorMessage } from "@/eco/alt-radar/apps/web/lib/format";
import { DataBadges } from "@/eco/alt-radar/apps/web/components/shared/data-badges";
import { EmptyState, ErrorState, PanelSkeleton } from "@/eco/alt-radar/apps/web/components/shared/query-state";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

const alertIcons = {
  "rule:liquidity_volume_expansion": TrendingUp,
  "rule:high_volume_liquidity_contraction": AlertTriangle,
  "rule:volume_spike": TrendingUp,
  "rule:liquidity_drop": AlertTriangle,
} as const;

const alertTitles: Record<string, string> = {
  "rule:liquidity_volume_expansion": "Expansão simultânea de liquidez e volume",
  "rule:high_volume_liquidity_contraction": "Contração de liquidez com volume",
  "rule:volume_spike": "Pico de volume",
  "rule:liquidity_drop": "Queda severa de liquidez",
};

const alertMessages: Record<string, string> = {
  "rule:liquidity_volume_expansion": "Detectada convergência forte de indicadores de expansão.",
  "rule:high_volume_liquidity_contraction": "Liquidez removida enquanto o volume permanecia alto.",
  "rule:volume_spike": "O volume do token sofreu um pico significativo recentemente.",
  "rule:liquidity_drop": "A liquidez foi reduzida subitamente de forma considerável.",
};

function severityTone(severity: number | null) {
  if (severity === null) return "border-cyan-500/40 bg-cyan-500/10 text-cyan-400";
  if (severity >= 80) return "border-rose-500/40 bg-rose-500/10 text-rose-400 font-bold";
  if (severity >= 60) return "border-orange-500/40 bg-orange-500/10 text-orange-400 font-bold";
  if (severity >= 40) return "border-amber-500/40 bg-amber-500/10 text-amber-400 font-bold";
  return "border-cyan-500/40 bg-cyan-500/10 text-cyan-400";
}

function getConfidenceBadge(level: string | null | undefined) {
  switch (level) {
    case "confirmado":
      return (
        <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[0.55rem] font-semibold text-emerald-400">
          <ShieldCheck className="size-3" /> Edge Confirmado
        </span>
      );
    case "suspenso":
      return (
        <span className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-1.5 py-0.5 text-[0.55rem] font-semibold text-rose-400">
          <AlertTriangle className="size-3" /> Drawdown Suspenso
        </span>
      );
    case "indeterminada":
      return (
        <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-1.5 py-0.5 text-[0.55rem] font-semibold text-zinc-400">
          <HelpCircle className="size-3" /> Cold Start
        </span>
      );
    case "abaixo_edge":
      return (
        <span className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[0.55rem] font-semibold text-amber-400">
          <Activity className="size-3" /> Abaixo do Edge
        </span>
      );
    default:
      return null;
  }
}

function AlertRow({
  alert,
  mutateAlert,
}: {
  alert: Alert;
  mutateAlert: (alertId: string, status: "read" | "acknowledged" | "dismissed") => void;
}) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const Icon = alertIcons[alert.rule_id as keyof typeof alertIcons] ?? Bell;
  const title = alertTitles[alert.rule_id] ?? alert.rule_id;
  const message = alertMessages[alert.rule_id] ?? `Detectado evento na regra ${alert.rule_id}`;
  const isUnread = alert.status === "unread";
  const { primary } = useEcoTheme();

  return (
    <article
      className={`grid grid-cols-[3rem_2.2rem_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-white/5 px-3.5 py-3 last:border-0 sm:grid-cols-[4.5rem_2.4rem_minmax(0,1fr)_auto] transition-colors font-mono ${isUnread ? "bg-white/[0.03]" : "opacity-80"}`}
    >
      <time
        className="text-[0.62rem] text-zinc-400"
        dateTime={alert.triggered_at}
        title={formatDateTime(alert.triggered_at)}
      >
        {formatTime(alert.triggered_at)}
      </time>
      <span
        className={`grid size-7 place-items-center rounded-xl border ${severityTone(alert.severity)}`}
      >
        <Icon aria-hidden="true" className="size-3.5" />
      </span>
      <div className="min-w-0 pr-4">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="truncate text-[0.69rem] text-zinc-300">
            <strong className="mr-1.5 text-white">{alert.token_symbol}</strong>
            {title}
          </p>
          {getConfidenceBadge(alert.confidence_level)}
          {alert.score_components && (
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="inline-flex items-center gap-1 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 px-1.5 py-0.5 text-[0.55rem] font-bold text-cyan-300 transition-colors cursor-pointer"
              title="Clique para ver o breakdown do score"
            >
              <Activity className="size-3 text-cyan-400" />
              Score: {alert.score_components.final_score.toFixed(1)}
            </button>
          )}
          {isUnread && (
            <span className="inline-flex items-center rounded-full bg-cyan-500/20 px-2 py-0.5 text-[0.55rem] font-bold text-cyan-300">
              Novo
            </span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-[0.61rem] leading-4 text-zinc-500">{message}</p>

        {/* Breakdown section */}
        {showBreakdown && alert.score_components && (
          <div className="mt-3.5 border border-white/10 pt-2.5 px-3 py-3 rounded-xl bg-[#050c12]/90 space-y-2">
            <div className="font-bold text-zinc-300 text-[0.58rem] flex justify-between items-center">
              <span>EXPLICAÇÃO DO SCORE (PESO PONDERADO)</span>
              <span className="text-[0.6rem] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-lg border border-emerald-500/30 font-black">
                Calculado: {alert.score_components.final_score.toFixed(2)}/10
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[0.56rem]">
              {Object.entries(alert.score_components).map(([key, value]) => {
                if (key === "final_score") return null;
                const cleanName = key.replace("_score", "").replace("_", " ");
                const weightVal = alert.score_weights?.[key];
                const weightStr = weightVal !== undefined ? `${(weightVal * 100).toFixed(0)}%` : "N/A";
                
                let colorClass = "text-white";
                if (value >= 7.0) colorClass = "text-emerald-400";
                else if (value >= 5.0) colorClass = "text-amber-400";
                else colorClass = "text-rose-400";

                return (
                  <div key={key} className="bg-white/[0.02] p-2 rounded-lg border border-white/5">
                    <span className="text-zinc-400 capitalize block text-[0.52rem] mb-0.5">{cleanName} ({weightStr})</span>
                    <span className={`font-black text-[0.62rem] ${colorClass}`}>{value.toFixed(1)}/10</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-2.5 flex items-center gap-2">
          {isUnread && (
            <button
              onClick={() => mutateAlert(alert.id, "read")}
              className="inline-flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 px-2 py-1 text-[0.55rem] font-bold text-zinc-300 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
            >
              <Check className="size-3 text-cyan-400" /> Marcar como lido
            </button>
          )}
          <button
            onClick={() => mutateAlert(alert.id, "acknowledged")}
            className="inline-flex items-center gap-1 rounded-xl bg-emerald-950/40 border border-emerald-500/30 px-2 py-1 text-[0.55rem] font-bold text-emerald-300 hover:bg-emerald-900/50 cursor-pointer transition-colors"
            disabled={alert.status === "acknowledged"}
          >
            <Clock className="size-3" /> Ciente
          </button>
          <button
            onClick={() => mutateAlert(alert.id, "dismissed")}
            className="inline-flex items-center gap-1 rounded-xl bg-rose-950/40 border border-rose-500/30 px-2 py-1 text-[0.55rem] font-bold text-rose-300 hover:bg-rose-900/50 cursor-pointer transition-colors"
            disabled={alert.status === "dismissed"}
          >
            <X className="size-3" /> Dispensar
          </button>
        </div>
      </div>
      <Link
        className="inline-flex items-center gap-1 whitespace-nowrap text-[0.62rem] font-bold hover:underline transition-colors"
        style={{ color: primary }}
        href={`/eco/alt-radar?tab=opportunities&token=${alert.token_id}`}
      >
        <span className="hidden sm:inline">Ver oportunidade</span>
        <ChevronRight className="size-3.5" />
      </Link>
    </article>
  );
}

export function AlertInbox() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "unread">("all");
  const [confidenceFilter, setConfidenceFilter] = useState<string>("all");

  const edgeInbox = useEdgeInbox(page, 20, confidenceFilter);
  const mutation = useAlertMutation();
  const { primary } = useEcoTheme();

  const handleMutateAlert = (alertId: string, status: "read" | "acknowledged" | "dismissed") => {
    mutation.mutate({ alertId, status });
  };

  const visibleAlerts = useMemo(
    () =>
      edgeInbox.data?.alerts.items.filter((alert) => {
        const passStatus = statusFilter === "all" || alert.status === "unread";
        return passStatus;
      }) ?? [],
    [edgeInbox.data?.alerts.items, statusFilter],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-4 items-start font-mono">
      {/* Inbox Panel */}
      <section
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden"
        aria-labelledby="inbox-title"
        data-testid="alerts-inbox"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3.5 py-3">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-zinc-400">Gestão de Alertas</p>
            <h2 id="inbox-title" className="mt-1 flex items-center gap-2 text-sm font-bold text-white font-sans">
              <Bell className="size-4" style={{ color: primary }} /> Inbox do Operador
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DataBadges
              demo={edgeInbox.data?.alerts.demo_mode}
              partial={edgeInbox.data?.alerts.partial}
              stale={edgeInbox.data?.alerts.stale}
            />
            <div className="flex flex-wrap items-center gap-2 border-l border-white/10 pl-2">
              <label>
                <span className="sr-only">Nível de Confiança</span>
                <select
                  className="h-8 rounded-xl border border-white/10 bg-black/40 px-2 text-[0.62rem] text-white focus:outline-none"
                  onChange={(event) => setConfidenceFilter(event.target.value)}
                  value={confidenceFilter}
                >
                  <option value="all">Todos os níveis</option>
                  <option value="confirmado">Confirmados (Edge &ge; 65%)</option>
                  <option value="indeterminada">Cold Start (Amostra Insuficiente)</option>
                  <option value="suspenso">Suspensos (Drawdown Ativo)</option>
                </select>
              </label>

              <label>
                <span className="sr-only">Filtrar status</span>
                <select
                  className="h-8 rounded-xl border border-white/10 bg-black/40 px-2 text-[0.62rem] text-white focus:outline-none"
                  onChange={(event) => setStatusFilter(event.target.value as "all" | "unread")}
                  value={statusFilter}
                >
                  <option value="all">Todos os alertas</option>
                  <option value="unread">Apenas não lidos</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {edgeInbox.isLoading ? (
          <PanelSkeleton rows={8} />
        ) : edgeInbox.isError ? (
          <ErrorState message={getErrorMessage(edgeInbox.error)} retry={() => void edgeInbox.refetch()} />
        ) : !visibleAlerts.length ? (
          <EmptyState
            title="Inbox limpa"
            message="Não há alertas que correspondam aos filtros selecionados."
          />
        ) : (
          <div>
            {visibleAlerts.map((alert) => (
              <AlertRow key={alert.id} alert={alert} mutateAlert={handleMutateAlert} />
            ))}
          </div>
        )}

        <footer className="flex items-center justify-between border-t border-white/10 px-3.5 py-2.5">
          <p className="text-[0.62rem] text-zinc-400">
            {edgeInbox.data ? `${edgeInbox.data.alerts.total} alertas` : "Aguardando dados"}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              aria-label="Página anterior"
              className="grid size-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white disabled:opacity-35 transition-colors cursor-pointer"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              type="button"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-12 text-center text-[0.62rem] text-zinc-400">
              {page}/{Math.max(1, edgeInbox.data?.alerts.pages ?? 1)}
            </span>
            <button
              aria-label="Página seguinte"
              className="grid size-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white disabled:opacity-35 transition-colors cursor-pointer"
              disabled={page >= (edgeInbox.data?.alerts.pages ?? 1)}
              onClick={() => setPage((current) => current + 1)}
              type="button"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </footer>
      </section>

      {/* Correlation Matrix Panel */}
      <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-3.5 space-y-3">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-zinc-400">Métricas Estatísticas</p>
          <h2 className="text-sm font-bold tracking-tight text-white font-sans mt-0.5">Matriz Score vs Resultado</h2>
          <p className="text-[0.6rem] text-zinc-400 mt-1 leading-relaxed">
            Correlação em tempo real entre a pontuação de oportunidade e o resultado auditado pelo Truth Engine.
          </p>
        </div>

        {edgeInbox.isLoading ? (
          <div className="space-y-2 py-4">
            <div className="h-6 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-24 bg-white/5 rounded-xl animate-pulse" />
          </div>
        ) : edgeInbox.isError ? (
          <div className="text-[0.62rem] text-rose-400">Não foi possível carregar a matriz.</div>
        ) : (
          <div className="border border-white/10 rounded-xl overflow-hidden text-[0.6rem] bg-[#050c12]">
            {/* Table Header */}
            <div className="grid grid-cols-[1.5fr_1fr_1.2fr_1.2fr] gap-1 px-2.5 py-1.5 bg-white/5 font-bold text-zinc-400 border-b border-white/10">
              <div>Score Bucket</div>
              <div className="text-center">Amostras</div>
              <div className="text-center">Win Rate</div>
              <div className="text-center">Ret. Médio</div>
            </div>

            {/* Table Body / Heatmap Grid */}
            <div className="divide-y divide-white/5">
              {edgeInbox.data?.correlation_matrix.map((row) => {
                const hasSignificantSamples = row.total_samples >= 30;
                let bgClass = "bg-white/5 text-zinc-400";
                
                if (hasSignificantSamples) {
                  if (row.is_suspended) {
                    bgClass = "bg-rose-950/50 text-rose-300 border border-rose-500/30";
                  } else if (row.win_rate_pct >= 65.0) {
                    bgClass = "bg-emerald-950/50 text-emerald-300 border border-emerald-500/30";
                  } else if (row.win_rate_pct >= 45.0) {
                    bgClass = "bg-amber-950/50 text-amber-300 border border-amber-500/30";
                  } else {
                    bgClass = "bg-rose-950/50 text-rose-300 border border-rose-500/30";
                  }
                }

                return (
                  <div
                    key={row.score_range}
                    className="grid grid-cols-[1.5fr_1fr_1.2fr_1.2fr] items-center gap-1 px-2.5 py-2 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="font-bold text-white truncate" title={row.score_range}>
                      {row.score_range.split(" (")[0]}
                    </div>
                    <div className="text-center text-zinc-400">
                      {row.total_samples}
                    </div>
                    <div className="text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded-lg text-[0.55rem] font-bold ${bgClass}`}>
                        {hasSignificantSamples ? `${row.win_rate_pct}%` : "Cold Start"}
                      </span>
                    </div>
                    <div className={`text-center font-bold ${row.avg_return_pct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {row.avg_return_pct > 0 ? "+" : ""}{row.avg_return_pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-2.5 text-[0.58rem] leading-relaxed text-zinc-400">
          <strong className="text-white block mb-0.5">Legenda & Regras:</strong>
          <ul className="list-disc pl-3.5 space-y-1">
            <li>
              <span className="text-emerald-400 font-semibold">Edge Estatístico</span> (&ge; 65%): buckets verdes liberados para alertas imediatos.
            </li>
            <li>
              <span className="text-rose-400 font-semibold">Drawdown Ativo</span> (3 falhas consecutivas): buckets suspensos temporariamente.
            </li>
            <li>
              <span className="text-zinc-400 font-semibold">Cold Start</span> (&lt; 30 amostras): tags cinzas indicando dados insuficientes para travar alertas.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
