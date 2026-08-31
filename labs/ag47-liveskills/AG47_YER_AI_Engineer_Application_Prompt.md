# PROMPT OPERACIONAL — AG47 Career Landing Engine / YER Application

## MISSÃO

Trabalhar dentro do repositório real da Agência 47 e implementar uma landing page de candidatura profissional personalizada para a vaga de **AI Engineer / LLM-Driven Development da YER**, em Lisboa.

A página deve funcionar como uma **prova prática de capacidade técnica**, e não como um currículo tradicional convertido em website.

A proposta é demonstrar, através da própria página e dos projetos reais existentes no ecossistema AG47, que o candidato possui capacidade de:

- desenvolvimento full-stack;
- leitura, compreensão e organização de código;
- arquitetura de projetos e estrutura de ficheiros;
- desenvolvimento em VS Code;
- integração frontend/backend;
- APIs;
- bancos de dados;
- Git/GitHub;
- deploy e manutenção de aplicações;
- desenvolvimento assistido por IA;
- uso de LLMs no ciclo de engenharia;
- agentic development;
- automações;
- rapid prototyping;
- construção de produtos digitais end-to-end.

A landing page deverá ser publicada dentro do ecossistema AG47, preferencialmente em:

`/yer`

Exemplo final esperado:

`https://ag47.pt/yer`

---

# 1. PRINCÍPIO CENTRAL

Não criar um "site de currículo".

Criar uma **application landing page altamente direcionada à YER**, concebida especificamente para responder à vaga.

A página precisa transmitir em poucos segundos:

> "Eu vi o que vocês estão procurando. Eu entendi o problema. Eu trabalho dessa forma. E construí esta página especificamente para demonstrar isso."

A candidatura deve ser percebida como um pequeno produto digital.

---

# 2. REGRA DE ARQUITETURA

Antes de alterar qualquer código:

1. Fazer uma varredura no repositório.
2. Identificar:
   - framework atual;
   - App Router / Pages Router, se aplicável;
   - design system existente;
   - componentes reutilizáveis;
   - layouts;
   - sistema de rotas;
   - aliases;
   - fontes;
   - estilos globais;
   - estrutura de `/labs`;
   - estrutura de `/eco`;
   - páginas institucionais;
   - componentes existentes de projetos/cards;
   - infraestrutura de SEO/metadata;
   - padrões já usados pelo AG47.

3. Procurar documentação existente:
   - `AGENTS.md`
   - `README.md`
   - `instructions_ia.md`
   - docs de arquitetura
   - convenções locais
   - design system
   - qualquer documentação relacionada ao website AG47.

4. Respeitar a arquitetura existente.

## PROIBIDO

- recriar o projeto;
- trocar framework;
- criar uma segunda aplicação;
- substituir o design system existente;
- mudar configurações globais sem necessidade;
- quebrar rotas existentes;
- reestruturar `/labs` ou `/eco`;
- alterar backend sem necessidade;
- introduzir dependências pesadas sem justificativa;
- inventar APIs ou integrações inexistentes;
- criar conteúdo falso sobre experiência profissional;
- afirmar tecnologias ou resultados não comprovados no repositório/documentação.

A implementação deve ser **acoplada à estrutura atual**, não construída por cima dela como um sistema paralelo.

---

# 3. OBJETIVO DE NEGÓCIO DA PÁGINA

A landing page deve ter um único objetivo:

## Fazer um recrutador da YER concluir que vale a pena iniciar uma conversa técnica.

Não otimizar para:
- pageviews;
- SEO genérico;
- vendas;
- captura de leads;
- marketing da Agência 47.

O foco é candidatura profissional.

---

# 4. POSICIONAMENTO PROFISSIONAL

Utilizar como eixo principal:

**AI-Native Full-Stack / Software Engineer**

ou, se o conteúdo e contexto visual funcionarem melhor:

**Full-Stack Software Engineer | LLM-Driven & Agentic Development**

Evitar posicionar o candidato como:

- "prompt engineer";
- "AI enthusiast";
- "no-code developer";
- simples usuário de Codex/Claude/Antigravity;
- especialista puramente em Machine Learning, caso não haja evidência disso.

