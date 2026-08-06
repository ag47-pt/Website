# Roadmap e Próximos Sprints

Abaixo está o registro histórico da nossa cadência e as tarefas já mapeadas para os próximos Sprints.

## Sprints Executados

- **Sprint 1**: Base UI/API e Dashboard fundamental.
- **Sprint 2**: Timeline, Event Sourcing, Ingestion loop e Isolamento de Componentes (Endurecimento).
- **Sprint 3**: Auditoria de Performance, Invariantes, Idempotência e Testes de Concorrência sob carga.
- **Sprint 4**: Motor Epistemológico Invisível (`Knowledge Engine`, `Hypothesis`, `Validation`).
- **Sprint 5**: Motor de Edge Estatístico & Performance Analytics (buckets de score, confiança, out-of-sample).
- **Sprint 6**: Conectividade Live & Real Providers (Integração real RugCheck, Helius RPC, GoPlus EVM Holders e Telegram Bot API).
- **Sprint 7**: Infraestrutura de Produção e Ingestão Contínua (PostgreSQL + asyncpg, retries de concorrência, suite de testes de estresse com 50 requisições simultâneas e background scheduler).

---

## Próximos Sprints (Fila de Execução)

### Sprint 8: Alertas Determinísticos de Edge & Inbox do Operador (Próximo Ciclo)

> **Objetivo:** Entregar sinais acionáveis baseados estritamente em Edge provado.

- Disparo de alertas acionados **exclusivamente** quando a taxa de acerto estatística histórica do bucket for $\ge 65\%$ com drawdown aceitável.
- UI: Painel de "Inbox de Oportunidades com Edge" e Matriz de Correlação Score vs Resultado Real.

---

> _Lembrete Crítico:_ Nenhum item desta lista autoriza armazenamento de seed phrase, chave privada ou automação de disparo e execução autônoma de trades. O radar é um Lóbulo Observacional e preditivo, nunca um robô de ordens de mercado.    


