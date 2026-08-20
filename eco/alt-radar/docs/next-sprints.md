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
- **Sprint 11**: Webhook Outbound Assinado, Painel Multi-Chain e Exportação Epistemológica (envio de webhooks HMAC assinados via API, visualização multi-chain no dashboard e exportação de dataset epistemológico em JSON/CSV).
- **Sprint 12**: Simulação de Carteira Virtual Observacional & Análise de Portfólio (Implementação da carteira Paper Trading Read-Only e dashboard de Métricas de Performance Teórica).
- **Sprint 12.5**: Social Provider Pré-Produção (Implementação híbrida `TelegramPublicSocialProvider`, fachada de roteamento `RoutingSocialProvider`, observabilidade em `ProviderRegistry` e testes automatizados).
- **Sprint 13**: Otimização de Parâmetros via Grid Search (Varredura determinística offline de parâmetros de scoring, endpoints de recomendação e página do Laboratório em Next.js 16).


---

## Próximos Sprints (Fila de Execução)

> **Status Atual:** Todos os Sprints mapeados (1 a 13) foram concluídos com sucesso. Novos Sprints podem ser propostos conforme a evolução do sistema.

---

## Etapa Atual: Hardening 1

O produto está em beta pública funcional. A etapa atual não adiciona execução financeira nem amplia o escopo de funcionalidades; ela transforma a implementação existente numa operação verificável e reproduzível.

### Gates de conclusão

- [x] A UI e o proxy distinguem dados live, demo, degradados e indisponíveis sem fabricar sucesso.
- [x] A ingestão periódica roda como job singleton durável, fora do ciclo de vida das réplicas HTTP.
- [x] Lint, tipos, testes e build passam no checkout atual.
- [x] CI e automação de deploy ficam válidos e bloqueiam publicação quando os gates falham.
- [ ] A revisão é publicada e verificada em produção com evidência de sincronização recente.

> **Limite desta execução:** os quatro primeiros gates podem ser preparados e validados localmente. O quinto depende de autorização separada para push e deploy.

---

> _Lembrete Crítico:_ Nenhum item desta lista autoriza armazenamento de seed phrase, chave privada ou automação de disparo e execução autônoma de trades. O radar é um Lóbulo Observacional e preditivo, nunca um robô de ordens de mercado.

