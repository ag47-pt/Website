# Cognitive Layer Architecture

The Cognitive Layer is designed as an assembly line of 6 highly specialized foundational agents. 

These agents act as "guest processes" within the Evolution OS. They do not orchestrate the system; they produce JSON artifacts that are judged by the Evolution Kernel.

```text
                 HUMAN OPERATOR
                       |
                       ↓
              COGNITIVE LAYER
 ┌───────────────────────────────────────────────┐
 │                                               │
 │  [1] Observer Agent                           │
 │  [2] Analyst Agent                            │
 │  [3] Planner Agent                            │
 │  [4] Executor Agent                           │
 │  [5] Validator Agent                          │
 │  [6] Knowledge Curator                        │
 │                                               │
 └───────────────────────────────────────────────┘
                       |
               ARTIFACT CONTRACTS
                       ↓
              EVOLUTION KERNEL
                       ↓
                  SOFTWARE
```

---

## 1. Observer Agent
*The Eyes of the System. Never mutates. Never hypothesizes.*

- **Responsibility**: Inspect the current physical reality of the repository.
- **Input**: Source Code, Environment variables, Directory structures.
- **Output**: `01_system_snapshot.json`
- **Permissions**: Read-only.
- **Kernel Interaction**: Does not request transitions. It purely maps the state of the world to establish the baseline truth.
- **Limits**: Cannot read secrets (`.env`). Cannot write files.

## 2. Analyst Agent
*The Brain of Discovery.*

- **Responsibility**: Identify gaps, bugs, or evolution opportunities based on the baseline reality.
- **Input**: `01_system_snapshot.json` + User Intent (if any).
- **Output**: `02_evolution_hypothesis.json`
- **Permissions**: Read-only context processing.
- **Kernel Interaction**: None. Hypothesis generation is a pure cognitive exercise.
- **Limits**: Cannot propose concrete code changes, only conceptual evolutions.

## 3. Planner Agent
*The Architect of the Contract.*

- **Responsibility**: Convert a hypothesis into a rigid, isolated execution contract.
- **Input**: `02_evolution_hypothesis.json`
- **Output**: `03_changeset.json`, `04_task.json`
- **Permissions**: Write (JSON Schemas only).
- **Kernel Interaction**: Submits the Task/Changeset to the Kernel to transition to `EXECUTION_ALLOWED`.
- **Limits**: Cannot execute the plan it created.

## 4. Executor Agent
*The Worker.*

- **Responsibility**: Implement the code strictly according to the approved plan.
- **Input**: `03_changeset.json` + `ALLOW` from Kernel.
- **Output**: Code mutations + `05_report.json`
- **Permissions**: Write (Source Code limited to `allowed_directories`).
- **Kernel Interaction**: After execution, submits the Report to the Kernel requesting `VERIFICATION_PENDING`.
- **Limits**: If it touches a file outside the changeset, the Kernel will emit `E004: OUT_OF_SCOPE_MUTATION`.

## 5. Validator Agent
*The Auditor.*

- **Responsibility**: Prove that the Executor's work fulfills the contract without breaking invariants.
- **Input**: `05_report.json`, Test Suites, Linter outputs.
- **Output**: `06_evidence.json`, `07_verdict.json`
- **Permissions**: Read-only Code, Execute Tests.
- **Kernel Interaction**: Submits Verdict to the Kernel requesting transition to `VERIFIED`.
- **Limits**: Cannot be the same instance/ID as the Executor (`E007: SELF_VALIDATION_FORBIDDEN`).

## 6. Knowledge Curator
*The Historian.*

- **Responsibility**: Transmute temporary execution context into permanent, reusable knowledge.
- **Input**: `07_verdict.json` (Must be `VERIFIED`).
- **Output**: `08_knowledge.json` / Markdown Knowledge Entries.
- **Permissions**: Write (`.evolution/knowledge/`).
- **Kernel Interaction**: Submits Knowledge to transition the task to `KNOWLEDGE_CREATED` (Terminal State).
- **Limits**: Cannot promote failed or unverified tasks.
