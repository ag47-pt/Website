# Agent Runtime Specification

The Evolution Protocol considers Cognitive Layer Agents not as omnipotent entities, but as temporary spawned processes subjected to a strict lifecycle.

## Agent Lifecycle

An Agent must transition through the following operational states:

1. **REGISTERED**: The agent identity is known to the system but currently inactive.
2. **AVAILABLE**: The agent is online, health-checked, and waiting for tasks.
3. **ASSIGNED**: A specific workload (Task/Artifact Generation) is dispatched to the agent.
4. **EXECUTING**: The agent is actively parsing inputs, computing, and generating its artifact output.
5. **WAITING_FOR_KERNEL**: The agent has submitted its intent (changeset, verdict, etc.) and is suspended awaiting the Kernel's `ALLOW` or `DENY` decision.
6. **COMPLETED**: The Kernel replied with `ALLOW` and the agent successfully wrapped up its context.
7. **ARCHIVED**: The agent instance is destroyed, and its temporary memory is wiped.

## Failure States

Failure in the Cognitive Layer is expected and non-fatal to the Protocol. When a failure occurs, the Kernel logs it and dictates the recovery posture.

- **FAILED**: A catastrophic failure (e.g., syntax error in agent's own runtime). The task halts.
- **BLOCKED**: The agent requires a dependency that is missing.
- **TIMEOUT**: The agent took too long to generate an artifact or respond to the Kernel.
- **POLICY_DENIED**: The Kernel returned a `DENY`. The agent must read the `E0XX` trace and autonomously attempt a retry if within retry limits.
- **CONTEXT_INSUFFICIENT**: The agent realizes it cannot fulfill the task with the current snapshot (e.g., missing specific file contents) and yields back to the Observer.
- **HUMAN_REQUIRED**: The agent halts execution and hands control over to a human operator via the Kernel.

## Recovery Protocol

When an agent hits `POLICY_DENIED`, it does not crash. It suspends, reads the `DecisionTrace` provided by the Kernel, uses the error message to adjust its hypothesis or payload, and re-submits the transition intent. If it exceeds the maximum retry limit (e.g., 3 attempts), it enters `FAILED` and requires Human Intervention.
