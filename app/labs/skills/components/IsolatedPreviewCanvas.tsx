'use client';

import React, { useMemo } from 'react';
import { NormalizedDesignSystem, ViewportMode } from '@/lib/design-system/types';
import { Smartphone, Tablet, Monitor, Sun, Moon, Info } from 'lucide-react';

interface IsolatedPreviewCanvasProps {
  spec: NormalizedDesignSystem | null;
  viewport: ViewportMode;
  onViewportChange: (viewport: ViewportMode) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  children: React.ReactNode;
}

export function IsolatedPreviewCanvas({
  spec,
  viewport,
  onViewportChange,
  isDarkMode,
  onToggleTheme,
  children,
}: IsolatedPreviewCanvasProps) {
  // Compute scoped CSS variables from normalized tokens
  const cssVariables = useMemo(() => {
    if (!spec) return {};

    const c = spec.colors;
    const t = spec.typography;
    const s = spec.spacing;
    const r = spec.radius;
    const sh = spec.shadows;
    const m = spec.motion;

    const pickColor = (token: { value: string; dark_value?: string }) => {
      return isDarkMode && token.dark_value ? token.dark_value : token.value;
    };

    return {
      '--ds-primary': pickColor(c.primary),
      '--ds-secondary': pickColor(c.secondary),
      '--ds-accent': pickColor(c.accent),
      '--ds-bg': pickColor(c.background),
      '--ds-surface': pickColor(c.surface),
      '--ds-surface-elevated': pickColor(c.surface_elevated),
      '--ds-text-primary': pickColor(c.text_primary),
      '--ds-text-secondary': pickColor(c.text_secondary),
      '--ds-text-muted': pickColor(c.text_muted),
      '--ds-border': pickColor(c.border),
      '--ds-success': pickColor(c.success),
      '--ds-warning': pickColor(c.warning),
      '--ds-error': pickColor(c.error),
      '--ds-info': pickColor(c.info),

      '--ds-radius-xs': r.xs || '2px',
      '--ds-radius-sm': r.sm || '4px',
      '--ds-radius-md': r.md || '8px',
      '--ds-radius-lg': r.lg || '16px',
      '--ds-radius-full': r.full || '9999px',

      '--ds-space-xs': s.xs || '4px',
      '--ds-space-sm': s.sm || '8px',
      '--ds-space-md': s.md || '16px',
      '--ds-space-lg': s.lg || '24px',
      '--ds-space-xl': s.xl || '32px',
      '--ds-section-spacing': s.section_spacing || '64px',

      '--ds-shadow-sm': sh.sm || '0 1px 2px rgba(0,0,0,0.05)',
      '--ds-shadow-md': sh.md || '0 4px 6px -1px rgba(0,0,0,0.1)',
      '--ds-shadow-lg': sh.lg || '0 10px 15px -3px rgba(0,0,0,0.1)',
      '--ds-focus-ring': sh.focus_ring || '0 0 0 3px rgba(59,130,246,0.3)',

      '--ds-font-sans': t.body.font_family || 'inherit',
      '--ds-font-mono': t.metadata.font_family || 'monospace',

      '--ds-duration-fast': m.duration_fast || '150ms',
      '--ds-duration-normal': m.duration_normal || '250ms',
      '--ds-duration-slow': m.duration_slow || '400ms',
      '--ds-easing': m.easing_default || 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    } as React.CSSProperties;
  }, [spec, isDarkMode]);

  const hasDarkSupport = spec?.meta.supported_modes === 'both' || spec?.meta.supported_modes === 'dark';

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Workbench Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-zinc-950/80 border border-white/10 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Viewport:</span>
          <div className="inline-flex p-1 bg-zinc-900 border border-white/5 rounded-xl gap-1">
            <button
              onClick={() => onViewportChange('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewport === 'desktop'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
              title="Desktop (100% Fluido)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => onViewportChange('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewport === 'tablet'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
              title="Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => onViewportChange('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewport === 'mobile'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
              title="Mobile (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>

        {/* Theme Controls */}
        <div className="flex items-center gap-3">
          {spec ? (
            hasDarkSupport ? (
              <button
                onClick={onToggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-900 border border-white/10 text-white hover:bg-white/10 transition-all"
              >
                {isDarkMode ? <Moon className="w-3.5 h-3.5 text-amber-300" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono text-zinc-500 bg-zinc-900/60 rounded-xl border border-white/5">
                <Info className="w-3.5 h-3.5" />
                <span>DARK MODE NOT DEFINED</span>
              </div>
            )
          ) : (
            <span className="text-[11px] font-mono text-zinc-500">Superfície Neutra</span>
          )}
        </div>
      </div>

      {/* Viewport Frame Wrapper */}
      <div className="w-full flex justify-center py-2 overflow-x-auto">
        <div
          className={`transition-all duration-300 ${
            viewport === 'mobile'
              ? 'w-[375px] border-4 border-zinc-700 rounded-[36px] shadow-2xl p-2 bg-zinc-900'
              : viewport === 'tablet'
              ? 'w-[768px] border-4 border-zinc-700 rounded-[28px] shadow-2xl p-3 bg-zinc-900'
              : 'w-full rounded-2xl border border-white/10'
          }`}
        >
          {/* Mobile Status Bar Simulation */}
          {viewport === 'mobile' && (
            <div className="w-full flex justify-between items-center px-4 py-1.5 text-[10px] text-zinc-400 font-mono select-none">
              <span>9:41</span>
              <div className="w-16 h-3 bg-black rounded-full mx-auto" />
              <span>5G 100%</span>
            </div>
          )}

          {/* ISOLATED PREVIEW CONTAINER */}
          <div
            data-design-system-preview
            data-theme={isDarkMode ? 'dark' : 'light'}
            style={cssVariables}
            className={`w-full min-h-[480px] p-6 sm:p-8 rounded-xl transition-colors duration-200 overflow-hidden ${
              spec
                ? isDarkMode
                  ? 'bg-[var(--ds-bg)] text-[var(--ds-text-primary)]'
                  : 'bg-[var(--ds-bg)] text-[var(--ds-text-primary)]'
                : 'bg-zinc-950 text-zinc-300 border border-dashed border-zinc-800'
            }`}
          >
            {/* Scoped CSS Reset Layer */}
            <style>{`
              [data-design-system-preview] {
                font-family: var(--ds-font-sans, system-ui, -apple-system, sans-serif);
                line-height: 1.5;
                color: var(--ds-text-primary, #ffffff);
                background-color: var(--ds-bg, transparent);
                box-sizing: border-box;
                -webkit-font-smoothing: antialiased;
              }
              [data-design-system-preview] * {
                box-sizing: border-box;
              }
              [data-design-system-preview] button {
                font-family: inherit;
                cursor: pointer;
              }
              [data-design-system-preview] input,
              [data-design-system-preview] textarea,
              [data-design-system-preview] select {
                font-family: inherit;
              }
            `}</style>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
