# Agent-Kernel Interface Contract

This document defines the strict communication boundary between the Cognitive Layer (Agents) and the Evolution Kernel. The Kernel is the source of truth, and Agents must format their intentions as structured payloads to receive an authoritative decision.

## 1. Intent Submission (Agent → Kernel)

Agents cannot mutate system state or advance the protocol lifecycle on their own. They must submit a payload to the Kernel proposing a transition.

**Request Format:**
```json
{
  "request_type": "propose_transition",
  "target_package": "evolution-protocol/runtime/active-task/",
  "actor": {
    "actor_id": "planner-agent-001",
    "actor_type": "AI",
    "roles": ["planner"]
  },
  "proposed_state": "EXECUTION_ALLOWED",
  "artifacts": [
    "04_task.json"
  ]
}
```

## 2. Kernel Verdict (Kernel → Agent)

Upon receiving an intent, the Kernel evaluates the state machine, static schema constraints, cross-artifact integrity, and policies. It returns a deterministic, parseable response.

**Response Format (ALLOW):**
```json
{
  "request": "Transition from TASK_CREATED to EXECUTION_ALLOWED",
  "checks": [
    {
      "policy": "state_transition_validity",
      "result": "passed"
    },
    {
      "policy": "schema_validation_check",
      "result": "passed"
    }
  ],
  "final": "ALLOW",
  "event_id": "8a3d4f1b-9e2c-4b5a-a1f9-03b7a5e8c9d2"
}
```

**Response Format (DENY):**
```json
{
  "request": "Transition from UNKNOWN to VERIFIED",
  "checks": [
    {
      "policy": "state_transition_validity",
      "result": "passed"
    },
    {
      "policy": "out_of_scope_check",
      "result": "failed",
      "details": "File infrastructure/database/prod.sql was modified but is outside the allowed directories."
    }
  ],
  "final": "DENY",
  "reason": "E004_OUT_OF_SCOPE_MUTATION",
  "event_id": "fb67f4e9-da80-4632-a673-0d8410ebe471"
}
```

## 3. Cognitive Re-Routing

When an Agent receives a `DENY`, it MUST NOT bypass the Kernel. The Agent is expected to:
1. Parse the `reason` and `checks[x].details`.
2. Generate a hypothesis on why the failure occurred (e.g., "I attempted to modify a file not declared in `03_changeset.json`").
3. Correct the artifact (e.g., revert the forbidden modification or request an expanded scope).
4. Re-submit the Intent.
