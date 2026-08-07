import { Container } from "@/components/ui/Container";
import { GithubMark } from "@/components/ui/GithubMark";
import { ProtocolMark } from "@/components/ui/ProtocolMark";
import { footerNav } from "@/data/navigation";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface/40">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <ProtocolMark className="size-6 text-accent" />
              <span className="text-sm">
                <span className="font-semibold tracking-tight text-fg">AG47</span>{" "}
                <span className="text-fg-muted">Evolution Protocol</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              Um protocolo aberto para evolução contínua de software — independente de IDE,
              de modelo e de linguagem.
            </p>
            <a
              href={site.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex items-center gap-2 rounded-md py-1 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              <GithubMark className="size-4" />
              Acompanhar no GitHub
            </a>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="font-mono text-[11px] tracking-[0.18em] text-fg-faint uppercase">
                {group.title}
              </h2>
              {/* py-1 leva o alvo de toque a 26px de altura — SC 2.5.8 do WCAG 2.2
                  pede no mínimo 24px, e o texto sozinho ficava em 18px. */}
              <ul className="mt-3 space-y-1">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      {...(item.external
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                      className="inline-block rounded-md py-1 text-sm text-fg-muted transition-colors hover:text-fg"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-hairline pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-fg-faint">
            AG47 Evolution Protocol — especificação em construção pública.
          </p>
          <p className="font-mono text-xs text-fg-faint">Agência 47 · Labs</p>
        </div>
      </Container>
    </footer>
  );
}
