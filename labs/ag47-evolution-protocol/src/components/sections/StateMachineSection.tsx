import { StateMachine } from "@/components/interactive/StateMachine";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function StateMachineSection() {
  return (
    <Section id="maquina-de-estados">
      <SectionHeading
        eyebrow="09 · Máquina de estados"
        title="Todo item de trabalho tem um estado explícito"
        description="Nada avança porque alguém afirmou que avançou. Cada transição exige condições de entrada, agentes autorizados e evidência registrada. Selecione um estado para ver o contrato dele."
      />

      <div className="mt-12">
        <StateMachine />
      </div>
    </Section>
  );
}
