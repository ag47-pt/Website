"use client";

import { AlertOctagon, AlertTriangle, HelpCircle, Info, ShieldCheck } from "lucide-react";
import { useRisk } from "@/lib/api/query";
import type { Risk } from "@/lib/api/schemas";
import { formatNumber, formatPercent, getErrorMessage } from "@/lib/format";
import { DataBadges } from "@/components/shared/data-badges";
import { EmptyState, ErrorState, PanelSkeleton } from "@/components/shared/query-state";

type SignalLevel = "informative" | "attention" | "high" | "critical" | "unknown";

interface RiskSignal {
  label: string;
  value: string;
  level: SignalLevel;
}

const levelConfig: Record<SignalLevel, { label: string; icon: typeof Info; className: string }> = {
  informative: { label: "Informativo", icon: ShieldCheck, className: "text-radar-positive" },
  attention: { label: "Atenção", icon: AlertTriangle, className: "text-radar-warning" },
  high: { label: "Alto risco", icon: AlertTriangle, className: "text-[#ff8a67]" },
  critical: { label: "Crítico", icon: AlertOctagon, className: "text-radar-critical" },
  unknown: { label: "Desconhecido", icon: HelpCircle, className: "text-radar-subtle" },
};

function booleanSignal(label: string, value: boolean | null, positiveWhenFalse = true): RiskSignal {
  if (value === null) return { label, value: "Desconhecido", level: "unknown" };
  if (positiveWhenFalse) {
    return { label, value: value ? "Sim" : "Não", level: value ? "high" : "informative" };
  }
  return { label, value: value ? "Sim" : "Não", level: value ? "informative" : "attention" };
}

function getRiskSignals(risk: Risk): RiskSignal[] {
  const lock = risk.liquidity_lock_status?.toLowerCase() ?? null;
  const lockLevel: SignalLevel =
    lock === null || lock.includes("unknown")
      ? "unknown"
      : lock.includes("unlocked") || lock.includes("desbloq")
        ? "high"
        : lock.includes("partial") || lock.includes("parcial")
          ? "attention"
          : "informative";

  return [
    { label: "Liquidez", value: risk.liquidity_lock_status ?? "Desconhecido", level: lockLevel },
    {
      label: "Top holders",
      value: formatPercent(risk.top_holders_percentage),
      level:
        risk.top_holders_percentage === null
          ? "unknown"
          : risk.top_holders_percentage >= 50
            ? "high"
            : risk.top_holders_percentage >= 25
              ? "attention"
              : "informative",
    },
    {
      label: "Concentração do deployer",
      value: formatPercent(risk.deployer_percentage),
      level:
        risk.deployer_percentage === null
          ? "unknown"
          : risk.deployer_percentage >= 20
            ? "high"
            : risk.deployer_percentage >= 8
              ? "attention"
              : "informative",
    },
    {
      label: "Permissões do owner",
      value: risk.owner_privileges ?? "Desconhecido",
      level:
        risk.owner_privileges === null
          ? "unknown"
          : risk.owner_privileges.toLowerCase().includes("renoun")
            ? "informative"
            : "attention",
    },
    booleanSignal("Possibilidade de mint", risk.mintable),
    booleanSignal("Possibilidade de blacklist", risk.blacklist_capability),
    booleanSignal("Alteração de taxas", risk.can_change_tax),
    {
      label: "Taxa de compra",
      value: formatPercent(risk.buy_tax),
      level:
        risk.buy_tax === null
          ? "unknown"
          : risk.buy_tax > 10
            ? "high"
            : risk.buy_tax > 5
              ? "attention"
              : "informative",
    },
    {
      label: "Taxa de venda",
      value: formatPercent(risk.sell_tax),
      level:
        risk.sell_tax === null
          ? "unknown"
          : risk.sell_tax > 10
            ? "high"
            : risk.sell_tax > 5
              ? "attention"
              : "informative",
    },
    booleanSignal("Contrato atualizável / proxy", risk.proxy_contract),
    {
      label: "Idade do contrato",
      value:
        risk.contract_age_days === null
          ? "Desconhecido"
          : `${formatNumber(risk.contract_age_days)} dias`,
      level:
        risk.contract_age_days === null
          ? "unknown"
          : risk.contract_age_days < 7
            ? "attention"
            : "informative",
    },
    {
      label: "Honeypot",
      value: risk.honeypot_status ?? "Desconhecido",
      level:
        risk.honeypot_status === null
          ? "unknown"
          : ["not_honeypot", "safe", "passed", "false"].includes(risk.honeypot_status.toLowerCase())
            ? "informative"
            : risk.honeypot_status.toLowerCase().includes("honeypot")
              ? "critical"
              : "attention",
    },
  ];
}

