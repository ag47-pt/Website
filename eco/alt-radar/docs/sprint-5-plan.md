# Plano do Sprint 5: Motor de Edge Estatístico, Análise de Performance e Conectividade Live

> **Registro histórico:** qualquer referência a `AG47_SCHEDULER_ENABLED` abaixo foi substituída no Hardening 1 por jobs externos duráveis.

## Objetivo Principal

> **Transicionar o AG47 Altcoin Radar de um sistema que "mede a si mesmo" (Truth Engine) para um sistema que "encontra e prova a vantagem estatística real (Edge)" e opera em modo real (`AG47_DEMO_MODE=false`).**

O Sprint 5 pega o ciclo fechado de observação e aprendizado construído no Truth Engine (`Snapshot -> Event -> Signal -> Hypothesis -> Validation -> Truth`) e responde à pergunta fundamental da engenharia financeira:
**"Quando o score é alto, o mercado realmente sobe com risco controlado ou é um falso positivo?"**

---

## 🎯 Pilares e Etapas de Implementação

### Pilar 1: Motor de Edge Estatístico & Performance Analytics (`services/performance_analysis.py`)

#### 1. Análise por Buckets de Score (`analyze_by_score_bucket`)

Mede empiricamente a performance agregada dos ativos nos intervalos:

- `0.0 – 4.0` (Baixo)
- `4.0 – 6.0` (Neutro)
- `6.0 – 7.0` (Moderado)
- `7.0 – 8.0` (Promissor)
- `8.0 – 9.0` (Forte)
- `9.0 – 10.0` (Excepcional)

**Métricas calculadas por bucket (janelas 15m, 1h, 24h):**

- **Win Rate (%)**: % de hipóteses com `actual_return_pct >= target_return_pct`.
- **Retorno Médio (%)**: Média de variação percentual observada.
- **Drawdown Médio (%)**: Média da queda máxima sofrida durante a janela.
- **Profit Factor**: $(\sum \text{Ganhos}) / (\sum |\text{Perdas}|)$.

#### 2. Análise da Curva de Confiança (`analyze_by_confidence`)

Testa se o valor de `confidence` é preditivo ou apenas estético nos intervalos:

- `0.0 – 0.3` (Confiança Baixa)
- `0.3 – 0.6` (Confiança Média)
- `0.6 – 0.8` (Confiança Alta)
- `0.8 – 1.0` (Confiança Extrema)

#### 3. Conversão de Classificações Heurísticas em Estatísticas

Refatorar a inferência do endpoint de insights para transicionar de limiares rígidos (`score > 8.0`) para validação empírica:

- `BUY_WATCH`: Apenas se o bucket histórico apresentar **Win Rate $\ge 62\%$** e **Drawdown Médio $\le 15\%$**.
- `CAUTION`: Se o bucket tiver Win Rate $< 45\%$ ou Drawdown Médio $> 25\%$, independente de ter score alto.

#### 4. Mitigação de Overfitting (Out-of-Sample Validation)

- Algoritmo de split temporal: 70% Amostra Inicial (In-Sample / Treino) vs 30% Amostra Recente (Out-of-Sample / Teste).
- Garantir que o edge reportado é consistente entre janelas do passado e do presente recente.

---

### Pilar 2: Providers Reais para Conectividade com o Mundo Externo (`AG47_DEMO_MODE=false`)

#### 1. Solana Contract Risk Provider (`providers/solana_risk.py`)

- O GoPlus Security atende prioritariamente redes EVM. Para cobrir tokens SPL de Solana em `demo_mode=false`, criar o provider **RugCheck API / Solscan API**.
- Extrai: se o mint authority está desativado (`mint_disabled`), se a liquidez está travada (`lp_burned`/`lp_locked`), e taxas de movimentação.

#### 2. Provider de Top Holders & Insider Risk (`providers/holders.py`)

- Implementar `HeliusHolderProvider` (Solana) e `EtherscanHolderProvider` (EVM).
- Mapeia a % da oferta total retida pelas 10 maiores carteiras (excluindo pools conhecidas de liquidez).

#### 3. Real Alert Delivery Provider (`providers/telegram_delivery.py`)

- Transicionar de `LogOnlyAlertDeliveryProvider` para cliente **Telegram Bot API** ativável por env (`AG47_TELEGRAM_BOT_TOKEN`, `AG47_TELEGRAM_CHAT_ID`).

---

### Pilar 3: Configuração de Produção & Ingestão Contínua

1. **Definição de Variáveis no `.env`**:
   ```env
   AG47_DEMO_MODE=false
   AG47_SCHEDULER_ENABLED=true
   AG47_SCHEDULER_INTERVAL_SECONDS=300
   AG47_AUTO_SEED_DEMO=false
   ```
2. **Suporte a PostgreSQL**:
   - Ajustar string de conexão em `Settings` (`postgresql+asyncpg://...`) para ambientes de produção.
3. **Loop Contínuo**:
   - O `run_ingestion_cycle` coleta dados reais de `GeckoTerminal` + `DexScreener`, pontua, aciona o `TruthEngine` para auditar posições anteriores e persiste na base real.

---

## 🛠️ Roteiro Passo a Passo de Execução

1. **Fase A (Edge Engine)**:
   - Criar `apps/api/src/ag47_radar/services/performance_analysis.py`.
   - Adicionar schemas `EdgeAnalysisRead`, `BucketPerformanceRead` em `schemas.py`.
   - Adicionar rota GET `/api/v1/performance/edge` em `api/v1/endpoints/performance.py` (ou `queries.py`).
   - Adicionar testes unitários para a análise de buckets em `tests/test_performance_analysis.py`.

2. **Fase B (Providers Reais)**:
   - Implementar `RugCheckSolanaRiskProvider` para cobrir contratos Solana em modo real.
   - Implementar cliente HTTP para disparo via Telegram em `providers/telegram.py`.
   - Atualizar `ProviderRegistry` para instanciar os novos providers quando `demo_mode=false`.

3. **Fase C (Validação de Produção)**:
   - Rodar a suíte inteira de testes (`pytest`).
   - Executar checklist audit `python .agent/scripts/checklist.py .`.

---

> _Regra Absoluta:_ O sistema permanece 100% read-only com respeito às blockchains. Sem carteiras, sem execução de ordens, sem chaves privadas.
