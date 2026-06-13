# 🚀 GUIA DE SKILLS E PLUGINS DO CANTIGRAPVITY

Este guia contém todas as skills atualmente instaladas e ativas globalmente no ecossistema de desenvolvimento. Cada skill funciona como um módulo de instrução avançado que ensina à inteligência artificial a como realizar tarefas especializadas com perfeição técnica e fidelidade máxima.

## 📌 Tabela de Consulta Rápida

| Pasta da Skill | Nome em Português | Utilidade Principal |
| :--- | :--- | :--- |
| [`ag47-designer-labs-landing-pages`](#ag47-designer-labs-landing-pages) | Labs Landing Pages (Agência 47) | Criação de Landing Pages imersivas e de altíssima conversão seguindo o visual de marca da Agência 47 (Labs Blueprint). |
| [`ag47-designer-labs-miniapps-frontpages`](#ag47-designer-labs-miniapps-frontpages) | Labs Mini-apps Frontpages (Agência 47) | Desenvolvimento de interfaces front-end ricas, dashboards técnicos e frontpages para mini-aplicativos experimentais. |
| [`ag47-designs-Reformador-de-skills`](#ag47-designs-reformador-de-skills) | Reformador de Skills (Agência 47) | Análise contínua de logs e histórico do chat para extrair novos padrões de desenvolvimento e atualizar automaticamente outras skills. |
| [`ag47-hyper-prototyping`](#ag47-hyper-prototyping) | Prototipagem Hiper-rápida Next.js + Firebase | Desenvolvimento em tempo recorde de aplicações web robustas integrando Next.js, shadcn/ui e Google Firebase para autenticação/banco. |
| [`algorithmic-art`](#algorithmic-art) | Arte Algorítmica (p5.js) | Geração de arte matemática e interativa utilizando o framework p5.js com seeds aleatórias e exploração de parâmetros. |
| [`api-patterns`](#api-patterns) | Padrões de Design de APIs | Modelagem arquitetural de APIs, definindo as melhores escolhas entre REST, GraphQL, gRPC e tRPC, além de paginação e versionamento. |
| [`app-builder`](#app-builder) | Construtor de Aplicações Full-stack | Orquestrador principal para estruturar e criar aplicações do zero, detectando automaticamente a melhor stack (Web, Desktop ou Mobile). |
| [`appinsights-instrumentation`](#appinsights-instrumentation) | Appinsights Instrumentation | Instruções especializadas para o módulo técnico correspondente. |
| [`architecture`](#architecture) | Decisão Arquitetural & ADRs | Análise técnica avançada de trade-offs arquiteturais e geração estruturada de ADRs (Architecture Decision Records). |
| [`azure-ai`](#azure-ai) | Azure Ai | Instruções especializadas para o módulo técnico correspondente. |
| [`azure-aigateway`](#azure-aigateway) | Azure Aigateway | Instruções especializadas para o módulo técnico correspondente. |
| [`azure-compliance`](#azure-compliance) | Azure Compliance | Instruções especializadas para o módulo técnico correspondente. |
| [`azure-cost-optimization`](#azure-cost-optimization) | Azure Cost Optimization | Instruções especializadas para o módulo técnico correspondente. |
| [`azure-deploy`](#azure-deploy) | Azure Deploy | Instruções especializadas para o módulo técnico correspondente. |
| [`azure-diagnostics`](#azure-diagnostics) | Azure Diagnostics | Instruções especializadas para o módulo técnico correspondente. |
| [`azure-kusto`](#azure-kusto) | Azure Kusto | Instruções especializadas para o módulo técnico correspondente. |
| [`azure-observability`](#azure-observability) | Azure Observability | Instruções especializadas para o módulo técnico correspondente. |
| [`azure-postgres`](#azure-postgres) | Azure Postgres | Instruções especializadas para o módulo técnico correspondente. |
| [`azure-prepare`](#azure-prepare) | Azure Prepare | Instruções especializadas para o módulo técnico correspondente. |
| [`azure-rbac`](#azure-rbac) | Azure Rbac | Instruções especializadas para o módulo técnico correspondente. |
| [`azure-resource-lookup`](#azure-resource-lookup) | Azure Resource Lookup | Instruções especializadas para o módulo técnico correspondente. |
| [`azure-resource-visualizer`](#azure-resource-visualizer) | Azure Resource Visualizer | Instruções especializadas para o módulo técnico correspondente. |
| [`azure-storage`](#azure-storage) | Azure Storage | Instruções especializadas para o módulo técnico correspondente. |
| [`azure-validate`](#azure-validate) | Azure Validate | Instruções especializadas para o módulo técnico correspondente. |
| [`bash-linux`](#bash-linux) | Comandos e Scripts Bash/Linux | Automação de tarefas de terminal, comandos avançados de Linux, encadeamentos (piping) e scripts para servidores. |
| [`behavioral-modes`](#behavioral-modes) | Modos de Operação do Agente | Define os modos de foco do agente (brainstorm, implement, debug, ship, teach) para alinhar a comunicação e a ação à sua necessidade. |
| [`brainstorming`](#brainstorming) | Brainstorming Socrático & Alinhamento | Protocolo de perguntas estratégicas para definir escopos ambíguos antes de começar a codificar, evitando retrabalho. |
| [`brand-guidelines`](#brand-guidelines) | Diretrizes de Marca da Anthropic | Aplicação de paleta de cores, tipografia e tom de voz oficial da Anthropic em relatórios, apresentações e artefatos. |
| [`canvas-design`](#canvas-design) | Design Gráfico & Arte Estática (PNG/PDF) | Criação de layouts gráficos profissionais, pôsteres e designs estáticos sofisticados salvos como imagens de alta qualidade. |
| [`claude-api`](#claude-api) | Integração & SDK da API do Claude | Desenvolvimento e otimização de integrações com a API do Claude, com suporte a Prompt Caching, Tool Use e streaming eficiente. |
| [`clean-code`](#clean-code) | Código Limpo & Pragmatismo | Princípios rigorosos de código autoexplicativo, conciso, legível, sem over-engineering e sem comentários redundantes. |
| [`code-review-checklist`](#code-review-checklist) | Revisão e Auditoria de Código | Inspeção estática minuciosa de código-fonte focando em segurança (OWASP), manutenibilidade e conformidade com padrões de mercado. |
| [`create-premium-3d-scroll-page`](#create-premium-3d-scroll-page) | Create Premium 3D Scroll Page | Instruções especializadas para o módulo técnico correspondente. |
| [`database-design`](#database-design) | Modelagem de Bancos de Dados | Estruturação de esquemas relacionais e não-relacionais, definição de índices, chaves, estratégias de cache e ORMs altamente otimizados. |
| [`deployment-procedures`](#deployment-procedures) | Procedimentos e Estratégias de Deploy | Planejamento e execução de deploys seguros em produção com estratégias de rollback (retorno) rápido e verificações pós-lançamento. |
| [`doc-coauthoring`](#doc-coauthoring) | Co-autoria e Escrita Estruturada | Processo interativo para criação de especificações técnicas, propostas comerciais ou documentações de produto com o usuário. |
| [`documentation-templates`](#documentation-templates) | Templates de Documentação Profissional | Geração rápida de documentações impecáveis de API, READMEs altamente informativos e diretrizes para colaboradores. |
| [`docx`](#docx) | Manipulação de Arquivos Word (.docx) | Criação, leitura, edição e formatação profissional de documentos do Microsoft Word (`.docx`), incluindo tabelas e estilos. |
| [`entra-app-registration`](#entra-app-registration) | Entra App Registration | Instruções especializadas para o módulo técnico correspondente. |
| [`find-skills`](#find-skills) | Find Skills | Instruções especializadas para o módulo técnico correspondente. |
| [`frontend-design`](#frontend-design) | Design UI/UX Front-end Premium | Princípios modernos de design de interfaces (harmonia de cores, tipografia elegante, gradients cinemáticos e micro-animações). |
| [`game-development`](#game-development) | Desenvolvimento de Jogos | Orquestrador completo para projetar e codificar jogos interativos na web usando tecnologias como HTML5 Canvas, p5.js ou Three.js. |
| [`gemini-enterprise-agent`](#gemini-enterprise-agent) | Gemini Enterprise Agent | Instruções especializadas para o módulo técnico correspondente. |
| [`geo-fundamentals`](#geo-fundamentals) | Otimização para Mecanismos de IA (GEO) | Estratégias de formatação de conteúdo para torná-lo altamente legível e citável por mecanismos de busca baseados em IA (ChatGPT, Claude, Perplexity). |
| [`helper-pro-gemini-cli`](#helper-pro-gemini-cli) | Utilitários CLI Gemini | Scripts internos de automação e integração de terminal otimizados para o ambiente do Antigravity Kit. |
| [`i18n-localization`](#i18n-localization) | Internacionalização & Tradução (i18n) | Tradução de aplicações inteiras, gerenciamento de arquivos de dicionário JSON, suporte a múltiplos idiomas e formatação regional. |
| [`intelligent-routing`](#intelligent-routing) | Roteamento Inteligente de Agentes | Analisa o seu prompt e delega tarefas complexas silenciosamente para o agente especialista ideal (Frontend, API, Segurança, etc.). |
| [`internal-comms`](#internal-comms) | Comunicação Interna Profissional | Geração impecável de e-mails corporativos, atualizações de liderança, relatórios de progresso técnicos e informativos gerais. |
| [`karpathy-guidelines`](#karpathy-guidelines) | Diretrizes e Boas Práticas de Karpathy | Diretrizes comportamentais para reduzir erros comuns de codificação em IAs, baseadas nas observações de Andrej Karpathy. |
| [`lint-and-validate`](#lint-and-validate) | Controle de Qualidade & Linter | Execução de linters, testes de tipagem TypeScript e validação sintática rigorosa de arquivos modificados para evitar erros em build. |
| [`mcp-builder`](#mcp-builder) | Construção de Servidores MCP | Design e implementação de servidores Model Context Protocol (MCP) para conectar o Claude a novas ferramentas e fontes de dados. |
| [`microsoft-foundry`](#microsoft-foundry) | Microsoft Foundry | Instruções especializadas para o módulo técnico correspondente. |
| [`mobile-design`](#mobile-design) | Design UI/UX Mobile de Alta Performance | Princípios de design voltados a dispositivos móveis (foco em toque, economia de tela, performance de renderização e animações móveis). |
| [`nextjs-react-expert`](#nextjs-react-expert) | Performance React & Next.js (Vercel Core) | Otimizações severas de performance baseadas em diretrizes da engenharia da Vercel (evitar waterfalls de dados, reduzir bundle size, Server/Client components). |
| [`nodejs-best-practices`](#nodejs-best-practices) | Boas Práticas e Segurança em Node.js | Arquiteturas robustas de back-end com Node.js, controle de processos assíncronos, proteção contra injeções e vazamentos de memória. |
| [`parallel-agents`](#parallel-agents) | Orquestração de Agentes Paralelos | Execução coordenada de múltiplos subagentes para resolver subproblemas paralelos em tempo recorde. |
| [`pdf`](#pdf) | Manipulação Completa de PDFs | Leitura e extração de textos/tabelas de PDFs, união (merge), divisão (split), criptografia e OCR em documentos escaneados. |
| [`performance-profiling`](#performance-profiling) | Perfilamento e Otimização de Performance | Medição empírica de performance de sistemas, identificação de gargalos de processamento, vazamentos de memória e otimização de renderização. |
| [`plan-writing`](#plan-writing) | Escrita de Planos Técnicos de Ação | Elaboração impecável de planos de implementação (`implementation_plan.md`) claros, focados em dependências e verificações seguras. |
| [`powershell-windows`](#powershell-windows) | Automação e Scripts PowerShell (Windows) | Scripts robustos de automação para Windows PowerShell, tratamento avançado de strings e manipulação segura de caminhos de arquivos. |
| [`pptx`](#pptx) | Geração e Edição de PowerPoint (.pptx) | Criação programática e estilização automatizada de apresentações de slides sofisticadas (`.pptx`) com gráficos e tabelas. |
| [`premium-3d-scroll-page`](#premium-3d-scroll-page) | Landing Pages 3D com Next.js + R3F | Construção de páginas cinematográficas em 3D usando React Three Fiber, controle físico de scroll suave (Lerp) e UI em vidro fosco. |
| [`python-patterns`](#python-patterns) | Boas Práticas e Padrões de Código Python | Organização ideal de projetos Python, type hinting estrito, programação assíncrona robusta (asyncio) e APIs corporativas. |
| [`red-team-tactics`](#red-team-tactics) | Táticas Ofensivas de Red Teaming | Simulações controladas de vetores de ataque cibernético com base no framework MITRE ATT&CK para auditar vulnerabilidades. |
| [`rust-pro`](#rust-pro) | Arquitetura e Boas Práticas em Rust | Código altamente performático e seguro em Rust, com gerenciamento estrito de memória (ownership/borrow checker) e concorrência livre de bugs. |
| [`seo-fundamentals`](#seo-fundamentals) | Fundamentos de SEO Avançado | Estruturação de títulos, metatags, cabeçalhos, acessibilidade, sitemaps corretos e Core Web Vitals para maximizar posições no Google. |
| [`server-management`](#server-management) | Gerenciamento e Monitoramento de Servidores | Manutenção preventiva de servidores de aplicação, controle de processos de background (PM2/Docker), logs e estratégias de escalonamento. |
| [`skill-creator`](#skill-creator) | Criador de Novas Skills Automático | Geração rápida, validação e refinamento de novas especificações de skills (`SKILL.md`) com base em necessidades específicas. |
| [`slack-gif-creator`](#slack-gif-creator) | Geração de GIFs Otimizados para Slack | Criação de GIFs animados super otimizados (compressão e fps) para respeitar os limites de tamanho da plataforma de comunicação Slack. |
| [`supabase`](#supabase) | Supabase | Instruções especializadas para o módulo técnico correspondente. |
| [`supabase-postgres-best-practices`](#supabase-postgres-best-practices) | Supabase Postgres Best Practices | Instruções especializadas para o módulo técnico correspondente. |
| [`systematic-debugging`](#systematic-debugging) | Depuração Sistemática de Bugs | Metodologia científica em 4 etapas para rastrear a causa raiz de falhas complexas com testes de isolamento de hipóteses. |
| [`tailwind-patterns`](#tailwind-patterns) | Padrões CSS Tailwind v4 | Estilização de alto nível com Tailwind v4, arquitetura de design tokens pura através de arquivos CSS nativos, contêineres e grids fluidos. |
| [`tdd-workflow`](#tdd-workflow) | Fluxo de Trabalho TDD (Test-Driven) | Guia estrito para o ciclo Red-Green-Refactor (escrever testes falhos primeiro, codificar até passar no teste e depois refatorar). |
| [`testing-patterns`](#testing-patterns) | Padrões de Testes Automatizados | Planejamento e estruturação de testes unitários e de integração estáveis, isolando efeitos colaterais com mocks de alta fidelidade. |
| [`theme-factory`](#theme-factory) | Fábrica de Temas Visuais | Aplicação instantânea de paletas de cores refinadas e famílias tipográficas harmoniosas em qualquer documento HTML ou relatório gerado. |
| [`vulnerability-scanner`](#vulnerability-scanner) | Varredura e Análise de Vulnerabilidades | Análise estática e dinâmica em busca de vulnerabilidades de segurança (OWASP), injeção de dependências inseguras ou segredos expostos. |
| [`web-artifacts-builder`](#web-artifacts-builder) | Criação de Artefatos Web Interativos | Criação de mini-aplicativos ricos em HTML/React/Tailwind que rodam de forma autônoma e interativa para demonstrações. |
| [`web-design-guidelines`](#web-design-guidelines) | Diretrizes e Acessibilidade Web (WCAG) | Auditoria de interfaces web em relação a boas práticas de usabilidade, contraste de cores e conformidade total com acessibilidade (WCAG). |
| [`webapp-testing`](#webapp-testing) | Testes E2E com Playwright | Escrita e execução de roteiros automatizados de testes ponta a ponta que emulam perfeitamente o comportamento do usuário no navegador. |
| [`xlsx`](#xlsx) | Geração e Processamento de Excel (.xlsx) | Criação programática e edição avançada de planilhas complexas do Excel (`.xlsx`), com estilização de células, fórmulas e gráficos. |

---

## 🔍 Detalhamento das Skills

### <a id="ag47-designer-labs-landing-pages"></a>🎯 `ag47-designer-labs-landing-pages` - Labs Landing Pages (Agência 47)

*   **O que ela faz (Utilidade)**: Criação de Landing Pages imersivas e de altíssima conversão seguindo o visual de marca da Agência 47 (Labs Blueprint).

*   **Quando usar**: Quando precisar construir ou reconstruir páginas de captura, landing pages institucionais ou campanhas experimentais.

*   **Como usar**: Mencione a skill no prompt: `use a skill ag47-designer-labs-landing-pages para criar uma nova landing page`.

---

### <a id="ag47-designer-labs-miniapps-frontpages"></a>🎯 `ag47-designer-labs-miniapps-frontpages` - Labs Mini-apps Frontpages (Agência 47)

*   **O que ela faz (Utilidade)**: Desenvolvimento de interfaces front-end ricas, dashboards técnicos e frontpages para mini-aplicativos experimentais.

*   **Quando usar**: Ao criar painéis administrativos, HUDs de navegação, dashboards de controle ou a cara de um mini-app.

*   **Como usar**: Ative solicitando um layout denso de dados e design futurista no ecossistema Labs.

---

### <a id="ag47-designs-reformador-de-skills"></a>🎯 `ag47-designs-Reformador-de-skills` - Reformador de Skills (Agência 47)

*   **O que ela faz (Utilidade)**: Análise contínua de logs e histórico do chat para extrair novos padrões de desenvolvimento e atualizar automaticamente outras skills.

*   **Quando usar**: Sempre que finalizar um bloco de trabalho complexo, novas regras precisarem ser aprendidas ou para estudar a sessão atual.

*   **Como usar**: Gatilhos: `estude a sessão`, `reforme as skills`, `aprenda novos padrões`.

---

### <a id="ag47-hyper-prototyping"></a>🎯 `ag47-hyper-prototyping` - Prototipagem Hiper-rápida Next.js + Firebase

*   **O que ela faz (Utilidade)**: Desenvolvimento em tempo recorde de aplicações web robustas integrando Next.js, shadcn/ui e Google Firebase para autenticação/banco.

*   **Quando usar**: Para criar sistemas completos do zero com altíssima velocidade (LP, área de admin, banco ativo, fluxos complexos).

*   **Como usar**: Use palavras como: `criar rápido`, `prototipar em Next.js com Firebase`, `criar app para restaurante com painel`.

---

### <a id="algorithmic-art"></a>🎯 `algorithmic-art` - Arte Algorítmica (p5.js)

*   **O que ela faz (Utilidade)**: Geração de arte matemática e interativa utilizando o framework p5.js com seeds aleatórias e exploração de parâmetros.

*   **Quando usar**: Quando quiser gerar planos de fundo dinâmicos, animações matemáticas, partículas ou artes algorítmicas originais.

*   **Como usar**: Solicite: `crie uma arte generativa com p5.js` ou `gere arte algorítmica`.

---

### <a id="api-patterns"></a>🎯 `api-patterns` - Padrões de Design de APIs

*   **O que ela faz (Utilidade)**: Modelagem arquitetural de APIs, definindo as melhores escolhas entre REST, GraphQL, gRPC e tRPC, além de paginação e versionamento.

*   **Quando usar**: Ao projetar novos endpoints, definir a estrutura de retorno de uma API ou decidir o protocolo de comunicação cliente-servidor.

*   **Como usar**: Ativado ao planejar ou implementar integrações de rotas de API robustas.

---

### <a id="app-builder"></a>🎯 `app-builder` - Construtor de Aplicações Full-stack

*   **O que ela faz (Utilidade)**: Orquestrador principal para estruturar e criar aplicações do zero, detectando automaticamente a melhor stack (Web, Desktop ou Mobile).

*   **Quando usar**: Na fase inicial de criação de qualquer novo projeto de software.

*   **Como usar**: Execute comandos como `/create` ou solicite a criação de um novo aplicativo/sistema.

---

### <a id="appinsights-instrumentation"></a>🎯 `appinsights-instrumentation` - Appinsights Instrumentation

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `appinsights-instrumentation`.

---

### <a id="architecture"></a>🎯 `architecture` - Decisão Arquitetural & ADRs

*   **O que ela faz (Utilidade)**: Análise técnica avançada de trade-offs arquiteturais e geração estruturada de ADRs (Architecture Decision Records).

*   **Quando usar**: Sempre que for necessário tomar decisões estruturais complexas no projeto (ex: mudar de banco de dados, alterar estado global).

*   **Como usar**: Pergunte ou solicite: `escreva uma decisão de arquitetura sobre X` ou `quais os trade-offs de usar Y`.

---

### <a id="azure-ai"></a>🎯 `azure-ai` - Azure Ai

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `azure-ai`.

---

### <a id="azure-aigateway"></a>🎯 `azure-aigateway` - Azure Aigateway

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `azure-aigateway`.

---

### <a id="azure-compliance"></a>🎯 `azure-compliance` - Azure Compliance

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `azure-compliance`.

---

### <a id="azure-cost-optimization"></a>🎯 `azure-cost-optimization` - Azure Cost Optimization

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `azure-cost-optimization`.

---

### <a id="azure-deploy"></a>🎯 `azure-deploy` - Azure Deploy

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `azure-deploy`.

---

### <a id="azure-diagnostics"></a>🎯 `azure-diagnostics` - Azure Diagnostics

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `azure-diagnostics`.

---

### <a id="azure-kusto"></a>🎯 `azure-kusto` - Azure Kusto

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `azure-kusto`.

---

### <a id="azure-observability"></a>🎯 `azure-observability` - Azure Observability

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `azure-observability`.

---

### <a id="azure-postgres"></a>🎯 `azure-postgres` - Azure Postgres

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `azure-postgres`.

---

### <a id="azure-prepare"></a>🎯 `azure-prepare` - Azure Prepare

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `azure-prepare`.

---

### <a id="azure-rbac"></a>🎯 `azure-rbac` - Azure Rbac

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `azure-rbac`.

---

### <a id="azure-resource-lookup"></a>🎯 `azure-resource-lookup` - Azure Resource Lookup

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `azure-resource-lookup`.

---

### <a id="azure-resource-visualizer"></a>🎯 `azure-resource-visualizer` - Azure Resource Visualizer

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `azure-resource-visualizer`.

---

### <a id="azure-storage"></a>🎯 `azure-storage` - Azure Storage

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `azure-storage`.

---

### <a id="azure-validate"></a>🎯 `azure-validate` - Azure Validate

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `azure-validate`.

---

### <a id="bash-linux"></a>🎯 `bash-linux` - Comandos e Scripts Bash/Linux

*   **O que ela faz (Utilidade)**: Automação de tarefas de terminal, comandos avançados de Linux, encadeamentos (piping) e scripts para servidores.

*   **Quando usar**: Ao rodar comandos em sistemas operacionais baseados em Unix, configurar servidores Linux ou criar scripts automatizados.

*   **Como usar**: Invocado ao lidar com tarefas de terminal, deploys em ambiente Linux ou automações de infra.

---

### <a id="behavioral-modes"></a>🎯 `behavioral-modes` - Modos de Operação do Agente

*   **O que ela faz (Utilidade)**: Define os modos de foco do agente (brainstorm, implement, debug, ship, teach) para alinhar a comunicação e a ação à sua necessidade.

*   **Quando usar**: Para alternar a atitude do assistente entre planejar, programar agressivamente ou depurar erros sistematicamente.

*   **Como usar**: O agente adapta-se automaticamente ou quando você digita `/debug`, `/plan`, `/orchestrate`.

---

### <a id="brainstorming"></a>🎯 `brainstorming` - Brainstorming Socrático & Alinhamento

*   **O que ela faz (Utilidade)**: Protocolo de perguntas estratégicas para definir escopos ambíguos antes de começar a codificar, evitando retrabalho.

*   **Quando usar**: Para novos recursos, ideias de produtos ou escopos indefinidos apresentados pelo usuário.

*   **Como usar**: Ativado via comando `/brainstorm` ou quando o escopo inicial está muito abstrato.

---

### <a id="brand-guidelines"></a>🎯 `brand-guidelines` - Diretrizes de Marca da Anthropic

*   **O que ela faz (Utilidade)**: Aplicação de paleta de cores, tipografia e tom de voz oficial da Anthropic em relatórios, apresentações e artefatos.

*   **Quando usar**: Ao gerar documentações ou apresentações que necessitem de uma estética oficial e padronizada da marca Anthropic.

*   **Como usar**: Ativa automaticamente ao criar relatórios, slides ou guias de marca.

---

### <a id="canvas-design"></a>🎯 `canvas-design` - Design Gráfico & Arte Estática (PNG/PDF)

*   **O que ela faz (Utilidade)**: Criação de layouts gráficos profissionais, pôsteres e designs estáticos sofisticados salvos como imagens de alta qualidade.

*   **Quando usar**: Para desenhar cartazes, identidades visuais básicas, banners de redes sociais ou designs gráficos estáticos.

*   **Como usar**: Solicite: `desenhe um pôster conceitual` ou `crie um design estático para X`.

---

### <a id="claude-api"></a>🎯 `claude-api` - Integração & SDK da API do Claude

*   **O que ela faz (Utilidade)**: Desenvolvimento e otimização de integrações com a API do Claude, com suporte a Prompt Caching, Tool Use e streaming eficiente.

*   **Quando usar**: Quando estiver codificando um backend que se conecta ao Claude, atualizando modelos da Anthropic ou configurando agentes gerenciados.

*   **Como usar**: Gatilhos: importar `anthropic` no código, configurar Prompt Caching ou atualizar SDKs de IA.

---

### <a id="clean-code"></a>🎯 `clean-code` - Código Limpo & Pragmatismo

*   **O que ela faz (Utilidade)**: Princípios rigorosos de código autoexplicativo, conciso, legível, sem over-engineering e sem comentários redundantes.

*   **Quando usar**: Sempre que estiver escrevendo qualquer linha de código (regrinha de ouro padrão).

*   **Como usar**: Ativa de forma automática e silenciosa em todas as edições de arquivos de código.

---

### <a id="code-review-checklist"></a>🎯 `code-review-checklist` - Revisão e Auditoria de Código

*   **O que ela faz (Utilidade)**: Inspeção estática minuciosa de código-fonte focando em segurança (OWASP), manutenibilidade e conformidade com padrões de mercado.

*   **Quando usar**: Antes de aprovar Pull Requests, consolidar ramificações de código ou fazer auditorias de segurança de novos módulos.

*   **Como usar**: Ativado ao solicitar uma análise ou revisão detalhada de código recém-escrito.

---

### <a id="create-premium-3d-scroll-page"></a>🎯 `create-premium-3d-scroll-page` - Create Premium 3D Scroll Page

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `create-premium-3d-scroll-page`.

---

### <a id="database-design"></a>🎯 `database-design` - Modelagem de Bancos de Dados

*   **O que ela faz (Utilidade)**: Estruturação de esquemas relacionais e não-relacionais, definição de índices, chaves, estratégias de cache e ORMs altamente otimizados.

*   **Quando usar**: Ao criar ou refatorar tabelas no banco de dados (ex: Postgres, Supabase, Firebase) e otimizar queries lentas.

*   **Como usar**: Ativa automaticamente ao alterar esquemas de banco SQL/NoSQL ou configurar ORMs.

---

### <a id="deployment-procedures"></a>🎯 `deployment-procedures` - Procedimentos e Estratégias de Deploy

*   **O que ela faz (Utilidade)**: Planejamento e execução de deploys seguros em produção com estratégias de rollback (retorno) rápido e verificações pós-lançamento.

*   **Quando usar**: Ao preparar o lançamento de uma nova versão estável em ambientes de produção como Vercel, Netlify ou VPS.

*   **Como usar**: Invocado via comando `/deploy` ou ao estruturar o plano de entrega final.

---

### <a id="doc-coauthoring"></a>🎯 `doc-coauthoring` - Co-autoria e Escrita Estruturada

*   **O que ela faz (Utilidade)**: Processo interativo para criação de especificações técnicas, propostas comerciais ou documentações de produto com o usuário.

*   **Quando usar**: Para escrever relatórios detalhados, especificações técnicas longas ou propostas de negócio complexas.

*   **Como usar**: Solicite: `vamos redigir um documento técnico sobre X` ou `escreva uma proposta detalhada`.

---

### <a id="documentation-templates"></a>🎯 `documentation-templates` - Templates de Documentação Profissional

*   **O que ela faz (Utilidade)**: Geração rápida de documentações impecáveis de API, READMEs altamente informativos e diretrizes para colaboradores.

*   **Quando usar**: Ao finalizar uma funcionalidade relevante ou para dar as boas-vindas a novos desenvolvedores no repositório.

*   **Como usar**: Use palavras-chave: `escreva o README do projeto`, `documente a API`.

---

### <a id="docx"></a>🎯 `docx` - Manipulação de Arquivos Word (.docx)

*   **O que ela faz (Utilidade)**: Criação, leitura, edição e formatação profissional de documentos do Microsoft Word (`.docx`), incluindo tabelas e estilos.

*   **Quando usar**: Ao precisar gerar relatórios corporativos, contratos, cartas padronizadas ou extrair dados de arquivos Word.

*   **Como usar**: Triggers: mencionar `.docx`, `arquivo do Word`, `exportar contrato para Word`.

---

### <a id="entra-app-registration"></a>🎯 `entra-app-registration` - Entra App Registration

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `entra-app-registration`.

---

### <a id="find-skills"></a>🎯 `find-skills` - Find Skills

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `find-skills`.

---

### <a id="frontend-design"></a>🎯 `frontend-design` - Design UI/UX Front-end Premium

*   **O que ela faz (Utilidade)**: Princípios modernos de design de interfaces (harmonia de cores, tipografia elegante, gradients cinemáticos e micro-animações).

*   **Quando usar**: Ao criar qualquer componente ou página web, visando uma estética premium de tirar o fôlego (rejeitando layouts genéricos).

*   **Como usar**: Ativado no planejamento visual e estilização de interfaces em Next.js, React e CSS.

---

### <a id="game-development"></a>🎯 `game-development` - Desenvolvimento de Jogos

*   **O que ela faz (Utilidade)**: Orquestrador completo para projetar e codificar jogos interativos na web usando tecnologias como HTML5 Canvas, p5.js ou Three.js.

*   **Quando usar**: Quando solicitar a criação de jogos interativos, simulações em tempo real ou mecânicas de física para web.

*   **Como usar**: Gatilhos: `desenvolva o jogo da cobrinha`, `crie um jogo web interativo`.

---

### <a id="gemini-enterprise-agent"></a>🎯 `gemini-enterprise-agent` - Gemini Enterprise Agent

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `gemini-enterprise-agent`.

---

### <a id="geo-fundamentals"></a>🎯 `geo-fundamentals` - Otimização para Mecanismos de IA (GEO)

*   **O que ela faz (Utilidade)**: Estratégias de formatação de conteúdo para torná-lo altamente legível e citável por mecanismos de busca baseados em IA (ChatGPT, Claude, Perplexity).

*   **Quando usar**: Ao estruturar páginas de documentação pública, blogs ou sites institucionais visando máximo tráfego vindo de buscas de IA.

*   **Como usar**: Invocado ao planejar estruturas de SEO de próxima geração para portais.

---

### <a id="helper-pro-gemini-cli"></a>🎯 `helper-pro-gemini-cli` - Utilitários CLI Gemini

*   **O que ela faz (Utilidade)**: Scripts internos de automação e integração de terminal otimizados para o ambiente do Antigravity Kit.

*   **Quando usar**: Tarefas específicas de ambiente interno de terminal.

*   **Como usar**: Executado automaticamente pelo sistema.

---

### <a id="i18n-localization"></a>🎯 `i18n-localization` - Internacionalização & Tradução (i18n)

*   **O que ela faz (Utilidade)**: Tradução de aplicações inteiras, gerenciamento de arquivos de dicionário JSON, suporte a múltiplos idiomas e formatação regional.

*   **Quando usar**: Quando precisar adicionar suporte a novos idiomas (Português, Inglês, Espanhol) no sistema ou remover textos hardcoded.

*   **Como usar**: Gatilhos: `adicione suporte a inglês no app`, `configurar i18n`.

---

### <a id="intelligent-routing"></a>🎯 `intelligent-routing` - Roteamento Inteligente de Agentes

*   **O que ela faz (Utilidade)**: Analisa o seu prompt e delega tarefas complexas silenciosamente para o agente especialista ideal (Frontend, API, Segurança, etc.).

*   **Quando usar**: Em todas as interações do chat, garantindo que a melhor persona técnica tome a frente da resposta.

*   **Como usar**: Ativo de forma nativa e automática a cada nova mensagem.

---

### <a id="internal-comms"></a>🎯 `internal-comms` - Comunicação Interna Profissional

*   **O que ela faz (Utilidade)**: Geração impecável de e-mails corporativos, atualizações de liderança, relatórios de progresso técnicos e informativos gerais.

*   **Quando usar**: Ao precisar reportar o andamento de um projeto para clientes, parceiros ou gerência de forma clara e corporativa.

*   **Como usar**: Solicite: `escreva um relatório de progresso técnica para o cliente` ou `draft de email corporativo`.

---

### <a id="karpathy-guidelines"></a>🎯 `karpathy-guidelines` - Diretrizes e Boas Práticas de Karpathy

*   **O que ela faz (Utilidade)**: Reduz erros comuns de codificação através de 4 pilares: Pensar antes de programar (Think Before Coding), Simplicidade em primeiro lugar (Simplicity First), Modificações cirúrgicas (Surgical Changes) e Execução orientada por objetivos (Goal-Driven Execution).

*   **Quando usar**: Ao escrever, revisar ou refatorar qualquer código para evitar complexidade desnecessária e manter alterações extremamente limpas.

*   **Como usar**: Use palavras como: `aplique as diretrizes de Karpathy`, `simplifique seguindo Karpathy`, `faça modificações cirúrgicas`.

---

### <a id="lint-and-validate"></a>🎯 `lint-and-validate` - Controle de Qualidade & Linter

*   **O que ela faz (Utilidade)**: Execução de linters, testes de tipagem TypeScript e validação sintática rigorosa de arquivos modificados para evitar erros em build.

*   **Quando usar**: Sempre ao finalizar a escrita de um código, rodando automações para checar erros sintáticos.

*   **Como usar**: Ativado de forma automática ou via comandos de validação de projeto.

---

### <a id="mcp-builder"></a>🎯 `mcp-builder` - Construção de Servidores MCP

*   **O que ela faz (Utilidade)**: Design e implementação de servidores Model Context Protocol (MCP) para conectar o Claude a novas ferramentas e fontes de dados.

*   **Quando usar**: Ao criar integrações de sistema avançadas onde a IA precisa interagir com bancos de dados ou APIs proprietárias.

*   **Como usar**: Solicite: `crie um servidor MCP para conectar meu banco X`.

---

### <a id="microsoft-foundry"></a>🎯 `microsoft-foundry` - Microsoft Foundry

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `microsoft-foundry`.

---

### <a id="mobile-design"></a>🎯 `mobile-design` - Design UI/UX Mobile de Alta Performance

*   **O que ela faz (Utilidade)**: Princípios de design voltados a dispositivos móveis (foco em toque, economia de tela, performance de renderização e animações móveis).

*   **Quando usar**: No desenvolvimento ou design de interfaces de aplicativos React Native, Flutter ou Web Apps Mobile-first.

*   **Como usar**: Ativado ao projetar componentes específicos para smartphones e tablets.

---

### <a id="nextjs-react-expert"></a>🎯 `nextjs-react-expert` - Performance React & Next.js (Vercel Core)

*   **O que ela faz (Utilidade)**: Otimizações severas de performance baseadas em diretrizes da engenharia da Vercel (evitar waterfalls de dados, reduzir bundle size, Server/Client components).

*   **Quando usar**: Para auditar builds lentas de Next.js, otimizar renderizações pesadas do React ou melhorar o Core Web Vitals.

*   **Como usar**: Ativado ao resolver lentidões de carregamento e otimizar componentes dinâmicos.

---

### <a id="nodejs-best-practices"></a>🎯 `nodejs-best-practices` - Boas Práticas e Segurança em Node.js

*   **O que ela faz (Utilidade)**: Arquiteturas robustas de back-end com Node.js, controle de processos assíncronos, proteção contra injeções e vazamentos de memória.

*   **Quando usar**: Ao programar servidores, microsserviços ou rotas de API robustas rodando em Node.js.

*   **Como usar**: Invocado automaticamente durante revisões e edições de arquivos Javascript/TypeScript no back-end.

---

### <a id="parallel-agents"></a>🎯 `parallel-agents` - Orquestração de Agentes Paralelos

*   **O que ela faz (Utilidade)**: Execução coordenada de múltiplos subagentes para resolver subproblemas paralelos em tempo recorde.

*   **Quando usar**: Para tarefas extremamente massivas que podem ser divididas em frentes simultâneas.

*   **Como usar**: Ativado de forma autônoma pelo orquestrador em projetos grandes.

---

### <a id="pdf"></a>🎯 `pdf` - Manipulação Completa de PDFs

*   **O que ela faz (Utilidade)**: Leitura e extração de textos/tabelas de PDFs, união (merge), divisão (split), criptografia e OCR em documentos escaneados.

*   **Quando usar**: Sempre que precisar extrair relatórios, ler faturas, assinar ou gerar arquivos em formato PDF.

*   **Como usar**: Triggers: mencionar `.pdf`, `arquivo PDF`, `juntar estes PDFs`.

---

### <a id="performance-profiling"></a>🎯 `performance-profiling` - Perfilamento e Otimização de Performance

*   **O que ela faz (Utilidade)**: Medição empírica de performance de sistemas, identificação de gargalos de processamento, vazamentos de memória e otimização de renderização.

*   **Quando usar**: Ao enfrentar problemas de lentidão geral, alto uso de CPU ou baixa pontuação de desempenho de carregamento do app.

*   **Como usar**: Invocado ao solicitar auditorias ou otimizações de performance estruturais.

---

### <a id="plan-writing"></a>🎯 `plan-writing` - Escrita de Planos Técnicos de Ação

*   **O que ela faz (Utilidade)**: Elaboração impecável de planos de implementação (`implementation_plan.md`) claros, focados em dependências e verificações seguras.

*   **Quando usar**: Antes de iniciar qualquer modificação complexa ou grande refatoração de código no projeto.

*   **Como usar**: Invocado via comando `/plan` ou ativado automaticamente em tarefas estruturais complexas.

---

### <a id="powershell-windows"></a>🎯 `powershell-windows` - Automação e Scripts PowerShell (Windows)

*   **O que ela faz (Utilidade)**: Scripts robustos de automação para Windows PowerShell, tratamento avançado de strings e manipulação segura de caminhos de arquivos.

*   **Quando usar**: Ao rodar comandos complexos no sistema operacional Windows ou criar scripts utilitários do sistema.

*   **Como usar**: Ativado automaticamente em todas as interações que exigem execução de comandos no Windows.

---

### <a id="pptx"></a>🎯 `pptx` - Geração e Edição de PowerPoint (.pptx)

*   **O que ela faz (Utilidade)**: Criação programática e estilização automatizada de apresentações de slides sofisticadas (`.pptx`) com gráficos e tabelas.

*   **Quando usar**: Para automatizar a criação de relatórios de reuniões, slides promocionais ou apresentações institucionais.

*   **Como usar**: Triggers: mencionar `.pptx`, `apresentação de slides`, `gerar powerpoint`.

---

### <a id="premium-3d-scroll-page"></a>🎯 `premium-3d-scroll-page` - Landing Pages 3D com Next.js + R3F

*   **O que ela faz (Utilidade)**: Construção de páginas cinematográficas em 3D usando React Three Fiber, controle físico de scroll suave (Lerp) e UI em vidro fosco.

*   **Quando usar**: Ao criar landing pages ultra-premium que exigem elementos e interações em 3D de alta performance.

*   **Como usar**: Ative usando o comando `/create-3d` ou mencionando `landing page 3d`.

---

### <a id="python-patterns"></a>🎯 `python-patterns` - Boas Práticas e Padrões de Código Python

*   **O que ela faz (Utilidade)**: Organização ideal de projetos Python, type hinting estrito, programação assíncrona robusta (asyncio) e APIs corporativas.

*   **Quando usar**: Ao criar scripts de automação, pipelines de dados ou servidores web com Python.

*   **Como usar**: Ativado automaticamente ao ler, editar ou revisar arquivos `.py` no workspace.

---

### <a id="red-team-tactics"></a>🎯 `red-team-tactics` - Táticas Ofensivas de Red Teaming

*   **O que ela faz (Utilidade)**: Simulações controladas de vetores de ataque cibernético com base no framework MITRE ATT&CK para auditar vulnerabilidades.

*   **Quando usar**: Ao auditar a segurança geral contra ataques ou testar a resiliência de firewalls e APIs.

*   **Como usar**: Ativado sob demanda em análises detalhadas de segurança cibernética.

---

### <a id="rust-pro"></a>🎯 `rust-pro` - Arquitetura e Boas Práticas em Rust

*   **O que ela faz (Utilidade)**: Código altamente performático e seguro em Rust, com gerenciamento estrito de memória (ownership/borrow checker) e concorrência livre de bugs.

*   **Quando usar**: Ao programar ou depurar microsserviços de altíssima performance, drivers de sistema ou módulos WASM em Rust.

*   **Como usar**: Ativado automaticamente ao trabalhar em arquivos com a extensão `.rs`.

---

### <a id="seo-fundamentals"></a>🎯 `seo-fundamentals` - Fundamentos de SEO Avançado

*   **O que ela faz (Utilidade)**: Estruturação de títulos, metatags, cabeçalhos, acessibilidade, sitemaps corretos e Core Web Vitals para maximizar posições no Google.

*   **Quando usar**: Ao criar novas páginas de portais ou sites voltados a grande público orgânico.

*   **Como usar**: Ativado durante o desenvolvimento de páginas web ou ao rodar ferramentas de checagem de SEO.

---

### <a id="server-management"></a>🎯 `server-management` - Gerenciamento e Monitoramento de Servidores

*   **O que ela faz (Utilidade)**: Manutenção preventiva de servidores de aplicação, controle de processos de background (PM2/Docker), logs e estratégias de escalonamento.

*   **Quando usar**: Ao diagnosticar servidores lentos, gerenciar processos no ar ou planejar escalabilidade horizontal.

*   **Como usar**: Invocado ao planejar melhorias de infraestrutura ou infra-as-code.

---

### <a id="skill-creator"></a>🎯 `skill-creator` - Criador de Novas Skills Automático

*   **O que ela faz (Utilidade)**: Geração rápida, validação e refinamento de novas especificações de skills (`SKILL.md`) com base em necessidades específicas.

*   **Quando usar**: Quando quiser automatizar um novo padrão recorrente criando uma skill do zero para a IDE.

*   **Como usar**: Ativado automaticamente ao solicitar a criação de um novo padrão/skill.

---

### <a id="slack-gif-creator"></a>🎯 `slack-gif-creator` - Geração de GIFs Otimizados para Slack

*   **O que ela faz (Utilidade)**: Criação de GIFs animados super otimizados (compressão e fps) para respeitar os limites de tamanho da plataforma de comunicação Slack.

*   **Quando usar**: Quando precisar gerar uma demonstração visual leve de um novo recurso para postar no Slack de um cliente.

*   **Como usar**: Mencione: `crie um gif animado da tela X para o Slack`.

---

### <a id="supabase"></a>🎯 `supabase` - Supabase

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `supabase`.

---

### <a id="supabase-postgres-best-practices"></a>🎯 `supabase-postgres-best-practices` - Supabase Postgres Best Practices

*   **O que ela faz (Utilidade)**: Instruções especializadas para o módulo técnico correspondente.

*   **Quando usar**: Conforme demandado por tarefas específicas da stack técnica.

*   **Como usar**: Invocado ao mencionar cenários que exigem a especialidade do módulo `supabase-postgres-best-practices`.

---

### <a id="systematic-debugging"></a>🎯 `systematic-debugging` - Depuração Sistemática de Bugs

*   **O que ela faz (Utilidade)**: Metodologia científica em 4 etapas para rastrear a causa raiz de falhas complexas com testes de isolamento de hipóteses.

*   **Quando usar**: Sempre que se deparar com um bug complexo cuja causa não seja óbvia e exija testes profundos.

*   **Como usar**: Ativado ao iniciar processos de diagnóstico detalhado de bugs.

---

### <a id="tailwind-patterns"></a>🎯 `tailwind-patterns` - Padrões CSS Tailwind v4

*   **O que ela faz (Utilidade)**: Estilização de alto nível com Tailwind v4, arquitetura de design tokens pura através de arquivos CSS nativos, contêineres e grids fluidos.

*   **Quando usar**: Ao escrever estilos em componentes React, Next.js ou HTML clássico utilizando Tailwind CSS.

*   **Como usar**: Ativado em revisões e escritas de estilizações baseadas em classes utilitárias.

---

### <a id="tdd-workflow"></a>🎯 `tdd-workflow` - Fluxo de Trabalho TDD (Test-Driven)

*   **O que ela faz (Utilidade)**: Guia estrito para o ciclo Red-Green-Refactor (escrever testes falhos primeiro, codificar até passar no teste e depois refatorar).

*   **Quando usar**: Ao implementar lógicas de negócio críticas onde a estabilidade máxima é mandatória.

*   **Como usar**: Ativado ao criar suítes de testes complexos para validação de fluxos do zero.

---

### <a id="testing-patterns"></a>🎯 `testing-patterns` - Padrões de Testes Automatizados

*   **O que ela faz (Utilidade)**: Planejamento e estruturação de testes unitários e de integração estáveis, isolando efeitos colaterais com mocks de alta fidelidade.

*   **Quando usar**: Ao criar ou expandir testes automatizados de backend ou frontend para evitar regressões de código.

*   **Como usar**: Invocado via comando `/test` ou na escrita de arquivos de teste (`.test.ts` / `.spec.py`).

---

### <a id="theme-factory"></a>🎯 `theme-factory` - Fábrica de Temas Visuais

*   **O que ela faz (Utilidade)**: Aplicação instantânea de paletas de cores refinadas e famílias tipográficas harmoniosas em qualquer documento HTML ou relatório gerado.

*   **Quando usar**: Sempre que for criar um novo artefato ou página HTML e quiser deixá-lo instantaneamente lindo com temas pré-configurados.

*   **Como usar**: Solicite: `aplique o tema Cyberpunk / Minimalist / Midnight na página`.

---

### <a id="vulnerability-scanner"></a>🎯 `vulnerability-scanner` - Varredura e Análise de Vulnerabilidades

*   **O que ela faz (Utilidade)**: Análise estática e dinâmica em busca de vulnerabilidades de segurança (OWASP), injeção de dependências inseguras ou segredos expostos.

*   **Quando usar**: Em deploys de produção, auditorias semestrais ou checagem de bibliotecas terceiras desatualizadas.

*   **Como usar**: Ativado automaticamente em análises pré-deploys ou auditorias de segurança.

---

### <a id="web-artifacts-builder"></a>🎯 `web-artifacts-builder` - Criação de Artefatos Web Interativos

*   **O que ela faz (Utilidade)**: Criação de mini-aplicativos ricos em HTML/React/Tailwind que rodam de forma autônoma e interativa para demonstrações.

*   **Quando usar**: Para construir protótipos de dashboards, calculadoras ou ferramentas interativas diretamente no chat do usuário.

*   **Como usar**: Solicite a criação de um mini-app interativo na web.

---

### <a id="web-design-guidelines"></a>🎯 `web-design-guidelines` - Diretrizes e Acessibilidade Web (WCAG)

*   **O que ela faz (Utilidade)**: Auditoria de interfaces web em relação a boas práticas de usabilidade, contraste de cores e conformidade total com acessibilidade (WCAG).

*   **Quando usar**: Após concluir telas de interface para garantir que qualquer usuário possa navegar perfeitamente.

*   **Como usar**: Solicite: `faça uma auditoria de acessibilidade/design na página`.

---

### <a id="webapp-testing"></a>🎯 `webapp-testing` - Testes E2E com Playwright

*   **O que ela faz (Utilidade)**: Escrita e execução de roteiros automatizados de testes ponta a ponta que emulam perfeitamente o comportamento do usuário no navegador.

*   **Quando usar**: Para testar fluxos completos de login, checkout e cadastro em navegadores reais de forma simulada.

*   **Como usar**: Invocado ao rodar Playwright em pipelines de integração contínua.

---

### <a id="xlsx"></a>🎯 `xlsx` - Geração e Processamento de Excel (.xlsx)

*   **O que ela faz (Utilidade)**: Criação programática e edição avançada de planilhas complexas do Excel (`.xlsx`), com estilização de células, fórmulas e gráficos.

*   **Quando usar**: Ao automatizar relatórios financeiros, formatar listas de clientes ou gerar planilhas para exportação.

*   **Como usar**: Triggers: mencionar `.xlsx`, `planilha do Excel`, `exportar para Excel`.

---
