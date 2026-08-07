# Sprint 3 — Sistema

**Escopo:** §8 Papéis, §9 Skills, §10 Workflows, §11 Máquina de estados
**Status:** concluído — aguardando validação para iniciar o Sprint 4
**Data:** 2026-08-06

---

## 1. Objetivos concluídos

| Seção | Entrega |
|---|---|
| §8 Papéis | 6 papéis com missão, autoridade, responsabilidades e limites + matriz de separação de autoridade |
| §9 Skills | 11 exemplos de capacidades, `SkillExplorer` com árvore navegável e os 9 elementos de uma skill confiável |
| §10 Workflows | `WorkflowTabs` com os 5 workflows, cada um com propósito, gatilho, sequência e YAML declarativo |
| §11 Máquina de estados | `StateMachine` com 17 estados — 9 do fluxo principal e 8 de exceção — com contrato completo de cada um |

### Evidência dos gates

| Gate | Status | Exit | Duração |
|---|---|---|---|
| Lint | passou | 0 | 8,5s |
| Typecheck | passou | 0 | 4,0s |
| Build | passou | 0 | 12,7s |

---

## 2. Arquivos

**Criados (12)**

| Arquivo | Papel |
|---|---|
| `lib/use-roving-tabs.ts` | Hook do padrão ARIA de tabs, compartilhado |
| `ui/TreeView.tsx` | Árvore ARIA reutilizável (reaproveitada no sprint 4) |
| `ui/CodeBlock.tsx` | Bloco de código com cabeçalho e rolagem própria |
| `data/roles.ts` | 6 papéis + matriz de autoridade |
| `data/skills.ts` | Exemplos, anatomia e árvore de uma skill |
| `data/workflows.ts` | 5 workflows com YAML |
| `data/states.ts` | 17 estados + tons semânticos |
| `diagrams/AuthoritySeparation.tsx` | Matriz de autoridade em `<table>` |
| `interactive/SkillExplorer.tsx` | §9 |
| `interactive/WorkflowTabs.tsx` | §10 |
| `interactive/StateMachine.tsx` | §11 |
| `sections/` | `Roles`, `Skills`, `Workflows`, `StateMachineSection` |

**Modificados (4)**
`interactive/PipelineExplorer.tsx` (refatorado para o hook) · `types/content.ts` ·
`ui/Icon.tsx` · `app/page.tsx`

---

## 3. Decisões arquiteturais

**A13 — Comportamento de tabs extraído para `useRovingTabs`.**
O sprint precisaria da mesma lógica em três widgets. Em vez de triplicá-la, o
`PipelineExplorer` do sprint 2 foi refatorado para consumir o hook, que agora serve os
três. Garante que teclado e ARIA se comportem igual em toda a página.

**A14 — `TreeView` construído como primitivo, não como parte do `SkillExplorer`.**
Usa a representação plana da árvore ARIA (`aria-level`, `aria-setsize`, `aria-posinset`),
o que simplifica a navegação por teclado e mantém a validade da especificação. O
`RepositoryExplorer` da §18 reaproveita o componente sem alteração.

**A15 — A matriz de autoridade é uma `<table>` de verdade.**
Cabeçalhos em ambos os eixos com `scope`, `<caption>` para leitores de tela e o
significado de cada célula em texto acessível — não apenas um símbolo. A diagonal
formada pelas marcas é o argumento visual: cada papel detém exatamente uma capacidade.

**A16 — Tons semânticos por estado de exceção.**
Sair do fluxo principal não é sinônimo de erro. `RELEASE_CANDIDATE` e `HUMAN_REVIEW`
usam azul, `COMPLETE` usa esmeralda, e o vermelho reservado fica só para `REJECTED` e
`REGRESSION`. Pintar as oito exceções de âmbar teria comunicado algo falso.

**A17 — Sem realce de sintaxe por biblioteca.**
Destacar YAML exigiria um parser no bundle para ganho estético pequeno. O `CodeBlock`
resolve com monoespaçada, contraste e enquadramento.

---

## 4. Achado de método: as medições anteriores estavam contaminadas

A verificação de contraste dos estados de exceção retornou **valores idênticos para os
oito** — o que não podia ser verdade com quatro tons distintos. A investigação descartou,
em ordem: classe ausente do DOM, utilitário não gerado pelo Tailwind, override por
ancestral e estilo inline. Um clone do mesmo botão, no mesmo pai, renderizava âmbar
corretamente; o elemento vivo, não.

A causa: **o painel do browser não compõe frames neste ambiente**, então o relógio de
animação nunca avança. As transições CSS ficam presas em `currentTime: 0` com
`playState: "running"`, e `getComputedStyle` devolve o valor **inicial** da transição —
a cor anterior — em vez do valor final. Forçar reflow cancela a transição e revela a cor
real.

**Consequência para o método:** qualquer elemento com `transition-colors` cujo estado
mudou precisa ter as animações liquidadas antes de ser medido. As varreduras de contraste
de estado estático dos sprints 1 e 2 não são afetadas — elas mediram elementos que nunca
transicionaram. As medições de estado ativo deste sprint foram refeitas com as transições
liquidadas.

---

## 5. Verificações realizadas

| Verificação | Método | Resultado |
|---|---|---|
| Teclado — `TreeView` | Recolher, expandir, entrar no filho, subir ao pai, Home/End | Correto em todos os casos; `aria-level` exato em cada profundidade (1 a 4); roving mantido |
| Teclado — 3 tablists | Setas, Home, End e wrap nos extremos | Ciclo (10), Workflows (5) e Estados (17) corretos; a máquina de estados atravessa fluxo principal e exceções como sequência única |
| Painéis | `aria-labelledby` × aba ativa | Sincronizados nos três widgets |
| Contraste — estático | Varredura de 82 pares com composição de alpha | Zero reprovados |
| Contraste — tons ativos | Ativação de cada exceção, com transições liquidadas | Âmbar 9,32 · vermelho 5,32 · azul 9,35 · esmeralda 10,41 — todos acima de 4,5 |
| Hierarquia de headings | Varredura H1–H6 | 53 headings, 1 único H1, zero pulos |
| Responsividade | 375 e 1272px | Página sem overflow; tabela (min 640px) e blocos de YAML rolam dentro dos próprios containers |
| Alvos de toque | Medição de links, botões e itens de árvore | Todos ≥ 24px |

---

## 6. Pendências

- **P4 — Verificação visual ainda pendente**, agora com causa identificada: o painel não
  compõe frames, o que impede screenshot **e** trava as transições. Vale abrir a página
  manualmente antes do sprint 4 — três sprints já se acumularam sem conferência a olho.
- **P6 — Âncoras pendentes: 9.** `#arquitetura`, `#human-actions`, `#estrutura`,
  `#roadmap`, `#gates`, `#colaboracao`, `#evidencia`, `#bootstrap` e `#open-source`
  entram nos sprints 4 e 5.
- **P5 e P1** — inalteradas.
- **R1 (peso de JS):** a página passou de 4 para 7 ilhas cliente. É o sprint mais pesado
  do plano; os sprints 4 e 5 adicionam 2 e 0 ilhas respectivamente. Medir o bundle no
  sprint final.
