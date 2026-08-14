import json
import os

SCHEMA_DIR = os.path.join(os.path.dirname(__file__), '..', 'schemas', 'governance')
FIXTURES_DIR = os.path.join(os.path.dirname(__file__), '..', 'schemas', 'fixtures')

def save_fixture(schema_name, filename, data, is_valid=True, reason=""):
    schema_folder = schema_name.replace('.schema.json', '')
    subfolder = "valid" if is_valid else "invalid"
    target_dir = os.path.join(FIXTURES_DIR, subfolder, schema_folder)
    os.makedirs(target_dir, exist_ok=True)
    file_path = os.path.join(target_dir, filename)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    if not is_valid:
        meta_path = file_path.replace('.json', '.meta.json')
        meta_data = {
            "expected_to_fail": True,
            "schema": schema_folder,
            "reason": reason
        }
        with open(meta_path, 'w', encoding='utf-8') as f:
            json.dump(meta_data, f, indent=2)

def generate_role_definition():
    schema = "role-definition.schema.json"
    
    # Valid 1
    save_fixture(schema, "role-valid-1.json", {
        "schema_version": "1.0.0",
        "role_id": "architect-guardian",
        "name": "Architectural Guardian",
        "description": "Protects the core architecture.",
        "permissions": ["approve_architecture", "reject_changeset"],
        "prohibited_actions": ["execute_code"],
        "allowed_transitions": ["PENDING_TO_APPROVED"],
        "required_skills": ["architecture-analysis"]
    })
    
    # Valid 2
    save_fixture(schema, "role-valid-2.json", {
        "schema_version": "1.0.0",
        "role_id": "executor",
        "name": "Executor",
        "description": "Executes allowed changes.",
        "permissions": ["write_code"],
        "prohibited_actions": ["approve_own_changes"]
    })
    
    # Invalid 1 (missing required permissions)
    save_fixture(schema, "role-invalid-1.json", {
        "schema_version": "1.0.0",
        "role_id": "architect-guardian",
        "name": "Architectural Guardian",
        "description": "Protects the core architecture.",
        "prohibited_actions": ["execute_code"]
    }, False, "Missing permissions")

    # Invalid 2 (empty permissions array)
    save_fixture(schema, "role-invalid-2.json", {
        "schema_version": "1.0.0",
        "role_id": "architect-guardian",
        "name": "Architectural Guardian",
        "description": "Protects the core architecture.",
        "permissions": [],
        "prohibited_actions": ["execute_code"]
    }, False, "Permissions array minItems is 1")

    # Invalid 3 (bad role_id format)
    save_fixture(schema, "role-invalid-3.json", {
        "schema_version": "1.0.0",
        "role_id": "ARCHITECT_GUARDIAN",
        "name": "Architectural Guardian",
        "description": "Protects the core architecture.",
        "permissions": ["approve"],
        "prohibited_actions": []
    }, False, "Role ID must be lowercase alphanumeric and hyphens")

def generate_skill_definition():
    schema = "skill-definition.schema.json"
    
    save_fixture(schema, "skill-valid-1.json", {
        "schema_version": "1.0.0",
        "skill_id": "python-analyzer",
        "name": "Python Analyzer",
        "description": "Analyzes Python AST",
        "objective": "Identify security vulnerabilities in Python files",
        "inputs": ["source_code"],
        "outputs": ["vulnerability_report"],
        "tools_required": ["ast_parser"],
        "boundaries": ["read_only"],
        "cost_profile": "MEDIUM",
        "test_criteria": ["must_detect_eval"],
        "version": "1.2.0"
    })
    
    save_fixture(schema, "skill-valid-2.json", {
        "schema_version": "1.0.0",
        "skill_id": "db-migrator",
        "name": "DB Migrator",
        "description": "Runs migrations",
        "objective": "Apply database changes",
        "inputs": ["sql_files"],
        "outputs": ["migration_log"],
        "tools_required": ["postgres_client"],
        "boundaries": ["only_target_db"],
        "cost_profile": "HIGH",
        "test_criteria": ["must_rollback_on_error"],
        "version": "1.0.0"
    })
    
    save_fixture(schema, "skill-invalid-1.json", {
        "schema_version": "1.0.0",
        "skill_id": "db-migrator",
        "name": "DB Migrator",
        "description": "Runs migrations",
        "objective": "Apply database changes",
        "inputs": ["sql_files"],
        "outputs": ["migration_log"],
        "boundaries": ["only_target_db"],
        "cost_profile": "CHEAP",
        "test_criteria": ["must_rollback_on_error"],
        "version": "1.0.0"
    }, False, "Invalid cost_profile enum")

    save_fixture(schema, "skill-invalid-2.json", {
        "schema_version": "1.0.0",
        "skill_id": "db_migrator",
        "name": "DB Migrator",
        "description": "Runs migrations",
        "objective": "Apply database changes",
        "inputs": ["sql_files"],
        "outputs": ["migration_log"],
        "boundaries": ["only_target_db"],
        "cost_profile": "HIGH",
        "test_criteria": ["must_rollback_on_error"],
        "version": "1.0.0"
    }, False, "skill_id pattern mismatch")

    save_fixture(schema, "skill-invalid-3.json", {
        "schema_version": "1.0.0",
        "skill_id": "db-migrator",
        "name": "DB Migrator",
        "description": "Runs migrations",
        "objective": "Apply database changes",
        "inputs": ["sql_files"],
        "outputs": ["migration_log"],
        "boundaries": ["only_target_db"],
        "cost_profile": "HIGH",
        "test_criteria": ["must_rollback_on_error"]
    }, False, "Missing version field")

