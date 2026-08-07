import json
import pytest
from pathlib import Path
from evolution_kernel.agents.executor_v0 import ExecutionEngine


VALID_CHANGESET = {
    "changeset_id": "cs-exec-test",
    "source_gap_refs": ["gap-1"],
    "intent": "Test execution",
    "scope": {
        "allowed_paths": ["src/*"],
        "prohibited_paths": [".evolution/*", "evolution-kernel/*"],
    },
    "change_budget": {
        "files_modified": 3,
        "lines_added": 100,
        "new_dependencies": 0,
    },
    "changes": [
        {
            "type": "create",
            "path": "src/new_module.py",
            "reason": "Add new module",
            "expected_effect": "New functionality",
        }
    ],
    "acceptance_criteria": ["Module exists and is importable"],
    "risk_assessment": {"level": "low", "confidence": "high"},
    "execution_strategy": "incremental",
    "rollback_plan": "git revert HEAD",
    "rollback_requirements": {
        "snapshot_before": False,
        "reversible": True,
    },
}


def test_dry_run_simulates_create(tmp_path):
    (tmp_path / "src").mkdir()
    engine = ExecutionEngine(tmp_path)
    report = engine.execute(VALID_CHANGESET, "dry-run")

    assert report["status"] == "completed"
    assert report["execution_mode"] == "dry-run"
    assert len(report["actions"]) == 1
    assert report["actions"][0]["result"] == "simulated"
    assert report["actions"][0]["type"] == "create_file"
    # File should NOT exist after dry-run
    assert not (tmp_path / "src" / "new_module.py").exists()


def test_dry_run_warns_on_nonexistent_modify(tmp_path):
    cs = {
        **VALID_CHANGESET,
        "changes": [
            {"type": "modify", "path": "src/ghost.py", "reason": "r", "expected_effect": "e"}
        ],
    }
    engine = ExecutionEngine(tmp_path)
    report = engine.execute(cs, "dry-run")

    assert "WARNING" in report["actions"][0]["detail"]


def test_sandbox_creates_file(tmp_path):
    (tmp_path / "src").mkdir()
    sandbox = tmp_path / ".evolution" / "workspace"
    engine = ExecutionEngine(tmp_path)
    report = engine.execute(VALID_CHANGESET, "sandbox", sandbox_root=sandbox)

    assert report["status"] == "completed"
    assert report["actions"][0]["result"] == "executed"
    # File should exist in sandbox, not in project
    assert (sandbox / "src" / "new_module.py").exists()
    assert not (tmp_path / "src" / "new_module.py").exists()


def test_sandbox_modifies_existing_file(tmp_path):
    src = tmp_path / "src"
    src.mkdir()
    (src / "existing.py").write_text("# original content\n")
    sandbox = tmp_path / ".evolution" / "workspace"

    cs = {
        **VALID_CHANGESET,
        "changes": [
            {"type": "modify", "path": "src/existing.py", "reason": "r", "expected_effect": "e"}
        ],
    }
    engine = ExecutionEngine(tmp_path)
    report = engine.execute(cs, "sandbox", sandbox_root=sandbox)

    assert report["actions"][0]["result"] == "executed"
    sandbox_file = sandbox / "src" / "existing.py"
    assert sandbox_file.exists()
    content = sandbox_file.read_text()
    assert "# original content" in content
    assert "# Modified by Executor v0" in content


def test_sandbox_fails_on_modify_nonexistent(tmp_path):
    sandbox = tmp_path / ".evolution" / "workspace"
    cs = {
        **VALID_CHANGESET,
        "changes": [
            {"type": "modify", "path": "src/ghost.py", "reason": "r", "expected_effect": "e"}
        ],
    }
    engine = ExecutionEngine(tmp_path)
    report = engine.execute(cs, "sandbox", sandbox_root=sandbox)

    assert len(report["errors"]) == 1
    assert report["errors"][0]["code"] == "FILE_NOT_FOUND"
    assert report["actions"][0]["result"] == "failed"


def test_apply_mode_blocked():
    engine = ExecutionEngine(Path("."))
    with pytest.raises(NotImplementedError) as exc:
        engine.execute(VALID_CHANGESET, "apply")
    assert "blocked in Executor v0" in str(exc.value)


def test_scope_violation_blocked(tmp_path):
    cs = {
        **VALID_CHANGESET,
        "changes": [
            {"type": "create", "path": ".evolution/hack.py", "reason": "r", "expected_effect": "e"}
        ],
    }
    engine = ExecutionEngine(tmp_path)
    report = engine.execute(cs, "dry-run")

    assert len(report["errors"]) == 1
    assert report["errors"][0]["code"] == "SCOPE_VIOLATION"
    assert report["actions"][0]["result"] == "skipped"


def test_budget_exceeded_halts(tmp_path):
    (tmp_path / "src").mkdir()
    cs = {
        **VALID_CHANGESET,
        "change_budget": {"files_modified": 1},
        "changes": [
            {"type": "create", "path": "src/a.py", "reason": "r", "expected_effect": "e"},
            {"type": "create", "path": "src/b.py", "reason": "r", "expected_effect": "e"},
        ],
    }
    engine = ExecutionEngine(tmp_path)
    report = engine.execute(cs, "dry-run")

    # First should succeed, second should be skipped
    assert report["actions"][0]["result"] == "simulated"
    assert report["actions"][1]["result"] == "skipped"
    assert any(e["code"] == "EXECUTION_BUDGET_EXCEEDED" for e in report["errors"])


def test_snapshot_hash_created_in_sandbox(tmp_path):
    src = tmp_path / "src"
    src.mkdir()
    (src / "file.py").write_text("content")
    sandbox = tmp_path / ".evolution" / "workspace"

    cs = {
        **VALID_CHANGESET,
        "rollback_requirements": {"snapshot_before": True, "reversible": True},
    }
    engine = ExecutionEngine(tmp_path)
    report = engine.execute(cs, "sandbox", sandbox_root=sandbox)

    assert "pre_snapshot_hash" in report
    assert len(report["pre_snapshot_hash"]) == 64  # SHA-256
    assert any("pre_snapshot:" in ref for ref in report["evidence_refs"])
