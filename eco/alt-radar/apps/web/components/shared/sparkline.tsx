interface SparklineProps {
  change24h?: number | null;
  change1h?: number | null;
  change5m?: number | null;
  seed?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function Sparkline({
  change24h = null,
  width = 84,
  height = 28,
  className = "",
}: SparklineProps) {
  const hasObservedChange = change24h !== null && Number.isFinite(change24h);
  const formattedChange = hasObservedChange
    ? `${change24h > 0 ? "+" : ""}${change24h.toFixed(1)}%`
    : "Δ24h N/D";
  const tone = !hasObservedChange
    ? "text-zinc-500"
    : change24h >= 0
      ? "text-emerald-400"
      : "text-rose-400";
  const description = hasObservedChange
    ? `Variação agregada em 24 horas: ${formattedChange}. Série histórica indisponível.`
    : "Variação em 24 horas e série histórica indisponíveis.";

  return (
    <div
      aria-label={description}
      className={`relative inline-flex flex-col items-center justify-center overflow-hidden rounded-md border border-dashed border-white/10 bg-white/[0.02] font-mono leading-none ${className}`}
      role="img"
      style={{ width, height }}
      title={description}
    >
      <span className="text-[0.42rem] font-bold uppercase tracking-wide text-zinc-500">
        Série N/D
      </span>
      <span className={`mt-0.5 text-[0.55rem] font-bold ${tone}`}>{formattedChange}</span>
    </div>
  );
}
