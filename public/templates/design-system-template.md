---
spec_version: "1.0"
name: "Acme Design System"
version: "1.0.0"
platform: "web"
description: "Sistema de design modular de alta fidelidade para interfaces web modernas."
theme: "default"
supported_modes: "both"
author: "Design Engineering Team"
last_updated: "2026-09-01"
---

# AG47 DESIGN SYSTEM SPECIFICATION (v1.0)

> **INSTRUÇÕES PARA AGENTES DE IA (Codex, Antigravity, Claude, etc.) E HUMANOS:**
> 1. Analise o código-fonte real e o ecossistema do projeto antes de preencher este arquivo.
> 2. **NÃO invente valores** que não existam na base de código.
> 3. Use evidências de tokens reais (Tailwind, CSS Variables, Theme Providers).
> 4. Quando uma propriedade ou componente não existir, declare explicitamente: `status: NOT_DEFINED`.
> 5. Quando uma propriedade ou componente deliberadamente não fizer parte do escopo do projeto, declare: `status: NOT_APPLICABLE` (isso não reduz a nota de cobertura).
> 6. Quando uma definição for herdada de outro componente, use: `status: INHERITED` e indique `inherited_from: <id>`.
> 7. Preserve os identificadores e a estrutura tabular das seções abaixo para garantir parsing determinístico.

---

## 1. IDENTITY & PRINCIPLES

- **Visual Direction:** Minimalista, alta densidade técnica, contraste OLED e precisão geométrica.
- **Brand Personality:** Confiável, Rápido, Robusto, Elegante, Direto ao ponto.
- **Principles:**
  - Performance em primeiro lugar (zero lag visual).
  - Acessibilidade padrão WCAG AA em todas as superfícies.
  - Consistência sem rigidez excessiva.
- **DO:**
  - Usar bordas nítidas de 1px e hierarquia tipográfica estrita.
  - Garantir contraste adequado em modo claro e escuro.
- **DON'T:**
  - Não misturar sombras difusas pesadas com elementos técnicos.
  - Não utilizar gradientes desnecessários sobre textos essenciais.

---

## 2. COLOR PALETTE

| Token ID | Token Name | Light Value | Dark Value | Usage | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `primary` | Primary Brand | `#2563EB` | `#3B82F6` | Ações principais e botões CTA | `DEFINED` |
| `secondary` | Secondary | `#64748B` | `#94A3B8` | Ações secundárias e elementos de suporte | `DEFINED` |
| `accent` | Accent Lime | `#10B981` | `#34D399` | Indicadores de destaque e status positivo | `DEFINED` |
| `background` | Background | `#FFFFFF` | `#09090B` | Fundo principal da aplicação | `DEFINED` |
| `surface` | Surface | `#F8FAFC` | `#18181B` | Superfície de cards e painéis | `DEFINED` |
| `surface_elevated` | Surface Elevated | `#FFFFFF` | `#27272A` | Modais, popovers e menus flutuantes | `DEFINED` |
| `text_primary` | Text Primary | `#0F172A` | `#F8FAFC` | Títulos e texto com ênfase máxima | `DEFINED` |
| `text_secondary` | Text Secondary | `#475569` | `#94A3B8` | Parágrafos e descrições | `DEFINED` |
| `text_muted` | Text Muted | `#94A3B8` | `#71717A` | Legendas, timestamps e metadados | `DEFINED` |
| `border` | Border | `#E2E8F0` | `#27272A` | Linhas delimitadoras e divisores | `DEFINED` |
| `success` | Success | `#10B981` | `#10B981` | Confirmações e badges positivos | `DEFINED` |
| `warning` | Warning | `#F59E0B` | `#F59E0B` | Alertas moderados e atenção | `DEFINED` |
| `error` | Error | `#EF4444` | `#F87171` | Erros críticos e ações destrutivas | `DEFINED` |
| `info` | Info | `#3B82F6` | `#60A5FA` | Mensagens informativas | `DEFINED` |

---

## 3. TYPOGRAPHY SCALE

