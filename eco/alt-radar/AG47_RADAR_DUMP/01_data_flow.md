# Data Flow Architecture & Pipeline Execution

## Overview

The AG47 Altcoin Radar is an **epistemological observation engine** for crypto altcoins.
Data flows strictly unidirectionally from external DEX/Risk providers through resilient adapters, into append-only database snapshots, through deterministic scoring & hypothesis validation engines, and finally out to REST endpoints.

```text
HTTP Request / Scheduler
       │
       ▼
[ Provider Registry ] (DexScreener, GeckoTerminal, GoPlus)
       │ (ResilientJsonClient: Cache + Retries + CircuitBreaker)
       ▼
[ Provider Normalization ] -> Normalized ProviderResult[T]
       │
       ▼
[ Database Ingestion ] (Append-only MarketSnapshot, RiskAssessment)
       │
       ▼
[ Epistemological Engine ] ──► Event ──► Signal ──► Hypothesis ──► Truth ──► GlobalKnowledge
       │
       ▼
[ Scoring Engine ] -> calculate_score(components, critical_flags, discrepancy_ratio)
       │
       ▼
[ API Query Service ] -> get_score() / list_opportunities()
       │
       ▼
[ Pydantic Schemas ] -> OpportunityScoreRead / TokenDetailResponse JSON
```

---

## Detailed Step-by-Step Pipeline

### Step 1: Request & Ingestion Trigger

- **Scheduled Background Loop**: Triggered periodically via `APScheduler` in `apps/api/src/ag47_radar/scheduler.py` invoking `sync_opportunities()` in `apps/api/src/ag47_radar/services/ingestion.py`.
- **On-Demand Route Query**: Client calls `GET /api/v1/opportunities` or `GET /api/v1/tokens/{token_id}/score` defined in `apps/api/src/ag47_radar/api/routes.py`.

### Step 2: Provider Invocation & Resilience Layer

- **Provider Resolution**: `ProviderRegistry` (`apps/api/src/ag47_radar/providers/registry.py`) resolves active data source instances.
- **HTTP Transport**: Provider requests route through `ResilientJsonClient` (`apps/api/src/ag47_radar/providers/resilience.py`).
  - **Caching**: Check in-memory `TTLCache` before dispatching.
  - **Circuit Breaker**: `CircuitBreaker.before_request()` checks if provider failure threshold is exceeded.
  - **Retry & Backoff**: Exponential backoff with `Retry-After` header handling for HTTP status codes `{429, 500, 502, 503, 504}`.

### Step 3: Raw Provider Normalization

- **Market Data (`DexScreenerMarketProvider`)**: `apps/api/src/ag47_radar/providers/dexscreener.py`
  - Method: `search()` or `get_pair()`
  - Helper: `_normalize_pair()` maps raw JSON into standardized `MarketPairData` object. Missing values remain `None` (never padded with `0.0`).
- **Contract Risk (`GoPlusContractRiskProvider`)**: `apps/api/src/ag47_radar/providers/goplus.py`
  - Method: `assess()`
  - Helper: `_normalize()` evaluates 12 distinct contract security flags (honeypot, selfdestruct, hidden owner, mintable, taxes, liquidity lock) and outputs `ContractRiskData`.

### Step 4: Persistence Layer (Append-Only Snapshots)

- `ingest_pair()` in `apps/api/src/ag47_radar/services/ingestion.py` persists immutable records:
  - `Token` and `TradingPair` (stable identity models in `apps/api/src/ag47_radar/models.py`)
  - `MarketSnapshot` (append-only record of price, volume, liquidity, buy/sell transactions)
  - `RiskAssessment` (append-only security assessment and risk flags)

### Step 5: Epistemological Progression Engine

- **Event Extraction**: `apps/api/src/ag47_radar/services/events.py` computes deltas between sequential snapshots (`Snapshot -> Event`).
- **Signal Recognition**: `apps/api/src/ag47_radar/services/signals.py` translates events into domain-specific market phenomena (`Event -> Signal`).
- **Hypothesis Formulation & Truth Validation**: `apps/api/src/ag47_radar/knowledge/` predicts outcome, validates post-window reality (`Signal -> Hypothesis -> Truth`), and aggregates accuracy into `GlobalKnowledge`.

### Step 6: Scoring Engine & Confidence Derivation

- Called via `calculate_score()` in `apps/api/src/ag47_radar/services/scoring.py`.
- Sub-scores computed (each normalized [0.0, 10.0]):
  1. `momentum_score` (25%)
  2. `liquidity_score` (20%)
  3. `community_score` (15%)
  4. `distribution_score` (15%)
  5. `safety_score` (20%) — derived from `safety_from_risk(risk_score)`
  6. `data_quality_score` (5%)
- **Cross-Provider Discrepancy Penalty**: Calculated via `calculate_discrepancy(val1, val2)` comparing DexScreener vs GeckoTerminal. If discrepancy ratio > 15%, penalty is applied:
  `discrepancy_penalty = min(0.5, (discrepancy_ratio - 0.15) * 1.5)`
- **Confidence Formula**:
  `completeness = signals_available / len(WEIGHTS)`
  `base_confidence = completeness * (0.5 + 0.5 * quality)`
  `confidence = round(max(0.0, base_confidence * (1.0 - discrepancy_penalty)), 4)`
- **Critical Gate Override**: If `critical_flags` exist (e.g. honeypot, selfdestruct), `classification` is strictly forced to `OpportunityClassification.HIGH_RISK` (`"risco_elevado"`), while retaining the numeric score for auditability.

### Step 7: API Serialization

- Endpoint functions in `apps/api/src/ag47_radar/api/routes.py` (e.g. `opportunities()`, `token_score()`, `token_detail()`) invoke query services in `apps/api/src/ag47_radar/services/queries.py`.
- Results serialized via Pydantic v2 schemas (`apps/api/src/ag47_radar/schemas.py`), enforcing strict field validation, UTC datetime serializations, and `extra="forbid"`.
