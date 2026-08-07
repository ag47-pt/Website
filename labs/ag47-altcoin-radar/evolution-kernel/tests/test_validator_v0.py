import json
import pytest
from pathlib import Path
from evolution_kernel.agents.validator_v0 import validate_execution


CHANGESET = {
    "changeset_id": "cs-test",
    "scope": {
        "allowed_paths": ["src/*"],
        "prohibited_paths": [".evolution/*"],
    },
    "rollback_requirements": {
        "snapshot_before": True,
        "reversible": True
    },
    "acceptance_criteria": ["Tests pass"]
}

VALID_REPORT = {
    "execution_id": "exec-1",
    "execution_mode": "sandbox",
    "status": "completed",
    "pre_snapshot_hash": "abcdef123456",
    "evidence_refs": ["test_result:passed"],
    "actions": [
        {
            "type": "create_file",
            "path": "src/new.py",
            "result": "executed"
        }
    ]
}


def test_valid_execution(tmp_path):
    # Setup reality
    (tmp_path / "src").mkdir()
    (tmp_path / "src/new.py").write_text("code")

    verdict = validate_execution(VALID_REPORT, CHANGESET, tmp_path)
    assert verdict["verdict"] == "ALLOW"
    assert len(verdict["violations"]) == 0
    assert len(verdict["evidence_bundle"]) == 3 # file_existence, hash, test_pass


def test_false_execution_claim(tmp_path):
    # File is NOT created on disk
    (tmp_path / "src").mkdir()

    verdict = validate_execution(VALID_REPORT, CHANGESET, tmp_path)
    assert verdict["verdict"] == "DENY"
    codes = [v["code"] for v in verdict["violations"]]
    assert "FALSE_EXECUTION_CLAIM" in codes


def test_unauthorized_mutation(tmp_path):
    (tmp_path / ".evolution").mkdir()
    (tmp_path / ".evolution/hack.py").write_text("hacked")

    report = {
        **VALID_REPORT,
        "actions": [
            {
                "type": "create_file",
                "path": ".evolution/hack.py",
                "result": "executed"
            }
        ]
    }

    verdict = validate_execution(report, CHANGESET, tmp_path)
    assert verdict["verdict"] == "DENY"
    codes = [v["code"] for v in verdict["violations"]]
    assert "UNAUTHORIZED_MUTATION" in codes


def test_acceptance_criteria_failed(tmp_path):
    (tmp_path / "src").mkdir()
    (tmp_path / "src/new.py").write_text("code")

    report = {
        **VALID_REPORT,
        "evidence_refs": []  # Missing "test_result:passed"
    }

    verdict = validate_execution(report, CHANGESET, tmp_path)
    assert verdict["verdict"] == "DENY"
    codes = [v["code"] for v in verdict["violations"]]
    assert "ACCEPTANCE_CRITERIA_FAILED" in codes


def test_missing_rollback_evidence(tmp_path):
    (tmp_path / "src").mkdir()
    (tmp_path / "src/new.py").write_text("code")

    report = {
        **VALID_REPORT
    }
    del report["pre_snapshot_hash"]

    verdict = validate_execution(report, CHANGESET, tmp_path)
    assert verdict["verdict"] == "DENY"
    codes = [v["code"] for v in verdict["violations"]]
    assert "MISSING_ROLLBACK_EVIDENCE" in codes
