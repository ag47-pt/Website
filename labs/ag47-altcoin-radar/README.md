# AG47 Altcoin Radar

Fundação funcional do Sprint 1 para descobrir pares de altcoins, organizar snapshots de mercado, avaliar sinais sociais e de contrato, produzir um score explicável e emitir alertas. O produto é observacional e read-only: não conecta carteiras e não executa operações financeiras.

## Stack

- Web: Next.js 16, React 19, TypeScript strict, Tailwind CSS 4, TanStack Query/Table, Recharts, Zod e Lucide.
- API: Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy 2, Alembic, HTTPX, APScheduler e logging estruturado.
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
Copy-Item .env.example .env
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

Para PostgreSQL, altere `DATABASE_URL` para uma URL `postgresql+asyncpg://...` antes da migration.

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

- `DEMO_MODE=true` e `PROVIDER_MODE=demo`: usa somente fixtures declaradas.
- `DEMO_MODE=false` e `PROVIDER_MODE=live`: habilita descoberta GeckoTerminal e consultas DexScreener; não preenche sinais ausentes com fixtures.
- `SCHEDULER_ENABLED=true`: ativa a sincronização periódica no processo da API. Em produção com mais de uma réplica, mova o scheduler para um worker único.

Telegram, holders e análise profunda de contrato usam adapters de demonstração no Sprint 1. A interface nunca apresenta esses dados como reais.

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

O arquivo [`.env.example`](.env.example) documenta todas as opções do Sprint 1. Somente variáveis `NEXT_PUBLIC_*` podem chegar ao browser. Nenhuma credencial é necessária para os providers públicos atualmente implementados.

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
- O scheduler em processo é adequado ao MVP de uma réplica, não a execução distribuída.
- Não há autenticação de utilizadores no Sprint 1; CORS e rate limiting reduzem a superfície local, mas não substituem autenticação futura.

Consulte o [mapa de uso diário](docs/fluxo-diario.md), [arquitetura](docs/architecture.md), [scoring](docs/scoring-v1.md), [backtesting](docs/backtesting.md), [providers](docs/data-providers.md), [escopo do sprint](docs/sprint-01.md) e [próximos sprints](docs/next-sprints.md).
