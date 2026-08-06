import { metrics } from "@/lib/content";
import { CountUp } from "@/components/ui/CountUp";
import { AreaSpark } from "@/components/visuals/AreaSpark";

export function NetworkMetrics() {
  return (
    <section aria-label="Network telemetry" className="relative border-y border-[var(--agi-line)]">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid divide-y divide-[var(--agi-line)] sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="group relative overflow-hidden px-6 py-8">
              <AreaSpark
                series={metric.series}
                gradientId={`spark-${metric.id}`}
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full opacity-45 transition-opacity duration-500 group-hover:opacity-80"
              />
              <div className="relative flex flex-col gap-1.5">
                <span className="font-mono text-[0.66rem] tracking-[0.2em] text-[var(--agi-subtle)] uppercase">
                  {metric.label}
                </span>
                <span className="text-3xl font-semibold tracking-tight sm:text-[2.1rem]">
                  <CountUp
                    value={metric.value}
                    decimals={metric.decimals}
                    suffix={metric.suffix}
                    drift={metric.drift}
                  />
                </span>
                <span className="text-[0.78rem] leading-snug text-[var(--agi-subtle)]">
                  {metric.caption}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="border-t border-[var(--agi-line)] py-3 text-center font-mono text-[0.66rem] tracking-[0.16em] text-[var(--agi-subtle)] uppercase">
          Devnet environment · figures are illustrative of pipeline behaviour, not mainnet volume
        </p>
      </div>
    </section>
  );
}
