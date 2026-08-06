import { roadmap } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";

const STATE_COLOR: Record<string, string> = {
  active: "var(--agi-cyan)",
  next: "var(--agi-violet)",
  planned: "var(--agi-slate)",
};

export function Roadmap() {
  return (
    <Section id="roadmap" grid>
      <SectionHeading
        eyebrow="Roadmap"
        title="Shipped, *next*, and honestly labelled"
        lead="Phases are sequential because each one depends on the guarantees of the one before it. Nothing below is described as live until it is."
      />

      <ol className="mt-14 grid gap-4 md:grid-cols-2">
        {roadmap.map((phase) => {
          const color = STATE_COLOR[phase.state] ?? "var(--agi-slate)";

          return (
            <li key={phase.id}>
              <GlassCard
                interactive
                watermark={phase.phase.replace("Phase ", "P")}
                className="h-full p-8"
              >
                <div className="flex h-full flex-col gap-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[0.68rem] tracking-[0.2em] text-[var(--agi-subtle)] uppercase">
                      {phase.phase}
                    </span>
                    <span
                      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.62rem] tracking-[0.14em] uppercase"
                      style={{ borderColor: `${color}55`, color }}
                    >
                      <span
                        aria-hidden
                        className={phase.state === "active" ? "relative flex h-1.5 w-1.5" : "hidden"}
                      >
                        <span
                          className="agi-pulse-ring absolute inline-flex h-full w-full rounded-full"
                          style={{ background: color }}
                        />
                        <span
                          className="relative inline-flex h-1.5 w-1.5 rounded-full"
                          style={{ background: color }}
                        />
                      </span>
                      {phase.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold tracking-tight">{phase.title}</h3>
                  <div className="agi-rule" />

                  <ul className="flex flex-col gap-3">
                    {phase.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-2 h-1 w-1 shrink-0 rounded-full"
                          style={{ background: color }}
                        />
                        <span className="text-sm leading-relaxed text-[var(--agi-muted)]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
