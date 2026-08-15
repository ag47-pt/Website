"use client";

import { AlertTriangle, Bell, ChevronLeft, ChevronRight, TrendingUp, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAlerts } from "@/eco/alt-radar/apps/web/lib/api/query";
import type { Alert } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { formatDateTime, formatTime, getErrorMessage } from "@/eco/alt-radar/apps/web/lib/format";
import { DataBadges } from "@/eco/alt-radar/apps/web/components/shared/data-badges";
import { EmptyState, ErrorState, PanelSkeleton } from "@/eco/alt-radar/apps/web/components/shared/query-state";
import { getAudioMuted, playCriticalAlertSound, playTacticalAlertSound, toggleAudioMuted } from "@/eco/alt-radar/apps/web/lib/sonar-audio";
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

function AlertRow({ alert, compact }: { alert: Alert; compact?: boolean }) {
  const Icon = alertIcons[alert.rule_id as keyof typeof alertIcons] ?? Bell;
  const title = alertTitles[alert.rule_id] ?? alert.rule_id;
  const message = alertMessages[alert.rule_id] ?? `Detectado evento na regra ${alert.rule_id}`;
  const { primary } = useEcoTheme();

  return (
    <article className="grid grid-cols-[3rem_2.2rem_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-white/5 px-3.5 py-2.5 last:border-0 sm:grid-cols-[4.5rem_2.4rem_minmax(0,1fr)_auto] hover:bg-white/[0.02] transition-colors font-mono">
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
      <div className="min-w-0">
        <p className="truncate text-[0.69rem] text-zinc-300">
          <strong className="mr-1.5 text-white">{alert.token_symbol}</strong>
          {compact ? message : title}
        </p>
        {!compact && (
          <p className="mt-0.5 line-clamp-2 text-[0.61rem] leading-4 text-zinc-500">
            {message}
          </p>
        )}
      </div>
      <Link
        className="inline-flex items-center gap-1 whitespace-nowrap text-[0.62rem] font-bold hover:underline transition-colors"
        style={{ color: primary }}
        href={`/eco/alt-radar?tab=opportunities&token=${alert.token_id}`}
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
  const [pushEnabled, setPushEnabled] = useState(false);
  const lastAlertIdRef = useRef<string | null>(null);
  const alerts = useAlerts(page, compact ? 4 : 20);
  const visibleAlerts = alerts.data?.items ?? [];
  const { primary } = useEcoTheme();

  useEffect(() => {
    setMuted(getAudioMuted());
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushEnabled(Notification.permission === "granted");
    }
  }, []);

  useEffect(() => {
    if (visibleAlerts.length > 0) {
      const topAlert = visibleAlerts[0];
      if (lastAlertIdRef.current && lastAlertIdRef.current !== topAlert.id) {
        if (topAlert.severity && topAlert.severity >= 80) {
          playCriticalAlertSound();
        } else {
          playTacticalAlertSound(540, 920, 0.22);
        }

        // Native Web Push Notification
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
          try {
            new Notification(`🚨 AG47 Radar: ${topAlert.token_symbol}`, {
              body: `Alerta Tático: ${alertTitles[topAlert.rule_id] ?? topAlert.rule_id}`,
              icon: "/icon.svg",
            });
          } catch (_e) {
            // Ignore notification errors
          }
        }
      }
      lastAlertIdRef.current = topAlert.id;
    }
  }, [visibleAlerts]);

  const handleTogglePush = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "granted") {
      setPushEnabled(true);
      return;
    }
    const res = await Notification.requestPermission();
    setPushEnabled(res === "granted");
  };

  const handleToggleMute = () => {
    const isNowMuted = toggleAudioMuted();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      playTacticalAlertSound(440, 880, 0.15);
    }
  };

  return (
    <section
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden"
      aria-labelledby={compact ? "recent-alerts-title" : "alerts-title"}
      data-testid="alerts-feed"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3.5 py-3 font-mono">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-zinc-400">Eventos deduplicados</p>
          <h2
            id={compact ? "recent-alerts-title" : "alerts-title"}
            className="mt-1 flex items-center gap-2 text-sm font-bold text-white font-sans"
          >
            <Bell className="size-4" style={{ color: primary }} />{" "}
            {compact ? "Alertas recentes" : "Feed de alertas"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePush}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[0.65rem] font-bold transition-all cursor-pointer ${
              pushEnabled
                ? "text-white"
                : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
            }`}
            style={pushEnabled ? { borderColor: `${primary}50`, backgroundColor: `${primary}15`, color: primary, boxShadow: `0 0 8px ${primary}20` } : {}}
            title={pushEnabled ? "Notificações push do navegador ativas" : "Clique para permitir notificações no navegador"}
          >
            <Bell className="size-3.5" style={{ color: pushEnabled ? primary : undefined }} />
            <span>{pushEnabled ? "Push ON" : "Push OFF"}</span>
          </button>
          <button
            type="button"
            onClick={handleToggleMute}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[0.65rem] font-bold transition-all cursor-pointer ${
              !muted
                ? "text-white"
                : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
            }`}
            style={!muted ? { borderColor: `${primary}50`, backgroundColor: `${primary}15`, color: primary, boxShadow: `0 0 8px ${primary}20` } : {}}
            title={!muted ? "Sonar de áudio ativo (clique para silenciar)" : "Sonar silenciado (clique para ativar)"}
          >
            {!muted ? <Volume2 className="size-3.5" style={{ color: primary }} /> : <VolumeX className="size-3.5 text-zinc-500" />}
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
        <footer className="flex items-center justify-between border-t border-white/10 px-3.5 py-2.5 font-mono">
          <p className="text-[0.62rem] text-zinc-400">
            {alerts.data ? `${alerts.data.total} alertas` : "Aguardando dados"}
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
              {page}/{Math.max(1, alerts.data?.pages ?? 1)}
            </span>
            <button
              aria-label="Página seguinte"
              className="grid size-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white disabled:opacity-35 transition-colors cursor-pointer"
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
