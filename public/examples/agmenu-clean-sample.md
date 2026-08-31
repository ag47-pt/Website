---
spec_version: "1.0"
name: "AGMenu Clean Design System"
version: "1.0.0"
platform: "universal"
description: "Design System de alta performance e densidade visual para restaurantes e cardápios digitais interativos no ecossistema AG47."
theme: "agmenu-oled"
supported_modes: "both"
author: "Agência 47 Labs"
last_updated: "2026-09-01"
---

# AGMenu Clean Design System Specification

> Especificação oficial do AGMenu Clean para validação e visualização determinística na bancada AG47 Labs Skills.

---

## 1. IDENTITY & PRINCIPLES

- **Visual Direction:** Estética OLED, acentos Lime vibrantes (#D1FF00), tipografia grotesk técnica, bordas finas com micro-brilho e alta legibilidade em qualquer iluminação.
- **Brand Personality:** Gourmet, Ágil, Tecnológico, Premium, Imersivo.
- **Principles:**
  - Zero atrito no fluxo de pedido e exploração gastronômica.
  - Fotografia e tipografia como atores centrais da experiência.
  - Feedback tátil imediato em todas as ações de adição e filtro.
- **DO:**
  - Manter botões de ação em Lime de alto contraste contra superfícies escuras.
  - Usar bordas com 1px de espessura e cantos levemente arredondados (8px a 16px).
- **DON'T:**
  - Não utilizar fundos cinzas médios sem contraste.
  - Não sobrepor textos coloridos sem sombra ou container de proteção.

---

## 2. COLOR PALETTE

| Token ID | Token Name | Light Value | Dark Value | Usage | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `primary` | Lime AG47 | `#84CC16` | `#D1FF00` | Botões principais, badges de destaque e CTAs | `DEFINED` |
| `secondary` | Slate Neutral | `#475569` | `#94A3B8` | Subtítulos, contornos secundários | `DEFINED` |
| `accent` | Amber Glow | `#F59E0B` | `#FBBF24` | Itens especiais do chef e promoções | `DEFINED` |
| `background` | Canvas Background | `#F8FAFC` | `#0A0A0C` | Superfície base da aplicação | `DEFINED` |
| `surface` | Card Surface | `#FFFFFF` | `#121216` | Cards de pratos e categorias | `DEFINED` |
| `surface_elevated` | Modal & Drawer Surface | `#FFFFFF` | `#1C1C24` | Detalhes do item e carrinho flutuante | `DEFINED` |
| `text_primary` | Text Primary | `#09090B` | `#F8FAFC` | Nomes de pratos e preços | `DEFINED` |
| `text_secondary` | Text Secondary | `#52525B` | `#A1A1AA` | Descrições de ingredientes | `DEFINED` |
| `text_muted` | Text Muted | `#A1A1AA` | `#71717A` | Informações nutricionais e alérgenos | `DEFINED` |
| `border` | Crisp Border | `#E4E4E7` | `#27272A` | Divisores e contornos de cards | `DEFINED` |
| `success` | Success Emerald | `#10B981` | `#34D399` | Pedido confirmado e disponibilidade | `DEFINED` |
| `warning` | Warning Amber | `#F59E0B` | `#FBBF24` | Estoque limitado e tempo de preparo | `DEFINED` |
| `error` | Error Crimson | `#EF4444` | `#F87171` | Esgotado ou erro de pagamento | `DEFINED` |
| `info` | Info Cyan | `#0EA5E9` | `#38BDF8` | Dicas de harmonização | `DEFINED` |

---

## 3. TYPOGRAPHY SCALE

| Level | Name | Font Family | Size | Mobile Size | Weight | Line Height | Tracking | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display` | Display Hero | `var(--font-sans, system-ui)` | `44px` | `32px` | `800` | `1.1` | `-0.03em` | `DEFINED` |
| `h1` | Heading 1 | `var(--font-sans, system-ui)` | `32px` | `26px` | `700` | `1.2` | `-0.02em` | `DEFINED` |
| `h2` | Heading 2 | `var(--font-sans, system-ui)` | `26px` | `22px` | `700` | `1.25` | `-0.01em` | `DEFINED` |
| `h3` | Heading 3 | `var(--font-sans, system-ui)` | `20px` | `18px` | `600` | `1.3` | `normal` | `DEFINED` |
| `section_title`| Category Header | `var(--font-sans, system-ui)` | `18px` | `16px` | `700` | `1.35` | `0.02em` | `DEFINED` |
| `card_title` | Dish Name | `var(--font-sans, system-ui)` | `17px` | `15px` | `600` | `1.35` | `normal` | `DEFINED` |
| `body` | Description | `var(--font-sans, system-ui)` | `15px` | `14px` | `400` | `1.5` | `normal` | `DEFINED` |
| `secondary_body`| Sub Description | `var(--font-sans, system-ui)` | `13px` | `12px` | `400` | `1.4` | `normal` | `DEFINED` |
| `caption` | Calories/Tag | `var(--font-sans, system-ui)` | `11px` | `10px` | `500` | `1.3` | `0.02em` | `DEFINED` |
| `label` | Form Label | `var(--font-sans, system-ui)` | `13px` | `12px` | `600` | `1.4` | `0.02em` | `DEFINED` |
| `button` | Action Label | `var(--font-sans, system-ui)` | `14px` | `13px` | `700` | `1.2` | `0.03em` | `DEFINED` |
| `price` | Price Highlight | `var(--font-sans, system-ui)` | `22px` | `18px` | `800` | `1.1` | `-0.02em` | `DEFINED` |
| `metadata` | Code/SKU | `var(--font-mono, monospace)` | `11px` | `10px` | `500` | `1.3` | `0.05em` | `DEFINED` |

---

## 4. SPACING & LAYOUT FOUNDATIONS

| Token | Value | Status |
| :--- | :--- | :--- |
| `base_unit` | `4px` | `DEFINED` |
| `xs` | `4px` | `DEFINED` |
| `sm` | `8px` | `DEFINED` |
| `md` | `16px` | `DEFINED` |
| `lg` | `24px` | `DEFINED` |
| `xl` | `36px` | `DEFINED` |
| `section_spacing` | `48px` | `DEFINED` |
| `container_padding` | `16px` | `DEFINED` |

### Radius

| Token | Value | Status |
| :--- | :--- | :--- |
| `xs` | `4px` | `DEFINED` |
| `sm` | `8px` | `DEFINED` |
| `md` | `12px` | `DEFINED` |
| `lg` | `20px` | `DEFINED` |
| `full` | `9999px` | `DEFINED` |

### Borders & Shadows

| Token | Value | Status |
| :--- | :--- | :--- |
| `border_width` | `1px` | `DEFINED` |
| `border_style` | `solid` | `DEFINED` |
| `shadow_sm` | `0 2px 4px rgba(0,0,0,0.06)` | `DEFINED` |
| `shadow_md` | `0 6px 12px -2px rgba(0,0,0,0.12)` | `DEFINED` |
| `shadow_lg` | `0 16px 32px -4px rgba(0,0,0,0.18)` | `DEFINED` |
| `focus_ring` | `0 0 0 3px rgba(209,255,0,0.4)` | `DEFINED` |

---

## 5. MOTION & ANIMATION

| Token | Value | Status |
| :--- | :--- | :--- |
| `duration_fast` | `120ms` | `DEFINED` |
| `duration_normal` | `220ms` | `DEFINED` |
| `duration_slow` | `380ms` | `DEFINED` |
| `easing_default` | `cubic-bezier(0.16, 1, 0.3, 1)` | `DEFINED` |
| `spring` | `spring(1, 120, 14, 0)` | `DEFINED` |
| `reduced_motion` | `prefers-reduced-motion: reduce -> duration 0ms` | `DEFINED` |

---

## 6. COMPONENTS SPECIFICATION

### Button Primary
- **ID:** `button.primary`
- **Category:** `button`
- **Status:** `DEFINED`
- **Radius:** `12px`
- **Padding:** `12px 20px`
- **Font Token:** `button`
- **States:**
  - `default`: bg=`#D1FF00`, text=`#000000`, border=`transparent`, shadow=`0 2px 8px rgba(209,255,0,0.25)`
  - `hover`: bg=`#BAE600`, text=`#000000`, transform=`scale(1.02)`
  - `active`: bg=`#A3CC00`, text=`#000000`, transform=`scale(0.98)`
  - `focus`: shadow=`0 0 0 3px rgba(209,255,0,0.45)`
  - `disabled`: bg=`#3F3F46`, text=`#71717A`, opacity=`0.5`, cursor=`not-allowed`
  - `loading`: opacity=`0.8`, cursor=`wait`

### Button Secondary
- **ID:** `button.secondary`
- **Category:** `button`
- **Status:** `DEFINED`
- **Radius:** `12px`
- **Padding:** `12px 20px`
- **Font Token:** `button`
- **States:**
  - `default`: bg=`rgba(255,255,255,0.06)`, text=`#F8FAFC`, border=`1px solid rgba(255,255,255,0.12)`
  - `hover`: bg=`rgba(255,255,255,0.12)`, text=`#FFFFFF`, border=`1px solid rgba(255,255,255,0.2)`
  - `active`: bg=`rgba(255,255,255,0.18)`
  - `focus`: shadow=`0 0 0 3px rgba(255,255,255,0.2)`
  - `disabled`: opacity=`0.4`, cursor=`not-allowed`

### Button Ghost
- **ID:** `button.ghost`
- **Category:** `button`
- **Status:** `DEFINED`
- **Radius:** `10px`
- **Padding:** `10px 16px`
- **States:**
  - `default`: bg=`transparent`, text=`#A1A1AA`, border=`transparent`
  - `hover`: bg=`rgba(255,255,255,0.08)`, text=`#F8FAFC`
  - `focus`: shadow=`0 0 0 2px rgba(209,255,0,0.3)`
  - `disabled`: opacity=`0.3`, cursor=`not-allowed`

### Button Destructive
- **ID:** `button.destructive`
- **Category:** `button`
- **Status:** `DEFINED`
- **Radius:** `12px`
- **Padding:** `12px 20px`
- **States:**
  - `default`: bg=`#EF4444`, text=`#FFFFFF`, border=`transparent`
  - `hover`: bg=`#DC2626`, text=`#FFFFFF`
  - `focus`: shadow=`0 0 0 3px rgba(239,68,68,0.35)`
  - `disabled`: opacity=`0.4`, cursor=`not-allowed`

### Input (Search & Form)
- **ID:** `input.text`
- **Category:** `input`
- **Status:** `DEFINED`
- **Radius:** `12px`
- **Padding:** `12px 16px`
- **States:**
  - `default`: bg=`#121216`, text=`#F8FAFC`, border=`1px solid #27272A`
  - `focus`: border=`1px solid #D1FF00`, shadow=`0 0 0 3px rgba(209,255,0,0.25)`
  - `error`: border=`1px solid #EF4444`, shadow=`0 0 0 3px rgba(239,68,68,0.25)`
  - `disabled`: bg=`#18181B`, text=`#71717A`, cursor=`not-allowed`

### Checkbox
- **ID:** `checkbox`
- **Category:** `selection`
- **Status:** `DEFINED`
- **Radius:** `6px`
- **States:**
  - `default`: bg=`#18181B`, border=`1px solid #3F3F46`
  - `selected`: bg=`#D1FF00`, border=`1px solid #D1FF00`, text=`#000000`
  - `focus`: shadow=`0 0 0 2px rgba(209,255,0,0.35)`
  - `disabled`: opacity=`0.4`, cursor=`not-allowed`

### Switch / Toggle
- **ID:** `switch`
- **Category:** `selection`
- **Status:** `DEFINED`
- **Radius:** `9999px`
- **States:**
  - `default`: bg=`#27272A`
  - `selected`: bg=`#D1FF00`
  - `disabled`: opacity=`0.4`, cursor=`not-allowed`

### Badge
- **ID:** `badge`
- **Category:** `feedback`
- **Status:** `DEFINED`
- **Radius:** `9999px`
- **Padding:** `4px 12px`
- **States:**
  - `default`: bg=`rgba(255,255,255,0.08)`, text=`#E4E4E7`, border=`1px solid rgba(255,255,255,0.1)`
  - `success`: bg=`rgba(16,185,129,0.15)`, text=`#34D399`, border=`1px solid rgba(16,185,129,0.3)`
  - `warning`: bg=`rgba(245,158,11,0.15)`, text=`#FBBF24`, border=`1px solid rgba(245,158,11,0.3)`
  - `error`: bg=`rgba(239,68,68,0.15)`, text=`#F87171`, border=`1px solid rgba(239,68,68,0.3)`

### Card (Dish Card)
- **ID:** `card.basic`
- **Category:** `card`
- **Status:** `DEFINED`
- **Radius:** `16px`
- **Padding:** `18px`
- **States:**
  - `default`: bg=`#121216`, border=`1px solid #27272A`, shadow=`0 4px 12px rgba(0,0,0,0.2)`
  - `hover`: border=`1px solid #3F3F46`, shadow=`0 8px 24px rgba(0,0,0,0.4)`, transform=`translateY(-3px)`

### Alert (Notice Box)
- **ID:** `alert`
- **Category:** `feedback`
- **Status:** `DEFINED`
- **Radius:** `12px`
- **Padding:** `16px`
- **States:**
  - `default`: bg=`rgba(14,165,233,0.1)`, text=`#38BDF8`, border=`1px solid rgba(14,165,233,0.3)`
  - `warning`: bg=`rgba(245,158,11,0.1)`, text=`#FBBF24`, border=`1px solid rgba(245,158,11,0.3)`
  - `error`: bg=`rgba(239,68,68,0.1)`, text=`#F87171`, border=`1px solid rgba(239,68,68,0.3)`

---

## 7. PATTERNS & LAYOUT SECTIONS

### Hero Section
- **ID:** `pattern.hero`
- **Status:** `DEFINED`
- **Description:** Hero gastronômico com imagem imersiva, título de alto impacto em display e botão CTA em Lime.

### Card Grid Section
- **ID:** `pattern.card_grid`
- **Status:** `DEFINED`
- **Description:** Grid de 2 a 3 colunas para pratos com tags de alérgenos e botão de pedido direto.

### CTA Section
- **ID:** `pattern.cta`
- **Status:** `DEFINED`
- **Description:** Seção de reserva rápida ou pedido online com fundo contrastante e ações diretas.

---

## 8. ACCESSIBILITY & RESPONSIVENESS

- **WCAG Target:** `AA`
- **Color Contrast Minimum:** `4.5:1`
- **Keyboard Navigation:** `true`
- **Screen Reader Tested:** `true`
- **Responsive Strategy:** `mobile_first`