A narrativa correta é:

> Desenvolvedor de software com base full-stack que utiliza LLMs e agentes como multiplicadores de engenharia, mantendo compreensão do código, arquitetura, estrutura do projeto, integrações, validação e produto final.

---

# 5. CONCEITO DA HERO SECTION

A primeira dobra deve ser extremamente clara e visualmente forte.

Sugestão de copy:

## Headline

**Hi YER. I didn't want to just send you a CV.**

## Subheadline

**So I built this instead.**

Complemento:

> I'm a Full-Stack Software Engineer working with LLM-driven development, AI agents and rapid product engineering.  
> This page was created specifically for my application to your AI Engineer position in Lisbon.

Adicionar CTA principal:

**See how I build**

CTA secundário:

**View selected work**

Se houver um CV PDF futuramente:

**Download CV**

Não bloquear a implementação se o CV ainda não existir.

---

# 6. ESTRUTURA RECOMENDADA DA PÁGINA

A página deve seguir aproximadamente esta sequência:

## 6.1 Hero
Objetivo:
- deixar evidente que a página foi criada especificamente para a YER;
- posicionar profissionalmente;
- gerar curiosidade;
- mostrar intenção e iniciativa.

---

## 6.2 "What I actually do"

Em vez de uma lista genérica de skills, apresentar capacidades aplicadas.

Exemplo de grupos:

### Build
- Full-stack applications
- Backend services
- Frontend experiences
- APIs and integrations
- Database-backed products

### Engineer
- Project architecture
- Codebase navigation
- Refactoring
- Git workflows
- Deployment
- Debugging
- System organization

### Accelerate with AI
- LLM-driven development
- Codex
- Claude Code
- Antigravity
- AI-assisted coding
- Agent workflows
- Prompt/system instruction design
- Agentic automation

A apresentação deve deixar claro que IA complementa engenharia, não substitui compreensão técnica.

---

## 6.3 "How I work"

Criar uma seção visual demonstrando o fluxo real de desenvolvimento.

Fluxo sugerido:

`Problem`
↓
`Understand the system`
↓
`Architecture`
↓
`Build in VS Code`
↓
`Use AI agents as engineering multipliers`
↓
`Review code`
↓
`Test`
↓
`Deploy`
↓
`Observe`
↓
`Iterate`

Pode ser timeline, pipeline horizontal ou cards conectados.

Mensagem central:

> I don't delegate understanding to AI. I use AI to increase engineering throughput.

Evitar tom defensivo. Demonstrar pelo processo.

---

# 7. SELECTED ENGINEERING WORK

Usar projetos reais existentes no ecossistema.

Antes de escrever o conteúdo, localizar documentação e código dos projetos.

Prioridade inicial:

## AG Menu

Apresentar como case de produto full-stack para restauração/hospitality.

Investigar no repositório e documentar apenas capacidades realmente existentes, por exemplo:

- páginas de restaurantes;
- menus digitais;
- dashboard administrativo;
- autenticação;
- roles/permissões;
- importação de menu;
- reservas;
- banco de dados;
- Stripe;
- internacionalização;
- temas/layouts;
- APIs;
- deploy;
- SEO.

Não afirmar recursos ainda não existentes como concluídos.

Formato do case:

**Problem**  
Qual problema resolve.

**What I built**  
O que foi efetivamente implementado.

**Engineering scope**  
Frontend, backend, DB, APIs etc.

**AI leverage**  
Como agentes/LLMs participaram do desenvolvimento.

**Stack**  
Extrair do repositório, não inventar.

**Status**  
Experimental / production / beta / live, conforme realidade.

**Links**  
Live / GitHub somente quando apropriado e disponível.

---

## Evolution Protocol / EvoPro

Apresentar como case de:

- agent orchestration;
- autonomous development workflows;
- state machine;
- execution loops;
- validation;
- software evolution;
- cognitive/agent architecture.

Verificar documentação real.

Evitar linguagem fantasiosa.

Traduzir o projeto para linguagem de engenharia compreensível por recrutadores e engenheiros.

