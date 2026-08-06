import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  /** Low-opacity monospaced sticker rendered inside the card. */
  watermark?: string;
  /** Adds a hover lift + border brighten. */
  interactive?: boolean;
};

export function GlassCard({ children, className, watermark, interactive = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--agi-radius-lg)] border border-[var(--agi-line)] bg-[var(--agi-glass)] backdrop-blur-xl",
        interactive &&
          "transition duration-500 hover:-translate-y-1 hover:border-[var(--agi-line-strong)] hover:bg-[var(--agi-glass-hover)]",
        className,
      )}
    >
      {watermark ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-4 -bottom-8 font-mono text-[6.5rem] leading-none font-bold tracking-tighter text-white/[0.045] select-none"
        >
          {watermark}
        </span>
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}
