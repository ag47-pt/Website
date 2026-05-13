---
name: ag47-designer-labs-miniapps-frontpages
description: "B**UI**ld immersive, technical, and high-end UI/**UX** for Agência 47's experimental Labs sector. Provides the blueprint for mini-apps, landing pages, and interactive dashboards following the \"Labs Blueprint\" aesthetic."
skills:
  - frontend-design
  - clean-code
---

# Ag47 Labs Mini-Apps & Frontpages Designer

Skill focused on building immersive, technical, and high-end UI/UX for Agência 47's experimental sector (Labs). It provides the blueprint for creating mini-apps, landing pages, and interactive dashboards that follow the "Labs Blueprint" aesthetic.

> 🔴 **MANDATORY**: Before writing any Labs UI, read `resources/DESIGN_TOKENS.md` for all tokens, rules and patterns. Then check `examples/LabTemplate.tsx` as a starting reference.

## Visual Identity (Labs Blueprint)
- **Technical Atmosphere**: Blueprint grids, monospace fonts, and coordinate displays.
- **Section Naming Convention**: Use the 'Technical Registry' pattern for section identifiers (e.g., HeroRestagNode_Registry, MetricasRestag, InfosRestag, GastroEngineeringCycle, TechnicalMenuGrid). This reinforces the idea of a modular, system-based interface.
- **Glassmorphism**: Heavy use of ackdrop-blur-xl, subtle borders (order-white/10), and glass-shine animations.
- **Dynamic Theming**: Real-time theme switching via interactive status indicators.
- **Glow & Atmosphere**: Deep ambient glows and nebula backgrounds.
- **Scroll Storytelling**: Visible progress indicators (Comet bar) and percentage counters.

## Core Components

### 1. The Hero Section (Standardized)
Every Labs page starts with the `<LabHero />` component from `@/app/labs/components`. It centralizes:
- **Overline (Mini-Título)**: Monospace text with an icon.
- **Main Title**: High-contrast `tracking-tighter` text with a highlight box.
- **Description**: Supports **Markdown-style** bolding (`**text**`) for automatic white highlights.
- **Status Tags**: Operational status indicators with theme-switch interactivity.
- **Actions & Footer**: Slots for buttons and technical directory paths.
- **Panoramic Enhancement**: For immersive pages, use `scale-x-[2]` on the background and `mt-[-200px] pt-[200px]` to eliminate gaps under the navbar.

```tsx
import { LabHero } from '@/app/labs/components';
import { Terminal } from 'lucide-react';

<LabHero 
  overline="INITIALIZING_CORE_V1"
  overlineIcon={Terminal}
  title="O Futuro é"
  highlight="Experimental"
  description="Bem-vindo ao centro de **inovação** da Agência 47. Use **Markdown** para destacar partes importantes."
  statusTags={[{ label: "Live", color: "lime", pulse: true }]}
  actions={<button className="px-6 py-2 bg-white text-black rounded-full font-bold">Start</button>}
  footer={<div className="flex items-center gap-2"><span>Path:</span><code className="bg-white/10 px-2 rounded">/labs/core</code></div>}
/>
```

### 2. Lab Card System
Use the specialized cards from `@/app/labs/components`:
- **`<LabVisitCard />`**: For project showcases (imitates `/labs/dev`). Includes progress bars and specs.
- **`<LabCallCard />`**: For navigational links (imitates `/labs` landing). Includes large watermarks and technical corners.
- **`<LabInfoCard />`**: For technical notifications or info boxes (imitates "Projetos Sob Demanda").

#### ✅ MANDATORY: Overtitle Rule
Every card **MUST** display the folder path as an overtitle above the title. See `resources/DESIGN_TOKENS.md § 3` for full spec.

```tsx
// LabCallCard — pass the path prop
<LabCallCard 
  title="Dev Showcase"
  description="..."
  path="/labs/dev"   // ← renders as overtitle: ./labs/dev
  icon={<Code2 className="w-8 h-8" />}
  status="ACTIVE_SECTOR"
/>

// LabVisitCard — pass the path prop (or falls back to /labs/sandbox/{slug})
<LabVisitCard 
  name="Alpha Interface"
  client="Agência 47"
  slug="alpha-ui"
  path="/labs/sandbox/alpha-ui"  // ← explicit path for overtitle
  ...
/>
```

