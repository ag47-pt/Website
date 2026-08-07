import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { bootstrapDoes, bootstrapDoesNot, bootstrapSteps } from "@/data/bootstrap";

export function Bootstrap() {
  return (
    <Section id="bootstrap">
      <SectionHeading
        eyebrow="12 · Bootstrap"
        title="Como o protocolo entra em um projeto que não conhece"
        description="Treze passos de leitura antes de qualquer escrita. O bootstrap não melhora nada — ele apenas estabelece o que é verdade hoje, e admite o que não conseguiu determinar."
      />

      <ol className="mt-14 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-3">
        {bootstrapSteps.map((step, index) => (
          <Reveal
            as="li"
            key={step.label}
            delay={Math.min(index * 0.03, 0.24)}
            className="bg-surface/60 p-5"
          >
            <span
              aria-hidden
              className="font-mono text-[11px] text-accent"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-2.5 text-sm font-medium text-fg">{step.label}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">{step.detail}</p>
          </Reveal>
        ))}
      </ol>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <Reveal className="rounded-xl border border-accent-dim/40 bg-accent/5 p-6">
          <p className="font-mono text-[10px] tracking-[0.18em] text-accent uppercase">
            O que o bootstrap faz
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {bootstrapDoes.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 rounded-md border border-accent-dim/40 bg-canvas px-2.5 py-1.5 text-xs text-fg"
              >
                <Icon name="check" className="size-3.5 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.08} className="rounded-xl border border-hairline bg-surface/50 p-6">
          <p className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
            O que ele não faz
          </p>
          <ul className="mt-4 space-y-2.5">
            {bootstrapDoesNot.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm text-fg-muted">
                <span aria-hidden className="mt-2 h-px w-2.5 shrink-0 bg-fg-faint" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
