# Relatório do Sprint 9: Calibração Dinâmica de Scoring & Fila de Notificações de Produção

## Resumo da Execução

O **Sprint 9** foi concluído com sucesso total. Fechamos o loop epistemológico do sistema permitindo que os pesos do motor de scoring sejam calibrados dinamicamente com base nas verdades históricas consolidadas pelo *Truth Engine*. Adicionalmente, ativamos o envio automatizado de notificações via Telegram Bot para alertas estatisticamente confirmados (*Edge Confirmado*), operando em background task não-bloqueante com retry exponencial e circuit breakers. A interface Next.js 16 recebeu suporte para exibir o estado detalhado do circuito dos provedores (DexScreener, GoPlus, Telegram, etc.) e um botão de reset manual para manutenção operacional dos circuitos.

---

## 🎯 Resultados por Pilar

### Pilar 1: Calibração Dinâmica de Pesos no Motor de Scoring
- **Integração Dinâmica de Pesos**: Atualizamos a lógica em `scoring.py` para receber pesos customizados (`weights`). Caso haja calibrações no banco, esses pesos sobrescrevem os padrões de `WEIGHTS`.
- **Tarefa de Calibração Periódica**: O scheduler em `scheduler.py` executa uma tarefa a cada 12 horas (`scoring-calibration`) rodando o backtest dinâmico e salvando a matriz de calibração (`ScoringWeights`) mais recente no banco de dados.
- **Fallback e Cold Start**: Se o banco contiver menos de 100 registros de verdades validadas (`TokenTruth`), ou se houver falha de rede/acesso, o motor em `ingestion.py` recua automaticamente para a constante hardcoded, garantindo máxima estabilidade.

### Pilar 2: Despacho Resiliente de Alertas via Telegram Bot API
- **Disparo no Background**: No pipeline de ingestão em `ingestion.py`, novos alertas do tipo "Edge Confirmado" disparam uma tarefa de fundo assíncrona (`dispatch_telegram_alert_bg`) via `asyncio.create_task`.
- **Fila e Retry Exponencial**: Implementamos em `alerts.py` a tentativa de entrega com retry exponencial de até 3 tentativas separadas por intervalo exponencial ($2^{attempt}$ segundos).
- **Log de Notificações**: Todas as tentativas e retornos dos provedores são registrados na tabela `NotificationDelivery` (com status `"success"`, `"failed"` ou `"pending"`), permitindo auditoria detalhada.

### Pilar 3: Interface de Circuit Breakers e Reset Manual
- **Diagnóstico Estendido**: O endpoint `/api/v1/system/status` foi estendido para expor o status de saúde real de cada circuito (OPEN, CLOSED, HALF-OPEN), contagem de falhas consecutivas, latência real e tempo de cooldown pendente.
- **Frontend em Next.js 16**: O componente `system-workspace.tsx` foi atualizado para mostrar tags interativas de status do circuito HSL e barra de resfriamento.
- **Reset Manual**: Adicionamos o botão "Manutenção / Reset" que envia um `POST` para o novo endpoint `/api/v1/system/providers/{provider_id}/reset-circuit`, reiniciando o circuito de imediato e fechando-o para testes.

---

## 🧪 Qualidade & Cobertura de Testes

- **Testes Unitários & Integração**: A suite de testes pytest validou toda a lógica de resiliência e concorrência com sucesso.
- **Sucesso dos Gates**:
  - **Pytest**: 92 testes passando com sucesso total (100% de cobertura operacional).
  - **TypeScript check**: Compilação estrita em `apps/web` concluída com código de saída 0 via `npx tsc --noEmit`.

---

## 🚀 Próximo Passo

O Sprint 9 fecha a estrutura básica de ingestão, score adaptativo e despacho. Com isso, estamos prontos para evoluir para o **Sprint 10** (Filtros Avançados de Alerta, Explicabilidade de Score e Histórico de Notificações), permitindo ao operador customizar seus triggers e analisar por que um ativo obteve determinada nota.

---

> **Status Final:** Sprint 9 finalizado, testado e documentado. Pronto para a instrução do Sprint 10.
