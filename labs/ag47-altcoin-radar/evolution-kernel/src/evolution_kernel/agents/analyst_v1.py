import json
import sys
import os
from pathlib import Path
from evolution_kernel.cognitive_gateway.gateway import CognitiveGateway, GatewayError
from evolution_kernel.cognitive_gateway.adapters.gemini import GeminiAdapter, GeminiAdapterError

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def load_text(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def main():
    if len(sys.argv) < 2:
        print("Usage: python analyst_v1.py <active_task_dir>")
        sys.exit(1)
        
    active_task_dir = Path(sys.argv[1])
    
    snapshot_path = active_task_dir / "01_system_snapshot.json"
    target_path = active_task_dir / "target-architecture.json"
    
    if not snapshot_path.exists() or not target_path.exists():
        print(f"Error: Missing snapshot or target architecture in {active_task_dir}")
        sys.exit(1)

    # 1. Load context
    snapshot = load_json(snapshot_path)
    target = load_json(target_path)
    context = {
        "01_system_snapshot.json": snapshot,
        "target-architecture.json": target
    }

    # 2. Load configurations from Registry
    registry_path = Path(__file__).parent.parent.parent.parent.parent / ".evolution" / "models" / "registry.json"
    registry = load_json(registry_path)
    analyst_config = registry["analyst_v1"]

    prompt_path = Path(__file__).parent.parent.parent.parent.parent / analyst_config["system_prompt_ref"]
    system_prompt = load_text(prompt_path)
    
    candidate_schema_path = Path(__file__).parent.parent.parent.parent.parent / ".evolution" / "schemas" / "core" / "candidate-analysis.schema.json"
    candidate_schema = load_json(candidate_schema_path)

    # 3. Create Request
    request = {
        "agent": "analyst-v1",
        "task": "gap_analysis",
        "input_artifacts": [
            "01_system_snapshot.json",
            "target-architecture.json"
        ],
        "constraints": [
            "no_solution_generation",
            "must_provide_evidence_refs"
        ]
    }

    # 4. Initialize Adapter & Gateway
    if "gemini" in analyst_config["provider"]:
        adapter = GeminiAdapter(
            model=analyst_config["model"], 
            temperature=analyst_config["temperature"]
        )
    else:
        print(f"Unsupported provider: {analyst_config['provider']}")
        sys.exit(1)
        
    gateway = CognitiveGateway(adapter, candidate_schema, system_prompt, prompt_version="analyst-v1")

    # 5. Execute Cognitive Task
    try:
        print(f"Connecting to {analyst_config['model']} via Cognitive Gateway...")
        result = gateway.execute_task(request, context)
        
        output_path = active_task_dir / "02_architecture_gap.json"
        with open(output_path, "w", encoding="utf-8") as f:
            out_data = {"$schema": "../../schemas/core/architecture-gap.schema.json"}
            out_data.update(result["artifact"])
            json.dump(out_data, f, indent=2)
            
        interaction_path = active_task_dir / "02_architecture_gap_interaction.json"
        with open(interaction_path, "w", encoding="utf-8") as f:
            json.dump(result["interaction_record"], f, indent=2)
            
        print(f"Success. 02_architecture_gap.json generated at {output_path}")
        print(f"Interaction record saved to {interaction_path}")
    except GatewayError as e:
        print(f"Gateway execution failed:\n{e}")
        sys.exit(1)
    except Exception as e:
        print(f"Execution failed:\n{str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
