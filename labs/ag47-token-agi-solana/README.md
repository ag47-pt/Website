# AG Intelligence Token (AGI) — Landing Page

Landing page do **AG Intelligence Token**, o ativo utilitário que mede e liquida trabalho dentro do
**Organismo Cognitivo AG47**. Next.js 16 (App Router) + Tailwind CSS v4, dark-first, estática.

## Correr

```bash
npm install
```

```bash
npm run dev
```

Fica disponível em `http://localhost:3000` (usei `--port 3111` durante a verificação).

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (a página é pré-renderizada como estática) |
| `npm run lint` | ESLint com `--max-warnings=0` |
| `npm run typecheck` | `tsc --noEmit` |

## Estrutura

```
app/
  layout.tsx          Metadata, fontes (Manrope + JetBrains Mono), viewport
  page.tsx            Composição das secções, por ordem
  globals.css         Reset, utilitários (grid, aurora, gradientes, animações)
styles/
  tokens.css          Design tokens (:root) + mapeamento @theme para Tailwind v4
lib/
  content.ts          FONTE ÚNICA de todo o texto e de todos os números
  cn.ts               Concatenação de classes
components/
  site/               Logo, SiteHeader (nav + menu mobile), SiteFooter
  ui/                 Section, SectionHeading, Eyebrow, GlassCard, CtaButton,
                      HighlightText, CountUp
  visuals/            NetworkField (canvas), Aurora, OrganismDiagram, FlowStrip,
                      AllocationDonut, AreaSpark, ConsolePanel
  sections/           Hero, NetworkMetrics, Problem, Solution, HowItWorks,
                      TokenUtility, Tokenomics, Differentiators, Roadmap, Faq, FinalCta
```

### Editar conteúdo

Todo o texto, tokenomics, roadmap, FAQ e métricas vivem em [`lib/content.ts`](lib/content.ts). As
secções não têm strings hardcoded — alterar a copy é alterar esse ficheiro apenas.

A sintaxe `*texto*` num título é renderizada pelo `HighlightText` com o gradiente da marca.

## Decisões relevantes

- **Conteúdo em inglês.** O headline pedido era em inglês e o público de um token é global. A
  documentação do repositório fica em português.
- **Métricas rotuladas.** Os contadores animados (`NetworkMetrics`) e o trace do `ConsolePanel` são
  ilustrativos e estão explicitamente identificados como devnet, na própria secção e no rodapé. Não
  são apresentados como volume de mainnet.
- **Disclosure legal** no rodapé: AGI é utilitário, não é produto de investimento, nada na página é
  aconselhamento financeiro. Está em `disclosure` no `content.ts`.
- **Sem logos, auditorias, parceiros ou equipa fictícios** — nada que finja prova social inexistente.
- **Roadmap honesto**: cada fase tem estado (`In progress` / `Next` / `Planned`) e nada é descrito
  como live sem o ser.

## Acessibilidade e performance

- `prefers-reduced-motion` desliga o canvas, os pulsos, o count-up e o trace animado.
- Accordion da FAQ com `aria-expanded` / `aria-controls`; tabela comparativa com `<caption>`,
  `scope` e texto para leitores de ecrã em cada célula.
- A tabela comparativa faz scroll no seu próprio contentor — o `body` nunca tem scroll horizontal.
- O contador com throughput contínuo atualiza a 1 Hz, não a cada frame.

## Estado

Lint, typecheck e `next build` passam. Verificado no browser em desktop (1280) e em largura estreita
(menu mobile, empilhamento das grelhas, sem overflow horizontal).
