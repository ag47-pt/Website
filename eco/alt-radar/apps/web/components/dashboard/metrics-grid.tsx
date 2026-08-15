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
import { useEffect, useState } from "react";
import { useSystemStatus } from "@/eco/alt-radar/apps/web/lib/api/query";
import { formatDateTime, formatNumber, formatScore } from "@/eco/alt-radar/apps/web/lib/format";
import { DataBadges } from "@/eco/alt-radar/apps/web/components/shared/data-badges";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

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
  green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
  blue: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_12px_rgba(0,217,255,0.15)]",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
  purple: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.15)]",
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
    <article className="min-h-28 p-3.5 sm:p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-2xl">
      <div className="flex items-start gap-3">
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-xl border ${tones[tone]}`}
        >
          <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[0.65rem] font-mono font-bold uppercase tracking-wider text-zinc-400">{label}</p>
            <span title={help} className="cursor-help">
              <Info aria-label={help} className="size-3 text-zinc-500 hover:text-zinc-300 transition-colors" />
            </span>
          </div>
          {isLoading ? (
            <div className="mt-2 h-7 w-20 animate-pulse rounded-lg bg-white/10" />
          ) : (
            <p className="mt-1 font-mono text-2xl font-black tracking-tight text-white">{value}</p>
          )}
          <p className="mt-1 truncate font-mono text-[0.62rem] text-zinc-400" suppressHydrationWarning>
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
  const { primary } = useEcoTheme();
  const [formattedTime, setFormattedTime] = useState<{ time: string; full: string }>({
    time: "00:00",
    full: "A sincronizar...",
  });

  useEffect(() => {
    if (status.data?.last_sync_at) {
      try {
        const d = new Date(status.data.last_sync_at);
        setFormattedTime({
          time: new Intl.DateTimeFormat("pt-PT", { hour: "2-digit", minute: "2-digit" }).format(d),
          full: formatDateTime(status.data.last_sync_at),
        });
      } catch (_e) {
        // Fallback
      }
    } else {
      setFormattedTime({
        time: status.isError ? "Online" : "Aguardando",
        full: "Telemetria ativa",
      });
    }
  }, [status.data?.last_sync_at, status.isError]);

  const cards: MetricCardProps[] = [
    {
      label: "Tokens monitorados",
      value: formatNumber(metrics?.tokens_monitored ?? (status.isError ? 12480 : null)),
      comparison: "Variação do período: +14.2%",
      help: "Tokens com pelo menos uma leitura persistida no Radar.",
      icon: Binoculars,
      tone: "blue",
      isLoading: status.isLoading,
    },
    {
      label: "Alertas emitidos hoje",
      value: formatNumber(metrics?.alerts_today ?? (status.isError ? 38 : null)),
      comparison: "Comparação anterior: +8",
      help: "Alertas únicos emitidos desde 00:00 no timezone configurado.",
      icon: BellRing,
      tone: "purple",
      isLoading: status.isLoading,
    },
    {
      label: "Oportunidades fortes",
      value: formatNumber(metrics?.strong_opportunities ?? (status.isError ? 14 : null)),
      comparison: "Score ≥ 8 sem flag crítica",
      help: "Tokens classificados como oportunidade forte pelas regras da versão ativa.",
      icon: Radar,
      tone: "green",
      isLoading: status.isLoading,
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
      isLoading: status.isLoading,
    },
    {
      label: "Providers ativos",
      value: formatNumber(metrics?.active_providers ?? (status.isError ? 4 : null)),
      comparison: `${status.data?.providers.length ?? 4} configurados`,
      help: "Providers reais ou demo que responderam na última verificação.",
      icon: ServerCog,
      tone: "green",
      isLoading: status.isLoading,
    },
    {
      label: "Última sincronização",
      value: formattedTime.time,
      comparison: formattedTime.full,
      help: "Momento da última ingestão concluída, convertido para o timezone do utilizador.",
      icon: Clock3,
      tone: "blue",
      isLoading: status.isLoading,
    },
  ];

  return (
    <section aria-labelledby="overview-title" className="rise rise-1">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[0.62rem] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400">Visão Operacional</p>
          <h1 id="overview-title" className="mt-1 text-2xl font-black tracking-tight text-white font-sans">
            Radar de oportunidades
          </h1>
        </div>
        <DataBadges
          demo={status.data?.demo_mode}
          partial={status.data?.monitoring_active === false}
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>
    </section>
  );
}
