import { tokenomics } from "@/lib/content";

const SIZE = 260;
const RADIUS = 104;
const STROKE = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 1.2; // percentage points of visual gap between segments

/** Cumulative start position of each slice, resolved before render. */
const SEGMENTS = tokenomics.allocation.map((slice, index) => ({
  ...slice,
  start: tokenomics.allocation.slice(0, index).reduce((total, prev) => total + prev.percent, 0),
}));

/** Supply distribution rendered as stroked arcs on a single circle. */
export function AllocationDonut() {
  return (
    <div className="relative mx-auto w-full max-w-[17rem]">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label="Donut chart of the AGI supply distribution"
        className="w-full -rotate-90"
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={STROKE}
        />
        {SEGMENTS.map((slice) => {
          const length = ((slice.percent - GAP) / 100) * CIRCUMFERENCE;
          const offset = (slice.start / 100) * CIRCUMFERENCE;

          return (
            <circle
              key={slice.id}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={slice.color}
              strokeWidth={STROKE}
              strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              opacity="0.88"
            />
          );
        })}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span className="font-mono text-[0.62rem] tracking-[0.22em] text-[var(--agi-subtle)] uppercase">
          total supply
        </span>
        <span className="text-xl font-semibold tracking-tight">{tokenomics.supply}</span>
        <span className="font-mono text-[0.66rem] text-[var(--agi-subtle)]">AGI · fixed</span>
      </div>
    </div>
  );
}
