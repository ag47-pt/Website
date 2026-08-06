# Arquitetura

## Contexto e fronteiras

O Radar é um produto independente dentro de `labs` para preservar o site Ag47.pt e os laboratórios existentes.

### Filosofia: O Lóbulo Especializado (Organismo Cognitivo)

O Radar não é um sistema monolítico desenhado para saber de tudo; ele é um **lóbulo especializado** (o "cardiologista" de altcoins) que alimentará um futuro **Organismo Cognitivo AG47**.
Ele não mistura geopolítica ou economia com crypto. A arquitetura é construída para que o Radar extraia, processe e normalize **Conhecimento** e sirva esse conhecimento estruturado via API. No futuro, um LLM integrador fará o raciocínio cruzado consumindo a interface pública deste e de outros lóbulos.

### Princípio Epistemológico

Nenhuma informação é descartada. Todo dado observado deve evoluir para conhecimento reutilizável. O fluxo de dados opera com separação estrita entre observação empírica e interpretação:

```text
Snapshot (O que é) -> Event (O que mudou) -> Signal (Significado básico) -> Hypothesis (Conclusão provável) -> Validation (Avaliação) -> Knowledge (Padrão comprovado)
```

A UI nunca acessa providers externos diretamente. FastAPI concentra normalização, persistência, explicabilidade, validação de hipóteses e proteção de segredos.

```mermaid
flowchart LR
    Web[Next.js web] -->|REST /api/v1| API[FastAPI]
    API --> DB[(PostgreSQL / SQLite)]
    Scheduler[APScheduler] -->|every 15 min| Ingestion[Ingestion service]
    Scheduler -->|every 6 h| TruthEng[Truth Engine]
    Scheduler -->|every 12 h| Calibration[Scoring Calibration]
    Ingestion --> GeckoT[GeckoTerminal discovery]
    Ingestion --> DexS[DexScreener market]
    Ingestion --> GoPlus[GoPlus risk EVM]
    Ingestion --> RugCheck[RugCheck Solana]
    Ingestion --> Telegram[Telegram Bot API]
    Ingestion --> DB
    Ingestion --> Scoring[Scoring v2 composto]
    Scoring --> Alerts[Alert engine]
    Alerts -->|Filtros + Edge ≥ 65%| TgDispatch[Telegram dispatch bg]
    Alerts --> NotifLog[NotificationDelivery log]
    TruthEng --> DB
    Calibration --> DB
    Demo[Demo fixtures] --> Ingestion
```

## Componentes

### Web

- App Router com layouts e páginas como Server Components por padrão.
- Um provider cliente estreito fornece TanStack Query e contexto de filtros globais.
- Zod valida respostas recebidas antes que dados alcancem componentes.
- A tabela usa TanStack Table; gráficos usam Recharts carregado apenas nos painéis necessários.
- Loading, error, empty, partial, stale e demo são estados explícitos, não variações cosméticas de sucesso.
- A Inbox (`alert-inbox.tsx`) possui um visualizador expansível do breakdown do score por componente (DexScreener, GoPlus, RugCheck, Holders, Liquidez/Volume).
- O workspace (`system-workspace.tsx`) possui abas ativas para Diagnóstico de Circuit Breakers, Filtros de Notificação e Histórico de Entregas.

### API

- Rotas HTTP ficam finas e delegam consultas, scoring, alertas e ingestão a serviços.
- Pydantic valida entradas e respostas (`schemas.py`); um envelope de erro inclui código e request ID sem stack trace.
- O prefixo público é `/api/v1`; `/health` permanece simples para orquestradores.
- Endpoints principais: `/tokens`, `/alerts`, `/alerts/edge-inbox`, `/truths/stats`, `/ingest/trigger`, `/system/status`, `/system/providers/{id}/reset-circuit`, `/system/notification-settings`, `/system/notifications`.
- CORS aceita somente origens configuradas e as mutações de watchlist usam limite por IP/janela.

### Persistência

- `Token` e `TradingPair` formam as identidades estáveis.
- Snapshots de mercado, social e risco são append-only para preservar procedência e evolução.
- `OpportunityScore` armazena pesos derivados, confiança, explicação e versão do algoritmo.
- `Alert` possui chave de deduplicação, janela configurável, campo `confidence` (`low | medium | high | critical`) e `truth_status` (`true_positive | false_positive | inconclusive`).
- `NotificationDelivery` regista cada tentativa de entrega de alerta (Telegram), com status (`success | failed | pending`), payload, tentativas e erros.
- `UserNotificationSettings` persiste os filtros configurados pelo operador (`min_severity`, `min_confidence`, `allowed_chains`).
- `ScoringWeights` persiste as matrizes de calibração dinâmica geradas pelo backtest periódico.
- `TokenTruth` armazena os resultados de retrospecção do Truth Engine para feedback loop.
- `WatchlistEntry` é única por token e persiste em banco.
- Endereços EVM têm uma representação normalizada em lowercase para unicidade; endereços Solana preservam case.

