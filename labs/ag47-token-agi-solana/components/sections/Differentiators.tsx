import { Check, Minus } from "lucide-react";
import { comparison } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";

export function Differentiators() {
  return (
    <Section id="differentiators">
      <SectionHeading
        eyebrow="Differentiation"
        title="Infrastructure, utility and a *functioning economy*"
        lead="The comparison below is the honest version: some properties are shared with the alternatives, most are not."
      />

      <GlassCard className="mt-14 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <caption className="sr-only">
              Capability comparison between AGI, speculative tokens, centralized AI and isolated
              tools
            </caption>
            <thead>
              <tr className="border-b border-[var(--agi-line)]">
                <th scope="col" className="px-6 py-5 text-sm font-semibold tracking-tight">
                  Capability
                </th>
                {comparison.columns.map((column) => (
                  <th
                    key={column.id}
                    scope="col"
                    className="px-6 py-5 text-center"
                    style={
                      column.id === "agi"
                        ? { background: "rgba(139, 92, 246, 0.07)" }
                        : undefined
                    }
                  >
                    <span
                      className="block text-sm font-semibold tracking-tight"
                      style={column.id === "agi" ? { color: "var(--agi-plum)" } : undefined}
                    >
                      {column.label}
                    </span>
                    <span className="mt-0.5 block font-mono text-[0.62rem] tracking-[0.12em] text-[var(--agi-subtle)] uppercase">
                      {column.sub}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row) => (
                <tr key={row.capability} className="border-b border-[var(--agi-line)] last:border-0">
                  <th
                    scope="row"
                    className="px-6 py-4 text-sm font-normal text-[var(--agi-muted)]"
                  >
                    {row.capability}
                  </th>
                  {comparison.columns.map((column) => {
                    const supported = row.support[column.id];

                    return (
                      <td
                        key={column.id}
                        className="px-6 py-4 text-center"
                        style={
                          column.id === "agi"
                            ? { background: "rgba(139, 92, 246, 0.07)" }
                            : undefined
                        }
                      >
                        <span className="sr-only">{supported ? "Yes" : "No"}</span>
                        {supported ? (
                          <Check
                            aria-hidden
                            className="mx-auto h-4 w-4"
                            style={{
                              color: column.id === "agi" ? "var(--agi-cyan)" : "var(--agi-muted)",
                            }}
                          />
                        ) : (
                          <Minus aria-hidden className="mx-auto h-4 w-4 text-[var(--agi-faint)]" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <p className="mt-8 max-w-3xl text-base leading-relaxed text-[var(--agi-muted)]">
        {comparison.closing}
      </p>
    </Section>
  );
}
