import type { LucideIcon } from "lucide-react";
import { Award, Cpu, KeyRound, LineChart, Scale, Server } from "lucide-react";
import { utilities } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";

const ICONS: Record<string, LucideIcon> = {
  key: KeyRound,
  cpu: Cpu,
  "line-chart": LineChart,
  server: Server,
  scale: Scale,
  award: Award,
};

export function TokenUtility() {
  return (
    <Section id="utility">
      <SectionHeading
        eyebrow="Token utility"
        title="Six functions, *one meter*"
        lead="Each of these is a place where AGI is consumed, staked or distributed. None of them has a bypass — which is what separates a utility asset from a ticker with a story attached."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {utilities.map((utility) => {
          const Icon = ICONS[utility.icon] ?? KeyRound;

          return (
            <GlassCard key={utility.id} interactive className="p-7">
              <div className="flex flex-col gap-4">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--agi-line-strong)]"
                  style={{
                    background:
                      "linear-gradient(140deg, rgba(139,92,246,0.2), rgba(34,211,238,0.08))",
                  }}
                >
                  <Icon aria-hidden className="h-5 w-5" style={{ color: "var(--agi-plum)" }} />
                </span>
                <h3 className="text-base font-semibold tracking-tight">{utility.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--agi-muted)]">{utility.body}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </Section>
  );
}
