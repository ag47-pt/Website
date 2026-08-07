"use client";

import { CodeBlock } from "@/components/ui/CodeBlock";
import { Icon } from "@/components/ui/Icon";
import { workflows } from "@/data/workflows";
import { useRovingTabs } from "@/lib/use-roving-tabs";
import { cn } from "@/lib/utils";

export function WorkflowTabs() {
  const { active, handleKeyDown, tabProps, panelProps } = useRovingTabs(workflows.length);
  const workflow = workflows[active];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Workflows do protocolo"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className="flex flex-wrap gap-2"
      >
        {workflows.map((item, index) => {
          const isActive = index === active;

          return (
            <button
              key={item.id}
              type="button"
              {...tabProps(index, "workflow")}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm transition-colors duration-200",
                isActive
                  ? "border-accent-dim bg-surface-2 text-fg"
                  : "border-hairline bg-surface/40 text-fg-muted hover:border-hairline-strong hover:text-fg",
              )}
            >
              <Icon
                name={item.icon}
                className={cn("size-4", isActive ? "text-accent" : "text-fg-faint")}
              />
              {item.name}
            </button>
          );
        })}
      </div>

      <div {...panelProps("workflow")} className="mt-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8">
          <div className="rounded-xl border border-hairline bg-surface/50 p-6">
            <p className="text-lg font-semibold tracking-tight text-fg">
              {workflow.purpose}
            </p>

            <div className="mt-5 rounded-lg border border-hairline bg-canvas/60 px-4 py-3">
              <p className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
                Quando é acionado
              </p>
              <p className="mt-1.5 text-sm text-fg-muted">{workflow.when}</p>
            </div>

            <div className="mt-6">
              <p className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
                Sequência
              </p>
              <ol className="mt-3 space-y-3">
                {workflow.steps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm text-fg-muted">
                    <span
                      aria-hidden
                      className="mt-px flex size-5 shrink-0 items-center justify-center rounded border border-hairline-strong font-mono text-[10px] text-fg-faint"
                    >
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <CodeBlock
            code={workflow.yaml}
            filename={workflow.filename}
            language="yaml"
            className="self-start"
          />
        </div>
      </div>
    </div>
  );
}
