import json
import pytest
from evolution_kernel.cognitive_gateway.gateway import CognitiveGateway, GatewayError
from evolution_kernel.cognitive_gateway.adapters.mock import MockLLMAdapter

with open("../.evolution/schemas/core/candidate-analysis.schema.json") as f:
    CANDIDATE_SCHEMA = json.load(f)

def test_gateway_valid_candidate():
    valid_json = """
    {
      "observations": [
        "No test framework detected"
      ],
      "candidate_gaps": [
        {
          "id": "gap-1",
          "category": "testing",
          "current_state": "no_test_framework_detected",
          "target_state": "pytest_required",
          "severity": "medium",
          "confidence": 0.9,
          "evidence_refs": [
             "system_snapshot.test_frameworks"
          ]
        }
      ]
    }
    """
    adapter = MockLLMAdapter(valid_json)
    gateway = CognitiveGateway(adapter, CANDIDATE_SCHEMA, "dummy prompt", "test")
    
    result = gateway.execute_task({"task": "gap_analysis"}, {})
    assert "artifact" in result
    assert "interaction_record" in result
    assert len(result["artifact"]["gaps"]) == 1
    assert result["artifact"]["gaps"][0]["id"] == "gap-1"
    assert result["artifact"]["gaps"][0]["evidence_refs"] == ["system_snapshot.test_frameworks"]
    assert "interaction_record" in result
    assert result["interaction_record"]["model_id"] == "mock-llm-1.0"
    assert result["interaction_record"]["prompt_version"] == "test"
    assert "input_hash" in result["interaction_record"]

def test_gateway_hallucination_missing_evidence():
    invalid_json = """
    {
      "observations": ["Database is missing"],
      "candidate_gaps": [
        {
          "id": "gap-2",
          "category": "database",
          "current_state": "missing",
          "target_state": "postgresql",
          "severity": "high",
          "confidence": 0.8,
          "evidence_refs": []
        }
      ]
    }
    """
    adapter = MockLLMAdapter(invalid_json)
    gateway = CognitiveGateway(adapter, CANDIDATE_SCHEMA, "dummy prompt", "test")
    
    with pytest.raises(GatewayError) as exc_info:
        gateway.execute_task({"task": "gap_analysis"}, {})
    
    assert "MISSING_EVIDENCE_REFERENCE" in str(exc_info.value)

def test_gateway_role_boundary_violation():
    invalid_json = """
    {
      "observations": [],
      "candidate_gaps": [
        {
          "id": "gap-3",
          "category": "database",
          "current_state": "missing",
          "target_state": "postgresql",
          "severity": "high",
          "confidence": 0.8,
          "evidence_refs": ["system_snapshot.database"],
          "solution": "Install PostgreSQL"
        }
      ]
    }
    """
    adapter = MockLLMAdapter(invalid_json)
    gateway = CognitiveGateway(adapter, CANDIDATE_SCHEMA, "dummy prompt", "test")
    
    with pytest.raises(GatewayError) as exc_info:
        gateway.execute_task({"task": "gap_analysis"}, {})
    
    assert "ROLE_BOUNDARY_VIOLATION" in str(exc_info.value)

def test_gateway_schema_violation():
    invalid_json = """
    {
      "candidate_gaps": [
        {
          "category": "database"
        }
      ]
    }
    """
    # Missing 'observations', missing 'evidence_refs', missing required gap fields
    adapter = MockLLMAdapter(invalid_json)
    gateway = CognitiveGateway(adapter, CANDIDATE_SCHEMA, "dummy prompt", "test")
    
    with pytest.raises(GatewayError) as exc_info:
        gateway.execute_task({"task": "gap_analysis"}, {})
    
    # Missing evidence refs check comes first in our logic if candidate_gaps exists
    assert "MISSING_EVIDENCE_REFERENCE" in str(exc_info.value)

def test_gateway_schema_violation_pure():
    invalid_json = """
    {
      "unknown_field": "test"
    }
    """
    # Missing 'observations' and 'candidate_gaps'
    adapter = MockLLMAdapter(invalid_json)
    gateway = CognitiveGateway(adapter, CANDIDATE_SCHEMA, "dummy prompt", "test")
    
    with pytest.raises(GatewayError) as exc_info:
        gateway.execute_task({"task": "gap_analysis"}, {})
    
    assert "SCHEMA_VIOLATION" in str(exc_info.value)
