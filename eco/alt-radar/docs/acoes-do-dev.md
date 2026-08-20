# Ações do Dev: release de produção

Este checklist descreve o release do **AG47 Altcoin Radar** depois do Hardening 1. Preparar estes itens localmente não publica código nem altera o ambiente online.

## 1. Configuração de runtime

O serviço e os workers usam exclusivamente variáveis `AG47_*`:

```dotenv
AG47_ENVIRONMENT=production
AG47_DEMO_MODE=false
AG47_AUTO_CREATE_SCHEMA=false
AG47_AUTO_SEED_DEMO=false
AG47_INGESTION_MODE=external
AG47_INGESTION_STALE_AFTER_SECONDS=900
AG47_CORS_ORIGINS=https://ag47.pt
AG47_TRUSTED_PROXY_CIDRS=<CIDRs verificados da borda Cloud Run>
AG47_WEBHOOK_ALLOWED_HOSTS=hooks.exemplo.com
```

O navegador deve usar o proxy same-origin `/api/eco/alt-radar`. O destino real fica apenas no servidor do host, em `ALT_RADAR_API_URL`; não publique o endereço upstream em `NEXT_PUBLIC_API_URL` sem uma necessidade explícita. O portal público é GET-only: mutações retornam `405` e não recebem chave de operador. Um futuro console operacional exige sessão e autorização server-side próprias.

## 2. PostgreSQL e migration

- Use PostgreSQL/Cloud SQL; workers de produção rejeitam SQLite.
- Armazene `AG47_DATABASE_URL` no Google Secret Manager.
- Não ative criação automática de schema em produção.
- O workflow cria uma revisão Cloud Run sem tráfego, executa `alembic upgrade head` num job singleton e só então promove a revisão. Falha de migration impede a troca de tráfego.

## 3. Identidades e secrets

O environment GitHub `alt-radar-production` deve proteger o deploy. Configure apenas identidades e referências de Secret Manager nos GitHub Secrets:

| GitHub Secret | Conteúdo esperado |
| --- | --- |
| `WCP_PROVIDER` | provider do Workload Identity Federation |
| `GCP_SA_EMAIL` | service account de deploy |
| `GCP_RUNTIME_SERVICE_ACCOUNT` | service account do serviço e dos jobs |
| `GCP_SCHEDULER_SERVICE_ACCOUNT` | service account limitada a executar os jobs |
| `AG47_DATABASE_URL_SECRET` | referência `SECRET_NAME:VERSION` da URL PostgreSQL |
| `AG47_OPERATOR_API_KEY_SECRET` | referência da chave de operador |
| `AG47_ADMIN_API_KEY_SECRET` | referência da chave administrativa |

As referências opcionais `AG47_TELEGRAM_BOT_TOKEN_SECRET`, `AG47_TELEGRAM_CHAT_ID_SECRET` e `AG47_HELIUS_API_KEY_SECRET` seguem o mesmo formato. Os valores não são passados por `--set-env-vars`; Cloud Run os monta por `--set-secrets`.

Configure também estas GitHub Environment Variables não secretas. O workflow exige valores explícitos e gera um único arquivo de runtime para o serviço e os jobs, sem preservar defaults locais por acidente:

| GitHub Variable | Conteúdo esperado |
| --- | --- |
| `AG47_CORS_ORIGINS` | origens HTTPS autorizadas, separadas por vírgula |
| `AG47_TRUSTED_PROXY_CIDRS` | CIDRs verificados da borda/proxy confiável |
| `AG47_WEBHOOK_ALLOWED_HOSTS` | hosts de destino permitidos para webhook, separados por vírgula |

Conceda à identidade de runtime somente `roles/secretmanager.secretAccessor` nos secrets usados e acesso ao Cloud SQL. A identidade do Scheduler precisa somente de `roles/run.invoker` nos dois worker jobs. Não use chave JSON longa como fallback do GitHub Actions.

## 4. Jobs duráveis

O processo FastAPI não executa cron interno. O workflow provisiona:

| Recurso | Comando | Agenda UTC |
| --- | --- | --- |
| `alt-radar-ingestion` | `ag47-radar worker ingest --limit 10` | `*/5 * * * *` |
| `alt-radar-calibration` | `ag47-radar worker calibrate` | `17 */12 * * *` |

Cada job usa uma task, paralelismo um, chave idempotente por `CLOUD_RUN_EXECUTION` e advisory lock PostgreSQL. Consulte [production-ingestion-worker.md](production-ingestion-worker.md) para o contrato e os limites.

## 5. Gate de release

Antes de autorizar push/deploy:

- [ ] `npm run verify` passou num checkout limpo.
- [ ] `npm audit --omit=dev` do miniapp não possui vulnerabilidade conhecida.
- [ ] migration upgrade/downgrade foi validada numa base descartável.
- [ ] os GitHub Actions passaram no `actionlint`.
- [ ] o environment `alt-radar-production` exige aprovação adequada.
- [ ] todas as referências do Secret Manager e permissões das service accounts existem.
- [ ] CORS, CIDRs de proxy e hosts de webhook foram revisados e configurados nas Environment Variables.

Depois do deploy:

- [ ] `/health` responde com banco conectado e `demo_mode=false`.
- [ ] `/api/v1/system/status` registra execução recente e `monitoring_active=true`.
- [ ] `job_runs` mostra ingestão e calibração sem sobreposição.
- [ ] a UI exibe dados live, demo, degradados, desatualizados e indisponíveis sem fallback sintético.
- [ ] Telegram/webhook são confirmados por registros reais de entrega, nunca por mensagens simuladas no frontend.

O deploy e a verificação online dependem de autorização separada; este documento não os executa.