function riskLabel(value: number | null) {
  if (value === null) return "Risco desconhecido";
  if (value >= 8) return "Risco crítico";
  if (value >= 6) return "Risco alto";
  if (value >= 4) return "Atenção";
  return "Risco reduzido";
}

export function RiskPanel({
  tokenId,
  compact = false,
}: {
  tokenId: string | null;
  compact?: boolean;
}) {
  const risk = useRisk(tokenId);

  if (tokenId === null)
    return (
      <EmptyState
        title="Selecione um token"
        message="Os sinais de risco surgirão aqui sem assumir que dados ausentes são seguros."
      />
    );
  if (risk.isLoading) return <PanelSkeleton rows={compact ? 4 : 8} />;
  if (risk.isError)
    return <ErrorState message={getErrorMessage(risk.error)} retry={() => void risk.refetch()} />;
  if (!risk.data)
    return (
      <EmptyState
        title="Sem avaliação de risco"
        message="A ausência desta leitura não representa segurança."
      />
    );

  const signals = getRiskSignals(risk.data);
  const visibleSignals = compact ? signals.slice(0, 5) : signals;

  return (
    <section className="p-3.5" aria-labelledby={`risk-title-${tokenId}`} data-testid="risk-panel">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="eyebrow">Contrato e distribuição</p>
          <h2
            id={`risk-title-${tokenId}`}
            className="mt-1 flex items-center gap-2 text-sm font-extrabold"
          >
            <AlertOctagon className="size-4 text-radar-critical" /> Sinais de risco
          </h2>
        </div>
        <div className="rounded-md border border-radar-critical/25 bg-[#32171c] px-2 py-1 text-right">
          <p className="mono text-xs font-extrabold text-radar-critical">
            {`${risk.data.risk_score.toFixed(1)}/10`}
          </p>
          <p className="text-[0.53rem] font-bold uppercase text-radar-muted">
            {riskLabel(risk.data.risk_score)}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <DataBadges demo={risk.data.is_demo} />
      </div>

      {risk.data.critical_flags.length > 0 && (
        <div
          className="mt-3 rounded-lg border border-radar-critical/35 bg-[#32171c] p-2.5"
          role="alert"
        >
          {risk.data.critical_flags.map((flag) => (
            <p key={flag} className="text-[0.65rem] font-bold leading-4 text-radar-critical">
              {flag}
            </p>
          ))}
        </div>
      )}

      <dl className="mt-3 divide-y divide-radar-border/70">
        {visibleSignals.map((signal) => {
          const config = levelConfig[signal.level];
          const Icon = config.icon;
          return (
            <div key={signal.label} className="grid grid-cols-[1fr_auto] items-center gap-2 py-2">
              <dt className="flex min-w-0 items-center gap-2 text-[0.65rem] text-radar-muted">
                <Icon
                  aria-label={config.label}
                  className={`size-3.5 shrink-0 ${config.className}`}
                />
                <span className="truncate">{signal.label}</span>
              </dt>
              <dd className="max-w-36 text-right" title={`${signal.value} • ${config.label}`}>
                <span className={`block truncate text-[0.62rem] font-bold ${config.className}`}>
                  {signal.value}
                </span>
                <span
                  className={`block text-[0.5rem] font-extrabold uppercase tracking-wide ${config.className}`}
                >
                  {config.label}
                </span>
              </dd>
            </div>
          );
        })}
      </dl>

      {!compact && risk.data.flags.length > 0 && (
        <div className="mt-3 border-t border-radar-border pt-3">
          <p className="eyebrow">Flags do provider</p>
          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {risk.data.flags.map((flag) => {
              const mappedLevel: SignalLevel =
                flag.level === "critico"
                  ? "critical"
                  : flag.level === "alto_risco"
                    ? "high"
                    : flag.level === "atencao"
                      ? "attention"
                      : flag.level === "informativo"
                        ? "informative"
                        : "unknown";
              return (
                <div
                  key={flag.code}
                  className="rounded-lg border border-radar-border bg-black/10 p-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[0.63rem] font-bold text-radar-ink">{flag.label}</p>
                    <span
                      className={`text-[0.5rem] font-extrabold uppercase ${levelConfig[mappedLevel].className}`}
                    >
                      {levelConfig[mappedLevel].label}
                    </span>
                  </div>
                  {flag.description && (
                    <p className="mt-1 text-[0.58rem] leading-4 text-radar-subtle">
                      {flag.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-3 border-t border-radar-border pt-2 text-[0.59rem] leading-4 text-radar-subtle">
        Fonte: {risk.data.source} • qualidade {risk.data.data_quality ?? "N/D"}
        {risk.data.is_demo && " • leitura simulada, não verificação on-chain"}
      </div>
    </section>
  );
}
