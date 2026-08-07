class DecisionTrace:
    def __init__(self, request_desc: str):
        self.request = request_desc
        self.checks = []
        self.final_decision = None
        self.final_reason = None
        
    def add_check(self, name: str, result: str, details: str = None):
        check = {
            "policy": name,
            "result": result
        }
        if details:
            check["details"] = details
        self.checks.append(check)
        
    def conclude(self, decision: str, reason: str = None):
        self.final_decision = decision
        if reason:
            self.final_reason = reason
            
    def to_dict(self):
        out = {
            "request": self.request,
            "checks": self.checks,
            "final": self.final_decision
        }
        if self.final_reason:
            out["reason"] = self.final_reason
        return out
