'use client';

import { Sun, Moon } from 'lucide-react';
import { useNexusTheme, NEXUS_THEMES, type NexusThemeName } from '@/context/NexusThemeContext';

export function NexusThemeSwitcher() {
  const { theme, setTheme, isDark, toggleDark } = useNexusTheme();

  return (
    <div className="px-3 py-3 border-t border-border/50">
      <p className="text-[10px] font-bold text-text-light uppercase tracking-widest mb-2.5">Design System</p>
      <div className="flex items-center gap-2">
        {(Object.entries(NEXUS_THEMES) as [NexusThemeName, typeof NEXUS_THEMES.default][]).map(
          ([key, ds]) => (
            <button
              key={key}
              title={ds.label}
              onClick={() => setTheme(key)}
              className={`group relative flex items-center justify-center rounded-full transition-all ${
                theme === key
                  ? 'ring-2 ring-offset-2 ring-offset-surface scale-110'
                  : 'hover:scale-105 opacity-70 hover:opacity-100'
              }`}
              style={
                theme === key
                  ? ({ '--tw-ring-color': ds.primary } as React.CSSProperties)
                  : undefined
              }
            >
              <span
                className="w-5 h-5 rounded-full block shadow-sm"
                style={{ background: ds.primary }}
              />
              {/* Tooltip */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap text-[10px] font-semibold text-text-main bg-surface border border-border shadow-card rounded-md px-1.5 py-0.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                {ds.label}
              </span>
            </button>
          ),
        )}

        {/* Dark / Light toggle */}
        <button
          onClick={toggleDark}
          title={isDark ? 'Modo claro' : 'Modo escuro'}
          className="ml-auto flex items-center justify-center w-7 h-7 rounded-lg text-text-muted hover:text-text-main hover:bg-background transition-colors"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </div>
  );
}
