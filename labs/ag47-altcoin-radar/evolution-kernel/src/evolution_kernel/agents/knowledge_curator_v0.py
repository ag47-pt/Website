"""
Knowledge Curator v0 — Deterministic Memory Guardian.

The Curator ensures that only validated, high-confidence learnings 
are written to the protocol's permanent memory.

Rules enforced:
1. MISSING_VALIDATION_SOURCE: Knowledge cannot be promoted without an ALLOW verdict.
2. INSUFFICIENT_CONFIDENCE: Confidence must be >= 0.75.
3. MERGE_REQUIRED: Exact duplicate statements are flagged for merging.
4. IMMUTABLE_HISTORY_VIOLATION: Attempting to delete or overwrite without SUPERSEDED state.
"""
import json
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Tuple


class CurationViolation:
    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message

    def to_dict(self) -> dict:
        return {"code": self.code, "message": self.message}


def load_json(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def curate_knowledge(
    proposed_entry: Dict[str, Any],
    verdict: Dict[str, Any],
    action: str,  # "create" or "delete" (adversarial check)
    existing_knowledge: List[Dict[str, Any]]
) -> Tuple[str, List[CurationViolation], Dict[str, Any]]:
    
    violations: List[CurationViolation] = []
    
    # 1. Immutable History Violation
    if action == "delete":
        violations.append(CurationViolation("IMMUTABLE_HISTORY_VIOLATION", "Knowledge cannot be deleted. Use SUPERSEDED state."))
        return "DENY", violations, {}

    # 2. Missing Validation Source
    if verdict.get("verdict") != "ALLOW":
        violations.append(CurationViolation("MISSING_VALIDATION_SOURCE", "Knowledge cannot be promoted without an ALLOW Integrity Verdict."))
    
    # 3. Insufficient Confidence
    confidence = proposed_entry.get("confidence", 0.0)
    if confidence < 0.75:
        violations.append(CurationViolation("INSUFFICIENT_CONFIDENCE", f"Confidence {confidence} is below minimum threshold of 0.75."))
        
    # 4. Duplication Check
    proposed_statement = proposed_entry.get("statement", "").strip().lower()
    for existing in existing_knowledge:
        existing_stmt = existing.get("statement", "").strip().lower()
        if existing_stmt == proposed_statement and existing.get("lifecycle_state") == "ACTIVE":
            violations.append(CurationViolation("DUPLICATE_KNOWLEDGE", "Exact statement already exists in ACTIVE state."))
            return "MERGE_REQUIRED", violations, {}

    if violations:
        return "DENY", violations, {}

    # Finalize Entry
    final_entry = {**proposed_entry}
    if "knowledge_id" not in final_entry:
        final_entry["knowledge_id"] = f"know-{uuid.uuid4().hex[:8]}"
        
    final_entry["lifecycle_state"] = "ACTIVE"
    final_entry["created_at"] = datetime.now(timezone.utc).isoformat()
    
    # Ensure source evidence links to verdict
    verdict_id = verdict.get("verdict_id")
    if verdict_id and verdict_id not in final_entry.get("source_evidence", []):
        final_entry.setdefault("source_evidence", []).append(verdict_id)

    return "ALLOW", violations, final_entry


def main():
    if len(sys.argv) < 3:
        print("Usage: python knowledge_curator_v0.py <active_task_dir> <project_root>")
        sys.exit(1)

    active_task_dir = Path(sys.argv[1])
    project_root = Path(sys.argv[2])
    knowledge_dir = project_root / ".evolution" / "knowledge"

    proposed_path = active_task_dir / "proposed_knowledge.json"
    verdict_path = active_task_dir / "05_integrity_verdict.json"

    if not proposed_path.exists() or not verdict_path.exists():
        print("Missing proposed_knowledge.json or 05_integrity_verdict.json")
        sys.exit(1)

    proposed_entry = load_json(proposed_path)
    verdict = load_json(verdict_path)
    
    existing_knowledge = []
    if knowledge_dir.exists():
        for k_file in knowledge_dir.glob("*.json"):
            existing_knowledge.append(load_json(k_file))

    status, violations, entry = curate_knowledge(proposed_entry, verdict, "create", existing_knowledge)

    if status == "ALLOW":
        knowledge_dir.mkdir(parents=True, exist_ok=True)
        out_path = knowledge_dir / f"{entry['knowledge_id']}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(entry, f, indent=2)
        print(f"KNOWLEDGE PROMOTED: {out_path}")
    else:
        print(f"CURATION BLOCKED: {status}")
        for v in violations:
            print(f"  ✗ [{v.code}] {v.message}")
        sys.exit(1)


if __name__ == "__main__":
    main()
