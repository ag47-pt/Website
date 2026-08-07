import json
import pytest
from pathlib import Path
from evolution_kernel.agents.changeset_reviewer import review_changeset, ReviewViolation


VALID_CHANGESET = {
    "changeset_id": "cs-valid",
    "source_gap_refs": ["gap-1"],
    "intent": "Fix auth",
    "scope": {
        "allowed_paths": ["src/*"],
        "prohibited_paths": [".evolution/*"],
    },
    "change_budget": {"files_modified": 1},
    "changes": [
        {
            "type": "create",
            "path": "src/new_module.py",
            "reason": "Add authentication handler",
            "expected_effect": "Enables JWT auth",
        }
    ],
    "acceptance_criteria": ["JWT tokens can be issued and validated"],
    "risk_assessment": {"level": "low", "confidence": "high"},
    "execution_strategy": "incremental",
    "rollback_plan": "git revert HEAD",
}


def test_valid_changeset_passes(tmp_path):
    (tmp_path / "src").mkdir()
    violations = review_changeset(VALID_CHANGESET, {}, tmp_path)
    errors = [v for v in violations if v.severity == "error"]
    assert len(errors) == 0


def test_missing_execution_strategy(tmp_path):
    cs = {**VALID_CHANGESET}
    del cs["execution_strategy"]
    violations = review_changeset(cs, {}, tmp_path)
    codes = [v.code for v in violations]
    assert "MISSING_EXECUTION_STRATEGY" in codes


def test_missing_rollback_plan(tmp_path):
    cs = {**VALID_CHANGESET, "rollback_plan": ""}
    violations = review_changeset(cs, {}, tmp_path)
    codes = [v.code for v in violations]
    assert "MISSING_ROLLBACK_PLAN" in codes


def test_budget_inconsistency(tmp_path):
    (tmp_path / "src").mkdir()
    cs = {
        **VALID_CHANGESET,
        "change_budget": {"files_modified": 1},
        "changes": [
            {"type": "create", "path": "src/a.py", "reason": "r", "expected_effect": "e"},
            {"type": "create", "path": "src/b.py", "reason": "r", "expected_effect": "e"},
        ],
    }
    violations = review_changeset(cs, {}, tmp_path)
    codes = [v.code for v in violations]
    assert "BUDGET_INCONSISTENCY" in codes


def test_invalid_target_path_modify(tmp_path):
    (tmp_path / "src").mkdir()
    cs = {
        **VALID_CHANGESET,
        "changes": [
            {
                "type": "modify",
                "path": "src/nonexistent.py",
                "reason": "r",
                "expected_effect": "e",
            }
        ],
    }
    violations = review_changeset(cs, {}, tmp_path)
    codes = [v.code for v in violations]
    assert "INVALID_TARGET_PATH" in codes


def test_prohibited_path_violation(tmp_path):
    cs = {
        **VALID_CHANGESET,
        "changes": [
            {
                "type": "create",
                "path": ".evolution/hack.py",
                "reason": "r",
                "expected_effect": "e",
            }
        ],
    }
    violations = review_changeset(cs, {}, tmp_path)
    codes = [v.code for v in violations]
    assert "PROHIBITED_PATH_VIOLATION" in codes


def test_orphan_changeset(tmp_path):
    cs = {**VALID_CHANGESET, "source_gap_refs": []}
    violations = review_changeset(cs, {}, tmp_path)
    codes = [v.code for v in violations]
    assert "ORPHAN_CHANGESET" in codes


def test_trivial_acceptance_criteria(tmp_path):
    (tmp_path / "src").mkdir()
    cs = {**VALID_CHANGESET, "acceptance_criteria": ["ok"]}
    violations = review_changeset(cs, {}, tmp_path)
    codes = [v.code for v in violations]
    assert "TRIVIAL_ACCEPTANCE_CRITERION" in codes