---

## YouLearn

Apresentar como case de:

- structured knowledge ingestion;
- content transformation;
- schemas;
- provenance;
- Next.js application;
- knowledge objects;
- UI architecture;
- validation;
- LLM-ready pipelines.

Verificar implementação e stack reais.

---

## Projeto adicional — opcional

Adicionar um quarto case apenas se melhorar claramente a candidatura.

Possíveis candidatos:
- Lucrar / trading systems;
- outro produto real do `/eco`;
- ferramenta interna da AG47.

Não adicionar projeto só para preencher espaço.

---

# 8. SEÇÃO MAIS IMPORTANTE — "YOUR REQUIREMENTS → MY EVIDENCE"

Criar uma seção específica para a YER.

Título sugerido:

## What you're looking for — and where I've done it

Construir uma matriz visual de correspondência.

Exemplo:

### YER:
Strong backend / full-stack software engineering foundations

### Evidence:
Projetos, componentes ou sistemas reais encontrados no AG47 que demonstrem isso.

---

### YER:
Rapid prototyping and turning ideas into working products

### Evidence:
Projetos construídos e publicados / arquitetura Labs → Eco, quando comprovável.

---

### YER:
Hands-on work with LLMs

### Evidence:
Codex, Claude Code, Antigravity, LLM workflows e aplicações reais.

---

### YER:
Agents and automation

### Evidence:
EvoPro e outras arquiteturas agentic reais.

---

### YER:
Backend integrations and services

### Evidence:
APIs, banco de dados, autenticação, Stripe ou demais integrações reais encontradas nos projetos.

---

### YER:
Experimentation mindset

### Evidence:
Labs, MVPs, ciclos de iteração, experimentação e promoção de projetos para `/eco`, se a estrutura atual confirmar esse modelo.

---

## IMPORTANTE

Não copiar a descrição inteira da vaga.

Parafrasear requisitos relevantes e responder com evidências.

A seção deve parecer uma análise de aderência, não keyword stuffing.

---

# 9. TECHNICAL CAPABILITY MAP

Criar uma seção visual compacta com tecnologias reais encontradas.

Categorias possíveis:

### Languages
Extrair do repositório.

### Frontend
Extrair do repositório.

### Backend
Extrair do repositório.

### Data
Extrair do repositório.

### Infrastructure
Extrair do repositório.

### AI / LLM
Somente ferramentas realmente usadas.

### Developer Tools
VS Code, Git, GitHub etc., quando apropriado.

Não usar barras de "90% de conhecimento".

Não classificar conhecimento com porcentagens artificiais.

---

# 10. "BUILT FOR THIS APPLICATION"

Adicionar uma pequena seção meta demonstrando que a própria página é parte da prova.

Exemplo:

## This application is also a small product

Mostrar:

- requirement analysis;
- information architecture;
- reusable component architecture;
- responsive implementation;
- performance;
- accessibility;
- deploy;
- personalized content;
- AI-assisted engineering workflow.

Caso seja possível obter informações do próprio build de forma legítima, mostrar detalhes reais.

Não inventar métricas.

---

# 11. FINAL CTA

Sugestão:

## This wasn't a template.

> I built this page specifically because I saw your AI Engineer position and believe the way I work is aligned with the kind of engineering you're building.

CTA:

**Let's talk**

Adicionar apenas contatos reais encontrados em configuração existente ou explicitamente definidos pelo proprietário.

Possíveis links:

- LinkedIn
- GitHub
- email
- AG47

Não publicar dados pessoais sensíveis.

---

# 12. DESIGN DIRECTION

A landing deve parecer:

- técnica;
- moderna;
- premium;
- minimalista;
- confiante;
- construída por engenheiro;
- visualmente alinhada à AG47.

Evitar estética de:

- currículo Word;
- template genérico de portfolio;
- "AI neon cyberpunk";
- excesso de gradientes;
- excesso de glassmorphism;
- badges sem significado;
- barras de skill;
- emojis profissionais;
- linguagem motivacional vazia.

Usar o design system existente do AG47 sempre que possível.

---

# 13. INTERAÇÕES

