"""
State Machine Engine for Evolution Cycle.

Defines all valid states, terminal states, and valid forward transitions.
"""
from enum import Enum

class CycleState(str, Enum):
    PENDING = "PENDING"
    OBSERVING = "OBSERVING"
    ANALYZING = "ANALYZING"
    PLANNING = "PLANNING"
    REVIEWING = "REVIEWING"
    EXECUTING = "EXECUTING"
    VALIDATING = "VALIDATING"
    LEARNING = "LEARNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    BLOCKED = "BLOCKED"
    WAITING_HUMAN = "WAITING_HUMAN"
    ROLLED_BACK = "ROLLED_BACK"

TERMINAL_STATES = {CycleState.COMPLETED, CycleState.FAILED, CycleState.ROLLED_BACK}

# Map of state -> List of allowed next states (happy path and immediate alternative paths)
VALID_TRANSITIONS = {
    CycleState.PENDING: [CycleState.OBSERVING, CycleState.FAILED, CycleState.BLOCKED],
    CycleState.OBSERVING: [CycleState.ANALYZING, CycleState.FAILED, CycleState.WAITING_HUMAN],
    CycleState.ANALYZING: [CycleState.PLANNING, CycleState.COMPLETED, CycleState.FAILED], # COMPLETED if no gap (no_op)
    CycleState.PLANNING: [CycleState.REVIEWING, CycleState.FAILED, CycleState.WAITING_HUMAN],
    CycleState.REVIEWING: [CycleState.EXECUTING, CycleState.PLANNING, CycleState.FAILED], # PLANNING on DENY
    CycleState.EXECUTING: [CycleState.VALIDATING, CycleState.PLANNING, CycleState.FAILED], # PLANNING on failure
    CycleState.VALIDATING: [CycleState.LEARNING, CycleState.PLANNING, CycleState.FAILED], # PLANNING on DENY
    CycleState.LEARNING: [CycleState.COMPLETED, CycleState.FAILED],
    CycleState.WAITING_HUMAN: [
        CycleState.OBSERVING, CycleState.ANALYZING, CycleState.PLANNING, 
        CycleState.REVIEWING, CycleState.EXECUTING, CycleState.VALIDATING, 
        CycleState.LEARNING, CycleState.FAILED, CycleState.COMPLETED
    ],
    CycleState.BLOCKED: [CycleState.FAILED],
}


def is_valid_transition(current: CycleState, next_state: CycleState) -> bool:
    """Check if the transition is allowed according to the core protocol."""
    if current in TERMINAL_STATES:
        return False
    allowed = VALID_TRANSITIONS.get(current, [])
    return next_state in allowed
