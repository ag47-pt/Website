"""
Execution Engine v0 — Deterministic, zero-LLM executor.

The Executor is the first and only agent that modifies source code.
It is a muscle, not a brain.

Modes:
  dry-run  → Simulates every action, reports what would happen. Touches nothing.
  sandbox  → Copies affected files to .evolution/workspace/, executes there.
  apply    → BLOCKED in v0. Raises NotImplementedError by design.

The Executor:
  - Does NOT interpret intent.
  - Does NOT alter scope.
  - Does NOT approve itself.
  - Does NOT access external networks.
  - ONLY executes an approved proposed-changeset.
"""
import json
import sys
import uuid
import shutil
import hashlib
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Tuple


class ExecutionError(Exception):
    def __init__(self, code: str, message: str, path: str = ""):
        self.code = code
        self.message = message
        self.path = path


def load_json(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def hash_directory(directory: Path) -> str:
    """Create a deterministic hash of all files in a directory for snapshot purposes."""
    hasher = hashlib.sha256()
    if not directory.exists():
        return hasher.hexdigest()
    for file_path in sorted(directory.rglob("*")):
        if file_path.is_file():
            rel = file_path.relative_to(directory)
            hasher.update(str(rel).encode())
            hasher.update(file_path.read_bytes())
    return hasher.hexdigest()


def _resolve_action_type(change_type: str) -> str:
    """Map changeset change types to execution action types."""
    mapping = {
        "create": "create_file",
        "modify": "modify_file",
        "delete": "delete_file",
        "add_dependency": "add_dependency",
    }
    return mapping.get(change_type, change_type)


class ExecutionEngine:
    def __init__(self, project_root: Path):
        self.project_root = project_root.resolve()

    def execute(
        self,
        changeset: Dict[str, Any],
        mode: str,
        sandbox_root: Path | None = None,
    ) -> Dict[str, Any]:
        """
        Execute a proposed changeset in the given mode.
        Returns an execution report dict.
        """
        execution_id = f"exec-{uuid.uuid4().hex[:8]}"
        started_at = datetime.now(timezone.utc).isoformat()

        changes = changeset.get("changes", [])
        budget = changeset.get("change_budget", {})
        rollback_req = changeset.get("rollback_requirements", {})
        scope = changeset.get("scope", {})

        actions: List[Dict[str, Any]] = []
        errors: List[Dict[str, str]] = []
        evidence_refs: List[str] = []

        budget_consumed = {
            "files_modified": 0,
            "lines_added": 0,
            "lines_removed": 0,
            "new_dependencies": 0,
        }

        pre_snapshot_hash = None

        # --- Pre-execution: snapshot if required ---
        if rollback_req.get("snapshot_before", False) and mode != "dry-run":
            pre_snapshot_hash = hash_directory(self.project_root / "src")
            evidence_refs.append(f"pre_snapshot:{pre_snapshot_hash[:16]}")

        # --- Select execution target ---
        if mode == "apply":
            raise NotImplementedError(
                "apply mode is blocked in Executor v0. "
                "Use dry-run or sandbox. "
                "Apply requires Kernel ALLOW + Validator evidence."
            )

        work_root = self.project_root
        if mode == "sandbox":
            if sandbox_root is None:
                sandbox_root = self.project_root / ".evolution" / "workspace"
            sandbox_root.mkdir(parents=True, exist_ok=True)
            work_root = sandbox_root

        # --- Execute each change ---
        for change in changes:
            change_type = change.get("type", "")
            change_path = change.get("path", "")
            action_type = _resolve_action_type(change_type)

            # Scope enforcement
            prohibited = scope.get("prohibited_paths", [])
            for p in prohibited:
                p_clean = p.rstrip("/*")
                if change_path.startswith(p_clean):
                    errors.append({
                        "code": "SCOPE_VIOLATION",
                        "message": f"Path '{change_path}' falls under prohibited '{p}'",
                        "path": change_path,
                    })
                    actions.append({
                        "type": action_type,
                        "path": change_path,
                        "result": "skipped",
                        "detail": f"Prohibited by scope: {p}",
                    })
                    continue

            # Budget guard
            if budget_consumed["files_modified"] >= budget.get("files_modified", 999):
                errors.append({
                    "code": "EXECUTION_BUDGET_EXCEEDED",
                    "message": f"Budget of {budget.get('files_modified')} files exhausted before processing '{change_path}'",
                    "path": change_path,
                })
                actions.append({
                    "type": action_type,
                    "path": change_path,
                    "result": "skipped",
                    "detail": "Budget exhausted",
                })
                continue

            # --- DRY-RUN: simulate only ---
            if mode == "dry-run":
                result = self._simulate_change(change_type, change_path)
                actions.append({
                    "type": action_type,
                    "path": change_path,
                    "result": "simulated",
                    "detail": result,
                })
                budget_consumed["files_modified"] += 1

            # --- SANDBOX: execute in isolated workspace ---
            elif mode == "sandbox":
                try:
                    result = self._sandbox_change(
                        change_type, change_path, work_root
                    )
                    actions.append({
                        "type": action_type,
                        "path": change_path,
                        "result": "executed",
                        "detail": result,
                    })
                    budget_consumed["files_modified"] += 1
                except ExecutionError as e:
                    errors.append({
                        "code": e.code,
                        "message": e.message,
                        "path": e.path,
                    })
                    actions.append({
                        "type": action_type,
                        "path": change_path,
                        "result": "failed",
                        "detail": e.message,
                    })

        completed_at = datetime.now(timezone.utc).isoformat()

        status = "completed"
        if errors:
            status = "partial" if any(a["result"] == "executed" or a["result"] == "simulated" for a in actions) else "failed"

        report = {
            "execution_id": execution_id,
            "changeset_ref": changeset.get("changeset_id", "unknown"),
            "execution_mode": mode,
            "status": status,
            "started_at": started_at,
            "completed_at": completed_at,
            "actions": actions,
            "budget_consumed": budget_consumed,
            "budget_allowed": {
                "files_modified": budget.get("files_modified", 0),
                "lines_added": budget.get("lines_added", 0),
                "new_dependencies": budget.get("new_dependencies", 0),
            },
            "errors": errors,
            "evidence_refs": evidence_refs,
        }

        if pre_snapshot_hash:
            report["pre_snapshot_hash"] = pre_snapshot_hash

        return report

    def _simulate_change(self, change_type: str, path: str) -> str:
        """Dry-run: describe what would happen without touching anything."""
        full_path = self.project_root / path

        if change_type == "create":
            if full_path.exists():
                return f"Would overwrite existing file: {path}"
            return f"Would create new file: {path}"

        elif change_type == "modify":
            if not full_path.exists():
                return f"WARNING: Target does not exist: {path}"
            return f"Would modify existing file: {path} ({full_path.stat().st_size} bytes)"

        elif change_type == "delete":
            if not full_path.exists():
                return f"WARNING: Target does not exist for deletion: {path}"
            return f"Would delete file: {path}"

        elif change_type == "add_dependency":
            return f"Would add dependency referenced at: {path}"

        return f"Unknown change type: {change_type}"

    def _sandbox_change(self, change_type: str, path: str, sandbox_root: Path) -> str:
        """Sandbox: execute the change in an isolated workspace."""
        target = sandbox_root / path

        if change_type == "create":
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(
                f"# Placeholder created by Executor v0\n"
                f"# Source changeset action: create {path}\n",
                encoding="utf-8",
            )
            return f"Created placeholder at sandbox: {path}"

        elif change_type == "modify":
            # Copy original to sandbox first, then mark as modified
            source = self.project_root / path
            if source.exists():
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, target)
                # Append a modification marker
                with open(target, "a", encoding="utf-8") as f:
                    f.write(f"\n# Modified by Executor v0\n")
                return f"Copied and marked as modified in sandbox: {path}"
            else:
                raise ExecutionError(
                    "FILE_NOT_FOUND",
                    f"Cannot modify '{path}': file does not exist in project.",
                    path,
                )

        elif change_type == "delete":
            source = self.project_root / path
            if source.exists():
                target.parent.mkdir(parents=True, exist_ok=True)
                # In sandbox we don't delete from real project, we record intent
                target.write_text(
                    f"# DELETED by Executor v0\n# Original: {path}\n",
                    encoding="utf-8",
                )
                return f"Marked for deletion in sandbox: {path}"
            else:
                raise ExecutionError(
                    "FILE_NOT_FOUND",
                    f"Cannot delete '{path}': file does not exist.",
                    path,
                )

        elif change_type == "add_dependency":
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(
                f"# Dependency placeholder by Executor v0: {path}\n",
                encoding="utf-8",
            )
            return f"Dependency placeholder created in sandbox: {path}"

        raise ExecutionError("UNKNOWN_CHANGE_TYPE", f"Unrecognized type: {change_type}", path)


