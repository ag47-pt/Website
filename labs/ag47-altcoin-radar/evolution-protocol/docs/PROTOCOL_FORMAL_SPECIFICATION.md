# PROTOCOL_FORMAL_SPECIFICATION.md

# AG47 Evolution Protocol: Especificação Formal Normativa
**Versão:** 1.0.0  
**Status:** Normativo / Finalizado para Fase 3A  
**Domínio:** Engenharia de Software Geral  

---

## 1. Terminologia Normativa

Esta especificação utiliza termos normativos estritos de acordo com o padrão RFC 2119 para definir o nível de obrigatoriedade das regras e comportamentos descritos:

* **MUST (DEVE):** Este termo define um requisito absoluto da especificação. O não cumprimento invalida qualquer transição de estado.
* **MUST NOT (NÃO DEVE):** Define uma proibição absoluta. Qualquer violação causa a interrupção imediata (Circuit Breaker) e o bloqueio do pipeline.
* **SHOULD (DEVERIA):** Define um comportamento recomendado. Há razões válidas em circunstâncias específicas para ignorar este ponto, mas os impactos devem ser analisados e justificados.
* **SHOULD NOT (NÃO DEVERIA):** Define um comportamento não recomendado. A execução do ato exige justificativa documentada em ADR.
* **MAY (PODE):** Define um comportamento verdadeiramente opcional. O projeto ou operador pode escolher implementar ou ignorar sem qualquer prejuízo à conformidade do protocolo.

---

## 2. Entidades Centrais

O ecossistema de evolução de software é estruturado em grupos lógicos de entidades. Cada entidade possui uma definição formal de campos conceituais, autoridade de mutabilidade e invariantes de integridade.

### A. Grupo Constituição

#### ProjectConstitution (`project-constitution`)
* **Finalidade:** O contrato supremo e imutável que rege o projeto de software.
* **Identidade:** HASH SHA256 exclusivo derivado do conteúdo consolidado do arquivo.
* **Campos Conceituais:** `project_name`, `mission_statement`, `goals[]`, `non_goals[]`, `autonomy_boundaries[]`, `success_criteria[]`, `stop_conditions[]`.
* **Produtor:** `HumanOperator`.
* **Validador:** `HumanOperator`.
* **Consumidor:** Todos os papéis.
* **Mutabilidade:** **Imutável por IA**. Modificações apenas via merge verificado exclusivo por humanos.
* **Ciclo de vida:** Criado no bootstrap. Vive durante toda a duração do repositório.
* **Relações:** Contém os limites que validam todas as propostas de mudança (`proposed-changeset`).
* **Invariantes:** **MUST NOT** ser editado por agentes de IA. **MUST** conter pelo menos um não-objetivo (`non-goals`) e um limite de autonomia (`autonomy-boundaries`).

---

### B. Grupo Arquitetura

#### TargetArchitecture (`target-architecture`)
* **Finalidade:** O design de destino desejado para a base de código na sprint corrente.
* **Identidade:** Caminho lógico versionado e UUID do estado alvo.
* **Campos Conceituais:** `target_state_description`, `allowed_components[]`, `communication_rules[]`, `adr_references[]`.
* **Produtor:** `ArchitectureGuardian` em conjunto com `HumanOperator`.
* **Validador:** `HumanOperator`.
* **Consumidor:** `Executor`.
* **Mutabilidade:** Modificável por IA em modo `DRAFT` ou `PROPOSED`; **MUST NOT** ser modificada de forma autônoma após aprovação humana.
* **Ciclo de vida:** Definida no início do planejamento da evolução e congelada na aprovação do plano.
* **Relações:** Vinculada ao `architecture-gap`.
* **Invariantes:** **MUST** estar em total conformidade com a `project-constitution`.

#### ArchitectureGap (`architecture-gap`)
* **Finalidade:** Representar a discrepância exata entre a arquitetura atual e a arquitetura alvo.
* **Identidade:** UUID gerado dinamicamente no início da sprint.
* **Campos Conceituais:** `gap_id`, `source_component`, `target_component`, `mismatch_description`, `criticality_level`.
* **Produtor:** `Observer`.
* **Validador:** `ArchitectureGuardian`.
* **Consumidor:** `Executor`.
* **Mutabilidade:** Modificável durante a fase de descoberta; congelado na abertura da sprint.
* **Ciclo de vida:** Criado na fase de planejamento de sprint; encerrado quando o gap é resolvido.
* **Relações:** Gera um ou mais `proposed-changeset`.
* **Invariantes:** **MUST NOT** conter referências a segredos ou credenciais de infraestrutura.

