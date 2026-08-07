# Plano do Sprint 12: Simulação de Carteira Virtual Observacional & Análise de Portfólio [CONCLUÍDO]

## Objetivo Principal

> **[CONCLUÍDO] Implementar uma camada de *Paper Trading* estritamente read-only (observacional), permitindo ao operador acompanhar o desempenho teórico de estratégias baseadas nos alertas de Edge, com métricas consolidadas (Curva de Equidade, Profit Factor e Drawdown) sem nenhuma conexão real a carteiras ou execução de ordens.**

---

## 🎯 Pilares de Implementação

### Pilar 1: Motor de Simulação de Paper Trading (Back-end)
1. **Modelagem de Dados:**
   - Criar as tabelas `VirtualPortfolio` e `VirtualPosition` em `models.py`.
   - `VirtualPosition` deve rastrear: `token_symbol`, `entry_price` (com base no alerta), `simulated_size` (ex: $100 fixos), `current_price` (atualizado periodicamente) e `status` (OPEN/CLOSED).
2. **Lógica de Execução Teórica:**
   - Desenvolver o serviço de simulação que "compra" virtualmente o ativo no momento em que um Alerta de Edge (≥ 65%) é disparado, utilizando o preço capturado naquele momento.
   - Definir regras estáticas ou configuráveis de saída teórica (Take Profit / Stop Loss / Time-based exit).

### Pilar 2: Endpoints Analíticos de Performance
1. **Cálculo de Métricas:**
   - Criar `GET /api/v1/portfolio/metrics` para retornar os indicadores da carteira virtual: `total_pnl`, `profit_factor`, `win_rate`, e `max_drawdown`.
   - Criar `GET /api/v1/portfolio/equity-curve` devolvendo a série temporal de capital simulado.
2. **Listagem de Posições:**
   - Criar `GET /api/v1/portfolio/positions` (ativas e histórico de fechadas).

### Pilar 3: Dashboard de Análise de Portfólio (Front-end Next.js)
1. **Componentes Visuais:**
   - Criar a página ou aba de **"Portfólio Virtual"** exibindo o saldo simulado, o Profit Factor, e um gráfico em linha demonstrando a curva de equidade teórica.
2. **Tabela de Posições Abertas:**
   - Exibir PNL em tempo real para as posições virtuais ativas e marcação a mercado.

---

## 🛠️ Roteiro de Execução Recomendado (Para o Agente Executor)

1. **Back-end - Banco de Dados e Modelos:**
   - Adicionar os modelos SQLAlchemy (`VirtualPortfolio`, `VirtualPosition`) em `models.py`.
   - Atualizar `schemas.py` com as representações baseadas em Pydantic.

2. **Back-end - Serviços de Simulação:**
   - Criar `services/portfolio.py` para abrigar a lógica de entrada/saída teórica (integrado ou escutando a geração de alertas no `alerts.py`).
   - Adicionar rotas em `routes.py`.

3. **Front-end - Interface (Next.js 16):**
   - Atualizar a navegação lateral (`sidebar.tsx`) incluindo a aba "Portfólio Virtual" e/ou integrar no workspace existente.
   - Conectar as mutations e queries via React Query em `lib/api/query.ts`.

4. **Qualidade e Limites Estritos:**
   - Escrever testes em `test_portfolio.py` garantindo o isolamento da simulação.
   - Executar compilação estrita em `apps/web` (`npx tsc --noEmit`).

---

> **Regra Absoluta (P0):** Nenhuma integração com blockchain reais ou assinaturas de carteiras deve ocorrer. O módulo deve ser 100% focado na avaliação teórica e offline das heurísticas do sistema.
