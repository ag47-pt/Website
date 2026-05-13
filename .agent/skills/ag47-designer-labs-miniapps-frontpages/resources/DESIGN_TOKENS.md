# Ag47 Labs Design Tokens

This document outlines the visual constants used across the Ag47 Labs ecosystem.

## Color Themes

| Theme | Primary Color | Secondary | Background | Text |
|-------|---------------|-----------|------------|------|
| **Default** | `#ec4899` (Pink) | `#000000` | Black | White/Gray |
| **Lime** | `#D1FF00` (Lime) | `#000000` | Black | White/Gray |
| **Orange** | `#ffaa00` (Amber) | `#000000` | Black | White/Gray |
| **Blue** | `#0059ff` (Azure) | `#000000` | Black | White/Gray |
| **Tomate** | `#FF0000` (Red) | `#000000` | Black | White/Gray |

## Typography & Components

### 1. Hero Hierarchy
- **Overline**: Font Mono, 12-14px, tracking 0.2em, Uppercase. Color: Primary.
- **Title**: Font Sans (Inter/Outfit), 48-72px, Bold, Tracking Tighter.
- **Dynamic Text Tokens**:
    - 	extVoice: Used for technical labels and technical metadata titles. (Dynamic color from theme).
    - 	extRestagMarked: High-impact highlighted text color.
    - 	extRestagMarkedBG: Background color for highlighted text boxes.
- **Highlight**: Inline background 	heme.colors.textRestagMarkedBG with 	heme.colors.textRestagMarked text. Used via 
enderFormattedText with *asterisks* syntax.

### 2. Status Tags (Interactive)
Status tags are small pills (`bg-white/5`, `border-white/10`) with a colored dot.
The dot MUST have an `onClick` that triggers `setTheme` based on its color:
- Green dot -> `lime`
- Blue dot -> `blue`
- Yellow dot -> `orange`
- Pink dot -> `default`
- Red dot -> `tomate`

### 3. Cards & Navigation — Overtitle Rule

Every card in the Labs ecosystem **MUST display the folder path as an overtitle** above the card title. This reinforces the "technical directory" aesthetic of the Labs.

#### LabCallCard Overtitle (navigation cards on `/labs`)
```tsx
// Font Mono, UPPERCASE, tracking 0.2em
// Color: theme.colors.primary — passed via inline style (NOT Tailwind text-primary)
<div
  className="text-[10px] font-mono tracking-[0.2em] uppercase"
  style={{ color: theme.colors.primary }}
>
  .{path}
</div>
<h3 className="text-2xl font-bold text-white tracking-tighter leading-tight ...">
  {title}
</h3>
```

#### LabVisitCard Overtitle (project cards on `/labs/dev`)
```tsx
// Two parts: path (primary color) + client name (gray-500)
// Separated by a muted slash. All UPPERCASE, tracking 0.1em.
<div className="text-[9px] font-mono flex items-center gap-2 tracking-[0.1em] uppercase">
  <span style={{ color: theme.colors.primary }}>.{path || `/labs/sandbox/${slug}`}</span>
  <span className="text-white/10">/</span>
  <span className="text-gray-500">{client}</span>
</div>
<h3 className="text-xl font-bold text-white tracking-tighter ...">
  {name}
</h3>
```

**Overtitle Rules (MANDATORY):**
- Path MUST start with `.` (dot-notation, e.g. `./labs/dev`).
- Font MUST be `font-mono`.
- Color MUST use `style={{ color: theme.colors.primary }}` directly — NOT `className="text-primary"` (NexusAI CSS vars can override it in admin context).
- Title MUST have `tracking-tighter`.

### 4. Dynamic Hover Effects — Highlight Rule

Card titles MUST use the **Highlight pattern** on hover: the title background becomes `theme.colors.primary` and the text turns black. This mirrors the `<LabHero>` inline highlight box and reacts to the active theme in real-time.