PostgreSQL usa `TIMESTAMPTZ`; o fallback SQLite é normalizado para UTC na borda da aplicação. Índices cobrem identidades, FKs, timestamps de captura, score, deduplicação e `truth_status`.

## Fluxo de dados

1. GeckoTerminal retorna pools criados nas últimas 48 horas por rede habilitada.
2. A normalização rejeita itens inválidos, preserva erros parciais e deduplica por `chain + pair_address`.
3. DexScreener enriquece market data em contratos internos com campos opcionais.
4. GoPlus fornece análise de risco de contrato (honeypot, mintable, blacklist, taxas) para chains EVM. RugCheck cobre Solana.
5. Telegram Bot API ingere sinais de canais configurados (text-only).
6. Cada coleta persiste sua fonte, qualidade, duração e horário UTC.
7. O scoring v2 calcula sub-scores com pesos dinâmicos (calibrados via backtest a cada 12 h) sem transformar ausências em zero seguro. Cold start (< 100 truths) recua para pesos hardcoded.
8. O alert engine aplica filtro de Edge estatístico (win rate ≥ 65% com amostra ≥ 30), suspende por Drawdown (3 falhas consecutivas) e atribui confidence tier.
9. O dispatcher de alertas verifica os `UserNotificationSettings` (severidade mínima, confiança mínima e redes permitidas) antes de acionar a notificação assíncrona via Telegram em background com retry exponencial (3 tentativas, $2^{attempt}$ s).
10. O Truth Engine re-avalia tokens após 24 h: price delta ≥ +20% → true_positive; ≤ −30% → false_positive; else → inconclusive.
11. A UI consulta somente a API interna e converte horários para o timezone configurado pelo utilizador.

## Providers

Contratos separados cobrem descoberta, mercado, blockchain, holders, risco, social e entrega de alertas. Todo resultado inclui dados, fonte, coleta, qualidade, erros parciais, duração, modo e estado stale.

| Provider | Tipo | Cadeia | Notas |
|----------|------|--------|-------|
| GeckoTerminal | Descoberta | Multi-chain | Pools < 48 h |
| DexScreener | Mercado | Multi-chain | Enriquecimento de market data |
| GoPlus | Risco | EVM | Honeypot, mintable, blacklist, taxas, lock |
| RugCheck | Risco | Solana | Auditoria de contrato |
| Telegram Bot | Sinais / Alertas | N/A | `getUpdates`, disparo de alertas em background, retry exponencial |
| Demo fixtures | Todos | N/A | NOVA/FARMX/ORBIT/LYNX/PULSE, `source=ag47_demo_fixture` |

O mecanismo HTTP compartilhado possui timeout, retry somente para falhas transitórias, respeito a `Retry-After`, cache TTL e circuit breaker per-provider (estados: CLOSED → OPEN → HALF-OPEN, cooldown 45 s). A UI expõe o estado de cada circuito e permite reset manual via `/api/v1/system/providers/{id}/reset-circuit`. Cache real stale pode ser servido como stale; fixtures só são permitidas quando o modo demo foi selecionado explicitamente.

## Tarefas agendadas

APScheduler executa 3 cron jobs quando `SCHEDULER_ENABLED=true`. Um lock em processo impede sobreposição por job. O MVP pressupõe uma réplica; múltiplas réplicas exigirão worker/lock distribuído em sprint futuro.

| Job | Intervalo | Serviço | Descrição |
|-----|-----------|---------|-----------|
| `ingestion` | 15 min | `ProviderRegistry.ingest_all()` | Busca todos os providers, normaliza, persiste, scoring + alerts |
| `truth-engine` | 6 h | `TruthEngine.evaluate_pending()` | Re-avalia tokens com `truth_status=NULL` e age ≥ 24 h |
| `scoring-calibration` | 12 h | Backtest dinâmico | Recalcula pesos de scoring com base em truths validadas, persiste `ScoringWeights` |

## Decisões principais

- FastAPI separado foi mantido porque ingestão periódica e providers não se encaixam bem em funções efêmeras do Next.
- SQLAlchemy 2 permite o mesmo domínio em PostgreSQL e fallback SQLite sem criar duas implementações.
- Offset pagination é suficiente para o volume do Sprint 1 e permite saltar páginas; keyset fica reservado para escala maior.
- Demo é uma procedência, não um fallback invisível.
- O score é heurístico e explicável; machine learning foi deliberadamente adiado por ausência de histórico confiável.
- Nenhum código do APEX cripto existente foi reutilizado, pois contém sizing e linguagem de execução fora dos limites do Radar.

## Segurança operacional

- Nenhum endpoint de transação existe.
- URLs externas são aceitas apenas após validação de esquema HTTP/HTTPS e origem conhecida.
- O backend não registra secrets nem headers de autenticação.
- Erros inesperados são correlacionados por request ID e retornam mensagem genérica.
- Dependências possuem lock no frontend e instalação reproduzível no backend.
