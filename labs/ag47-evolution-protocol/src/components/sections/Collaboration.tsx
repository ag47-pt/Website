import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { collaborationCategories } from "@/data/collaboration";
import { cn } from "@/lib/utils";

const TONE_BORDER = {
  accent: "border-accent-dim/40",
  info: "border-state-info/30",
  warn: "border-state-warn/30",
} as const;

const TONE_TEXT = {
  accent: "text-accent",
  info: "text-state-info",
  warn: "text-state-warn",
} as const;

export function Collaboration() {
  return (
    <Section id="colaboracao">
      <SectionHeading
        eyebrow="10 · Colaboração"
        title="Nem toda tarefa pode ser executada por uma IA"
        description="A pergunta que importa não é se a tarefa é difícil, e sim quem consegue executá-la e quem consegue provar que foi feita. Dessa resposta depende se o protocolo segue sozinho ou para."
      />

      <ul className="mt-14 grid gap-5 lg:grid-cols-3">
        {collaborationCategories.map((category, index) => (
          <Reveal
            as="li"
            key={category.id}
            delay={index * 0.07}
            className={cn(
              "flex flex-col rounded-xl border bg-surface/50 p-6",
              TONE_BORDER[category.tone],
            )}
          >
            <span
              className={cn(
                "flex size-10 items-center justify-center rounded-lg border border-hairline-strong bg-canvas",
                TONE_TEXT[category.tone],
              )}
            >
              <Icon name={category.icon} className="size-5" />
            </span>

            <h3 className="mt-4 text-base font-semibold tracking-tight text-fg">
              {category.title}
            </h3>
            <p className={cn("mt-1 font-mono text-[11px]", TONE_TEXT[category.tone])}>
              {category.who}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              {category.description}
            </p>

            <ul className="mt-5 space-y-2 border-t border-hairline pt-4">
              {category.examples.map((example) => (
                <li key={example} className="flex gap-2.5 text-xs text-fg-muted">
                  <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-fg-faint" />
                  {example}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-14 rounded-xl border border-accent-dim/40 bg-accent/5 p-6 sm:p-8">
        <p className="text-balance text-lg leading-relaxed text-fg sm:text-xl">
          O protocolo nunca simula a conclusão de uma tarefa que depende de ação
          humana.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          Um item que depende de pessoa permanece bloqueado, com responsável e forma de
          validação declarados. Bloqueio explícito é informação; conclusão inventada é
          dano.
        </p>
      </Reveal>
    </Section>
  );
}
