import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { attributes, negations } from "@/data/protocol-identity";

export function WhatItIs() {
  return (
    <Section id="o-que-e">
      <SectionHeading
        eyebrow="03 · Definição"
        title="O que é o AG47 Evolution Protocol"
        description="Um protocolo que define como diferentes inteligências e ferramentas colaboram para compreender, construir, validar e preservar software. Ele não substitui os agentes — organiza a autoridade entre eles."
      />

      <Reveal className="mt-12">
        <p className="font-mono text-[11px] tracking-[0.18em] text-fg-faint uppercase">
          Antes de tudo, o que ele não é
        </p>
        <ul className="mt-4 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {negations.map((negation) => (
            <li key={negation.label} className="bg-surface/50 px-5 py-4">
              <p className="text-sm text-fg">
                <span aria-hidden className="mr-2 text-fg-faint">
                  ✕
                </span>
                Não é apenas {negation.label}
              </p>
              <p className="mt-1.5 pl-5 text-xs leading-relaxed text-fg-faint">
                {negation.detail}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-16 rounded-xl border border-accent-dim/40 bg-accent/5 p-6 sm:p-8">
        <p className="text-balance text-lg leading-relaxed text-fg sm:text-xl">
          A próxima geração da engenharia de software não será definida apenas por
          modelos de IA mais inteligentes, mas por protocolos capazes de organizar
          como essas inteligências colaboram entre si, com o código e com seres
          humanos.
        </p>
      </Reveal>

      <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {attributes.map((attribute, index) => (
          <Reveal
            as="li"
            key={attribute.id}
            delay={Math.min(index * 0.04, 0.28)}
            className="rounded-xl border border-hairline bg-surface/50 p-5 transition-colors duration-200 hover:border-hairline-strong"
          >
            <span className="flex size-9 items-center justify-center rounded-lg border border-hairline-strong bg-canvas text-accent">
              <Icon name={attribute.icon} className="size-[18px]" />
            </span>
            <h3 className="mt-4 text-sm font-semibold tracking-tight text-fg">
              {attribute.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              {attribute.description}
            </p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
