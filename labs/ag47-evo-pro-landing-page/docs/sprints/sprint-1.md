# Sprint 1 — Fundação

**Escopo:** §1 Header e §2 Hero do documento mestre, mais o scaffold do projeto
**Status:** concluído — aguardando validação para iniciar o Sprint 2
**Data:** 2026-08-06

---

## 1. Objetivos concluídos

| Objetivo | Resultado |
|---|---|
| Estrutura do projeto | App Next 16 standalone, espelhando as convenções de `labs/digital-bank` |
| Layout base | Tokens de design, `lib/motion`, `lib/utils`, 9 primitivos de UI |
| Header | Fixo, reduz de 80px para 56px no scroll, nav por âncora, menu móvel |
| Hero | Headline, subheadline, 3 CTAs e o diagrama `ProtocolStack` |
| Sistema de navegação | Header + rodapé de 4 colunas, ambos derivados de `data/navigation.ts` |
| Gate build · lint · typecheck | Os três passam — evidência real registrada |

### Evidência dos gates

Gerada por `npm run evidence` em `2026-08-06T22:02:42.452Z` (Node v22.18.0),
gravada em `src/data/build-evidence.json`:

| Gate | Status | Exit | Duração |
|---|---|---|---|
| Lint | passou | 0 | 7,6s |
| Typecheck | passou | 0 | 4,9s |
| Build | passou | 0 | 11,9s |

A rota `/` é reportada pelo build como `○ (Static)` — prerenderizada estaticamente,
confirmando a decisão A1 do sprint 0.

---

## 2. Arquivos criados

Nenhum arquivo pré-existente foi modificado — o diretório continha apenas
`.claude/settings.local.json`.

**Configuração (8)**
`package.json` · `tsconfig.json` · `next.config.ts` · `postcss.config.mjs` ·
`eslint.config.mjs` · `.gitignore` · `.claude/launch.json` · `README.md`

**Aplicação (4)**
`src/app/layout.tsx` · `src/app/page.tsx` · `src/app/globals.css` · `next-env.d.ts`

**Componentes (13)**
`layout/Header.tsx` · `layout/Footer.tsx` · `layout/ScrollProgress.tsx` ·
`sections/Hero.tsx` · `diagrams/ProtocolStack.tsx` ·
`ui/Container.tsx` · `ui/Section.tsx` · `ui/SectionHeading.tsx` · `ui/Badge.tsx` ·
`ui/ButtonLink.tsx` · `ui/Icon.tsx` · `ui/MotionProvider.tsx` · `ui/Reveal.tsx` ·
`ui/ProtocolMark.tsx` · `ui/GithubMark.tsx`

**Dados e tipos (4)**
`data/site.ts` · `data/navigation.ts` · `data/protocol-stack.ts` · `types/content.ts`

**Infraestrutura (3)**
`lib/utils.ts` · `lib/motion.ts` · `scripts/collect-evidence.mjs`

---

## 3. Decisões arquiteturais

As decisões A1–A5 do sprint 0 foram implementadas sem desvio. Quatro decisões novas
surgiram durante a execução:

**A6 — `--color-canvas`, não `--color-base`.**
O token de fundo foi renomeado antes de se espalhar: em Tailwind v4, `--color-base`
geraria a utilitária `text-base`, que colide com o tamanho de fonte homônimo. O fundo
da página passou a se chamar `canvas`.

**A7 — `turbopack.root` fixado no `next.config.ts`.**
O lab vive dentro do monorepo Ag47.pt, que tem o próprio `package-lock.json`. Sem
fixar a raiz, o Turbopack inferia o diretório do monorepo e passava a observar
arquivos fora do projeto. Resolvido com `root: import.meta.dirname`.

**A8 — Marca do GitHub em SVG inline.**
O lucide-react removeu ícones de marca a partir da v1 (confirmado: não há export
`Github` na 1.29.0). O glifo vive em `ui/GithubMark.tsx`, sem dependência adicional.

**A9 — Rótulos de widget não são headings.**
O nome da camada ativa no `ProtocolStack` troca conforme a interação, então é um
`<p>` com `aria-live`, não um heading. O heading da região é "Pilha do protocolo",
estático. Isso mantém a hierarquia do documento navegável.

---

## 4. Riscos encontrados

Três defeitos foram detectados por verificação, não por inspeção visual — e os três
foram corrigidos dentro do sprint:

| Achado | Diagnóstico | Correção |
|---|---|---|
| Hierarquia de headings pulava H1 → H3 | O painel do `ProtocolStack` abria em `<h3>` sem um `<h2>` antecedente | "Pilha do protocolo" virou `<h2>`; o nome da camada virou `<p>` (A9) |
| `--fg-faint` reprovava em contraste | #626a74 dava 3,64:1 contra o fundo, abaixo dos 4,5:1 exigidos, e era usado em rótulos de 10–12px | Recalibrado para #7d8692 — 5,40 (canvas) / 5,21 (surface) / 4,93 (surface-2) |
| Número da camada poluía o nome acessível | O índice "01" entrava no nome computado do botão | `aria-hidden` no índice; a posição já é comunicada pela lista ordenada |

**Risco R1 (peso de JS) — sob controle nesta fase.** A página tem 3 ilhas cliente
(`Header`, `ScrollProgress`, `ProtocolStack`) e o framer-motion carrega apenas
`domAnimation` via `LazyMotion strict`, que rejeita `motion.*` em tempo de execução
e força o uso de `m.*`. Reavaliar ao fim do sprint 3, quando entram mais 4 widgets.

**Risco R6 (honestidade do conteúdo) — ainda não exercido.** As seções que o
disparam (§18 e §20) só entram nos sprints 4 e 5.

---

## 5. Verificações realizadas

| Verificação | Método | Resultado |
|---|---|---|
| Responsividade | Viewports de 375, 768 e 1272px | Sem overflow horizontal em nenhum |
| Header em 1280px | Medição das caixas de logo, nav e ações | Folga de 49px de cada lado da nav |
| Menu móvel | Abertura, `aria-expanded`, trava de scroll, Escape | Correto; Escape restaura o overflow do body |
| Contraste | Cálculo WCAG sobre as cores computadas | 12 pares de texto/fundo, todos ≥ AA |
| Semântica | Árvore de acessibilidade | `banner`, `main`, `contentinfo`, navs rotuladas, listas corretas |
| Console | Leitura do console do browser | Nenhum erro ou aviso |

---

## 6. Pendências

- **P4 — Verificação visual pendente.** O painel do browser não estava sendo exibido
  nesta sessão, então não foi possível capturar screenshot. A validação foi
  estrutural e numérica (árvore de acessibilidade, medição de caixas, contraste
  calculado), não visual. **Vale uma conferência a olho antes do sprint 2.**
- **P5 — Focus trap do menu móvel.** O menu fecha com Escape, trava o scroll e
  devolve o estado, mas o foco ainda pode sair do painel aberto via Tab. Programado
  para o sprint final, junto da passagem completa de acessibilidade.
- **P6 — Âncoras de seções futuras.** A navegação já declara a IA completa das 24
  seções; os âncoras de §3 a §24 passam a resolver conforme as seções entram nos
  sprints 2 a 5.
- **P1 (do sprint 0) — permanece.** `site.url` e `site.repoUrl` seguem inferidos.
- **Aviso de porta:** `npm run dev` usa a 3000, que pode colidir com o app principal
  do monorepo. O `.claude/launch.json` do projeto usa a 3005.
