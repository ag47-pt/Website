"use client";

import { m, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { protocolStack } from "@/data/protocol-stack";
import { fadeUp, staggerContainer, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A pilha do protocolo: Missão → Constituição → Políticas → Workflows →
 * Papéis → Skills → Ferramentas → Projeto.
 *
 * Os conectores acima da camada ativa ficam em destaque, formando um caminho
 * visível da intenção até o repositório. Ativação por ponteiro (hover) e por
 * teclado (focus), com o detalhe anunciado em uma região live.
 */
export function ProtocolStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const active = protocolStack[activeIndex];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
      <m.ol
        className="relative"
        variants={reduceMotion ? undefined : staggerContainer}
        initial={reduceMotion ? undefined : "hidden"}
        whileInView={reduceMotion ? undefined : "visible"}
        viewport={VIEWPORT}
      >
        {protocolStack.map((layer, index) => {
          const isActive = index === activeIndex;
          const isBeforeActive = index < activeIndex;
          const isLast = index === protocolStack.length - 1;

          return (
            <m.li
              key={layer.id}
              variants={reduceMotion ? undefined : fadeUp}
              className="relative"
            >
              {/* Conector até a próxima camada */}
              {!isLast ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-[42px] left-[26px] h-[calc(100%-30px)] w-px transition-colors duration-300",
                    isBeforeActive || isActive ? "bg-accent-dim" : "bg-hairline-strong",
                  )}
                />
              ) : null}

              <button
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                aria-current={isActive}
                className={cn(
                  "flex w-full items-center gap-3.5 rounded-lg border px-3 py-2.5 text-left transition-colors duration-200",
                  isActive
                    ? "border-accent-dim bg-surface-2"
                    : "border-transparent hover:border-hairline hover:bg-surface/60",
                )}
              >
                <span
                  className={cn(
                    "flex size-[26px] shrink-0 items-center justify-center rounded-md border transition-colors duration-200",
                    isActive
                      ? "border-accent-dim bg-canvas text-accent"
                      : "border-hairline-strong bg-canvas text-fg-faint",
                  )}
                >
                  <Icon name={layer.icon} className="size-[14px]" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors",
                        isActive ? "text-fg" : "text-fg-muted",
                      )}
                    >
                      {layer.label}
                    </span>
                    {/* A posição já é comunicada pela lista ordenada — o número
                        é reforço visual e sairia do nome acessível do botão. */}
                    <span aria-hidden className="font-mono text-[10px] text-fg-faint">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-fg-faint">
                    {layer.summary}
                  </span>
                </span>
              </button>
            </m.li>
          );
        })}
      </m.ol>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="h-full rounded-xl border border-hairline bg-surface/70 p-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
              Camada {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span aria-hidden className="h-px flex-1 bg-hairline" />
          </div>

          {/* Rótulo de widget, não estrutura do documento: o texto troca a cada
              camada ativa, então não é um heading navegável. */}
          <div aria-live="polite">
            <p className="mt-4 text-lg font-semibold tracking-tight text-fg">
              {active.label}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">{active.detail}</p>
          </div>

          <p className="mt-6 border-t border-hairline pt-4 font-mono text-[11px] leading-relaxed text-fg-faint">
            Cada camada restringe a seguinte. Nenhum agente opera fora dos limites
            herdados das camadas acima.
          </p>
        </div>
      </div>
    </div>
  );
}
