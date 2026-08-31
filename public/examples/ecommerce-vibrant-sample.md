---
spec_version: "1.0"
name: "E-Commerce Vibrant Design System"
version: "1.0.0"
platform: "universal"
description: "Design System dinâmico e de alta conversão para e-commerce moderno, moda, bens de consumo e marketplaces com acentos Coral Sunset."
theme: "ecommerce-coral"
supported_modes: "both"
author: "Agência 47 Labs"
last_updated: "2026-09-01"
---

# E-Commerce Vibrant Design System Specification

> Especificação oficial do E-Commerce Vibrant para validação e visualização determinística na bancada AG47 Labs Skills.

---

## 1. IDENTITY & PRINCIPLES

- **Visual Direction:** Energia visual vibrante, botões com cantos arredondados generosos (pill buttons), paleta viva com Coral Sunset (#FF5941 / #FF7A59) e acentos Amber, fotografia de produto em destaque e tipografia convidativa.
- **Brand Personality:** Vibrante, Envolvente, Confiável, Premium, Dinâmico.
- **Principles:**
  - O produto e o valor da compra são o herói visual da página.
  - CTAs de "Comprar Agora" e "Adicionar à Sacola" possuem peso ótico irresistível.
  - Micro-interações de feedback em cada toque de favoritar e adicionar ao carrinho.
- **DO:**
  - Utilizar Coral Sunset para botões de conversão e badges de frete grátis/promoção.
  - Aplicar raios de 16px para cards e 9999px (full pill) para botões de checkout.
- **DON'T:**
  - Não poluir os cards de produto com mais de 2 badges simultâneos.
  - Não esconder o preço original quando houver desconto tachado.

---

## 2. COLOR PALETTE

| Token ID | Token Name | Light Value | Dark Value | Usage | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `primary` | Coral Sunset | `#E11D48` | `#FF5941` | Botão Comprar, Adicionar ao Carrinho e Destaques | `DEFINED` |
| `secondary` | Warm Charcoal | `#475569` | `#94A3B8` | Filtros de categoria, guias de tamanho e botões secundários | `DEFINED` |
| `accent` | Golden Honey | `#D97706` | `#FBBF24` | Avaliações de clientes (estrelas) e cupom de desconto | `DEFINED` |
| `background` | Canvas Background | `#FFFBF8` | `#0D0C0E` | Superfície base da loja virtual | `DEFINED` |
| `surface` | Product Card Surface | `#FFFFFF` | `#17151B` | Vitrine de produtos, carrossel de itens e avaliações | `DEFINED` |
| `surface_elevated` | Cart Drawer Surface | `#FFFFFF` | `#221F28` | Drawer de carrinho, popups de cupom e busca modal | `DEFINED` |
| `text_primary` | Product Title Text | `#18181B` | `#FAF9FB` | Nomes de produtos, títulos de coleção e preços | `DEFINED` |
| `text_secondary` | Variant Text | `#52525B` | `#A1A1AA` | Seleção de cores, tamanhos e especificações | `DEFINED` |
| `text_muted` | Discount Cross Text | `#A1A1AA` | `#71717A` | Preço antigo riscado e prazos de entrega | `DEFINED` |
| `border` | Soft Border | `#F4EFEA` | `#2D2936` | Contornos de foto de produto e divisores de checkout | `DEFINED` |
| `success` | In Stock Green | `#10B981` | `#34D399` | Em estoque, frete grátis e pagamento aprovado | `DEFINED` |
| `warning` | Last Units Amber | `#F59E0B` | `#FBBF24` | Poucas unidades restantes e contagem regressiva | `DEFINED` |
| `error` | Sold Out Red | `#EF4444` | `#F87171` | Produto esgotado e cupom inválido | `DEFINED` |
| `info` | Shipping Info Cyan | `#0EA5E9` | `#38BDF8` | Rastreamento de pedido e política de troca | `DEFINED` |

---

## 3. TYPOGRAPHY SCALE

| Level | Name | Font Family | Size | Mobile Size | Weight | Line Height | Tracking | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display` | Collection Hero | `var(--font-sans, system-ui)` | `48px` | `32px` | `800` | `1.1` | `-0.03em` | `DEFINED` |
| `h1` | Heading 1 | `var(--font-sans, system-ui)` | `32px` | `24px` | `700` | `1.2` | `-0.02em` | `DEFINED` |
| `h2` | Product Price | `var(--font-sans, system-ui)` | `26px` | `22px` | `800` | `1.2` | `-0.01em` | `DEFINED` |
| `h3` | Section Header | `var(--font-sans, system-ui)` | `20px` | `17px` | `600` | `1.3` | `normal` | `DEFINED` |
| `section_title`| Showcase Header | `var(--font-sans, system-ui)` | `18px` | `16px` | `700` | `1.35` | `0.01em` | `DEFINED` |
| `card_title` | Product Name | `var(--font-sans, system-ui)` | `16px` | `15px` | `600` | `1.35` | `normal` | `DEFINED` |
| `body` | Description | `var(--font-sans, system-ui)` | `15px` | `14px` | `400` | `1.5` | `normal` | `DEFINED` |
| `secondary_body`| Specs Detail | `var(--font-sans, system-ui)` | `13px` | `12px` | `400` | `1.4` | `normal` | `DEFINED` |
| `caption` | Discount Tag | `var(--font-sans, system-ui)` | `11px` | `10px` | `600` | `1.3` | `0.02em` | `DEFINED` |
| `label` | Variant Label | `var(--font-sans, system-ui)` | `13px` | `12px` | `600` | `1.4` | `0.02em` | `DEFINED` |
| `button` | Checkout CTA | `var(--font-sans, system-ui)` | `14px` | `13px` | `700` | `1.0` | `0.02em` | `DEFINED` |
| `data_cell` | SKU / Barcode | `var(--font-mono, monospace)` | `13px` | `12px` | `500` | `1.3` | `normal` | `DEFINED` |
| `metadata` | Order Meta | `var(--font-mono, monospace)` | `11px` | `10px` | `400` | `1.2` | `0.04em` | `DEFINED` |

---

## 4. SPACING SYSTEM

- **Base Unit:** 4px
- **Values:**
  - `xs`: 4px
  - `sm`: 8px
  - `md`: 16px
  - `lg`: 24px
  - `xl`: 32px
  - `xxl`: 48px
- **Status:** `DEFINED`

---

## 5. CORNER RADIUS

- **Values:**
  - `none`: 0px
  - `sm`: 6px
  - `md`: 10px
  - `lg`: 16px
  - `xl`: 24px
  - `full`: 9999px
- **Status:** `DEFINED`

---

## 6. ELEVATION & SHADOWS

- **Values:**
  - `none`: none
  - `sm`: 0 2px 4px 0 rgba(0, 0, 0, 0.04)
  - `md`: 0 6px 12px -2px rgba(0, 0, 0, 0.08)
  - `lg`: 0 12px 24px -4px rgba(225, 29, 72, 0.15)
  - `xl`: 0 20px 32px -6px rgba(0, 0, 0, 0.22)
- **Status:** `DEFINED`

---

## 7. BREAKPOINTS

- **Values:**
  - `mobile`: 375px
  - `tablet`: 768px
  - `desktop`: 1024px
  - `wide`: 1440px
- **Status:** `DEFINED`

---

## 8. CORE COMPONENT SPECIFICATIONS

### 8.1 Button Suite

| Variant | State | Background | Text Color | Border | Shadow | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `primary` | `default` | `var(--color-primary)` | `#FFFFFF` | `none` | `var(--shadow-md)` | `DEFINED` |
| `primary` | `hover` | `#BE123C` | `#FFFFFF` | `none` | `var(--shadow-lg)` | `DEFINED` |
| `primary` | `active` | `#9F1239` | `#FFFFFF` | `none` | `none` | `DEFINED` |
| `primary` | `focus` | `var(--color-primary)` | `#FFFFFF` | `2px solid #FDA4AF` | `none` | `DEFINED` |
| `primary` | `disabled` | `#3F3F46` | `#71717A` | `none` | `none` | `DEFINED` |
| `secondary` | `default` | `var(--color-surface)` | `var(--color-text-primary)` | `1px solid var(--color-border)` | `var(--shadow-sm)` | `DEFINED` |
| `secondary` | `hover` | `var(--color-surface-elevated)` | `var(--color-text-primary)` | `1px solid #52525B` | `none` | `DEFINED` |
| `ghost` | `default` | `transparent` | `var(--color-text-secondary)` | `none` | `none` | `DEFINED` |
| `ghost` | `hover` | `var(--color-surface-elevated)` | `var(--color-text-primary)` | `none` | `none` | `DEFINED` |
| `destructive` | `default` | `var(--color-error)` | `#FFFFFF` | `none` | `var(--shadow-sm)` | `DEFINED` |

### 8.2 Form Controls

| Control | State | Background | Border | Text Color | Ring/Focus | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `input_text` | `default` | `var(--color-surface)` | `1px solid var(--color-border)` | `var(--color-text-primary)` | `none` | `DEFINED` |
| `input_text` | `focus` | `var(--color-surface)` | `1px solid var(--color-primary)` | `var(--color-text-primary)` | `0 0 0 2px rgba(255,89,65,0.2)` | `DEFINED` |
| `input_text` | `disabled` | `#18181B` | `1px solid #27272A` | `var(--color-text-muted)` | `none` | `DEFINED` |
| `checkbox` | `checked` | `var(--color-primary)` | `none` | `#FFFFFF` | `none` | `DEFINED` |
| `switch` | `active` | `var(--color-primary)` | `none` | `#FFFFFF` | `none` | `DEFINED` |

### 8.3 Badges & Status Tags

| Type | Background | Text Color | Border | Status |
| :--- | :--- | :--- | :--- | :--- |
| `default` | `rgba(255,89,65,0.15)` | `#FF7A59` | `1px solid rgba(255,89,65,0.3)` | `DEFINED` |
| `success` | `rgba(16,185,129,0.15)` | `#34D399` | `1px solid rgba(16,185,129,0.3)` | `DEFINED` |
| `warning` | `rgba(245,158,11,0.15)` | `#FBBF24` | `1px solid rgba(245,158,11,0.3)` | `DEFINED` |
| `error` | `rgba(239,68,68,0.15)` | `#F87171` | `1px solid rgba(239,68,68,0.3)` | `DEFINED` |

### 8.4 Cards & Surfaces

| Card Type | Background | Border | Radius | Padding | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `standard` | `var(--color-surface)` | `1px solid var(--color-border)` | `var(--radius-lg)` | `var(--spacing-md)` | `DEFINED` |
| `interactive`| `var(--color-surface)` | `1px solid var(--color-border)` | `var(--radius-lg)` | `var(--spacing-md)` | `DEFINED` |

---

## 9. ACCESSIBILITY CONTRACT

- `wcag_target`: AA
- `color_contrast_min`: "4.5:1"
- `keyboard_navigable`: true
- `screen_reader_tested`: true
- **Status:** `DEFINED`
