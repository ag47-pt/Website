import { ArrowRight } from "lucide-react";
import { finalCta, site } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { CtaButton } from "@/components/ui/CtaButton";
import { GlassCard } from "@/components/ui/GlassCard";

export function FinalCta() {
  return (
    <Section id="get-started">
      <GlassCard className="relative isolate overflow-hidden p-10 sm:p-16">
        {/* Radial wash rather than blurred blobs: inside a clipped card, blur edges
            would be cut into a visible rectangle. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 90% at 50% 0%, rgba(139,92,246,0.28), transparent 70%), radial-gradient(ellipse 60% 80% at 50% 110%, rgba(34,211,238,0.16), transparent 70%)",
          }}
        />
        <div aria-hidden className="agi-grid-bg pointer-events-none absolute inset-0" />

        <div className="relative flex flex-col items-center gap-7 text-center">
          <span className="rounded-full border border-[var(--agi-line-strong)] bg-white/[0.04] px-4 py-1.5 font-mono text-[0.66rem] tracking-[0.22em] text-[var(--agi-muted)] uppercase backdrop-blur-xl">
            {site.ticker} · {site.chain}
          </span>

          <h2 className="max-w-2xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
            {finalCta.title}
          </h2>

          <p className="max-w-xl text-base leading-relaxed text-[var(--agi-muted)]">
            {finalCta.body}
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {finalCta.actions.map((action) => (
              <CtaButton key={action.label} href={action.href} variant={action.variant}>
                {action.label}
                {action.variant === "primary" ? (
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                ) : null}
              </CtaButton>
            ))}
          </div>
        </div>
      </GlassCard>
    </Section>
  );
}
