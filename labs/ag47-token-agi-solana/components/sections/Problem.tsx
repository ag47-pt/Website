import { problems } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";

export function Problem() {
  return (
    <Section id="problem" grid>
      <SectionHeading
        eyebrow="The problem"
        title="We are not short of data. We are short of *structured intelligence*."
        lead="Four failures compound into the same outcome: organisations hold more evidence than ever and still decide on intuition."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {problems.map((problem, index) => (
          <GlassCard
            key={problem.id}
            interactive
            watermark={`0${index + 1}`}
            className="p-7 sm:p-8"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-baseline gap-3">
                <span
                  className="font-mono text-2xl font-semibold tracking-tight"
                  style={{ color: "var(--agi-plum)" }}
                >
                  {problem.stat}
                </span>
                <span className="text-[0.72rem] leading-snug text-[var(--agi-subtle)]">
                  {problem.statLabel}
                </span>
              </div>
              <div className="agi-rule" />
              <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{problem.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--agi-muted)]">{problem.body}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
