# Plano do Sprint 11: Webhook Outbound Configurável, Painel Multi-Chain e Exportação Epistemológica

## Objetivo Principal

> **Expandir a capacidade de integração do radar via Webhooks HTTP assinados (Discord/Slack/n8n), fornecer visualização analítica por ecossistema de blockchain no painel operacional, e disponibilizar o exportador de datasets epistemológicos em JSON/CSV para validação out-of-sample.**

---

## 🎯 Pilares de Implementação

### Pilar 1: Webhook Outbound HTTP Assinado (Discord/Slack/n8n)
1. **Comportamento Atual:**
   - O sistema envia notificações assíncronas apenas via Telegram Bot API (`alerts.py`).
2. **Nova Funcionalidade:**
   - Estender a tabela `UserNotificationSettings` (ou criar `outbound_webhook_endpoints`) para armazenar URLs de Webhook (Discord, Slack, Make, n8n) e uma chave secreta de assinatura HMAC SHA-256 (`webhook_secret`).
   - Criar o despachador genérico de Webhooks em `apps/api/src/ag47_radar/services/webhooks.py` utilizando `httpx.AsyncClient` com timeout configurável, retries exponenciais e inclusão do header `X-AG47-Signature` (HMAC SHA-256).
   - Estender o enum/status em `NotificationDelivery` para suportar canais adicionais (`"telegram"`, `"discord"`, `"webhook_custom"`).
   - Adicionar interface no frontend (`system-workspace.tsx` / `/configuracoes`) para cadastrar o Webhook URL e acionar o botão de "Testar Envio".

### Pilar 2: Painel de Cobertura Multi-Chain e Diagnóstico por Ecossistema
1. **Comportamento Atual:**
   - O `/system/status` exibe o status global dos provedores de dados, mas não detalha a métrica por rede (Solana vs Ethereum vs Base vs Arbitrum vs BSC).
2. **Nova Funcionalidade:**
   - Criar o endpoint de estatísticas multi-chain `GET /api/v1/system/chains/status` consolidando contagem de tokens ativos por rede, latência média da RPC e taxa de sucesso dos provedores de segurança (GoPlus para EVM, RugCheck para Solana).
   - Criar o componente visual "Matriz de Saúde Multi-Chain" no `system-workspace.tsx` exibindo cards com status visual (verde/amarelo/vermelho), volume de liquidez rastreado por rede e contagem de alertas nas últimas 24 horas.

### Pilar 3: Exportador de Datasets Epistemológicos (JSON / CSV)
1. **Comportamento Atual:**
   - O *Truth Engine* consolida a taxa de acerto histórico e gera o relatório no formato `SystemCalibrationResponse`, porém os dados brutos de validação out-of-sample e pares score vs retorno real permanecem restritos ao banco de dados SQL.
2. **Nova Funcionalidade:**
   - Criar o endpoint `GET /api/v1/system/export/truth-dataset` permitindo baixar o histórico em formato JSON ou CSV (via parâmetro `format=json|csv`).
   - Incluir campos de auditoria: `token_symbol`, `chain`, `score_at_alert`, `breakdown_summary`, `price_after_24h`, `hit_result` ("win" | "loss" | "neutral") e `validated_at`.
   - Adicionar botão de exportação rápida na tela de Calibração e Performance no frontend.

---

## 🛠️ Roteiro de Execução Recomendado (Para o Agente Executor)

1. **Back-end - Webhook Engine & Modelos:**
   - Em `models.py`: Estender `UserNotificationSettings` com `webhook_url` e `webhook_secret`.
   - Em `schemas.py`: Atualizar schemas Pydantic de notificação.
   - Em `services/webhooks.py`: Implementar `dispatch_webhook_alert` com HMAC SHA-256.
   - Em `services/alerts.py`: Invocar a transmissão assíncrona para Telegram e Webhook simultaneamente.

2. **Back-end - Multi-Chain & Export Endpoints:**
   - Em `routes.py`: Adicionar `GET /api/v1/system/chains/status` e `GET /api/v1/system/export/truth-dataset`.
   - Em `services/queries.py`: Criar a agregação por cadeia de blockchain.

3. **Front-end (Next.js 16):**
   - Atualizar `apps/web/lib/api/schemas.ts`, `client.ts` e `query.ts` para integrar com as novas rotas.
   - Atualizar `system-workspace.tsx` com o formulário de Webhook e a Matriz Multi-Chain.
   - Adicionar botão de Download CSV/JSON no painel de Calibração.

4. **Qualidade e Testes:**
   - Escrever testes em `apps/api/tests/test_webhooks.py` e `test_api_endpoints.py` cobrindo o envio assíncrono simulado e a geração do arquivo CSV.
   - Executar compilação estrita em `apps/web` (`npx tsc --noEmit`) e rodar a suíte de testes completa `python -m pytest`.

---

> **Regra Absoluta (P0):** O sistema permanece estritamente read-only em relação às blockchains. Nenhuma funcionalidade de custódia, chave privada ou automação de trade pode ser criada.
