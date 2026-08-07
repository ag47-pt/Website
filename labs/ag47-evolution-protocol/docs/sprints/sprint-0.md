# Sprint 0 — Descoberta

**Projeto:** Landing page do AG47 Evolution Protocol
**Local:** `labs/ag47-evolution-protocol/`
**Status:** concluído — aguardando validação para iniciar o Sprint 1
**Data:** 2026-08-06

---

## 1. Base de partida

O diretório do projeto estava vazio (apenas `.claude/settings.local.json`). Não havia stack interna a
preservar, então as convenções foram derivadas dos labs irmãos do monorepo `Ag47.pt`.

| Fato | Valor | Fonte |
|---|---|---|
| Precedente mais próximo | `labs/digital-bank` — app Next standalone | `labs/digital-bank/package.json` |
| Next / React | `16.2.6` / `19.2.4` (pinados, sem `^`) | idem |
| Estilo | Tailwind **v4** (`@import "tailwindcss"`, sem `tailwind.config`) | `digital-bank/src/app/globals.css` |
| Animação / ícones | `framer-motion ^12`, `lucide-react ^1.16` | idem |
| Utilitários | `clsx` + `tailwind-merge` → `cn()` | `digital-bank/src/lib/utils.ts` |
| Estrutura | `src/app` + alias `@/*` → `./src/*`, `strict: true` | `digital-bank/tsconfig.json` |
| Isolamento | cada lab tem `package.json` + lockfile próprios (a raiz **não** usa workspaces) | `Ag47.pt/package.json` |
| Runtime | Node v22.18.0, npm 10.9.3 | shell |

O `AGENTS.md` da raiz determina que este Next tem breaking changes e exige leitura de
`node_modules/next/dist/docs/` antes de escrever código. Confirmado para o planejamento: uma landing
sem data-fetching é prerenderizada estaticamente sem configuração extra
(`01-app/02-guides/public-static-pages.md`), e existem convenções de arquivo para `sitemap.ts`,
`robots.ts` e `opengraph-image`. Os guias específicos serão relidos a cada sprint que toque API nova.

---

## 2. Objetivos

**Objetivo do produto:** uma landing page que se leia como documentação de infraestrutura
(Vercel/Stripe/Grafana), não como página promocional de startup de IA — apresentando o AG47 Evolution
Protocol como *protocolo*, não como agente.

| # | Objetivo | Como se verifica |
|---|---|---|
| O1 | 24 seções do doc mestre + seção "Como esta página foi construída" | inspeção seção a seção |
| O2 | Conteúdo 100% em português, sem lorem ipsum e sem texto genérico | revisão de copy por sprint |
| O3 | Explorador de arquivos funcional | abrir/fechar pastas, ler descrições |
| O4 | Máquina de estados interativa | clicar estado → definição, entradas/saídas, agentes, evidências |
| O5 | Fluxo de Human Actions representado + painel | seção 13 |
| O6 | Responsivo mobile / tablet / desktop | teste em 3 viewports |
| O7 | `build` + `lint` + `typecheck` sem erros | execução real, saída registrada |
| O8 | SEO completo (metadata, OG, sitemap, robots) | inspeção do HTML gerado |
| O9 | Acessibilidade por teclado + contraste + `prefers-reduced-motion` | navegação só por teclado |
| O10 | README com instruções de execução local | arquivo presente |

**Não-objetivos** (explícitos nos documentos): implementar o protocolo em si; prometer integrações
prontas; apresentar oferta comercial fechada.

---

## 3. Riscos

| # | Risco | Impacto | Mitigação |
|---|---|---|---|
| R1 | **Peso de JS.** ~12 ilhas interativas + framer-motion podem degradar LCP | Alto | Server Components por padrão; `"use client"` só na folha, nunca na seção; `LazyMotion` + `m.*` |
| R2 | **Volume de conteúdo.** 24 seções de copy técnica em PT são trabalho de escrita, não só de código | Alto | Conteúdo isolado em `src/data/*.ts` tipado; copy escrita junto da seção, sprint a sprint |
| R3 | **Excesso de animação** prejudicando leitura — proibido nos dois documentos | Médio | Orçamento de motion: 1 variante de reveal compartilhada, durações ≤ 400ms; `prefers-reduced-motion` centralizado em `lib/motion.ts` |
| R4 | **A11y dos widgets custom** (máquina de estados, tree view, tabs) | Alto | Padrões ARIA (`tablist/tab/tabpanel`, `tree/treeitem`), roving tabindex; teste só com teclado ao fim de cada sprint |
| R5 | **Next 16 ≠ Next do treino do agente** (regra P0 do AGENTS.md) | Médio | Ler `node_modules/next/dist/docs/` antes de cada uso de API nova |
| R6 | **Honestidade do conteúdo.** As seções 18 e 20 descrevem repositório e integrações que ainda não existem; apresentá-los como fato contradiz o princípio de evidência do próprio protocolo (§16) | Médio | Rotular explicitamente como *especificação/visão*, nunca como estado atual |
| R7 | `npm install` exige rede e adiciona `node_modules` a mais um lab | Baixo | 6 dependências de runtime, lockfile commitado, `.gitignore` correto |
| R8 | `next/font/google` falha em build offline | Baixo | Geist/Geist Mono como no lab irmão; fallback para `next/font/local` se houver bloqueio |
| R9 | Ambiguidade entre os 6 sprints do adendo e as 24 seções do doc mestre | Baixo | Mapeamento explícito na seção 7, com as decisões sinalizadas |

