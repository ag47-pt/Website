"use client";

import { useRef, useState, type KeyboardEvent } from "react";

/**
 * Comportamento de teclado do padrão ARIA de tabs, compartilhado pelos widgets
 * de seleção da página (ciclo evolutivo, workflows, máquina de estados).
 *
 * Implementa roving tabindex: apenas a aba ativa fica na ordem de tabulação,
 * então Tab atravessa o widget inteiro de uma vez em vez de percorrer item a
 * item. Setas navegam com wrap circular; Home e End vão aos extremos.
 *
 * Ambos os eixos de seta são aceitos independentemente da orientação — é mais
 * tolerante para quem navega sem saber como o widget foi rotulado.
 */
export function useRovingTabs(count: number, initialIndex = 0) {
  const [active, setActive] = useState(initialIndex);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusIndex = (index: number) => {
    setActive(index);
    refs.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const last = count - 1;
    let next: number | null = null;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        next = active === last ? 0 : active + 1;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        next = active === 0 ? last : active - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    focusIndex(next);
  };

  /** Props ARIA da aba na posição `index`. */
  const tabProps = (index: number, idBase: string) => ({
    role: "tab" as const,
    id: `${idBase}-tab-${index}`,
    "aria-selected": index === active,
    "aria-controls": `${idBase}-panel`,
    tabIndex: index === active ? 0 : -1,
    ref: (node: HTMLButtonElement | null) => {
      refs.current[index] = node;
    },
    onClick: () => setActive(index),
  });

  /** Props ARIA do painel associado à aba ativa. */
  const panelProps = (idBase: string) => ({
    role: "tabpanel" as const,
    id: `${idBase}-panel`,
    "aria-labelledby": `${idBase}-tab-${active}`,
    tabIndex: 0,
  });

  return { active, setActive, handleKeyDown, tabProps, panelProps };
}
