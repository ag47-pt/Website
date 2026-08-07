import json
import pytest
from jsonschema import ValidationError
from evolution_kernel.cognitive_gateway.gateway import CognitiveGateway, GatewayError

# Dummy adapter that returns whatever JSON we give it
class MockLLMAdapter:
    def __init__(self, response_text: str):
        self.response_text = response_text

    def generate(self, system_prompt: str, context: dict):
        metadata = {
            "model_id": "mock-llm-1.0",
            "parameters": {"temperature": 0.0},
            "token_usage": {"prompt_tokens": 10, "completion_tokens": 20, "total_tokens": 30}
        }
        return self.response_text, metadata

CANDIDATE_PLAN_SCHEMA = {
    "type": "object",
    "properties": {
        "proposed_changeset": {
            "type": "object",
            "properties": {
                "changeset_id": {"type": "string"},
                "source_gap_refs": {"type": "array", "items": {"type": "string"}},
                "changes": {"type": "array"},
                "change_budget": {"type": "object"}
            },
            "required": ["changeset_id", "source_gap_refs", "changes"]
        }
    }
}

def test_planner_gateway_valid():
    valid_json = """
    {
      "proposed_changeset": {
        "changeset_id": "cs-123",
        "source_gap_refs": ["gap-1"],
        "change_budget": {
            "files_modified": 1
        },
        "changes": [
          {
            "type": "modify",
            "path": "src/dummy.py",
            "reason": "because"
          }
        ]
      }
    }
    """
    adapter = MockLLMAdapter(valid_json)
    gateway = CognitiveGateway(adapter, CANDIDATE_PLAN_SCHEMA, "dummy", "test", agent_role="planner")
    
    result = gateway.execute_task({"task": "plan"}, {})
    assert "artifact" in result
    assert result["artifact"]["changeset_id"] == "cs-123"

def test_planner_missing_source_gap_refs():
    invalid_json = """
    {
      "proposed_changeset": {
        "changeset_id": "cs-123",
        "changes": [
          {
            "type": "modify",
            "path": "src/dummy.py",
            "reason": "because"
          }
        ]
      }
    }
    """
    adapter = MockLLMAdapter(invalid_json)
    gateway = CognitiveGateway(adapter, CANDIDATE_PLAN_SCHEMA, "dummy", "test", agent_role="planner")
    
    with pytest.raises(GatewayError) as exc:
        gateway.execute_task({"task": "plan"}, {})
    assert exc.value.code == "MISSING_EVIDENCE_REFERENCE"

def test_planner_execution_attempt():
    invalid_json = """
    {
      "proposed_changeset": {
        "changeset_id": "cs-123",
        "source_gap_refs": ["gap-1"],
        "changes": [
          {
            "type": "execute_command",
            "command": "rm -rf /",
            "reason": "because"
          }
        ]
      }
    }
    """
    adapter = MockLLMAdapter(invalid_json)
    gateway = CognitiveGateway(adapter, CANDIDATE_PLAN_SCHEMA, "dummy", "test", agent_role="planner")
    
    with pytest.raises(GatewayError) as exc:
        gateway.execute_task({"task": "plan"}, {})
    assert exc.value.code == "ROLE_BOUNDARY_VIOLATION"

def test_planner_change_budget_violation():
    invalid_json = """
    {
      "proposed_changeset": {
        "changeset_id": "cs-123",
        "source_gap_refs": ["gap-1"],
        "change_budget": {
            "files_modified": 15
        },
        "changes": [
          {
            "type": "modify",
            "path": "src/dummy.py",
            "reason": "because"
          }
        ]
      }
    }
    """
    adapter = MockLLMAdapter(invalid_json)
    gateway = CognitiveGateway(adapter, CANDIDATE_PLAN_SCHEMA, "dummy", "test", agent_role="planner")
    
    with pytest.raises(GatewayError) as exc:
        gateway.execute_task({"task": "plan"}, {})
    assert exc.value.code == "CHANGE_SCOPE_TOO_LARGE"
