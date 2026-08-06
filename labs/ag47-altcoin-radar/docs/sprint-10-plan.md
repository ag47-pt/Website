# Plano do Sprint 10: Filtros Avançados de Alerta, Explicabilidade de Score e Histórico de Notificações

## Objetivo Principal

> **Permitir ao operador refinar dinamicamente as notificações enviadas para o Telegram, auditar a justificativa analítica (breakdown) de cada nota de oportunidade na Inbox, e inspecionar visualmente o histórico de disparos e erros da fila de notificações na UI.**

---

## 🎯 Pilares de Implementação

### Pilar 1: Filtros Customizados de Notificação por Canal
1. **Comportamento Atual:**
   - O `dispatch_telegram_alert_bg` dispara notificações automaticamente no background para todo alerta classificado como `"confirmado"` (Edge histórico $\ge 65\%$). Não há parametrização.
2. **Nova Funcionalidade:**
   - Criar uma tabela de configurações `user_notification_settings` ou estender as metatabelas do sistema para armazenar filtros de notificação (ex: `min_severity`, `allowed_chains`, `min_confidence`).
   - Criar endpoints de API `GET` e `POST` no backend em `routes.py` para consultar e atualizar estas preferências.
   - Atualizar a lógica do despachador do Telegram (`alerts.py` / `ingestion.py`) para consultar essas configurações antes de realizar o envio real do alerta.
   - Criar um painel visual simples na página `/configuracoes` na UI para ajustar esses filtros interativamente.

### Pilar 2: Breakdown Explicável do Score (Explaining Engine)
1. **Comportamento Atual:**
   - O motor de scoring gera uma explicação textual sumária, mas a UI da Inbox exibe apenas o valor consolidado e as tags. O operador não sabe o peso individual ou a nota de cada componente em tempo real.
2. **Nova Funcionalidade:**
   - O endpoint `/api/v1/alerts/edge-inbox` (ou a listagem de alertas) deve expor nos metadados de cada alerta os componentes normalizados originais e os pesos ativos no momento do cálculo (conforme salvo na tabela/cache).
   - Criar um componente de detalhe interativo (ex: Popover, Modal ou Accordion usando Tailwind/Vanilla CSS no Next.js 16) ao clicar no score de um alerta na `alert-inbox.tsx`.
   - Exibir visualmente o gráfico/barra comparativa de cada pilar de scoring (Qualidade dos Dados, DexScreener, GoPlus Security, RugCheck Solana, Holders e Volume/Liquidez).

### Pilar 3: Painel de Histórico de Entregas e Diagnóstico da Fila
1. **Comportamento Atual:**
   - O backend persiste o log de disparos na tabela `NotificationDelivery`, mas esses dados são invisíveis ao operador na UI.
2. **Nova Funcionalidade:**
   - Criar o endpoint de API `GET /api/v1/system/notifications` no backend para listar e filtrar as últimas entregas com suporte a paginação e filtro por status (success, failed, pending).
   - Criar a visualização `/notificacoes` no frontend Next.js 16 contendo uma listagem histórica dos envios para o Telegram Bot.
   - Exibir o payload enviado, timestamp convertido para o timezone do utilizador, número de tentativas realizadas e o stack de erro do provedor (ex: HTTP 429 ou Timeout) caso a entrega tenha falhado, permitindo depuração imediata.

---

## 🛠️ Roteiro de Execução Recomendado

1. **Back-end - Schema e Configurações:**
   - Criar migration do Alembic para adicionar a tabela `user_notification_settings` (ou persistir em JSON de configurações).
   - Implementar rotas `/api/v1/system/notification-settings` para gerenciar as configurações.
   - Ajustar o dispatcher assíncrono para ler e respeitar as regras salvas em banco antes de enviar.

2. **Back-end - Exposição de Metadados e Histórico:**
   - Alterar `TokenAlert` schema para incluir o breakdown do cálculo (ou extrair da Hypothesis associada).
   - Adicionar rota `GET /api/v1/system/notifications` para listar logs de `NotificationDelivery`.

3. **Front-end (Next.js 16):**
   - Criar a aba ou seção de Filtros de Notificação na tela `/configuracoes`.
   - Modificar a linha de alerta no `alert-inbox.tsx` para incluir o visualizador detalhado de notas por componente.
   - Criar a página de Histórico de Notificações, com paginação e busca por símbolo de token.

4. **Qualidade e Testes:**
   - Escrever testes cobrindo a validação dos filtros customizados de alerta (ex: garantir que um alerta com severidade menor que o limite configurado seja ignorado).
   - Validar a compilação do Next.js 16 e executar `checklist.py`.

---

> **Regra Absoluta (P0):** O sistema permanece estritamente read-only. Nenhuma funcionalidade de trading, assinatura de transações ou carteiras deve ser introduzida.
