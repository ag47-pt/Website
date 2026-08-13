import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gateRunExample, gateRunVerdict, gates, type GateStatus } from "@/data/gates";
import { cn } from "@/lib/utils";

const STATUS: Record<GateStatus, { label: string; className: string; icon: "check" | "warning" | "close" }> = {
  passed: { label: "passou", className: "text-accent", icon: "check" },
  failed: { label: "falhou", className: "text-state-danger", icon: "warning" },
  skipped: { label: "não executado", className: "text-fg-faint", icon: "close" },
};

const groups = [...new Set(gates.map((gate) => gate.group))];

export function Gates() {
  return (
    <Section id="gates">
      <SectionHeading
        eyebrow="15 · Gates"
        title="Verificações que não dependem de interpretação"
        description="Um gate determinístico devolve um código de saída, não uma opinião. É o único tipo de prova que o protocolo aceita para permitir uma transição de estado."
      />

      <div className="mt-14 space-y-8">
        {groups.map((group, groupIndex) => (
          <Reveal key={group} delay={groupIndex * 0.05}>
            <p className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
              {group}
            </p>
            <ul className="mt-3 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
              {gates
                .filter((gate) => gate.group === group)
                .map((gate) => (
                  <li key={gate.id} className="bg-surface/60 px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-fg">{gate.label}</p>
                      {gate.blocking ? (
                        <span className="shrink-0 font-mono text-[9px] tracking-wider text-accent uppercase">
                          bloqueante
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">
                      {gate.description}
                    </p>
                  </li>
                ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16">
        <div className="rounded-xl border border-hairline bg-surface/40 p-2">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5">
            <h3 className="font-mono text-[11px] tracking-[0.18em] text-fg-faint uppercase">
              Execução de gates
            </h3>
            <Badge tone="neutral">ilustrativo</Badge>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-lg bg-hairline">
            {gateRunExample.map((run) => {
              const status = STATUS[run.status];

              return (
                <li
                  key={run.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 bg-canvas/70 px-4 py-3"
                >
                  <Icon name={status.icon} className={cn("size-4 shrink-0", status.className)} />
                  <span className="min-w-[180px] flex-1 text-sm text-fg">{run.label}</span>
                  <span className={cn("font-mono text-[11px]", status.className)}>
                    {status.label}
                  </span>
                  <span className="min-w-[190px] flex-1 text-xs text-fg-muted">
                    {run.detail}
                  </span>
                  <span className="font-mono text-[11px] text-fg-faint">{run.duration}</span>
                </li>
              );
            })}
          </ul>

          <div className="mt-2 flex flex-wrap items-center gap-3 rounded-lg border border-state-danger/40 bg-state-danger/5 px-4 py-3.5">
            <span className="rounded-md border border-state-danger/50 px-2 py-0.5 font-mono text-[11px] text-state-danger">
              {gateRunVerdict.state}
            </span>
            <p className="min-w-[240px] flex-1 text-sm text-fg-muted">
              {gateRunVerdict.message}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
