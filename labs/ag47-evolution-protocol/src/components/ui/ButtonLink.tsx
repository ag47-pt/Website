import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-canvas font-medium hover:bg-accent-bright shadow-[0_0_0_1px_var(--accent-dim)]",
  secondary:
    "border border-hairline-strong bg-surface-2/80 text-fg hover:border-accent-dim hover:bg-surface-3",
  ghost: "text-fg-muted hover:text-fg",
};

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
}

/**
 * Todos os CTAs da página são links (âncoras internas ou repositório externo),
 * então não existe variante `<button>`.
 */
export function ButtonLink({
  href,
  children,
  variant = "secondary",
  external = false,
  className,
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm transition-colors duration-200",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </a>
  );
}
