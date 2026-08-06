import { tokenomics } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { AllocationDonut } from "@/components/visuals/AllocationDonut";

const FACTS = [
  { label: "Standard", value: tokenomics.standard },
  { label: "Decimals", value: tokenomics.decimals },
  { label: "Mint authority", value: "Revoked" },
] as const;

export function Tokenomics() {
  return (
    <Section id="tokenomics" grid>
      <SectionHeading
        eyebrow="Tokenomics"
        title="Fixed supply, *usage-linked burn*"
        lead="No hidden treasury unlock, no allocation that vests before the people who build the network. The numbers below are the whole distribution."
      />

      <div className="mt-14 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <GlassCard className="flex flex-col justify-between gap-8 p-8">
          <AllocationDonut />
          <div>
            <p className="text-sm leading-relaxed text-[var(--agi-muted)]">
              {tokenomics.supplyNote}
            </p>
            <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-[var(--agi-radius-sm)] border border-[var(--agi-line)] bg-[var(--agi-line)]">
              {FACTS.map((fact) => (
                <div key={fact.label} className="bg-[rgba(8,6,15,0.9)] px-3 py-3">
                  <dt className="font-mono text-[0.6rem] tracking-[0.14em] text-[var(--agi-subtle)] uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 font-mono text-[0.78rem] text-[var(--agi-ink)]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </GlassCard>

        <GlassCard className="p-8">
          <ul className="flex flex-col">
            {tokenomics.allocation.map((slice, index) => (
              <li
                key={slice.id}
                className={
                  index === 0
                    ? "py-4"
                    : "border-t border-[var(--agi-line)] py-4"
                }
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 shrink-0 rounded-sm"
                    style={{ background: slice.color, boxShadow: `0 0 12px ${slice.color}` }}
                  />
                  <span className="flex-1 text-sm font-semibold tracking-tight">{slice.label}</span>
                  <span className="font-mono text-sm text-[var(--agi-ink)] tabular-nums">
                    {slice.percent}%
                  </span>
                </div>
                <div
                  aria-hidden
                  className="mt-2.5 ml-[1.375rem] h-1 overflow-hidden rounded-full bg-white/[0.05]"
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${slice.percent * 2.6}%`, background: slice.color, opacity: 0.75 }}
                  />
                </div>
                <p className="mt-2 ml-[1.375rem] text-[0.78rem] leading-relaxed text-[var(--agi-subtle)]">
                  {slice.note}
                </p>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {tokenomics.mechanisms.map((mechanism) => (
          <GlassCard key={mechanism.id} interactive className="p-7">
            <div className="flex flex-col gap-3">
              <span
                className="font-mono text-3xl font-semibold tracking-tighter"
                style={{ color: "var(--agi-cyan)" }}
              >
                {mechanism.metric}
              </span>
              <span className="font-mono text-[0.66rem] tracking-[0.16em] text-[var(--agi-subtle)] uppercase">
                {mechanism.metricLabel}
              </span>
              <div className="agi-rule my-1" />
              <h3 className="text-base font-semibold tracking-tight">{mechanism.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--agi-muted)]">{mechanism.body}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
