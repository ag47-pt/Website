# PROTOCOL_TRANSITION_MATRIX.md

# AG47 Evolution Protocol: Matriz de Transição de Estados
**Versão:** 1.0.0  
**Status:** Normativo / Finalizado para Fase 3A  
**Domínio:** Engenharia de Software Geral  

---

Esta matriz especifica as condições de transição de estado da máquina de estados do **AG47 Evolution Protocol**. Cada linha representa uma transição autorizada, definindo atores, insumos, evidências exigidas, políticas e mecanismos de tratamento de erro.

---

## 📊 Matriz de Transições de Estado

| Origem | Evento | Destino | Ator Autorizado | Artefato de Entrada | Evidência Necessária | Política Aplicável | Falhas Possíveis | Rollback |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **NONE** | `GAP_DETECTED` | **PROPOSED** | `Observer` | `system_snapshot.json` | Relatório de discrepância entre As-Is e target. | **Constituição:** Análise de não-objetivos. | `CONTEXT_INSUFFICIENT` | N/A (Descarte simples do Gap). |
| **PROPOSED** | `PLAN_APPROVED` | **APPROVED** | `HumanOperator` | `proposed_changeset.json` | Assinatura digital/manual do operador em plano. | **Constituição:** Limites de autonomia verificados. | `AUTHORITY_VIOLATION`, `ARCHITECTURE_CONFLICT` | Transiciona para `REJECTED`. |
| **APPROVED** | `TASK_START` | **IN_PROGRESS** | `Executor` | `active-task.json` | Marcação de início da tarefa no registro JSON. | **Change Budget:** Início da contagem de alterações. | `STATE_TRANSITION_INVALID` | Transiciona de volta para `APPROVED`. |
| **IN_PROGRESS** | `MUTATION_COMPLETED` | **IMPLEMENTED** | `Executor` | Código-fonte modificado | Diff gerado do Git + testes unitários criados. | **Change Budget:** Linhas e arquivos alterados $\le$ limite. | `POLICY_VIOLATION`, `SECRET_EXPOSURE_RISK` | Reverte edições locais (limpeza da branch local). |
| **IMPLEMENTED** | `TESTS_PASSED` | **TESTED** | `Validator` | `integrity_verdict.json` | 100% testes unitários/integrados passando sem mock ilegal. | **Invariantes Globais:** Executor $\ne$ Validador. | `VALIDATION_FAILED`, `MISSING_EVIDENCE` | Transiciona para `REGRESSION`. |
| **REGRESSION** | `REWORK_REQUESTED` | **APPROVED** | `Validator` / `Guardian` | Relatório de falha de teste | Logs de testes falhos indexados na tarefa. | **Políticas:** Registro histórico do erro de regressão. | `STATE_TRANSITION_INVALID` | N/A (Re-execução do ciclo). |
| **TESTED** | `SIGN_OFF_SUCCESS` | **VERIFIED** | `HumanOperator` | `har_registry.json` | 100% pendências do HAR resolvidas e assinadas. | **Invariantes Globais:** Nenhuma ação humana simulada. | `HUMAN_ACTION_REQUIRED`, `SECRET_EXPOSURE_RISK` | Transiciona para `HUMAN_REVIEW` (Bloqueio). |
| **VERIFIED** | `RC_COMPILED` | **RELEASE_CANDIDATE** | `ReleaseManager` | Pacote de alterações | Testes integrados E2E concluídos com sucesso. | **Políticas:** Nenhuma regressão de integração. | `VALIDATION_FAILED`, `AUTHORITY_VIOLATION` | Reverte branches integradas para último commit estável. |
| **RELEASE_CANDIDATE** | `DEPLOY_SUCCESS` | **MERGED** | `ReleaseManager` | `sprint_ledger.json` | Logs de deploy de produção + hashes verificados. | **Políticas:** Circuit breakers fechados. | `ROLLBACK_REQUIRED` | Aciona rollback automático do deploy (estado `ROLLED_BACK`). |
| **MERGED** | `KNOWLEDGE_SAVED` | **CLOSED** | `KnowledgeCurator` | `active-summary.md` | Metadados consolidados no ledger + Skills refinadas. | **Invariantes Globais:** Preservar fontes na compactação. | `CONTEXT_INSUFFICIENT` | N/A (Alterações consolidadas). |
| **ROLLED_BACK** | `CLEANUP_COMPLETED` | **APPROVED** | `ReleaseManager` | logs de reversão | Confirmação física do restabelecimento do Git. | **Políticas:** Relatório de incidente registrado no ledger. | `STATE_TRANSITION_INVALID` | N/A (Trava pipeline para ação humana). |

---

## 🚫 Matriz de Transições de Exceção (Bloqueios)

| Origem | Evento | Destino | Ator Autorizado | Artefato de Entrada | Evidência Necessária | Política Aplicável | Falhas Possíveis | Rollback |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Qualquer Estado** | `CRITICAL_VIOLATION` | **REJECTED** | `Guardian` / `Humano` | Relatório de violação | Assinatura de quebra constitucional ou arquitetural. | **Constituição:** Proteção contra desvio de missão. | `AUTHORITY_VIOLATION` | Limpeza de alterações e arquivamento do changeset. |
| **Qualquer Estado** | `INVARIANT_BROKEN` | **HUMAN_REVIEW** | `Validator` / `Observer` | `har_registry.json` | Logs de colisão de verdades ou ações pendentes. | **Invariantes Globais:** Bloqueio imediato do pipeline. | `STATE_TRANSITION_INVALID` | N/A (Requer mediação manual). |
| **IN_PROGRESS** | `RESOURCE_BLOCKED` | **BLOCKED** | `Executor` / `Observer` | Logs de infraestrutura | Falha de conectividade ou circuito breaker aberto. | **Políticas:** Timeout excedido de ferramentas. | `CONTEXT_INSUFFICIENT` | Liberação do lock de tarefa ativa. |
