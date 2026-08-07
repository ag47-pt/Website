# Sprint 4 — Governança

**Escopo:** §12 Colaboração, §13 Human Actions, §14 Bootstrap, §15 Arquitetura,
§16 Evidência, §17 Gates, §18 Estrutura do repositório
**Status:** concluído — aguardando validação para iniciar o Sprint 5
**Data:** 2026-08-06

---

## 1. Objetivos concluídos

| Seção | Entrega |
|---|---|
| §12 Colaboração | 3 categorias — executáveis, validáveis e humanas — organizadas por quem executa e quem consegue provar |
| §13 Human Actions | Fluxo de 4 etapas, painel com 4 indicadores, tabela de 6 registros e o exemplo em YAML |
| §14 Bootstrap | 13 passos de leitura + o que o bootstrap faz e o que ele não faz |
| §15 Arquitetura | Atual, alvo e gap em três colunas, cada uma apontando para seu arquivo |
| §16 Evidência | Exemplo de claim em JSON, escala de confiança em 4 faixas e as 3 verdades |
| §17 Gates | 13 gates agrupados em 5 categorias + execução ilustrativa **com falha** |
| §18 Estrutura | `RepositoryExplorer` com duas árvores navegáveis e aviso de especificação |

### Evidência dos gates

| Gate | Status | Exit | Duração |
|---|---|---|---|
| Lint | passou | 0 | 8,4s |
| Typecheck | passou | 0 | 4,3s |
| Build | passou | 0 | 11,8s |

A página chegou a **17 seções** e continua prerenderizada estaticamente.

---

## 2. Arquivos

**Criados (14)**
`data/collaboration.ts` · `data/human-actions.ts` · `data/bootstrap.ts` ·
`data/architecture-gap.ts` · `data/evidence.ts` · `data/gates.ts` · `data/repository-tree.ts` ·
`diagrams/HumanActionFlow.tsx` · `interactive/RepositoryExplorer.tsx` ·
`sections/Collaboration.tsx` · `sections/HumanActions.tsx` · `sections/Bootstrap.tsx` ·
`sections/ArchitectureGap.tsx` · `sections/Evidence.tsx` · `sections/Gates.tsx` ·
`sections/RepositoryStructure.tsx`

**Modificados (2)**
`ui/TreeView.tsx` (sincronização de foco) · `app/page.tsx`

---

## 3. Decisões arquiteturais

**A18 — O painel de gates mostra uma falha, não tudo verde.**
Um painel todo aprovado não demonstra nada sobre o comportamento do protocolo. O exemplo
reprova a auditoria de dependências, marca os gates seguintes como não executados e
termina em `REGRESSION` — é o caso que prova a tese da §16.

**A19 — O painel de Human Actions é estático.**
O documento pede um painel "ilustrativo". Torná-lo filtrável adicionaria uma ilha cliente
sem ganho de argumento. O sprint fechou com **apenas 1 ilha nova** (`RepositoryExplorer`)
para sete seções.

**A20 — Aviso explícito de especificação na §18.**
O risco R6 do sprint 0 se materializou aqui: as árvores descrevem um repositório que
ainda não existe. Apresentá-las como estado atual contradiria o princípio de evidência
defendido duas seções acima. A seção abre com um aviso em âmbar declarando que é
especificação, não retrato.

**A21 — `TreeView` sincroniza `activeIndex` com o foco real.**
O nó sobre o qual Enter age era derivado apenas de setas e cliques. Um foco que chegasse
por outro caminho faria Enter operar sobre o nó anterior. Um `onFocus` elimina a classe
inteira do problema.

---

## 4. Riscos e correções

**Regressão de overflow horizontal — corrigida.** A página passou a rolar
horizontalmente no mobile pela primeira vez no projeto (`scrollWidth` 681 contra viewport
de 375). Causa: **itens de grid nascem com `min-width: auto` e se recusam a encolher
abaixo do conteúdo**. A tabela de 560px da §13 e o JSON da §16 vazavam a largura para
fora da página, mesmo estando dentro de containers com `overflow-x-auto` — porque quem
não conseguia encolher era o item de grid acima deles, não o container.

Corrigido com `min-w-0` nos dois itens e `minmax(0,…)` nos templates de coluna. O header
aparecia com 681px de largura como **consequência**, não como causa: sendo `inset-x-0`,
ele se estica até a largura do documento.

Vale registrar o que **não** era defeito: as tabelas de §8 e §13 e os blocos de YAML e
JSON ultrapassam a viewport por dentro dos próprios containers roláveis. Isso é o
comportamento correto, e meu detector inicial os apontava como culpados por medir posição
absoluta sem considerar rolagem.

---

## 5. Verificações realizadas

| Verificação | Método | Resultado |
|---|---|---|
| Contraste | 106 pares únicos, com composição de alpha e transições liquidadas | **Zero reprovados** |
| Hierarquia de headings | Varredura H1–H6 | 72 headings, 1 único H1, zero pulos |
| Overflow horizontal | 375 e 1272px, ignorando containers roláveis | Sem vazamento após a correção; 4 blocos largos rolam dentro dos próprios containers |
| Tabelas | Estrutura semântica | Ambas com `<caption>` e `th[scope]` — 13 e 5 cabeçalhos |
| `RepositoryExplorer` | Troca de abas e seleção de nó | Árvore alterna entre 19 e 13 nós; painel de detalhe acompanha |
| Alvos de toque | Medição no mobile | Todos ≥ 24px, exceto o skip link (correto) |
| Console | Leitura | Apenas falhas de WebSocket do HMR do ambiente |

---

## 6. Pendências

- **P4 — Verificação visual segue pendente**, e agora com um custo mensurável: a
  regressão de overflow deste sprint teria sido óbvia a olho nu e só apareceu porque eu a
  procurei por medição. **Quatro sprints acumulados sem conferência visual.**
- **P7 — Testes contaminados por estado residual.** Durante a verificação do
  `RepositoryExplorer`, medições sucessivas ficaram inconsistentes porque minhas próprias
  interações mutavam o componente, e porque `navigate` para a mesma URL faz navegação
  client-side sem recarregar. As leituras confiáveis exigem reload real antes de cada
  bateria. Não é defeito da aplicação, mas afeta a confiança das medições.
- **P6 — Âncoras pendentes: 2.** `#roadmap` e `#open-source` entram no sprint 5.
- **P5 e P1** — inalteradas.
- **R1:** a página está em **8 ilhas cliente**. O sprint 5 não adiciona nenhuma.
