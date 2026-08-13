import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "accent" | "warn" | "danger";

const TONES: Record<BadgeTone, string> = {
  neutral: "border-hairline-strong text-fg-muted",
  accent: "border-accent-dim text-accent-bright",
  warn: "border-state-warn/40 text-state-warn",
  danger: "border-state-danger/40 text-state-danger",
};

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

/** Rótulo compacto em monoespaçada. Tons warn/danger são reservados a estado. */
export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border bg-surface/60 px-3 py-1 font-mono text-[11px] tracking-wide",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
