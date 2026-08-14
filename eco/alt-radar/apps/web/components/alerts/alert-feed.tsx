"use client";

import { AlertTriangle, Bell, ChevronLeft, ChevronRight, TrendingUp, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAlerts } from "@/eco/alt-radar/apps/web/lib/api/query";
import type { Alert } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { formatDateTime, formatTime, getErrorMessage } from "@/eco/alt-radar/apps/web/lib/format";
import { DataBadges } from "@/eco/alt-radar/apps/web/components/shared/data-badges";
import { EmptyState, ErrorState, PanelSkeleton } from "@/eco/alt-radar/apps/web/components/shared/query-state";
import { getAudioMuted, playTacticalAlertSound, toggleAudioMuted } from "@/eco/alt-radar/apps/web/lib/sonar-audio";

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

function AlertRow({ alert, compact }: { alert: Alert; compact?: boolean }) {
  const Icon = alertIcons[alert.rule_id as keyof typeof alertIcons] ?? Bell;
  const title = alertTitles[alert.rule_id] ?? alert.rule_id;
  const message = alertMessages[alert.rule_id] ?? `Detectado evento na regra ${alert.rule_id}`;

  return (
    <article className="grid grid-cols-[3rem_2.2rem_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-radar-border/70 px-3.5 py-2.5 last:border-0 sm:grid-cols-[4.5rem_2.4rem_minmax(0,1fr)_auto]">
      <time
        className="mono text-[0.62rem] text-radar-muted"
        dateTime={alert.triggered_at}
        title={formatDateTime(alert.triggered_at)}
      >
        {formatTime(alert.triggered_at)}
      </time>
      <span
        className={`grid size-7 place-items-center rounded-full border ${severityTone(alert.severity)}`}
      >
        <Icon aria-hidden="true" className="size-3.5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[0.69rem] text-radar-muted">
          <strong className="mr-1.5 text-radar-ink">{alert.token_symbol}</strong>
          {compact ? message : title}
        </p>
        {!compact && (
          <p className="mt-0.5 line-clamp-2 text-[0.61rem] leading-4 text-radar-subtle">
            {message}
          </p>
        )}
      </div>
      <Link
        className="inline-flex items-center gap-1 whitespace-nowrap text-[0.62rem] font-bold text-radar-positive hover:underline"
        href={`/oportunidades?token=${alert.token_id}`}
      >
        <span className="hidden sm:inline">Ver detalhes</span>
        <ChevronRight className="size-3.5" />
      </Link>
    </article>
  );
}

export function AlertFeed({ compact = false }: { compact?: boolean }) {
  const [page, setPage] = useState(1);
  const [muted, setMuted] = useState(false);
  const lastAlertIdRef = useRef<string | null>(null);
  const alerts = useAlerts(page, compact ? 4 : 20);
  const visibleAlerts = alerts.data?.items ?? [];

  useEffect(() => {
    setMuted(getAudioMuted());
  }, []);

  useEffect(() => {
    if (visibleAlerts.length > 0) {
      const topAlert = visibleAlerts[0];
      if (lastAlertIdRef.current && lastAlertIdRef.current !== topAlert.id) {
        playTacticalAlertSound(540, 920, 0.22);
      }
      lastAlertIdRef.current = topAlert.id;
    }
  }, [visibleAlerts]);

  const handleToggleMute = () => {
    const isNowMuted = toggleAudioMuted();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      playTacticalAlertSound(440, 880, 0.15);
    }
  };

  return (
    <section
      className="panel overflow-hidden"
      aria-labelledby={compact ? "recent-alerts-title" : "alerts-title"}
      data-testid="alerts-feed"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 px-3.5 py-3">
        <div>
          <p className="eyebrow text-zinc-400">Eventos deduplicados</p>
          <h2
            id={compact ? "recent-alerts-title" : "alerts-title"}
            className="mt-1 flex items-center gap-2 text-sm font-mono font-bold text-white"
          >
            <Bell className="size-4 text-[#d1ff00]" />{" "}
            {compact ? "Alertas recentes" : "Feed de alertas"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleMute}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[0.65rem] font-mono font-bold transition-all cursor-pointer ${
              !muted
                ? "border-[#d1ff00]/40 bg-[#d1ff00]/10 text-[#d1ff00] shadow-[0_0_8px_rgba(209,255,0,0.15)]"
                : "border-zinc-800 bg-zinc-900/60 text-zinc-500 hover:text-zinc-300"
            }`}
            title={!muted ? "Sonar de áudio ativo (clique para silenciar)" : "Sonar silenciado (clique para ativar)"}
          >
            {!muted ? <Volume2 className="size-3.5 text-[#d1ff00]" /> : <VolumeX className="size-3.5 text-zinc-500" />}
            <span>{!muted ? "Sonar ON" : "Sonar OFF"}</span>
          </button>
          <DataBadges
            demo={alerts.data?.demo_mode}
            partial={alerts.data?.partial}
            stale={alerts.data?.stale}
          />
        </div>
      </div>

      {alerts.isLoading ? (
        <PanelSkeleton rows={compact ? 4 : 8} />
      ) : alerts.isError ? (
        <ErrorState message={getErrorMessage(alerts.error)} retry={() => void alerts.refetch()} />
      ) : !visibleAlerts.length ? (
        <EmptyState
          title="Nenhum alerta neste recorte"
          message="O motor não emitiu eventos únicos para os filtros atuais."
        />
      ) : (
        <div>
          {visibleAlerts.map((alert: Alert) => (
            <AlertRow key={alert.id} alert={alert} compact={compact} />
          ))}
        </div>
      )}

      {!compact && (
        <footer className="flex items-center justify-between border-t border-radar-border px-3.5 py-2.5">
          <p className="text-[0.62rem] text-radar-muted">
            {alerts.data ? `${alerts.data.total} alertas` : "Aguardando dados"}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              aria-label="Página anterior"
              className="grid size-8 place-items-center rounded-md border border-radar-border disabled:opacity-35"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              type="button"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="mono min-w-12 text-center text-[0.62rem] text-radar-muted">
              {page}/{Math.max(1, alerts.data?.pages ?? 1)}
            </span>
            <button
              aria-label="Página seguinte"
              className="grid size-8 place-items-center rounded-md border border-radar-border disabled:opacity-35"
              disabled={page >= (alerts.data?.pages ?? 1)}
              onClick={() => setPage((current) => current + 1)}
              type="button"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </footer>
      )}
    </section>
  );
}
