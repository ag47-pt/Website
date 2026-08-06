import { cn } from "@/lib/cn";

type EyebrowProps = {
  children: string;
  className?: string;
};

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.28em] text-[var(--agi-subtle)] uppercase",
        className,
      )}
    >
      <span aria-hidden className="h-px w-6 bg-[var(--agi-line-strong)]" />
      {children}
    </span>
  );
}
