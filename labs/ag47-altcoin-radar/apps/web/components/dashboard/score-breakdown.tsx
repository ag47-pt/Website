import { CheckCircle2, CircleAlert, Sparkles } from "lucide-react";
import type { Score } from "@/lib/api/schemas";
import { formatClassification, formatScore } from "@/lib/format";

const scoreItems: { key: keyof Score; label: string }[] = [
  { key: "momentum_score", label: "Momentum" },
  { key: "liquidity_score", label: "Liquidez" },
  { key: "community_score", label: "Comunidade" },
  { key: "distribution_score", label: "Distribuição" },
  { key: "safety_score", label: "Segurança" },
  { key: "data_quality_score", label: "Qualidade dos dados" },
];

function scoreColor(value: number | null) {
  if (value === null) return "bg-radar-subtle";
  if (value >= 8) return "bg-radar-positive";
  if (value >= 6.5) return "bg-[#91cf58]";
  if (value >= 5) return "bg-radar-warning";
  return "bg-radar-critical";
}

function scoreTone(value: number | null) {
  if (value === null) return "text-radar-muted";
  if (value >= 8) return "text-radar-positive";
  if (value >= 5) return "text-radar-warning";
  return "text-radar-critical";
}

export function ScoreBreakdown({ score }: { score: Score | null }) {
  if (!score) {
    return (
      <div className="rounded-xl border border-dashed border-radar-border p-4 text-center">
        <p className="text-xs font-bold text-radar-ink">Score aguardando sinais</p>
        <p className="mt-1 text-[0.68rem] leading-5 text-radar-muted">
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
      className="border-t border-radar-border pt-3.5"
      data-testid="score-breakdown"
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 id="score-breakdown-title" className="text-xs font-extrabold text-radar-ink">
            Breakdown do score
          </h3>
          <p className="mt-1 text-[0.62rem] text-radar-subtle">
            {score.signals_available} sinais • confiança{" "}
            {confidence === null ? "N/D" : `${Math.round(confidence)}%`} • {score.scoring_version}
          </p>
        </div>
        <div className="rounded-lg border border-radar-positive/35 bg-[#0d251b] px-3 py-2 text-right">
          <p className="text-[0.57rem] font-bold uppercase tracking-wider text-radar-muted">
            Score final
          </p>
          <p className={`mono mt-0.5 text-2xl font-extrabold ${scoreTone(score.final_score)}`}>
            {formatScore(score.final_score)}
            <span className="text-xs text-radar-muted">/10</span>
          </p>
          <p className="mt-0.5 text-[0.62rem] font-extrabold text-radar-positive">
            {formatClassification(score.classification)}
          </p>
        </div>
      </div>

      <div className="grid gap-2 xl:grid-cols-2">
        {scoreItems.map(({ key, label }) => {
          const value = score[key] as number | null;
          return (
            <div key={key} className="grid grid-cols-[7rem_1fr_2.1rem] items-center gap-2">
              <span className="truncate text-[0.66rem] font-semibold text-radar-muted">
                {label}
              </span>
              <span
                className={`h-1.5 overflow-hidden rounded-full ${value === null ? "border border-dashed border-radar-border" : "bg-[#1a2c37]"}`}
              >
                {value !== null && (
                  <span
                    className={`block h-full rounded-full ${scoreColor(value)}`}
                    style={{ width: `${Math.min(100, Math.max(0, value * 10))}%` }}
                  />
                )}
              </span>
              <span className={`mono text-right text-[0.65rem] font-bold ${scoreTone(value)}`}>
                {formatScore(value)}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 rounded-lg border border-white/[0.045] bg-black/10 px-3 py-2.5 text-[0.68rem] leading-5 text-radar-muted">
        {score.explanation}
      </p>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[0.63rem] font-extrabold text-radar-positive">
            <CheckCircle2 className="size-3.5" /> Fatores positivos
          </p>
          {score.positive_factors.length ? (
            <ul className="space-y-1">
              {score.positive_factors.map((factor) => (
                <li key={factor} className="text-[0.63rem] leading-4 text-radar-muted">
                  • {factor}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[0.63rem] text-radar-subtle">Nenhum fator confirmado.</p>
          )}
        </div>
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[0.63rem] font-extrabold text-radar-warning">
            <CircleAlert className="size-3.5" /> Fatores negativos
          </p>
          {score.negative_factors.length ? (
            <ul className="space-y-1">
              {score.negative_factors.map((factor) => (
                <li key={factor} className="text-[0.63rem] leading-4 text-radar-muted">
                  • {factor}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[0.63rem] text-radar-subtle">Nenhum fator confirmado.</p>
          )}
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-[0.59rem] text-radar-subtle">
        <Sparkles className="size-3" /> Score analítico, não recomendação de investimento.
      </p>
    </section>
  );
}
