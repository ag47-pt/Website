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
- **Glassmorphism**: Heavy use of  ackdrop-blur-xl, subtle borders ( order-white/10), and glass-shine animations.
- **Dynamic Theming**: Real-time theme switching via interactive status indicators.
- **Glow & Atmosphere**: Deep ambient glows and nebula backgrounds.
- **Scroll Storytelling**: Visible progress indicators (Comet bar) and percentage counters.

## Core Components

### 1. The Hero System (Scalable Variations)
Every Labs page starts with the `<LabHero />` component. It now supports a **variant system** to maintain hierarchy across different levels of information depth.

#### ✅ Hero Variants:
1. **`variant="full"` (Completa - Default)**:
   - **Visual**: Immersive 160vh scroll container with "suction" animation.
   - **Content**: Overtitle, Title, Description, Status Tags, Actions, and Media (Image, Video, or **Mosaic**).
   - **Mosaic Feature**: Pass `mosaicImages={['url1', 'url2', ... ]}` to render a technical 2x2 grid of thumbnails instead of a single image.
   - **Use Case**: Main landing nodes (e.g., `/restag`, `/labs/ia`).

2. **`variant="medium"` (Media)**:
   - **Visual**: Compact 50/50 split layout. No background suction animation.
   - **Content**: Text on the left, **Actions column on the right** (vertically centered). No image/video.
   - **Use Case**: Secondary sections or transitional nodes where actions are the priority.

3. **`variant="mini"` (Mini)**:
   - **Visual**: Minimal padding, no split.
   - **Content**: Overtitle, smaller title, and description.
   - **Use Case**: Interior documentation pages or sub-modules (e.g., individual skill pages).

#### 🧠 Rationale (The "Why"):
- **Information Density**: Different levels of the app require different focus. `full` is for emotional/brand impact; `medium` is for functional efficiency; `mini` is for content consumption.
- **Visual Hierarchy**: Ensures the user understands where they are in the "system map" based on the visual weight of the hero.
- **Scalability**: Allows us to build complex hierarchies without overloading the user with high-intensity animations on every single sub-page.

```tsx
import { LabHero } from '@/app/labs/components';
import { Terminal, Play } from 'lucide-react';

// FULL VARIANT with MOSAIC
<LabHero 
  variant="full"
  overline="SYSTEM_LOADED"
  overlineIcon={Terminal}
  title="Restag"
  mosaicImages={['/img1.jpg', '/img2.jpg', '/img3.jpg', '/img4.jpg']}
  description="Immersive **hospitality** node."
  actions={<button>Deploy</button>}
/>

// MEDIUM VARIANT (Split actions)
<LabHero 
  variant="medium"
  overline="INTERNAL_MODULE"
  overlineIcon={Terminal}
  title="Settings"
  description="Configure your **node** registry."
  actions={<button>Save Changes</button>}
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

### 5. Advanced Telemetry & Interactive SVGs (Cockpits)
Para módulos de análise avançada (Labs/Apex/Swarms), as interfaces devem parecer "painéis de controle" (Cockpits) com densidade de dados e responsividade:
- **SVGs Interativos & Confidence Areas**: Gráficos construídos com SVGs nativos. Use `<polygon>` com baixa opacidade (`opacity="0.03"`) ligando a base histórica a projeções futuras para criar "Cones de Variância" que mapeiam a dispersão visual do modelo.
- **SVG Area Charts**: Use preenchimentos degradê (`fill="url(#gradient)"`) de 5% a 0% de opacidade sob as linhas de histórico do gráfico para trazer mais profundidade sem ruído.
- **Micro-interações de Dados (Modais Glassmorphism)**: Use tabelas técnicas que, ao clicar, disparam modals / Bottom Sheets (`backdrop-blur-2xl`) revelando a telemetria aprofundada ou recomendação do agente (Deep Dives).
- **HUDs de Streaming em Tempo Real (SSE)**: Simule terminais de execução usando React e `TransformStream` via API (Server-Sent Events) para imprimir os logs operacionais do sistema na tela conforme os agentes processam os blocos de trabalho.
- **Glow Dinâmico Baseado em Dados**: Em vez de cores estáticas, passe cores baseadas no "viés" dos dados (ex: `$biasColor` = verde ou vermelho) para dentro de atributos `box-shadow` e `style={{ color }}` para criar glows temáticos vibrantes (`box-shadow: 0 0 15px ${biasColor}33`).

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
