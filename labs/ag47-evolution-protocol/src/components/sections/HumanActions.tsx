import { HumanActionFlow } from "@/components/diagrams/HumanActionFlow";
import { Badge } from "@/components/ui/Badge";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  humanActionExample,
  humanActions,
  type HumanActionStatus,
} from "@/data/human-actions";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<HumanActionStatus, string> = {
  PENDING: "border-state-warn/40 text-state-warn",
  BLOCKED: "border-state-danger/40 text-state-danger",
  RESOLVED: "border-accent-dim text-accent-bright",
};

const stats = [
  { label: "Pendentes", value: humanActions.filter((a) => a.status === "PENDING").length },
  { label: "Críticas", value: humanActions.filter((a) => a.priority === "HIGH").length },
  { label: "Resolvidas", value: humanActions.filter((a) => a.status === "RESOLVED").length },
  {
    label: "Bloqueios de produção",
    value: humanActions.filter((a) => a.status === "BLOCKED").length,
  },
];

export function HumanActions() {
  return (
    <Section id="human-actions">
      <SectionHeading
        eyebrow="11 · Human Action Registry"
        title="O que depende de pessoa vira item rastreável"
        description="Toda dependência humana recebe identificador, responsável, o que ela bloqueia e como será validada. Nenhuma delas entra na memória permanente sem passar pelo Validador."
      />

      <div className="mt-14">
        <HumanActionFlow />
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8">
        {/* min-w-0: itens de grid nascem com `min-width: auto` e se recusam a
            encolher abaixo do conteúdo. Sem isto, a tabela de 560px vaza a
            largura para fora da página mesmo dentro do container rolável. */}
        <Reveal className="min-w-0">
          <div className="rounded-xl border border-hairline bg-surface/40 p-2">
            <div className="flex items-center justify-between gap-3 px-4 py-2.5">
              <h3 className="font-mono text-[11px] tracking-[0.18em] text-fg-faint uppercase">
                Painel de ações humanas
              </h3>
              <Badge tone="neutral">ilustrativo</Badge>
            </div>

            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-hairline sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-canvas/70 px-4 py-3.5">
                  <p className="font-mono text-2xl text-fg">{stat.value}</p>
                  <p className="mt-1 text-[11px] leading-tight text-fg-faint">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-2 overflow-x-auto rounded-lg">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <caption className="sr-only">
                  Exemplo de registro de ações humanas, com status e forma de validação
                </caption>
                <thead>
                  <tr className="border-b border-hairline">
                    {["Id", "Ação", "Status", "Bloqueia", "Como validar"].map((head) => (
                      <th
                        key={head}
                        scope="col"
                        className="px-4 py-3 font-mono text-[10px] tracking-[0.14em] text-fg-faint uppercase"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {humanActions.map((action) => (
                    <tr key={action.id} className="border-b border-hairline last:border-b-0">
                      <td className="px-4 py-3 font-mono text-[11px] whitespace-nowrap text-fg-faint">
                        {action.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-fg">{action.title}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-block rounded-md border px-2 py-0.5 font-mono text-[10px] whitespace-nowrap",
                            STATUS_STYLE[action.status],
                          )}
                        >
                          {action.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-fg-muted">
                        {action.blocks}
                      </td>
                      <td className="px-4 py-3 text-xs text-fg-muted">{action.validation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:pt-12">
          <CodeBlock
            code={humanActionExample}
            filename=".evolution/human-actions/HA-014.yaml"
            language="yaml"
          />
          <p className="mt-5 text-sm leading-relaxed text-fg-muted">
            O campo <span className="font-mono text-fg">como_validar</span> é o que
            separa um lembrete de um item de protocolo: ele define, antes de a ação
            acontecer, qual verificação servirá de prova. Sem ele, a resolução dependeria
            da palavra de alguém.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
