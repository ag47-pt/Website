import { ProtocolStack } from "@/components/diagrams/ProtocolStack";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { GithubMark } from "@/components/ui/GithubMark";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div aria-hidden className="bg-grid mask-fade pointer-events-none absolute inset-0" />

      <Container className="relative">
        <Reveal className="max-w-3xl">
          <Badge tone="accent">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            Protocolo aberto · especificação em construção
          </Badge>

          <h1 className="mt-7 text-balance text-4xl font-semibold tracking-tight text-fg sm:text-5xl lg:text-6xl">
            Um protocolo para evolução contínua de software com Inteligência Artificial.
          </h1>

          <p className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
            Organize agentes, skills, workflows, memória, governança e validação para
            transformar qualquer repositório em um sistema observável, auditável e evolutivo.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="#o-que-e" variant="primary">
              Entender o protocolo
              <Icon name="arrow-right" className="size-4" />
            </ButtonLink>
            <ButtonLink href="#arquitetura" variant="secondary">
              Ver arquitetura
            </ButtonLink>
            <ButtonLink href={site.repoUrl} variant="ghost" external>
              <GithubMark className="size-4" />
              Acessar repositório
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal className="mt-16 sm:mt-20" delay={0.1}>
          <div className="rounded-xl border border-hairline bg-surface/40 p-2 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 px-4 py-2.5">
              <h2 className="font-mono text-[11px] tracking-[0.18em] text-fg-faint uppercase">
                Pilha do protocolo
              </h2>
              <span className="font-mono text-[11px] text-fg-faint">
                intenção → repositório
              </span>
            </div>
            <div className="rounded-lg border border-hairline bg-canvas/60 p-4 sm:p-6">
              <ProtocolStack />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
