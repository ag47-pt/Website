# Plano do Sprint 7: Infraestrutura de Produção e Ingestão Contínua

## Objetivo Principal

> **Garantir a concorrência assíncrona, persistência resiliente em produção e a execução autônoma do ciclo observacional (Discovery -> Ingestion -> Evaluation -> Truth Engine).**

O Sprint 7 transiciona a persistência de um banco de dados local SQLite de desenvolvimento para uma infraestrutura pronta para produção baseada em **PostgreSQL** assíncrono (usando a biblioteca `asyncpg`). Adicionalmente, ativa o **Job Scheduler** em background para permitir que o ciclo observacional do radar aconteça de forma contínua e automatizada 24/7.

---

## 🎯 Pilares de Implementação

### Pilar 1: Suporte Completo a PostgreSQL & Pool de Conexões em Produção

Para suportar carga em produção e múltiplas conexões simultâneas assíncronas, o executor deve introduzir parâmetros de pool do SQLAlchemy no módulo de configurações e no `.env.example`.

1. **Variáveis a serem adicionadas em `apps/api/src/ag47_radar/config.py`:**
   * `database_pool_size: int = Field(default=20, ge=5, le=100)`
   * `database_max_overflow: int = Field(default=10, ge=0, le=50)`
   * `database_pool_timeout: float = Field(default=30.0, ge=1.0, le=120.0)`

2. **Adaptação em `apps/api/src/ag47_radar/db.py`:**
   * Passar os parâmetros de pool para `create_async_engine` apenas quando a conexão for PostgreSQL:
     ```python
     if not url.startswith("sqlite+"):
         kwargs["pool_size"] = settings.database_pool_size
         kwargs["max_overflow"] = settings.database_max_overflow
         kwargs["pool_timeout"] = settings.database_pool_timeout
     ```

3. **Validação do Alembic:**
   * Executar e testar todas as 7 revisões de migrações existentes (`alembic upgrade head`) contra uma instância local do PostgreSQL (disponível via docker-compose) para garantir que todas as estruturas DDL sejam compatíveis (ex: tipos JSON, UUID e constraints de concorrência).

---

### Pilar 2: Robustez Concorrente & Prevenção de Deadlocks

Dado que o PostgreSQL opera sob controle rigoroso de concorrência (MVCC) e múltiplos jobs assíncronos tentarão ler/gravar simultaneamente, o Truth Engine e o Ingestion Loop precisam ser robustos contra conflitos.

1. **Criação de Teste de Stress de Concorrência (`tests/test_concurrency_stress.py`):**
   * Usar `asyncio.gather` para disparar 50 requisições simultâneas de gravação/leitura de hipóteses e retrospectivas.
   * Forçar cenários de concorrência onde a mesma entidade de token/hipótese seja auditada ou modificada concorrentemente.

2. **Mitigação no Back-end:**
   * Utilizar cláusulas transacionais seguras e retries automáticos no back-end para falhas do tipo `SerializationError` ou erros de concorrência do `asyncpg` (ex: código de erro PostgreSQL `40001` ou `40P01`).
   * Adicionar índices de banco compostos nas chaves mais lidas do Truth Engine para acelerar queries e reduzir lockups de tabelas inteiras:
     * Índice composto em `token_snapshots` nas colunas `(token_id, created_at)`.
     * Índice composto em `hypotheses` nas colunas `(status, created_at)`.

---

### Pilar 3: Ingestão Contínua via Background Scheduler

Com o banco robusto e migrado, o agendamento de ingestão em background passará de puramente sob demanda (via CLI) para contínuo na API de produção.

1. **Ativação por Ambiente:**
   No ambiente de produção (`.env`), configurar:
   ```env
   AG47_DEMO_MODE=false
   AG47_SCHEDULER_ENABLED=true
   AG47_SCHEDULER_INTERVAL_SECONDS=300
   ```
2. **Ciclo de Operação:**
   * O `lifespan` do FastAPI iniciará o APScheduler de forma transparente.
   * A cada 5 minutos, a tarefa `_scheduled_ingestion` rodará de forma isolada, extraindo novos snapshots de mercado de Solana/EVM, pontuando, armazenando hipóteses e disparando alertas.
   * O Truth Engine revisará as hipóteses vencidas anteriores de modo determinístico a cada ciclo.