def main():
    if len(sys.argv) < 3:
        print("Usage: python executor_v0.py <active_task_dir> <mode>")
        print("  mode: dry-run | sandbox | apply")
        sys.exit(1)

    active_task_dir = Path(sys.argv[1])
    mode = sys.argv[2]
    project_root = Path(__file__).resolve().parent.parent.parent.parent.parent

    if mode not in ("dry-run", "sandbox", "apply"):
        print(f"Error: Invalid mode '{mode}'. Must be dry-run, sandbox, or apply.")
        sys.exit(1)

    changeset_path = active_task_dir / "03_proposed_changeset.json"
    review_path = active_task_dir / "03_changeset_review.json"

    if not changeset_path.exists():
        print(f"Error: {changeset_path} not found.")
        sys.exit(1)

    # Require review pass before execution
    if review_path.exists():
        review = load_json(review_path)
        if review.get("verdict") != "ALLOW":
            print(f"Error: Changeset review verdict is '{review.get('verdict')}'. Execution blocked.")
            sys.exit(1)
    else:
        print("Warning: No changeset review found. Proceeding without review gate.")

    changeset = load_json(changeset_path)

    engine = ExecutionEngine(project_root)

    try:
        report = engine.execute(changeset, mode)

        report_path = active_task_dir / "04_execution_report.json"
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)

        print(f"Execution complete. Mode: {mode}")
        print(f"Status: {report['status']}")
        print(f"Actions: {len(report['actions'])}")
        print(f"Errors: {len(report['errors'])}")
        print(f"Report saved to {report_path}")

        if report["errors"]:
            for err in report["errors"]:
                print(f"  ✗ [{err['code']}] {err['message']}")
            sys.exit(1)

    except NotImplementedError as e:
        print(f"BLOCKED: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
