# Evolution Engine & Epistemological Architecture

## Overview

The AG47 Altcoin Radar is designed as a **Specialized Observational Lobe** for the larger AG47 Cognitive Organism ("Organismo Cognitivo").
Unlike standard cryptocurrency scanners that display static, transient UI dashboards, the Radar acts as a knowledge construction engine that incrementally elevates raw observations into verified historical memory.

---

## 1. The Epistemological Ladder

Data progresses through an irreversible 6-stage evidence ladder (`docs/epistemology.md`):

```text
Snapshot ──► Event ──► Signal ──► Hypothesis ──► Truth ──► GlobalKnowledge
```

1. **Snapshot**: Absolute, static state of an asset at a single instant (`Liquidity = $1M`, `Price = $1.50`). Contains zero interpretation.
2. **Event**: Mathematical delta between two sequential snapshots (`Liquidity expanded +30% in 5 min`).
3. **Signal**: Translation of events into domain-recognized market phenomena without over-asserting causality (`liquidity_volume_expansion`).
4. **Hypothesis**: Inferential pattern matching (`accumulation_suspected`) attached to a verifiable expectation window (e.g. "Price will rise >5% in 24h").
5. **Truth**: Immutable post-window evaluation comparing expected vs. actual outcome (`Expected >5%, observed -2% -> Status: FAILURE`).
6. **GlobalKnowledge**: Accumulated statistical memory by context (`Pattern "liquidity_volume_expansion" has 81% win rate on Solana in Bull regimes, but 40% in Bear regimes`).

---

## 2. Dynamic Evolution Tracker (`EVOLUTION_STATUS`)

The live state of the platform is exposed directly via the `/api/v1/system/evolution` endpoint (`apps/api/src/ag47_radar/evolution.py`):

```python
EVOLUTION_STATUS = EvolutionStatusRead(
    phase="Sprint 5",
    phase_title="Alertas Determinísticos",
    now="Alertas acionados apenas após verificação de confiança dos sinais, com inbox e timeline explicável.",
    completed_steps=4,
    total_steps=5,
    goal="Lóbulo Observacional do Organismo Cognitivo",
)
```

---

## 3. Sprint Execution Roadmap

Historical progression and upcoming milestones recorded in `docs/next-sprints.md`:

- **Sprint 1**: Base UI/API, database schemas, fundamental scoring v1.
- **Sprint 2**: Timeline event sourcing, ingestion loop hardening, component isolation.
- **Sprint 3**: Performance audit, strict database invariants, concurrency & idempotency guarantees.
- **Sprint 4**: Invisible Epistemological Engine (`Knowledge Engine`, `Hypothesis`, `Validation`).
- **Sprint 5 (Current)**: Deterministic Signals & Alerts Inbox (Confidence-gated notifications, deduplication, rule versioning).
- **Future Horizon**: Cross-LLM MCOS integration (`/system/knowledge`), Webhook delivery, multi-chain smart contract bytecode analysis, and wallet cluster tracking.

---

## 4. Change Recording & Governance

1. **Database Schema Governance**: Managed via Alembic migrations (`apps/api/alembic/versions/`). Every schema change is explicitly versioned (e.g. `e398a6ae4278_add_tokentruth_and_globalknowledge`).
2. **Deterministic Rules & Scoring**: Scoring algorithm (`v1.0.0`) and risk rules (`goplus-rules-v1`) embed rule versions in database records and API responses to guarantee full backward auditability.
3. **Strict Boundaries (Non-Negotiable)**:
   - System is 100% read-only relative to blockchains.
   - Zero private key storage, trade execution, wallet creation, or front-running bots.
   - Demo and Live data provenance are strictly isolated and never silently merged.
