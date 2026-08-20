# AG47 Altcoin Radar

Beta pública funcional após os Sprints 1–13, agora na etapa **Hardening 1 (4/5 gates)**. A base local está validada; publicação e verificação de sincronização recente em produção continuam pendentes. O Radar descobre pares de altcoins, organiza snapshots de mercado, avalia sinais sociais e de contrato, produz score explicável e emite alertas. O produto é observacional e read-only: não conecta carteiras e não executa operações financeiras.

## Stack

- Web: Next.js 16, React 19, TypeScript strict, Tailwind CSS 4, TanStack Query/Table, Recharts, Zod e Lucide.
- API: Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy 2, Alembic, HTTPX e logging estruturado.
- Dados: PostgreSQL em ambiente integrado; SQLite como fallback local.
- Qualidade: Pytest, Vitest/Testing Library, Playwright, Ruff, MyPy, ESLint e Prettier.

## Requisitos

- Node.js 20.9 ou superior.
- Python 3.12 ou superior.
- npm 10 ou superior.
- Docker Compose é opcional para a execução com PostgreSQL.

## Instalação local

No diretório deste produto:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env.local
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -e "apps/api[dev]"
npm install
npm --prefix apps/web install
```

No Linux/macOS, ative o ambiente com `source .venv/bin/activate`.

## Banco, migration e seed

O fallback padrão grava SQLite em `apps/api/data/ag47_radar.db`.

```powershell
npm run db:migrate
npm run db:seed
```

O seed é idempotente e cria os cinco ativos fictícios coerentes do modo demonstração: NOVA, FARMX, ORBIT, LYNX e PULSE. Dados demo possuem `source=ag47_demo_fixture` e são rotulados pela API e pela interface.

Para PostgreSQL, altere `AG47_DATABASE_URL` para uma URL `postgresql+asyncpg://...` antes da migration.

Em produção, use `AG47_DATABASE_URL` e execute `npm run db:migrate` como etapa de release. A API não cria schema automaticamente quando `AG47_ENVIRONMENT=production`.

## Execução

Com o ambiente Python ativo:

```powershell
npm run dev
```

- Web: <http://localhost:3000>
- API: <http://localhost:8000>
- OpenAPI: <http://localhost:8000/docs>
- Health: <http://localhost:8000/health>

Também é possível executar os serviços separadamente com `npm run dev:web` e `npm run dev:api`.

## Modo demonstração e modo live

- `AG47_DEMO_MODE=true`: usa somente fixtures declaradas.
- `AG47_DEMO_MODE=false`: habilita descoberta GeckoTerminal e consultas DexScreener; não preenche sinais ausentes com fixtures.
- `AG47_INGESTION_MODE=manual`: nenhum monitoramento periódico é alegado pela API.
- `AG47_INGESTION_MODE=external`: `/system/status` só informa monitoramento ativo depois de uma execução externa bem-sucedida e dentro do SLA configurado.

Cada provider informa modo, fonte, qualidade e falhas parciais. Credencial ausente ou provider indisponível vira estado desconhecido/degradado; fixtures só aparecem quando `AG47_DEMO_MODE=true` foi selecionado explicitamente.

## Portal público e acesso de operador

O frontend público consome somente `GET` pelo proxy same-origin `/api/eco/alt-radar`. `POST`, `PATCH` e `DELETE` retornam `405`, e os controles correspondentes aparecem desabilitados e rotulados como ações do operador. Chaves administrativas nunca entram no bundle nem são injetadas pelo proxy público. Um console de operador futuro deverá usar autenticação e autorização server-side próprias.

## Workers one-shot

A API não inicia scheduler em seu `lifespan`. Em `apps/api`, execute os workers explicitamente:

```powershell
uv run ag47-radar worker ingest --limit 10
uv run ag47-radar worker calibrate
```

Em produção, cada comando pertence a um Cloud Run Job com exatamente uma task. O Cloud Scheduler dispara ingestão a cada cinco minutos e calibração a cada doze horas pela API autenticada do Cloud Run; não há segredo de scheduler na aplicação. Retries da mesma execução reutilizam `CLOUD_RUN_EXECUTION` como chave idempotente, o PostgreSQL mantém um advisory lock singleton entre execuções e cada nova ingestão também retoma, em lote limitado, canais de notificação cujo backoff já venceu. Cada alerta/canal reutiliza uma única entrega persistente e encerra em `dead` após três falhas.

O workflow de produção constrói uma revisão sem tráfego, executa `alembic upgrade head` num job singleton e só então promove a revisão. Credenciais chegam ao serviço e aos jobs por bindings do Google Secret Manager. Consulte o [runbook do worker de produção](docs/production-ingestion-worker.md) para variáveis, comandos, status e limites verificados localmente.

## Comandos de qualidade

```powershell
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run verify
```

Os gates são escopados a este produto. O repositório Ag47.pt pai possui falhas de lint preexistentes e não relacionadas, preservadas para respeitar a regra de modificação isolada.

## Docker

```powershell
Copy-Item .env.example .env
docker compose up --build
```

O Compose provisiona PostgreSQL, executa a API na porta 8000 e o frontend na porta 3000. Docker não é obrigatório para o fallback SQLite.

## Variáveis de ambiente

O arquivo [`apps/api/.env.example`](apps/api/.env.example) documenta o contrato da API; [`apps/web/.env.example`](apps/web/.env.example) cobre o frontend isolado; e [`.env.example`](.env.example) contém apenas defaults do Compose local. Somente variáveis `NEXT_PUBLIC_*` podem chegar ao browser. Em build de produção, um `NEXT_PUBLIC_API_URL` loopback é rejeitado e o frontend usa `/api/eco/alt-radar`; valores reais de produção pertencem ao Secret Manager ou às GitHub Environment Variables descritas no runbook.

## Estrutura

```text
apps/web          interface Next.js
apps/api          API, domínio, persistência e providers
docs              decisões e limites do produto
infrastructure    imagens Docker
scripts           automação local
```

## Limitações atuais

- GeckoTerminal keyless é uma API beta de baixo volume; uso comercial exige revisão de licença e capacidade.
- Os termos da DexScreener devem ser revistos antes de lançar um produto comercial potencialmente concorrente.
- O histórico real é acumulado por snapshots persistidos; o modo demo contém apenas histórico explicitamente fictício.
- Social, Telegram e holders ainda não possuem provider autorizado real; risco de contrato usa GoPlus (EVM) quando AG47_DEMO_MODE=false.
- SQLite oferece apenas lock local ao processo e serve para desenvolvimento; o singleton distribuído de produção exige PostgreSQL.
- Não há autenticação de utilizadores no Sprint 1; CORS e rate limiting reduzem a superfície local, mas não substituem autenticação futura.

Consulte o [mapa de uso diário](docs/fluxo-diario.md), [arquitetura](docs/architecture.md), [scoring](docs/scoring-v1.md), [backtesting](docs/backtesting.md), [providers](docs/data-providers.md), [escopo do sprint](docs/sprint-01.md) e [próximos sprints](docs/next-sprints.md).
