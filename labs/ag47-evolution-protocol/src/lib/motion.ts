import type { Transition, Variants } from "framer-motion";

/**
 * Orçamento de motion do projeto.
 *
 * Regra: nenhum componente define animação ad-hoc. Tudo consome as variantes
 * daqui, para que duração, easing e distância permaneçam consistentes e para
 * que `prefers-reduced-motion` seja tratado em um único lugar
 * (globals.css + o componente `Reveal`).
 */

export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const DURATION = {
  fast: 0.2,
  base: 0.35,
  slow: 0.5,
} as const;

/** Distância máxima de deslocamento. Acima disso a animação vira distração. */
export const OFFSET = 12;

export const baseTransition: Transition = {
  duration: DURATION.base,
  ease: EASE_OUT,
};

/** Configuração padrão de viewport: anima uma única vez, sem re-disparo no scroll. */
export const VIEWPORT = { once: true, amount: 0.25 } as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: baseTransition },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: OFFSET },
  visible: { opacity: 1, y: 0, transition: baseTransition },
};

/** Container que escalona a entrada dos filhos. Use com `fadeUp` nos itens. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

/** Traço de conector que se desenha — usado nos diagramas de fluxo. */
export const drawLine: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};
