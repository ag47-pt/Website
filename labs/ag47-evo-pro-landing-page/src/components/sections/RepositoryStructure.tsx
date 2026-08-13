import { RepositoryExplorer } from "@/components/interactive/RepositoryExplorer";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function RepositoryStructure() {
  return (
    <Section id="estrutura">
      <SectionHeading
        eyebrow="16 · Estrutura"
        title="Tudo vive em arquivos versionados"
        description="Estado, políticas, evidências e memória ficam no repositório, em formato legível e revisável. Não há banco de dados oculto nem serviço externo guardando o que o projeto sabe sobre si mesmo."
      />

      {/* Aviso de honestidade: a §16 desta mesma página exige evidência para
          qualquer afirmação. Apresentar a estrutura como existente seria
          exatamente o comportamento que o protocolo condena. */}
      <Reveal className="mt-10 flex flex-wrap items-start gap-3 rounded-xl border border-state-warn/30 bg-state-warn/5 px-5 py-4">
        <Icon name="warning" className="mt-0.5 size-4 shrink-0 text-state-warn" />
        <p className="min-w-[260px] flex-1 text-sm leading-relaxed text-fg-muted">
          <span className="text-state-warn">Especificação, não estado atual.</span>{" "}
          As árvores abaixo descrevem a estrutura projetada do protocolo, que está em
          construção pública. Elas ainda não são o retrato de um repositório publicado —
          e afirmá-lo aqui contradiria o princípio de evidência descrito nesta mesma
          página.
        </p>
      </Reveal>

      <div className="mt-10">
        <RepositoryExplorer />
      </div>
    </Section>
  );
}
