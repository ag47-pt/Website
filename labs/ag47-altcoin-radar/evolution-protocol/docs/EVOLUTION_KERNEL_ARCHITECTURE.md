# Evolution Kernel Architecture

O Evolution Kernel é o motor determinístico do AG47 Evolution Protocol. Ele não cria, não pensa e não corrige. Ele apenas avalia fatos (artefatos) contra leis (schemas e policies) e julga transições de estado (`ALLOW` ou `DENY`).

Este documento estabelece o design técnico deste motor.

## 1. Responsabilidades dos Módulos

O Kernel é composto por módulos altamente especializados e desacoplados, desenhados para agir como fiscais em uma cadeia de custódia.

### 1.1 `artifact_registry`
- **Responsabilidade:** Indexação, resolução e verificação criptográfica de integridade.
- **Pergunta que responde:** *"Esse artefato existe? Qual sua versão? O conteúdo bate com o hash?"*
- **Comportamento:** Atua como um cartório. Não analisa o mérito do conteúdo, apenas sua existência, conformidade com o formato JSON Schema 2020-12, e imutabilidade estrutural.

### 1.2 `state_machine`
- **Responsabilidade:** Controle rigoroso dos ciclos de vida de tarefas (`active-task`).
- **Pergunta que responde:** *"A transição de estado requisitada é legal na topologia do workflow atual?"*
- **Comportamento:** Bloqueia avanços arbitrários (ex: `PENDING_APPROVAL` direto para `COMPLETED`). Exige os inputs corretos (como um `verdict` para passar para `VERIFIED`).

### 1.3 `policy_engine`
- **Responsabilidade:** Fiscalização de regras de negócio, limites operacionais e papeis.
- **Pergunta que responde:** *"Mesmo que a transição seja tecnicamente possível na State Machine, as leis de governança (Policies) permitem que este ator específico faça isso sob estas condições?"*
- **Comportamento:** Barra, por exemplo, a alteração de arquivos confidenciais ou a subida para produção sem aprovação humana, mesmo que o JSON seja perfeitamente válido.

### 1.4 `validator`
- **Responsabilidade:** Checagem de vínculo lógico entre a intenção, a execução e as evidências.
- **Pergunta que responde:** *"As evidências empacotadas no `evidence-bundle` sustentam a alegação de sucesso reportada no `execution-report`?"*
- **Comportamento:** O Validator **não roda testes nem lint**. Ele lê o resultado reportado e garante que a semântica da regra condiz com a evidência exigida. O executor da IA cria a evidência; o Validator verifica se a evidência atende ao critério de aprovação. E crucialmente: checa conflito de interesses (ex: Executor != Validator).

### 1.5 `evidence_engine` & `knowledge_engine`
- **Responsabilidade:** Gestão do ciclo de fechamento. O `evidence_engine` garante que todo relatório de execução tenha um pacote de evidências amarrado. O `knowledge_engine` assegura que nenhum conhecimento seja promovido sem um `integrity-verdict` positivo aprovado pelo Validator.
- **Perguntas:** *"Consigo provar o que afirmo?"*, *"Isso merece virar memória permanente do sistema?"*

### 1.6 `cli`
- **Responsabilidade:** Interface determinística de linha de comando.
- **Comandos base:**
  - `evolution inspect`: Retorna o estado de integridade de um pacote evolutivo.
  - `evolution transition <target_state>`: Solicita a passagem de estado, devolvendo a resposta das engines.

## 2. Contratos Entre Módulos (Data Flow)

O fluxo de dados segue um "Gate Pattern". Uma requisição de mudança não é processada simultaneamente, ela passa por eclusas de segurança:

1. **Entrada (`cli`)** solicita uma transição para um artefato (ex: `execution-report.json`).
2. **`artifact_registry`** carrega o arquivo, valida o schema JSON correspondente, resolve as dependências via `$ref` e valida os hashes (Integrity Check). Se falhar -> `DENY (INVALID_SCHEMA_OR_HASH)`.
3. **`state_machine`** checa se o artefato vinculado (ex: `active-task`) está no estado correto para receber este relatório. Se falhar -> `DENY (INVALID_STATE_TRANSITION)`.
4. **`policy_engine`** avalia as restrições impostas pelos schemas de Governança. (Ex: o ator descrito no report possui a Capability necessária? O changeset afetou apenas arquivos permitidos?). Se falhar -> `DENY (POLICY_VIOLATION)`.
5. **`validator`** realiza as checagens finais de conflito de interesses e semântica de evidência. Se falhar -> `DENY (EVIDENCE_REJECTED / CONFLICT_OF_INTEREST)`.
6. Se todos passarem, a State Machine emite um `ALLOW` e o novo estado é consolidado (escrito no JSON da `active-task` ou geração do próximo artefato da cadeia).

## 3. Dependências e Restrições

O Kernel existe para governar Inteligências Artificiais. Portanto, ele não pode depender delas. É como colocar o fiscal na folha de pagamento da empreiteira.

### 3.1 Dependências Permitidas
- Bibliotecas Python Standard (`os`, `json`, `hashlib`, `datetime`).
- Validador JSON oficial (`jsonschema` ou equivalente aderente ao Draft 2020-12).
- CLI toolkit (ex: `argparse` ou `click`).

### 3.2 Dependências Proibidas (Banidas do Runtime)
- OpenAI SDK, Anthropic SDK, Google GenAI SDK (Gemini).
- LangChain, LlamaIndex, ou qualquer Agent Framework.
- LLM API Calls de qualquer espécie.
- Integrações diretas de IDE ou Git Hooks implícitos (a menos que invocados via CLI estrita).
- Conexão com a Internet. **O Kernel opera 100% Offline.**

## 4. Estratégia de Erros (Error Model)

O Kernel nunca "tenta corrigir" um erro. Ele apenas retorna objetos de negação bem tipados.

- **`ALLOW`**: Transição ou ação autorizada.
- **`DENY`**: Transição bloqueada. Acompanhado obrigatoriamente de um `reason_code` e `details`.
  - Exemplos de Reason Codes: `SELF_VALIDATION_FORBIDDEN`, `OUT_OF_SCOPE_MUTATION`, `MISSING_VALIDATION_EVIDENCE`, `SCHEMA_VIOLATION`.
- **`REQUIRE_HUMAN`**: Interrupção temporária. A transição é tecnicamente válida, mas uma policy exige assinatura de um humano (Actor Type = `HUMAN`).
- **`INVALID_STATE`**: O artefato requisitado está numa posição impossível (ex: tentar aprovar um conhecimento sem que a task tenha sido executada).

## 5. Estrutura de Diretórios Inicial (Python)

```text
evolution-kernel/
├── src/
│   ├── evolution_kernel/
│   │   ├── __init__.py
│   │   ├── cli/               # CLI Entrypoints (evolution inspect, transition)
│   │   ├── core/
│   │   │   ├── artifact_registry.py  # Resolver, Schema Validator, Hash Checker
│   │   │   ├── state_machine.py      # Gestor de transições e invariantes
│   │   ├── engines/
│   │   │   ├── policy_engine.py      # Avaliador de regras e permissões (RBAC)
│   │   │   ├── evidence_engine.py    # Avaliador estrutural de evidências
│   │   │   ├── knowledge_engine.py   # Validador de promoção de conhecimento
│   │   ├── validators/
│   │   │   ├── integrity_validator.py # Conflito de interesses, regras cruzadas
│   ├── tests/                 # Suíte TDD garantindo as respostas adversariais
├── requirements.txt           # Apenas jsonschema, click/argparse
└── setup.py                   # Para instalação do CLI local
```
