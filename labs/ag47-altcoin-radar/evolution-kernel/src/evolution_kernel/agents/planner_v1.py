"""
Planner v1 — Cognitive Planner via Cognitive Gateway.

Receives validated artifacts (architecture gap, target architecture, active task,
and optional historical context). Sends them through the Cognitive Gateway to a
Gemini LLM. The LLM returns a candidate-plan which is purified into a
proposed-changeset by the Gateway.

The Planner NEVER accesses the filesystem directly for source code.
It receives only Kernel-validated artifacts.
"""
import json
import sys
from pathlib import Path

from evolution_kernel.cognitive_gateway.gateway import CognitiveGateway, GatewayError
from evolution_kernel.cognitive_gateway.adapters.gemini import GeminiAdapter, GeminiAdapterError


def load_json(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_text(path: Path) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def collect_historical_context(project_root: Path) -> dict:
    """
    Gathers optional historical artifacts the Planner can use for informed
    decision-making. Returns only what exists; never fails on missing data.
    """
    historical = {}

    # Architecture Decision Records
    adr_dir = project_root / "evolution-protocol" / "docs" / "adrs"
    if adr_dir.is_dir():
        adrs = {}
        for adr_file in sorted(adr_dir.glob("*.md")):
            adrs[adr_file.stem] = load_text(adr_file)
        if adrs:
            historical["architecture_decisions"] = adrs

    # Sprint Ledger
    ledger_path = project_root / ".evolution" / "ledger" / "sprint_ledger.json"
    if ledger_path.exists():
        historical["sprint_ledger"] = load_json(ledger_path)

    # Promoted Knowledge Entries
    knowledge_dir = project_root / ".evolution" / "knowledge"
    if knowledge_dir.is_dir():
        entries = {}
        for entry_file in sorted(knowledge_dir.glob("*.json")):
            entries[entry_file.stem] = load_json(entry_file)
        if entries:
            historical["knowledge_entries"] = entries

    return historical


def main():
    if len(sys.argv) < 2:
        print("Usage: python planner_v1.py <active_task_dir>")
        sys.exit(1)

    active_task_dir = Path(sys.argv[1])
    project_root = Path(__file__).resolve().parent.parent.parent.parent.parent

    # --- 1. Load mandatory artifacts ---
    gap_path = active_task_dir / "02_architecture_gap.json"
    task_path = active_task_dir / "active-task.json"
    target_path = active_task_dir / "target-architecture.json"

    for required, name in [
        (gap_path, "02_architecture_gap.json"),
        (task_path, "active-task.json"),
        (target_path, "target-architecture.json"),
    ]:
        if not required.exists():
            print(f"Error: {name} not found at {required}")
            sys.exit(1)

    gaps_data = load_json(gap_path)
    task_data = load_json(task_path)
    target_data = load_json(target_path)

    if not gaps_data.get("gaps"):
        print("No gaps found. Nothing to plan.")
        sys.exit(0)

    # --- 2. Assemble context (artifacts only, never raw filesystem) ---
    context = {
        "02_architecture_gap.json": gaps_data,
        "target-architecture.json": target_data,
        "active-task.json": task_data,
    }

    historical = collect_historical_context(project_root)
    if historical:
        context["historical_context"] = historical

    # --- 3. Load configurations from Registry ---
    registry_path = project_root / ".evolution" / "models" / "registry.json"
    registry = load_json(registry_path)
    planner_config = registry["planner_v1"]

    prompt_path = project_root / planner_config["system_prompt_ref"]
    system_prompt = load_text(prompt_path)

    candidate_schema_path = (
        project_root / ".evolution" / "schemas" / "core" / "candidate-plan.schema.json"
    )
    candidate_schema = load_json(candidate_schema_path)

    # --- 4. Build request metadata ---
    request = {
        "agent": "planner-v1",
        "task": "tactical_planning",
        "input_artifacts": list(context.keys()),
        "constraints": [
            "no_execution",
            "no_filesystem_access",
            "must_provide_source_gap_refs",
            "respect_change_budget",
        ],
    }

    # --- 5. Initialize Adapter & Gateway ---
    if "gemini" in planner_config["provider"]:
        adapter = GeminiAdapter(
            model=planner_config["model"],
            temperature=planner_config["temperature"],
        )
    else:
        print(f"Unsupported provider: {planner_config['provider']}")
        sys.exit(1)

    gateway = CognitiveGateway(
        adapter,
        candidate_schema,
        system_prompt,
        prompt_version="planner-v1",
        agent_role="planner",
    )

    # --- 6. Execute Cognitive Task ---
    try:
        print(f"Connecting to {planner_config['model']} via Cognitive Gateway (role=planner)...")
        result = gateway.execute_task(request, context)

        # Save proposed changeset
        changeset_path = active_task_dir / "03_proposed_changeset.json"
        with open(changeset_path, "w", encoding="utf-8") as f:
            out_data = {
                "$schema": "../../schemas/core/proposed-changeset.schema.json"
            }
            out_data.update(result["artifact"])
            json.dump(out_data, f, indent=2)

        # Save interaction record
        interaction_path = active_task_dir / "03_proposed_changeset_interaction.json"
        with open(interaction_path, "w", encoding="utf-8") as f:
            json.dump(result["interaction_record"], f, indent=2)

        print(f"Success. 03_proposed_changeset.json generated at {changeset_path}")
        print(f"Interaction record saved to {interaction_path}")

    except GatewayError as e:
        print(f"Gateway execution failed:\n{e}")
        sys.exit(1)
    except GeminiAdapterError as e:
        print(f"LLM adapter error:\n{e}")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error:\n{e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