#### ArchitectureDecisionRecord (`adr`)
* **Finalidade:** Registrar de forma irrevogável as escolhas estruturais adotadas e suas justificativas.
* **Identidade:** Sequencial estrito (`ADR-001`, `ADR-002`, etc.) + SHA256 do arquivo.
* **Campos Conceituais:** `adr_id`, `title`, `context`, `decision_proposed`, `status`, `consequences`, `human_operator_signature`.
* **Produtor:** `ArchitectureGuardian` (IA pode rascunhar em `DRAFT`).
* **Validador:** `HumanOperator`.
* **Consumidor:** Todos os agentes de IA e humanos.
* **Mutabilidade:** **Append-only**. Estados autorizados: `DRAFT`, `PROPOSED`, `REVIEWED`, `HUMAN_APPROVED`, `ACCEPTED`, `REJECTED`, `SUPERSEDED`, `DEPRECATED`.
* **Ciclo de vida:** Persistido para sempre no histórico do repositório.
* **Invariantes:** Mudanças críticas de estado (ex: `SUPERSEDED`) **MUST** conter a assinatura/aprovação de um `HumanOperator`.

---

### C. Grupo Observação

#### SystemSnapshot (`system-snapshot`)
* **Finalidade:** Registrar a fotografia instantânea e semântica de todo o ecossistema de software.
* **Identidade:** SHA256 dos hashes consolidados do Git + status de provedores no momento T.
* **Campos Conceituais:** `timestamp`, `git_commit_hash`, `directory_tree_hash`, `installed_dependencies[]`, `circuit_breakers_status[]`.
* **Produtor:** `Observer`.
* **Validador:** `Validator`.
* **Consumidor:** `Executor`, `ArchitectureGuardian`.
* **Mutabilidade:** **Volátil / Auto-Gerado**. Sobrescreve a cada ciclo de observação.
* **Invariantes:** **MUST** ser computado na raiz do repositório a cada transição de estado da máquina de evolução.

#### RiskAssessment (`risk-assessment`)
* **Finalidade:** Medir o impacto e a incerteza de uma alteração proposta em relação a dependências, segurança e complexidade.
* **Identidade:** UUID associado ao plano da sprint.
* **Campos Conceituais:** `risk_score` (0 a 100), `potential_impact_scope[]`, `vulnerability_exposure`, `circuit_breaker_triggers[]`.
* **Produtor:** `Observer` / `ArchitectureGuardian`.
* **Validador:** `Validator`.
* **Consumidor:** `HumanOperator`, `ReleaseManager`.
* **Mutabilidade:** Read-only após a transição para `APPROVED`.
* **Invariantes:** Se o `risk_score` exceder o limite constitucional, o estado da tarefa **MUST** ser forçado para `HUMAN_REVIEW` com o código de falha `RISK_EXCEEDS_VALUE`.

---

### D. Grupo Planejamento

#### ProposedChangeset (`proposed-changeset`)
* **Finalidade:** Mapear a alteração proposta contendo o plano de mutação e as metas de testes.
* **Identidade:** HASH do changeset proposto.
* **Campos Conceituais:** `changeset_id`, `target_files[]`, `modified_methods[]`, `dependencies_added[]`, `validation_rules_expected[]`.
* **Produtor:** `Executor`.
* **Validador:** `Validator` e `ArchitectureGuardian`.
* **Consumidor:** `Validator`.
* **Mutabilidade:** Congelado após aprovação humana.
* **Invariantes:** **MUST NOT** listar qualquer alteração em arquivos protegidos pela Constituição sem autorização expressa no HAR.

---

### E. Grupo Execução

#### ActiveTask (`active-task`)
* **Finalidade:** Representar a tarefa operacional sob execução, mantendo dupla projeção: dados estruturados JSON e visualização legível Markdown.
* **Identidade:** Caminho físico pareado: `active-task.json` (fonte de verdade operacional) e `active-task.md` (projeção para o operador).
* **Campos Conceituais:** `task_id`, `status` (Kanban), `assigned_actor`, `mutations_proposed[]`, `har_links[]`, `completion_percentage`.
* **Produtor:** `Executor` / `ArchitectureGuardian`.
* **Validador:** `Validator`.
* **Consumidor:** Todos os agentes e humanos.
* **Mutabilidade:** Altamente mutável durante a execução da sprint.
* **Invariantes:** O estado na máquina de estados do protocolo **MUST** ler exclusivamente `active-task.json`. A sincronização de `active-task.md` **MUST** ser automática a cada mutação de estado.