def generate_capability_policy():
    schema = "capability-policy.schema.json"
    
    save_fixture(schema, "capability-valid-1.json", {
        "schema_version": "1.0.0",
        "capability_id": "cap-db-read",
        "role_ref": "role-auditor",
        "skill_refs": ["skill-db-reader"],
        "allowed_contexts": ["database/read_replicas/**"],
        "forbidden_contexts": ["database/primary/**"]
    })
    
    save_fixture(schema, "capability-valid-2.json", {
        "schema_version": "1.0.0",
        "capability_id": "cap-frontend-edit",
        "role_ref": "role-executor",
        "skill_refs": ["skill-react-dev", "skill-css"],
        "allowed_contexts": ["apps/web/src/**"],
        "forbidden_contexts": ["apps/api/**"],
        "budget_limits": {
            "max_tokens": 100000,
            "max_time_ms": 300000
        }
    })
    
    save_fixture(schema, "capability-invalid-1.json", {
        "schema_version": "1.0.0",
        "capability_id": "cap-frontend-edit",
        "role_ref": "role-executor",
        "skill_refs": [],
        "allowed_contexts": ["apps/web/src/**"],
        "forbidden_contexts": ["apps/api/**"]
    }, False, "skill_refs array minItems is 1")
    
    save_fixture(schema, "capability-invalid-2.json", {
        "schema_version": "1.0.0",
        "capability_id": "cap-frontend-edit",
        "role_ref": "role-executor",
        "skill_refs": ["skill-react-dev"],
        "allowed_contexts": ["apps/web/src/**"],
        "forbidden_contexts": ["apps/api/**"],
        "budget_limits": {
            "max_tokens": -100
        }
    }, False, "max_tokens minimum is 0")
    
    save_fixture(schema, "capability-invalid-3.json", {
        "schema_version": "2.0.0",
        "capability_id": "cap-frontend-edit",
        "role_ref": "role-executor",
        "skill_refs": ["skill-react-dev"],
        "allowed_contexts": ["apps/web/src/**"],
        "forbidden_contexts": ["apps/api/**"]
    }, False, "Invalid schema_version")

def generate_workflow_definition():
    schema = "workflow-definition.schema.json"
    
    save_fixture(schema, "workflow-valid-1.json", {
        "schema_version": "1.0.0",
        "workflow_id": "wf-evolution-cycle",
        "name": "Evolution Cycle",
        "steps": [
            {
                "step_name": "planning",
                "role_required": "planner",
                "inputs_required": ["context"],
                "outputs_produced": ["evolution_hypothesis"]
            }
        ]
    })
    
    save_fixture(schema, "workflow-valid-2.json", {
        "schema_version": "1.0.0",
        "workflow_id": "wf-bug-fix",
        "name": "Bug Fix Cycle",
        "steps": [
            {
                "step_name": "reproduction",
                "role_required": "debugger",
                "inputs_required": ["bug_report"],
                "outputs_produced": ["reproduction_script"],
                "exit_conditions": ["script_fails_consistently"]
            },
            {
                "step_name": "fix",
                "role_required": "executor",
                "inputs_required": ["reproduction_script"],
                "outputs_produced": ["changeset"]
            }
        ]
    })
    
    save_fixture(schema, "workflow-invalid-1.json", {
        "schema_version": "1.0.0",
        "workflow_id": "wf-bug-fix",
        "name": "Bug Fix Cycle",
        "steps": []
    }, False, "Steps array minItems is 1")
    
    save_fixture(schema, "workflow-invalid-2.json", {
        "schema_version": "1.0.0",
        "workflow_id": "wf-bug-fix",
        "name": "Bug Fix Cycle",
        "steps": [
            {
                "step_name": "reproduction",
                "role_required": "debugger"
            }
        ]
    }, False, "Missing inputs_required and outputs_produced in step")
    
    save_fixture(schema, "workflow-invalid-3.json", {
        "schema_version": "1.0.0",
        "workflow_id": "wf_bug_fix",
        "name": "Bug Fix Cycle",
        "steps": [
            {
                "step_name": "planning",
                "role_required": "planner",
                "inputs_required": ["context"],
                "outputs_produced": ["evolution_hypothesis"]
            }
        ]
    }, False, "Invalid workflow_id pattern")

