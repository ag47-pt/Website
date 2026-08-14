# API Flow & Endpoint Architecture

## Overview

The API layer is built with **FastAPI** (`apps/api/src/ag47_radar/main.py`) using strictly typed **Pydantic v2** models (`apps/api/src/ag47_radar/schemas.py`). All public operational endpoints are registered under `/api/v1`, while a minimal `/health` probe remains available at the root level for cloud orchestrators.

---

## Key Endpoints Map

| Endpoint                                   | Method | Function / Handler File                 | Purpose                                                |
| ------------------------------------------ | ------ | --------------------------------------- | ------------------------------------------------------ |
| `/health`                                  | `GET`  | `health()` in `routes.py`               | Liveness & database readiness check                    |
| `/api/v1/opportunities`                    | `GET`  | `opportunities()` in `routes.py`        | Filter, search & pagination of scored tokens           |
| `/api/v1/tokens/{token_id}`                | `GET`  | `token_detail()` in `routes.py`         | Aggregated details (Token, Pairs, Market, Risk, Score) |
| `/api/v1/tokens/{token_id}/score`          | `GET`  | `token_score()` in `routes.py`          | Latest explainable score calculation                   |
| `/api/v1/tokens/{token_id}/risk`           | `GET`  | `token_risk()` in `routes.py`           | Security flags and risk assessment                     |
| `/api/v1/tokens/{token_id}/microstructure` | `GET`  | `token_microstructure()` in `routes.py` | Reaction, intent detection & priority tiering          |
| `/api/v1/system/status`                    | `GET`  | `system_status()` in `routes.py`        | System health, database & provider circuit metrics     |
| `/api/v1/system/calibration`               | `GET`  | `system_calibration()` in `routes.py`   | Weight calibration & backtest correlation              |
| `/api/v1/system/evolution`                 | `GET`  | `system_evolution()` in `routes.py`     | Evolution Engine current phase and roadmap status      |
| `/api/v1/system/knowledge`                 | `GET`  | `system_knowledge()` in `routes.py`     | MCOS integration endpoint for global knowledge         |

---

## 1. Opportunities Query Flow (`GET /api/v1/opportunities`)

### Request Parameters

```typescript
{
  q?: string;                // Search query (symbol or name)
  chain?: Chain[];           // Target chains: "bsc", "solana", "ethereum"
  min_score?: float;         // Minimum score threshold (0.0 to 10.0)
  max_risk?: float;          // Maximum risk score allowed
  max_pair_age_hours?: int;  // Age filter in hours
  min_liquidity?: float;     // Minimum liquidity USD filter
  sort_by?: string;          // "score" | "liquidity" | "volume" | "age"
  sort_order?: string;       // "desc" | "asc"
  page?: int;                // Page index (>= 1, default: 1)
  page_size?: int;           // Page size (1..100, default: 20)
}
```

### Handler Execution Path

1. `routes.py::opportunities()` accepts parsed query parameters and receives async `AsyncSession` via `Depends(get_session)`.
2. Delegated to `queries.py::list_opportunities(session, settings, ...)`:
   - Constructs SQLAlchemy 2 `select(Token)` query joined with `TradingPair`.
   - Filters out demo/live data mismatches based on `settings.demo_mode`.
   - Fetches the latest `MarketSnapshot`, `RiskAssessment`, and `OpportunityScore` for each token.
   - Calculates on-the-fly score via `get_score()` if a saved score is not pre-cached.
3. Wraps elements into `PaginatedResponse[OpportunityItem]`.

---

## 2. Token Scoring Flow (`GET /api/v1/tokens/{token_id}/score`)

### Handler Execution Path

1. `routes.py::token_score()` delegates to `queries.py::get_score(session, settings, token_id)`:
2. `get_score()` retrieves:
   - Latest `MarketSnapshot` for the token's active trading pair.
   - Latest `RiskAssessment` for the token contract.
   - Latest `SocialSnapshot` if available.
3. Computes component sub-scores:
   - `momentum_score`: calculated from 5m, 1h, 24h price and volume velocity.
   - `liquidity_score`: evaluated against pool depth.
   - `community_score`: derived from social growth metrics (or `None` if missing).
   - `distribution_score`: derived from top holder concentration.
   - `safety_score`: computed via `safety_from_risk(risk_score)`.
   - `data_quality_score`: based on provider quality headers.
4. Invokes `ag47_radar.services.scoring.calculate_score()` with:
   - `components`: `ScoreComponentsInput` containing the 6 normalized values.
   - `critical_flags`: codes extracted from `RiskAssessment` flags where `level == CRITICAL`.
   - `discrepancy_ratio`: calculated via `calculate_discrepancy()` if dual provider data exists.
5. Returns deterministic `ScoreCalculationResult` converted to `OpportunityScoreRead`.

---

## Error Handling Envelope

When errors occur, FastAPI exception handlers format errors uniformly:

```json
{
  "error": {
    "code": "resource_not_found",
    "message": "Token not found",
    "request_id": "req-9b841a0e",
    "details": null
  }
}
```

Internal exceptions do not leak stack traces to callers.
