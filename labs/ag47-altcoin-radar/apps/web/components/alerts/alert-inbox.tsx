"use client";

import {
  AlertTriangle,
  Bell,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  TrendingUp,
  X
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAlerts, useAlertMutation } from "@/lib/api/query";
import type { Alert } from "@/lib/api/schemas";
import { formatDateTime, formatTime, getErrorMessage } from "@/lib/format";
import { DataBadges } from "@/components/shared/data-badges";
import { EmptyState, ErrorState, PanelSkeleton } from "@/components/shared/query-state";

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
  if (severity === null) return "border-radar-neutral/25 bg-[#132943] text-radar-neutral";
  if (severity >= 80) return "border-radar-critical/25 bg-[#37181e] text-radar-critical";
  if (severity >= 60) return "border-[#ff8a67]/25 bg-[#3a2118] text-[#ff8a67]";
  if (severity >= 40) return "border-radar-warning/25 bg-[#38290e] text-radar-warning";
  return "border-radar-neutral/25 bg-[#132943] text-radar-neutral";
}

function AlertRow({ alert, mutateAlert }: { alert: Alert, mutateAlert: (alertId: string, status: "read" | "acknowledged" | "dismissed") => void }) {
  const Icon = alertIcons[alert.rule_id as keyof typeof alertIcons] ?? Bell;
  const title = alertTitles[alert.rule_id] ?? alert.rule_id;
  const message = alertMessages[alert.rule_id] ?? `Detectado evento na regra ${alert.rule_id}`;
  const isUnread = alert.status === "unread";
  
  return (
    <article className={`grid grid-cols-[3rem_2.2rem_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-radar-border/70 px-3.5 py-3 last:border-0 sm:grid-cols-[4.5rem_2.4rem_minmax(0,1fr)_auto] transition-colors ${isUnread ? "bg-white/[0.02]" : "opacity-80 grayscale-[0.2]"}`}>
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
      <div className="min-w-0 pr-4">
        <p className="truncate text-[0.69rem] text-radar-muted">
          <strong className="mr-1.5 text-radar-ink">{alert.token_symbol}</strong>
          {title}
          {isUnread && (
            <span className="ml-2 inline-flex items-center rounded-full bg-blue-500/20 px-1.5 py-0.5 text-[0.55rem] font-medium text-blue-400">
              Novo
            </span>
          )}
        </p>
        <p className="mt-0.5 line-clamp-2 text-[0.61rem] leading-4 text-radar-subtle">
          {message}
        </p>
        
        {/* Actions */}
        <div className="mt-2 flex items-center gap-2">
          {isUnread && (
            <button
              onClick={() => mutateAlert(alert.id, "read")}
              className="inline-flex items-center gap-1 rounded bg-[#1d283a] px-2 py-1 text-[0.55rem] font-medium text-radar-ink hover:bg-[#2a364f]"
            >
              <Check className="size-3" /> Marcar como lido
            </button>
          )}
          <button
            onClick={() => mutateAlert(alert.id, "acknowledged")}
            className="inline-flex items-center gap-1 rounded bg-radar-positive/10 px-2 py-1 text-[0.55rem] font-medium text-radar-positive hover:bg-radar-positive/20"
            disabled={alert.status === "acknowledged"}
          >
            <Clock className="size-3" /> Ciente
          </button>
          <button
            onClick={() => mutateAlert(alert.id, "dismissed")}
            className="inline-flex items-center gap-1 rounded bg-radar-critical/10 px-2 py-1 text-[0.55rem] font-medium text-radar-critical hover:bg-radar-critical/20"
            disabled={alert.status === "dismissed"}
          >
            <X className="size-3" /> Dispensar
          </button>
        </div>
      </div>
      <Link
        className="inline-flex flex-col items-end gap-1 whitespace-nowrap text-[0.62rem] font-bold text-radar-positive hover:underline"
        href={`/oportunidades?token=${alert.token_id}`}
      >
        <span className="hidden sm:inline">Ver detalhes</span>
        <ChevronRight className="size-3.5" />
      </Link>
    </article>
  );
}

export function AlertInbox() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "unread">("all");
  
  const alerts = useAlerts(page, 20);
  const mutation = useAlertMutation();

  const handleMutateAlert = (alertId: string, status: "read" | "acknowledged" | "dismissed") => {
    mutation.mutate({ alertId, status });
  };

  const visibleAlerts = useMemo(
    () =>
      alerts.data?.items.filter((alert) => {
        const passStatus = statusFilter === "all" || alert.status === "unread";
        return passStatus;
      }) ?? [],
    [alerts.data?.items, statusFilter],
  );

  return (
    <section
      className="panel overflow-hidden"
      aria-labelledby="inbox-title"
      data-testid="alerts-inbox"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-radar-border px-3.5 py-3">
        <div>
          <p className="eyebrow">Gestão de Alertas</p>
          <h2
            id="inbox-title"
            className="mt-1 flex items-center gap-2 text-sm font-extrabold"
          >
            <Bell className="size-4 text-radar-muted" />{" "}
            Inbox
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DataBadges
            demo={alerts.data?.demo_mode}
            partial={alerts.data?.partial}
            stale={alerts.data?.stale}
          />
          <div className="flex items-center gap-2 border-l border-radar-border pl-2">
            <label>
              <span className="sr-only">Filtrar status</span>
              <select
                className="h-8 rounded-lg border border-radar-border bg-[#09151e] px-2 text-[0.62rem] text-radar-ink"
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

      {alerts.isLoading ? (
        <PanelSkeleton rows={8} />
      ) : alerts.isError ? (
        <ErrorState message={getErrorMessage(alerts.error)} retry={() => void alerts.refetch()} />
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
    </section>
  );
}
