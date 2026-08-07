import { WorkflowTabs } from "@/components/interactive/WorkflowTabs";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Workflows() {
  return (
    <Section id="workflows">
      <SectionHeading
        eyebrow="08 · Workflows"
        title="Cinco workflows declarativos"
        description="Workflows não são scripts: são declarações de ordem, papel e condição de avanço. Ficam em YAML versionado, ao lado do código, e podem ser revisados como qualquer outra mudança."
      />

      <div className="mt-12">
        <WorkflowTabs />
      </div>
    </Section>
  );
}
