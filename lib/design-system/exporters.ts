import { NormalizedDesignSystem } from './types';

/**
 * Generates a production-ready tokens.css file from a normalized design system specification.
 */
export function generateCssTokens(spec: NormalizedDesignSystem): string {
  const lines: string[] = [];

  lines.push(`/**`);
  lines.push(` * Design System: ${spec.meta.name} (v${spec.meta.version})`);
  lines.push(` * Generated automatically by AG47 Labs Skills — Design System Lab`);
  lines.push(` * Platform: ${spec.meta.platform} | Theme: ${spec.meta.theme}`);
  lines.push(` */\n`);

  // Light / Default Root Tokens
  lines.push(`:root {`);

  // Spacing Tokens
  lines.push(`  /* Spacing Tokens */`);
  if (spec.spacing) {
    lines.push(`  --spacing-base: ${spec.spacing.base_unit || '4px'};`);
    ['xs', 'sm', 'md', 'lg', 'xl', 'section_spacing', 'container_padding'].forEach((k) => {
      const val = (spec.spacing as any)[k];
      if (val) {
        lines.push(`  --spacing-${k.replace(/_/g, '-')}: ${val};`);
      }
    });
  }
  lines.push(``);

  // Radius Tokens
  lines.push(`  /* Radius Tokens */`);
  if (spec.radius) {
    ['xs', 'sm', 'md', 'lg', 'full'].forEach((k) => {
      const val = (spec.radius as any)[k];
      if (val) {
        lines.push(`  --radius-${k}: ${val};`);
      }
    });
  }
  lines.push(``);

  // Elevation / Shadow Tokens
  lines.push(`  /* Elevation & Shadows */`);
  if (spec.shadows) {
    ['sm', 'md', 'lg', 'focus_ring'].forEach((k) => {
      const val = (spec.shadows as any)[k];
      if (val) {
        lines.push(`  --shadow-${k.replace(/_/g, '-')}: ${val};`);
      }
    });
  }
  lines.push(``);

  // Typography Tokens
  lines.push(`  /* Typography Scale */`);
  if (spec.typography) {
    Object.entries(spec.typography).forEach(([k, tok]) => {
      if (k === 'custom' || !tok) return;
      const v = tok as any;
      if (v.size) lines.push(`  --font-${k}-size: ${v.size};`);
      if (v.mobile_size) lines.push(`  --font-${k}-mobile-size: ${v.mobile_size};`);
      if (v.weight) lines.push(`  --font-${k}-weight: ${v.weight};`);
      if (v.line_height) lines.push(`  --font-${k}-line-height: ${v.line_height};`);
      if (v.tracking) lines.push(`  --font-${k}-tracking: ${v.tracking};`);
    });
  }
  lines.push(``);

  // Color Tokens (Light / Default)
  lines.push(`  /* Colors (Light / Default) */`);
  if (spec.colors) {
    Object.entries(spec.colors).forEach(([k, tok]) => {
      if (k === 'custom' || !tok) return;
      const token = tok as { value: string };
      if (token.value) {
        lines.push(`  --color-${k.replace(/_/g, '-')}: ${token.value};`);
      }
    });
  }

  lines.push(`}\n`);

  // Dark Theme Tokens (if supported)
  if (spec.meta.supported_modes !== 'light' && spec.colors) {
    lines.push(`/* Dark Mode Overrides */`);
    lines.push(`[data-theme="dark"], .dark {`);
    Object.entries(spec.colors).forEach(([k, tok]) => {
      if (k === 'custom' || !tok) return;
      const token = tok as { value: string; dark_value?: string };
      const darkVal = token.dark_value || token.value;
      if (darkVal) {
        lines.push(`  --color-${k.replace(/_/g, '-')}: ${darkVal};`);
      }
    });
    lines.push(`}\n`);
  }

  return lines.join('\n');
}

/**
 * Generates a Tailwind CSS configuration file (tailwind.config.ts) from a normalized design system.
 */
export function generateTailwindConfig(spec: NormalizedDesignSystem): string {
  const lines: string[] = [];

  lines.push(`import type { Config } from 'tailwindcss';`);
  lines.push(``);
  lines.push(`/**`);
  lines.push(` * Tailwind CSS Configuration for ${spec.meta.name} (v${spec.meta.version})`);
  lines.push(` * Generated automatically by AG47 Labs Skills — Design System Lab`);
  lines.push(` */`);
  lines.push(`const config: Config = {`);
  lines.push(`  darkMode: ['class', '[data-theme="dark"]'],`);
  lines.push(`  content: [`);
  lines.push(`    './pages/**/*.{js,ts,jsx,tsx,mdx}',`);
  lines.push(`    './components/**/*.{js,ts,jsx,tsx,mdx}',`);
  lines.push(`    './app/**/*.{js,ts,jsx,tsx,mdx}',`);
  lines.push(`  ],`);
  lines.push(`  theme: {`);
  lines.push(`    extend: {`);

  // Colors
  lines.push(`      colors: {`);
  if (spec.colors) {
    Object.entries(spec.colors).forEach(([k, tok]) => {
      if (k === 'custom' || !tok) return;
      const key = k.replace(/_/g, '-');
      lines.push(`        '${key}': 'var(--color-${key})',`);
    });
  }
  lines.push(`      },`);

  // Spacing
  lines.push(`      spacing: {`);
  if (spec.spacing) {
    ['xs', 'sm', 'md', 'lg', 'xl', 'section_spacing', 'container_padding'].forEach((k) => {
      const val = (spec.spacing as any)[k];
      if (val) {
        lines.push(`        '${k.replace(/_/g, '-')}': '${val}',`);
      }
    });
  }
  lines.push(`      },`);

  // Border Radius
  lines.push(`      borderRadius: {`);
  if (spec.radius) {
    ['xs', 'sm', 'md', 'lg', 'full'].forEach((k) => {
      const val = (spec.radius as any)[k];
      if (val) {
        lines.push(`        '${k}': '${val}',`);
      }
    });
  }
  lines.push(`      },`);

  // Box Shadow
  lines.push(`      boxShadow: {`);
  if (spec.shadows) {
    ['sm', 'md', 'lg', 'focus_ring'].forEach((k) => {
      const val = (spec.shadows as any)[k];
      if (val && val !== 'none') {
        lines.push(`        '${k.replace(/_/g, '-')}': '${val}',`);
      }
    });
  }
  lines.push(`      },`);

  // Font Sizes
  lines.push(`      fontSize: {`);
  if (spec.typography) {
    Object.entries(spec.typography).forEach(([k, tok]) => {
      if (k === 'custom' || !tok) return;
      const v = tok as any;
      if (v.size) {
        lines.push(
          `        '${k}': ['${v.size}', { lineHeight: '${v.line_height || '1.5'}', letterSpacing: '${v.tracking || '0'}', fontWeight: '${v.weight || '400'}' }],`
        );
      }
    });
  }
  lines.push(`      },`);

  lines.push(`    },`);
  lines.push(`  },`);
  lines.push(`  plugins: [],`);
  lines.push(`};`);
  lines.push(``);
  lines.push(`export default config;`);

  return lines.join('\n');
}