---

## 4. Dependências

**Runtime (6):** `next@16.2.6`, `react@19.2.4`, `react-dom@19.2.4`, `framer-motion@^12.39.0`,
`lucide-react@^1.16.0`, `clsx@^2.1.1` + `tailwind-merge@^3.6.0`.

**Dev (8):** `typescript@^5`, `@types/{node,react,react-dom}`, `tailwindcss@^4`,
`@tailwindcss/postcss@^4`, `eslint@^9`, `eslint-config-next@16.2.6`.

Zero dependências além dessas — sem UI kit, sem lib de ícones extra, sem lib de animação extra.

**Externas:** Google Fonts (build), repositório GitHub, domínio canônico.
**De processo:** gate de validação humana ao fim de cada sprint.

---

## 5. Componentes

~50 componentes em 4 camadas. Apenas os marcados 🔵 são Client Components.

- **layout (5):** `Header` 🔵, `NavDesktop`, `NavMobile` 🔵, `ScrollProgress` 🔵, `Footer`
- **sections (25):** uma por seção do doc mestre + `HowThisPageWasBuilt`
- **diagrams (7):** `ProtocolStack`, `ProblemComparison` 🔵, `EvolutionCycle` 🔵,
  `AuthoritySeparation`, `HumanActionFlow`, `BootstrapTimeline`, `RoadmapTimeline`
- **interactive (6):** `PipelineExplorer` 🔵, `SkillExplorer` 🔵, `WorkflowTabs` 🔵,
  `StateMachine` 🔵, `HumanActionDashboard` 🔵, `RepositoryExplorer` 🔵
- **ui (12):** `SectionHeading`, `Card`, `Badge`, `Panel`, `CodeBlock`, `Terminal` 🔵,
  `TreeView` 🔵, `Tabs` 🔵, `StatTile`, `AnimatedCounter` 🔵, `Reveal` 🔵, `ComparisonTable`

**data (16 módulos):** `navigation`, `pillars`, `roles`, `skills`, `workflows`, `states`,
`human-actions`, `gates`, `bootstrap-steps`, `architecture-gap`, `evidence-samples`, `use-cases`,
`compatibility`, `differentiators`, `roadmap`, `repository-tree`.

---

## 6. Arquitetura

App Next 16 **standalone**, espelhando `labs/digital-bank`:

```text
labs/ag47-evolution-protocol/
├── README.md · AGENTS.md · .gitignore · LICENSE
├── package.json · tsconfig.json · next.config.ts
├── postcss.config.mjs · eslint.config.mjs
├── docs/sprints/                    ← relatórios (sprint-0 … sprint-final)
├── scripts/collect-evidence.mjs     ← evidências reais de build/lint/typecheck
├── public/brand/
└── src/
    ├── app/      layout.tsx · page.tsx · globals.css
    │             sitemap.ts · robots.ts · opengraph-image.tsx
    ├── components/  layout/ · sections/ · diagrams/ · interactive/ · ui/
    ├── data/     (16 módulos .ts tipados)
    ├── lib/      motion.ts · utils.ts
    └── types/
```

### Decisões arquiteturais

**A1 — Servidor por padrão, ilhas na folha.**
`page.tsx` é Server Component e compõe as 25 seções. Cada seção é servidor; apenas o widget
interativo interno é `"use client"`. Ex.: `StateMachineSection` (servidor, com todo o texto e o
`<h2>`) renderiza `<StateMachine states={states} />` (cliente). Mantém o HTML prerenderizado e
restringe o JS ao que de fato interage.

**A2 — Ícones por chave, não por referência.**
Os módulos de `data/` são importados por Server Components e passados como props para ilhas cliente,
logo precisam ser serializáveis. Os dados carregam `icon: "shield" | "git-branch" | …` e um mapa no
lado cliente resolve para o componente Lucide. Evita passar componente pela fronteira
servidor→cliente.

