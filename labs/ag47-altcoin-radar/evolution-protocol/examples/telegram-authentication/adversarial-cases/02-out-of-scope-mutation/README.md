# Case 2: Out of Scope Mutation

## Scenario
The Proposed Changeset strictly limits file modifications to the `apps/api/` directory. However, the Execution Report claims that `infrastructure/database/prod.sql` was modified.

## Expected Kernel Behavior
- **Kernel Component:** `policy_engine`
- **Result:** `DENY`
- **Reason Code:** `OUT_OF_SCOPE_MUTATION`
- **Explanation:** The execution mutated files outside the allowed directories defined in the changeset contract.
