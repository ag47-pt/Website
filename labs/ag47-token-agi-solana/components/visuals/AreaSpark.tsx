/**
 * Minimal SVG area chart rendered behind metric values.
 * Pure geometry, no client JS — it exists to add depth, not to be read precisely.
 */
type AreaSparkProps = {
  series: readonly number[];
  gradientId: string;
  className?: string;
};

export function AreaSpark({ series, gradientId, className }: AreaSparkProps) {
  const width = 100;
  const height = 32;
  const max = Math.max(...series);
  const min = Math.min(...series);
  const span = max - min || 1;

  const points = series.map((value, index) => {
    const x = (index / (series.length - 1)) * width;
    const y = height - ((value - min) / span) * (height - 4) - 2;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  const line = `M${points.join(" L")}`;
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--agi-violet)" stopOpacity="0.42" />
          <stop offset="100%" stopColor="var(--agi-violet)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={line}
        fill="none"
        stroke="var(--agi-plum)"
        strokeOpacity="0.55"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
