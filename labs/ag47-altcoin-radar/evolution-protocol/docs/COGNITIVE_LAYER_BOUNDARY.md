# Cognitive Layer Boundary

The Evolution Protocol is an operating system for software evolution. The Cognitive Layer represents the suite of intelligent agents (AI or hybrid) invited to work within this operating system.

To ensure the integrity, security, and predictability of the software, the boundary between the Cognitive Layer and the Evolution Kernel is absolute and inviolable.

## What the Cognitive Layer CAN Do (✅ ALLOWED)

- **Analyze Context**: Read the codebase, analyze the snapshot, and generate hypotheses about existing problems or missing features.
- **Formulate Plans**: Break down a hypothesis into a concrete, isolated JSON Changeset and Task payload.
- **Propose Changes**: Submit formatted JSON artifacts to the Kernel asking for permission to execute a transition.
- **Write Code**: Upon receiving `ALLOW` from the Kernel for `EXECUTION`, write code within the specific directories declared in the Changeset.
- **Generate Evidence**: Execute tests, capture logs, and generate an Execution Report.
- **Validate Externally**: Act as a Validator agent to review another Executor agent's work.
- **Interpret Errors**: Read Kernel `DENY` traces (`E0XX`), diagnose the failure, and autonomously attempt a corrected submission.

## What the Cognitive Layer CANNOT Do (❌ FORBIDDEN)

- **Bypass the Kernel**: No agent may modify production software directly without an active, Kernel-approved Task.
- **Ignore DENY States**: If the Kernel returns a `DENY`, the Agent cannot proceed with execution. The Agent must fix the rejection criteria first.
- **Self-Validate**: An agent that executes a task (`actor_id = A`) cannot sign the Validation Verdict for its own task.
- **Forge Human Signatures**: No AI agent can set its `actor_type` to `HUMAN` or assume `release-manager` privileges to force a production release.
- **Mutate Outside Scope**: An agent cannot modify files outside the `allowed_directories` array explicitly approved in the Changeset.
- **Promote Knowledge Unilaterally**: An agent cannot create a Knowledge Entry in `.evolution/knowledge/` unless the corresponding Active Task has successfully passed the `VERIFIED` state through the Kernel.

## The Glass Box Principle

The Kernel is a "Glass Box". When it blocks an action, it provides the exact reason (via `DecisionTrace` and `EventLedger`). The Cognitive Layer must be designed not as an all-powerful orchestrator, but as a resilient consumer of these traces, capable of correcting its behavior to conform to the Protocol's laws.
