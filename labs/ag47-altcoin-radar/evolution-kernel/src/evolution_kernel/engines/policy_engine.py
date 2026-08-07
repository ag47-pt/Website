class PolicyEngine:
    def evaluate(self, task_data: dict, verdict_data: dict, trace=None) -> dict:
        # Check: Production release requires human
        
        roles = task_data.get('assigned_roles', [])
        
        if 'release-manager' in roles:
            # Requires human
            if 'validator' in verdict_data:
                actor_type = verdict_data['validator'].get('actor_type')
                if actor_type != 'HUMAN':
                    msg = "Tasks involving release-manager require a HUMAN actor for validation."
                    if trace: trace.add_check("production_release_human_check", "failed", msg)
                    return {
                        "status": "DENY",
                        "reason": "HUMAN_APPROVAL_REQUIRED",
                        "details": msg
                    }
            if trace: trace.add_check("production_release_human_check", "passed")
                    
        return {"status": "ALLOW"}
