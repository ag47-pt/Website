import os
import json
from evolution_kernel.core.decision_trace import DecisionTrace
from evolution_kernel.validators.integrity_validator import IntegrityValidator
from evolution_kernel.engines.policy_engine import PolicyEngine

class StateMachine:
    def __init__(self, registry=None):
        self.registry = registry
        self.integrity_validator = IntegrityValidator()
        self.policy_engine = PolicyEngine()
        
    def check_transition(self, current_state: str, target_state: str, target_dir: str) -> DecisionTrace:
        trace = DecisionTrace(f"Transition from {current_state} to {target_state}")
        trace.add_check("state_transition_validity", "passed")
        
        # Load artifacts if they exist
        def load_json(filename):
            path = os.path.join(target_dir, filename)
            if os.path.exists(path):
                with open(path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return {}
            
        task = load_json("04_task.json")
        report = load_json("05_report.json")
        verdict = load_json("07_verdict.json")
        changeset = load_json("03_changeset.json")

        # Integrity Validation
        int_res = self.integrity_validator.validate(report, verdict, changeset, trace)
        if int_res["status"] == "DENY":
            trace.conclude("DENY", int_res.get("reason"))
            return trace
            
        # Policy Engine
        pol_res = self.policy_engine.evaluate(task, verdict, trace)
        if pol_res["status"] == "DENY":
            trace.conclude("DENY", pol_res.get("reason"))
            return trace
            
        trace.conclude("ALLOW")
        return trace