Adicionar movimento somente quando melhorar a comunicação.

Possibilidades:

- reveal progressivo ao scroll;
- microinterações;
- hover técnico nos cards;
- pipeline animado de "How I work";
- pequenos indicadores de arquitetura;
- navegação suave entre seções.

Não sacrificar performance por animação.

Respeitar `prefers-reduced-motion`.

---

# 14. RESPONSIVIDADE

Mobile-first.

Validar pelo menos:

- ~375px;
- ~390px;
- tablet;
- desktop 1280px+;
- telas largas.

Não deixar diagramas ou matrizes ilegíveis no mobile.

---

# 15. ACESSIBILIDADE

Garantir:

- headings semanticamente corretos;
- contraste adequado;
- foco visível;
- navegação por teclado;
- labels;
- links distinguíveis;
- landmarks;
- reduced motion;
- alt text quando houver imagens relevantes.

---

# 16. PERFORMANCE

Evitar:

- bibliotecas desnecessárias;
- imagens gigantes;
- vídeos autoplay;
- dependências pesadas por mero efeito visual;
- JavaScript excessivo.

Utilizar otimizações nativas da stack existente.

---

# 17. SEO / METADATA

Mesmo sendo uma página personalizada, configurar metadata.

Sugestão:

Title:
`AI Engineer Application for YER | [Candidate Name]`

Description:
`A purpose-built application demonstrating full-stack software engineering, LLM-driven development and agentic product engineering.`

Adicionar:
- Open Graph;
- canonical;
- favicon herdado do AG47;
- robots conforme estratégia existente.

Não indexar ou desindexar arbitrariamente sem verificar políticas atuais do site.

---

# 18. MOTOR REUTILIZÁVEL

A página da YER não deve virar um componente monolítico impossível de reaproveitar.

Estruturar a implementação para permitir futuras páginas como:

- `/nos`
- `/amgen`
- `/company-name`

Mas NÃO implementar essas páginas agora.

Criar apenas a infraestrutura mínima para reuso.

Preferência conceitual:

```text
career/
  components/
  data/
  types/
```

ou estrutura equivalente compatível com o projeto atual.

Exemplo de modelo de dados conceitual:

```ts
type ApplicationPage = {
  company: CompanyInfo
  role: RoleInfo
  hero: HeroContent
  capabilities: Capability[]
  workflow: WorkflowStep[]
  projects: ProjectEvidence[]
  requirementMatches: RequirementMatch[]
  contacts: ContactLink[]
}
```

Isto é apenas uma referência.

Não impor essa estrutura se conflitar com a arquitetura real.

---

# 19. FONTE DE VERDADE

Conteúdo técnico deve ser obtido prioritariamente de:

1. código do repositório;
2. documentação atual;
3. configuração de deploy;
4. package manifests;
5. schemas;
6. rotas;
7. componentes;
8. histórico/documentação de projetos;
9. informações explicitamente fornecidas pelo proprietário.

Não inventar:
- anos de experiência;
- empresas anteriores;
- formação acadêmica;
- certificações;
- inglês;
- métricas;
- faturamento;
- usuários;
- tecnologias;
- responsabilidade profissional formal.

Quando algum conteúdo pessoal necessário estiver ausente, criar placeholder claramente marcado:

`[TODO: Candidate confirmation required]`

---

# 20. PESQUISA DA VAGA

Se houver acesso web, localizar a vaga real da YER e extrair somente informações relevantes para a implementação:

- nome exato do cargo;
- localização;
- modelo de trabalho;
- responsabilidades;
- requisitos;
- diferenciais;
- linguagem utilizada pela empresa.

Não fazer scraping agressivo.

Se a vaga não estiver acessível, usar a descrição armazenada no briefing e marcar requisitos que precisem de validação.

---

# 21. COPY

Idioma principal da página:

**English**

Motivo:
- candidatura internacional;
- vaga técnica;
- mercado tecnológico português;
- demonstração de comunicação profissional.

Tom:
- direto;
- técnico;
- confiante;
- sem arrogância;
- sem linguagem corporativa vazia.

