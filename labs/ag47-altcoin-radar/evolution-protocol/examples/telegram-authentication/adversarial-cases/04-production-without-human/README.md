# Case 4: Production Release Without Human

## Scenario
A task for a production release is executed. The policy demands that `production_release` tasks MUST have a human validator. However, an `AI_AGENT` attempts to issue the Integrity Verdict.

## Expected Kernel Behavior
- **Kernel Component:** `policy_engine`
- **Result:** `DENY`
- **Reason Code:** `HUMAN_APPROVAL_REQUIRED`
- **Explanation:** The system policy strictly enforces that a human must sign off on production releases. The AI Agent lacks the capability.
