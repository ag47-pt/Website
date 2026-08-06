import { ArrowRight, BookOpen } from "lucide-react";
import { hero, site } from "@/lib/content";
import { CtaButton } from "@/components/ui/CtaButton";
import { HighlightText } from "@/components/ui/HighlightText";
import { Aurora } from "@/components/visuals/Aurora";
import { ConsolePanel } from "@/components/visuals/ConsolePanel";
import { NetworkField } from "@/components/visuals/NetworkField";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-[var(--agi-header-height)]">
      <Aurora />
      <NetworkField className="absolute inset-0 h-full w-full opacity-70" />
      <div aria-hidden className="agi-grid-bg pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64"
        style={{ background: "linear-gradient(to bottom, transparent, var(--agi-void))" }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-16 px-5 pt-20 pb-28 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-28 lg:pb-36">
        <div className="flex flex-col gap-8">
          <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-[var(--agi-line-strong)] bg-white/[0.03] px-4 py-1.5 backdrop-blur-xl">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--agi-cyan)", boxShadow: "0 0 10px var(--agi-cyan)" }}
            />
            <span className="font-mono text-[0.68rem] tracking-[0.24em] text-[var(--agi-muted)] uppercase">
              {hero.eyebrow}
            </span>
          </span>

          <h1 className="max-w-2xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            <HighlightText text={hero.title} />
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-[var(--agi-muted)] sm:text-lg">
            {hero.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <CtaButton href={hero.primaryCta.href}>
              {hero.primaryCta.label}
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </CtaButton>
            <CtaButton href={hero.secondaryCta.href} variant="ghost">
              <BookOpen aria-hidden className="h-4 w-4" />
              {hero.secondaryCta.label}
            </CtaButton>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
            {hero.chips.map((chip) => (
              <li
                key={chip}
                className="flex items-center gap-2 font-mono text-[0.72rem] text-[var(--agi-subtle)]"
              >
                <span aria-hidden className="h-px w-4 bg-[var(--agi-line-strong)]" />
                {chip}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-8 -z-10 rounded-full opacity-40 blur-[90px]"
            style={{ background: "radial-gradient(circle, var(--agi-violet) 0%, transparent 68%)" }}
          />
          <ConsolePanel />
          <p className="mt-4 text-center font-mono text-[0.68rem] tracking-[0.14em] text-[var(--agi-subtle)] uppercase">
            {site.chain} settlement · illustrative devnet trace
          </p>
        </div>
      </div>
    </section>
  );
}
