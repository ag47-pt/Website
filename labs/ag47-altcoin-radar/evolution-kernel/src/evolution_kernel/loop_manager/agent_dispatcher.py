"""
Agent Dispatcher

Determines which agent is authorized to run based on the current CycleState.
Provides the expected input artifacts and expected output artifacts.
"""
from evolution_kernel.loop_manager.cycle_state_machine import CycleState

class DispatchError(Exception):
    pass

# Maps state to authorized agent and artifact contracts
AGENT_DISPATCH_REGISTRY = {
    CycleState.OBSERVING: {
        "agent": "observer",
        "inputs": [],
        "output": "01_system_snapshot.json"
    },
    CycleState.ANALYZING: {
        "agent": "analyst",
        "inputs": ["01_system_snapshot.json"],
        "output": "02_architecture_gap.json"
    },
    CycleState.PLANNING: {
        "agent": "planner",
        "inputs": ["01_system_snapshot.json", "02_architecture_gap.json"],
        "output": "03_proposed_changeset.json"
    },
    CycleState.REVIEWING: {
        "agent": "changeset_reviewer",
        "inputs": ["03_proposed_changeset.json"],
        "output": "03_changeset_review.json" # Verdict
    },
    CycleState.EXECUTING: {
        "agent": "executor",
        "inputs": ["03_proposed_changeset.json"],
        "output": "04_execution_report.json"
    },
    CycleState.VALIDATING: {
        "agent": "validator",
        "inputs": ["03_proposed_changeset.json", "04_execution_report.json"],
        "output": "05_integrity_verdict.json"
    },
    CycleState.LEARNING: {
        "agent": "knowledge_curator",
        "inputs": ["05_integrity_verdict.json", "04_execution_report.json"],
        "output": "knowledge_entry.json" # Actually goes into .evolution/knowledge/
    }
}


def authorize_agent(current_state: CycleState, requested_agent: str) -> bool:
    """Returns True if the requested_agent is authorized for the current state."""
    config = AGENT_DISPATCH_REGISTRY.get(current_state)
    if not config:
        return False
    return config["agent"] == requested_agent


def get_dispatch_config(current_state: CycleState) -> dict:
    """Returns the inputs/outputs expected for the current state."""
    config = AGENT_DISPATCH_REGISTRY.get(current_state)
    if not config:
        raise DispatchError(f"No agent configured for state {current_state}")
    return config