**Implementation via CSS Custom Property:**
```tsx
// Step 1: Inject the primary color as a CSS variable on the card's root element
<motion.div
  className="group ..."
  style={{ '--hover-color': theme.colors.primary } as React.CSSProperties}
>

  {/* Step 2: Apply the highlight pattern on the title */}
  <h3 className="
    text-2xl font-bold text-white tracking-tighter leading-tight
    transition-all duration-500
    inline-block
    group-hover:bg-[var(--hover-color)]
    group-hover:text-black
    px-2 rounded-lg -ml-2
  ">
    {title}
  </h3>
</motion.div>
```

**Hover Effect Rules (MANDATORY):**
- ALWAYS use the `--hover-color` CSS variable (NOT `group-hover:text-primary` — Tailwind's `text-primary` is static and won't follow theme switches).
- Transition duration: `500ms` (design system standard for hover effects).
- Title must be `inline-block` so the background clamps to text width.
- Apply negative margin (`-ml-{x}`) to compensate for the added padding so text stays visually left-aligned.
- This effect is **theme-reactive**: switching the theme instantly updates the hover color.

### 5. Sticky Navbar
- Z-50, `backdrop-blur-xl`, `border-b border-white/5`.
- **Scroll Comet**: Attached under the navbar. Width 0–100% based on scroll position. Color: Primary.
- **Scroll Percentage HUD**: Fixed bottom-right, `font-mono`, 10px.

### 6. Watermarks & Stickers
- **VisitCard**: Size `w-48 h-48`, Position `-top-12 -right-12`, Rotation `rotate-12`.
- **CallCard**: Size `w-72 h-72`, Position `-top-16 -right-16`, Rotation `-rotate-12`.
- **Opacity**: Default `0.05`, Hover `0.15`.
- **Interaction**: Rotate to `0deg` on hover with `transition-all duration-700`.

## Animations

- **Standard Easing**: `[0.27, 1, 0.45, 1]` (Custom Quintic-like curve).
- **Main Entrance Transition**: `0.8s`.
- **Hover Transition**: `0.5s` (`duration-500`).
- **Watermark/Rotation Transition**: `0.7s` (`duration-700`).
- **Card Entrance**: Staggered children with `y: 20` initial offset, `once: true` viewport trigger.

## Global Background Effect

Use the `GridBackground` component from the `servicos` or `labs` layouts:
- Grid color: `rgba(255, 255, 255, 0.03)`.
- Radial Mask: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`.
- Center glow matching `theme.colors.primary` at 5-10% opacity.

## 7. Complex Layout Physics
This section outlines advanced CSS/Framer-Motion patterns for immersive technical interfaces.\n\n### 7.1 Zero-Height Sticky Stack (Card Deck Effect)\nUsed to create a sequence where cards stack perfectly on top of each other without affecting the vertical flow of the page.\n\n- **Container**: Use a relative container with enough padding bottom (e.g., pb-[20vh]) to allow the last card to settle.\n- **Card Wrapper**: Each card should be wrapped in a sticky top-0 h-0 overflow-visible container.\n- **Trigger offset**: Use marginTop on the card wrapper to stagger the entrance (e.g., index * 60vh).\n- **Z-Index**: zIndex should be index so higher steps layer above lower ones.\n- **Internal Alignment**: Inside the wrapper, the actual card content should be centered or positioned precisely.

## 8. Section Naming Convention
For technical Labs pages, use the **Technical Registry** nomenclature for component IDs and semantic markers.\n\n- **Pattern**: [Domain][Type]_[Subtype/Registry]\n- **Standard Names**:\n    - Hero[Project]Node_Registry: The primary entry point.\n    - Metricas[Project]: Bento grid for quantitative data.\n    - Infos[Project]: Content sections with technical abstracts.\n    - [Process]EngineeringCycle: Sticky scroll sequences showing steps.\n    - TechnicalMenuGrid: Navigation or secondary action grids.
