import { AuthoritySeparation } from "@/components/diagrams/AuthoritySeparation";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { roles } from "@/data/roles";

export function Roles() {
  return (
    <Section id="papeis">
      <SectionHeading
        eyebrow="06 · Papéis"
        title="Seis papéis, seis autoridades distintas"
        description="Papel não é personalidade nem estilo de prompt: é um recorte de autoridade. O que define cada um não é apenas o que ele faz, mas o que lhe é proibido fazer."
      />

      <ul className="mt-14 grid gap-4 lg:grid-cols-2">
        {roles.map((role, index) => (
          <Reveal
            as="li"
            key={role.id}
            delay={Math.min(index * 0.05, 0.3)}
            className="flex flex-col rounded-xl border border-hairline bg-surface/50 p-6"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-hairline-strong bg-canvas text-accent">
                <Icon name={role.icon} className="size-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold tracking-tight text-fg">
                  {role.name}
                </h3>
                <p className="mt-0.5 text-xs text-fg-faint">{role.mission}</p>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-accent-dim/40 bg-accent/5 px-4 py-3">
              <p className="font-mono text-[10px] tracking-[0.18em] text-accent uppercase">
                Autoridade
              </p>
              <p className="mt-1.5 text-sm text-fg">{role.authority}</p>
            </div>

            <div className="mt-5">
              <p className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
                Responsabilidades
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {role.responsibilities.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-hairline bg-canvas px-2.5 py-1 text-xs text-fg-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 border-t border-hairline pt-4">
              <p className="font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
                Limites
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {role.prohibitions.map((item) => (
                  <li key={item} className="flex gap-2.5 text-xs text-fg-muted">
                    <span aria-hidden className="mt-1.5 h-px w-2.5 shrink-0 bg-fg-faint" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-20">
        <h3 className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
          Separação de autoridade
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted">
          Cada papel detém exatamente uma capacidade primária. É essa exclusividade
          que impede o padrão mais comum do desenvolvimento agêntico: o mesmo agente
          propor, executar e declarar sucesso.
        </p>
      </Reveal>

      <div className="mt-8">
        <AuthoritySeparation />
      </div>
    </Section>
  );
}
