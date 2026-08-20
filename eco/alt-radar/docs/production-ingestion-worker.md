# Worker de ingestão em produção

## Estado desta entrega

Esta fundação está implementada e validável localmente. Ela **não** cria recursos Google Cloud, não publica imagem, não executa migration na base online e não ativa qualquer agendamento por conta própria.

O objetivo é separar trabalho periódico do processo FastAPI. A API pode escalar para múltiplas réplicas sem que cada réplica inicie seu próprio cron.

## Contrato de execução

No diretório `apps/api`, os comandos one-shot são:

```powershell
uv run ag47-radar worker ingest --limit 10
uv run ag47-radar worker calibrate
```

Para um teste local repetível, `--run-key` fornece uma chave explícita:

```powershell
uv run ag47-radar worker ingest --limit 10 --run-key local-smoke-001
```

- Sucesso grava um `JobRun` e imprime JSON com `status=succeeded`.
- Retry com a mesma chave após sucesso imprime `status=skipped` e `reason=duplicate`.
- Uma execução concorrente perde o lock sem bloquear, imprime `reason=singleton_busy` e termina com sucesso, porque o worker que obteve o lock continua responsável pelo ciclo.
- Exceções são propagadas depois do fechamento de providers e banco; o processo termina com código diferente de zero.
- `AG47_DEMO_MODE=true`, banco não PostgreSQL em produção, dialeto sem lock implementado ou Cloud Run Job com mais de uma task falham de forma fechada.

## Variáveis necessárias

```dotenv
AG47_ENVIRONMENT=production
AG47_DEMO_MODE=false
AG47_DATABASE_URL=postgresql+asyncpg://...
AG47_AUTO_CREATE_SCHEMA=false
AG47_AUTO_SEED_DEMO=false
AG47_INGESTION_MODE=external
AG47_INGESTION_STALE_AFTER_SECONDS=900
AG47_CORS_ORIGINS=https://ag47.pt
AG47_TRUSTED_PROXY_CIDRS=<CIDRs verificados da borda Cloud Run>
AG47_WEBHOOK_ALLOWED_HOSTS=hooks.exemplo.com
```

O valor real de `AG47_DATABASE_URL` deve vir do Google Secret Manager por um binding `--set-secrets`; não o grave no repositório, em GitHub Secrets como valor bruto nem diretamente na configuração visível do job. Credenciais de providers seguem a mesma regra.

Os três valores de rede acima são GitHub Environment Variables obrigatórias. O workflow os grava junto das constantes de produção num arquivo `--env-vars-file` comum ao serviço e aos jobs, de modo que um release não restaure silenciosamente CORS localhost ou allowlists vazias.

O Cloud Run injeta `CLOUD_RUN_EXECUTION`, `CLOUD_RUN_TASK_COUNT` e `CLOUD_RUN_TASK_INDEX`. Não configure essas variáveis manualmente. A execução exige `CLOUD_RUN_TASK_COUNT=1`; o nome de execução vira a chave idempotente estável entre tentativas da mesma task.

## Persistência e concorrência

As migrations `f260820a01` e `f260820a02` criam `job_runs`, o estado persistente de retry das notificações, a unicidade por alerta/canal e os índices de entregas vencidas. Antes de promover tráfego:

```powershell
uv run alembic upgrade head
```

Migration continua sendo uma etapa explícita de release. O workflow cria a revisão sem tráfego, executa o Alembic em `alt-radar-migrate` e só promove a revisão depois do sucesso; a aplicação não migra nem cria schema ao iniciar em produção.

Durante o trabalho, uma conexão dedicada mantém `pg_try_advisory_lock` por nome de job. Isso impede sobreposição entre jobs, serviços ou réplicas que compartilhem o mesmo PostgreSQL. O registro persistente deduplica um retry já concluído. Uma falha pode repetir a mesma chave e incrementa `attempts`.

Os efeitos principais da ingestão ou calibração e a conclusão do `JobRun` são confirmados na mesma transação. Alertas confirmados ficam registrados em `JobRun.summary_json` antes do commit; somente depois disso o worker tenta os canais externos. Uma entrega recusada ou expirada permanece pendente por canal, sem reenviar canais já confirmados como `success`. Retries da mesma execução e novas execuções drenam apenas itens vencidos desse backlog sob o mesmo lock, sem repetir a ingestão original.

Telegram sem credenciais, modo demo e webhook não configurado são estados `skipped/not_configured`, nunca sucesso de entrega e nunca falha que gere retry. Falhas reais incrementam `partial_failures` e reutilizam uma única `NotificationDelivery` por alerta/canal. Cada tentativa e o próximo horário ficam persistidos; não há chamada externa antes do prazo, o canal passa a `dead` após a terceira falha e sai da fila pendente. Cada ciclo processa no máximo 25 `JobRun` vencidos, evitando crescimento indefinido e starvation da ingestão. O ciclo de dados pode continuar `succeeded` porque os dados já foram persistidos atomicamente.

O fallback SQLite usa lock apenas dentro do processo. Ele comprova o contrato em testes locais, mas não fornece exclusão distribuída e é rejeitado pelo worker quando `AG47_ENVIRONMENT=production`.

## Integração preparada para Google Cloud

O workflow prepara dois Cloud Run Jobs a partir da mesma imagem verificada da API, ambos com uma task:

| Job | Command/args do container | Frequência sugerida |
|-----|---------------------------|---------------------|
| ingestão | `uv run ag47-radar worker ingest --limit 10` | a cada 5 minutos |
| calibração | `uv run ag47-radar worker calibrate` | `17 */12 * * *` em UTC |

O Cloud Scheduler deve chamar `POST https://run.googleapis.com/v2/projects/PROJECT/locations/REGION/jobs/JOB:run` com OAuth de uma service account que tenha somente permissão para executar o job. Esse é o caminho oficial para [executar Cloud Run Jobs em agenda](https://cloud.google.com/run/docs/execute/jobs-on-schedule). O container não recebe API key de scheduler.

Configure retries do Cloud Run Job. Segundo o [contrato de runtime do Cloud Run](https://cloud.google.com/run/docs/container-contract), jobs devem terminar com código zero em sucesso e diferente de zero em falha; os comandos acima seguem esse contrato.

## Verdade operacional no status

`/api/v1/system/status` só retorna `monitoring_active=true` quando:

1. `AG47_INGESTION_MODE=external`;
2. o sistema não está em modo demo; e
3. existe um `market-ingestion` bem-sucedido dentro de `AG47_INGESTION_STALE_AFTER_SECONDS`.

Com agenda de cinco minutos, o padrão de 900 segundos tolera duas ocorrências perdidas antes de declarar o monitoramento inativo. Configurar `external` sem executar o worker mantém o status degradado; a configuração isolada nunca é tratada como evidência de atividade.

## Limite de idempotência

`CLOUD_RUN_EXECUTION` deduplica retries da mesma execução, e o advisory lock elimina sobreposição. Se um agente externo criar, de forma sequencial, duas execuções Cloud Run diferentes para a mesma ocorrência, elas terão chaves distintas. Os invariantes de domínio continuam evitando duplicação de identidades, eventos, sinais e alertas, mas snapshots são observações append-only. A integração de deploy deve evitar disparos duplicados e monitorar `job_runs` para identificar esse caso raro.
