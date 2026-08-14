# AG47 Altcoin Radar — Sprint 1

## Objetivo

Entregar um radar read-only de descoberta, observação, scoring explicável e alertas, com UI fiel à referência, persistência relacional, providers desacoplados e dados demo inequivocamente identificados.

## Decisões de escopo

- Produto isolado em `labs/ag47-altcoin-radar` para não interferir no site Ag47.pt nem nos labs existentes.
- Next.js 16 + TypeScript strict no frontend e FastAPI + SQLAlchemy 2 + Alembic no backend.
- PostgreSQL como destino principal e SQLite como fallback local reproduzível.
- GeckoTerminal para descoberta real, DexScreener para busca/market data e fixtures explícitas para social/risco no Sprint 1.
- Nenhuma carteira, chave privada, transação ou recomendação automatizada de trade.

## Tarefas

- [x] Auditar Git, instruções, stack, dependências, baseline de qualidade e referência visual. Verificação: relatório somente leitura e raiz Git confirmada.
- [x] Criar scaffold, manifests, ambiente e documentação arquitetural inicial. Verificação: instalações reproduzíveis em web e API.
- [x] Implementar schema, migration, seed coerente e persistência da watchlist. Verificação: migration/seed idempotentes e consultas principais.
- [x] Implementar providers, resiliência, ingestão, scoring versionado e deduplicação de alertas. Verificação: testes unitários sem rede.
- [x] Implementar API v1 tipada, paginação, filtros, CORS, rate limit e erros seguros. Verificação: OpenAPI e testes de endpoints.
- [x] Implementar design tokens, shell responsivo, dashboard, tabela, detalhe, social, risco, alertas e watchlist. Verificação: componentes interativos e estados de dados.
- [x] Implementar páginas funcionais/estruturadas de navegação e i18n preparada em português. Verificação: nenhum link morto.
- [x] Implementar testes frontend e fluxo E2E principal. Verificação: Vitest e Playwright.
- [x] Executar lint, format, typecheck, testes, build, migrations, smoke de runtime e auditoria de segredos; corrigir falhas. Verificação: gates escopados ao Radar registrados.
- [x] Finalizar README e docs obrigatórios com limites, dívida técnica e próximos sprints. Verificação: critérios de aceite rastreáveis.

## Concluído quando

- O app inicia com comandos documentados, API e banco funcionam, os fluxos principais persistem e todos os gates verificáveis no ambiente local passam.
- Dados reais e demo nunca são misturados silenciosamente.
- O relatório final distingue o que foi implementado, testado, não verificável e deliberadamente adiado.
