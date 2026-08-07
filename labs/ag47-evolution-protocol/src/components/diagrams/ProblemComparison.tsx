import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { legacyFlow, protocolFlow, type FlowStep } from "@/data/problems";
import { cn } from "@/lib/utils";

/**
 * Contraste entre o laço aberto do desenvolvimento agêntico comum e o ciclo
 * fechado do protocolo.
 *
 * Server Component: a revelação progressiva vem do `Reveal` com atraso
 * indexado, sem precisar de um container de stagger no cliente.
 */
function Flow({
  steps,
  tone,
  baseDelay,
}: {
  steps: FlowStep[];
  tone: "legacy" | "protocol";
  baseDelay: number;
}) {
  return (
    <ol className="mt-6">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const degraded = step.degraded === true;

        return (
          <Reveal as="li" key={step.label} delay={baseDelay + index * 0.07} className="relative">
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3",
                degraded
                  ? "border-state-warn/35 bg-state-warn/5"
                  : tone === "protocol"
                    ? "border-hairline-strong bg-surface-2/70"
                    : "border-hairline bg-surface/50",
              )}
            >
              {degraded ? (
                <Icon name="warning" className="size-4 shrink-0 text-state-warn" />
              ) : (
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    tone === "protocol" ? "bg-accent" : "bg-fg-faint",
                  )}
                />
              )}
              <span
                className={cn(
                  "text-sm",
                  degraded ? "text-state-warn" : "text-fg",
                )}
              >
                {step.label}
              </span>
            </div>

            {!isLast ? (
              <span
                aria-hidden
                className={cn(
                  "mx-auto block h-3 w-px",
                  tone === "protocol" ? "bg-accent-dim" : "bg-hairline-strong",
                )}
              />
            ) : null}
          </Reveal>
        );
      })}
    </ol>
  );
}

export function ProblemComparison() {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      <Reveal className="rounded-xl border border-hairline bg-surface/30 p-6">
        <h3 className="text-sm font-semibold tracking-tight text-fg">
          Desenvolvimento agêntico comum
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          Um laço aberto. Cada iteração adiciona código e remove contexto.
        </p>

        <Flow steps={legacyFlow} tone="legacy" baseDelay={0.05} />

        <p className="mt-6 border-t border-hairline pt-4 font-mono text-[11px] leading-relaxed text-fg-faint">
          Não há estado, não há evidência e não há ponto de retorno. O custo aparece
          depois, distribuído.
        </p>
      </Reveal>

      <Reveal
        delay={0.1}
        className="rounded-xl border border-accent-dim/40 bg-surface-2/40 p-6"
      >
        <h3 className="text-sm font-semibold tracking-tight text-fg">
          AG47 Evolution Protocol
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          Um ciclo fechado. Cada iteração termina consolidando o que ficou provado.
        </p>

        <Flow steps={protocolFlow} tone="protocol" baseDelay={0.12} />

        <div className="mt-4 flex items-center gap-2 rounded-lg border border-accent-dim/40 bg-accent/5 px-4 py-3">
          <Icon name="evolution" className="size-4 shrink-0 text-accent" />
          <span className="text-xs text-accent-bright">
            O ciclo reinicia com o contexto preservado
          </span>
        </div>

        <p className="mt-6 border-t border-hairline pt-4 font-mono text-[11px] leading-relaxed text-fg-faint">
          Estado persistido, evidência exigida e rollback conhecido a cada volta.
        </p>
      </Reveal>
    </div>
  );
}
