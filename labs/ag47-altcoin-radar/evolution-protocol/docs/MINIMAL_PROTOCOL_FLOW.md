# Minimal Protocol Flow (End-to-End)

Este é o fluxo cronológico completo e mínimo do protocolo AG47 governando o cenário: **"Adicionar autenticação Telegram ao projeto"**.
Cada etapa demonstra a instanciação do contrato e quem interage no motor de execução.

## Cenário Simulado
**Objetivo:** Modificar o sistema para permitir login via Telegram, mantendo todas as amarras de governança.

### 1. Descoberta e Hipótese
*O Observer detecta a ausência do login.*
- **Gera:** `system-snapshot` (Estado atual do projeto).
- **Gera:** `evolution-hypothesis` (Proposta formal: "Autenticação Telegram reduz atrito").
- **Gera:** `proposed-changeset` (Define: Modificar `auth.py`, adicionar `telegram_config.json`).
- **Bloqueio (Runtime):** A Hipótese entra em estado `PENDING_REVIEW`.

### 2. Governança e Decisão
*O Motor de Políticas trava qualquer execução sem aval do guardião (Humano ou Agente Master).*
- **Ação:** Humano (ou Agente Autorizado) aprova.
- **Gera:** `human-action-record` (Assinatura atestando "Li e aprovo").
- **Gera:** `decision-context` (Registra o *porquê*: "Autenticação aprovada devido ao foco em retenção mobile").
- **Transição (Runtime):** Status muda para `EXECUTION_ALLOWED`.

### 3. Liberação e Execução
*O Executor solicita a tarefa. O Runtime valida a `capability-policy` e o `role-definition`.*
- **Gera:** `active-task` (Status: `IN_PROGRESS`).
- *Agente/Processo executa a alteração nos limites do changeset aprovado.*
- **Gera:** `execution-report` (O que foi feito, ferramentas utilizadas, erros ignorados).
- **Transição (Runtime):** Status da tarefa muda para `PENDING_VERIFICATION`.

### 4. Coleta de Evidência
*O processo empacota a prova material do trabalho.*
- **Gera:** `evidence-item` (Ex: Print da tela de login, log do teste de unidade do `auth.py`).
- **Gera:** `evidence-bundle` (Unifica os itens sob um único hash criptográfico).

### 5. Validação (Auditoria Separada)
*Outro agente (Validator) examina o trabalho contra a hipótese inicial.*
- O Runtime cruza o `evidence-bundle` e o `proposed-changeset`.
- **Gera:** `integrity-verdict` (Resultado: `PASS`. Confiança: `0.75`).
- *Condição Invariante (Runtime):* O validator UUID não pode ser o mesmo UUID do executor.

### 6. Aprendizado Contínuo (Memory Promotion)
*O Runtime identifica um `PASS` com confiança alta e promove o conhecimento.*
- **Gera:** `knowledge-entry` (Ex: "Implementar auth do telegram requer webhook port 443 exposta").
- A entrada fica no repositório de conhecimento, retroalimentando o gerador de `system-snapshot` nas próximas interações.

### Resumo do Motor
Para este fluxo ocorrer de maneira autônoma e segura, o **Evolution Core Runtime (Lote 4)** precisará de:
1. `Artifact Registry` para aceitar, validar o JSON Schema e hashear cada arquivo acima.
2. `State Machine Engine` para proibir o executor de ir direto da hipótese para a execução.
3. `Policy Engine` para barrar a validação cruzada do executor.
4. `Knowledge Promotion Engine` para transformar `integrity-verdict` em `knowledge-entry`.