| Level | Name | Font Family | Size | Mobile Size | Weight | Line Height | Tracking | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display` | Display Hero | `var(--font-sans, Inter, sans-serif)` | `48px` | `32px` | `800` | `1.1` | `-0.02em` | `DEFINED` |
| `h1` | Heading 1 | `var(--font-sans, Inter, sans-serif)` | `36px` | `28px` | `700` | `1.2` | `-0.02em` | `DEFINED` |
| `h2` | Heading 2 | `var(--font-sans, Inter, sans-serif)` | `28px` | `24px` | `700` | `1.25` | `-0.01em` | `DEFINED` |
| `h3` | Heading 3 | `var(--font-sans, Inter, sans-serif)` | `22px` | `20px` | `600` | `1.3` | `normal` | `DEFINED` |
| `section_title`| Section Title | `var(--font-sans, Inter, sans-serif)` | `20px` | `18px` | `600` | `1.35` | `normal` | `DEFINED` |
| `card_title` | Card Title | `var(--font-sans, Inter, sans-serif)` | `18px` | `16px` | `600` | `1.4` | `normal` | `DEFINED` |
| `body` | Body Text | `var(--font-sans, Inter, sans-serif)` | `16px` | `15px` | `400` | `1.5` | `normal` | `DEFINED` |
| `secondary_body`| Secondary Body| `var(--font-sans, Inter, sans-serif)` | `14px` | `13px` | `400` | `1.5` | `normal` | `DEFINED` |
| `caption` | Caption | `var(--font-sans, Inter, sans-serif)` | `12px` | `11px` | `400` | `1.4` | `0.01em` | `DEFINED` |
| `label` | Input Label | `var(--font-sans, Inter, sans-serif)` | `13px` | `12px` | `600` | `1.4` | `0.02em` | `DEFINED` |
| `button` | Button Label | `var(--font-sans, Inter, sans-serif)` | `14px` | `13px` | `600` | `1.2` | `0.02em` | `DEFINED` |
| `price` | Price Tag | `var(--font-sans, Inter, sans-serif)` | `24px` | `20px` | `700` | `1.1` | `-0.02em` | `DEFINED` |
| `metadata` | Metadata/Code | `var(--font-mono, monospace)` | `11px` | `10px` | `500` | `1.4` | `0.05em` | `DEFINED` |

---

## 4. SPACING & LAYOUT FOUNDATIONS

| Token | Value | Status |
| :--- | :--- | :--- |
| `base_unit` | `4px` | `DEFINED` |
| `xs` | `4px` | `DEFINED` |
| `sm` | `8px` | `DEFINED` |
| `md` | `16px` | `DEFINED` |
| `lg` | `24px` | `DEFINED` |
| `xl` | `32px` | `DEFINED` |
| `section_spacing` | `64px` | `DEFINED` |
| `container_padding` | `16px` | `DEFINED` |

### Radius

| Token | Value | Status |
| :--- | :--- | :--- |
| `xs` | `2px` | `DEFINED` |
| `sm` | `4px` | `DEFINED` |
| `md` | `8px` | `DEFINED` |
| `lg` | `16px` | `DEFINED` |
| `full` | `9999px` | `DEFINED` |

### Borders & Shadows

| Token | Value | Status |
| :--- | :--- | :--- |
| `border_width` | `1px` | `DEFINED` |
| `border_style` | `solid` | `DEFINED` |
| `shadow_sm` | `0 1px 2px rgba(0,0,0,0.05)` | `DEFINED` |
| `shadow_md` | `0 4px 6px -1px rgba(0,0,0,0.1)` | `DEFINED` |
| `shadow_lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | `DEFINED` |
| `focus_ring` | `0 0 0 3px rgba(37,99,235,0.3)` | `DEFINED` |

---

## 5. MOTION & ANIMATION

| Token | Value | Status |
| :--- | :--- | :--- |
| `duration_fast` | `150ms` | `DEFINED` |
| `duration_normal` | `250ms` | `DEFINED` |
| `duration_slow` | `400ms` | `DEFINED` |
| `easing_default` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | `DEFINED` |
| `spring` | `spring(1, 100, 10, 0)` | `DEFINED` |
| `reduced_motion` | `prefers-reduced-motion: reduce -> duration 0ms` | `DEFINED` |

---

## 6. COMPONENTS SPECIFICATION

### Button Primary
- **ID:** `button.primary`
- **Category:** `button`
- **Status:** `DEFINED`
- **Radius:** `8px`
- **Padding:** `10px 18px`
- **Font Token:** `button`
- **States:**
  - `default`: bg=`#2563EB`, text=`#FFFFFF`, border=`transparent`, shadow=`0 1px 2px rgba(0,0,0,0.1)`
  - `hover`: bg=`#1D4ED8`, text=`#FFFFFF`, transform=`translateY(-1px)`
  - `active`: bg=`#1E40AF`, text=`#FFFFFF`, transform=`translateY(0px)`
  - `focus`: shadow=`0 0 0 3px rgba(37,99,235,0.35)`
  - `disabled`: bg=`#94A3B8`, text=`#E2E8F0`, opacity=`0.6`, cursor=`not-allowed`
  - `loading`: opacity=`0.8`, cursor=`wait`

### Button Secondary
- **ID:** `button.secondary`
- **Category:** `button`
- **Status:** `DEFINED`
- **Radius:** `8px`
- **Padding:** `10px 18px`
- **Font Token:** `button`
- **States:**
  - `default`: bg=`transparent`, text=`#0F172A`, border=`1px solid #E2E8F0`
  - `hover`: bg=`#F8FAFC`, text=`#0F172A`, border=`1px solid #CBD5E1`
  - `active`: bg=`#F1F5F9`, text=`#0F172A`
  - `focus`: shadow=`0 0 0 3px rgba(100,116,139,0.2)`
  - `disabled`: opacity=`0.5`, cursor=`not-allowed`