def generate_policy_definition():
    schema = "policy-definition.schema.json"
    
    save_fixture(schema, "policy-valid-1.json", {
        "schema_version": "1.0.0",
        "policy_id": "pol-no-direct-push",
        "name": "No Direct Push",
        "rule": "DENY",
        "condition": "branch == 'main'",
        "reason": "Main branch requires PR",
        "enforcement_level": "STRICT"
    })
    
    save_fixture(schema, "policy-valid-2.json", {
        "schema_version": "1.0.0",
        "policy_id": "pol-audit-deps",
        "name": "Audit Dependencies",
        "rule": "REQUIRE_APPROVAL",
        "condition": "files_changed contains 'package.json'",
        "reason": "Security review needed for new packages",
        "enforcement_level": "AUDIT_ONLY"
    })
    
    save_fixture(schema, "policy-invalid-1.json", {
        "schema_version": "1.0.0",
        "policy_id": "pol-no-direct-push",
        "name": "No Direct Push",
        "rule": "BLOCK",
        "condition": "branch == 'main'",
        "reason": "Main branch requires PR",
        "enforcement_level": "STRICT"
    }, False, "Invalid rule enum")
    
    save_fixture(schema, "policy-invalid-2.json", {
        "schema_version": "1.0.0",
        "policy_id": "pol-no-direct-push",
        "name": "No Direct Push",
        "rule": "DENY",
        "condition": "branch == 'main'",
        "reason": "Main branch requires PR",
        "enforcement_level": "MILD"
    }, False, "Invalid enforcement_level enum")
    
    save_fixture(schema, "policy-invalid-3.json", {
        "schema_version": "1.0.0",
        "policy_id": "pol-no-direct-push",
        "name": "No Direct Push",
        "rule": "DENY"
    }, False, "Missing required fields")

def generate_decision_context():
    schema = "decision-context.schema.json"
    
    save_fixture(schema, "decision-valid-1.json", {
        "schema_version": "1.0.0",
        "context_id": "123e4567-e89b-12d3-a456-426614174000",
        "trigger": "User request for new feature",
        "observations": ["System currently lacks X"],
        "constraints": ["Must be backwards compatible"],
        "chosen_path_ref": {
            "ref_id": "ref-1",
            "hash": "abc123hash"
        },
        "rationale": "Safest path with lowest risk"
    })
    
    save_fixture(schema, "decision-valid-2.json", {
        "schema_version": "1.0.0",
        "context_id": "123e4567-e89b-12d3-a456-426614174001",
        "trigger": "High latency in API",
        "observations": ["Endpoint X takes 500ms", "DB queries are not indexed"],
        "constraints": ["No downtime allowed"],
        "alternatives_considered": ["Add Redis cache", "Add DB indexes"],
        "chosen_path_ref": {
            "ref_id": "ref-2",
            "hash": "def456hash"
        },
        "rejected_paths": ["Add Redis cache"],
        "rationale": "Indexes are cheaper and solve the root cause"
    })
    
    save_fixture(schema, "decision-invalid-1.json", {
        "schema_version": "1.0.0",
        "context_id": "not-a-uuid",
        "trigger": "User request for new feature",
        "observations": ["System currently lacks X"],
        "constraints": ["Must be backwards compatible"],
        "chosen_path_ref": {
            "ref_id": "ref-1",
            "hash": "abc123hash"
        },
        "rationale": "Safest path with lowest risk"
    }, False, "Invalid context_id format (not UUID)")
    
    save_fixture(schema, "decision-invalid-2.json", {
        "schema_version": "1.0.0",
        "context_id": "123e4567-e89b-12d3-a456-426614174000",
        "trigger": "User request for new feature",
        "observations": [],
        "constraints": ["Must be backwards compatible"],
        "chosen_path_ref": {
            "ref_id": "ref-1",
            "hash": "abc123hash"
        },
        "rationale": "Safest path with lowest risk"
    }, False, "observations array minItems is 1")
    
    save_fixture(schema, "decision-invalid-3.json", {
        "schema_version": "1.0.0",
        "context_id": "123e4567-e89b-12d3-a456-426614174000",
        "trigger": "User request for new feature",
        "observations": ["System currently lacks X"],
        "constraints": ["Must be backwards compatible"],
        "rationale": "Safest path with lowest risk"
    }, False, "Missing chosen_path_ref")

