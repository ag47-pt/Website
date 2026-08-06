import { flowSteps, proofOfIntelligence } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { FlowStrip } from "@/components/visuals/FlowStrip";

export function HowItWorks() {
  return (
    <Section id="how-it-works" grid>
      <SectionHeading
        eyebrow="How it works"
        title="One request, *five verifiable stages*"
        lead="Nothing in the pipeline is implicit. Each stage emits an artefact the next stage can check, and the last stage settles the cost of the work that was actually performed."
      />

      <div className="mt-12">
        <FlowStrip />
      </div>

      {/* Natural stacking deck: each card sticks under the previous one as it scrolls. */}
      <div className="mt-20 flex flex-col gap-[26vh]">
        {flowSteps.map((step, index) => (
          <div
            key={step.id}
            className="sticky"
            style={{ top: `${100 + index * 30}px`, zIndex: index + 1 }}
          >
            <GlassCard
              watermark={step.index}
              className="bg-[rgba(8,6,15,0.82)] p-8 sm:p-10"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
                <div className="flex items-center gap-4 md:w-44 md:flex-col md:items-start md:gap-3">
                  <span
                    className="font-mono text-4xl font-semibold tracking-tighter"
                    style={{ color: "var(--agi-violet)" }}
                  >
                    {step.index}
                  </span>
                  <span className="h-px flex-1 bg-[var(--agi-line-strong)] md:w-16 md:flex-none" />
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{step.title}</h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-[var(--agi-muted)] sm:text-base">
                    {step.body}
                  </p>
                  <p className="pt-1 font-mono text-[0.7rem] tracking-[0.12em] text-[var(--agi-subtle)]">
                    {step.detail}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        ))}
      </div>

      <GlassCard watermark="POI" className="mt-24 p-8 sm:p-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span className="w-fit rounded-full border border-[var(--agi-line-strong)] px-3 py-1 font-mono text-[0.64rem] tracking-[0.2em] text-[var(--agi-muted)] uppercase">
              consensus mechanism
            </span>
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {proofOfIntelligence.title}
            </h3>
            <p className="max-w-3xl text-base leading-relaxed text-[var(--agi-ink)]">
              {proofOfIntelligence.lead}
            </p>
            <p className="max-w-3xl text-sm leading-relaxed text-[var(--agi-muted)]">
              {proofOfIntelligence.body}
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[var(--agi-radius-md)] border border-[var(--agi-line)] bg-[var(--agi-line)] sm:grid-cols-2 lg:grid-cols-4">
            {proofOfIntelligence.properties.map((property) => (
              <div key={property.label} className="bg-[rgba(8,6,15,0.9)] p-5">
                <p
                  className="font-mono text-[0.7rem] tracking-[0.18em] uppercase"
                  style={{ color: "var(--agi-cyan)" }}
                >
                  {property.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--agi-muted)]">
                  {property.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </Section>
  );
}
