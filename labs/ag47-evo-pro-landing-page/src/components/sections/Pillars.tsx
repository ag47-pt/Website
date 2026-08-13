import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pillars } from "@/data/pillars";

export function Pillars() {
  return (
    <Section id="pilares">
      <SectionHeading
        eyebrow="04 · Pilares"
        title="Oito pilares sustentam o protocolo"
        description="Cada pilar responde por uma falha específica do desenvolvimento agêntico em ciclos longos. Nenhum deles funciona isolado: retirar um derruba as garantias dos outros."
      />

      <ul className="mt-14 grid gap-4 md:grid-cols-2">
        {pillars.map((pillar, index) => (
          <Reveal
            as="li"
            key={pillar.id}
            delay={Math.min(index * 0.05, 0.3)}
            className="group flex flex-col rounded-xl border border-hairline bg-surface/50 p-6 transition-colors duration-200 hover:border-hairline-strong"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-hairline-strong bg-canvas text-accent">
                <Icon name={pillar.icon} className="size-5" />
              </span>
              <h3 className="text-base font-semibold tracking-tight text-fg">
                {pillar.title}
              </h3>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              {pillar.description}
            </p>

            <div className="mt-5 border-t border-hairline pt-4">
              <p className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
                Na prática
              </p>
              <p className="mt-2 text-xs leading-relaxed text-fg-faint">
                {pillar.example}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
