# PROTOCOL_ARTIFACT_CATALOG.md

# AG47 Evolution Protocol: Catálogo Geral de Artefatos
**Versão:** 1.0.0-draft  
**Status:** Em Revisão Crítica (Fase 2)  
**Domínio:** Engenharia de Software Geral  

---

Este catálogo especifica os artefatos obrigatórios e recomendados para a operação do **AG47 Evolution Protocol**. Cada artefato possui responsabilidades bem delimitadas, produtores e consumidores definidos, e regras estritas sobre sua mutabilidade ao longo do ciclo de vida da evolução de software.

---

## 📂 Índice de Artefatos

1. [Constituição do Projeto (CONSTITUTION.md)](#1-constituição-do-projeto-constitutionmd)
2. [Mapa de Arquitetura (ARCHITECTURE.md)](#2-mapa-de-arquitetura-architecturemd)
3. [Painel de Atividades (task.md)](#3-painel-de-atividades-taskmd)
4. [Proposta de Alterações (proposed_changeset.json)](#4-proposta-de-alterações-proposed_changesetjson)
5. [Veredito de Integridade (integrity_verdict.json)](#5-veredito-de-integridade-integrity_verdictjson)
6. [Registro de Ações Humanas (har_registry.json)](#6-registro-de-ações-humanas-har_registryjson)
7. [Catálogo de Competências (skills_registry.json)](#7-catálogo-de-competências-skills_registryjson)
8. [Registro de Decisões Arquiteturais (ADR.md)](#8-registro-de-decisões-arquiteturais-adrmd)
9. [Livro Razão de Sprints (sprint_ledger.json)](#9-livro-razão-de-sprints-sprint_ledgerjson)
10. [Retrato do Ecossistema (system_snapshot.json)](#10-retrato-do-ecossistema-system_snapshotjson)

---

### 1. Constituição do Projeto (`CONSTITUTION.md`)

* **Finalidade:** Definir de forma categórica a missão, os objetivos, as restrições operacionais e os limites rígidos de autonomia da IA em um repositório.
* **Formato sugerido:** Markdown estruturado.
* **Produtor:** Operador Humano.
* **Validador:** Operador Humano (Assinatura física/criptográfica ou merge verificado).
* **Consumidor:** Todos os agentes de IA (Observador, Executor, Validador, Guardião).
* **Mutabilidade:** **Imutável por IA**. Apenas humanos podem alterar este arquivo.
* **Ciclo de vida:** Criado no bootstrap do projeto. Atualizado apenas em revisões estratégicas do produto ou quando novos limites constitucionais são definidos.

---

### 2. Mapa de Arquitetura (`ARCHITECTURE.md`)

* **Finalidade:** Mapear a arquitetura atual (As-Is) e detalhar a arquitetura de destino (To-Be), delimitando as lacunas técnicas (gaps) que serão atacadas no ciclo de sprints.
* **Formato sugerido:** Markdown com diagramas Mermaid embutidos para visualização gráfica.
* **Produtor:** Guardião da Arquitetura / Operador Humano.
* **Validador:** Validador e Operador Humano.
* **Consumidor:** Executor (como guia de implementação) e Observador (para detectar desvios).
* **Mutabilidade:** **Semi-mutável**. A IA (Guardião) pode atualizar a seção "Atual" após deploys verificados, mas a arquitetura "Alvo" requer consentimento humano para ser alterada.
* **Ciclo de vida:** Criado no bootstrap. Atualizado a cada definição de sprint (para adicionar o To-Be) e a cada fechamento de sprint (para consolidar o As-Is).

---

### 3. Painel de Atividades (`task.md`)

* **Finalidade:** Servir como o painel Kanban de controle de tarefas do sprint ativo, rastreando o progresso de itens de trabalho granulares.
* **Formato sugerido:** Markdown com caixas de seleção (`- [ ]`, `- [/]`, `- [x]`).
* **Produtor:** Guardião da Arquitetura / Executor / Observador.
* **Validador:** Validador (avalia se os itens marcados como completos possuem testes passando).
* **Consumidor:** Todos os agentes de IA e o operador humano.
* **Mutabilidade:** **Altamente Mutável**. Modificado dinamicamente ao longo do sprint conforme as tarefas progridem.
* **Ciclo de vida:** Inicializado no início de cada sprint a partir do Gap planejado. Destruído ou arquivado no fechamento do sprint após consolidação no `sprint_ledger.json`.

---

### 4. Proposta de Alterações (`proposed_changeset.json`)

* **Finalidade:** Descrever formalmente uma hipótese técnica de alteração de código. Contém o plano cirúrgico de arquivos que serão modificados, as justificativas de engenharia e as expectativas de validação que o sistema deve cumprir.
* **Formato sugerido:** JSON estruturado (esquematizado).
* **Produtor:** Executor.
* **Validador:** Guardião da Arquitetura.
* **Consumidor:** Validador (para configurar o Truth Engine) e Operador Humano.
* **Mutabilidade:** **Imutável após aprovação**. Pode ser editado durante a fase de planejamento, mas é congelado ao transicionar para o estado `APPROVED`.
* **Ciclo de vida:** Criado quando o Executor assume um Gap de arquitetura. É consumido e validado, e permanece arquivado junto ao histórico da evolução após o merge.

---

### 5. Veredito de Integridade (`integrity_verdict.json`)

* **Finalidade:** Registrar o resultado definitivo dos testes, análises estáticas e scans de segurança executados sobre a proposta de alterações do Executor. Une a Verdade de Implementação à Verdade Operacional.
* **Formato sugerido:** JSON estruturado.
* **Produtor:** Validador (via Truth Engine automatizado).
* **Validador:** Assinatura criptográfica ou hash gerado pelo runtime isolado de testes.
* **Consumidor:** Gerente de Release e Operador Humano.
* **Mutabilidade:** **Estritamente Imutável**. Uma vez emitido pelo runtime de testes, não pode sofrer nenhuma alteração sintática.
* **Ciclo de vida:** Gerado automaticamente ao final do pipeline de testes da mutação. Serve de barreira para a integração em produção. Se falhar, aborta a evolução.

---

### 6. Registro de Ações Humanas (`har_registry.json`)

* **Finalidade:** Listar de forma estrita as ações que exigem validação manual por parte do operador humano (ex: testes de layout visual, tokens físicos de homologação). Impede que a IA simule sucesso.
* **Formato sugerido:** JSON estruturado.
* **Produtor:** Executor ou Observador (ao identificar a necessidade de uma ação humana).
* **Validador:** Operador Humano (que altera o status e anexa a evidência exigida).
* **Consumidor:** Validador (que bloqueia o pipeline se houver pendências) e Gerente de Release.
* **Mutabilidade:** **Controlada**. A IA pode apenas adicionar registros pendentes. Somente o humano pode marcar itens como concluídos ou válidos.
* **Ciclo de vida:** Limpo a cada início de sprint. Acumula registros durante o desenvolvimento. Deve estar 100% resolvido para que o repositório passe para o estado `VERIFIED`.

---

### 7. Catálogo de Competências (`skills_registry.json`)

* **Finalidade:** Cadastrar as Skills autorizadas para uso dos agentes de IA, contendo seus metadados de execução, caminhos físicos e níveis de confiança históricos.
* **Formato sugerido:** JSON estruturado.
* **Produtor:** Curador de Conhecimento.
* **Validador:** Operador Humano.
* **Consumidor:** Todos os agentes de IA (para carregar competências dinamicamente).
* **Mutabilidade:** **Semi-mutável**. A IA (Curador) pode sugerir refinamentos de instruções ou rebaixar a confiança de uma skill falha, mas a inserção de novas competências requer aprovação humana.
* **Ciclo de vida:** Persistente e duradouro. Vive na governança global do repositório.

---

### 8. Registro de Decisões Arquiteturais (`ADR.md`)

* **Finalidade:** Registrar de forma imutável as decisões arquiteturais fundamentais adotadas no projeto, explicando o contexto, as alternativas avaliadas e os trade-offs.
* **Formato sugerido:** Markdown estruturado (padrão de Architecture Decision Records).
* **Produtor:** Guardião da Arquitetura.
* **Validador:** Operador Humano.
* **Consumidor:** Todos os desenvolvedores futuros (humanos e IA).
* **Mutabilidade:** **Append-only (Imutável após gravação)**. Novas decisões ganham novos arquivos numerados seqüencialmente.
* **Ciclo de vida:** Criado em momentos de inflexão técnica. Permanece para sempre na base de conhecimento.

---

### 9. Livro Razão de Sprints (`sprint_ledger.json`)

* **Finalidade:** Armazenar os metadados agregados das sprints executadas. Contém o gap resolvido, a lista de mutações integradas, os hashes de vereditos de integridade e o histórico de ações do desenvolvedor (`acoes-do-dev.md`).
* **Formato sugerido:** JSON estruturado.
* **Produtor:** Gerente de Release / Curador de Conhecimento.
* **Validador:** Validador e Operador Humano.
* **Consumidor:** Curador de Conhecimento (para mineração de aprendizado) e auditores do projeto.
* **Mutabilidade:** **Append-only**. Não pode ser reescrito ou apagado para preservar a auditabilidade.
* **Ciclo de vida:** Incrementado a cada encerramento de sprint. Vive no diretório de memória persistente.

---

### 10. Retrato do Ecossistema (`system_snapshot.json`)

* **Finalidade:** Registrar o estado completo da aplicação em um momento exato do tempo. Contém o mapa da árvore de arquivos, versões de dependências instaladas, hashes do Git e status de integridade dos provedores de rede (circuit breakers).
* **Formato sugerido:** JSON estruturado.
* **Produtor:** Observador.
* **Validador:** Validador.
* **Consumidor:** Executor (para planejar mudanças) e Guardião da Arquitetura (para auditoria de segurança).
* **Mutabilidade:** **Volátil / Auto-Gerado**. Sobrescreve a cada nova rodada do ciclo de monitoramento do Observador.
* **Ciclo de vida:** Gerado automaticamente de forma periódica ou ao início de qualquer transição de estado da máquina de evolução.

---

## Summary Matrix of Mutability and Roles

A tabela abaixo resume as permissões de gravação/alteração sobre cada um dos artefatos:

| Artefato | Produtor | Validador | Consumidor | Mutabilidade |
| :--- | :--- | :--- | :--- | :--- |
| `CONSTITUTION.md` | Humano | Humano | Agentes de IA | Imutável por IA |
| `ARCHITECTURE.md` | Guardião | Humano / Validador | Executor / Observador | Semi-mutável |
| `task.md` | Guardião / Executor | Validador | Todos | Altamente Mutável |
| `proposed_changeset.json` | Executor | Guardião | Validador / Humano | Congelado após aprovação |
| `integrity_verdict.json` | Validador | Sistema (Crypt) | Release Mgr / Humano | Estritamente Imutável |
| `har_registry.json` | Agentes (IA) | Humano | Todos | Mutabilidade Controlada |
| `skills_registry.json` | Curador | Humano | Agentes (IA) | Semi-mutável |
| `ADR.md` | Guardião | Humano | Todos | Append-only |
| `sprint_ledger.json` | Release Mgr | Humano / Validador | Curador | Append-only |
| `system_snapshot.json` | Observador | Validador | Executor | Volátil |
