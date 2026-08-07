# Sprint 2 — Tese

**Escopo:** §3 Problema, §4 Hipótese, §5 O que é, §6 Pilares, §7 Como funciona
**Status:** concluído — aguardando validação para iniciar o Sprint 3
**Data:** 2026-08-06

---

## 1. Objetivos concluídos

| Seção | Entrega |
|---|---|
| §3 Problema | 11 falhas estruturais em grade + `ProblemComparison` contrastando laço aberto e ciclo fechado |
| §4 Hipótese | Seção editorial com as 8 estruturas onde a inteligência deve viver |
| §5 O que é | 5 negações ("não é apenas…"), citação de posicionamento e 8 atributos do protocolo |
| §6 Pilares | 8 pilares, cada um com ícone, descrição e exemplo concreto de aplicação |
| §7 Como funciona | `PipelineExplorer` — 10 etapas navegáveis por teclado, com objetivo, entradas, saídas, autoridade, limitações e artefatos |

### Evidência dos gates

`npm run evidence` — resultado gravado em `src/data/build-evidence.json`:

| Gate | Status | Exit | Duração |
|---|---|---|---|
| Lint | passou | 0 | 7,9s |
| Typecheck | passou | 0 | 4,4s |
| Build | passou | 0 | 12,7s |

A rota `/` continua `○ (Static)` mesmo com as cinco seções novas.

---

## 2. Arquivos

**Criados (11)**

| Arquivo | Papel |
|---|---|
| `data/problems.ts` | 11 problemas + os dois fluxos comparados |
| `data/pillars.ts` | 8 pilares com exemplo prático |
| `data/protocol-identity.ts` | negações e 8 atributos |
| `data/pipeline.ts` | 10 etapas do ciclo, com autoridade e limites |
| `sections/Problem.tsx` | §3 |
| `sections/Hypothesis.tsx` | §4 |
| `sections/WhatItIs.tsx` | §5 |
| `sections/Pillars.tsx` | §6 |
| `sections/HowItWorks.tsx` | §7 |
| `diagrams/ProblemComparison.tsx` | comparação dos dois ciclos |
| `interactive/PipelineExplorer.tsx` | explorador do ciclo evolutivo |

**Modificados (5)**
`types/content.ts` (IconName ampliado de 15 para 37 chaves) · `ui/Icon.tsx` (mapa) ·
`app/page.tsx` (composição) · `layout/Footer.tsx` e `layout/Header.tsx` (alvo de toque)

---

## 3. Decisões arquiteturais

**A10 — `ProblemComparison` é Server Component.**
A animação progressiva exigida pelo documento saiu do `Reveal` com atraso indexado por
posição, em vez de um container de stagger no cliente. A seção inteira é renderizada no
servidor e não adiciona nenhuma ilha — mantendo o risco R1 sob controle.

**A11 — `PipelineExplorer` implementa o padrão ARIA de tabs, não uma lista de botões.**
`role="tablist"` com `aria-orientation="vertical"`, setas para navegar, Home/End para os
extremos, wrap circular nos limites e **roving tabindex**: só a etapa ativa fica na ordem
de tabulação, então Tab atravessa as 10 etapas de uma vez em vez de prender o usuário.
O painel tem `role="tabpanel"`, `tabIndex={0}` (para ser rolável por teclado) e
`aria-labelledby` apontando para a aba ativa.

**A12 — Numeração das seções em monoespaçada.**
Os blocos narrativos ganharam índice (`01 · Problema` … `05 · Ciclo evolutivo`), que os
sprints 3 a 5 continuam. Dá ritmo de documentação técnica e ajuda a orientar em uma página
longa.

---

## 4. Riscos e correções

| Achado | Diagnóstico | Correção |
|---|---|---|
| Alvos de toque abaixo do mínimo | Links do rodapé e da nav do header renderizavam com 18–20px de altura; SC 2.5.8 do WCAG 2.2 pede 24px | `py-1` / `py-1.5` e espaçamento reajustado — todos os alvos agora ≥ 24px |

**Falso alarme registrado.** A primeira verificação de teclado do `PipelineExplorer`
indicou navegação inoperante. O defeito estava no teste, não no componente: o evento era
disparado no container do tablist em vez de num tab focado. Refeito pelo caminho real do
usuário, o comportamento se confirmou correto em todos os casos.

**R1 (peso de JS) — reavaliado.** O sprint adicionou 5 seções e apenas **1** ilha cliente
(`PipelineExplorer`). O total da página segue em 4 ilhas. A decisão A10 é o motivo.

**R2 (volume de conteúdo) — materializou-se como previsto.** As quatro novas fontes de
conteúdo somam 4 módulos de dados tipados e nenhuma linha de texto no JSX.

---

## 5. Verificações realizadas

| Verificação | Método | Resultado |
|---|---|---|
| Hierarquia de headings | Varredura de H1–H6 da página inteira | 41 headings, 1 único H1, **zero pulos de nível** |
| Contraste | Cálculo WCAG compondo o fundo real através dos ancestrais com alpha | **60 pares únicos, zero reprovados** — inclui os passos em âmbar e as caixas sobre tinta esmeralda |
| Teclado (tabs) | Setas, Home, End e wrap nos dois extremos | Seleção, foco e `aria-labelledby` do painel sempre sincronizados; roving tabindex mantém exatamente 1 tab na ordem de tabulação |
| Responsividade | 375, 768 e 1272px | Sem overflow horizontal em nenhum |
| Grids | `gridTemplateColumns` computado | negações 3col · atributos 4col · comparação 2col · pilares 2col · pipeline 300/756 |
| Alvos de toque | Medição de todos os `<a>` e `<button>` visíveis | Todos ≥ 24px após a correção; só o skip link fica em 1px, que é o correto para `sr-only` |
| Console | Leitura do console | Apenas falhas de WebSocket do HMR do ambiente de preview — não são da aplicação |

---

## 6. Pendências

- **P4 — Verificação visual continua pendente.** O painel do browser segue sem compositar
  frames, então nenhum screenshot foi possível neste sprint também. Toda a validação é
  estrutural e numérica. **A conferência a olho segue valendo**, sobretudo para o ritmo
  vertical das cinco seções novas e o peso da grade de 11 problemas.
- **P6 — Âncoras pendentes: 13.** `#arquitetura`, `#papeis`, `#human-actions`,
  `#estrutura`, `#roadmap`, `#maquina-de-estados`, `#skills`, `#workflows`, `#gates`,
  `#colaboracao`, `#evidencia`, `#bootstrap` e `#open-source` passam a resolver nos
  sprints 3 a 5.
- **P5 e P1** — inalteradas desde os sprints anteriores.