def generate_knowledge_entry():
    schema = "knowledge-entry.schema.json"
    
    save_fixture(schema, "knowledge-valid-1.json", {
        "schema_version": "1.0.0",
        "entry_id": "123e4567-e89b-12d3-a456-426614174000",
        "source_verdict_ref": {
            "ref_id": "verdict-1",
            "hash": "verdict_hash_1"
        },
        "topic": "JSON Schema Validation",
        "content": "Python jsonschema requires Draft202012Validator.FORMAT_CHECKER to validate UUIDs.",
        "confidence_level": 1.0,
        "promoted_by": {
            "role": "Curator",
            "signature": "sig_curator_1"
        },
        "status": "OFFICIAL"
    })
    
    save_fixture(schema, "knowledge-valid-2.json", {
        "schema_version": "1.0.0",
        "entry_id": "123e4567-e89b-12d3-a456-426614174001",
        "source_verdict_ref": {
            "ref_id": "verdict-2",
            "hash": "verdict_hash_2"
        },
        "topic": "API Latency",
        "content": "Endpoint X degrades when Y > 1000",
        "confidence_level": 0.5,
        "valid_until": "2027-01-01T00:00:00Z",
        "promoted_by": {
            "role": "Observer",
            "signature": "sig_obs_1"
        },
        "status": "CANDIDATE"
    })
    
    save_fixture(schema, "knowledge-invalid-1.json", {
        "schema_version": "1.0.0",
        "entry_id": "123e4567-e89b-12d3-a456-426614174000",
        "source_verdict_ref": {
            "ref_id": "verdict-1",
            "hash": "verdict_hash_1"
        },
        "topic": "JSON Schema Validation",
        "content": "Python jsonschema requires Draft202012Validator.FORMAT_CHECKER to validate UUIDs.",
        "confidence_level": 0.99,
        "promoted_by": {
            "role": "Curator",
            "signature": "sig_curator_1"
        },
        "status": "OFFICIAL"
    }, False, "confidence_level not in enum")
    
    save_fixture(schema, "knowledge-invalid-2.json", {
        "schema_version": "1.0.0",
        "entry_id": "123e4567-e89b-12d3-a456-426614174000",
        "source_verdict_ref": {
            "ref_id": "verdict-1",
            "hash": "verdict_hash_1"
        },
        "topic": "JSON Schema Validation",
        "content": "Python jsonschema requires Draft202012Validator.FORMAT_CHECKER to validate UUIDs.",
        "confidence_level": 1.0,
        "promoted_by": {
            "role": "Curator"
        },
        "status": "OFFICIAL"
    }, False, "promoted_by missing signature")
    
    save_fixture(schema, "knowledge-invalid-3.json", {
        "schema_version": "1.0.0",
        "entry_id": "123e4567-e89b-12d3-a456-426614174000",
        "source_verdict_ref": {
            "ref_id": "verdict-1",
            "hash": "verdict_hash_1"
        },
        "topic": "JSON Schema Validation",
        "content": "Python jsonschema requires Draft202012Validator.FORMAT_CHECKER to validate UUIDs.",
        "confidence_level": 1.0,
        "promoted_by": {
            "role": "Curator",
            "signature": "sig_curator_1"
        },
        "status": "REJECTED"
    }, False, "status not in enum")


if __name__ == "__main__":
    generate_role_definition()
    generate_skill_definition()
    generate_capability_policy()
    generate_workflow_definition()
    generate_policy_definition()
    generate_decision_context()
    generate_knowledge_entry()
    print("Fixtures for Lote 3 generated successfully!")
