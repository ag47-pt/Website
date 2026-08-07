"use client";

import { m, useScroll, useSpring } from "framer-motion";

/**
 * Indicador lateral de progresso de leitura.
 * Puramente decorativo — a informação já está na navegação, então fica oculto
 * para tecnologia assistiva.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <m.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-accent"
    />
  );
}
