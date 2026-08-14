# Ações do Dev: Subida para Produção

Este documento consolida tudo o que o desenvolvedor precisa ajustar, configurar e validar para tirar o sistema **AG47 Altcoin Radar** do modo *demo* e colocá-lo em pleno funcionamento no ambiente de **produção**.

---

## 1. Variáveis de Ambiente (Obrigatório)
O primeiro passo para ativar a produção é configurar corretamente o arquivo `.env` definitivo.

### Flags de Ambiente e Modo
- `APP_ENV=production` ou `AG47_ENVIRONMENT=production`
- `DEMO_MODE=false` e `AG47_DEMO_MODE=false` (Isso desativa a geração de dados falsos e ativa o *Real Providers Routing*).
- `AG47_AUTO_SEED_DEMO=false` (Garante que o banco de dados não injete moedas fictícias na inicialização).

### Chaves de APIs (Secrets)
Para que o `TelegramPublicSocialProvider` e outros provedores reais (ex: Helius) operem, é mandatório fornecer:
- `AG47_TELEGRAM_BOT_TOKEN`: O token do bot criado no BotFather.
- `AG47_TELEGRAM_CHAT_ID`: O ID do grupo/canal ou do admin onde os alertas deverão ser despachados e/ou lidos.
- `AG47_HELIUS_API_KEY`: A chave da Helius para as integrações on-chain reais da rede Solana.

### Configurações de Frontend / Backend
- `NEXT_PUBLIC_API_URL`: Deve apontar para o domínio público real do seu backend (ex: `https://api.seudominio.com`).
- `API_HOST`: Geralmente `0.0.0.0` para containers.
- `API_PORT`: A porta em que a aplicação vai rodar.

---

## 2. Banco de Dados
O SQLite (`sqlite+aiosqlite:///./data/ag47_radar.db`) foi usado para o desenvolvimento local. Em produção, ele não suporta alto paralelismo com eficiência.

- **Ação:** Provisionar um banco de dados **PostgreSQL** (AWS RDS, Google Cloud SQL, ou Docker via `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`).
- **Ação:** Atualizar a variável `DATABASE_URL` no `.env` para a string de conexão do PostgreSQL (ex: `postgresql+asyncpg://ag47:senha@host:5432/ag47_radar`).
- **Ação:** Garantir que o schema do banco de dados seja criado. Dependendo de como a aplicação sobe (se `AG47_AUTO_CREATE_SCHEMA=true`), o backend fará isso sozinho na primeira inicialização, mas verifique se existe necessidade de rodar migrações (*Alembic* se configurado).

---

## 3. Segurança, Cors e Rate Limits
Ao abrir a aplicação para a web, proteções nativas devem ser ligadas:

- **CORS_ORIGINS:** Atualize para conter estritamente o domínio onde o frontend está hospedado (ex: `["https://app.ag47.pt"]`). Remova o `localhost`.
- **Limites (Rate Limits):** Ajuste `RATE_LIMIT_REQUESTS`, `RATE_LIMIT_WINDOW_SECONDS` e `AG47_MUTATION_RATE_LIMIT_REQUESTS` de acordo com o tamanho do servidor para evitar DDoS ou exaustão do banco.

---

## 4. Agendadores e Background Jobs (Scheduler)
Para que o sistema passe a puxar os dados do mercado sozinho de forma periódica:

- **Ação:** Mudar `SCHEDULER_ENABLED=true` (ou `AG47_SCHEDULER_ENABLED=true`).
- **Ação:** Validar `MARKET_SYNC_INTERVAL_SECONDS` e `AG47_SCHEDULER_INTERVAL_SECONDS`. (Para produção, 300 segundos, ou seja, 5 minutos, costuma ser o ideal para não estourar rate-limits de provedores públicos gratuitos).

---

## 5. Build, Execução e Deploy

### Backend (Python/FastAPI)
- Não rode usando servidor de desenvolvimento. 
- Use um gestor de processos robusto como Gunicorn com Uvicorn workers:
  ```bash
  gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
  ```

### Frontend (Next.js)
- O frontend em Next.js (pasta `apps/web`) precisa ser compilado para produção:
  ```bash
  npm run build
  npm run start
  ```
- Certifique-se de que a build foi feita **com as variáveis de ambiente de produção injetadas**, especialmente o `NEXT_PUBLIC_API_URL`.

---

## 6. Verificação Final (Checklist)

- [ ] `DEMO_MODE=false` aplicado.
- [ ] Chaves do Telegram e Helius preenchidas.
- [ ] PostgreSQL no ar e `DATABASE_URL` apontado para ele.
- [ ] Domínios do frontend colocados no `CORS_ORIGINS`.
- [ ] `SCHEDULER_ENABLED=true` para rodar sincronização automática.
- [ ] Frontend construído com `npm run build` e servido sem erros no console apontando para localhost.
- [ ] Teste de ponta-a-ponta: O Dashboard exibe os dados reais e os Logs mostram sucesso ao atingir as APIs públicas (GeckoTerminal, Dexscreener, Telegram).
