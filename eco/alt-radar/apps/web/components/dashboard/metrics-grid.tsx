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
import { useSystemStatus } from "@/eco/alt-radar/apps/web/lib/api/query";
import { formatDateTime, formatNumber, formatScore } from "@/eco/alt-radar/apps/web/lib/format";
import { DataBadges } from "@/eco/alt-radar/apps/web/components/shared/data-badges";

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
  green: "border-[#d1ff00]/30 bg-[#d1ff00]/10 text-[#d1ff00] shadow-[0_0_12px_rgba(209,255,0,0.12)]",
  blue: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.12)]",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.12)]",
  purple: "border-purple-500/30 bg-purple-500/10 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.12)]",
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
    <article className="panel panel-lift min-h-28 p-3.5 sm:p-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl shadow-xl transition-all duration-200 hover:border-zinc-700/80 hover:bg-zinc-900/60">
      <div className="flex items-start gap-3">
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-xl border ${tones[tone]}`}
        >
          <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[0.68rem] font-mono font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
            <span title={help} className="cursor-help">
              <Info aria-label={help} className="size-3 text-zinc-600 hover:text-zinc-400 transition-colors" />
            </span>
          </div>
          {isLoading ? (
            <div className="skeleton mt-2 h-7 w-20" />
          ) : (
            <p className="mono mt-1 truncate text-[1.4rem] font-black tracking-[-0.04em] text-white">
              {value}
            </p>
          )}
          <p className="mt-1 truncate text-[0.62rem] font-mono font-medium text-zinc-400">
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
      value: formatNumber(metrics?.tokens_monitored ?? (status.isError ? 12480 : null)),
      comparison: "Variação do período: +14.2%",
      help: "Tokens com pelo menos uma leitura persistida no Radar.",
      icon: Binoculars,
      tone: "blue",
    },
    {
      label: "Alertas emitidos hoje",
      value: formatNumber(metrics?.alerts_today ?? (status.isError ? 38 : null)),
      comparison: "Comparação anterior: +8",
      help: "Alertas únicos emitidos desde 00:00 no timezone configurado.",
      icon: BellRing,
      tone: "purple",
    },
    {
      label: "Oportunidades fortes",
      value: formatNumber(metrics?.strong_opportunities ?? (status.isError ? 14 : null)),
      comparison: "Score ≥ 8 sem flag crítica",
      help: "Tokens classificados como oportunidade forte pelas regras da versão ativa.",
      icon: Radar,
      tone: "green",
    },
    {
      label: "Score médio",
      value: metrics?.average_score != null 
        ? `${formatScore(metrics.average_score)}/10`
        : status.isError ? "7.8/10" : "N/D",
      comparison: "Comparação anterior: +0.4",
      help: "Média do score final dos tokens visíveis ao monitoramento.",
      icon: Star,
      tone: "amber",
    },
    {
      label: "Providers ativos",
      value: formatNumber(metrics?.active_providers ?? (status.isError ? 4 : null)),
      comparison: `${status.data?.providers.length ?? 4} configurados`,
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
        : status.isError ? "Agora mesmo" : "N/D",
      comparison: formatDateTime(status.data?.last_sync_at ?? new Date().toISOString()),
      help: "Momento da última ingestão concluída, convertido para o timezone do utilizador.",
      icon: Clock3,
      tone: "blue",
    },
  ];

  return (
    <section aria-labelledby="overview-title" className="rise rise-1">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="eyebrow text-zinc-400">Visão operacional</p>
          <h1 id="overview-title" className="mt-1 text-xl font-mono font-black tracking-tight text-white">
            Radar de oportunidades
          </h1>
        </div>
        <DataBadges demo={status.data?.demo_mode || status.isError} partial={status.data?.status === "degraded"} />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-6">
        {cards.map((card) => (
          <MetricCard key={card.label} {...card} isLoading={status.isLoading} />
        ))}
      </div>
    </section>
  );
}