---

### F. Grupo Evidência

#### IntegrityVerdict (`integrity_verdict`)
* **Finalidade:** Registrar a validação inequívoca e assinada de testes, cobertura, lint e segurança.
* **Identidade:** UUID + Hash assinado pelo runtime de teste.
* **Campos Conceituais:** `verdict_id`, `is_success`, `lint_status`, `test_coverage`, `failed_tests[]`, `vulnerabilities_found[]`, `validator_signature`.
* **Produtor:** `Validator`.
* **Validador:** Hash do runtime criptográfico do pipeline.
* **Consumidor:** `ReleaseManager`, `HumanOperator`.
* **Mutabilidade:** **Estritamente Imutável**.
* **Invariantes:** **MUST NOT** conter qualquer valor simulado (mock) para testes de segurança estática ou dinâmica que requeiram ambiente de produção.

---

### G. Grupo Governança

#### HumanActionEntry (`human-action`)
* **Finalidade:** Registrar verificações físicas ou lógicas exclusivas do operador humano sem vazamento de segredos.
* **Identidade:** Identificador único sequencial (`HA-001`, `HA-002`).
* **Campos Conceituais:** `action_id`, `description`, `secret_reference` (ex: `env://TELEGRAM_BOT_TOKEN`), `secret_present_boolean`, `evidence_type_expected`, `human_operator_signature`, `status` (`PENDING` | `COMPLETED` | `FAILED`).
* **Produtor:** `Observer` ou `Executor`.
* **Validador:** `HumanOperator`.
* **Consumidor:** `Validator`, `ReleaseManager`.
* **Mutabilidade:** Apenas o humano pode transicionar para `COMPLETED`.
* **Invariantes:** **MUST NOT** armazenar em qualquer campo do JSON os valores literais de tokens, chaves privadas ou credenciais.

---

### H. Grupo Memória

#### SprintLedger (`sprint-ledger`)
* **Finalidade:** O livro-razão histórico e imutável que registra a evolução das sprints.
* **Identidade:** Encadeamento de blocos via hash anterior (`previous_hash`), gerando uma blockchain local de eventos do repositório.
* **Campos Conceituais:** `sprint_id`, `event_type`, `actor_role`, `timestamp`, `evidence_refs[]`, `previous_hash`, `current_hash`.
* **Produtor:** `ReleaseManager` / `KnowledgeCurator`.
* **Validador:** `Validator`.
* **Consumidor:** `KnowledgeCurator` e auditores.
* **Mutabilidade:** **Append-only**. Registros passados **MUST NOT** ser editados ou removidos sob qualquer circunstância.
* **Invariantes:** O primeiro bloco **MUST** referenciar o hash do commit de bootstrap do protocolo.

#### ActiveSummary (`active-summary`)
* **Finalidade:** O resumo consolidado do conhecimento ativo do sistema, mantendo referências estritas para as fontes que deram origem à consolidação para evitar alucinação.
* **Identidade:** SHA256 do arquivo consolidado.
* **Campos Conceituais:** `knowledge_id`, `summary_text`, `source_references[]` (ex: `["adr/ADR-004.md", "ledger/sprint-10.json"]`), `confidence_level` (Low | Medium | High), `expiry_date`.
* **Produtor:** `KnowledgeCurator`.
* **Validador:** `HumanOperator`.
* **Consumidor:** Todos os agentes de IA.
* **Mutabilidade:** Substituído periodicamente pelo processo de compactação de memória.
* **Invariantes:** Nenhuma compactação de memória **PODE** apagar a fonte original referenciada em `source_references`.

---

## 3. Papéis e Autoridade

Os papéis definem as fronteiras de autoridade operacional sobre os artefatos. Conflitos de interesse são prevenidos pelo isolamento estrito de permissões.

