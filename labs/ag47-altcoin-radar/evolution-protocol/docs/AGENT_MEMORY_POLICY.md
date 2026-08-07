# Agent Memory Policy

**Core Tenet: No agent possesses sovereign, private memory. All memory belongs to the Evolution Protocol.**

Allowing an AI model to maintain an infinite, un-auditable context window leads to "hallucination cascading", where false assumptions mutate into unrecoverable state drifts. To prevent this, the Evolution Protocol segments memory into three strict tiers:

## 1. Temporary Memory (Context / Scratchpad)
- **Scope**: Lives only during the `EXECUTING` state of an individual agent instance.
- **Contents**: LLM context windows, scratchpad reasoning (`<thinking>`), intermediate embeddings, token history.
- **Persistence**: **Zero**. When the agent hits `COMPLETED` or `ARCHIVED`, this memory is destroyed. It cannot be passed to another agent.

## 2. Operational Memory (Artifacts)
- **Scope**: Lives during the lifecycle of an Active Task (`.evolution/runtime/active-task/`).
- **Contents**: The raw JSON artifacts exchanged between the Cognitive Layer and the Kernel (`01_system_snapshot.json`, `04_task.json`, `05_report.json`, `DecisionTrace`, etc.).
- **Persistence**: Persists only until the task transitions to a terminal state (`VERIFIED` or `FAILED`). It is readable by all downstream agents (e.g., the Validator reads the Executor's Report).

## 3. Knowledge Memory (Permanent)
- **Scope**: Belongs to the system permanently (`.evolution/knowledge/`).
- **Contents**: Synthesized rules, architectural invariants, and historic post-mortems (`knowledge-entry.md`).
- **Persistence**: **Absolute**. This memory is read by the Observer/Analyst in future tasks.
- **Promotion Rule**: Operational Memory can only be promoted to Knowledge Memory by the **Knowledge Curator** agent, AND ONLY IF the Active Task achieved a `VERIFIED` state authorized by the Kernel. 

*If an agent wants to "remember" something for the future, it must formally promote it through the protocol lifecycle. It cannot just "keep it in mind".*
