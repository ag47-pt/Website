"""
Changeset Reviewer — Deterministic reality validator for proposed changesets.

Sits between the Planner output and the Executor input.
Validates that a proposed-changeset is executable in the real world:

1. Target paths exist (for modify/delete) or parent dirs exist (for create).
2. Acceptance criteria are present and non-trivial.
3. Rollback plan is specified.
4. Change budget is internally consistent.
5. Execution strategy is declared.
6. No changes target prohibited paths.
7. Number of changes matches declared budget.

This is NOT a cognitive agent. It is a mechanical gate.
"""
import json
import sys
from pathlib import Path
from typing import List, Dict, Any


class ReviewViolation:
    def __init__(self, code: str, message: str, severity: str = "error"):
        self.code = code
        self.message = message
        self.severity = severity

    def to_dict(self) -> dict:
        return {
            "code": self.code,
            "message": self.message,
            "severity": self.severity,
        }


def load_json(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def review_changeset(
    changeset: Dict[str, Any],
    snapshot: Dict[str, Any],
    project_root: Path,
) -> List[ReviewViolation]:
    """
    Validates a proposed changeset against reality.
    Returns a list of violations. Empty list = changeset is executable.
    """
    violations: List[ReviewViolation] = []

    # --- 1. Execution strategy must be declared ---
    if "execution_strategy" not in changeset:
        violations.append(
            ReviewViolation(
                "MISSING_EXECUTION_STRATEGY",
                "Changeset does not declare an execution_strategy.",
            )
        )

    # --- 2. Rollback plan must be non-empty ---
    rollback = changeset.get("rollback_plan", "")
    if not rollback or not rollback.strip():
        violations.append(
            ReviewViolation(
                "MISSING_ROLLBACK_PLAN",
                "Changeset has no rollback_plan. Executor without rollback is forbidden.",
            )
        )

    # --- 3. Acceptance criteria must be substantive ---
    criteria = changeset.get("acceptance_criteria", [])
    if len(criteria) == 0:
        violations.append(
            ReviewViolation(
                "MISSING_ACCEPTANCE_CRITERIA",
                "Changeset has no acceptance_criteria.",
            )
        )
    else:
        for i, c in enumerate(criteria):
            if len(c.strip()) < 10:
                violations.append(
                    ReviewViolation(
                        "TRIVIAL_ACCEPTANCE_CRITERION",
                        f"Criterion [{i}] is too vague: '{c}'",
                        severity="warning",
                    )
                )

    # --- 4. Budget consistency ---
    budget = changeset.get("change_budget", {})
    changes = changeset.get("changes", [])
    declared_files = budget.get("files_modified", 0)

    # Count unique paths in changes
    unique_paths = set()
    for change in changes:
        unique_paths.add(change.get("path", ""))

    if len(unique_paths) > declared_files:
        violations.append(
            ReviewViolation(
                "BUDGET_INCONSISTENCY",
                f"Changeset declares budget of {declared_files} files but proposes {len(unique_paths)} unique paths.",
            )
        )

    # --- 5. Path validation against snapshot and filesystem ---
    allowed_paths = changeset.get("scope", {}).get("allowed_paths", [])
    prohibited_paths = changeset.get("scope", {}).get("prohibited_paths", [])

    for change in changes:
        change_path = change.get("path", "")
        change_type = change.get("type", "")

        # Check prohibited paths
        for prohibited in prohibited_paths:
            prohibited_clean = prohibited.rstrip("/*")
            if change_path.startswith(prohibited_clean):
                violations.append(
                    ReviewViolation(
                        "PROHIBITED_PATH_VIOLATION",
                        f"Change targets '{change_path}' which falls under prohibited path '{prohibited}'.",
                    )
                )

        # For modify/delete, target must exist
        if change_type in ("modify", "delete"):
            full_path = project_root / change_path
            if not full_path.exists():
                violations.append(
                    ReviewViolation(
                        "INVALID_TARGET_PATH",
                        f"Change type '{change_type}' targets '{change_path}' but file does not exist.",
                    )
                )

        # For create, parent directory must exist (or be creatable)
        if change_type == "create":
            parent = (project_root / change_path).parent
            if not parent.exists():
                violations.append(
                    ReviewViolation(
                        "INVALID_PARENT_PATH",
                        f"Change type 'create' targets '{change_path}' but parent directory '{parent}' does not exist.",
                        severity="warning",
                    )
                )

    # --- 6. Source gap refs must be present ---
    if not changeset.get("source_gap_refs"):
        violations.append(
            ReviewViolation(
                "ORPHAN_CHANGESET",
                "Changeset has no source_gap_refs. Orphan changes are forbidden.",
            )
        )

    return violations


def main():
    if len(sys.argv) < 2:
        print("Usage: python changeset_reviewer.py <active_task_dir> [project_root]")
        sys.exit(1)

    active_task_dir = Path(sys.argv[1])
    project_root = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(__file__).resolve().parent.parent.parent.parent.parent

    changeset_path = active_task_dir / "03_proposed_changeset.json"
    snapshot_path = active_task_dir / "01_system_snapshot.json"

    if not changeset_path.exists():
        print(f"Error: {changeset_path} not found.")
        sys.exit(1)

    changeset = load_json(changeset_path)
    snapshot = load_json(snapshot_path) if snapshot_path.exists() else {}

    violations = review_changeset(changeset, snapshot, project_root)

    # Build review report
    errors = [v for v in violations if v.severity == "error"]
    warnings = [v for v in violations if v.severity == "warning"]

    report = {
        "changeset_id": changeset.get("changeset_id", "unknown"),
        "verdict": "DENY" if errors else "ALLOW",
        "error_count": len(errors),
        "warning_count": len(warnings),
        "violations": [v.to_dict() for v in violations],
    }

    report_path = active_task_dir / "03_changeset_review.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    if errors:
        print(f"DENY — {len(errors)} error(s), {len(warnings)} warning(s)")
        for v in errors:
            print(f"  ✗ [{v.code}] {v.message}")
        for v in warnings:
            print(f"  ⚠ [{v.code}] {v.message}")
        sys.exit(1)
    else:
        print(f"ALLOW — 0 errors, {len(warnings)} warning(s)")
        for v in warnings:
            print(f"  ⚠ [{v.code}] {v.message}")
        print(f"Review saved to {report_path}")


if __name__ == "__main__":
    main()
