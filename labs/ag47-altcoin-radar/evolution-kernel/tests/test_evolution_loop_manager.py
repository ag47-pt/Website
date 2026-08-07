import pytest
from evolution_kernel.loop_manager.cycle_state_machine import CycleState
from evolution_kernel.loop_manager.cycle_orchestrator import CycleOrchestrator, OrchestratorViolation

def test_happy_path_transitions():
    orch = CycleOrchestrator()
    
    # Init state is PENDING
    assert orch.get_current_state() == CycleState.PENDING
    
    orch.advance_state(CycleState.OBSERVING)
    assert orch.dispatch_agent("observer") == True
    
    orch.advance_state(CycleState.ANALYZING)
    assert orch.dispatch_agent("analyst") == True
    
    orch.advance_state(CycleState.PLANNING)
    assert orch.dispatch_agent("planner") == True
    
    orch.advance_state(CycleState.REVIEWING)
    assert orch.dispatch_agent("changeset_reviewer") == True
    
    orch.advance_state(CycleState.EXECUTING)
    assert orch.dispatch_agent("executor") == True
    
    orch.advance_state(CycleState.VALIDATING)
    assert orch.dispatch_agent("validator") == True
    
    orch.advance_state(CycleState.LEARNING)
    assert orch.dispatch_agent("knowledge_curator") == True
    
    orch.complete_cycle(knowledge_generated=True)
    assert orch.get_current_state() == CycleState.COMPLETED


def test_invalid_state_jump():
    orch = CycleOrchestrator()
    orch.advance_state(CycleState.OBSERVING)
    
    with pytest.raises(OrchestratorViolation) as excinfo:
        orch.advance_state(CycleState.COMPLETED)
    assert "INVALID_STATE_TRANSITION" in str(excinfo.value)


def test_invalid_agent_for_state():
    orch = CycleOrchestrator()
    orch.advance_state(CycleState.OBSERVING)
    
    with pytest.raises(OrchestratorViolation) as excinfo:
        orch.dispatch_agent("executor")
    assert "INVALID_AGENT_FOR_STATE" in str(excinfo.value)


def test_infinite_loop_protection():
    orch = CycleOrchestrator()
    orch.advance_state(CycleState.OBSERVING)
    orch.advance_state(CycleState.ANALYZING)
    orch.advance_state(CycleState.PLANNING)
    
    # Planner proposes, Reviewer denies, routes back to Planning
    for _ in range(3):
        orch.advance_state(CycleState.REVIEWING)
        orch.handle_agent_failure(CycleState.PLANNING, "DENIED")
        
    # On the 4th failure (max_retries = 3)
    orch.advance_state(CycleState.REVIEWING)
    orch.handle_agent_failure(CycleState.PLANNING, "DENIED")
    
    assert orch.get_current_state() == CycleState.FAILED
    assert orch.cycle["result"]["reason"] == "MAX_RETRY_EXCEEDED"


def test_budget_exhaustion():
    orch = CycleOrchestrator()
    # artificially lower budget for test
    orch.cycle["budget"]["max_agent_calls"] = 2
    
    orch.advance_state(CycleState.OBSERVING)
    orch.dispatch_agent("observer") # 1 call
    
    orch.advance_state(CycleState.ANALYZING)
    orch.dispatch_agent("analyst") # 2 calls
    
    orch.advance_state(CycleState.PLANNING)
    with pytest.raises(OrchestratorViolation) as excinfo:
        orch.dispatch_agent("planner") # 3rd call exceeds budget
        
    assert "BUDGET_EXHAUSTED" in str(excinfo.value)
    assert orch.get_current_state() == CycleState.FAILED


def test_human_wait_block():
    orch = CycleOrchestrator()
    orch.advance_state(CycleState.OBSERVING)
    orch.advance_state(CycleState.WAITING_HUMAN)
    
    with pytest.raises(OrchestratorViolation) as excinfo:
        orch.dispatch_agent("planner")
    assert "Cycle is not in an active agent state" in str(excinfo.value)
