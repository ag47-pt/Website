"use client";

import { m, useReducedMotion } from "framer-motion";

import { fadeUp, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Atraso em segundos, para escalonar irmãos sem um container de stagger. */
  delay?: number;
  as?: "div" | "section" | "li";
}

/**
 * Revelação por scroll — o único mecanismo de entrada usado na página.
 *
 * Com `prefers-reduced-motion` ativo o conteúdo é renderizado direto no estado
 * final, sem deslocamento e sem transição.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Component = m[as];

  if (reduceMotion) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={cn(className)}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}
