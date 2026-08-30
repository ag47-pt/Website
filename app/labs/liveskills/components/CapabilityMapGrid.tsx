'use client';

import React from 'react';
import type { CapabilityMapEntry } from '../types';
import { Reveal } from './SectionShell';

/**
 * Mapa técnico por contexto. Sem barras de percentagem, sem "React 95%".
 * Cada grupo declara onde as tecnologias foram efetivamente observadas.
 */
export function CapabilityMapGrid({ entries }: { entries: CapabilityMapEntry[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {entries.map((entry, index) => (
        <Reveal key={entry.category} delay={Math.min(index * 0.03, 0.2)}>
          <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-5">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ls-dim)]">
              {entry.category}
            </h3>

            <ul className="mt-3 grow space-y-1.5">
              {entry.items.map((item) => (
                <li key={item} className="text-[13px] leading-snug text-[var(--ls-text)]">
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-4 border-t border-white/5 pt-3 font-mono text-[10px] leading-relaxed text-[var(--ls-text)]">
              <span className="text-[var(--ls-dim)]">observed in</span> {entry.observedIn}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
