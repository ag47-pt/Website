# Kernel Error Taxonomy

The Evolution Kernel provides a deterministic taxonomy of error codes. The Cognitive Layer must be programmed to map these error codes to specific recovery actions.

| Code | Name | Description | Cognitive Layer Action |
|------|------|-------------|------------------------|
| **E001** | `INVALID_STATE_TRANSITION` | Attempted to jump to a state without completing prerequisites. | Ensure all required artifacts for the current lifecycle stage are generated before transitioning. |
| **E002** | `MISSING_EVIDENCE` | A transition requires evidence (e.g., a test report, a validation verdict) that is missing. | Wake up the Validator or Executor agent to produce the missing artifact. |
| **E003** | `UNAUTHORIZED_ACTOR` | The actor attempting the action does not have the required role. | Re-route the task to the correct agent (e.g., only a Human can act as `release-manager`). |
| **E004** | `OUT_OF_SCOPE_MUTATION` | The Execution Report indicates a change to files outside the declared `allowed_directories` in the Changeset. | The Executor must revert the forbidden changes, OR the Planner must formally propose an updated Changeset. |
| **E005** | `MISSING_HUMAN_APPROVAL` | An action requires human signature (e.g., Production Release) but an AI attempted to sign it. | Halt AI execution and surface a prompt/ticket to the human operator. |
| **E006** | `INVALID_ARTIFACT_SCHEMA` | An artifact failed JSON Schema Draft 2020-12 validation. | Inspect the validation `details` in the Decision Trace, correct the JSON payload format, and re-submit. |
| **E007** | `SELF_VALIDATION_FORBIDDEN` | The Executor ID matches the Validator ID. | Re-assign the Validation task to an independent Validator Agent or Human. |
| **E008** | `KNOWLEDGE_PROMOTION_REJECTED` | Attempted to move an Active Task to Knowledge without a successful `VERIFIED` state. | Run the Validation phase successfully before promoting to Knowledge. |

## Recovery Strategy

Agents are expected to read `E0XX` and match it against their internal recovery routines. A `DENY` is not a fatal crash; it is a systemic boundary enforcement that guides the agent back to the correct protocol path.
