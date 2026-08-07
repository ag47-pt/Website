import os
import json
import datetime
import uuid

class EventLedger:
    def __init__(self, ledger_path: str):
        self.ledger_path = ledger_path
        os.makedirs(os.path.dirname(self.ledger_path), exist_ok=True)
        
    def record_event(self, actor: str, action: str, from_state: str, to_state: str, decision: str, reason: str = None, trace: dict = None) -> str:
        event_id = str(uuid.uuid4())
        event = {
            "event_id": event_id,
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "actor": actor,
            "action": action,
            "from": from_state,
            "to": to_state,
            "decision": decision
        }
        if reason:
            event["reason"] = reason
        if trace:
            event["trace"] = trace
            
        with open(self.ledger_path, 'a', encoding='utf-8') as f:
            f.write(json.dumps(event) + "\n")
            
        return event_id
        
    def get_history(self, limit: int = 10) -> list:
        if not os.path.exists(self.ledger_path):
            return []
            
        events = []
        with open(self.ledger_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():
                    events.append(json.loads(line))
        return events[-limit:]

    def get_event(self, event_id: str) -> dict:
        if not os.path.exists(self.ledger_path):
            return None
            
        with open(self.ledger_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():
                    event = json.loads(line)
                    if event["event_id"] == event_id:
                        return event
        return None
