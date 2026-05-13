---

name: ag47-designer-labs-landing-pages
description: "Create, recreate, or edit high-end Landing Pages (LPs) for Agência 47's Labs sector. Use this skill when the user wants to build immersive, technical, and high-conversion LPs that follow the 'Labs Blueprint' aesthetic, including sticky scroll animations, glassmorphism, and integrated service/pricing modules."

---


# Ag47 Designer Labs: Landing Pages

This skill provides the architectural and design blueprint for creating premium Landing Pages (LPs) within the Agência 47 ecosystem. It ensures every LP is not just a page, but an immersive experience.

## Triggering
Trigger this skill whenever the user mentions:
- "Criar uma nova LP de serviço"
- "Editar a página de [serviço]"
- "Recriar a landing page de [X]"
- "Adicionar uma secção de planos à LP"
- "Melhorar o design da LP seguindo o padrão Labs"

## 1. Core Design Philosophy (Labs Blueprint)
- **Palette**: Dark-first. Backgrounds should be deep black (#000000) or very dark grey.
- **Dynamic Tokenization**: Use 	heme.colors.textVoice for technical labels and 	extRestagMarked/	extRestagMarkedBG for high-impact highlighted text.
- **Atmosphere**: Use nebulous, cosmic, or technical background images with low opacity (30%) and blur (4px).
- **Glassmorphism**: UI elements must use ackdrop-blur-xl, g-white/5, and subtle order-white/10.
- **Watermark Layering**: Apply low-opacity (5%), high-scale monospaced text (e.g., 'L47', 'TIME_REF') as background stickers inside Bento cards to reinforce the technical/experimental feel.
- **Typography**: Bold, high-contrast headings. Use a mix of white and low-opacity white (60-70%) for hierarchy.
- **Animations**: Fluid motion using ramer-motion. Prefer scroll-driven animations and sticky positioning.

## 2. Page Structure & Components

### 2.1 Hero Section
- **Panoramic Background**: Use `scale-x-[2]` on background images and pull them up using `mt-[-200px] pt-[200px]` to cover the space under the fixed navbar.
- **Atmospheric Overlays**: Use a bottom gradient fade to black and a secondary opacity-30 radial glow centered on the theme's primary color.
- **Title Highlighting**: Use the `*text*` syntax for highlights. The component must render these with the theme's highlight color and a `drop-shadow`.
- **CTA**: Prominent "Começar Agora" button with theme primary color and hover scaling.

### 2.2 Results/Metrics Bar
- **Interaction**: Centered counters with `CountUp` animation.
- **Details**: Optional expandable descriptions for each metric using `AnimatePresence`.

### 2.3 Value Propositions
- **Layout**: Grid of cards.
- **Design**: Glassmorphism cards that expand on click ("Saber mais") to show deeper insights.
- **Icons**: Use Lucide icons or simple emojis that match the semantic context.

### 2.4 Sticky Scroll Process (Natural Stacking Deck)
- **Effect**: Implement a 'deck of cards' transition using a natural flow. Cards appear one by one and stack at the top.
- **Pattern**: Use a flex column with a significant gap (e.g., `gap-[30vh]`). Set each card to `sticky`.
- **Offsets**: Each card `i` should have `top: ${100 + i * 32}px`. This creates the layered stacking effect as you scroll.
- **Z-Index**: Increment `zIndex` with the index so the next card layers above the previous.
- **Unlock**: The scroll unlocks naturally when the flex container ends, bringing the next section into view without artificial spacers.

### 2.5 Integrated Modules
- **Pricing/Plans**: Embed a pricing section directly in the LP. Use the "Tab Switcher" pattern from `PlanosClient.tsx` to toggle between options.
- **Services Grid**: Include a "Other Services" section using the card design from `ServicosClient.tsx` to encourage cross-selling.

### 2.6 FAQ & CTA Final
- **FAQ**: Clean, border-bottom accordions.
- **Final CTA**: A "Bento Box" style container or a large glassmorphism card with a mailto link and secondary links to other sections.

## 3. Technical Rules
- **Framework**: Next.js (App Router).
- **Styling**: Tailwind CSS + Inline styles for dynamic theme colors (from `ThemeContext`).
- **Icons**: Lucide-react.
- **Animation**: `framer-motion` (use `Variants`, `useScroll`, `useTransform`).
- **Data**: Prefer driving content from a central data file (e.g., `data/services.ts`) but allow full component customization for unique LPs.

## 4. Asset Generation
- **Backgrounds**: If the user doesn't provide an image, use the `generate_image` tool.
- **Prompting**: "Technical abstract background for [Service Name], cosmic theme, deep blues and blacks, high resolution, minimalist."

## 5. Implementation Workflow
1. **Analyze Input**: Identify the service, its core value, and target audience.
2. **Setup Theme**: Use `useTheme` to ensure consistency with the user's selected mode.
3. **Draft Structure**: Define the sequence of sections.
4. **Code Component**: Create or modify the `[slug]Client.tsx` component.
5. **SEO & Metadata**: Ensure `page.tsx` (server component) has correct Metadata and JSON-LD.

## 6. Navigation & Targets
- **Scroll Offset**: Always use an offset of **50px to 80px** in navigation functions to compensate for fixed headers.
- **Section Padding**: Use `pt-12` or `scroll-mt-20` on section IDs to ensure content isn't buried too deep in the viewport when navigated to.