Evitar:

> passionate developer  
> coding ninja  
> rockstar  
> guru  
> visionary

Preferir evidência concreta.

---

# 22. NÃO ESCONDER O USO DE IA

Não tentar criar a impressão de que tudo foi escrito manualmente.

A página pode assumir explicitamente AI-assisted development.

Mas apresentar da maneira correta:

> AI is part of my engineering workflow, not a substitute for understanding the system.

A capacidade a demonstrar é:

**human engineering judgment + AI execution leverage**

---

# 23. VALIDAÇÃO TÉCNICA OBRIGATÓRIA

Antes de concluir:

Executar os checks adequados ao projeto:

- lint;
- typecheck;
- tests relevantes;
- build;
- validação de links;
- verificação responsive;
- console errors;
- warnings;
- acessibilidade básica.

Não declarar sucesso se algum check falhar.

Corrigir falhas introduzidas pela implementação.

Não corrigir problemas não relacionados em outras áreas do projeto sem necessidade.

---

# 24. ENTREGÁVEL

Implementar a página funcional.

Ao finalizar, produzir um relatório curto contendo:

## Files Created
Lista de arquivos.

## Files Modified
Lista de arquivos.

## Route
URL/rota criada.

## Architecture
Resumo da solução.

## Reusable Elements
O que pode ser reutilizado para futuras empresas.

## Evidence Sources
De onde cada informação principal sobre projetos/skills foi extraída.

## Validation
Resultados de:
- lint
- typecheck
- tests
- build

## Pending Candidate Information
Informações que ainda precisam de confirmação humana.

---

# 25. CRITÉRIOS DE ACEITAÇÃO

A tarefa só deve ser considerada concluída se:

- [ ] `/yer` funciona;
- [ ] página é responsiva;
- [ ] página segue a arquitetura existente;
- [ ] nenhum fluxo existente foi quebrado;
- [ ] conteúdo é focado na vaga YER;
- [ ] não parece currículo genérico;
- [ ] demonstra full-stack engineering;
- [ ] demonstra AI-native engineering;
- [ ] demonstra compreensão de código e arquitetura;
- [ ] existem cases reais;
- [ ] existe seção "YER requirements → evidence";
- [ ] conteúdo não contém experiência inventada;
- [ ] estrutura pode ser reutilizada futuramente;
- [ ] lint/typecheck/build passam ou limitações são claramente reportadas;
- [ ] projeto mantém identidade visual AG47.

---

# 26. RESULTADO ESPERADO

Quando um recrutador ou engenheiro da YER abrir a página, a percepção desejada é:

> "Ele não apenas respondeu à vaga. Ele analisou o que estamos procurando, estruturou uma solução, construiu algo funcional especificamente para nós e utilizou os próprios projetos como evidência."

A página deve demonstrar a capacidade antes mesmo da entrevista.

---

# 27. ORDEM DE EXECUÇÃO

1. Investigar repositório.
2. Ler instruções existentes.
3. Identificar design system e arquitetura.
4. Mapear projetos/evidências reais.
5. Validar requisitos da vaga disponíveis.
6. Definir arquitetura mínima da feature.
7. Implementar `/yer`.
8. Criar componentes reutilizáveis somente onde fizer sentido.
9. Revisar copy.
10. Executar validações.
11. Corrigir problemas introduzidos.
12. Gerar relatório final.

## NÃO PARAR PARA PEDIR AUTORIZAÇÃO ENTRE ETAPAS

Dentro do escopo desta tarefa, agir autonomamente.

Caso encontre ambiguidade não bloqueante, escolher a solução tecnicamente mais conservadora e documentar a decisão.

Caso encontre risco real de quebrar arquitetura, dados, segurança ou produção, não executar a alteração destrutiva. Implementar a alternativa segura e documentar.

---

# DEFINIÇÃO FINAL

Esta feature não é um portfolio.

Não é um currículo.

Não é uma landing institucional da Agência 47.

É uma **candidatura executável**:

> uma página construída especificamente para a YER que usa produto, código, arquitetura e evidências reais para demonstrar adequação à vaga de AI Engineer.
