import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const DISTRIBUTION = [
  { label: "Papéis", detail: "quem pode decidir o quê" },
  { label: "Políticas", detail: "o que nunca pode acontecer" },
  { label: "Workflows", detail: "em que ordem as coisas ocorrem" },
  { label: "Estados", detail: "onde cada item está agora" },
  { label: "Schemas", detail: "que formato um artefato precisa ter" },
  { label: "Evidências", detail: "o que prova cada afirmação" },
  { label: "Memória persistente", detail: "o que já foi aprendido" },
  { label: "Limites operacionais", detail: "até onde a autonomia vai" },
];

export function Hypothesis() {
  return (
    <Section id="hipotese">
      <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
            02 · Hipótese
          </p>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            A IA não precisa apenas de melhores modelos. Ela precisa de um protocolo
            de engenharia.
          </h2>
          <div className="mt-7 space-y-5 text-base leading-relaxed text-fg-muted">
            <p>
              A resposta usual para as falhas de ciclos longos é aumentar o contexto:
              prompts maiores, instruções mais detalhadas, mais regras em um único
              bloco de texto. Isso trata o sintoma. A inteligência continua presa em
              um lugar que não sobrevive à próxima sessão.
            </p>
            <p>
              A hipótese do protocolo é outra:{" "}
              <span className="text-fg">
                a inteligência que importa não deve viver no prompt
              </span>
              . Ela deve estar distribuída em estruturas que existem fora do modelo,
              são legíveis por humanos e verificáveis por máquina.
            </p>
            <p>
              Um modelo melhor executa melhor cada etapa. Só um protocolo garante que
              a etapa certa aconteça, na ordem certa, com a autoridade certa e com
              prova do resultado.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:pt-16">
          <div className="rounded-xl border border-hairline bg-surface/40 p-2">
            <p className="px-4 py-3 font-mono text-[11px] tracking-[0.18em] text-fg-faint uppercase">
              Onde a inteligência deve viver
            </p>
            <ul className="grid gap-px overflow-hidden rounded-lg bg-hairline">
              {DISTRIBUTION.map((item) => (
                <li
                  key={item.label}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1 bg-canvas/70 px-4 py-3.5"
                >
                  <span className="text-sm font-medium text-fg">{item.label}</span>
                  <span className="font-mono text-xs text-fg-faint">{item.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
