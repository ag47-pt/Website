import { Coins } from "lucide-react";
import { solution } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { OrganismDiagram } from "@/components/visuals/OrganismDiagram";

export function Solution() {
  return (
    <Section id="solution">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-96 w-[52rem] -translate-x-1/2 opacity-25 blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--agi-indigo) 0%, transparent 70%)" }}
      />

      <SectionHeading
        eyebrow={solution.eyebrow}
        title="A *cognitive organism*, not a chatbot"
        lead={solution.lead}
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <OrganismDiagram />

        <ol className="flex flex-col gap-3">
          {solution.layers.map((layer, index) => (
            <li key={layer.id}>
              <GlassCard interactive className="p-6">
                <div className="flex gap-5">
                  <span className="mt-1 font-mono text-[0.7rem] text-[var(--agi-subtle)] tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="text-base font-semibold tracking-tight">{layer.name}</h3>
                      <span className="rounded-full border border-[var(--agi-line)] px-2.5 py-0.5 font-mono text-[0.62rem] tracking-[0.14em] text-[var(--agi-subtle)] uppercase">
                        {layer.role}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--agi-muted)]">{layer.body}</p>
                  </div>
                </div>
              </GlassCard>
            </li>
          ))}
        </ol>
      </div>

      <GlassCard watermark="AGI" className="mt-10 p-8 sm:p-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--agi-line-strong)]"
            style={{
              background: "linear-gradient(140deg, rgba(139,92,246,0.24), rgba(34,211,238,0.12))",
              boxShadow: "0 0 30px rgba(139, 92, 246, 0.28)",
            }}
          >
            <Coins aria-hidden className="h-5 w-5" style={{ color: "var(--agi-plum)" }} />
          </span>
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-semibold tracking-tight">{solution.fuel.title}</h3>
            <p className="max-w-3xl text-sm leading-relaxed text-[var(--agi-muted)] sm:text-base">
              {solution.fuel.body}
            </p>
          </div>
        </div>
      </GlassCard>
    </Section>
  );
}
