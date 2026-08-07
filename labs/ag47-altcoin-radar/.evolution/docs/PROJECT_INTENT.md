# Project Intent — AG47 Altcoin Radar

## Goal
Build a high-performance, real-time observational intelligence dashboard and analytical engine for identifying and scoring emerging opportunities in cryptocurrency altcoin markets.

## Scope & Operational Boundaries
- **Strict Read-Only Architecture:** The system MUST remain strictly read-only regarding external blockchains and exchanges.
- **No Autonomous Execution:** Under no circumstances shall the system create wallets, manage seed phrases/private keys, perform order execution, trade automation, sniping, or front-running.
- **Data Provenance Transparency:** `demo` and `live` market data must have visible, explicit provenance and must NEVER be silently combined or mixed in the same entity.
- **Data Integrity:** Missing or unknown numerical values MUST be represented as `null`/unknown, never defaulted to `0` or arbitrary fallbacks for convenience.
- **Timezone Standard:** All backend logic and data storage MUST operate strictly in UTC, converting to local user timezone only at the presentation/UI layer.

## Target Level
Production-Grade Observational Radar Engine.

## Non-Functional Requirements
- Normalized external provider contracts with mandatory timeout, selective retry, caching, and circuit breaker protection.
- Deterministic, versioned, and test-covered scoring algorithms.
- Complete auditability of signal generation and data ingestion.
