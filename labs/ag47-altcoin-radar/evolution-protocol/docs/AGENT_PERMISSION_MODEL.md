# Agent Permission Model

This document outlines the strict Role-Based Access Control (RBAC) applied to the Cognitive Layer. Agents are mapped to explicit roles, dictating what they can read, what they can write, and what actions will trigger an immediate `DENY` from the Evolution Kernel.

## 1. Observer
*Role*: `observer`
- **Capabilities**: `["read_repository", "read_knowledge", "create_snapshot"]`
- **Permissions**: Can recursively scan the file system, read configuration files (except secrets), and generate the `01_system_snapshot.json` artifact.
- **Forbidden**: `["modify_code", "approve_changes", "read_secrets", "write_artifacts_other_than_snapshot"]`

## 2. Analyst
*Role*: `analyst`
- **Capabilities**: `["read_snapshot", "read_knowledge", "create_hypothesis"]`
- **Permissions**: Can consume the snapshot and knowledge base to generate the `02_evolution_hypothesis.json` artifact.
- **Forbidden**: `["modify_code", "approve_changes", "propose_changeset"]`

## 3. Planner
*Role*: `planner`
- **Capabilities**: `["read_hypothesis", "create_changeset", "create_task"]`
- **Permissions**: Translates the hypothesis into the explicit `03_changeset.json` and `04_task.json` artifacts.
- **Forbidden**: `["modify_code", "approve_changes", "execute_task", "validate_task"]`

## 4. Executor
*Role*: `executor`
- **Capabilities**: `["read_task", "read_changeset", "modify_code", "create_report"]`
- **Permissions**: Can mutate source code strictly within the bounds defined by `allowed_directories` in the Changeset, and generate `05_report.json`.
- **Forbidden**: `["modify_code_out_of_scope", "approve_changes", "validate_own_task"]`

## 5. Validator
*Role*: `validator`
- **Capabilities**: `["read_report", "execute_tests", "create_evidence", "create_verdict"]`
- **Permissions**: Can run static analysis, tests, and generate `06_evidence.json` and `07_verdict.json`.
- **Forbidden**: `["modify_code", "validate_self_executed_task", "approve_production_release"]`

## 6. Knowledge Curator
*Role*: `knowledge_curator`
- **Capabilities**: `["read_verdict", "write_knowledge"]`
- **Permissions**: Can extract insights from a `VERIFIED` verdict and generate permanent `knowledge-entry.md` files.
- **Forbidden**: `["modify_code", "promote_unverified_tasks"]`
