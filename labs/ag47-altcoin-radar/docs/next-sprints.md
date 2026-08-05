# Roadmap e Próximos Sprints

Abaixo está o registro histórico da nossa cadência e as tarefas já mapeadas para os próximos Sprints.

## Sprints Executados

- **Sprint 1**: Base UI/API e Dashboard fundamental.
- **Sprint 2**: Timeline, Event Sourcing, Ingestion loop e Isolamento de Componentes (Endurecimento).
- **Sprint 3**: Auditoria de Performance, Invariantes, Idempotência e Testes de Concorrência sob carga.
- **Sprint 4**: Motor Epistemológico Invisível (`Knowledge Engine`, `Hypothesis`, `Validation`).
- **Sprint 5**: Motor de Edge Estatístico & Performance Analytics (buckets de score, confiança, out-of-sample).
- **Sprint 6**: Conectividade Live & Real Providers (Integração real RugCheck, Helius RPC, GoPlus EVM Holders e Telegram Bot API).

---

## Próximos Sprints (Fila de Execução)

### Sprint 7: Infraestrutura de Produção e Ingestão Contínua (Próximo Ciclo)

> **Objetivo:** Garantir concorrência, persistência resiliente e execução autônoma.

- Migração do banco de dados de SQLite para **PostgreSQL + `asyncpg`**.
- Ativação do Job Scheduler em background (`AG47_SCHEDULER_ENABLED=true`, ciclo de 300s).
- Coleta automática contínua de pares, pontuação, geração de hipóteses e auditoria pelo Truth Engine.

### Sprint 8: Alertas Determinísticos de Edge & Inbox do Operador

> **Objetivo:** Entregar sinais acionáveis baseados estritamente em Edge provado.

- Disparo de alertas acionados **exclusivamente** quando a taxa de acerto estatística histórica do bucket for $\ge 65\%$ com drawdown aceitável.
- UI: Painel de "Inbox de Oportunidades com Edge" e Matriz de Correlação Score vs Resultado Real.

---

> _Lembrete Crítico:_ Nenhum item desta lista autoriza armazenamento de seed phrase, chave privada ou automação de disparo e execução autônoma de trades. O radar é um Lóbulo Observacional, nunca um robô de ordens de mercado.
