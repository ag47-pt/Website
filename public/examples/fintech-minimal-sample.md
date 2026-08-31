---
spec_version: "1.0"
name: "Fintech Minimal Design System"
version: "1.0.0"
platform: "universal"
description: "Design System institucional de alta precisão para aplicações financeiras, tesouraria digital, dashboards de liquidez e bancos digitais."
theme: "fintech-precision"
supported_modes: "both"
author: "Agência 47 Labs"
last_updated: "2026-09-01"
---

# Fintech Minimal Design System Specification

> Especificação oficial do Fintech Minimal para validação e visualização determinística na bancada AG47 Labs Skills.

---

## 1. IDENTITY & PRINCIPLES

- **Visual Direction:** Minimalismo institucional, paleta monocromática elegante com acentos Emerald (#059669 / #10B981), números tabulares em alta definição, bordas precisas e zero distração decorativa.
- **Brand Personality:** Seguro, Preciso, Institucional, Transparente, Ágil.
- **Principles:**
  - A integridade dos dados e das métricas financeiras é sagrada.
  - Alinhamentos matematicamente perfeitos e suporte nativo a monospace para valores numéricos.
  - Cores semânticas reservadas estritamente para status de transação (Crédito, Débito, Pendente).
- **DO:**
  - Usar Emerald para valores positivos, saldos e confirmações de transação.
  - Manter cantos suaves com raio de 6px a 8px para estética sóbria.
- **DON'T:**
  - Não utilizar gradientes complexos em gráficos ou botões financeiros.
  - Não ocultar taxas ou condições em fontes menores que 11px.

---

## 2. COLOR PALETTE

| Token ID | Token Name | Light Value | Dark Value | Usage | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `primary` | Precision Emerald | `#059669` | `#10B981` | Botões de transferência, confirmação e balanços positivos | `DEFINED` |
| `secondary` | Steel Slate | `#334155` | `#94A3B8` | Filtros de período e botões secundários de extrato | `DEFINED` |
| `accent` | Golden Mint | `#0D9488` | `#2DD4BF` | Taxas de rendimento, staking e produtos premium | `DEFINED` |
| `background` | Minimal Canvas | `#F8FAFC` | `#020617` | Superfície base da bancada e dashboard | `DEFINED` |
| `surface` | Card Layer | `#FFFFFF` | `#0F172A` | Cards de conta corrente, investimentos e transações | `DEFINED` |
| `surface_elevated` | Modal Surface | `#FFFFFF` | `#1E293B` | Modais de autenticação 2FA e confirmação PIX/SEPA | `DEFINED` |
| `text_primary` | High Contrast Text | `#020617` | `#F8FAFC` | Valores monetários, IBANs e títulos principais | `DEFINED` |
| `text_secondary` | Detail Text | `#475569` | `#94A3B8` | Datas de liquidação e categorias de despesa | `DEFINED` |
| `text_muted` | Muted Data | `#94A3B8` | `#64748B` | Códigos de referência e metadados de auditoria | `DEFINED` |
| `border` | Clean Border | `#E2E8F0` | `#1E293B` | Separadores de extrato e linhas de tabela | `DEFINED` |
| `success` | Positive Balance | `#059669` | `#10B981` | Entradas, depósitos aprovados e rendimentos | `DEFINED` |
| `warning` | Pending Settlement | `#D97706` | `#F59E0B` | Transações em análise e limites de crédito | `DEFINED` |
| `error` | Negative / Chargeback | `#DC2626` | `#EF4444` | Estornos, saques bloqueados e saldo insuficiente | `DEFINED` |
| `info` | Clearing Info | `#0284C7` | `#38BDF8` | Informações de cotação e avisos do banco central | `DEFINED` |

---

## 3. TYPOGRAPHY SCALE

| Level | Name | Font Family | Size | Mobile Size | Weight | Line Height | Tracking | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display` | Portfolio Total | `var(--font-sans, system-ui)` | `46px` | `30px` | `800` | `1.1` | `-0.03em` | `DEFINED` |
| `h1` | Heading 1 | `var(--font-sans, system-ui)` | `30px` | `24px` | `700` | `1.2` | `-0.02em` | `DEFINED` |
| `h2` | Account Balance | `var(--font-sans, system-ui)` | `22px` | `18px` | `700` | `1.25` | `-0.01em` | `DEFINED` |
| `h3` | Section Header | `var(--font-sans, system-ui)` | `17px` | `15px` | `600` | `1.3` | `normal` | `DEFINED` |
| `section_title`| Ledger Section | `var(--font-sans, system-ui)` | `15px` | `14px` | `600` | `1.35` | `0.02em` | `DEFINED` |
| `card_title` | Account Title | `var(--font-sans, system-ui)` | `14px` | `13px` | `600` | `1.35` | `normal` | `DEFINED` |
| `body` | Statement Line | `var(--font-sans, system-ui)` | `14px` | `13px` | `400` | `1.5` | `normal` | `DEFINED` |
| `secondary_body`| Subline | `var(--font-sans, system-ui)` | `12px` | `11px` | `400` | `1.4` | `normal` | `DEFINED` |
| `caption` | IBAN Tag | `var(--font-mono, monospace)` | `11px` | `10px` | `500` | `1.3` | `0.02em` | `DEFINED` |
| `label` | Field Label | `var(--font-sans, system-ui)` | `12px` | `11px` | `600` | `1.4` | `0.02em` | `DEFINED` |
| `button` | Action Label | `var(--font-sans, system-ui)` | `13px` | `12px` | `600` | `1.0` | `0.01em` | `DEFINED` |
| `data_cell` | Numeric Amount | `var(--font-mono, monospace)` | `14px` | `13px` | `600` | `1.3` | `normal` | `DEFINED` |
| `metadata` | Transaction ID | `var(--font-mono, monospace)` | `11px` | `10px` | `400` | `1.2` | `0.05em` | `DEFINED` |

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
  - `md`: 6px
  - `lg`: 10px
  - `xl`: 14px
  - `full`: 9999px
- **Status:** `DEFINED`

---

## 6. ELEVATION & SHADOWS

- **Values:**
  - `none`: none
  - `sm`: 0 1px 2px 0 rgba(0, 0, 0, 0.04)
  - `md`: 0 2px 4px 0 rgba(0, 0, 0, 0.08)
  - `lg`: 0 8px 16px -2px rgba(0, 0, 0, 0.12)
  - `xl`: 0 16px 24px -4px rgba(0, 0, 0, 0.18)
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
| `primary` | `hover` | `#047857` | `#FFFFFF` | `none` | `var(--shadow-md)` | `DEFINED` |
| `primary` | `active` | `#065F46` | `#FFFFFF` | `none` | `none` | `DEFINED` |
| `primary` | `focus` | `var(--color-primary)` | `#FFFFFF` | `2px solid #34D399` | `none` | `DEFINED` |
| `primary` | `disabled` | `#334155` | `#64748B` | `none` | `none` | `DEFINED` |
| `secondary` | `default` | `var(--color-surface)` | `var(--color-text-primary)` | `1px solid var(--color-border)` | `var(--shadow-sm)` | `DEFINED` |
| `secondary` | `hover` | `var(--color-surface-elevated)` | `var(--color-text-primary)` | `1px solid #475569` | `none` | `DEFINED` |
| `ghost` | `default` | `transparent` | `var(--color-text-secondary)` | `none` | `none` | `DEFINED` |
| `ghost` | `hover` | `var(--color-surface-elevated)` | `var(--color-text-primary)` | `none` | `none` | `DEFINED` |
| `destructive` | `default` | `var(--color-error)` | `#FFFFFF` | `none` | `var(--shadow-sm)` | `DEFINED` |

### 8.2 Form Controls

| Control | State | Background | Border | Text Color | Ring/Focus | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `input_text` | `default` | `var(--color-surface)` | `1px solid var(--color-border)` | `var(--color-text-primary)` | `none` | `DEFINED` |
| `input_text` | `focus` | `var(--color-surface)` | `1px solid var(--color-primary)` | `var(--color-text-primary)` | `0 0 0 2px rgba(16,185,129,0.2)` | `DEFINED` |
| `input_text` | `disabled` | `#0F172A` | `1px solid #1E293B` | `var(--color-text-muted)` | `none` | `DEFINED` |
| `checkbox` | `checked` | `var(--color-primary)` | `none` | `#FFFFFF` | `none` | `DEFINED` |
| `switch` | `active` | `var(--color-primary)` | `none` | `#FFFFFF` | `none` | `DEFINED` |

### 8.3 Badges & Status Tags

| Type | Background | Text Color | Border | Status |
| :--- | :--- | :--- | :--- | :--- |
| `default` | `rgba(16,185,129,0.12)` | `#34D399` | `1px solid rgba(16,185,129,0.3)` | `DEFINED` |
| `success` | `rgba(16,185,129,0.15)` | `#10B981` | `1px solid rgba(16,185,129,0.3)` | `DEFINED` |
| `warning` | `rgba(245,158,11,0.15)` | `#F59E0B` | `1px solid rgba(245,158,11,0.3)` | `DEFINED` |
| `error` | `rgba(239,68,68,0.15)` | `#EF4444` | `1px solid rgba(239,68,68,0.3)` | `DEFINED` |

### 8.4 Cards & Surfaces

| Card Type | Background | Border | Radius | Padding | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `standard` | `var(--color-surface)` | `1px solid var(--color-border)` | `var(--radius-lg)` | `var(--spacing-md)` | `DEFINED` |
| `interactive`| `var(--color-surface)` | `1px solid var(--color-border)` | `var(--radius-lg)` | `var(--spacing-md)` | `DEFINED` |

---

## 9. ACCESSIBILITY CONTRACT

- `wcag_target`: AAA
- `color_contrast_min`: "7:1"
- `keyboard_navigable`: true
- `screen_reader_tested`: true
- **Status:** `DEFINED`