#### ✅ MANDATORY: Dynamic Hover — Highlight Rule
Card titles MUST use the `--hover-color` CSS variable pattern. **Never** use Tailwind's `group-hover:text-primary`. See `resources/DESIGN_TOKENS.md § 4` for full spec.

The pattern is already implemented in `LabCards.tsx`. When building custom cards, replicate:
```tsx
// On the group container:
style={{ '--hover-color': theme.colors.primary } as React.CSSProperties}

// On the title:
className="... group-hover:bg-[var(--hover-color)] group-hover:text-black transition-all duration-500 inline-block"
```

All cards include:
- **Glass-shine**: Automatic light reflection on hover.
- **Large Watermarks**: Top-right positioning with dynamic rotation (straightens on hover).
- **Thematic Integration**: Uses `ThemeContext` colors automatically.
- **Entrance Animation**: Staggered `y: 20` fade-in with `viewport={{ once: true }}`.

### 3. Bottom-Sheet / Detail Overlay Pattern
For detail drawers or expanded views:
```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      className="fixed bottom-0 left-0 right-0 h-[80vh] bg-[#0A0A0A]/95 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl z-50 p-8"
    >
      <div className="max-w-4xl mx-auto space-y-6 overflow-y-auto h-full nexus-scrollbar">
        <h2 className="text-3xl font-bold font-mono"># PROJECT_LOG: {title}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="font-mono text-gray-400">--- BEGIN DETAILED_SPEC ---</p>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

### 4. Scroll Experience
- **The Comet**: `ScrollProgressBar` attached to the bottom of the sticky header.
- **Percentage HUD**: A fixed bottom-right indicator showing the scroll progress starting from 47%.

## Project Structure & Implementation

### 4. Dynamic HUD Navigation (Context-Aware)
Every immersive app MUST use a context-aware navigation system (HUD).
- **Architecture**: Refactor the page layout into a `RestagLayout` (or similar) that accepts a `navItems` array.
- **Components**: The HUD consists of `RoundHUDIcon` buttons with tooltips.
- **Interaction**: Use an `IntersectionObserver` in the Layout to automatically highlight the current section.
- **Scroll Alignment**: Use a global `offset` of **50px** in navigation functions to center content perfectly below the fixed header.

```tsx
const NAV_ITEMS = [
  { id: 'hero', label: 'START_NODE', icon: Terminal },
  { id: 'metrics', label: 'LIVE_TELEMETRY', icon: Activity },
  { id: 'form', label: 'DEPLOY_REQUEST', icon: Send },
];

export default function App() {
  return (
    <RestagLayout navItems={NAV_ITEMS}>
      {/* Page Content with matching IDs */}
    </RestagLayout>
  );
}
```

### Dynamic Backgrounds
Use a combination of:
1. **Blueprint Grid**: Fixed background with a repeating grid pattern.
2. **Nebula Image**: Low-opacity nebula image (`opacity-30`).
3. **Ambient Glows**: Large blurred circles using `theme.colors.primary`.

### Theme-Reactive Color Usage
- **Use `style={{ color: theme.colors.primary }}`** for accent text, overtitles, and icons (NOT Tailwind `text-primary`).
- **Use `style={{ backgroundColor: theme.colors.primary }}`** for highlight backgrounds.
- **Use CSS variable `--hover-color`** for group-hover effects to remain reactive.

## Project Setup (Path Aliases)

To ensure proper resolution of the `@/` alias in the `.agent` directory, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  },
  "include": ["**/*.ts", "**/*.tsx", ".agent/**/*.tsx"]
}
```

## Design Tokens Reference

Refer to `resources/DESIGN_TOKENS.md` for all tokens. Key references:
- **Primary Colors**: Main interaction and highlight color.
- **Card Overtitle**: Font Mono, UPPERCASE, 9-10px, tracking 0.1-0.2em, primary color.
- **Card Hover**: `--hover-color` CSS var, `bg-[var(--hover-color)] text-black`, `duration-500`.
- **Watermarks**: Opacity `0.05` to `0.15`, size `w-48` to `w-72`.
- **Animations**: Standard durations — entrance `0.8s`, hover `0.5s`, watermark `0.7s`.

## When to use this skill
- Creating a new tool/mini-app within `/labs`.
- Building a new showcase or portal page.
- Refactoring existing pages to follow the latest Labs design system.
- Implementing interactive theme-dependent UI.
- Adding new card types that must follow the overtitle and hover rules.
