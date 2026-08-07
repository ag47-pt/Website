# Case 1: Self-Validation Forbidden

## Scenario
An AI Agent (UUID: 550e8400-e29b-41d4-a716-446655440000) generates an execution report. The exact same AI Agent then attempts to generate the Integrity Verdict for its own work.

## Expected Kernel Behavior
- **Kernel Component:** `validator` (Integrity Validator)
- **Result:** `DENY`
- **Reason Code:** `SELF_VALIDATION_FORBIDDEN`
- **Explanation:** The actor who executed the task cannot be the same actor who validates the evidence.
