import { SkillExplorer } from "@/components/interactive/SkillExplorer";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skillAnatomy, skillExamples } from "@/data/skills";

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        eyebrow="07 · Skills"
        title="Skills são capacidades, não agentes"
        description="Uma skill não decide o que fazer — ela sabe fazer uma coisa bem, com entrada declarada, saída estruturada e teste próprio. Qualquer papel autorizado pode invocá-la."
      />

      <ul className="mt-12 flex flex-wrap gap-2">
        {skillExamples.map((skill, index) => (
          <Reveal
            as="li"
            key={skill.label}
            delay={Math.min(index * 0.025, 0.2)}
            className="flex items-center gap-2 rounded-lg border border-hairline bg-surface/50 px-3 py-2"
          >
            <Icon name={skill.icon} className="size-4 shrink-0 text-accent" />
            <span className="text-sm text-fg-muted">{skill.label}</span>
          </Reveal>
        ))}
      </ul>

      <div className="mt-16">
        <SkillExplorer />
      </div>

      <Reveal className="mt-16">
        <h3 className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
          O que torna uma skill confiável
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted">
          Nove elementos separam uma capacidade auditável de um trecho de prompt
          reaproveitado.
        </p>
      </Reveal>

      <ul className="mt-8 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
        {skillAnatomy.map((item, index) => (
          <Reveal
            as="li"
            key={item.label}
            delay={Math.min(index * 0.03, 0.2)}
            className="bg-surface/60 px-5 py-4"
          >
            <p className="text-sm font-medium text-fg">{item.label}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">{item.detail}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
