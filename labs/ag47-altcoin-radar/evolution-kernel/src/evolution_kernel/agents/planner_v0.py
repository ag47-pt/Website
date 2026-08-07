import sys
import json
import uuid
from pathlib import Path
from jsonschema import validate, ValidationError

def main():
    if len(sys.argv) < 2:
        print("Usage: python planner_v0.py <active_task_dir>")
        sys.exit(1)
        
    active_task_dir = Path(sys.argv[1])
    gap_path = active_task_dir / "02_architecture_gap.json"
    task_path = active_task_dir / "active-task.json"
    output_path = active_task_dir / "03_proposed_changeset.json"
    
    if not gap_path.exists():
        print(f"Error: {gap_path} not found.")
        sys.exit(1)
        
    if not task_path.exists():
        print(f"Error: {task_path} not found.")
        sys.exit(1)
        
    # Load inputs
    with open(gap_path, "r", encoding="utf-8") as f:
        gaps_data = json.load(f)
        
    with open(task_path, "r", encoding="utf-8") as f:
        task_data = json.load(f)
        
    # Load schema for validation
    schema_path = Path(__file__).parent.parent.parent.parent.parent / ".evolution" / "schemas" / "core" / "proposed-changeset.schema.json"
    with open(schema_path, "r", encoding="utf-8") as f:
        changeset_schema = json.load(f)
        
    optimization_objectives = task_data.get("optimization_objectives", [])
    
    # Very simplistic deterministic planner (v0)
    # It takes the first gap and generates a hardcoded changeset.
    
    if not gaps_data.get("gaps"):
        print("No gaps found. Nothing to plan.")
        sys.exit(0)
        
    first_gap = gaps_data["gaps"][0]
    gap_id = first_gap.get("id", "gap-unknown")
    
    # Generate deterministic changeset
    changeset = {
        "changeset_id": f"cs-{uuid.uuid4().hex[:8]}",
        "source_gap_refs": [gap_id],
        "intent": "Resolve architecture gaps with deterministic planner.",
        "scope": {
            "allowed_paths": ["src/*", "tests/*"],
            "prohibited_paths": [".evolution/*", "evolution-kernel/*"]
        },
        "change_budget": {
            "files_modified": 1,
            "lines_added": 50,
            "new_dependencies": 0
        },
        "changes": [
            {
                "type": "modify",
                "path": "src/dummy.py",
                "reason": f"Deterministic resolution for {gap_id}",
                "expected_effect": "Fixes missing framework."
            }
        ],
        "acceptance_criteria": [
            "Code compiles",
            "Tests pass"
        ],
        "risk_assessment": {
            "level": "low",
            "confidence": "high"
        },
        "rollback_plan": "git reset --hard HEAD",
        "execution_strategy": "incremental",
        "rollback_requirements": {
            "snapshot_before": True,
            "reversible": True
        },
        "evidence_required": ["test_execution_log"]
    }
    
    # If objective says 'security', we adjust risk
    if "security" in optimization_objectives:
        changeset["risk_assessment"]["level"] = "high"
        
    official_document = {
        "$schema": "../../schemas/core/proposed-changeset.schema.json",
        **changeset
    }
    
    try:
        validate(instance=official_document, schema=changeset_schema)
    except ValidationError as e:
        print(f"Planner v0 generated invalid schema: {e.message}")
        sys.exit(1)
        
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(official_document, f, indent=2)
        
    print(f"Success. 03_proposed_changeset.json generated at {output_path}")

if __name__ == "__main__":
    main()
