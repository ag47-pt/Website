# Evolution Loop Manager Contract

Version: 1.0.0  
Status: RATIFIED  
Date: 2026-08-07  

---

## Identity

The Evolution Loop Manager is **not an agent**. 
It is deterministic Kernel infrastructure. It has no cognitive capabilities, does not use LLMs, and does not evaluate qualitative artifacts.

Its sole purpose is to enforce the `STATE_MACHINE_FINAL` and the `FAILURE_RECOVERY_POLICY` upon the Evolution Cycle, ensuring that agents are dispatched in the correct order, at the correct time, with the correct inputs, and within budget.

## Constitutional Rules

### Rule 1 — Zero Cognition
The Loop Manager MUST NOT inspect the contents of an artifact to make a transition decision, other than reading structured enum fields (e.g., checking if `integrity-verdict.json` contains `"verdict": "ALLOW"`).

### Rule 2 — Strict Enforcement
The Loop Manager MUST DENY execution attempts from agents that are not authorized for the current cycle state.
(e.g., The Executor cannot run if the state is `PLANNING`).

### Rule 3 — Budget Enforcement
The Loop Manager MUST halt the cycle and transition to `FAILED` if the Evolution Cycle Budget is exhausted (e.g., `max_retries` exceeded, `max_agent_calls` exceeded). Infinite loops are constitutionally illegal.

### Rule 4 — Human Authority
If a cycle enters `WAITING_HUMAN` or `BLOCKED`, the Loop Manager MUST pause all progression until an explicit external signal (manual resume) is received.

---

## Responsibilities

1. **Cycle Creation:** Instantiate new `evolution-cycle.json` records.
2. **State Transition:** Move the cycle from one valid state to another, emitting `cycle-event.json` records to the Event Ledger.
3. **Agent Dispatch Authorization:** Answer "Who is allowed to run now?" via the Agent Dispatcher.
4. **Failure Routing:** Apply the Failure Recovery Policy when an agent fails or a review/validation emits a `DENY`.
5. **Termination:** Safely transition to `COMPLETED` or `FAILED`.
