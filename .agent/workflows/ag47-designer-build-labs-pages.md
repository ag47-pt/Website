---
description: Guided step-by-step creation or editing of a full Ag47 Labs page or Landing Page. Orchestrates ag47-designer-labs skills to produce a complete page with navbar, hero, themed sections, design system, and scroll progress indicators.
---

# /ag47-designer-build-labs-pages — Ag47 Labs Page Builder

This command activates a **fully guided, interactive workflow** to build or edit any Ag47 Labs page or Landing Page (LP) from scratch — hero to footer — following the "Labs Blueprint" design system.

> 🔴 **MANDATORY Skills**: Load `ag47-designer-labs-landing-pages` AND `ag47-designer-labs-miniapps-frontpages` before starting. Read both SKILL.md files fully.

---

## 🧭 THE WORKFLOW (5 Phases + 5 Gates)

### ══ PHASE 0: Context & Target ══

**Agent**: `frontend-specialist`
**Goal**: Understand what is being built and where.

**Actions**:
1. Ask the user:
   - "É uma **nova página** ou estás a **editar uma existente**?"
   - "Qual é o **serviço ou tema** desta página? (ex: Restag, Solda IA, Agência 47 Core)"
   - "Qual é a **rota** onde vai viver? (ex: `/labs/restag`, `/servicos/ia`)"
   - "Qual o **público-alvo**? (técnico, comercial, misto)"
2. Detect if this is a **Mini-App Frontpage** (`/labs/*`) or a **Service Landing Page** (`/servicos/*` or standalone).
3. Load existing file if editing: read the `[slug]Client.tsx` and `page.tsx`.

**🚧 GATE 0 (Context Lock)**: Confirm service name, route, and page type before proceeding. Do NOT write code yet.

---

### ══ PHASE 1: Hero Design ══

**Agent**: `frontend-specialist` + `ag47-designer-labs-landing-pages`
**Goal**: Define and build the Hero section.

**Actions**:
1. Present the **Hero Option Menu** to the user:

```
🎨 HERO STYLE — Escolhe o tipo de hero:

[A] HeroLabsStandard     — LabHero component, monospace overline, highlight box
[B] HeroCinematic        — Full-bleed background image, large title, bottom gradient fade
[C] HeroMinimalTech      — Blueprint grid background, centered title, status tags
[D] HeroDualColumn       — Left: text + CTA | Right: 3D object or image
[E] HeroCustom           — Descreve o teu hero ideal →
```

2. Based on the choice:
   - **A**: Use `<LabHero />` from `@/app/labs/components`. Ask for: `overline`, `title`, `highlight word`, `description`, `statusTags`, `actions`.
   - **B/C/D**: Generate background image with `generate_image` if none provided. Prompt: *"Technical abstract background for [Service], cosmic/blueprint theme, deep black background, [theme color] accent glows, ultra high resolution."*
   - **E**: Socratic discovery — ask 3 questions to map to nearest pattern.

3. Ask for the **Navbar CTA text** and **primary link** displayed in the hero area.
4. Ask: "Preferes tema escuro clássico (preto) ou queres um tema alternativo? (Lime / Blue / Orange / Tomate / Default)"

5. Build the Hero component.

**🚧 GATE 1 (Hero Approval)**: Present the hero code/preview. User must confirm before sections are added.

---

### ══ PHASE 2: Section Architecture ══

**Agent**: `frontend-specialist`
**Goal**: Define the full page structure — section by section.

**Actions**:
1. Based on the page type, **suggest a recommended section sequence**:

```
📐 SECÇÕES SUGERIDAS para [Service/Page Name]:

ESSENCIAIS (recomendadas):
  ✅ [1] MetricasRestag        — Contadores animados com CountUp (resultados)
  ✅ [2] TechnicalMenuGrid     — Grid de funcionalidades/serviços (cards glassmorphism)
  ✅ [3] GastroEngineeringCycle — Processo sticky-scroll "deck of cards"
  ✅ [4] FAQ_Section            — Acordeões com perguntas frequentes
  ✅ [5] FinalCTA_Bento         — Bento box final com contacto/conversão

EXTRAS (opcionais mas recomendadas):
  ➕ [6] MetricasServicosLP    — Métricas de serviços com barras de % animadas
  ➕ [7] PlanosIntegrados       — Tab switcher de planos/preços embutido
  ➕ [8] ServicosRelacionados   — Grid de outros serviços (cross-sell)
  ➕ [9] TestimonialsCarousel   — Carrossel de depoimentos com glassmorphism
  ➕ [10] InfoRestagNode        — Secção técnica informativa com LabInfoCard

Adiciona, remove ou reordena à tua vontade.
```

2. For **Mini-App Frontpages** (`/labs/*`), suggest:
   - `LabHero` → `LabCallCard grid` → `LabInfoCard` → `StatusBoard` → `LabVisitCard grid`

3. User confirms or modifies the list.
4. For each confirmed section, ask: *"Tens conteúdo para esta secção ou quero que eu gere texto placeholder técnico?"*

