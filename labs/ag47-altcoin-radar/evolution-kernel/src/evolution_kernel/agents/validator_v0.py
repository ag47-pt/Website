"""
Validator v0 — Deterministic Integrity Judge.

The Validator evaluates the Executor's report against the original Proposed Changeset.
It does not fix code. It only issues an ALLOW or DENY verdict based on evidence.

Validations:
1. False Execution Claim: Executor claims an action that didn't happen (e.g. file not on disk).
2. Out-of-Scope Mutation: Executor touched a prohibited path.
3. Missing Rollback Evidence: Changeset required snapshot, but report lacks hash.
4. Execution Failures: Any action marked as 'failed' or 'skipped' degrades the verdict.
5. Acceptance Criteria: In v0 (deterministic), we look for a specific evidence_ref tag 
   (e.g., "test_result:passed"). If missing, behavioral validation is flagged as failed.
"""
import json
import sys
import uuid
from pathlib import Path
from typing import Dict, Any, List


class IntegrityViolation:
    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message

    def to_dict(self) -> dict:
        return {"code": self.code, "message": self.message}


def load_json(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def validate_execution(
    report: Dict[str, Any],
    changeset: Dict[str, Any],
    workspace_root: Path
) -> Dict[str, Any]:
    
    verdict_id = f"verdict-{uuid.uuid4().hex[:8]}"
    violations: List[IntegrityViolation] = []
    evidence_bundle: List[Dict[str, str]] = []
    
    layers = {
        "scope": {"type": "scope", "status": "passed", "details": "All actions within allowed scope."},
        "hash_integrity": {"type": "hash_integrity", "status": "passed", "details": "Execution claims match physical artifacts."},
        "acceptance_criteria": {"type": "acceptance_criteria", "status": "unknown", "details": "Awaiting behavioral evidence."}
    }

    actions = report.get("actions", [])
    prohibited_paths = changeset.get("scope", {}).get("prohibited_paths", [])
    
    # 1. Check for failed or skipped actions (partial execution)
    if report.get("status") in ("failed", "partial", "blocked"):
        violations.append(IntegrityViolation("INCOMPLETE_EXECUTION", "Report status indicates execution did not fully succeed."))
        layers["scope"]["status"] = "failed"
        layers["scope"]["details"] = "Execution was partial or failed."
    
    for action in actions:
        path = action.get("path", "")
        result = action.get("result", "")
        act_type = action.get("type", "")

        # 2. Out-of-Scope Mutation Check
        for prohibited in prohibited_paths:
            p_clean = prohibited.rstrip("/*")
            if path.startswith(p_clean) and result in ("executed", "simulated"):
                violations.append(IntegrityViolation("UNAUTHORIZED_MUTATION", f"Executor altered prohibited path: {path}"))
                layers["scope"]["status"] = "failed"
                layers["scope"]["details"] = "Prohibited paths were mutated."
                break

        # 3. False Execution Claim (Only applicable if 'executed' in a sandbox or real apply)
        if result == "executed":
            full_path = workspace_root / path
            if act_type in ("create_file", "modify_file", "add_dependency"):
                if not full_path.exists():
                    violations.append(IntegrityViolation("FALSE_EXECUTION_CLAIM", f"Report claims '{act_type}' on '{path}', but file does not exist."))
                    layers["hash_integrity"]["status"] = "failed"
                    layers["hash_integrity"]["details"] = "Physical artifacts missing."
                else:
                    evidence_bundle.append({
                        "type": "file_existence",
                        "value": str(path),
                        "source": "filesystem_check"
                    })
            elif act_type == "delete_file":
                if full_path.exists():
                    violations.append(IntegrityViolation("FALSE_EXECUTION_CLAIM", f"Report claims 'delete_file' on '{path}', but file still exists."))
                    layers["hash_integrity"]["status"] = "failed"
                    layers["hash_integrity"]["details"] = "Physical artifacts present after deletion claim."

    # 4. Snapshot / Rollback Evidence
    req_snapshot = changeset.get("rollback_requirements", {}).get("snapshot_before", False)
    if req_snapshot:
        if "pre_snapshot_hash" not in report or not report["pre_snapshot_hash"]:
            violations.append(IntegrityViolation("MISSING_ROLLBACK_EVIDENCE", "Changeset required pre-snapshot, but report lacks pre_snapshot_hash."))
            layers["hash_integrity"]["status"] = "failed"
            layers["hash_integrity"]["details"] = "Snapshot hash missing."
        else:
            evidence_bundle.append({
                "type": "snapshot_hash",
                "value": report["pre_snapshot_hash"],
                "source": "execution_report"
            })

    # 5. Acceptance Criteria Evidence
    evidence_refs = report.get("evidence_refs", [])
    has_test_pass = any("test_result:passed" in ref for ref in evidence_refs)
    
    if changeset.get("acceptance_criteria"):
        if not has_test_pass and report.get("execution_mode") != "dry-run":
            # In deterministic v0, without LLM to read tests, we demand an explicit 'test_result:passed' ref.
            violations.append(IntegrityViolation("ACCEPTANCE_CRITERIA_FAILED", "No evidence of passed tests found for acceptance criteria."))
            layers["acceptance_criteria"]["status"] = "failed"
            layers["acceptance_criteria"]["details"] = "Missing test_result:passed evidence."
        elif has_test_pass:
            layers["acceptance_criteria"]["status"] = "passed"
            layers["acceptance_criteria"]["details"] = "Test pass evidence verified."
            evidence_bundle.append({
                "type": "test_pass",
                "value": "true",
                "source": "evidence_refs"
            })
    
    # Compile Verdict
    final_verdict = "ALLOW"
    if violations:
        final_verdict = "DENY"
    elif layers["acceptance_criteria"]["status"] == "unknown" and report.get("execution_mode") != "dry-run":
        # Missing tests but not strictly failed
        final_verdict = "MANUAL_REVIEW_REQUIRED"

    return {
        "verdict_id": verdict_id,
        "execution_ref": report.get("execution_id", "unknown"),
        "changeset_ref": changeset.get("changeset_id", "unknown"),
        "verdict": final_verdict,
        "validation_layers": list(layers.values()),
        "evidence_bundle": evidence_bundle,
        "violations": [v.to_dict() for v in violations]
    }


def main():
    if len(sys.argv) < 3:
        print("Usage: python validator_v0.py <active_task_dir> <workspace_root>")
        sys.exit(1)

    active_task_dir = Path(sys.argv[1])
    workspace_root = Path(sys.argv[2])

    report_path = active_task_dir / "04_execution_report.json"
    changeset_path = active_task_dir / "03_proposed_changeset.json"

    if not report_path.exists() or not changeset_path.exists():
        print(f"Error: Required artifacts missing in {active_task_dir}")
        sys.exit(1)

    report = load_json(report_path)
    changeset = load_json(changeset_path)

    verdict_data = validate_execution(report, changeset, workspace_root)

    verdict_path = active_task_dir / "05_integrity_verdict.json"
    with open(verdict_path, "w", encoding="utf-8") as f:
        json.dump(verdict_data, f, indent=2)

    print(f"Verdict: {verdict_data['verdict']}")
    print(f"Violations: {len(verdict_data['violations'])}")
    for v in verdict_data["violations"]:
        print(f"  ✗ [{v['code']}] {v['message']}")

    if verdict_data['verdict'] == "DENY":
        sys.exit(1)


if __name__ == "__main__":
    main()
