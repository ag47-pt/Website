"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { GithubMark } from "@/components/ui/GithubMark";
import { ProtocolMark } from "@/components/ui/ProtocolMark";
import { headerNav } from "@/data/navigation";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const MOBILE_MENU_ID = "menu-mobile";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Reduz o header após o primeiro deslocamento.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape fecha o menu e trava o scroll do body enquanto ele está aberto.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[height,background-color,border-color] duration-300 ease-out",
        scrolled || menuOpen
          ? "h-14 border-hairline bg-canvas/85 backdrop-blur-md"
          : "h-20 border-transparent",
      )}
    >
      <Container className="flex h-full items-center justify-between gap-4">
        <a
          href="#topo"
          className="flex shrink-0 items-center gap-2.5 rounded-md text-sm"
          onClick={() => setMenuOpen(false)}
        >
          <ProtocolMark
            className={cn("text-accent transition-all duration-300", scrolled ? "size-5" : "size-6")}
          />
          <span className="whitespace-nowrap">
            <span className="font-semibold tracking-tight text-fg">AG47</span>{" "}
            <span className="hidden text-fg-muted sm:inline">Evolution Protocol</span>
          </span>
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-4 xl:flex">
          {headerNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md py-1.5 text-[13px] whitespace-nowrap text-fg-muted transition-colors hover:text-fg"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <a
            href={site.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Repositório do ${site.name} no GitHub`}
            className="rounded-md p-2 text-fg-muted transition-colors hover:text-fg"
          >
            <GithubMark className="size-[18px]" />
          </a>

          <ButtonLink
            href="#o-que-e"
            variant="primary"
            className="hidden py-2 text-[13px] sm:inline-flex"
          >
            Explorar o protocolo
          </ButtonLink>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls={MOBILE_MENU_ID}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            className="rounded-md p-2 text-fg-muted transition-colors hover:text-fg xl:hidden"
          >
            {menuOpen ? (
              <X aria-hidden className="size-5" strokeWidth={1.5} />
            ) : (
              <Menu aria-hidden className="size-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </Container>

      {menuOpen ? (
        <div
          id={MOBILE_MENU_ID}
          className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-hairline bg-canvas/95 backdrop-blur-md xl:hidden"
        >
          <Container>
            <nav aria-label="Navegação móvel" className="flex flex-col py-3">
              {headerNav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md border-b border-hairline py-3.5 text-sm text-fg-muted transition-colors last:border-b-0 hover:text-fg"
                >
                  {item.label}
                </a>
              ))}
              <ButtonLink
                href="#o-que-e"
                variant="primary"
                className="mt-4 mb-2 sm:hidden"
              >
                Explorar o protocolo
              </ButtonLink>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
