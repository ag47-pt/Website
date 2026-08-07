"""
Evolution Loop Manager - Cycle Orchestrator

This is the non-cognitive, deterministic kernel engine that moves 
a cycle from PENDING to COMPLETED, checking boundaries, budgets, 
and dispatching agents via authorized routes.
"""
import uuid
import json
from datetime import datetime, timezone
from typing import Dict, Any, List

from evolution_kernel.loop_manager.cycle_state_machine import CycleState, is_valid_transition, TERMINAL_STATES
from evolution_kernel.loop_manager.agent_dispatcher import authorize_agent

class OrchestratorViolation(Exception):
    pass


class CycleOrchestrator:
    def __init__(self, cycle_record: Dict[str, Any] = None):
        self.cycle = cycle_record or self._create_default_cycle()
        self.events: List[Dict[str, Any]] = []
        self._agent_calls = 0

    def _create_default_cycle(self) -> Dict[str, Any]:
        return {
            "cycle_id": f"cycle-{uuid.uuid4().hex[:8]}",
            "trigger": {"type": "manual", "source": "user"},
            "state_machine": {
                "current_state": CycleState.PENDING.value,
                "retries": 0
            },
            "budget": {
                "max_agent_calls": 20,
                "max_retries": 3,
                "max_tokens": 100000,
                "max_execution_time_minutes": 60
            },
            "artifacts": {},
            "agents": {},
            "started_at": datetime.now(timezone.utc).isoformat()
        }

    def get_current_state(self) -> CycleState:
        return CycleState(self.cycle["state_machine"]["current_state"])

    def _emit_event(self, event_type: str, from_state: str, to_state: str, evidence: List[str] = None, details: str = ""):
        event = {
            "cycle_id": self.cycle["cycle_id"],
            "event": event_type,
            "from_state": from_state,
            "to_state": to_state,
            "actor": "kernel",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "evidence": evidence or [],
            "details": details
        }
        self.events.append(event)

    def advance_state(self, next_state: CycleState, evidence: List[str] = None):
        """Attempts to move the state machine forward."""
        current = self.get_current_state()
        
        if current in TERMINAL_STATES:
            raise OrchestratorViolation(f"Cannot transition from terminal state {current}")

        if not is_valid_transition(current, next_state):
            raise OrchestratorViolation(f"INVALID_STATE_TRANSITION: {current.value} -> {next_state.value}")

        # Execute transition
        self.cycle["state_machine"]["current_state"] = next_state.value
        self._emit_event("STATE_TRANSITION", current.value, next_state.value, evidence)

    def handle_agent_failure(self, fallback_state: CycleState, details: str):
        """Triggered when an agent fails or a review/validation emits DENY."""
        current = self.get_current_state()
        retries = self.cycle["state_machine"]["retries"]
        max_retries = self.cycle["budget"]["max_retries"]

        if retries >= max_retries:
            self.fail_cycle("MAX_RETRY_EXCEEDED")
            return

        self.cycle["state_machine"]["retries"] += 1
        self.advance_state(fallback_state, evidence=[details])

    def dispatch_agent(self, requested_agent: str) -> bool:
        """Called by an external runner to ask if an agent can execute now."""
        current = self.get_current_state()
        
        if current in TERMINAL_STATES or current == CycleState.WAITING_HUMAN:
            raise OrchestratorViolation("INVALID_AGENT_FOR_STATE: Cycle is not in an active agent state.")

        if self._agent_calls >= self.cycle["budget"]["max_agent_calls"]:
            self.fail_cycle("BUDGET_EXHAUSTED")
            raise OrchestratorViolation("BUDGET_EXHAUSTED")

        if not authorize_agent(current, requested_agent):
            raise OrchestratorViolation(f"INVALID_AGENT_FOR_STATE: {requested_agent} cannot run in {current.value}")

        self._agent_calls += 1
        self._emit_event("AGENT_DISPATCHED", current.value, current.value, details=f"Agent: {requested_agent}")
        return True

    def fail_cycle(self, reason: str):
        current = self.get_current_state()
        if current not in TERMINAL_STATES:
            self.cycle["state_machine"]["current_state"] = CycleState.FAILED.value
            self.cycle["result"] = {"status": "failure", "knowledge_generated": False, "reason": reason}
            self.cycle["completed_at"] = datetime.now(timezone.utc).isoformat()
            self._emit_event("CYCLE_FAILED", current.value, CycleState.FAILED.value, details=reason)

    def complete_cycle(self, knowledge_generated: bool = False, no_op: bool = False):
        current = self.get_current_state()
        if current not in TERMINAL_STATES:
            self.cycle["state_machine"]["current_state"] = CycleState.COMPLETED.value
            status = "no_op" if no_op else "success"
            self.cycle["result"] = {"status": status, "knowledge_generated": knowledge_generated, "reason": "Completed successfully"}
            self.cycle["completed_at"] = datetime.now(timezone.utc).isoformat()
            self._emit_event("CYCLE_COMPLETED", current.value, CycleState.COMPLETED.value)
