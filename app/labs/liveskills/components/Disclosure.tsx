'use client';

import React, { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Disclosure acessível: botão nativo, aria-expanded/aria-controls,
 * operável por teclado. Usado para expandir evidências sem sobrecarregar
 * a leitura inicial.
 *
 * Sem animação de altura de propósito. O painel guarda a evidência que
 * sustenta cada afirmação da página — se a animação não correr (aba em
 * segundo plano, rAF suspenso, movimento reduzido), o conteúdo tem de estar
 * lá na mesma. Um `height: auto → 0` interrompido esconde a prova de forma
 * permanente; um render condicional simples nunca falha.
 */
export function Disclosure({
  label,
  count,
  children,
  tone = 'default',
}: {
  label: string;
  count?: number;
  children: React.ReactNode;
  tone?: 'default' | 'subtle';
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonId = `${panelId}-button`;

  return (
    <div className="w-full">
      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={`group inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
          tone === 'subtle'
            ? 'border-white/5 bg-white/[0.02] text-[var(--ls-text)] hover:border-white/15 hover:text-white'
            : 'border-white/10 bg-white/[0.03] text-[var(--ls-text)] hover:border-white/20 hover:text-white'
        }`}
      >
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
        {open ? 'Hide' : label}
        {typeof count === 'number' ? (
          <span className="tabular-nums text-[var(--ls-dim)] group-hover:text-[var(--ls-text)]">({count})</span>
        ) : null}
      </button>

      {open ? (
        <div id={panelId} role="region" aria-labelledby={buttonId} className="pt-4">
          {children}
        </div>
      ) : null}
    </div>
  );
}
