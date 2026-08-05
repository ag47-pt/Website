# Próximos sprints

Itens registrados, mas deliberadamente não implementados no Sprint 1:

## Dados e análise

- Telegram real com credenciais autorizadas, consentimento e limites documentados.
- Análise avançada de bytecode/contratos por chain.
- Holder provider real, clusters e evolução de concentração.
- Backfill OHLCV e backtesting versionado do scoring.
- Calibração do score com resultados observados, sem machine learning prematuro.

## Alertas e operação

- Entrega externa por email, Slack, Telegram ou webhook assinado.
- Regras configuráveis por utilizador e horários de silêncio.
- Journal de investigação/operações e notas auditáveis.
- Motor de saída e acompanhamento pós-observação.
- Execução assistida com confirmação humana, somente após desenho de segurança e compliance.

## Plataforma

- Autenticação, perfis, RBAC e preferências por operador.
- Worker distribuído, Redis, filas e locks.
- Observabilidade, SLOs, métricas e tracing.
- Paginação keyset e agregações de alta cardinalidade.
- Integração futura com o Organismo Cognitivo, após contrato e autorização explícitos.

Nenhum item desta lista autoriza armazenamento de seed phrase, chave privada ou execução autônoma de trades.
