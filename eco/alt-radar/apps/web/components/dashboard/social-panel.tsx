"use client";

import dynamic from "next/dynamic";
import { Bot, MessageCircle, Radio, UsersRound } from "lucide-react";
import { useSocial } from "@/eco/alt-radar/apps/web/lib/api/query";
import { formatNumber, formatPercent, formatRatio, getErrorMessage } from "@/eco/alt-radar/apps/web/lib/format";
import { DataBadges } from "@/eco/alt-radar/apps/web/components/shared/data-badges";
import { EmptyState, ErrorState, PanelSkeleton } from "@/eco/alt-radar/apps/web/components/shared/query-state";

const SocialChart = dynamic(() => import("./social-chart").then((module) => module.SocialChart), {
  ssr: false,
  loading: () => <div className="skeleton h-24 w-full" />,
});

interface SocialMetricProps {
  label: string;
  value: string;
  tone?: "positive" | "warning" | "critical" | "neutral";
}

function SocialMetric({ label, value, tone = "neutral" }: SocialMetricProps) {
  const toneClass = {
    positive: "text-[#d1ff00]",
    warning: "text-amber-400",
    critical: "text-rose-400",
    neutral: "text-white",
  }[tone];
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-zinc-800/50 last:border-0 font-mono">
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

  if (tokenId === null)
    return (
      <EmptyState
        title="Selecione um token"
        message="As métricas sociais serão contextualizadas aqui."
      />
    );
  if (social.isLoading) return <PanelSkeleton rows={compact ? 4 : 8} />;
  if (social.isError)
    return (
      <ErrorState message={getErrorMessage(social.error)} retry={() => void social.refetch()} />
    );
  if (!social.data?.latest) {
    return (
      <EmptyState
        title="Sem sinais sociais"
        message="Nenhum provider autorizado entregou dados para este token."
      />
    );
  }

  const latest = social.data.latest;
  return (
    <section className="p-3.5" aria-labelledby={`social-title-${tokenId}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="eyebrow">Comunidade</p>
          <h2
            id={`social-title-${tokenId}`}
            className="mt-1 flex items-center gap-2 text-sm font-extrabold"
          >
            <UsersRound className="size-4 text-radar-neutral" /> Social / Telegram
          </h2>
        </div>
        <Radio className="size-4 text-radar-positive" aria-label="Série temporal disponível" />
      </div>

      <div className="mt-3">
        <DataBadges demo={social.data.demo_mode || latest.is_demo} />
      </div>
      {(social.data.demo_mode || latest.is_demo) && (
        <p className="mt-2 rounded-lg border border-radar-warning/20 bg-[#2c220d]/65 px-2.5 py-2 text-[0.6rem] leading-4 text-radar-warning">
          Provider de demonstração. Estes valores são simulados e não representam atividade real no
          Telegram.
        </p>
      )}

      <dl className="mt-2 divide-y divide-radar-border/60">
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

      <div className="mt-2 border-t border-radar-border pt-2">
        <div className="mb-1 flex items-center gap-1.5 text-[0.59rem] font-bold text-radar-subtle">
          <MessageCircle className="size-3" /> Mensagens por minuto
        </div>
        <SocialChart social={social.data} />
      </div>

      <p className="mt-1 flex items-center gap-1 text-[0.58rem] text-radar-subtle">
        <Bot className="size-3" /> Fonte: {latest.source} • qualidade {latest.data_quality ?? "N/D"}
      </p>
    </section>
  );
}
