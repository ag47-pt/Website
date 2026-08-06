import { cn } from "@/lib/cn";

const CENTER = 210;

const RINGS = [
  { id: "verification", radius: 78, nodes: 3, color: "var(--agi-plum)", label: "verification" },
  { id: "reasoning", radius: 128, nodes: 5, color: "var(--agi-violet)", label: "reasoning" },
  { id: "perception", radius: 178, nodes: 8, color: "var(--agi-cyan)", label: "perception" },
] as const;

function nodePosition(radius: number, index: number, total: number, offset: number) {
  const angle = (index / total) * Math.PI * 2 + offset;
  return { x: CENTER + Math.cos(angle) * radius, y: CENTER + Math.sin(angle) * radius };
}

/**
 * Concentric agent mesh: perception on the outside, reasoning inside it,
 * verification closest to the settlement core.
 */
export function OrganismDiagram({ className }: { className?: string }) {
  return (
    <div className={cn("relative mx-auto w-full max-w-[26rem]", className)}>
      <div
        aria-hidden
        className="absolute inset-8 rounded-full opacity-40 blur-[70px]"
        style={{ background: "radial-gradient(circle, var(--agi-violet) 0%, transparent 68%)" }}
      />
      <svg
        viewBox="0 0 420 420"
        role="img"
        aria-label="Concentric diagram of the AG47 organism: perception, reasoning and verification agents orbiting a settlement core"
        className="relative w-full"
      >
        {RINGS.map((ring) => (
          <circle
            key={ring.id}
            cx={CENTER}
            cy={CENTER}
            r={ring.radius}
            fill="none"
            stroke={ring.color}
            strokeOpacity="0.18"
            strokeWidth="1"
          />
        ))}

        {/* Spokes from each agent to the settlement core. */}
        {RINGS.map((ring, ringIndex) =>
          Array.from({ length: ring.nodes }, (_, index) => {
            const { x, y } = nodePosition(ring.radius, index, ring.nodes, ringIndex * 0.4);
            return (
              <line
                key={`${ring.id}-spoke-${index}`}
                x1={CENTER}
                y1={CENTER}
                x2={x}
                y2={y}
                stroke={ring.color}
                strokeOpacity="0.14"
                strokeWidth="1"
                className="agi-dash"
                style={{ animationDelay: `${index * -1.4}s` }}
              />
            );
          }),
        )}

        {RINGS.map((ring, ringIndex) =>
          Array.from({ length: ring.nodes }, (_, index) => {
            const { x, y } = nodePosition(ring.radius, index, ring.nodes, ringIndex * 0.4);
            return (
              <g key={`${ring.id}-node-${index}`}>
                <circle cx={x} cy={y} r="9" fill={ring.color} fillOpacity="0.1" />
                <circle cx={x} cy={y} r="3.4" fill={ring.color} fillOpacity="0.9" />
              </g>
            );
          }),
        )}

        <circle cx={CENTER} cy={CENTER} r="46" fill="rgba(8,6,15,0.9)" />
        <circle
          cx={CENTER}
          cy={CENTER}
          r="46"
          fill="none"
          stroke="var(--agi-line-strong)"
          strokeWidth="1"
        />
        <text
          x={CENTER}
          y={CENTER - 4}
          textAnchor="middle"
          className="font-mono"
          fontSize="17"
          fontWeight="600"
          fill="var(--agi-ink)"
        >
          AGI
        </text>
        <text
          x={CENTER}
          y={CENTER + 14}
          textAnchor="middle"
          className="font-mono"
          fontSize="8"
          letterSpacing="1.6"
          fill="var(--agi-subtle)"
        >
          SETTLEMENT
        </text>
      </svg>

      <ul className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2">
        {RINGS.map((ring) => (
          <li
            key={ring.id}
            className="flex items-center gap-2 font-mono text-[0.66rem] tracking-[0.16em] text-[var(--agi-subtle)] uppercase"
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: ring.color, boxShadow: `0 0 8px ${ring.color}` }}
            />
            {ring.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
