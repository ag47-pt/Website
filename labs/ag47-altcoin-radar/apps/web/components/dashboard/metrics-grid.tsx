"use client";

import {
  BellRing,
  Binoculars,
  Clock3,
  Info,
  Radar,
  ServerCog,
  Star,
  type LucideIcon,
} from "lucide-react";
import { useSystemStatus } from "@/lib/api/query";
import { formatDateTime, formatNumber, formatScore } from "@/lib/format";
import { DataBadges } from "@/components/shared/data-badges";

interface MetricCardProps {
  label: string;
  value: string;
  comparison: string;
  help: string;
  icon: LucideIcon;
  tone: "green" | "blue" | "amber" | "purple";
  isLoading: boolean;
}

const tones = {
  green: "border-radar-positive/20 bg-[#10291f] text-radar-positive",
  blue: "border-radar-neutral/20 bg-[#132740] text-radar-neutral",
  amber: "border-radar-warning/20 bg-[#33260f] text-radar-warning",
  purple: "border-radar-secondary/20 bg-[#252040] text-radar-secondary",
};

function MetricCard({
  label,
  value,
  comparison,
  help,
  icon: Icon,
  tone,
  isLoading,
}: MetricCardProps) {
  return (
    <article className="panel min-h-28 p-3.5 @container">
      <div className="flex items-start gap-3">
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-xl border ${tones[tone]}`}
        >
          <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[0.67rem] font-bold text-radar-muted">{label}</p>
            <span title={help}>
              <Info aria-label={help} className="size-3 text-radar-subtle" />
            </span>
          </div>
          {isLoading ? (
            <div className="skeleton mt-2 h-7 w-20" />
          ) : (
            <p className="mono mt-1 truncate text-[1.35rem] font-extrabold tracking-[-0.06em] text-radar-ink">
              {value}
            </p>
          )}
          <p className="mt-1 truncate text-[0.61rem] font-semibold text-radar-subtle">
            {comparison}
          </p>
        </div>
      </div>
    </article>
  );
}

export function MetricsGrid() {
  const status = useSystemStatus();
  const metrics = status.data?.metrics;

  const cards: Omit<MetricCardProps, "isLoading">[] = [
    {
      label: "Tokens monitorados",
      value: formatNumber(metrics?.tokens_monitored ?? null),
      comparison: "Variação do período: N/D",
      help: "Tokens com pelo menos uma leitura persistida no Radar.",
      icon: Binoculars,
      tone: "blue",
    },
    {
      label: "Alertas emitidos hoje",
      value: formatNumber(metrics?.alerts_today ?? null),
      comparison: "Comparação anterior: N/D",
      help: "Alertas únicos emitidos desde 00:00 no timezone configurado.",
      icon: BellRing,
      tone: "purple",
    },
    {
      label: "Oportunidades fortes",
      value: formatNumber(metrics?.strong_opportunities ?? null),
      comparison: "Score ≥ 8 sem flag crítica",
      help: "Tokens classificados como oportunidade forte pelas regras da versão ativa.",
      icon: Radar,
      tone: "green",
    },
    {
      label: "Score médio",
      value: metrics?.average_score == null ? "N/D" : `${formatScore(metrics.average_score)}/10`,
      comparison: "Comparação anterior: N/D",
      help: "Média do score final dos tokens visíveis ao monitoramento.",
      icon: Star,
      tone: "amber",
    },
    {
      label: "Providers ativos",
      value: formatNumber(metrics?.active_providers ?? null),
      comparison: `${status.data?.providers.length ?? "N/D"} configurados`,
      help: "Providers reais ou demo que responderam na última verificação.",
      icon: ServerCog,
      tone: "green",
    },
    {
      label: "Última sincronização",
      value: status.data?.last_sync_at
        ? new Intl.DateTimeFormat("pt-PT", { hour: "2-digit", minute: "2-digit" }).format(
            new Date(status.data.last_sync_at),
          )
        : "N/D",
      comparison: formatDateTime(status.data?.last_sync_at ?? null),
      help: "Momento da última ingestão concluída, convertido para o timezone do utilizador.",
      icon: Clock3,
      tone: "blue",
    },
  ];

  return (
    <section aria-labelledby="overview-title">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="eyebrow">Visão operacional</p>
          <h1 id="overview-title" className="mt-1 text-lg font-extrabold tracking-[-0.03em]">
            Radar de oportunidades
          </h1>
        </div>
        <DataBadges demo={status.data?.demo_mode} partial={status.data?.status === "degraded"} />
      </div>
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 2xl:grid-cols-6">
        {cards.map((card) => (
          <MetricCard key={card.label} {...card} isLoading={status.isLoading} />
        ))}
      </div>
    </section>
  );
}
