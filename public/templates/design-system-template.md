---
spec_version: "1.1"
name: "" # Nome do seu Design System
version: "1.0.0"
platform: "web" # web | mobile | universal
description: "" # Descrição do propósito e visão do Design System
theme: "default"
supported_modes: "both" # light | dark | both
author: ""
last_updated: ""
presentation:
  archetype: "" # saas | restaurant | fintech | commerce | editorial | service | minimal | generic
  density: "" # compact | balanced | spacious
  alignment: "" # symmetric | asymmetric
  hero_style: "" # split | centered | editorial | visual
  card_style: "" # bordered | flat | elevated | image_led
  section_flow: "" # alternating | linear | editorial | modular
  navigation_style: "" # standard | minimal | prominent
  imagery_weight: "" # medium | none | low | high
  decorative_style: "" # restrained | none | expressive
demo_content:
  profile: "" # saas | restaurant | fintech | commerce | editorial | service | minimal | generic
  brand_name: ""
  tagline: ""
  eyebrow: ""
  headline: ""
  description: ""
  cta_primary: ""
  cta_secondary: ""
---

# DESIGN SYSTEM SPECIFICATION (v1.1)

> **INSTRUÇÕES PARA AGENTES DE IA (Codex, Antigravity, Claude, etc.) E HUMANOS:**
> 1. Analise a base de código, tokens CSS/Tailwind e componentes reais do projeto antes de preencher.
> 2. **NÃO invente valores** que não existam no projeto.
> 3. Quando uma propriedade ou componente estiver ausente, mantenha: `status: NOT_DEFINED`.
> 4. Quando uma propriedade ou componente não fizer parte do escopo do projeto, use: `status: NOT_APPLICABLE` (não penaliza a cobertura).
> 5. Quando uma definição for herdada de outro componente, use: `status: INHERITED` e indique `inherited_from: <id>`.
> 6. Mantenha os identificadores (`Token ID`, `Level`, `Token`, `ID`) para permitir parsing determinístico no Design System Lab.

---

## 1. IDENTITY & PRINCIPLES

- **Visual Direction:** 
- **Brand Personality:** 
- **Principles:**
  - 
  - 
- **DO:**
  - 
  - 
- **DON'T:**
  - 
  - 

---

## 2. COLOR PALETTE

| Token ID | Token Name | Light Value | Dark Value | Usage | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `primary` | Primary Brand | | | Ações principais e botões CTA | `NOT_DEFINED` |
| `secondary` | Secondary | | | Ações secundárias e elementos de suporte | `NOT_DEFINED` |
| `accent` | Accent | | | Indicadores de destaque e status positivo | `NOT_DEFINED` |
| `background` | Background | | | Fundo principal da aplicação | `NOT_DEFINED` |
| `surface` | Surface | | | Superfície de cards e painéis | `NOT_DEFINED` |
| `surface_elevated` | Surface Elevated | | | Modais, popovers e menus flutuantes | `NOT_DEFINED` |
| `text_primary` | Text Primary | | | Títulos e texto com ênfase máxima | `NOT_DEFINED` |
| `text_secondary` | Text Secondary | | | Parágrafos e descrições | `NOT_DEFINED` |
| `text_muted` | Text Muted | | | Legendas, timestamps e metadados | `NOT_DEFINED` |
| `border` | Border | | | Linhas delimitadoras e divisores | `NOT_DEFINED` |
| `success` | Success | | | Confirmações e badges positivos | `NOT_DEFINED` |
| `warning` | Warning | | | Alertas moderados e atenção | `NOT_DEFINED` |
| `error` | Error | | | Erros críticos e ações destrutivas | `NOT_DEFINED` |
| `info` | Info | | | Mensagens informativas | `NOT_DEFINED` |

---

## 3. TYPOGRAPHY SCALE