---

## 🛠️ Roteiro Passo a Passo de Execução

### Fase A: Infraestrutura & Docker Compose
1. Garantir que um serviço PostgreSQL esteja rodando localmente para testes. O `docker-compose.yml` da raiz deve expor uma instância dev (ex: porta 5432) isolada.
2. Atualizar o `apps/api/.env.example` e documentar a string de conexão de produção.

### Fase B: Código de Configuração & Banco
1. Modificar [`config.py`](file:///c:/Users/moise/Desktop/Agencia47/DEV/DEVELOPING/SANDBOX/Ag47.pt/labs/ag47-altcoin-radar/apps/api/src/ag47_radar/config.py) para incluir os parâmetros de pool size/overflow.
2. Modificar [`db.py`](file:///c:/Users/moise/Desktop/Agencia47/DEV/DEVELOPING/SANDBOX/Ag47.pt/labs/ag47-altcoin-radar/apps/api/src/ag47_radar/db.py) para aplicar essas variáveis ao `create_async_engine`.
3. Rodar as migrações locais contra o PostgreSQL:
   ```bash
   alembic upgrade head
   ```

### Fase C: Blindagem de Concorrência & Testes
1. Criar `apps/api/tests/test_concurrency_stress.py` simulando cargas massivas de updates assíncronos.
2. Resolver conflitos transacionais injetando tratamento de erros de lock do SQLAlchemy/asyncpg com retries rápidos (backoff exponencial de milissegundos).

### Fase D: Integração com UI & Deploy
1. Atualizar a UI para assegurar que se o backend retornar latência devido a concorrência, componentes de carregamento dinâmicos e skeleton loaders previnam falhas visuais.
2. Rodar a suite completa de qualidade antes de liberar:
   ```bash
   python .agent/scripts/checklist.py .
   ```

---

## 🤖 Guia de Orientação e Checklist para o Agente Executor

### 1. Estado Atual e Blocos Preparatórios já Implementados
O agente instrutor preparou a base do Sprint 7 com os seguintes blocos principais:
- **Pool & Rebind:** `apps/api/src/ag47_radar/config.py` e `db.py` já possuem suporte às variáveis `database_pool_size`, `database_max_overflow` e `database_pool_timeout`.
- **Mecanismo de Retries:** `run_transaction_with_retry()` implementado em `db.py` com backoff exponencial para tratar `40001` (Serialization Failure), `40P01` (Deadlock) e locks de SQLite/PostgreSQL.
- **Idempotência no Truth Engine:** Deduplicação preventiva antes da inserção em `evaluate_single_hypothesis()` e `run_truth_engine()` em `truth_engine.py`.
- **Indexação Composicional:** Índice `ix_truths_status_created` adicionado no modelo `TokenTruth` em `models.py`.
- **Scheduler Integrado com Retries:** `_scheduled_ingestion` em `scheduler.py` adaptado para rodar via `run_transaction_with_retry`.

### 2. Tarefas Restantes a Serem Concluídas pelo Executor
1. **Testes de Estresse Concorrente (`apps/api/tests/test_concurrency_stress.py`):**
   - Criar arquivo de teste que utiliza `asyncio.gather` para disparar 50 requisições simultâneas de gravação/leitura de hipóteses e retrospectivas contra o banco de dados.
   - Garantir que todas as 50 execuções completem sem exceção não tratada ou estado inconsistente.
2. **Validação de Migrações do Alembic:**
   - Confirmar que as 7 revisões de migração funcionam sem conflitos via `alembic upgrade head`.
3. **Execução e Aprovação Total dos Testes:**
   - Rodar a suíte de testes com `.\.venv\Scripts\python -m pytest` e verificar 100% de aprovação.
4. **Auditoria de Qualidade:**
   - Rodar `python .agent/scripts/checklist.py .` para validar conformidade do projeto antes da conclusão do Sprint.

---

> **Regra Absoluta (P0):** O radar continua estritamente read-only em relação às blockchains. Não criar chaves privadas, não assinar transações nem gerenciar carteiras.

