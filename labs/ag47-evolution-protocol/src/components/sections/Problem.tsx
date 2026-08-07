import { ProblemComparison } from "@/components/diagrams/ProblemComparison";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { problems } from "@/data/problems";

export function Problem() {
  return (
    <Section id="problema">
      <SectionHeading
        eyebrow="01 · Problema"
        title="Agentes escrevem código. Poucos preservam inteligência."
        description="Em um ciclo curto, um agente competente resolve quase tudo. O problema aparece no mês seguinte: o que foi decidido não sobreviveu, a documentação descreve outro sistema e ninguém consegue provar o que de fato funciona."
      />

      <ul className="mt-14 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
        {problems.map((problem, index) => (
          <Reveal
            as="li"
            key={problem.id}
            delay={Math.min(index * 0.03, 0.24)}
            className="bg-surface/60 p-6"
          >
            <span aria-hidden className="font-mono text-[11px] text-fg-faint">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-sm font-semibold tracking-tight text-fg">
              {problem.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">{problem.detail}</p>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-20">
        <h3 className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
          Dois formatos de ciclo
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted">
          A diferença não está na qualidade do código gerado em cada passo. Está em
          o que sobra ao final da volta.
        </p>
      </Reveal>

      <div className="mt-10">
        <ProblemComparison />
      </div>
    </Section>
  );
}
