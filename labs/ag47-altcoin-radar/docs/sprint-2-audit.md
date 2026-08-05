# Auditoria do Sprint 1 (Preparação para Sprint 2)

## 3.1 Estado Técnico

- **Stack utilizada:**
  - Web: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, React Query, React Table, Recharts, Zod.
  - API: Python 3.12, FastAPI, SQLAlchemy 2, Alembic, Pydantic, APScheduler.
- **Estrutura de pastas:**
  - `apps/web`: Frontend em Next.js.
  - `apps/api`: Backend em Python (FastAPI).
  - `docs/`: Documentação arquitetural e de modelo.
- **Arquitetura atual:** Separação clara entre frontend estático/SSR e backend API REST. O backend cuida de toda ingestão e scoring.
- **Páginas e componentes existentes:**
  - Páginas para: Dashboard, Oportunidades, Alertas, Watchlist, Social, Risco.
  - Componentes focados em visualização e interação (e.g., `opportunities-view.tsx`).
- **Serviços e APIs existentes:**
  - API REST `/api/v1` ativa.
  - Serviços de ingestão (`ingestion.py`), alertas, scoring, watchlist.
- **Banco de dados:** Configurado para PostgreSQL/SQLite, usando Alembic e SQLAlchemy.
- **Autenticação:** Inexistente.
- **Fontes de dados (Providers):** DexScreener, GeckoTerminal, e Mocks (Demo). Implementados em `apps/api/src/ag47_radar/providers/`.
- **Testes:**
  - Backend: Unitários básicos em `apps/api/tests/` (alerts, api_endpoints, resilience, scoring).
  - Frontend: Um teste `smoke.spec.ts` em E2E.
- **Observabilidade:** Baseado em logging estruturado (Structlog).

## 3.2 Estado Funcional

- **Modelo de ativo (Normalização e Persistência):** Concluída e funcional (`Token`, `TradingPair`, `MarketSnapshot`, `OpportunityScore`).
- **Camada de provedores:** Concluída e funcional (abstração em `contracts.py`).
- **Pipeline de ingestão:** Concluída parcialmente. O script de ingestão existe, mas necessita ser testado e verificado contra falhas/duplicações, e a cobertura de testes de integração é baixa.
- **Scoring inicial:** Concluída parcialmente (Existe documentação `scoring-model.md` e a lógica base em `scoring.py`, mas faltam a formalização de `scoring-v1.md` exigida e os testes de integração do pipeline).
- **Lista principal do radar:** Concluída e funcional (API serve `opportunities`, frontend consome).
- **Página ou painel de detalhes:** Concluída e funcional.
- **Watchlist:** Concluída e funcional (Rotas da API existem, client implementa `addToWatchlist` e `removeFromWatchlist`).
- **Histórico mínimo:** Concluída e funcional (`MarketSnapshot` armazena snapshots ao longo do tempo).

## 3.3 Dívidas e Riscos

- **Riscos e Dívidas:**
  - Ausência quase total de testes na interface Web (UI/Componentes).
  - Necessidade de renomear `scoring-model.md` para `scoring-v1.md` ou criar o último para adequação do requisito.
  - O pipeline de ingestão carece de testes mais robustos, especificamente de integração.
  - Testes e gates de qualidade (`npm run verify`) podem falhar se os ambientes não estiverem adequadamente ativados.
  - A resiliência da interface a erros externos (fallback, timeout) não possui cobertura de teste de interface (e.g. estado "vazio" e "erro").

## 3.4 Evidências

- **Modelo de ativo:** `apps/api/src/ag47_radar/models.py` (Módulos `Token`, `MarketSnapshot`).
- **Providers:** `apps/api/src/ag47_radar/providers/contracts.py` (Interface `MarketDataProvider`).
- **Frontend API Client:** `apps/web/lib/api/client.ts` com validação de schemas.
- **Testes faltantes da Web:** `apps/web/e2e/smoke.spec.ts` é o único teste existente, sem testes em `/components/`.
