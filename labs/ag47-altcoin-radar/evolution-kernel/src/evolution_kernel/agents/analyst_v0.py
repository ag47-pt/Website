import os
import json
import uuid

def load_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def run_analyst(active_task_dir):
    snapshot_path = os.path.join(active_task_dir, "01_system_snapshot.json")
    target_path = os.path.join(active_task_dir, "target-architecture.json")
    
    if not os.path.exists(snapshot_path) or not os.path.exists(target_path):
        print("Missing snapshot or target architecture files.")
        return
        
    snapshot = load_json(snapshot_path)
    target = load_json(target_path)
    
    required = target.get("required", [])
    
    deps = [d.get("name", "").lower() for d in snapshot.get("dependencies", [])]
    test_frameworks = [t.lower() for t in snapshot.get("test_frameworks", [])]
    frameworks = [f.lower() for f in snapshot.get("environment", {}).get("frameworks", [])]
    
    gaps = []
    
    for req in required:
        req_lower = req.lower()
        if "test" in req_lower or req_lower == "pytest":
            if req_lower not in test_frameworks:
                gaps.append({
                    "id": f"gap-{uuid.uuid4().hex[:6]}",
                    "category": "testing",
                    "current_state": "no_test_framework_detected" if not test_frameworks or test_frameworks == ["unknown-test-framework"] else f"found {test_frameworks}",
                    "target_state": f"{req}_required",
                    "severity": "medium",
                    "confidence": 0.8,
                    "evidence_refs": ["system_snapshot.test_frameworks"]
                })
        elif req_lower in ["postgresql", "redis", "mongodb"]:
            if not any(req_lower in d for d in deps):
                gaps.append({
                    "id": f"gap-{uuid.uuid4().hex[:6]}",
                    "category": "database",
                    "current_state": "missing_dependency",
                    "target_state": f"{req}_required",
                    "severity": "high",
                    "confidence": 1.0,
                    "evidence_refs": ["system_snapshot.dependencies"]
                })
        elif "auth" in req_lower or "telegram" in req_lower:
            # simple check if any dependency has 'telegram' or 'auth'
            if not any(req_lower in d for d in deps):
                gaps.append({
                    "id": f"gap-{uuid.uuid4().hex[:6]}",
                    "category": "authentication",
                    "current_state": "missing",
                    "target_state": req,
                    "severity": "high",
                    "confidence": 1.0,
                    "evidence_refs": ["system_snapshot.dependencies", "system_snapshot.architecture.directories"]
                })
        else:
            # Generic fallback
            if req_lower not in deps and req_lower not in frameworks:
                gaps.append({
                    "id": f"gap-{uuid.uuid4().hex[:6]}",
                    "category": "feature",
                    "current_state": "missing",
                    "target_state": req,
                    "severity": "low",
                    "confidence": 0.5,
                    "evidence_refs": ["system_snapshot.dependencies"]
                })
                
    output = {
        "$schema": "../../schemas/core/architecture-gap.schema.json",
        "gaps": gaps
    }
    
    out_path = os.path.join(active_task_dir, "02_architecture_gap.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)
        
    print(f"Analyst v0 completed. Gap analysis generated at {out_path}")
    print(json.dumps(output, indent=2))

if __name__ == '__main__':
    import sys
    target = sys.argv[1] if len(sys.argv) > 1 else "."
    run_analyst(target)
