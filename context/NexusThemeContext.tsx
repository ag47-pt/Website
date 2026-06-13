'use client';

import { createContext, useContext, useState, useEffect, type ReactNode, type CSSProperties } from 'react';

export type NexusThemeName = 'default' | 'lime' | 'orange';

interface NexusTheme {
  label: string;
  primary: string;
  secondary: string;
  onPrimary: string;   // text colour on top of a solid primary background
  primaryText: string; // readable version of primary for use as text/border on light backgrounds
  glowColor: string;
}

/** Mapped 1-to-1 from the three config/design-system*.ts files */
export const NEXUS_THEMES: Record<NexusThemeName, NexusTheme> = {
  default: {
    label:        'Rosa',
    primary:      '#ec4899',
    secondary:    '#a855f7',
    onPrimary:    '#ffffff',
    primaryText:  '#be185d', // pink-700 — 5.1:1 on white
    glowColor:    'rgba(236, 72, 153, 0.5)',
  },
  lime: {
    label:        'Lima',
    primary:      '#D1FF00',
    secondary:    '#00d9ff',
    onPrimary:    '#111827',
    primaryText:  '#D1FF00', // Verde lima vibrante (ajustado conforme pedido do usuário)
    glowColor:    'rgba(209, 255, 0, 0.5)',
  },
  orange: {
    label:        'Laranja',
    primary:      '#ffaa00',
    secondary:    '#ffea00',
    onPrimary:    '#111827',
    primaryText:  '#ffaa00', // Laranja vibrante (ajustado conforme pedido do usuário)
    glowColor:    'rgba(255, 170, 0, 0.5)',
  },
};

interface NexusThemeCtx {
  theme: NexusThemeName;
  setTheme: (t: NexusThemeName) => void;
  isDark: boolean;
  toggleDark: () => void;
}

const NexusThemeContext = createContext<NexusThemeCtx>({
  theme: 'default',
  setTheme: () => {},
  isDark: false,
  toggleDark: () => {},
});

export function useNexusTheme() {
  return useContext(NexusThemeContext);
}

/** Drop-in replacement for the layout wrapper div — must be used from a Server Component */
export function NexusThemeProvider({
  children,
  fontClassName,
}: {
  children: ReactNode;
  fontClassName: string;
}) {
  const [theme, setThemeState] = useState<NexusThemeName>('default');
  const [isDark, setIsDark] = useState(false);

  // Hydrate from localStorage once mounted
  useEffect(() => {
    const saved = localStorage.getItem('nexus-theme') as NexusThemeName | null;
    const isDarkSaved = localStorage.getItem('nexus-dark') === 'true';
    
    setTimeout(() => {
      if (saved && NEXUS_THEMES[saved]) setThemeState(saved);
      setIsDark(isDarkSaved);
    }, 0);
  }, []);

  const setTheme = (t: NexusThemeName) => {
    setThemeState(t);
    localStorage.setItem('nexus-theme', t);
  };

  const toggleDark = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('nexus-dark', String(next));
      return next;
    });
  };

  const t = NEXUS_THEMES[theme];

  return (
    <NexusThemeContext.Provider value={{ theme, setTheme, isDark, toggleDark }}>
      <div
        data-nexus-theme={theme}
        data-nexus-dark={isDark ? 'true' : 'false'}
        className={`${fontClassName} nexus-layout bg-background min-h-screen text-text-main antialiased flex flex-col md:flex-row`}
        style={
          {
            '--color-primary':      t.primary,
            '--nexus-on-primary':   t.onPrimary,
            '--nexus-primary-text': t.primaryText,
            '--nexus-glow':         t.glowColor,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </NexusThemeContext.Provider>
  );
}
