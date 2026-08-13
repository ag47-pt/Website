"use client";

import { Icon } from "@/components/ui/Icon";
import { pipeline } from "@/data/pipeline";
import { useRovingTabs } from "@/lib/use-roving-tabs";
import { cn } from "@/lib/utils";

/**
 * Explorador do ciclo evolutivo.
 * Comportamento de teclado e ARIA vêm de `useRovingTabs`.
 */
export function PipelineExplorer() {
  const { active, handleKeyDown, tabProps, panelProps } = useRovingTabs(pipeline.length);
  const stage = pipeline[active];

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-8">
      <div
        role="tablist"
        aria-label="Etapas do ciclo evolutivo"
        aria-orientation="vertical"
        onKeyDown={handleKeyDown}
      >
        {pipeline.map((item, index) => {
          const isActive = index === active;
          const isLast = index === pipeline.length - 1;

          return (
            <div key={item.id} className="relative">
              {!isLast ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-[38px] left-[24px] h-[calc(100%-26px)] w-px transition-colors duration-300",
                    index < active || isActive ? "bg-accent-dim" : "bg-hairline-strong",
                  )}
                />
              ) : null}

              <button
                type="button"
                {...tabProps(index, "pipeline")}
                className={cn(
                  "relative flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors duration-200",
                  isActive
                    ? "border-accent-dim bg-surface-2"
                    : "border-transparent hover:border-hairline hover:bg-surface/60",
                )}
              >
                <span
                  className={cn(
                    "flex size-[26px] shrink-0 items-center justify-center rounded-md border transition-colors duration-200",
                    isActive
                      ? "border-accent-dim bg-canvas text-accent"
                      : "border-hairline-strong bg-canvas text-fg-faint",
                  )}
                >
                  <Icon name={item.icon} className="size-[14px]" />
                </span>

                <span
                  className={cn(
                    "min-w-0 flex-1 text-sm transition-colors",
                    isActive ? "font-medium text-fg" : "text-fg-muted",
                  )}
                >
                  {item.label}
                </span>

                <span aria-hidden className="font-mono text-[10px] text-fg-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div
        {...panelProps("pipeline")}
        className="rounded-xl border border-hairline bg-surface/50 p-6 sm:p-7"
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
            Etapa {String(active + 1).padStart(2, "0")}
          </span>
          <span aria-hidden className="h-px flex-1 bg-hairline" />
        </div>

        <p className="mt-4 text-xl font-semibold tracking-tight text-fg">{stage.label}</p>
        <p className="mt-3 text-base leading-relaxed text-fg-muted">{stage.objective}</p>

        <div className="mt-6 rounded-lg border border-accent-dim/40 bg-accent/5 px-4 py-3.5">
          <p className="font-mono text-[10px] tracking-[0.18em] text-accent uppercase">
            Autoridade
          </p>
          <p className="mt-1.5 text-sm text-fg">{stage.authority}</p>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
              Entradas
            </p>
            <ul className="mt-3 space-y-2">
              {stage.inputs.map((input) => (
                <li key={input} className="flex gap-2.5 text-sm text-fg-muted">
                  <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-fg-faint" />
                  {input}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
              Saídas
            </p>
            <ul className="mt-3 space-y-2">
              {stage.outputs.map((output) => (
                <li key={output} className="flex gap-2.5 text-sm text-fg-muted">
                  <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                  {output}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-hairline pt-5">
          <p className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
            Limitações
          </p>
          <ul className="mt-3 space-y-2">
            {stage.limits.map((limit) => (
              <li key={limit} className="flex gap-2.5 text-sm text-fg-muted">
                <span aria-hidden className="mt-2 h-px w-2.5 shrink-0 bg-fg-faint" />
                {limit}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 border-t border-hairline pt-5">
          <p className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
            Artefatos produzidos
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {stage.artifacts.map((artifact) => (
              <li
                key={artifact}
                className="rounded-md border border-hairline bg-canvas px-2.5 py-1.5 font-mono text-[11px] text-fg-muted"
              >
                {artifact}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