```text
+----------------------+-----------------------------+-------------------------------+
| Papel                | Permissões de Gravação      | Restrições de Gravação        |
+----------------------+-----------------------------+-------------------------------+
| Observer             | system-snapshot, signals    | código, constituição, tarefas |
| Executor             | código, task (in-progress)  | adr, constituição, har        |
| Validator            | integrity_verdict           | código, constituição, tarefas |
| ArchitectureGuardian | target-architecture (DRAFT)  | código, constituição          |
| KnowledgeCurator     | active-summary, skills      | código, ledger                |
| ReleaseManager       | sprint-ledger, releases     | código, constituição          |
| HumanOperator        | constitution, har (complet) | Nenhuma (Autoridade Máxima)   |
+----------------------+-----------------------------+-------------------------------+
```

### Regras de Conflito de Interesse (MUST NOT):
1. O mesmo ator (seja humano ou instância de IA) **NÃO DEVE** acumular os papéis de `Executor` e `Validator` sobre o mesmo `proposed-changeset`.
2. O `Executor` **NÃO DEVE** transicionar o estado de sua própria tarefa para `TESTED` ou `VERIFIED`. Isso exige a validação exclusiva do `Validator` e do `HumanOperator`.
3. Nenhum agente de IA **DEVE** assumir o papel de `HumanOperator` ou simular sua assinatura.

---

## 4. Máquina de Estados

O ciclo de vida do repositório transiciona através de estados lógicos bem definidos.

```text
[PROPOSED]
    │  (Autor: Observer/Guardian | Pré-condição: Gap de Arquitetura ativo)
    ▼
[APPROVED]
    │  (Autor: HumanOperator | Pré-condição: proposed-changeset validado)
    ▼
[IN_PROGRESS]
    │  (Autor: Executor | Pré-condição: task.json status="in-progress")
    ▼
[IMPLEMENTED]
    │  (Autor: Executor | Pré-condição: diffs de código gerados)
    ▼
[TESTED] 
    │  (Autor: Validator | Pré-condição: integrity_verdict.json is_success=true)
    ▼
[VERIFIED]
    │  (Autor: HumanOperator | Pré-condição: har_registry.json pendências = 0)
    ▼
[RELEASE_CANDIDATE]
    │  (Autor: ReleaseManager | Pré-condição: verificação integrada concluída)
    ▼
[MERGED]
    │  (Autor: ReleaseManager | Pré-condição: deploy em produção executado)
    ▼
[CLOSED] (Estado Final da Iteração)
```

### Transições de Exceção e Rollback:
* **REGRESSION / REJECTED:** Transiciona a evolução de volta para `APPROVED` ou `PROPOSED` dependendo da gravidade, com geração automática de relatório de falhas.
* **ROLLED_BACK:** Acionado se o deploy de produção (`MERGED`) apresentar falha imediata de integridade (circuit breakers operacionais acionados). A transição reverte o repositório para o último commit seguro com estado `VERIFIED` anterior.
* **HUMAN_REVIEW (Bloqueio):** Acionado automaticamente em caso de violação de invariantes globais ou conflito entre verdades (ver Seção 6).

---

## 5. Invariantes Globais

As seguintes regras normativas de integridade são universais e se aplicam a todo o protocolo:

1. **Nenhum Executor aprova seu próprio trabalho (MUST NOT):** A transição de `IMPLEMENTED` para `TESTED` exige a verificação de um `Validator` independente.
2. **Nenhum artefato é concluído sem evidência (MUST NOT):** A conclusão de qualquer item de evolução exige referências físicas a logs de teste ou assinaturas.
3. **Nenhuma ação humana é simulada (MUST NOT):** A IA nunca altera o status de tarefas no HAR para `COMPLETED` ou simula o sucesso de execuções manuais.
4. **Nenhum segredo é persistido (MUST NOT):** Qualquer tentativa de gravação de valores secretos em logs de evolução ou no HAR causa o bloqueio imediato do pipeline.
5. **Nenhuma mudança crítica ignora a Constituição (MUST NOT):** Alterações que invadam limites de autonomia definidos na Constituição exigem rejeição imediata do changeset.
6. **Nenhum estado pode ser pulado (MUST NOT):** A sequência de estados da máquina de estados deve ser percorrida de forma linear e incremental.
7. **Nenhum evento histórico pode ser reescrito (MUST NOT):** O `sprint-ledger` deve ser estruturado em append-only com encadeamento de hashes SHA256.
8. **Nenhuma verdade inferida é registrada como fato sem nível de confiança (MUST NOT):** O Curador de Conhecimento deve rotular explicitamente o nível de certeza em resumos de memória.
9. **Nenhuma compactação de memória remove a fonte original (MUST NOT):** O histórico imutável deve permanecer acessível sob índices estruturados.