### Button Ghost
- **ID:** `button.ghost`
- **Category:** `button`
- **Status:** `DEFINED`
- **Radius:** `6px`
- **Padding:** `8px 14px`
- **Font Token:** `button`
- **States:**
  - `default`: bg=`transparent`, text=`#475569`, border=`transparent`
  - `hover`: bg=`rgba(100,116,139,0.1)`, text=`#0F172A`
  - `focus`: shadow=`0 0 0 2px rgba(100,116,139,0.2)`
  - `disabled`: opacity=`0.4`, cursor=`not-allowed`

### Button Destructive
- **ID:** `button.destructive`
- **Category:** `button`
- **Status:** `DEFINED`
- **Radius:** `8px`
- **Padding:** `10px 18px`
- **States:**
  - `default`: bg=`#EF4444`, text=`#FFFFFF`, border=`transparent`
  - `hover`: bg=`#DC2626`, text=`#FFFFFF`
  - `focus`: shadow=`0 0 0 3px rgba(239,68,68,0.3)`
  - `disabled`: opacity=`0.5`, cursor=`not-allowed`

### Input (Text)
- **ID:** `input.text`
- **Category:** `input`
- **Status:** `DEFINED`
- **Radius:** `8px`
- **Padding:** `10px 14px`
- **States:**
  - `default`: bg=`#FFFFFF`, text=`#0F172A`, border=`1px solid #E2E8F0`, shadow=`0 1px 2px rgba(0,0,0,0.03)`
  - `focus`: border=`1px solid #2563EB`, shadow=`0 0 0 3px rgba(37,99,235,0.15)`
  - `error`: border=`1px solid #EF4444`, shadow=`0 0 0 3px rgba(239,68,68,0.15)`
  - `disabled`: bg=`#F8FAFC`, text=`#94A3B8`, cursor=`not-allowed`

### Checkbox
- **ID:** `checkbox`
- **Category:** `selection`
- **Status:** `DEFINED`
- **Radius:** `4px`
- **States:**
  - `default`: bg=`#FFFFFF`, border=`1px solid #CBD5E1`
  - `selected`: bg=`#2563EB`, border=`1px solid #2563EB`, text=`#FFFFFF`
  - `focus`: shadow=`0 0 0 2px rgba(37,99,235,0.2)`
  - `disabled`: opacity=`0.5`, cursor=`not-allowed`

### Switch / Toggle
- **ID:** `switch`
- **Category:** `selection`
- **Status:** `DEFINED`
- **Radius:** `9999px`
- **States:**
  - `default`: bg=`#CBD5E1`
  - `selected`: bg=`#2563EB`
  - `disabled`: opacity=`0.5`, cursor=`not-allowed`

### Badge
- **ID:** `badge`
- **Category:** `feedback`
- **Status:** `DEFINED`
- **Radius:** `9999px`
- **Padding:** `4px 10px`
- **States:**
  - `default`: bg=`#F1F5F9`, text=`#334155`, border=`1px solid #E2E8F0`
  - `success`: bg=`#ECFDF5`, text=`#065F46`, border=`1px solid #A7F3D0`
  - `warning`: bg=`#FFFBEB`, text=`#92400E`, border=`1px solid #FDE68A`
  - `error`: bg=`#FEF2F2`, text=`#991B1B`, border=`1px solid #FECACA`

### Card
- **ID:** `card.basic`
- **Category:** `card`
- **Status:** `DEFINED`
- **Radius:** `12px`
- **Padding:** `20px`
- **States:**
  - `default`: bg=`#FFFFFF`, border=`1px solid #E2E8F0`, shadow=`0 2px 4px rgba(0,0,0,0.04)`
  - `hover`: border=`1px solid #CBD5E1`, shadow=`0 8px 16px rgba(0,0,0,0.06)`, transform=`translateY(-2px)`

### Alert
- **ID:** `alert`
- **Category:** `feedback`
- **Status:** `DEFINED`
- **Radius:** `8px`
- **Padding:** `14px 16px`
- **States:**
  - `default`: bg=`#EFF6FF`, text=`#1E40AF`, border=`1px solid #BFDBFE`
  - `warning`: bg=`#FFFBEB`, text=`#92400E`, border=`1px solid #FDE68A`
  - `error`: bg=`#FEF2F2`, text=`#991B1B`, border=`1px solid #FECACA`

---

## 7. PATTERNS & LAYOUT SECTIONS

### Hero Section
- **ID:** `pattern.hero`
- **Status:** `DEFINED`
- **Description:** Cabeçalho de alto impacto com título Display, parágrafo introdutório e ações primária/secundária alinhadas.

### Card Grid Section
- **ID:** `pattern.card_grid`
- **Status:** `DEFINED`
- **Description:** Grid responsivo de 3 colunas para produtos ou features com espaçamento de 24px.

### CTA Section
- **ID:** `pattern.cta`
- **Status:** `DEFINED`
- **Description:** Seção de chamada para conversão com fundo de destaque e botão proeminente.

---

## 8. ACCESSIBILITY & RESPONSIVENESS

- **WCAG Target:** `AA`
- **Color Contrast Minimum:** `4.5:1` para texto normal, `3.0:1` para títulos grandes
- **Keyboard Navigation:** `true`
- **Screen Reader Tested:** `true`
- **Responsive Strategy:** `mobile_first`
