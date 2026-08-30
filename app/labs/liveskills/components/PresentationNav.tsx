'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

export interface NavSection {
  id: string;
  label: string;
}

/**
 * Navegação interna da apresentação.
 * Um recrutador raramente lê de cima a baixo — precisa de saltar para a
 * secção que lhe interessa e voltar. Fica colada abaixo do header do /labs.
 */
export function PresentationNav({ sections }: { sections: NavSection[] }) {
  const { theme, themeContrast } = useTheme();
  const [active, setActive] = useState<string>(sections[0]?.id ?? '');

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Presentation sections" className="sticky top-[80px] z-30">
      <div className="relative overflow-hidden rounded-full border border-white/20 bg-black/70 shadow-2xl backdrop-blur-xl">
        {/* Mesmo brilho de vidro do header do /labs. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-glass-shine absolute left-0 top-0 h-full w-[150%] bg-gradient-to-r from-transparent via-white/5 to-transparent mix-blend-overlay" />
        </div>

        <ul className="no-scrollbar relative flex gap-1 overflow-x-auto px-2 py-2">
          {sections.map((section) => {
            const isActive = active === section.id;
            return (
              <li key={section.id} className="shrink-0">
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`block rounded-full px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    isActive ? 'scale-105' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: theme.colors.primary,
                          color: themeContrast,
                          boxShadow: `0 0 15px ${theme.colors.primary}40`,
                        }
                      : undefined
                  }
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
