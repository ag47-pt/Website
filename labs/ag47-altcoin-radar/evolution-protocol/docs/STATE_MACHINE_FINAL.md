# Protocol State Machine

Version: 1.0.0  
Status: RATIFIED  
Date: 2026-08-07  

---

## 1. Linear Progression

The Evolution Protocol is governed by a strict, unidirectional state machine overseen by the Kernel.
Agents do not call other agents. The Kernel transitions the state and invokes the necessary agent.

The primary happy path:
`PENDING` 
→ `OBSERVING` (Observer) 
→ `ANALYZING` (Analyst) 
→ `PLANNING` (Planner) 
→ `REVIEWING` (Changeset Reviewer)
→ `EXECUTING` (Executor) 
→ `VALIDATING` (Validator) 
→ `LEARNING` (Knowledge Curator) 
→ `COMPLETED`

## 2. State Definitions

### `PENDING`
- **Trigger:** Cycle created.
- **Action:** Awaiting Kernel initialization.

### `OBSERVING`
- **Agent:** Observer
- **Input:** Workspace
- **Output:** `system-snapshot.json`
- **Transition:** If success, go to `ANALYZING`.

### `ANALYZING`
- **Agent:** Analyst
- **Input:** Snapshot, Target Architecture, Knowledge
- **Output:** `architecture-gap.json`
- **Transition:** If gap exists, go to `PLANNING`. If no gap, go to `COMPLETED` (Status: `no_op`).

### `PLANNING`
- **Agent:** Planner
- **Input:** Gap, Snapshot, Knowledge
- **Output:** `proposed-changeset.json`
- **Transition:** If plan created, go to `REVIEWING`.

### `REVIEWING`
- **Agent:** Changeset Reviewer (Deterministic)
- **Input:** Proposed Changeset
- **Output:** `03_changeset_review.json`
- **Transition:** If ALLOW, go to `EXECUTING`. If DENY, trigger Failure Recovery.

### `EXECUTING`
- **Agent:** Executor
- **Input:** Changeset
- **Output:** `execution-report.json`
- **Transition:** If success/partial, go to `VALIDATING`. If blocked/error, trigger Failure Recovery.

### `VALIDATING`
- **Agent:** Validator (Deterministic)
- **Input:** Execution Report, Changeset, Physical Workspace
- **Output:** `integrity-verdict.json`
- **Transition:** If ALLOW, go to `LEARNING`. If DENY, trigger Failure Recovery.

### `LEARNING`
- **Agent:** Knowledge Curator
- **Input:** Verdict, Report, History
- **Output:** `knowledge-entry.json`
- **Transition:** Take final snapshot, go to `COMPLETED`.

## 3. Terminal States

- `COMPLETED`: The cycle finished successfully. Either evolution occurred, or the system was already at the target state.
- `FAILED`: The cycle suffered an unrecoverable error or exhausted retries. Requires human intervention.
- `BLOCKED`: The cycle requires manual human input (e.g., manual review required by Reviewer or Validator) before it can proceed.
