import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { architectureColumns } from "@/data/architecture-gap";
import { cn } from "@/lib/utils";

const TONE = {
  neutral: { border: "border-hairline", text: "text-fg-muted" },
  accent: { border: "border-accent-dim/40", text: "text-accent" },
  info: { border: "border-state-info/30", text: "text-state-info" },
} as const;

export function ArchitectureGap() {
  return (
    <Section id="arquitetura">
      <SectionHeading
        eyebrow="13 · Arquitetura"
        title="Realidade e intenção nunca no mesmo documento"
        description="Misturar o que existe com o que se pretende é como a deriva arquitetural começa: em pouco tempo ninguém sabe se o diagrama descreve o sistema ou o desejo. O protocolo mantém os dois separados — e trata a distância entre eles como trabalho."
      />

      <ul className="mt-14 grid gap-5 lg:grid-cols-3">
        {architectureColumns.map((column, index) => (
          <Reveal
            as="li"
            key={column.id}
            delay={index * 0.08}
            className={cn(
              "flex flex-col rounded-xl border bg-surface/50 p-6",
              TONE[column.tone].border,
            )}
          >
            <span
              className={cn(
                "flex size-10 items-center justify-center rounded-lg border border-hairline-strong bg-canvas",
                TONE[column.tone].text,
              )}
            >
              <Icon name={column.icon} className="size-5" />
            </span>

            <h3 className="mt-4 text-base font-semibold tracking-tight text-fg">
              {column.title}
            </h3>
            <p className={cn("mt-1 font-mono text-[11px]", TONE[column.tone].text)}>
              {column.question}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-fg-muted">{column.description}</p>

            <ul className="mt-5 space-y-2">
              {column.contents.map((item) => (
                <li key={item} className="flex gap-2.5 text-xs text-fg-muted">
                  <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-fg-faint" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-5 border-t border-hairline pt-4 font-mono text-[10px] break-all text-fg-faint">
              {column.file}
            </p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
