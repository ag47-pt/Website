import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CtaButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

export function CtaButton({ href, children, variant = "primary", className }: CtaButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <a
      href={href}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-300",
        isPrimary
          ? "text-white hover:scale-[1.03]"
          : "border border-[var(--agi-line-strong)] bg-white/[0.03] text-[var(--agi-ink)] backdrop-blur-xl hover:border-white/25 hover:bg-white/[0.07]",
        className,
      )}
      style={
        isPrimary
          ? {
              background: "linear-gradient(96deg, var(--agi-violet), var(--agi-indigo) 55%, var(--agi-blue))",
              boxShadow: "0 0 28px rgba(139, 92, 246, 0.35), inset 0 1px 0 rgba(255,255,255,0.22)",
            }
          : undefined
      }
    >
      {children}
    </a>
  );
}
