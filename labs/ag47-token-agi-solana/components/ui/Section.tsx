import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Renders the faint technical grid behind the section content. */
  grid?: boolean;
};

export function Section({ id, children, className, grid = false }: SectionProps) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 px-5 py-24 sm:px-8 md:py-32", className)}>
      {grid ? (
        <div aria-hidden className="agi-grid-bg pointer-events-none absolute inset-0" />
      ) : null}
      <div className="relative mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}
