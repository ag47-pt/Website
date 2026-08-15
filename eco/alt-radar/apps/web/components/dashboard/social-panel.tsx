"use client";

import dynamic from "next/dynamic";
import { Bot, MessageCircle, Radio, UsersRound } from "lucide-react";
import { useSocial } from "@/eco/alt-radar/apps/web/lib/api/query";
import { formatNumber, formatPercent, formatRatio, getErrorMessage } from "@/eco/alt-radar/apps/web/lib/format";
import { DataBadges } from "@/eco/alt-radar/apps/web/components/shared/data-badges";
import { EmptyState, ErrorState, PanelSkeleton } from "@/eco/alt-radar/apps/web/components/shared/query-state";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

const SocialChart = dynamic(() => import("./social-chart").then((module) => module.SocialChart), {
  ssr: false,
  loading: () => <div className="h-24 w-full animate-pulse rounded-xl bg-white/5" />,
});

interface SocialMetricProps {
  label: string;
  value: string;
  tone?: "positive" | "warning" | "critical" | "neutral";
}

function SocialMetric({ label, value, tone = "neutral" }: SocialMetricProps) {
  const toneClass = {
    positive: "text-emerald-400",
    warning: "text-amber-400",
    critical: "text-rose-400",
    neutral: "text-white",
  }[tone];
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-white/5 last:border-0 font-mono">
      <dt className="text-[0.68rem] text-zinc-400">{label}</dt>
      <dd className={`text-[0.72rem] font-bold ${toneClass}`}>{value}</dd>
    </div>
  );
}

export function SocialPanel({
  tokenId,
  compact = false,
}: {
  tokenId: string | null;
  compact?: boolean;
}) {
  const social = useSocial(tokenId);
  const { primary } = useEcoTheme();

  if (tokenId === null)
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-xl">
        <EmptyState
          title="Selecione um token"
          message="As métricas sociais serão contextualizadas aqui."
        />
      </div>
    );
  if (social.isLoading) return <PanelSkeleton rows={compact ? 4 : 8} />;
  if (social.isError)
    return (
      <ErrorState message={getErrorMessage(social.error)} retry={() => void social.refetch()} />
    );
  if (!social.data?.latest) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-xl">
        <EmptyState
          title="Sem sinais sociais"
          message="Nenhum provider autorizado entregou dados para este token."
        />
      </div>
    );
  }

  const latest = social.data.latest;
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-3.5 shadow-xl" aria-labelledby={`social-title-${tokenId}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[0.62rem] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400">Comunidade</p>
          <h2
            id={`social-title-${tokenId}`}
            className="mt-1 flex items-center gap-2 text-sm font-bold text-white font-sans"
          >
            <UsersRound className="size-4" style={{ color: primary }} /> Social / Telegram
          </h2>
        </div>
        <Radio className="size-4 animate-pulse" style={{ color: primary }} aria-label="Série temporal disponível" />
      </div>

      <div className="mt-3">
        <DataBadges demo={social.data.demo_mode || latest.is_demo} />
      </div>
      {(social.data.demo_mode || latest.is_demo) && (
        <p className="mt-2 rounded-xl border border-amber-500/30 bg-amber-950/40 px-2.5 py-2 font-mono text-[0.6rem] leading-4 text-amber-300">
          Provider de demonstração. Estes valores são simulados e não representam atividade real no
          Telegram.
        </p>
      )}

      {/* Hype Velocity Gauge */}
      {latest.messages_per_minute !== null && (
        <div className="mt-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 font-mono text-[0.62rem]">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-bold flex items-center gap-1">
              ⚡ Hype Velocity:
            </span>
            <span
              className={`font-bold ${
                latest.messages_per_minute >= 30
                  ? "text-emerald-400"
                  : latest.messages_per_minute >= 15
                    ? "text-amber-400"
                    : "text-zinc-400"
              }`}
            >
              {latest.messages_per_minute >= 30
                ? "🚀 Frenesi Viral"
                : latest.messages_per_minute >= 15
                  ? "⚡ Expansão Ativa"
                  : "💤 Atividade Normal"}
            </span>
          </div>

          <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              style={{
                width: `${Math.min(100, (latest.messages_per_minute / 45) * 100)}%`,
              }}
              className={`h-full rounded-full transition-all ${
                latest.messages_per_minute >= 30
                  ? "bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                  : "bg-cyan-400"
              }`}
            />
          </div>
          <div className="mt-1 flex justify-between text-[0.55rem] text-zinc-500">
            <span>0 msg/min</span>
            <span>{latest.messages_per_minute} msg/min</span>
            <span>45+ pico</span>
          </div>
        </div>
      )}

      <dl className="mt-2 divide-y divide-white/5 font-mono">
        <SocialMetric label="Membros" value={formatNumber(latest.members)} />
        <SocialMetric
          label="Crescimento 1h"
          value={formatPercent(latest.member_growth_1h, true)}
          tone={
            latest.member_growth_1h !== null && latest.member_growth_1h > 0 ? "positive" : "neutral"
          }
        />
        {!compact && (
          <SocialMetric
            label="Crescimento 24h"
            value={formatPercent(latest.member_growth_24h, true)}
            tone={
              latest.member_growth_24h !== null && latest.member_growth_24h > 0
                ? "positive"
                : "neutral"
            }
          />
        )}
        <SocialMetric label="Mensagens/min" value={formatNumber(latest.messages_per_minute)} />
        {!compact && (
          <SocialMetric label="Autores únicos" value={formatNumber(latest.unique_authors)} />
        )}
        {!compact && (
          <SocialMetric
            label="Taxa de participação"
            value={formatRatio(latest.participation_rate)}
          />
        )}
        <SocialMetric
          label="Engajamento estimado"
          value={formatRatio(latest.engagement_rate)}
          tone="positive"
        />
        <SocialMetric
          label="Repetição de mensagens"
          value={formatRatio(latest.repetition_rate)}
          tone={
            latest.repetition_rate !== null && latest.repetition_rate >= 0.5 ? "warning" : "neutral"
          }
        />
        <SocialMetric
          label="Probabilidade de bots"
          value={formatRatio(latest.estimated_bot_ratio)}
          tone={
            latest.estimated_bot_ratio !== null && latest.estimated_bot_ratio >= 0.35
              ? "critical"
              : "warning"
          }
        />
        {!compact && (
          <SocialMetric
            label="Atividade da equipa"
            value={latest.team_activity ?? "Desconhecido"}
          />
        )}
      </dl>

      <div className="mt-2 border-t border-white/10 pt-2 font-mono">
        <div className="mb-1 flex items-center gap-1.5 text-[0.59rem] font-bold text-zinc-400">
          <MessageCircle className="size-3 text-cyan-400" /> Mensagens por minuto
        </div>
        <SocialChart social={social.data} />
      </div>

      <p className="mt-1 flex items-center gap-1 font-mono text-[0.58rem] text-zinc-500">
        <Bot className="size-3" /> Fonte: {latest.source} • qualidade {latest.data_quality ?? "N/D"}
      </p>
    </section>
  );
}
