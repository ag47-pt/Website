---
spec_version: "1.0"
name: "SaaS Dark Design System"
version: "1.0.0"
platform: "universal"
description: "Design System para plataformas SaaS B2B modernas, com foco em densidade de dados, micro-interações e tema dark refinado com acentos Electric Indigo."
theme: "saas-obsidian"
supported_modes: "both"
author: "Agência 47 Labs"
last_updated: "2026-09-01"
---

# SaaS Dark Design System Specification

> Especificação oficial do SaaS Dark para validação e visualização determinística na bancada AG47 Labs Skills.

---

## 1. IDENTITY & PRINCIPLES

- **Visual Direction:** Superfícies Obsidian profundas, acentos Electric Indigo (#6366F1 / #4F46E5), tipografia Inter/Geist limpa, bordas de 1px com transparência de 12% e contraste otimizado para longas sessões de trabalho.
- **Brand Personality:** Confiável, Robusto, Produtivo, Escalável, Tecnológico.
- **Principles:**
  - Eficiência máxima de espaço sem poluição visual.
  - Hierarquia de camadas clara (Background > Canvas > Card > Popover).
  - Estados visuais de foco e atalho de teclado sempre explícitos.
- **DO:**
  - Utilizar Electric Indigo para ações primárias e estados de foco.
  - Manter raio de 8px para botões e 12px para cards.
- **DON'T:**
  - Não misturar sombras coloridas pesadas em superfícies escuras.
  - Não esconder textos de suporte críticos atrás de tooltips.

---

## 2. COLOR PALETTE

| Token ID | Token Name | Light Value | Dark Value | Usage | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `primary` | Electric Indigo | `#4F46E5` | `#6366F1` | Botões primários, links ativos e badges de status | `DEFINED` |
| `secondary` | Cool Slate | `#64748B` | `#94A3B8` | Ações secundárias e bordas de suporte | `DEFINED` |
| `accent` | Violet Pulse | `#7C3AED` | `#A855F7` | Notificações de upgrade e destaques pro | `DEFINED` |
| `background` | Canvas Background | `#F8FAFC` | `#0B0F19` | Superfície base de toda a aplicação | `DEFINED` |
| `surface` | Surface Layer | `#FFFFFF` | `#111827` | Containers, tabelas e cards principais | `DEFINED` |
| `surface_elevated` | Elevated Popover | `#FFFFFF` | `#1F2937` | Menus dropdown, modais e sidebars | `DEFINED` |
| `text_primary` | Primary Text | `#0F172A` | `#F9FAFB` | Títulos, métricas e labels principais | `DEFINED` |
| `text_secondary` | Secondary Text | `#475569` | `#9CA3AF` | Subtítulos e dados contextuais | `DEFINED` |
| `text_muted` | Muted Text | `#94A3B8` | `#6B7280` | Timestamps e metadados secundários | `DEFINED` |
| `border` | Subtle Border | `#E2E8F0` | `#1F2937` | Divisores de seção e contornos de cards | `DEFINED` |
| `success` | Emerald Success | `#10B981` | `#34D399` | Status ativo, deploy concluído e sucesso | `DEFINED` |
| `warning` | Amber Alert | `#F59E0B` | `#FBBF24` | Quotas próximas do limite e avisos | `DEFINED` |
| `error` | Rose Destructive | `#F43F5E` | `#FB7185` | Falhas de build, cancelamentos e erros | `DEFINED` |
| `info` | Sky Information | `#0EA5E9` | `#38BDF8` | Dicas e notas informativas de produto | `DEFINED` |

---

## 3. TYPOGRAPHY SCALE

| Level | Name | Font Family | Size | Mobile Size | Weight | Line Height | Tracking | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display` | Display Hero | `var(--font-sans, system-ui)` | `48px` | `32px` | `800` | `1.1` | `-0.03em` | `DEFINED` |
| `h1` | Heading 1 | `var(--font-sans, system-ui)` | `32px` | `24px` | `700` | `1.2` | `-0.02em` | `DEFINED` |
| `h2` | Heading 2 | `var(--font-sans, system-ui)` | `24px` | `20px` | `700` | `1.25` | `-0.01em` | `DEFINED` |
| `h3` | Heading 3 | `var(--font-sans, system-ui)` | `18px` | `16px` | `600` | `1.3` | `normal` | `DEFINED` |
| `section_title`| Section Title | `var(--font-sans, system-ui)` | `16px` | `14px` | `600` | `1.35` | `0.01em` | `DEFINED` |
| `card_title` | Card Title | `var(--font-sans, system-ui)` | `15px` | `14px` | `600` | `1.35` | `normal` | `DEFINED` |
| `body` | Body Text | `var(--font-sans, system-ui)` | `14px` | `13px` | `400` | `1.5` | `normal` | `DEFINED` |
| `secondary_body`| Small Body | `var(--font-sans, system-ui)` | `13px` | `12px` | `400` | `1.4` | `normal` | `DEFINED` |
| `caption` | Caption | `var(--font-sans, system-ui)` | `11px` | `10px` | `500` | `1.3` | `0.02em` | `DEFINED` |
| `label` | Label | `var(--font-sans, system-ui)` | `12px` | `11px` | `600` | `1.4` | `0.02em` | `DEFINED` |
| `button` | Button Text | `var(--font-sans, system-ui)` | `13px` | `12px` | `600` | `1.0` | `0.01em` | `DEFINED` |
| `data_cell` | Data Cell | `var(--font-mono, monospace)` | `13px` | `12px` | `500` | `1.3` | `normal` | `DEFINED` |
| `metadata` | Code Tag | `var(--font-mono, monospace)` | `11px` | `10px` | `500` | `1.2` | `0.04em` | `DEFINED` |

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
  - `sm`: 4px
  - `md`: 8px
  - `lg`: 12px
  - `xl`: 16px
  - `full`: 9999px
- **Status:** `DEFINED`

---

## 6. ELEVATION & SHADOWS

- **Values:**
  - `none`: none
  - `sm`: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
  - `md`: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
  - `lg`: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)
  - `xl`: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.15)
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
| `primary` | `default` | `var(--color-primary)` | `#FFFFFF` | `none` | `var(--shadow-sm)` | `DEFINED` |
| `primary` | `hover` | `#4338CA` | `#FFFFFF` | `none` | `var(--shadow-md)` | `DEFINED` |
| `primary` | `active` | `#3730A3` | `#FFFFFF` | `none` | `none` | `DEFINED` |
| `primary` | `focus` | `var(--color-primary)` | `#FFFFFF` | `2px solid #818CF8` | `none` | `DEFINED` |
| `primary` | `disabled` | `#374151` | `#9CA3AF` | `none` | `none` | `DEFINED` |
| `secondary` | `default` | `var(--color-surface)` | `var(--color-text-primary)` | `1px solid var(--color-border)` | `var(--shadow-sm)` | `DEFINED` |
| `secondary` | `hover` | `var(--color-surface-elevated)` | `var(--color-text-primary)` | `1px solid #4B5563` | `none` | `DEFINED` |
| `ghost` | `default` | `transparent` | `var(--color-text-secondary)` | `none` | `none` | `DEFINED` |
| `ghost` | `hover` | `var(--color-surface-elevated)` | `var(--color-text-primary)` | `none` | `none` | `DEFINED` |
| `destructive` | `default` | `var(--color-error)` | `#FFFFFF` | `none` | `var(--shadow-sm)` | `DEFINED` |

### 8.2 Form Controls

| Control | State | Background | Border | Text Color | Ring/Focus | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `input_text` | `default` | `var(--color-surface)` | `1px solid var(--color-border)` | `var(--color-text-primary)` | `none` | `DEFINED` |
| `input_text` | `focus` | `var(--color-surface)` | `1px solid var(--color-primary)` | `var(--color-text-primary)` | `0 0 0 2px rgba(99,102,241,0.2)` | `DEFINED` |
| `input_text` | `disabled` | `#1F2937` | `1px solid #374151` | `var(--color-text-muted)` | `none` | `DEFINED` |
| `checkbox` | `checked` | `var(--color-primary)` | `none` | `#FFFFFF` | `none` | `DEFINED` |
| `switch` | `active` | `var(--color-primary)` | `none` | `#FFFFFF` | `none` | `DEFINED` |

### 8.3 Badges & Status Tags

| Type | Background | Text Color | Border | Status |
| :--- | :--- | :--- | :--- | :--- |
| `default` | `rgba(99,102,241,0.15)` | `#818CF8` | `1px solid rgba(99,102,241,0.3)` | `DEFINED` |
| `success` | `rgba(16,185,129,0.15)` | `#34D399` | `1px solid rgba(16,185,129,0.3)` | `DEFINED` |
| `warning` | `rgba(245,158,11,0.15)` | `#FBBF24` | `1px solid rgba(245,158,11,0.3)` | `DEFINED` |
| `error` | `rgba(244,63,94,0.15)` | `#FB7185` | `1px solid rgba(244,63,94,0.3)` | `DEFINED` |

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
