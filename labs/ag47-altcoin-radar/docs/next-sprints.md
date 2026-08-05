# Roadmap e Próximos Sprints

Abaixo está o registro histórico da nossa cadência e as tarefas já mapeadas para os próximos Sprints.

## Sprints Executados

- **Sprint 1**: Base UI/API e Dashboard fundamental.
- **Sprint 2**: Timeline, Event Sourcing, Ingestion loop e Isolamento de Componentes (Endurecimento).
- **Sprint 3**: Auditoria de Performance, Invariantes, Idempotência e Testes de Concorrência sob carga.
- **Sprint 4**: Motor Epistemológico Invisível (`Knowledge Engine`, `Hypothesis`, `Validation`).

---

## Próximos Sprints (Fila)

### Sprint 5: Alertas Determinísticos (O Foco Atual)
- Construir a infraestrutura dos Alertas que dependem do `Knowledge Engine`.
- Alertas acionados **apenas** após verificação de Confidence/Força dos Sinais.
- Regras configuráveis e entrega básica em Interface Web/Webhooks.
- Criação dos layouts de "Caixa de Entrada" (Inbox de Sinais Fortes) e timeline explicável para o usuário.

### Sprints Futuros: Expansão de Inteligência
- Telegram real com credenciais autorizadas, consentimento e limites documentados.
- Análise avançada de bytecode/contratos por chain.
- Integrar _Holder Provider_ real, mapenado clusters de carteiras baleia.
- Plugar Job Scheduler real via `apscheduler` e filas.
- Calibração avançada do score a longo prazo.

### Sprints Futuros: Plataforma
- Autenticação, perfis, RBAC e preferências por operador.
- Observabilidade, SLOs, métricas e tracing (Grafana, Sentry, Prometheus).
- Integração plena da camada do Radar à interface de orquestrador do **Organismo Cognitivo** (consumo Cross-LLM da base de Knowledge).

> *Lembrete Crítico:* Nenhum item desta lista autoriza armazenamento de seed phrase, chave privada ou automação de disparo e execução autônoma de trades. O radar é um Lóbulo Observacional, nunca um robô de ordens de mercado.
