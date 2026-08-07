"use client";

import { domAnimation, LazyMotion } from "framer-motion";

/**
 * Carrega apenas o subconjunto `domAnimation` do framer-motion (animações,
 * gestos e detecção de viewport), permitindo que as ilhas usem `m.*` em vez de
 * `motion.*` e cortando o bundle da biblioteca.
 *
 * Envolve `children` no layout raiz: como o layout é Server Component, o
 * conteúdo continua sendo renderizado no servidor e apenas atravessa este
 * limite de cliente.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
