import { PipelineExplorer } from "@/components/interactive/PipelineExplorer";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function HowItWorks() {
  return (
    <Section id="como-funciona">
      <SectionHeading
        eyebrow="05 · Ciclo evolutivo"
        title="Como funciona"
        description="Dez etapas, cada uma com autoridade própria e limites explícitos. Selecione uma etapa para ver o que ela recebe, o que produz, o que pode decidir e o que lhe é proibido."
      />

      <div className="mt-12">
        <PipelineExplorer />
      </div>
    </Section>
  );
}