**🚧 GATE 2 (Architecture Lock)**: Final confirmed section list before any section code is written. Show full list for approval.

---

### ══ PHASE 3: Section-by-Section Build ══

**Agent**: `frontend-specialist` + `ag47-designer-labs-landing-pages` + `ag47-designer-labs-miniapps-frontpages`
**Goal**: Build each approved section, one by one, with user review between each.

**For each section, follow this build loop**:

```
🔨 BUILDING: [Section Name]
```

#### Pattern Library — Section Templates:

**MetricasRestag / MetricasServicosLP**:
- Centered counters with `CountUp` animation (trigger on viewport enter).
- Optional: % progress bars using `motion` width transitions.
- Use `textVoice` token for labels, white for values.
- `MetricasServicosLP` variant: horizontal layout with bar for each metric.

**TechnicalMenuGrid**:
- 2-3 column responsive grid of glassmorphism cards.
- Each card: icon (Lucide), title, short description, optional `Saber mais` expand.
- Cards use `backdrop-blur-xl`, `bg-white/5`, `border-white/10`.
- Large watermark text (opacity 0.05) inside each card.
- Staggered entrance animation (`y: 20`, `opacity: 0 → 1`).

**GastroEngineeringCycle** (Sticky Scroll):
- Zero-height sticky stack: each step card covers the previous.
- Pattern: `position: sticky`, `top: 0`, `height: 0`, `overflow: visible`.
- `marginTop: index * 60vh` as scroll trigger offset.
- `zIndex: index + 1` so each card layers above.
- Card content: step number, title, description, `Metadata_Log` footer.
- Run `python scripts/generate_cycle.py` if available to scaffold the code.

**FAQ_Section**:
- Clean border-bottom accordions using `AnimatePresence`.
- No cards — flat, minimal layout.
- Use `chevron-down` Lucide icon with rotation on open.

**FinalCTA_Bento**:
- Large glassmorphism container or Bento-box layout.
- `mailto:` link + secondary navigation links.
- Theme primary color glow effect behind the CTA button.

**PlanosIntegrados**:
- Tab switcher pattern (reference `PlanosClient.tsx`).
- Embed directly in LP, no separate page redirect.

**ServicosRelacionados**:
- Card grid from `ServicosClient.tsx` design.
- 3-4 cards max, linking to other service LPs.

**Actions per section**:
1. Write the section component code.
2. Integrate into the main `[slug]Client.tsx`.
3. Show user the code and ask: *"✅ Aprovado? ou tens alterações para esta secção?"*
4. Apply changes if requested, then move to next section.

**🚧 GATE 3 (Incremental Review)**: Each section requires user approval before the next one starts. No batch-writing sections without review.

---

### ══ PHASE 4: Navbar + Scroll HUD ══

**Agent**: `frontend-specialist`
**Goal**: Build the sticky navbar, ScrollProgressBar (Comet), and % HUD counter.

**Actions**:
1. Ask: *"O navbar é global (já existe) ou específico desta página?"*

2. **If page-specific navbar** — build it:
```tsx
// Sticky HUD Navbar — Labs Blueprint
<header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden shadow-2xl">
  <div className="relative max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
    {/* Logo | Nav Links | CTA Button */}
  </div>
  <ScrollProgressBar /> {/* The Comet — thin progress line at bottom of header */}
</header>
```

3. **Nav Links**: Ask user for the section anchors to include (these correspond to confirmed sections from Phase 2). Auto-generate `id` anchors for each section.

4. **ScrollProgressBar (Comet Bar)**:
   - Thin bar (2-3px) at the bottom of the header.
   - Uses `useScroll` from framer-motion.
   - Color: `theme.colors.primary` with a glowing tail effect.
   - Width: `scaleX` transforms from 0 to 1.

5. **Percentage HUD Counter** (bottom-right fixed):
```tsx
// Fixed bottom-right scroll % indicator — starts at 47%
<div className="fixed bottom-6 right-6 z-40 font-mono text-xs border border-white/10 bg-black/60 backdrop-blur-xl px-3 py-2 rounded-full">
  <span style={{ color: theme.colors.primary }}>
    {Math.round(47 + scrollYProgress * 53)}%
  </span>
  <span className="text-white/30 ml-1">LOADED</span>
</div>
```

6. Ask: *"Queres barras de % no navbar para indicar completude das secções?"* If yes, add progress segment indicators.

**🚧 GATE 4 (HUD Approval)**: Show navbar + comet bar + % HUD. Confirm before final assembly.

---

### ══ PHASE 5: Design System & Final Assembly ══

**Agent**: `frontend-specialist` + `ag47-designer-labs-landing-pages`
**Goal**: Apply theme tokens, generate backgrounds, assemble the full page, add SEO metadata.

**Actions**:

1. **Background Layer** (apply to page wrapper):
   - Blueprint grid: `background-image: repeating-linear-gradient(...)` subtle grid.
   - Nebula image: `opacity-30`, `blur-sm`, fixed position.
   - Ambient glow circles: 2-3 large `rounded-full blur-3xl` divs using `theme.colors.primary` at 10-15% opacity.

