"use client";

import { useTimeline } from "@/lib/api/query";
import { formatDateTime, getErrorMessage } from "@/lib/format";
import { EmptyState, ErrorState, PanelSkeleton } from "@/components/shared/query-state";
import { Activity, Zap } from "lucide-react";

export function TokenTimeline({ tokenId }: { tokenId: string | null }) {
  const timeline = useTimeline(tokenId);

  if (tokenId === null) return null;

  return (
    <section className="mt-3" aria-labelledby={`timeline-title-${tokenId}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 id={`timeline-title-${tokenId}`} className="text-xs font-extrabold">
            Timeline de Eventos e Sinais
          </h3>
          <p className="mt-0.5 text-[0.59rem] text-radar-subtle">
            Histórico auditável do motor, baseado nos deltas observados.
          </p>
        </div>
      </div>

      <div className="mt-2">
        {timeline.isLoading ? (
          <PanelSkeleton rows={4} />
        ) : timeline.isError ? (
          <ErrorState
            message={getErrorMessage(timeline.error)}
            retry={() => void timeline.refetch()}
          />
        ) : timeline.data?.items.length ? (
          <div className="relative space-y-3 before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-white/[0.045]">
            {timeline.data.items.map((item) => (
              <div key={item.id} className="relative flex gap-3">
                <div className="relative z-10 grid size-6 shrink-0 place-items-center rounded-full border border-white/5 bg-[#0a1824]">
                  {item.kind === "signal" ? (
                    <Zap className="size-3 text-radar-positive" />
                  ) : (
                    <Activity className="size-3 text-radar-subtle" />
                  )}
                </div>
                <div className="flex-1 rounded-lg border border-white/[0.045] bg-black/10 px-3 py-2">
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="text-[0.68rem] font-bold text-radar-ink">{item.title}</p>
                    <time className="mono text-[0.55rem] text-radar-subtle">
                      {formatDateTime(item.occurred_at)}
                    </time>
                  </div>
                  <p className="mt-1 text-[0.61rem] text-radar-muted">{item.description}</p>

                  {item.kind === "signal" && (
                    <div className="mt-2 flex gap-3 text-[0.55rem]">
                      <span className="font-bold text-radar-subtle">
                        Força:{" "}
                        <span className="text-radar-ink">{(item.strength * 100).toFixed(0)}%</span>
                      </span>
                      <span className="font-bold text-radar-subtle">
                        Confiança:{" "}
                        <span className="text-radar-ink">
                          {(item.confidence * 100).toFixed(0)}%
                        </span>
                      </span>
                    </div>
                  )}
                  {item.kind === "event" &&
                    item.severity !== null &&
                    item.severity !== undefined && (
                      <div className="mt-2 text-[0.55rem]">
                        <span className="font-bold text-radar-subtle">
                          Severidade:{" "}
                          <span className="text-radar-ink">
                            {(item.severity * 100).toFixed(0)}%
                          </span>
                        </span>
                      </div>
                    )}

                  <div className="mt-2 flex items-center gap-1.5 border-t border-white/[0.045] pt-1.5 text-[0.52rem] text-radar-subtle/50">
                    <span>{item.type}</span>
                    <span>•</span>
                    <span>{item.rule_version}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Nenhum evento registrado" />
        )}
      </div>
    </section>
  );
}
