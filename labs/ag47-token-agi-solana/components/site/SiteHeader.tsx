"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { hero, nav } from "@/lib/content";
import { cn } from "@/lib/cn";
import { CtaButton } from "@/components/ui/CtaButton";
import { Logo } from "./Logo";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-[var(--agi-line)] bg-[rgba(3,3,9,0.72)] backdrop-blur-2xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-[var(--agi-header-height)] w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[0.82rem] text-[var(--agi-muted)] transition-colors duration-300 hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <CtaButton href={hero.primaryCta.href} className="hidden px-5 py-2.5 text-[0.8rem] sm:inline-flex">
            {hero.primaryCta.label}
          </CtaButton>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--agi-line-strong)] bg-white/[0.03] lg:hidden"
          >
            {menuOpen ? (
              <X aria-hidden className="h-4 w-4" />
            ) : (
              <Menu aria-hidden className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          aria-label="Mobile"
          className="border-t border-[var(--agi-line)] bg-[rgba(3,3,9,0.94)] backdrop-blur-2xl lg:hidden"
        >
          <ul className="mx-auto flex w-full max-w-6xl flex-col px-5 py-2 sm:px-8">
            {nav.map((item) => (
              <li key={item.href} className="border-b border-[var(--agi-line)] last:border-0">
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3.5 text-sm text-[var(--agi-muted)] transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