**A3 — Motion centralizado.**
`lib/motion.ts` exporta as variantes compartilhadas e um `<Reveal>` que já respeita
`prefers-reduced-motion` globalmente. `LazyMotion` + `domAnimation` com `m.*` para cortar o bundle do
framer-motion. Nenhum componente define animação ad-hoc.

**A4 — Design tokens CSS-first (Tailwind v4).**
Sem `tailwind.config.js`: paleta, tipografia e hairlines declarados em `@theme` dentro de
`globals.css`. Base grafite + superfícies, bordas de 1px em `rgba(255,255,255,.08)`, glow radial
sutil, mono (Geist Mono) para rótulos técnicos e numerais tabulares.

**A5 — Evidências reais no painel de dogfooding.**
`scripts/collect-evidence.mjs` executa lint, typecheck e build de verdade e grava
`src/data/build-evidence.json` com código de saída e timestamp. O painel "Como esta página foi
construída" lê esse arquivo. Aplica à própria página o princípio da §16 do doc mestre: nada é dado
como concluído porque um relatório afirma que está. O painel de Human Actions permanece ilustrativo,
como o adendo autoriza.

---

## 7. Plano de implementação

Mapeamento dos 6 sprints do adendo sobre as 24 seções do doc mestre:

| Sprint | Seções | Entregas | Gate de saída |
|---|---|---|---|
| **1 — Fundação** | §1, §2 | Scaffold, tokens, `lib/`, `ui/` base, Header + nav âncora + scroll progress, Hero + `ProtocolStack`, Footer | build·lint·typecheck ✓ |
| **2 — Tese** | §3, §4, §5, §6, §7 | Problema (comparação animada), Hipótese, O que é, 8 Pilares, `PipelineExplorer` | idem + 1ª checagem de teclado |
| **3 — Sistema** | §8, §9, §10, §11 | 6 Papéis + separação de autoridade, `SkillExplorer`, `WorkflowTabs`, `StateMachine` | idem + a11y dos 4 widgets |
| **4 — Governança** | §12, §13, §14, §15, §16, §17, §18 | Colaboração humano-IA, Human Action Registry + painel, Bootstrap, Arquitetura atual/alvo/gap, Evidência, Gates, `RepositoryExplorer` | idem |
| **5 — Visão** | §19, §20, §21, §22, §23, §24 | Casos de uso, Compatibilidade, Diferenciais, Roadmap, Open source/AG47, Manifesto | idem |
| **Final** | seção do adendo | "Como esta página foi construída", SEO completo, performance, responsividade, a11y, polimento, relatório final | O1–O10 verificados |

**Desvios de mapeamento assumidos:**

- **§15** (arquitetura atual/alvo/gap) foi para o Sprint 4 em vez do 2, por ser produto do Bootstrap
  e não da tese.
- **§18** (estrutura do repositório) foi para o Sprint 4 junto do `TreeView` do `SkillExplorer`,
  reaproveitando o mesmo primitivo.

Cada sprint gera `docs/sprints/sprint-N.md` com objetivos concluídos, arquivos alterados, decisões
arquiteturais, riscos encontrados e pendências — e para no gate de validação.

---

## 8. Decisões travadas

| Decisão | Escolha | Origem |
|---|---|---|
| Cor de destaque | **Verde esmeralda** sobre base grafite. Âmbar e vermelho reservados apenas para semântica de estado (BLOCKED, REGRESSION) | validação humana |
| Repositório | `github.com/ag47-pt/ag47-evolution-protocol` (inferido do git user `ag47-pt`) | validação humana |
| Domínio canônico | `ag47.pt` — base para `metadataBase`, OG e sitemap | validação humana |
| Painel de evidências | **Reais**, geradas por `scripts/collect-evidence.mjs` | validação humana |
| Idioma | **pt-BR** — os documentos-fonte usam "arquivos" e "equipe distribuída", não "ficheiros"/"equipa" | evidência documental |
| Gerenciador de pacotes | **npm**, para casar com o `package-lock.json` dos labs irmãos | convenção do monorepo |

---

## 9. Pendências

- **P1** — As URLs de repositório e domínio foram **inferidas**, não confirmadas contra os serviços.
  Se qualquer uma estiver errada, a correção é pontual: `metadataBase` em `src/app/layout.tsx` e
  `src/data/navigation.ts`.
- **P2** — R6 permanece aberto como diretriz de redação: as seções 18 e 20 precisam ser rotuladas
  como especificação/visão em toda a copy, e isso só se verifica na revisão dos Sprints 4 e 5.
- **P3** — `npm install` ainda não foi executado; a disponibilidade de rede será confirmada no
  início do Sprint 1.
