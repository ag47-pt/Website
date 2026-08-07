import { CodeBlock } from "@/components/ui/CodeBlock";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { confidenceLevels, evidenceExample, truthKinds } from "@/data/evidence";

export function Evidence() {
  return (
    <Section id="evidencia">
      <SectionHeading
        eyebrow="14 · Evidência"
        title="Nada é concluído porque um relatório afirma que está"
        description="Toda afirmação relevante carrega os artefatos que a sustentam e um grau de confiança. Sem evidência, a afirmação não é falsa — ela simplesmente não conta."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
        {/* min-w-0 pelo mesmo motivo da §11: o item de grid não encolhe abaixo
            do conteúdo, e as linhas longas do JSON vazariam a página. */}
        <Reveal className="min-w-0">
          <CodeBlock
            code={evidenceExample}
            filename=".evolution/evidence/claim-0142.json"
            language="json"
          />
          <p className="mt-5 text-sm leading-relaxed text-fg-muted">
            A afirmação aponta para arquivos que qualquer pessoa pode abrir e conferir. É
            o que permite auditar uma decisão meses depois, sem depender de quem estava
            presente.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
            Escala de confiança
          </p>
          <ul className="mt-4 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline">
            {confidenceLevels.map((level) => (
              <li
                key={level.label}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 bg-surface/60 px-4 py-3.5"
              >
                <span className="font-mono text-xs text-accent">{level.range}</span>
                <span className="text-sm font-medium text-fg">{level.label}</span>
                <span className="w-full text-xs text-fg-muted">{level.detail}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal className="mt-20">
        <h3 className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
          Três verdades que não são a mesma coisa
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted">
          Confundi-las é a origem da maior parte dos incidentes: o documento diz uma
          coisa, o código faz outra, e a produção revela uma terceira.
        </p>
      </Reveal>

      <ul className="mt-8 grid gap-5 lg:grid-cols-3">
        {truthKinds.map((truth, index) => (
          <Reveal
            as="li"
            key={truth.id}
            delay={index * 0.07}
            className="flex flex-col rounded-xl border border-hairline bg-surface/50 p-6"
          >
            <h4 className="text-base font-semibold tracking-tight text-fg">{truth.title}</h4>
            <p className="mt-1 font-mono text-[11px] text-accent">{truth.question}</p>

            <p className="mt-4 text-xs leading-relaxed text-fg-muted">
              <span className="text-fg-faint">Fonte: </span>
              {truth.source}
            </p>

            <p className="mt-4 border-t border-hairline pt-4 text-sm leading-relaxed text-fg-muted">
              {truth.failure}
            </p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
