class IntegrityValidator:
    def validate(self, report_data: dict, verdict_data: dict, changeset_data: dict = None, trace=None) -> dict:
        
        # Check 1: Self validation
        if 'actor' in report_data and 'validator' in verdict_data:
            executor_id = report_data['actor'].get('actor_id')
            validator_id = verdict_data['validator'].get('actor_id')
            
            if executor_id and validator_id and executor_id == validator_id:
                msg = "The actor who executed the task cannot be the same actor who validates the evidence."
                if trace: trace.add_check("self_validation_check", "failed", msg)
                return {
                    "status": "DENY",
                    "reason": "SELF_VALIDATION_FORBIDDEN",
                    "details": msg
                }
            if trace: trace.add_check("self_validation_check", "passed")
                
        # Check 2: Out of Scope
        if changeset_data and 'files_changed' in report_data and 'allowed_directories' in changeset_data:
            allowed_dirs = changeset_data['allowed_directories']
            for file in report_data['files_changed']:
                # Simplify check for demo purposes
                is_allowed = any(file.startswith(d.rstrip('/')) for d in allowed_dirs)
                if not is_allowed:
                    msg = f"File {file} was modified but is outside the allowed directories: {allowed_dirs}"
                    if trace: trace.add_check("out_of_scope_check", "failed", msg)
                    return {
                        "status": "DENY",
                        "reason": "OUT_OF_SCOPE_MUTATION",
                        "details": msg
                    }
            if trace: trace.add_check("out_of_scope_check", "passed")

        return {"status": "ALLOW"}
