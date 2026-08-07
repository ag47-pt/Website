"use client";

import {
  allStates,
  exceptionStates,
  exceptionTones,
  mainStates,
  type StateTone,
} from "@/data/states";
import { useRovingTabs } from "@/lib/use-roving-tabs";
import { cn } from "@/lib/utils";

const TONE_ACTIVE: Record<StateTone, string> = {
  warn: "border-state-warn/60 bg-state-warn/10 text-state-warn",
  danger: "border-state-danger/60 bg-state-danger/10 text-state-danger",
  info: "border-state-info/60 bg-state-info/10 text-state-info",
  accent: "border-accent-dim bg-accent/10 text-accent-bright",
};

const TONE_DOT: Record<StateTone, string> = {
  warn: "bg-state-warn",
  danger: "bg-state-danger",
  info: "bg-state-info",
  accent: "bg-accent",
};

/**
 * Máquina de estados do protocolo.
 *
 * Os 17 estados vivem em um único `tablist`, agrupado visualmente em fluxo
 * principal e exceções. Os agrupadores levam `role="presentation"` para que a
 * relação tablist → tab permaneça direta, e as setas percorrem os dois grupos
 * em sequência.
 */
export function StateMachine() {
  const { active, handleKeyDown, tabProps, panelProps } = useRovingTabs(allStates.length);
  const state = allStates[active];
  const tone: StateTone | null =
    state.kind === "exception" ? (exceptionTones[state.id] ?? "warn") : null;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Estados do protocolo"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
      >
        <div role="presentation">
          <p className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
            Fluxo principal
          </p>
          <div role="presentation" className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-2">
            {mainStates.map((item, index) => {
              const isActive = index === active;
              const isLast = index === mainStates.length - 1;

              return (
                <div role="presentation" key={item.id} className="flex items-center gap-1">
                  <button
                    type="button"
                    {...tabProps(index, "state")}
                    className={cn(
                      "rounded-lg border px-3 py-2 font-mono text-[11px] transition-colors duration-200",
                      isActive
                        ? "border-accent-dim bg-accent/10 text-accent-bright"
                        : index < active
                          ? "border-hairline-strong bg-surface-2/70 text-fg-muted"
                          : "border-hairline bg-surface/40 text-fg-faint hover:border-hairline-strong hover:text-fg-muted",
                    )}
                  >
                    {item.label}
                  </button>
                  {!isLast ? (
                    <span aria-hidden className="text-fg-faint select-none">
                      ›
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div role="presentation" className="mt-10">
          <p className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
            Estados de exceção
          </p>
          <div role="presentation" className="mt-4 flex flex-wrap gap-2">
            {exceptionStates.map((item, index) => {
              const globalIndex = mainStates.length + index;
              const isActive = globalIndex === active;
              const itemTone = exceptionTones[item.id] ?? "warn";

              return (
                <button
                  key={item.id}
                  type="button"
                  {...tabProps(globalIndex, "state")}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-[11px] transition-colors duration-200",
                    isActive
                      ? TONE_ACTIVE[itemTone]
                      : "border-hairline bg-surface/40 text-fg-faint hover:border-hairline-strong hover:text-fg-muted",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn("size-1.5 rounded-full", TONE_DOT[itemTone])}
                  />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        {...panelProps("state")}
        className="mt-10 rounded-xl border border-hairline bg-surface/50 p-6 sm:p-7"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "rounded-md border px-2.5 py-1 font-mono text-[11px]",
              tone ? TONE_ACTIVE[tone] : "border-accent-dim bg-accent/10 text-accent-bright",
            )}
          >
            {state.label}
          </span>
          <span className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
            {state.kind === "main" ? "Fluxo principal" : "Exceção"}
          </span>
        </div>

        <p className="mt-4 text-base leading-relaxed text-fg">{state.definition}</p>

        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
              Condições de entrada
            </p>
            <ul className="mt-3 space-y-2">
              {state.entry.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-fg-muted">
                  <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-fg-faint" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
              Condições de saída
            </p>
            <ul className="mt-3 space-y-2">
              {state.exit.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-fg-muted">
                  <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid gap-6 border-t border-hairline pt-5 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
              Agentes autorizados
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {state.agents.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-hairline bg-canvas px-2.5 py-1 text-xs text-fg-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
              Evidências obrigatórias
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {state.evidence.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-hairline bg-canvas px-2.5 py-1 font-mono text-[11px] text-fg-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
