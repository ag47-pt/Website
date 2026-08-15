import { CheckCircle2, CircleAlert, Sparkles } from "lucide-react";
import type { Score } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { formatClassification, formatScore } from "@/eco/alt-radar/apps/web/lib/format";

const scoreItems: { key: keyof Score; label: string }[] = [
  { key: "momentum_score", label: "Momentum" },
  { key: "liquidity_score", label: "Liquidez" },
  { key: "community_score", label: "Comunidade" },
  { key: "distribution_score", label: "Distribuição" },
  { key: "safety_score", label: "Segurança" },
  { key: "data_quality_score", label: "Qualidade dos dados" },
];

function scoreColor(value: number | null) {
  if (value === null) return "bg-zinc-700";
  if (value >= 8) return "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]";
  if (value >= 6.5) return "bg-cyan-400 shadow-[0_0_8px_rgba(0,217,255,0.4)]";
  if (value >= 5) return "bg-amber-400";
  return "bg-rose-500";
}

function scoreTone(value: number | null) {
  if (value === null) return "text-zinc-500";
  if (value >= 8) return "text-emerald-400";
  if (value >= 6.5) return "text-cyan-300";
  if (value >= 5) return "text-amber-400";
  return "text-rose-400";
}

export function ScoreBreakdown({ score }: { score: Score | null }) {
  if (!score) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 p-4 text-center">
        <p className="text-xs font-bold text-white">Score aguardando sinais</p>
        <p className="mt-1 text-[0.68rem] leading-5 text-zinc-400">
          Dados ausentes não são convertidos em pontuação otimista.
        </p>
      </div>
    );
  }

  const confidence =
    score.confidence === null
      ? null
      : score.confidence <= 1
        ? score.confidence * 100
        : score.confidence;

  return (
    <section
      aria-labelledby="score-breakdown-title"
      className="border-t border-white/10 pt-3.5"
      data-testid="score-breakdown"
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 id="score-breakdown-title" className="text-xs font-bold text-white font-sans">
            Breakdown do Score
          </h3>
          <p className="mt-1 font-mono text-[0.62rem] text-zinc-400">
            {score.signals_available} sinais • confiança{" "}
            {confidence === null ? "N/D" : `${Math.round(confidence)}%`} • {score.scoring_version}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3 py-2 text-right font-mono">
          <p className="text-[0.57rem] font-bold uppercase tracking-wider text-zinc-400">
            Score final
          </p>
          <p className={`mt-0.5 text-2xl font-black ${scoreTone(score.final_score)}`}>
            {formatScore(score.final_score)}
            <span className="text-xs text-zinc-400">/10</span>
          </p>
          <p className="mt-0.5 text-[0.62rem] font-bold text-emerald-400">
            {formatClassification(score.classification)}
          </p>
        </div>
      </div>

      <div className="grid gap-2 xl:grid-cols-2 font-mono">
        {scoreItems.map(({ key, label }) => {
          const value = score[key] as number | null;
          return (
            <div key={key} className="grid grid-cols-[7rem_1fr_2.1rem] items-center gap-2">
              <span className="truncate text-[0.66rem] font-semibold text-zinc-400">
                {label}
              </span>
              <span
                className={`h-1.5 overflow-hidden rounded-full ${value === null ? "border border-dashed border-white/10" : "bg-white/10"}`}
              >
                {value !== null && (
                  <span
                    className={`block h-full rounded-full ${scoreColor(value)}`}
                    style={{ width: `${Math.min(100, Math.max(0, value * 10))}%` }}
                  />
                )}
              </span>
              <span className={`text-right text-[0.65rem] font-bold ${scoreTone(value)}`}>
                {formatScore(value)}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5 font-mono text-[0.68rem] leading-5 text-zinc-300">
        {score.explanation}
      </p>

      <div className="mt-3 grid gap-2 md:grid-cols-2 font-mono">
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[0.63rem] font-bold text-emerald-400">
            <CheckCircle2 className="size-3.5" /> Fatores positivos
          </p>
          {score.positive_factors.length ? (
            <ul className="space-y-1">
              {score.positive_factors.map((factor) => (
                <li key={factor} className="text-[0.63rem] leading-4 text-zinc-400">
                  • {factor}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[0.63rem] text-zinc-500">Nenhum fator confirmado.</p>
          )}
        </div>
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[0.63rem] font-bold text-amber-400">
            <CircleAlert className="size-3.5" /> Fatores negativos
          </p>
          {score.negative_factors.length ? (
            <ul className="space-y-1">
              {score.negative_factors.map((factor) => (
                <li key={factor} className="text-[0.63rem] leading-4 text-zinc-400">
                  • {factor}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[0.63rem] text-zinc-500">Nenhum fator confirmado.</p>
          )}
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1.5 font-mono text-[0.59rem] text-zinc-500">
        <Sparkles className="size-3 text-cyan-400" /> Score analítico, não recomendação de investimento.
      </p>
    </section>
  );
}
