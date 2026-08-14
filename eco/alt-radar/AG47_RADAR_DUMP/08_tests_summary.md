# Test Suite Summary & Critical Invariants

## Execution Results

- **Total Test Count**: 77 tests
- **Passed**: 77 (100%)
- **Failed / Skipped**: 0
- **Execution Time**: 22.92 seconds
- **Test Runner**: Pytest (Python 3.12/3.13)

---

## Test Suite Coverage by Module

| Test Module                | Coverage & Focus Areas                                                                                                                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `test_scoring.py`          | Validates deterministic v1 scoring formula, missing input zeroing, weight distribution (sum = 1.0), critical flag gates, and cross-provider discrepancy penalties.                                   |
| `test_invariants.py`       | Enforces mathematical and architectural invariants: UTC time preservation, score bounds $[0.0, 10.0]$, confidence bounds $[0.0, 1.0]$, non-negative liquidity/prices, and read-only mode guarantees. |
| `test_resilience.py`       | Tests `CircuitBreaker` states (CLOSED -> OPEN -> HALF-OPEN), exponential backoff, `Retry-After` header parsing, and `TTLCache` eviction under load.                                                  |
| `test_goplus.py`           | Tests EVM risk data normalization, honeypot detection, selfdestruct detection, tax percentage conversion, and unsupported chain rejection (e.g. Solana on EVM endpoint).                             |
| `test_api_endpoints.py`    | E2E integration tests for FastAPI routes (`/health`, `/system/status`, `/opportunities`, `/tokens/{id}`, `/watchlist`), verifying pagination, filtering, CORS headers, and rate-limiting.            |
| `test_alerts.py`           | Tests alert generation, deduplication key hashing, cooldown window suppression, and alert state transitions (`unread` -> `read` -> `acknowledged` -> `dismissed`).                                   |
| `test_backtest.py`         | Tests 24h backtesting engine, score vs. return correlation, and dynamic weight calibration routines.                                                                                                 |
| `test_events_signals.py`   | Tests event sourcing pipeline (`Snapshot` -> `Event` -> `Signal`), delta calculation, and signal threshold triggering.                                                                               |
| `test_knowledge_engine.py` | Tests `Hypothesis` generation, `Truth` post-window validation, historical accuracy calculation, and `GlobalKnowledge` updates.                                                                       |
| `test_microstructure.py`   | Tests price reaction evaluation over time windows (1m, 5m, 15m, 30m), order flow structure analysis, and priority tier assignments (Tier 1..3).                                                      |
| `test_timeline.py`         | Tests unified timeline pagination, multi-type event sorting, and evidence node linkage.                                                                                                              |
| `test_performance_load.py` | Evaluates system performance under concurrent load, database connection pool stability, and sub-100ms API response latency under load.                                                               |

---

## Critical Architectural Guarantees

1. **Strict Read-Only Operations**: Zero wallet execution, transaction signing, or order placement capabilities exist in the entire codebase.
2. **Deterministic & Versioned Scoring**: Scores are 100% reproducible given identical component inputs and carry `scoring_version = "v1.0.0"`.
3. **No Null Fallback Zeroing**: Missing provider data is never converted to a fake "zero risk" or "fake success". Missing fields remain `None` and explicitly penalize confidence.
4. **Data Provenance Isolation**: `is_demo` flag strictly segregates simulated test data from live blockchain data; live endpoints reject demo payloads.
5. **UTC Datetime Standardization**: All timestamps across SQLite, PostgreSQL, Python services, and JSON APIs are strictly forced to UTC (`TIMESTAMPTZ`).