2. **Theme Token Verification** — scan all sections and verify:
   - ✅ `style={{ color: theme.colors.primary }}` for all accents (NOT Tailwind `text-primary`)
   - ✅ `style={{ backgroundColor: theme.colors.primary }}` for highlight backgrounds
   - ✅ `style={{ '--hover-color': theme.colors.primary }}` for card hover effects
   - ✅ `textVoice` token used for all technical labels
   - ✅ `textRestagMarked` / `textRestagMarkedBG` for high-impact highlighted text

3. **SEO Metadata** (in `page.tsx` server component):
```tsx
export const metadata: Metadata = {
  title: '[Service Name] | Agência 47',
  description: '[Compelling 155-char description]',
  openGraph: { title, description, images: ['/og/[slug].jpg'] },
};
```
   Also add JSON-LD structured data for the service.

4. **Final File Assembly**:
   - `app/[route]/page.tsx` — Server component with Metadata export.
   - `app/[route]/[slug]Client.tsx` — Client component with all sections.
   - `app/[route]/data.ts` (optional) — Content data file if sections are data-driven.

5. **Run validation**:
```bash
python .agent/scripts/checklist.py .
```
   Fix any Critical blockers (Security/Lint) before delivery.

**🚧 GATE 5 (Final Delivery Approval)**:
Present the complete file list created/modified. Run through the **Pre-Delivery Checklist**:

```
✅ PRE-DELIVERY CHECKLIST:
□ Navbar: sticky, glassmorphism, ScrollProgressBar present
□ Hero: theme confirmed, CTA working, background generated
□ Sections: all approved sections implemented with correct patterns
□ Scroll HUD: Comet bar + % counter bottom-right
□ Theme tokens: all using theme.colors.primary (not Tailwind)
□ Watermarks: present in cards at opacity 0.05
□ Animations: framer-motion entrance + scroll-triggered
□ SEO: page.tsx has Metadata + JSON-LD
□ Responsive: px-4/px-6 mobile padding, responsive grids
□ Lint: no TypeScript errors
```

---

## 📋 QUICK REFERENCE — Section Name Registry

| Section Name | Pattern | Use Case |
|---|---|---|
| `HeroRestagNode_Registry` | HeroLabsStandard | Mini-app hero |
| `MetricasRestag` | CountUp counters | Results/KPIs |
| `MetricasServicosLP` | CountUp + % bars | Service metrics |
| `TechnicalMenuGrid` | Glassmorphism card grid | Features/services |
| `GastroEngineeringCycle` | Sticky scroll stack | Step-by-step process |
| `InfosRestagNode` | LabInfoCard | Technical info boxes |
| `FAQ_Section` | Accordion | Common questions |
| `FinalCTA_Bento` | Bento box | Conversion + contact |
| `PlanosIntegrados` | Tab switcher | Pricing/plans |
| `ServicosRelacionados` | Card grid | Cross-sell |
| `TestimonialsCarousel` | Framer carousel | Social proof |

---

## 🎨 DESIGN SYSTEM TOKENS (Quick Reference)

| Token | Usage | Value |
|---|---|---|
| `theme.colors.primary` | Accents, CTAs, glows | Dynamic (Lime/Blue/Orange/Tomate) |
| `textVoice` | Technical labels, overlines | CSS var from ThemeContext |
| `textRestagMarked` | Highlighted inline text | CSS var — high-impact accent |
| `textRestagMarkedBG` | Highlight background | CSS var — accent with opacity |
| Glassmorphism | Cards, modals, nav | `bg-white/5 backdrop-blur-xl border-white/10` |
| Watermarks | Card background text | `opacity-[0.05]` monospace, scale `w-48→w-72` |
| Entrance animation | All card/section entries | `y: 20 → 0`, `opacity: 0 → 1`, `duration: 0.8s` |
| Hover animation | Card title highlights | `duration: 0.5s`, `--hover-color` CSS var |

---

## 💻 USAGE EXAMPLES

```
/ag47-designer-build-labs-pages nova LP do serviço Restag
/ag47-designer-build-labs-pages editar a página /labs/ia/agent
/ag47-designer-build-labs-pages criar a frontpage do mini-app Solda IA
/ag47-designer-build-labs-pages landing page do serviço de SEO com planos integrados
/ag47-designer-build-labs-pages nova página /servicos/consultoria com hero cinematico
```

---

## ⚠️ MANDATORY RULES

1. **Never skip Gates** — each gate requires explicit user approval.
2. **Never batch-write** all sections at once without incremental review.
3. **Always load both skills** before writing code.
4. **Always use `theme.colors.primary`** — never hardcode hex values or Tailwind color classes for theme accents.
5. **Always add `id` anchors** to sections for navbar smooth-scroll.
6. **Always generate background** if none is provided (`generate_image` tool).
7. **Purple Ban**: No violet/purple tones. Stick to the 5 approved themes.
8. **No template layouts**: Every page must feel custom, not generic.
