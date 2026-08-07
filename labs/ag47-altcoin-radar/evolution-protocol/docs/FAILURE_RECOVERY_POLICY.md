# Failure Recovery Policy

Version: 1.0.0  
Status: RATIFIED  
Date: 2026-08-07  

---

## 1. Core Principle

Failure in the AG47 Evolution Protocol is not an exception; it is a structural mechanism. 
When an agent fails, it must fail safely, locally, and transparently.

The Kernel manages failure by routing the cycle back to a safe point or halting it entirely. 
Agents **never** recursively retry their own actions autonomously.

## 2. Global Constants

- `MAX_CYCLE_RETRIES`: 3
- Infinite loops are technically impossible if the Kernel enforces the max retry counter.

## 3. Failure Routing Matrix

### Event: Reviewer DENY (During `REVIEWING`)
- **Reason:** Planner proposed a changeset that violates budget, scope, or logic.
- **Action:** Increment retry counter.
- **Routing:** Return to `PLANNING`. The Planner receives the Reviewer's denial reasons as feedback.
- **If Max Retries Exhausted:** State becomes `FAILED`. 

### Event: Executor Crash (During `EXECUTING`)
- **Reason:** The execution engine halted unexpectedly or could not parse the changeset.
- **Action:** Ensure Rollback is triggered. Increment retry counter.
- **Routing:** Return to `PLANNING`. The Planner receives the execution crash log as feedback.
- **If Max Retries Exhausted:** State becomes `FAILED`.

### Event: Validator DENY (During `VALIDATING`)
- **Reason:** The execution occurred, but physical artifacts or behavioral tests do not match the expected criteria.
- **Action:** Ensure Rollback is triggered. Increment retry counter.
- **Routing:** Return to `PLANNING`. The Planner receives the Validator's Evidence Bundle (what passed, what failed) and must propose a new `proposed-changeset`.
- *Why not Analyst?* Because the Architecture Gap has not changed. The Analyst accurately described reality and intention. The *plan* to bridge it was flawed, or the execution of the plan failed. The Planner must rethink the strategy.
- **If Max Retries Exhausted:** State becomes `FAILED`.

### Event: Curator DENY (During `LEARNING`)
- **Reason:** The Curator blocked the extraction of knowledge (e.g., duplicated learning, weak confidence).
- **Action:** Do NOT rollback the cycle. The execution was valid.
- **Routing:** The cycle proceeds to `COMPLETED`, but the result is marked as `knowledge_generated: false`. 
- *Why?* Failing to extract memory should not invalidate a successful physical evolution.

## 4. Rollback Protocol

When returning from `EXECUTING` or `VALIDATING` due to failure, the Kernel **must** ensure the environment is restored.
If `snapshot_before` was taken, the workspace must be reverted to that hash state before the Planner is invoked again.

If rollback fails, the cycle immediately enters `FAILED` and halts the entire Kernel process.