---

## 6. Modelo de Verdade

O protocolo reconhece três níveis de verdade para mitigar a alucinação e garantir a consistência do sistema:

1. **DocumentaryTruth (Verdade Documental):** O que está declarado que deve ser feito (ex: planos, Constituição, tarefas aprovadas).
2. **ImplementationTruth (Verdade de Implementação):** O que está escrito fisicamente nos arquivos de código do repositório (AST, funções declaradas).
3. **OperationalTruth (Verdade Operacional):** Como o software se comporta na execução real (logs, testes concorrentes, resultados dinâmicos).

### Tratamento de Conflito de Verdades:

Quando há divergência entre os três níveis, o protocolo **MUST NOT** escolher silenciosamente um lado. Ele deve registrar a colisão e transicionar a tarefa ativa para o estado `HUMAN_REVIEW` com o erro de integridade correspondente.

#### Matriz de Resolução de Conflitos:

```text
+-------------------+----------------------+--------------------+------------------------------------------+
| Documentary Truth | Implementation Truth | Operational Truth  | Ação do Protocolo                        |
+-------------------+----------------------+--------------------+------------------------------------------+
| Declara funcional | Código existe        | Teste passa        | ESTADO SEGURO (Transiciona normalmente)  |
| Declara funcional | Código NÃO existe    | Teste passa (mock) | CONFLITO (Falha crítica, pular pro HAR)  |
| Declara funcional | Código existe        | Teste falha        | REGRESSION (Gera erro VALIDATION_FAILED) |
| Declara ausente   | Código existe        | Teste passa        | CONFLITO (Força estado HUMAN_REVIEW)     |
+-------------------+----------------------+--------------------+------------------------------------------+
```

---

## 7. Modelo de Evidência

Qualquer mudança no ecossistema exige a compilação de um **Evidence Bundle** (`evidence-bundle`) que comprova a conformidade física e lógica.

* **Tipos de Evidência:**
  * **Sintática:** Logs de linter, saídas de compilador, análise de tipos do TypeScript.
  * **Comportamental:** Relatórios de cobertura de teste (XML/JSON), resultados de testes unitários e de integração.
  * **Segurança:** Logs de scanners SAST/DAST, auditorias de dependências em árvore.
  * **Humana:** Assinatura do `HumanOperator`, hash SHA256 de imagens ou logs inseridos manualmente no HAR.
* **Temporalidade e Expiração:** As evidências operacionais possuem data de validade associada ao hash do commit. Qualquer nova mutação de código invalida o `evidence-bundle` anterior, exigindo nova compilação.
* **Integridade:** As evidências devem conter metadados contendo tempo de execução, sistema operacional de teste e hash do git correspondente para evitar importação de relatórios obsoletos.

---

## 8. Human Action Registry (HAR)

O HAR é o canal seguro de comunicação e autorização entre os agentes de IA e o operador humano.

```text
[IA: Propõe ação no HAR] 
          │ (Registra no har_registry.json com secret_ref, sem valor real)
          ▼
[Humano: Recebe Alerta de Bloqueio]
          │ (Executa tarefa no mundo físico / ambiente de homologação)
          ▼
[Humano: Fornece Evidência e Assina]
          │ (Atualiza status para COMPLETED e insere hash de imagem/log)
          ▼
[IA: Valida integridade e libera pipeline]
```

* **Regras de Operação do HAR:**
  1. Qualquer agente de IA pode propor ações humanas.
  2. A IA **MUST NOT** escrever valores reais de segredos no HAR.
  3. O pipeline de testes automatizados do `Validator` **MUST** ler o arquivo `har_registry.json` e suspender qualquer verificação de transição se houver ações com status `PENDING` ou `FAILED`.

---

## 9. Função de Parada (Stopping Function)

Ao final de cada ciclo de iteração da máquina de estados, o protocolo executa a avaliação das condições de parada para retornar um dos seguintes estados de controle ao orquestrador:

1. **CONTINUE:** O repositório possui gaps ativos na sprint e as invariantes estão saudáveis. IA pode continuar a execução.
2. **PAUSE:** O pipeline foi interrompido temporariamente para aguardar conclusões assíncronas do Truth Engine.
3. **BLOCKED:** Ocorreu falha de invariante crítica, violação de autoridade ou circuit breaker de provider acionado. Nenhuma ação pode ser executada até a limpeza manual do erro.
4. **HUMAN_REVIEW:** A máquina de estados exige validação ou assinatura manual do operador humano no HAR ou em decisões de ADR.
5. **RELEASE_CANDIDATE:** Todos os gaps da sprint foram fechados e as evidências estão consolidadas. Pronto para homologação.
6. **COMPLETE:** A sprint foi integrada com sucesso, o ledger foi atualizado em append-only e as Skills foram consolidadas. O ciclo é encerrado.
7. **NO_ACTION_REQUIRED:** O estado observado atual é idêntico ao estado alvo planejado. Nenhuma mutação de código é necessária.
8. **RISK_EXCEEDS_VALUE:** O indicador de risco compilado no `risk-assessment` excede a margem de segurança configurada nas políticas constitucionais.

---

## 10. Orçamento de Mudança (Change Budget)

Para evitar que a IA gere código descontrolado, cause bundle bloat ou realize refatorações de escopo excessivo que inviabilizam a auditoria humana, o protocolo impõe limites quantitativos rígidos chamados **Change Budgets**:

```text
+----------------------------+-----------------------+
| Métrica                    | Limite Máximo/Sprint  |
+----------------------------+-----------------------+
| Total de arquivos alterados| 10 arquivos           |
| Linhas de código alteradas | 500 linhas            |
| Dependências adicionadas   | 2 dependências        |
| Migrações de banco de dados| 1 migração            |
| Tentativas de compilação   | 5 tentativas          |
+----------------------------+-----------------------+
```

* **Estouro de Orçamento:** Caso qualquer uma das métricas seja excedida durante a modelagem da hipótese (`proposed-changeset`), o sistema **MUST NOT** escrever o código. Ele deve abortar a tarefa ativa e transicionar para `HUMAN_REVIEW` com o erro `POLICY_VIOLATION`.

---

## 11. Códigos de Erro

O protocolo normatiza a seguinte taxonomia de erros para guiar o diagnóstico e a atuação dos agentes de recuperação:

* **AUTHORITY_VIOLATION:** Um papel tentou alterar um artefato fora de seu escopo de escrita permitido ou realizar uma transição sem autorização.
* **MISSING_EVIDENCE:** Tentativa de transicionar de estado sem o `evidence-bundle` correspondente ou com evidências expiradas.
* **HUMAN_ACTION_REQUIRED:** Bloqueio operacional devido a ações pendentes no HAR.
* **POLICY_VIOLATION:** Estouro de Change Budget ou tentativa de inclusão de dependências não autorizadas.
* **ARCHITECTURE_CONFLICT:** A mutação proposta quebra regras de comunicação ou componentização definidas na `target-architecture`.
* **STATE_TRANSITION_INVALID:** Tentativa de pular estados na máquina de estados da evolução.
* **SECRET_EXPOSURE_RISK:** Detecção de credenciais expostas nos arquivos de plano ou no HAR.
* **CONTEXT_INSUFFICIENT:** Tentativa de compactação de memória que removeu referências para fontes originais.
* **VALIDATION_FAILED:** Testes automatizados ou linter retornaram erros durante a validação no Truth Engine.
* **ROLLBACK_REQUIRED:** Falha após deploy em produção, exigindo a reversão imediata de commits.

---

## 12. Compatibilidade e Extensibilidade

O AG47 Evolution Protocol foi projetado como um núcleo normativo e abstrato. A integração com ecossistemas práticos é realizada por meio de adaptadores periféricos:

```text
[Evolution Core (Normativo)]
          │
          ├───────► [Skills Adapter] ──────► (Next.js, Python, Rust, Go, etc.)
          ├───────► [Provider Adapter] ────► (GitHub API, Git local, GitLab)
          └───────► [Runtime Adapter] ─────► (Vercel, Docker, AWS, GCloud)
```

* **Skills:** Novas linguagens ou frameworks de codificação entram como Skills modulares, precisando respeitar apenas o esquema de entrada/saída do catalogo de competências.
* **Adapters e Providers:** O acesso ao Git, execução de testes no terminal ou chamadas de API de LLMs são realizados por provedores desacoplados. Se a infraestrutura mudar (ex: migração de GitHub para GitLab ou de Gemini para outro modelo), o núcleo do protocolo permanece intocado.