| Level | Name | Font Family | Size | Mobile Size | Weight | Line Height | Tracking | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display` | Display Hero | | | | | | | `NOT_DEFINED` |
| `h1` | Heading 1 | | | | | | | `NOT_DEFINED` |
| `h2` | Heading 2 | | | | | | | `NOT_DEFINED` |
| `h3` | Heading 3 | | | | | | | `NOT_DEFINED` |
| `section_title`| Section Title | | | | | | | `NOT_DEFINED` |
| `card_title` | Card Title | | | | | | | `NOT_DEFINED` |
| `body` | Body Text | | | | | | | `NOT_DEFINED` |
| `secondary_body`| Secondary Body| | | | | | | `NOT_DEFINED` |
| `caption` | Caption | | | | | | | `NOT_DEFINED` |
| `label` | Input Label | | | | | | | `NOT_DEFINED` |
| `button` | Button Label | | | | | | | `NOT_DEFINED` |
| `price` | Price Tag | | | | | | | `NOT_DEFINED` |
| `metadata` | Metadata/Code | | | | | | | `NOT_DEFINED` |

---

## 4. SPACING & LAYOUT FOUNDATIONS

| Token | Value | Status |
| :--- | :--- | :--- |
| `base_unit` | | `NOT_DEFINED` |
| `xs` | | `NOT_DEFINED` |
| `sm` | | `NOT_DEFINED` |
| `md` | | `NOT_DEFINED` |
| `lg` | | `NOT_DEFINED` |
| `xl` | | `NOT_DEFINED` |
| `section_spacing` | | `NOT_DEFINED` |
| `container_padding` | | `NOT_DEFINED` |

### Radius

| Token | Value | Status |
| :--- | :--- | :--- |
| `xs` | | `NOT_DEFINED` |
| `sm` | | `NOT_DEFINED` |
| `md` | | `NOT_DEFINED` |
| `lg` | | `NOT_DEFINED` |
| `full` | | `NOT_DEFINED` |

### Borders & Shadows

| Token | Value | Status |
| :--- | :--- | :--- |
| `border_width` | | `NOT_DEFINED` |
| `border_style` | | `NOT_DEFINED` |
| `shadow_sm` | | `NOT_DEFINED` |
| `shadow_md` | | `NOT_DEFINED` |
| `shadow_lg` | | `NOT_DEFINED` |
| `focus_ring` | | `NOT_DEFINED` |

---

## 5. MOTION & ANIMATION

| Token | Value | Status |
| :--- | :--- | :--- |
| `duration_fast` | | `NOT_DEFINED` |
| `duration_normal` | | `NOT_DEFINED` |
| `duration_slow` | | `NOT_DEFINED` |
| `easing_default` | | `NOT_DEFINED` |
| `spring` | | `NOT_DEFINED` |
| `reduced_motion` | | `NOT_DEFINED` |

---

## 6. COMPONENTS SPECIFICATION

### Button Primary
- **ID:** `button.primary`
- **Category:** `button`
- **Status:** `NOT_DEFINED`
- **Radius:** 
- **Padding:** 
- **Font Token:** `button`
- **States:**
  - `default`: bg=, text=, border=, shadow=
  - `hover`: bg=, text=, border=, shadow=
  - `active`: bg=, text=
  - `focus`: shadow=
  - `disabled`: bg=, text=, opacity=
  - `loading`: opacity=

### Button Secondary
- **ID:** `button.secondary`
- **Category:** `button`
- **Status:** `NOT_DEFINED`
- **Radius:** 
- **Padding:** 
- **Font Token:** `button`
- **States:**
  - `default`: bg=, text=, border=
  - `hover`: bg=, text=, border=
  - `active`: bg=, text=
  - `focus`: shadow=
  - `disabled`: opacity=

### Button Ghost
- **ID:** `button.ghost`
- **Category:** `button`
- **Status:** `NOT_DEFINED`
- **Radius:** 
- **Padding:** 
- **Font Token:** `button`
- **States:**
  - `default`: bg=, text=, border=
  - `hover`: bg=, text=
  - `focus`: shadow=
  - `disabled`: opacity=

### Button Destructive
- **ID:** `button.destructive`
- **Category:** `button`
- **Status:** `NOT_DEFINED`
- **Radius:** 
- **Padding:** 
- **States:**
  - `default`: bg=, text=, border=
  - `hover`: bg=, text=
  - `focus`: shadow=
  - `disabled`: opacity=

### Input (Text)
- **ID:** `input.text`
- **Category:** `input`
- **Status:** `NOT_DEFINED`
- **Radius:** 
- **Padding:** 
- **States:**
  - `default`: bg=, text=, border=, shadow=
  - `focus`: border=, shadow=
  - `error`: border=, shadow=
  - `disabled`: bg=, text=

### Checkbox
- **ID:** `checkbox`
- **Category:** `selection`
- **Status:** `NOT_DEFINED`
- **Radius:** 
- **States:**
  - `default`: bg=, border=
  - `selected`: bg=, border=, text=
  - `focus`: shadow=
  - `disabled`: opacity=

### Switch / Toggle
- **ID:** `switch`
- **Category:** `selection`
- **Status:** `NOT_DEFINED`
- **Radius:** 
- **States:**
  - `default`: bg=
  - `selected`: bg=
  - `disabled`: opacity=

### Badge
- **ID:** `badge`
- **Category:** `feedback`
- **Status:** `NOT_DEFINED`
- **Radius:** 
- **Padding:** 
- **States:**
  - `default`: bg=, text=, border=
  - `success`: bg=, text=, border=
  - `warning`: bg=, text=, border=
  - `error`: bg=, text=, border=

### Card
- **ID:** `card.basic`
- **Category:** `card`
- **Status:** `NOT_DEFINED`
- **Radius:** 
- **Padding:** 
- **States:**
  - `default`: bg=, border=, shadow=
  - `hover`: border=, shadow=

### Alert
- **ID:** `alert`
- **Category:** `feedback`
- **Status:** `NOT_DEFINED`
- **Radius:** 
- **Padding:** 
- **States:**
  - `default`: bg=, text=, border=
  - `warning`: bg=, text=, border=
  - `error`: bg=, text=, border=

---

## 7. PATTERNS & LAYOUT SECTIONS

### Hero Section
- **ID:** `pattern.hero`
- **Status:** `NOT_DEFINED`
- **Description:** 

### Card Grid Section
- **ID:** `pattern.card_grid`
- **Status:** `NOT_DEFINED`
- **Description:** 

### CTA Section
- **ID:** `pattern.cta`
- **Status:** `NOT_DEFINED`
- **Description:** 

---

## 8. ACCESSIBILITY & RESPONSIVENESS

- **WCAG Target:** 
- **Color Contrast Minimum:** 
- **Keyboard Navigation:** 
- **Screen Reader Tested:** 
- **Responsive Strategy:** 
