# Plano do Sprint 9: Calibração Dinâmica de Scoring & Fila de Notificações de Produção

## Objetivo Principal

> **Fechar o loop epistemológico ajustando dinamicamente os pesos de scoring com base no sucesso histórico real (backtest/calibration) e automatizar o envio resiliente de alertas confirmados (Edge) via Telegram Bot API com gerenciamento visual de Circuit Breakers na UI.**

---

## 🎯 Pilares de Implementação

### Pilar 1: Calibração Dinâmica de Pesos no Motor de Scoring
1. **Comportamento Atual:** 
   - O endpoint `/api/v1/system/calibration` roda o backtest dinamicamente e calcula pesos ótimos (calibrados) com base no histórico do banco, mas esses pesos são apenas exibitivos. O cálculo de score de oportunidade em tempo real (`scoring.py`) continua usando a constante estática `WEIGHTS`.
2. **Nova Funcionalidade:**
   - Atualizar [`apps/api/src/ag47_radar/services/scoring.py`](file:///c:/Users/moise/Desktop/Agencia47/DEV/DEVELOPING/SANDBOX/Ag47.pt/labs/ag47-altcoin-radar/apps/api/src/ag47_radar/services/scoring.py) e [`apps/api/src/ag47_radar/services/queries.py`](file:///c:/Users/moise/Desktop/Agencia47/DEV/DEVELOPING/SANDBOX/Ag47.pt/labs/ag47-altcoin-radar/apps/api/src/ag47_radar/services/queries.py) para suportar a injeção ou consulta dos últimos pesos dinâmicos calibrados no banco de dados.
   - O `calculate_score` deve carregar os pesos otimizados da última calibração válida salvos pelo `System/Calibration` em cache ou banco de dados.
   - **Fallback de Cold Start:** Se não houver amostras suficientes (mínimo de 100 verdades avaliadas no banco) ou em caso de erro na consulta, o motor deve recuar automaticamente para os pesos hardcoded em `WEIGHTS`.

### Pilar 2: Despacho Resiliente de Alertas via Telegram Bot API
1. **Comportamento Atual:**
   - O `TelegramAlertDeliveryProvider` foi integrado e testado no Sprint 6, mas ele não envia mensagens em tempo real de forma automática a partir dos novos alertas com classificação estatística de Edge do Sprint 8.
2. **Nova Funcionalidade:**
   - No serviço [`apps/api/src/ag47_radar/services/alerts.py`](file:///c:/Users/moise/Desktop/Agencia47/DEV/DEVELOPING/SANDBOX/Ag47.pt/labs/ag47-altcoin-radar/apps/api/src/ag47_radar/services/alerts.py), após a criação e persistência bem-sucedida de um `TokenAlert` cujo `confidence_level == "confirmado"`, o sistema deve invocar o provedor Telegram para despachar a notificação em tempo real.
   - **Fila Assíncrona e Resiliência:** Como chamadas de rede externas podem sofrer latência ou sofrer rate limit do Telegram (HTTP 429), o disparo deve rodar de forma não-bloqueante (em background task do FastAPI ou thread isolada via scheduler).
   - Aplicar retry exponencial (máximo de 3 tentativas) e circuit breaker para proteger a API principal de lentidão ou timeouts.

### Pilar 3: Interface de Circuit Breakers e Status de Saúde na UI
1. **Comportamento Atual:**
   - O Circuit Breaker gerencia a resiliência no backend, mas o operador não tem visibilidade nem controle sobre o estado dos circuitos na interface gráfica.
2. **Nova Funcionalidade:**
   - Criar uma seção de status detalhado dos provedores na página de Configurações (`/configuracoes`) ou criar `/status-provedores` na UI.
   - Exibir uma grade visual contendo o status de cada provedor (DexScreener, GoPlus, Helius RPC, Telegram):
     - **Estado do Circuito:** Fechado (Operando normal), Aberto (Bloqueado/Em Cooldown), Meio-Aberto (Testando retorno).
     - **Métricas:** Latência média (`duration_ms`), Falhas consecutivas registradas e tempo restante para o fim do cooldown.
     - **Ação Operacional:** Botão para "Resetar Circuit Breaker" manualmente, forçando o circuito a fechar para re-testar conexões de forma imediata sem esperar o tempo padrão de cooldown.

---

## 🛠️ Roteiro de Execução Recomendado

1. **Back-end - Scoring Dinâmico:**
   - Criar uma tabela simples `scoring_weights` ou armazenar a calibração mais recente em uma tabela de metadados do sistema.
   - Ajustar a lógica de `calculate_score` para aceitar pesos customizados vindos do banco de dados/cache.
   - Atualizar a tarefa do Scheduler para salvar a matriz de calibração periodicamente no banco.

2. **Back-end - Fila de Alertas do Telegram:**
   - Adicionar o dispatcher automático de alertas no lifespan/background task da API.
   - Adicionar testes de integração cobrindo a entrega do Telegram simulando retries e falhas de limite de requisições.

3. **Front-end (Next.js 16):**
   - Atualizar a tela `/configuracoes` para consumir os dados do circuit breaker disponíveis no endpoint `/api/v1/system/status`.
   - Adicionar botão interativo que dispara `POST /api/v1/system/providers/{provider_id}/reset-circuit` para re-fechar o circuito.

4. **Qualidade e Testes:**
   - Executar os testes unitários e de concorrência.
   - Rodar auditoria com `python .agent/scripts/checklist.py .`.

---

> **Regra Absoluta (P0):** O sistema permanece estritamente read-only. Nenhuma funcionalidade de trading, assinatura de transações ou carteiras deve ser introduzida.
