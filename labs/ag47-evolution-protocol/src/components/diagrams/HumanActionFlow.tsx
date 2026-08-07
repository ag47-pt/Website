import { Reveal } from "@/components/ui/Reveal";
import { humanActionFlow } from "@/data/human-actions";

/** Caminho de uma dependência humana até a memória permanente. */
export function HumanActionFlow() {
  return (
    <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {humanActionFlow.map((step, index) => (
        <Reveal
          as="li"
          key={step.actor}
          delay={index * 0.07}
          className="relative flex flex-col rounded-xl border border-hairline bg-surface/50 p-5"
        >
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="flex size-6 items-center justify-center rounded-md border border-accent-dim bg-canvas font-mono text-[10px] text-accent"
            >
              {index + 1}
            </span>
            <span className="font-mono text-[10px] tracking-[0.14em] text-fg-faint uppercase">
              {step.actor}
            </span>
          </div>

          <p className="mt-4 text-sm font-medium text-fg">{step.action}</p>
          <p className="mt-2 text-xs leading-relaxed text-fg-muted">{step.detail}</p>
        </Reveal>
      ))}
    </ol>
  );
}
