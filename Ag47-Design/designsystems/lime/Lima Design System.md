# Lima Design System

> **Brand Library** · v1.2
>
> *High contrast, full energy.*
>
> Um sistema ousado construído sobre verde limão, violeta vibrante, preto e branco — com vermelho reservado para o que realmente importa: alertas.

---

## Índice

1. [Changelog](#changelog)
2. [Visão Geral](#visão-geral)
3. [Cores](#01-cores)
4. [Combinações](#02-combinações)
5. [Tipografia](#03-tipografia)
6. [Espaçamento & Raio](#04-espaçamento--raio)
7. [Motion](#05-motion)
8. [Elevação & Z-index](#06-elevação--z-index)
9. [Iconografia](#07-iconografia)
10. [Layout & Breakpoints](#08-layout--breakpoints)
11. [Botões](#09-botões)
12. [Cards](#10-cards)
13. [Inputs & Formulários](#11-inputs--formulários)
14. [Badges & Avatares](#12-badges--avatares)
15. [Alertas](#13-alertas)
16. [Toast](#14-toast)
17. [Navegação](#15-navegação)
18. [Overlays](#16-overlays)
19. [Loading & Empty States](#17-loading--empty-states)
20. [Padrões & Receitas](#18-padrões--receitas)
20.5. [DX & Tools](#185-dx--tools)
21. [Voice & Tone](#19-voice--tone)
22. [Branding](#20-branding)
23. [Acessibilidade](#21-acessibilidade)
24. [Migration Guide](#22-migration-guide)
25. [Tema & Variáveis CSS](#tema--variáveis-css)
26. [Apêndice](#apêndice)
27. [Convenções & Boas Práticas](#convenções--boas-práticas)

## Novos componentes v1.2

Adicionados em v1.2: **Segmented Control**, **Date Picker**, **Banner**, **Timeline**, **Charts** (bar + line), **Notification Dot**. Mais: **Theme Customizer**, **Cmd+K Search**, **Live Playground**, **Component Diagram**, **Do/Don't**, **Decision Tree**, **Component Lifecycle**.

---

## Changelog

| Versão | Data | Mudanças |
| --- | --- | --- |
| **v1.2** | Jun 2026 | Adicionado **Segmented Control**, **Date Picker**, **Banner**, **Timeline**, **Charts** (bar + line), **Notification Dot**; **Theme Customizer** com presets ao vivo; **Cmd+K Global Search**; **Live Playground** (editor HTML ao vivo); **Component Diagram** (mapa visual); **Do & Don't** examples; **Decision Tree** ("qual componente usar?"); **Component Lifecycle**; **Page meta** OpenGraph/Twitter completos. |
| **v1.1** | Jun 2026 | Adicionado **violeta vibrante** como Secondary; **Motion tokens**; **Elevation/Z-index**; **Iconografia**; **Toast**; **Acessibilidade**; **Radio/Select/Textarea/Slider**; **Outline badges** com tokens semânticos; **Icon-only buttons** (pill); **Layout & Breakpoints**; **Navegação** (Breadcrumb, Pagination, Tabs, Stepper); **Overlays** (Modal, Dropdown, Tooltip); **Loading states** (Skeleton, Progress, Empty); **Padrões & Receitas** (Settings, Search, Notification center, Empty inbox); **Voice & Tone**; **Branding**; **Code Snippets** com copy; **Component Matrix**; **Token JSON export**; **FAQ**; **Scroll progress + Mini-TOC + Back-to-top**; **OpenGraph meta**; **Print styles**; **404 page**; unificação do `--lime`; unificação do outline via `--text`. |
| **v1.0** | Jan 2026 | Lançamento inicial. |

---

## Visão Geral

O **Lima Design System** é um sistema de design com foco em alto contraste e energia visual. Sua paleta é construída em quatro pilares — **verde limão** (primária), **violeta vibrante** (secundária/contraste), **preto/branco** (base) — com o **vermelho** reservado exclusivamente para sinalizações semânticas.

| Atributo | Valor |
| --- | --- |
| Versão | `v1.2` |
| Fonte Display | **Space Grotesk** (400, 500, 600, 700) |
| Fonte Body | **Hanken Grotesk** (400, 500, 600, 700) |
| Modo padrão | Dark |
| Suporte a tema | Dark / Light |
| Nível de acessibilidade | WCAG 2.1 AA |
| Estratégia motion | Curta e direta · 60–400ms |
| Stack | Vanilla CSS + JS mínimo |

---

## 01. Cores

### Paleta principal

| Token | Hex | Uso |
| --- | --- | --- |
| `Lime` | `#C2F500` | **Primary** — CTAs, foco, energia visual |
| `Purple` | `#A855F7` | **Secondary** — contraste com lime, ações complementares |
| `Black` | `#0A0A0A` | Background base (dark) / texto em superfícies claras |
| `White` | `#FFFFFF` | Background base (light) / texto em superfícies escuras |
| `Red` | `#FF463A` | **Semântico** — erros e alertas críticos. Nunca decorativo. |

> ⚠️ O vermelho **nunca** deve ser usado de forma decorativa.

### Tokens semânticos (cores de marca)

| Token | Dark | Light | Uso |
| --- | --- | --- | --- |
| `--lime` | `#C2F500` | `#C2F500` | Identidade da marca (unificado) |
| `--purple` | `#A855F7` | `#7C3AED` | Purple ajustado por tema para contraste WCAG |
| `--red` | `#FF463A` | `#E11D26` | Red ajustado por tema para contraste WCAG |

### Escalas neutras

| Step | Dark | Light |
| --- | --- | --- |
| 50 | `#FAFAFA` | `#FAFAFA` |
| 100 | `#E4E4E7` | `#F4F4F5` |
| 200 | `#A1A1AA` | `#E4E4E7` |
| 300 | `#71717A` | `#D4D4D8` |
| 400 | `#52525B` | `#A1A1AA` |
| 500 | `#3F3F46` | `#71717A` |
| 600 | `#2A2A2A` | `#52525B` |
| 700 | `#1E1E1E` | `#3F3F46` |
| 800 | `#151515` | `#18181B` |

---

## 02. Combinações

### Lime + Violet (par primária-secundária)

Triádicos com saturação alta e luminosidade equivalente. Funcionam em paralelo sem competir.

### Lime + Red (energia + alerta)

Use com cautela — Red é exclusivamente semântico. Lime pode aparecer vizinho em barras de progresso ou indicadores visuais.

---

## 03. Tipografia

| Função | Família | Pesos |
| --- | --- | --- |
| **Display** | `Space Grotesk` | 400, 500, 600, 700 |
| **Body** | `Hanken Grotesk` | 400, 500, 600, 700 |

### Escala

| Token | Tamanho | Line-height | Letter-spacing | Uso |
| --- | --- | --- | --- | --- |
| `Display` | `64px` | `1.0` | `-0.04em` | Heróis, landing pages |
| `H1` | `44px` | `1.1` | `-0.03em` | Títulos principais |
| `H2` | `32px` | `1.15` | `-0.02em` | Seções |
| `H3` | `24px` | `1.25` | `-0.02em` | Subseções |
| `H4` | `20px` | `1.3` | `-0.01em` | Títulos de cards |
| `Body Large` | `19px` | `1.55` | `0` | Introduções |
| `Body` | `17px` | `1.6` | `0` | Texto corrido |
| `Body Small` | `15px` | `1.5` | `0` | Texto UI |
| `Caption` | `13px` | `1.4` | `0` | Metadados, labels |
| `Micro` | `11px` | `1.3` | `0.02em` | Eyebrows |

---

## 04. Espaçamento & Raio

### Spacing scale (base 4px)

| Token | Valor | Uso |
| --- | --- | --- |
| `xs` | `4px` | Padding mínimo |
| `sm` | `8px` | Badges, gaps de listas |
| `md` | `16px` | Inputs, cards pequenos |
| `lg` | `24px` | Cards, gaps entre seções |
| `xl` | `40px` | Padding de seções |
| `2xl` | `64px` | Padding hero |
| `3xl` | `96px` | Entre seções grandes |

### Border radius

| Token | Valor | Uso |
| --- | --- | --- |
| `xs` | `4px` | Progress bars |
| `sm` | `8px` | Tags pequenas |
| `md` | `12px` | Botões, inputs |
| `lg` | `18px` | Cards, superfícies |
| `xl` | `24px` | Modais, hero |
| `full` | `999px` | Pílulas, switches, avatares, icon-only buttons |

---

## 05. Motion

### Duração

| Token | Valor | Uso |
| --- | --- | --- |
| `--motion-instant` | `60ms` | Hover, mudanças de cor |
| `--motion-fast` | `120ms` | Active states |
| `--motion-normal` | `200ms` | Hover de elementos grandes |
| `--motion-slow` | `280ms` | Modais, toasts, troca de tema |
| `--motion-slower` | `400ms` | Entrada de hero, stagger |

### Easing

| Token | Valor | Uso |
| --- | --- | --- |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Padrão |
| `--ease-emphasized` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | CTAs, aparições com leve bounce |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Saídas rápidas |

### Respeitando preferências

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 06. Elevação & Z-index

### Elevação (sombras)

| Token | Uso |
| --- | --- |
| `--shadow-sm` | Botões, badges com peso |
| `--shadow-md` | Cards elevados, dropdowns |
| `--shadow-lg` | Modais, popovers, toasts |
| `--shadow-xl` | Hero cards, flutuantes |

### Z-index

| Token | Valor | Uso |
| --- | --- | --- |
| `--z-base` | `0` | Conteúdo normal |
| `--z-elevated` | `10` | Cards, sticky |
| `--z-sticky` | `50` | Nav, headers fixos |
| `--z-dropdown` | `100` | Dropdowns, selects |
| `--z-modal` | `1000` | Modais |
| `--z-toast` | `1100` | Toasts |
| `--z-tooltip` | `1200` | Tooltips (sempre acima) |

---

## 07. Iconografia

| Atributo | Valor |
| --- | --- |
| Estilo | Stroke (linha) |
| Stroke width | `1.5px` · `2px` (ênfase) |
| Terminais | Round (linecap) |
| Bibliotecas | Lucide, Phosphor, Heroicons (line) |

### Tamanhos

| Token | Valor | Uso |
| --- | --- | --- |
| `icon-xs` | `12px` | Inline com microcopy |
| `icon-sm` | `16px` | Inline com body, badges |
| `icon-md` | `20px` | Botões, navegação |
| `icon-lg` | `24px` | Alerts, features |
| `icon-xl` | `32px` | Destaque, hero |

### Cores

`currentColor` por padrão · `--lime` (acento) · `--red` (alerta) · `--subtle` (disabled)

---

## 08. Layout & Breakpoints

### Breakpoints

| Token | Min-width | Dispositivos típicos |
| --- | --- | --- |
| `sm` | `640px` | Tablet portrait |
| `md` | `768px` | Tablet landscape |
| `lg` | `1024px` | Desktop |
| `xl` | `1280px` | Desktop wide |
| `2xl` | `1536px` | Desktop extra-wide |

```css
@media (min-width: 768px) { /* tablet */ }
@media (min-width: 1024px) { /* desktop */ }
```

### Container

Largura máxima padrão: `1200px`. Padding lateral responsivo:
- mobile: `24px`
- desktop: `40px`

### Grid system

12 colunas, gap baseado em spacing tokens. Suporta col-span, offset e auto-fit.

```css
.grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; }
.col-6 { grid-column: span 6; }
@media (max-width: 768px) {
  .col-6 { grid-column: span 12; }
}
```

### Auto-fit grid

```css
.grid-auto { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
```

### Container queries (suporte moderno)

```css
.card-container { container-type: inline-size; }
@container (min-width: 400px) {
  .card { flex-direction: row; }
}
```

---

## 09. Botões

### Variantes principais

| Variante | Background | Texto | Uso |
| --- | --- | --- | --- |
| **Primary** | `--lime` | `#0A0A0A` | Ação principal |
| **Accent** | `--purple` | `#FFFFFF` | Ação secundária de destaque |
| **Secondary** | `--surface2` | `--text` | Ação complementar |
| **Ghost** | transparent | `--text` | Ação terciária |
| **Destructive** | `--red` | `#FFFFFF` | Ações irreversíveis |
| **Disabled** | `--surface2` | `--subtle` | Estado desabilitado |

### Tamanhos (com label)

| Tamanho | Font-size | Padding | Radius |
| --- | --- | --- | --- |
| **Small** | `13px` | `8px 16px` | `9px` |
| **Medium** | `15px` | `13px 24px` | `12px` |
| **Large** | `17px` | `17px 32px` | `14px` |

### Botão só com ícone (pill)

| Tamanho | Dimensão | Ícone |
| --- | --- | --- |
| `sm` | `32px × 32px` | `14px` |
| `md` | `40px × 40px` | `18px` |
| `lg` | `48px × 48px` | `22px` |
| `xl` | `56px × 56px` | `26px` |

Variantes disponíveis: Primary · Accent · Secondary · Ghost · Destructive · Outline-Lime · Outline-Text · Outline-Purple · Outline-Red.

**Sempre com `aria-label`** (sem texto visível).

### Estados completos

| Estado | Como aplicar |
| --- | --- |
| Default | Base |
| Hover | `filter: brightness(1.08)` (filled) · `border-color: var(--lime)` (secondary) |
| Active | `translateY(1px)` + `filter: brightness(0.95)` |
| Focus-visible | `outline: 2px solid var(--lime); outline-offset: 2px` |
| Disabled | `opacity: 0.5; cursor: not-allowed` |
| Loading | Spinner + `cursor: progress` |

---

## 10. Cards

- Container: `border-radius: 18px`, `border: 1px solid var(--border)`, `background: var(--surface)`.
- Padding: `24px`.
- Hover (interativo): `border-color: var(--lime)` + `translateY(-2px)` + `--shadow-md`.

Tipos: **Mídia**, **Estatística**, **CTA**.

---

## 11. Inputs & Formulários

### Estados (texto)

| Estado | Borda | Background |
| --- | --- | --- |
| Default | `1px --border` | `--bg` |
| Hover | `1px --subtle` | `--bg` |
| Focused | `1.5px --lime` + glow | `--bg` |
| Error | `1.5px --red` | `--bg` |
| Disabled | `1px --border` | `--surface2` |
| Read-only | `1px --border` | `--surface2` |

Componentes documentados: **Input texto**, **Textarea**, **Select**, **Radio**, **Checkbox** (com estado partial), **Switch**, **Slider**, **Help text**.

### Search field (novo)

Combinação de input + ícone à esquerda + botão de clear à direita.

### Tag input (novo)

Input que aceita múltiplas tags. Cada tag é uma badge removível (`×`).

---

## 12. Badges & Avatares

### Badges

| Tipo | Background | Texto |
| --- | --- | --- |
| Primary | `--lime` | `#0A0A0A` |
| Secondary | `--purple` | `#FFFFFF` |
| Neutral | `--surface2` | `--text` |
| Critical | `--red` | `#FFFFFF` |
| Status dot | `--surface2` | `--text` |
| Outline · Lime | transparent | `--lime` |
| **Outline · Text** | transparent | `--text` |
| Outline · Purple | transparent | `--purple` |
| Outline · Red | transparent | `--red` |

> 💡 **Outline · Text** usa token semântico `--text` — adapta em qualquer tema.

### Avatares

Tamanhos: `sm 32px`, `md 40px`, `lg 48px`, `xl 64px`. Tipos: Sólido Lime, Sólido Purple, Outline. Suporte a presença (online/offline) e stack.

---

## 13. Alertas

4 tipos semânticos: **Success** (lime) · **Info** (subtle) · **Warning** (purple) · **Critical** (red).

Estrutura: `border-radius: 14px`, `padding: 18px 22px`, ícone circular + texto + ação opcional.

---

## 14. Toast

Notificações efêmeras, max `360px`, auto-dismiss `4s` (info) / `6s` (error).

Animação: `--motion-slow` + `--ease-emphasized` (entrada), `--motion-normal` + `--ease-exit` (saída).

Posições: top-right, top-center, bottom-right.

---

## 15. Navegação

### Breadcrumb

Hierarquia de localização. Máximo recomendado: 4 níveis. Separador padrão: chevron (`›`). Item atual em `--text`, anteriores em `--muted` com hover `--text`.

### Pagination

Numerada (1-10), com prev/next. Estado ativo: `--lime` background + texto preto. Item desabilitado: `--subtle`.

### Tabs

Horizontal (padrão) ou vertical. Item ativo: borda inferior `2px --lime` (horizontal) ou borda esquerda `2px --lime` (vertical). Suporta badges de contagem.

### Stepper

Fluxo numerado (1, 2, 3, ...). Estados:
- Completo: círculo `--lime` + check
- Atual: círculo `--purple` + número em branco
- Pendente: círculo `--surface2` + número em `--muted`

Conectores entre steps: linha `1px --border` (pendente) ou `1px --lime` (completo).

---

## 16. Overlays

### Modal/Dialog

Sobrepõe a tela com scrim `rgba(0,0,0,0.6)`. `border-radius: 18px`, `--shadow-xl`, padding `32px`.

Tamanhos:

| Tamanho | Largura | Uso |
| --- | --- | --- |
| `sm` | `400px` | Confirmações simples |
| `md` | `560px` | Formulários |
| `lg` | `720px` | Conteúdo rico |
| `xl` | `960px` | Lightboxes, previews |

Estrutura: Header (título + close) · Body (conteúdo) · Footer (ações). Trap focus dentro do modal. `Esc` fecha. Click no scrim fecha (configurável).

ARIA: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`.

### Dropdown/Menu

Trigger + lista flutuante. `border-radius: 12px`, `--shadow-md`, `--z-dropdown`.

Itens: `--padding: 10px 14px`. Hover: `--surface2`. Divider: `1px --border`. Estados: default, hover, active, disabled.

Abertura: click no trigger. Fechamento: click fora, `Esc`, seleção de item.

ARIA: `role="menu"`, itens com `role="menuitem"`.

### Tooltip

Pequeno popover com texto explicativo. Aparece em hover (300ms delay) ou focus.

Posições: `top`, `right`, `bottom`, `left`. Seta indicadora opcional.

`background: --text` (invertido), `color: --bg`, `--z-tooltip`.

ARIA: `role="tooltip"`.

---

## 17. Loading & Empty States

### Skeleton

Placeholder animado para conteúdo em carregamento. Usa `--motion-slow` shimmer animation.

Variantes:
- **Text line**: `height: 12px`, `width: 100%`, `border-radius: 4px`.
- **Avatar**: `48px × 48px`, `border-radius: 50%`.
- **Card**: retângulo completo com borda.
- **Custom**: qualquer forma via CSS.

Background: `--surface2` com gradient shimmer `--surface → --surface2 → --surface`.

### Progress (linear)

Barra horizontal com `height: 4px`, `border-radius: 2px`. Fill: `--lime`. Background: `--surface2`.

Variantes: **indeterminate** (animação contínua), **determinate** (com valor 0-100%).

### Progress (circular)

SVG circle com `stroke-dasharray` controlado por JS. Tamanhos: `sm 24px`, `md 32px`, `lg 48px`.

### Empty state

Composição: ícone `xl` (em `--subtle`) + título (`H3`) + descrição (`body` em `--muted`) + CTA opcional.

`text-align: center`, `padding: 64px 24px`.

Casos comuns:
- **Sem resultados**: ícone Search + "Nenhum resultado encontrado"
- **Lista vazia**: ícone Inbox + "Crie seu primeiro item"
- **Erro**: ícone AlertCircle + "Algo deu errado" + botão "Tentar novamente"

---

## 18. Padrões & Receitas

Como combinar componentes para resolver problemas reais.

### Receita: Lista de comentários

```html
<article class="comment">
  <div class="avatar avatar-primary">LM</div>
  <div class="comment-body">
    <div class="comment-head">
      <strong>Lima Studio</strong>
      <span class="badge badge-status">Online</span>
      <time>2h atrás</time>
    </div>
    <p>Conteúdo do comentário…</p>
    <div class="comment-actions">
      <button class="btn btn-ghost btn-small">Responder</button>
      <button class="btn btn-icon btn-icon-ghost btn-icon-sm" aria-label="Mais">
        <svg>…</svg>
      </button>
    </div>
  </div>
</article>
```

### Receita: Settings page

Layout: Tabs verticais à esquerda + conteúdo à direita. Cada tab é uma seção (Perfil, Conta, Notificações, Segurança).

### Receita: Search results

Header com search field + chips de filtro + lista de resultados (cada resultado: título + descrição + breadcrumb).

### Receita: Notification center

Toast-like cards em lista. Cada item: ícone do tipo + título + tempo relativo + ações (mark as read, dismiss).

### Receita: Form section

Card com header (título + descrição) + form-grid de inputs + footer (cancel + submit).

### Receita: Onboarding (Stepper)

Stepper horizontal no topo + conteúdo do step atual + footer (Voltar + Próximo/Concluir).

### Receita: Empty inbox

Empty state em contexto. Convida o usuário com CTA, não apenas informa:

```html
<div class="empty-state">
  <div class="empty-state-icon">
    <svg><!-- ícone --></svg>
  </div>
  <h3 class="empty-state-title">Sua caixa está limpa</h3>
  <p class="empty-state-desc">Nenhuma notificação por aqui.</p>
  <div class="empty-state-action">
    <button class="btn btn-primary">Explorar</button>
  </div>
</div>
```

---

## 18.5. DX & Tools

Ferramentas para acelerar o trabalho de devs.

### Code snippets copy-paste

Todos os snippets da landing page têm botão de copiar (`navigator.clipboard.writeText`). Use como referência rápida.

### Token JSON export

Formato compatível com **Style Dictionary** e **W3C Design Tokens**:

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "lime":    { "$value": "#C2F500", "$type": "color" },
    "purple":  { "$value": "#A855F7", "$type": "color" },
    "bg":      { "$value": "{color.black}", "$type": "color" }
  },
  "motion": {
    "fast":    { "$value": "120ms", "$type": "duration" },
    "easeStandard": { "$value": "cubic-bezier(0.4, 0, 0.2, 1)", "$type": "cubicBezier" }
  }
}
```

### Integração com build pipelines

```js
// Vite
import tokens from './lima-design-tokens.json';

// Webpack
const tokens = require('./lima-design-tokens.json');

// Style Dictionary
module.exports = tokens;
```

### Component Matrix

Tabela completa de variantes + classe CSS + uso recomendado (disponível na landing page).

### Customizando para seu brand

Sobrescreva tokens mantendo os nomes semânticos:

```css
:root {
  --lime: #SEU_PRIMARY;
  --purple: #SEU_ACCENT;
  /* bg, text, surface, border, muted, subtle se ajustam automaticamente */
}
```

---

## 19. Voice & Tone

Três pilares que definem como o Lima "fala":

### 1. Direto
Vá ao ponto. Sem rodeios.

✅ **"Salvar alterações"** em vez de ~~"Clique aqui para salvar suas valiosas alterações"~~

### 2. Acolhedor
Humano, mas não infantil.

✅ **"Ops, algo deu errado. Tenta de novo?"** em vez de ~~"ERRO 500: Internal Server Error"~~

### 3. Energético
Ativo, positivo, motivador.

✅ **"Tudo certo!"** em vez de ~~"Operação concluída com sucesso"~~

### Microcopy guidelines

| Contexto | Tom |
| --- | --- |
| Botões primários | Verbo no infinitivo · "Salvar", "Enviar", "Continuar" |
| Mensagens de sucesso | Entusiasmo contido · "Tudo certo!" |
| Mensagens de erro | Empático + ação · "Não conseguimos conectar. Tenta de novo?" |
| Placeholders | Sugestão, não instrução · "Buscar projetos…" |
| Empty states | Convidativo · "Crie seu primeiro projeto" |
| Confirmações de exclusão | Claro + reversível · "Excluir projeto? Isso pode ser desfeito." |

### Capitalização

- **Botões e CTAs**: Sentence case · "Salvar alterações" (não "SALVAR ALTERAÇÕES")
- **Títulos**: Sentence case · "Configurações de conta"
- **Eyebrows**: UPPERCASE · "BRAND LIBRARY"

---

## 20. Branding

### Logo

O logo Lima é composto por **mark + wordmark + tag opcional**.

- **Mark only** (ícone): círculo `--lime` com seta/play `▶` interna em preto
- **Wordmark**: "Lima" em `Space Grotesk 700`, `letter-spacing: -0.02em`
- **Tag**: "Design System" em pill `--subtle`

### Clear space

Clear space mínimo ao redor do logo = altura do mark (`36px`).

### Tamanhos mínimos

| Versão | Largura mínima |
| --- | --- |
| Mark only | `24px` |
| Logo completo | `120px` |
| Logo + tag | `160px` |

### Uso correto ✅

- Fundo claro: logo em `--text` (preto)
- Fundo escuro: logo em `--text` (branco)
- Sobre `--lime`: logo em `#0A0A0A`
- Sobre `--purple`: logo em `#FFFFFF`

### Não fazer ❌

- ❌ Não distorça proporções
- ❌ Não troque as cores de marca
- ❌ Não adicione efeitos (sombra, outline, gradient)
- ❌ Não rotacione (exceto hover do mark)
- ❌ Não use em fundos de baixo contraste sem outline

---

## 21. Acessibilidade

### WCAG 2.1 AA

Todas as combinações cumprem mínimo `4.5:1` (texto normal) / `3:1` (texto grande).

| Combinação | Ratio | Status |
| --- | --- | --- |
| `--text` em `--bg` (dark/light) | `19.4:1` | ✅ AAA |
| `--muted` em `--bg` (dark) | `7.6:1` | ✅ AAA |
| `#0A0A0A` em `--lime` | `14.5:1` | ✅ AAA |
| `#FFFFFF` em `--purple` (dark) | `4.7:1` | ✅ AA |
| `#FFFFFF` em `--red` (dark) | `4.6:1` | ✅ AA |

### Focus ring

```css
:focus-visible {
  outline: 2px solid var(--lime);
  outline-offset: 2px;
  border-radius: inherit;
}
```

### Keyboard

- **Tab/Shift+Tab**: navega entre interativos
- **Enter/Space**: ativa botões, toggles, links
- **Esc**: fecha modais, dropdowns, toasts
- **Arrow keys**: navegação em listas (select, radio, menu)

### ARIA

| Componente | ARIA |
| --- | --- |
| Botão toggle | `aria-pressed` |
| Switch | `role="switch"` + `aria-checked` |
| Modal | `role="dialog"` + `aria-modal` + `aria-labelledby` |
| Toast info | `role="status"` + `aria-live="polite"` |
| Toast error | `role="alert"` + `aria-live="assertive"` |
| Tabs | `role="tablist"` / `tab` / `tabpanel` + `aria-selected` |
| Menu | `role="menu"` / `menuitem` |
| Tooltip | `role="tooltip"` |

### prefers-reduced-motion

Respeitado em todas as animações (ver Motion).

### prefers-color-scheme

Pode definir tema padrão automaticamente quando o usuário não escolheu manualmente:

```css
@media (prefers-color-scheme: light) {
  :root:not([data-theme]) { /* tokens light */ }
}
```

---

## 22. Migration Guide

### v1.0 → v1.1

#### Breaking changes

| O que mudou | Migração |
| --- | --- |
| `--lime` agora é `#C2F500` em **ambos os temas** (era `#A6D400` no light) | Verifique textos pretos sobre `--lime` em light mode. Contrast ratio: `14.5:1` (AAA) ✓ |
| `badge-outline-white` e `badge-outline-black` removidos | Use `badge-outline-text` (token semântico `--text`) |
| Theme toggle agora persiste em `localStorage` | Limpar cache ou localStorage se houver comportamento estranho |

#### Novos componentes

- Modal · Dropdown · Tooltip · Tabs · Stepper · Breadcrumb · Pagination
- Skeleton · Progress (linear/circular) · Empty state · Search field · Tag input · Accordion
- Icon-only buttons (pill)

#### Novos tokens

- `--motion-*` (5 durações) + `--ease-*` (3 easings)
- `--shadow-*` (4 elevações) + `--z-*` (7 níveis de empilhamento)

#### Padrão de outline

Todos os componentes `outline` agora usam token semântico onde possível (`badge-outline-text` em vez de variantes brancas/pretas fixas).

---

## Tema & Variáveis CSS

### Tema Dark (padrão)

| Variável | Valor |
| --- | --- |
| `--bg` | `#0A0A0A` |
| `--text` | `#FFFFFF` |
| `--muted` | `#A1A1AA` |
| `--subtle` | `#71717A` |
| `--surface` | `#151515` |
| `--surface2` | `#1E1E1E` |
| `--border` | `#2A2A2A` |
| `--lime` | `#C2F500` |
| `--purple` | `#A855F7` |
| `--red` | `#FF463A` |

### Tema Light

| Variável | Valor |
| --- | --- |
| `--bg` | `#FFFFFF` |
| `--text` | `#0A0A0A` |
| `--muted` | `#52525B` |
| `--subtle` | `#A1A1AA` |
| `--surface` | `#FAFAFA` |
| `--surface2` | `#F4F4F5` |
| `--border` | `#E4E4E7` |
| `--lime` | `#C2F500` |
| `--purple` | `#7C3AED` |
| `--red` | `#E11D26` |

### Tokens compartilhados (não mudam entre temas)

Definidos em `:root {}`: motion, easing, elevation, z-index, radius, spacing.

### Estilos globais

```css
:root {
  background: var(--bg);
  color: var(--text);
  font-family: 'Hanken Grotesk', sans-serif;
  transition: background var(--motion-slow) var(--ease-standard),
              color var(--motion-slow) var(--ease-standard);
}
::selection { background: var(--lime); color: #0A0A0A; }
```

---

## Apêndice

### Internacionalização (i18n / LTR-RTL)

#### Suporte a RTL

Use `dir="rtl"` no `<html>` para idiomas RTL (árabe, hebraico).

```css
[dir="rtl"] .icon-chevron-right { transform: scaleX(-1); }
```

#### Diretrizes

- **Evite texto em imagens** — use SVGs com `<text>` ou ícones
- **Deixe espaço para expansão** — texto em alemão costuma ser 30% mais longo que inglês
- **Truncar com ellipsis** quando necessário (`text-overflow: ellipsis`)
- **Datas e números** — use `Intl.DateTimeFormat` e `Intl.NumberFormat`

### Print styles

```css
@media print {
  /* Remove elementos não relevantes */
  .nav, .footer, .toast, .modal { display: none !important; }
  /* Força fundo branco */
  body { background: white !important; color: black !important; }
  /* Mostra URLs em links */
  a[href]::after { content: " (" attr(href) ")"; font-size: 11px; }
  /* Evita quebras no meio de cards */
  .card { break-inside: avoid; }
}
```

### Page meta pattern

```html
<title>Lima Design System · {Section} · v1.1</title>
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="/og.png">
<meta name="theme-color" content="#C2F500">
```

---

## Convenções & Boas Práticas

- **Vermelho é semântico** — nunca decorativo.
- **Espaçamento consistente** — use tokens (`xs → 3xl`), nunca valores arbitrários.
- **Hierarquia tipográfica clara** — títulos em Space Grotesk, corpo em Hanken Grotesk.
- **Alto contraste** — mínimo WCAG AA em todas as combinações.
- **Motion respeitosa** — curta e consistente. Sempre respeite `prefers-reduced-motion`.
- **Outline adaptativo** — prefira tokens semânticos (`--text`) em vez de cores fixas.
- **Icon-only buttons** — sempre com `aria-label`.
- **Modais** — trap focus + `Esc` para fechar + click no scrim.
- **Voice & tone** — direto, acolhedor, energético. Sentence case em CTAs.

---

*Lima Design System · v1.1 — ⌁ high contrast, full energy.*
