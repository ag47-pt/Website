# Sprint 1

## Escopo

O Sprint 1 entrega descoberta, observação, scoring explicável, risco, social demonstrativo, watchlist e alertas. Ele não executa, sugere tamanho ou automatiza operações financeiras.

## Entregas

- Dashboard responsivo fiel à referência visual.
- Busca e filtros por blockchain, score, risco, idade e liquidez.
- Oportunidades ordenáveis/paginadas e seleção sem reload da página.
- Detalhe, histórico, score breakdown, comunidade, risco e procedência.
- Watchlist persistente e alertas deduplicados.
- API REST v1 e documentação OpenAPI.
- PostgreSQL/SQLite, migration inicial e seed demo coerente.
- GeckoTerminal e DexScreener atrás de providers resilientes.
- Testes unitários, integração, componentes e um fluxo E2E.
- Docker Compose e comandos locais documentados.

## Critérios de aceite rastreáveis

| Critério             | Evidência esperada                                           |
| -------------------- | ------------------------------------------------------------ |
| Inicialização local  | README, health 200 e dashboard carregado                     |
| Estrutura visual     | smoke/screenshot desktop e mobile                            |
| Busca/filtros/tabela | testes de componente e E2E                                   |
| Detalhe/score/risco  | seleção atualiza painéis e testes de scoring                 |
| Watchlist            | POST/DELETE persistem e reaparecem no GET                    |
| Alertas              | chave de dedupe suprime evento repetido na janela            |
| Provider real        | testes de contrato mockados e smoke opt-in documentado       |
| API                  | OpenAPI e testes dos endpoints principais                    |
| Migration/seed       | upgrade head e seed idempotente                              |
| Qualidade            | lint, format, typecheck, testes e build escopados            |
| Segurança            | scan de secrets do produto e ausência de execução financeira |

## Limitações conscientes

- O scheduler em processo não coordena múltiplas réplicas.
- Offset pagination será substituída por keyset se a cardinalidade exigir.
- Social, holders e risco profundo ainda são demonstração.
- Histórico live cresce somente após coletas; não há backfill inventado.
- Rate limiting é local ao processo; produção distribuída precisará Redis/gateway.
- Não há autenticação de operador neste sprint.

## Dívida técnica aceita

- Adicionar observabilidade centralizada e métricas de provider.
- Gerar tipos frontend a partir do OpenAPI para reduzir duplicação controlada.
- Separar scheduler em worker com lock distribuído.
- Executar testes de contrato periódicos contra sandboxes/providers live.
- Avaliar virtualização da tabela após medir conjuntos acima de 100 linhas por página.
