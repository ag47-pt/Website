# Relatório do Sprint 2

## Resumo Executivo

O Sprint 2 focou na auditoria e consolidação do núcleo operacional mínimo do Radar. Durante a auditoria, identificamos que a fundação (Modelos de Ativo, Providers Abstraídos, Ingestão, Scoring e Watchlist) já havia sido implementada no repositório com grande aderência aos requisitos. O foco deste sprint foi, portanto, formalizar a documentação de scoring exigida, e garantir que a interface (Web) possuísse a cobertura de testes necessária para garantir resiliência, validação e qualidade.

## Implementações e Entregas

- Formalização do documento de regras de scoring determinístico em `docs/scoring-v1.md`.
- Adição de testes de interface críticos (`opportunities-view.test.tsx`), assegurando a lógica de listagem, ordenação, e iterações de UI da watchlist.
- Execução plena do fluxo de qualidade e correção das pendências de linting, garantindo que o comando unificado (`npm run verify`) concluísse com sucesso.

## Arquivos Principais Modificados/Criados

- **Criados:** `docs/sprint-2-audit.md`, `docs/sprint-2-plan.md`, `docs/sprint-2-report.md`.
- **Renomeado:** `docs/scoring-model.md` para `docs/scoring-v1.md`.
- **Criados:** `apps/web/components/opportunities/opportunities-view.test.tsx` (Teste da listagem principal e interações da watchlist).

## Decisões Arquiteturais e Limitações

- **Decisão:** Manter a implementação estrutural original do Sprint 1 (FastAPI + Next.js), dada a funcionalidade comprovada.
- **Decisão:** Usar `vitest` e `@testing-library/react` para injetar os mocks do `radarApi` (`useOpportunities`) e testar as renderizações locais, isolando da API real.
- **Limitações:** O pipeline de ingestão real ainda depende do schedule unificado, sendo inseguro para instâncias escaladas. Testes exaustivos do backend de ingestão e providers foram aceitos como escopo futuro.

## Riscos

- **Risco Técnico:** Providers da demonstração não suportam escalonamento real. Testes e uso contínuo apontam para a necessidade iminente de chaves (API Keys) de provedores reais para `holders` e `risk_score`.
- O scoring determinístico atual é puramente heurístico.

## Testes Executados e Resultados

- **Comandos:** `npm run verify` que executa:
  - `npm run format:check`
  - `npm run lint` (Frontend e Backend)
  - `npm run typecheck` (tsc e mypy)
  - `npm run test` (Vitest e Pytest)
  - `npm run build`
- **Resultados:** Todos os processos rodam com sucesso e sem falhas nos assertions base.

## Pendências e Recomendações para o Sprint 3

- **Sprint 3 - Proposta:**
  - Separar o scheduler em um worker dedicado e integrar sistema de locks distribuídos (ex. Redis).
  - Integrar pelo menos um provider de "Risco" e "Social" com credenciais reais, reduzindo dependência da "demo".
  - Implementar virtualização nas tabelas e gráficos históricos mais complexos usando Recharts, como o backend já suporta no MarketSnapshot.
