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
- **Sprint 8**: Alertas Determinísticos de Edge & Inbox do Operador (disparo baseado em Edge estatístico $\ge 65\%$, suspensão por Drawdown, Inbox do Operador e Matriz de Correlação Score vs Resultado Real no frontend Next.js 16).
- **Sprint 9**: Calibração Dinâmica de Scoring & Fila de Notificações de Produção (pesos de scoring calibrados via backtest dinâmico, envio de alertas de Edge Confirmado via Telegram em segundo plano com retry exponencial e circuit breakers, visualização e reset manual de Circuit Breakers na UI Next.js 16).
- **Sprint 10**: Filtros Avançados de Alerta, Explicabilidade de Score e Histórico de Notificações (configuração de regras de notificação por severidade/confiança/rede, breakdown explicável dos componentes de scoring na Inbox, painel de histórico de entregas com logs e erros HTTP na UI Next.js 16).

---

## Próximos Sprints (Fila de Execução)

### Sprint 11: Webhook Outbound Assinado, Painel Multi-Chain e Exportação Epistemológica (Próximo Ciclo)

> **Objetivo:** Expandir os canais de notificação do radar via Webhooks HTTP customizados (Discord, Slack, n8n) assinados via HMAC SHA-256, oferecer o painel de integridade multi-chain por ecossistema de blockchain e permitir exportar datasets epistemológicos em JSON/CSV.

- **Webhook Outbound HTTP Assinado:** Despachador de Webhooks assíncrono genérico com assinatura `X-AG47-Signature` (HMAC SHA-256), retries e configuração visual no painel `/configuracoes`.
- **Painel de Saúde Multi-Chain:** Endpoint `GET /api/v1/system/chains/status` e visualização matricial por rede (Solana, Ethereum, Base, Arbitrum, BSC) de latência, taxa de erro e volume rastreado.
- **Exportador Epistemológico (JSON/CSV):** Endpoint `GET /api/v1/system/export/truth-dataset` e botão de download na UI para auditoria out-of-sample off-line.

### Sprint 12: Simulação de Carteira Virtual Observacional & Análise de Portfólio (Fase Futura)

> **Objetivo:** Permitir ao operador acompanhar o desempenho teórico de estratégias baseadas nos alertas de Edge sem qualquer integração com carteiras reais ou execução de ordens.

- **Carteira Paper Trading Read-Only:** Simulação de entradas e saídas virtuais calculadas estritamente com base nos preços históricos do *Truth Engine*.
- **Métricas de Performance Teórica:** Gráficos de curva de equidade virtual, Profit Factor teórico e Max Drawdown simulado.

---

> _Lembrete Crítico:_ Nenhum item desta lista autoriza armazenamento de seed phrase, chave privada ou automação de disparo e execução autônoma de trades. O radar é um Lóbulo Observacional e preditivo, nunca um robô de ordens de mercado.
