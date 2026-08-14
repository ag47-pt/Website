"use client";

import { useState } from "react";
import { useApplyWeightsMutation, useOptimizeWeightsMutation } from "@/lib/api/query";
import type { GridSearchCandidate, GridSearchResponse } from "@/lib/api/schemas";
import { formatNumber, formatPercent } from "@/lib/format";
import {
  FlaskConical,
  Play,
  CheckCircle2,
  Sliders,
  TrendingUp,
  Cpu,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export default function LabPage() {
  const [horizon, setHorizon] = useState<number>(24);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [appliedSuccessMessage, setAppliedSuccessMessage] = useState<string | null>(null);

  const optimizeMutation = useOptimizeWeightsMutation();
  const applyMutation = useApplyWeightsMutation();

  const handleRunOptimization = () => {
    setAppliedSuccessMessage(null);
    optimizeMutation.mutate(horizon);
  };

  const handleApplyWeights = (candidate: GridSearchCandidate) => {
    applyMutation.mutate(candidate.weights, {
      onSuccess: () => {
        setAppliedSuccessMessage(
          `Matriz de pesos aprovada e aplicada com sucesso ao motor de scoring! (Sign-off registrado)`
        );
      },
    });
  };

  const data: GridSearchResponse | undefined = optimizeMutation.data;

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-b from-[#143228] to-[#0a1e22] ring-1 ring-radar-positive/30">
              <FlaskConical className="size-5 text-radar-positive" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-radar-ink">
              Laboratório de Heurísticas
            </h1>
            <span className="ml-2 rounded-full border border-radar-border-strong bg-white/[0.02] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-radar-subtle">
              Grid Search Offline (Sprint 13)
            </span>
          </div>
          <p className="text-sm text-radar-muted">
            Varredura determinística de parâmetros sobre dados históricos da carteira virtual para otimização de Profit Factor e Win Rate.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center rounded-xl border border-radar-border bg-white/[0.02] p-1">
            {[12, 24, 48, 72].map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  horizon === h
                    ? "bg-radar-positive/20 text-radar-positive ring-1 ring-radar-positive/40"
                    : "text-radar-subtle hover:text-radar-ink"
                }`}
              >
                {h}h
              </button>
            ))}
          </div>

          <button
            onClick={handleRunOptimization}
            disabled={optimizeMutation.isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-radar-positive px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#061118] transition-all hover:bg-radar-positive/90 active:scale-95 disabled:opacity-50"
          >
            {optimizeMutation.isPending ? (
              <Cpu className="size-4 animate-spin" />
            ) : (
              <Play className="size-4 fill-current" />
            )}
            {optimizeMutation.isPending ? "Processando..." : "Rodar Grid Search"}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {appliedSuccessMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-radar-positive/30 bg-radar-positive/10 p-4 text-sm text-radar-positive animate-in fade-in duration-300">
          <ShieldCheck className="size-5 shrink-0" />
          <span>{appliedSuccessMessage}</span>
        </div>
      )}

      {/* Loading State */}
      {optimizeMutation.isPending && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-radar-border bg-[#0a151d] p-12 text-center shadow-2xl">
          <div className="relative size-16 mb-4">
            <div className="absolute inset-0 animate-ping rounded-full bg-radar-positive/20" />
            <div className="absolute inset-2 animate-pulse rounded-full bg-radar-positive/40" />
            <Cpu className="absolute inset-0 m-auto size-8 text-radar-positive animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-radar-ink">Executando Varredura de Parâmetros</h3>
          <p className="mt-1 text-sm text-radar-muted max-w-md">
            Simulando combinações de matrizes de peso sobre milhares de observações de score e instantâneos de preço ({horizon}h de horizonte).
          </p>
        </div>
      )}

      {/* Initial Empty State */}
      {!optimizeMutation.isPending && !data && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-radar-border bg-white/[0.01] p-12 text-center">
          <Sliders className="size-12 text-radar-subtle opacity-50 mb-4" />
          <h3 className="text-base font-semibold text-radar-ink">Nenhuma simulação ativa</h3>
          <p className="mt-1 text-sm text-radar-muted max-w-md">
            Clique em <strong>Rodar Grid Search</strong> para acionar a varredura computacional offline e descobrir a combinação de pesos de alta performance.
          </p>
        </div>
      )}

      {/* Results Dashboard */}
      {!optimizeMutation.isPending && data && (
        <div className="flex flex-col gap-8">
          {/* Baseline vs Best Header Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-radar-border bg-white/[0.02] p-5">
              <p className="text-[0.7rem] font-bold uppercase tracking-wider text-radar-subtle">
                Combinações Testadas
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-radar-ink">
                {data.total_combinations_tested}
              </p>
              <p className="mt-1 text-xs text-radar-muted">Matrizes de varredura offline</p>
            </div>

            <div className="rounded-2xl border border-radar-border bg-white/[0.02] p-5">
              <p className="text-[0.7rem] font-bold uppercase tracking-wider text-radar-subtle">
                Profit Factor Atual (Base)
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-radar-muted">
                {formatNumber(data.baseline_profit_factor)}x
              </p>
              <p className="mt-1 text-xs text-radar-muted">Win Rate: {formatPercent(data.baseline_win_rate)}</p>
            </div>

            <div className="rounded-2xl border border-radar-positive/30 bg-radar-positive/5 p-5">
              <p className="text-[0.7rem] font-bold uppercase tracking-wider text-radar-positive">
                Melhor Profit Factor Sugerido
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-radar-positive">
                {formatNumber(data.top_candidates[0]?.profit_factor ?? 0)}x
              </p>
              <p className="mt-1 text-xs font-semibold text-radar-positive flex items-center gap-1">
                <ArrowUpRight className="size-3" />
                +{data.top_candidates[0]?.improvement_vs_base_pct ?? 0}% vs Atual
              </p>
            </div>

            <div className="rounded-2xl border border-radar-border bg-white/[0.02] p-5">
              <p className="text-[0.7rem] font-bold uppercase tracking-wider text-radar-subtle">
                Melhor Taxa de Acerto (Win Rate)
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-radar-ink">
                {formatPercent(data.top_candidates[0]?.win_rate ?? 0)}
              </p>
              <p className="mt-1 text-xs text-radar-muted">
                {data.top_candidates[0]?.samples_evaluated ?? 0} amostras testadas
              </p>
            </div>
          </div>

          {/* Top 3 Candidate Selector */}
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-radar-ink flex items-center gap-2">
              <TrendingUp className="size-4 text-radar-positive" />
              Matrizes de Pesos Recomendadas (Top 3 Performance)
            </h2>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {data.top_candidates.map((candidate, idx) => {
                const isSelected = activeTab === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`cursor-pointer rounded-2xl border p-6 transition-all ${
                      isSelected
                        ? "border-radar-positive bg-radar-positive/5 ring-1 ring-radar-positive/40 shadow-xl"
                        : "border-radar-border bg-white/[0.01] hover:border-radar-border-strong hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-radar-ink">
                        Sugestão #{idx + 1}
                      </span>
                      {idx === 0 && (
                        <span className="rounded-full bg-radar-positive/20 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-radar-positive border border-radar-positive/30">
                          Recomendado
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-baseline justify-between">
                      <div>
                        <p className="text-xs text-radar-muted">Profit Factor</p>
                        <p className="text-2xl font-bold text-radar-ink">
                          {formatNumber(candidate.profit_factor)}x
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-radar-muted">Win Rate</p>
                        <p className="text-2xl font-bold text-radar-positive">
                          {formatPercent(candidate.win_rate)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-white/5 pt-4">
                      <p className="text-xs font-bold text-radar-subtle uppercase tracking-wider mb-2">
                        Distribuição da Matriz
                      </p>
                      <div className="space-y-1.5 text-xs">
                        {Object.entries(candidate.weights).map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center text-radar-muted">
                            <span className="capitalize">{key.replace("_score", "").replace("_", " ")}</span>
                            <span className="font-mono text-radar-ink font-semibold">
                              {(val * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyWeights(candidate);
                      }}
                      disabled={applyMutation.isPending}
                      className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-radar-positive/20 border border-radar-positive/40 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-radar-positive transition-all hover:bg-radar-positive hover:text-[#061118] active:scale-95 disabled:opacity-50"
                    >
                      <CheckCircle2 className="size-4" />
                      Aprovar & Aplicar Matriz
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
