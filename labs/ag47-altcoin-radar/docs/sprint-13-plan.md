# Plano do Sprint 13: Otimização de Parâmetros via Grid Search

## Objetivo Principal

> **[PENDENTE] Adicionar capacidade computacional offline ao sistema para rodar varreduras (Grid Search) no histórico de eventos e Alertas de Edge, visando sugerir a melhor combinação de pesos de Scoring que otimize o Profit Factor e o Win Rate do Paper Trading virtual.**

---

## 🎯 Pilares de Implementação

### Pilar 1: Motor de Backtesting & Grid Search (Back-end)
1. **Runner de Simulação Retroativa:**
   - Construir uma lógica em `services/backtest.py` ou `services/optimization.py` capaz de injetar matrizes de pesos customizadas sobre o dataset epistemológico do *Truth Engine*.
2. **Avaliação Preditiva:**
   - Iterar sobre múltiplos cenários (ex: Peso Liquidez variando de 10% a 40%, Peso Momentum variando de 10% a 50%).
   - Identificar qual a combinação geraria o melhor `Profit Factor` da carteira virtual ao longo dos dados retidos.

### Pilar 2: Recomendação e Auto-Calibração
1. **Endpoint de Calibração (`POST /api/v1/system/optimize-weights`):**
   - Rota acionada manualmente ou via cron, que dispara a rotina intensiva em background (usar Celery ou rotina asyncpg nativa que não trave a fila principal).
2. **Relatório de Sugestões:**
   - Retornar as `top 3` matrizes de configuração baseadas nos resultados observacionais da carteira virtual e disponibilizar para aceite pelo operador.

### Pilar 3: Interface de Otimização e Aceite (Front-end)
1. **Painel de Laboratório:**
   - Criar uma nova aba "Laboratório" (Lab) no frontend Next.js 16 para rodar essas simulações sob demanda e ver o comparativo "Performance Atual vs Performance Otimizada".
2. **Aprovação Manual:**
   - Componente para confirmar e aplicar os novos pesos recomendados ao motor de Edge (em `ScoringWeights`).

---

## 🛠️ Roteiro de Execução Recomendado (Para o Agente Executor)

1. **Back-end - Algoritmo de Varredura:**
   - Criar `GridSearchOptimizer` em Python para rodar de forma isolada do loop principal, recarregando `VirtualPositions` virtuais no escopo local temporário para não sujar o DB principal.
   
2. **Back-end - Isolamento de Threads:**
   - Certificar-se que a tarefa de Grid Search utilize background tasks/filas eficientes e possua timeout seguro.

3. **Front-end - Novo Módulo Visual:**
   - Integrar aba de testes, incluindo um loader informando que o processamento "está rodando otimização em N milhares de registros históricos".

4. **Qualidade e Validação:**
   - Utilizar as rotinas baseadas em `test_backtest.py` e expandir para garantir que nenhuma simulação apague o histórico real armazenado no motor epistemológico.

---

> **Regra Absoluta (P0):** Nenhuma alteração nos pesos base pode acontecer automaticamente de forma cega. O Lóbulo Observacional apenas recomenda e o Humano / Operador assina e confirma a matriz de pesos desejada.
