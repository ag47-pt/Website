# Case 3: Knowledge Without Verdict

## Scenario
An attempt is made to transition the system to the `KNOWLEDGE_CREATED` state, registering a new Knowledge Entry. However, the referenced Integrity Verdict does not exist in the artifact registry (it was skipped or deleted).

## Expected Kernel Behavior
- **Kernel Component:** `state_machine` / `knowledge_engine`
- **Result:** `DENY`
- **Reason Code:** `MISSING_VALIDATION_EVIDENCE` (or `INVALID_STATE_TRANSITION`)
- **Explanation:** The system cannot promote knowledge without a verifiable chain leading back to a valid Integrity Verdict.
