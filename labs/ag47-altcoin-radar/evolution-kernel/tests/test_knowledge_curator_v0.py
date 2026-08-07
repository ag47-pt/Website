import pytest
from evolution_kernel.agents.knowledge_curator_v0 import curate_knowledge

VALID_VERDICT = {
    "verdict_id": "verdict-1",
    "verdict": "ALLOW"
}

VALID_PROPOSAL = {
    "type": "engineering_pattern",
    "statement": "Strict schema validation reduces invalid outputs",
    "confidence": 0.85,
    "learned_from": {"project": "test", "agent": "validator"},
    "applicability": {"scope": "all"},
    "source_evidence": ["verdict-1"]
}


def test_valid_knowledge_promotion():
    status, violations, entry = curate_knowledge(VALID_PROPOSAL, VALID_VERDICT, "create", [])
    assert status == "ALLOW"
    assert len(violations) == 0
    assert entry["lifecycle_state"] == "ACTIVE"
    assert entry["knowledge_id"].startswith("know-")
    assert "verdict-1" in entry["source_evidence"]


def test_missing_validation_source():
    denied_verdict = {"verdict_id": "verdict-2", "verdict": "DENY"}
    status, violations, _ = curate_knowledge(VALID_PROPOSAL, denied_verdict, "create", [])
    assert status == "DENY"
    codes = [v.code for v in violations]
    assert "MISSING_VALIDATION_SOURCE" in codes


def test_immutable_history_violation():
    status, violations, _ = curate_knowledge(VALID_PROPOSAL, VALID_VERDICT, "delete", [])
    assert status == "DENY"
    codes = [v.code for v in violations]
    assert "IMMUTABLE_HISTORY_VIOLATION" in codes


def test_insufficient_confidence():
    weak_proposal = {**VALID_PROPOSAL, "confidence": 0.5}
    status, violations, _ = curate_knowledge(weak_proposal, VALID_VERDICT, "create", [])
    assert status == "DENY"
    codes = [v.code for v in violations]
    assert "INSUFFICIENT_CONFIDENCE" in codes


def test_duplicate_knowledge():
    existing = [{
        "knowledge_id": "know-old",
        "statement": "Strict schema validation reduces invalid outputs",
        "lifecycle_state": "ACTIVE"
    }]
    status, violations, _ = curate_knowledge(VALID_PROPOSAL, VALID_VERDICT, "create", existing)
    assert status == "MERGE_REQUIRED"
    codes = [v.code for v in violations]
    assert "DUPLICATE_KNOWLEDGE" in codes
