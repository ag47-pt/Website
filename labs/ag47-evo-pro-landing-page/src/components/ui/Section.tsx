import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

interface SectionProps {
  /** Âncora usada pela navegação do header e do rodapé. */
  id: string;
  children: React.ReactNode;
  className?: string;
  /** Régua de 1px no topo, separando a seção da anterior. */
  divided?: boolean;
  /** Rótulo acessível quando a seção não tem um heading visível próprio. */
  ariaLabel?: string;
}

/** Envelope padrão de todas as seções: âncora, ritmo vertical e medida. */
export function Section({
  id,
  children,
  className,
  divided = true,
  ariaLabel,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "relative py-20 sm:py-28",
        divided && "border-t border-hairline",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}
