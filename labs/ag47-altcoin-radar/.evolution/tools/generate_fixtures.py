import json
import os

base_dir = r"c:\Users\moise\Desktop\Agencia47\DEV\DEVELOPING\SANDBOX\Ag47.pt\labs\ag47-altcoin-radar\.evolution\schemas\fixtures"

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

# Define schemas and their fixtures
schemas = [
    "actor-signature",
    "project-constitution",
    "current-architecture",
    "target-architecture",
    "system-snapshot",
    "active-task",
    "change-budget"
]

fixtures = {
    "actor-signature": {
        "valid": [
            {
                "signature_id": "123e4567-e89b-12d3-a456-426614174001",
                "actor_type": "HUMAN",
                "actor_id": "moises",
                "timestamp": "2026-08-06T22:00:00Z",
                "action": "APPROVED",
                "target_resource": "ARCHITECTURE.md",
                "artifact_hash": "a1b2c3d4e5f6",
                "metadata": {"ip": "192.168.1.1"}
            },
            {
                "signature_id": "123e4567-e89b-12d3-a456-426614174002",
                "actor_type": "AI_AGENT",
                "actor_id": "orchestrator",
                "timestamp": "2026-08-06T23:00:00Z",
                "action": "MODIFIED",
                "target_resource": "app.py",
                "artifact_hash": "b2c3d4e5f6g7"
            }
        ],
        "invalid": [
            (
                {
                    "signature_id": "123e4567-e89b-12d3-a456-426614174003",
                    "actor_type": "HUMAN",
                    "timestamp": "2026-08-06T23:00:00Z",
                    "action": "APPROVED",
                    "target_resource": "ARCHITECTURE.md",
                    "artifact_hash": "a1b2c3d4e5f6"
                },
                {"schema": "actor-signature", "expected_failure_reason": "Missing required field 'actor_id'", "invalid_field": "actor_id"}
            ),
            (
                {
                    "signature_id": "invalid_uuid",
                    "actor_type": "HUMAN",
                    "actor_id": "moises",
                    "timestamp": "2026-08-06T23:00:00Z",
                    "action": "APPROVED",
                    "target_resource": "ARCHITECTURE.md",
                    "artifact_hash": "a1b2c3d4e5f6"
                },
                {"schema": "actor-signature", "expected_failure_reason": "signature_id is not a valid uuid format", "invalid_field": "signature_id"}
            ),
            (
                {
                    "signature_id": "123e4567-e89b-12d3-a456-426614174003",
                    "actor_type": "UNKNOWN_ACTOR",
                    "actor_id": "moises",
                    "timestamp": "2026-08-06T23:00:00Z",
                    "action": "APPROVED",
                    "target_resource": "ARCHITECTURE.md",
                    "artifact_hash": "a1b2c3d4e5f6"
                },
                {"schema": "actor-signature", "expected_failure_reason": "actor_type is not in the ENUM list", "invalid_field": "actor_type"}
            )
        ]
    },
    "project-constitution": {
        "valid": [
            {
                "version": "1.0.0",
                "domain": "Software Evolution",
                "core_principles": ["Incremental change"],
                "invariant_rules": ["Never rewrite history"],
                "roles": [
                    {"role_name": "Release Manager", "description": "Manages releases", "permissions": ["deploy"]}
                ],
                "closure_policies": {"HAR": "Must have manual approval"},
                "last_updated": "2026-08-06T22:00:00Z"
            },
            {
                "version": "1.1.0",
                "domain": "AI Protocol",
                "core_principles": ["Evidence based"],
                "invariant_rules": ["Do not store secrets"],
                "roles": [
                    {"role_name": "Validator", "description": "Validates schema", "permissions": ["validate"]}
                ],
                "last_updated": "2026-08-07T10:00:00Z"
            }
        ],
        "invalid": [
            (
                {
                    "version": "1.0.0",
                    "core_principles": ["Incremental change"],
                    "invariant_rules": ["Never rewrite history"],
                    "roles": [{"role_name": "Release Manager", "permissions": ["deploy"]}],
                    "last_updated": "2026-08-06T22:00:00Z"
                },
                {"schema": "project-constitution", "expected_failure_reason": "Missing required field 'domain'", "invalid_field": "domain"}
            ),
            (
                {
                    "version": "1.0.0",
                    "domain": "Software Evolution",
                    "core_principles": ["Incremental change"],
                    "invariant_rules": ["Never rewrite history"],
                    "roles": [
                        {"role_name": "Release Manager", "description": "Manages releases"}
                    ],
                    "last_updated": "2026-08-06T22:00:00Z"
                },
                {"schema": "project-constitution", "expected_failure_reason": "Role missing required field 'permissions'", "invalid_field": "roles[0].permissions"}
            ),
            (
                {
                    "version": "1.0.0",
                    "domain": "Software Evolution",
                    "core_principles": ["Incremental change"],
                    "invariant_rules": ["Never rewrite history"],
                    "roles": [{"role_name": "Release Manager", "permissions": ["deploy"]}],
                    "last_updated": "2026-08-06T22:00:00Z",
                    "extra_property": "Not allowed"
                },
                {"schema": "project-constitution", "expected_failure_reason": "Additional properties are not allowed", "invalid_field": "extra_property"}
            )
        ]
    },
    "current-architecture": {
        "valid": [
            {
                "version": "1.0.0",
                "last_updated": "2026-08-06T22:00:00Z",
                "components": [{"id": "c1", "name": "Auth", "type": "Service"}],
                "dependencies": [{"source": "c1", "target": "db1", "type": "db"}],
                "data_models": ["User"],
                "api_contracts": ["v1"],
                "known_technical_debt": ["Debt 1"]
            },
            {
                "version": "2.0.0",
                "last_updated": "2026-08-07T22:00:00Z",
                "components": [],
                "dependencies": []
            }
        ],
        "invalid": [
            (
                {
                    "version": "1.0.0",
                    "components": [{"id": "c1", "name": "Auth", "type": "Service"}],
                    "dependencies": [{"source": "c1", "target": "db1", "type": "db"}]
                },
                {"schema": "current-architecture", "expected_failure_reason": "Missing required field 'last_updated'", "invalid_field": "last_updated"}
            ),
            (
                {
                    "version": "1.0.0",
                    "last_updated": "invalid-date",
                    "components": [{"id": "c1", "name": "Auth", "type": "Service"}],
                    "dependencies": [{"source": "c1", "target": "db1", "type": "db"}]
                },
                {"schema": "current-architecture", "expected_failure_reason": "last_updated is not a valid date-time format", "invalid_field": "last_updated"}
            ),
            (
                {
                    "version": "1.0.0",
                    "last_updated": "2026-08-06T22:00:00Z",
                    "components": [{"id": "c1", "name": "Auth"}],
                    "dependencies": []
                },
                {"schema": "current-architecture", "expected_failure_reason": "Component missing required field 'type'", "invalid_field": "components[0].type"}
            )
        ]
    },
    "target-architecture": {
        "valid": [
            {
                "version": "2.0.0",
                "target_state_description": "Move to serverless",
                "components_to_add": ["Lambda1"],
                "components_to_modify": ["Auth API"],
                "components_to_remove": ["c1"],
                "migration_steps": ["Deploy lambda"],
                "success_criteria": ["100% traffic on lambda"]
            },
            {
                "version": "2.1.0",
                "target_state_description": "Update node versions",
                "success_criteria": ["All apps on node 20"]
            }
        ],
        "invalid": [
            (
                {
                    "version": "2.0.0",
                    "components_to_add": ["Lambda1"]
                },
                {"schema": "target-architecture", "expected_failure_reason": "Missing required fields 'target_state_description' and 'success_criteria'", "invalid_field": "target_state_description"}
            ),
            (
                {
                    "version": "2.0.0",
                    "target_state_description": "Move to serverless",
                    "success_criteria": "Not an array"
                },
                {"schema": "target-architecture", "expected_failure_reason": "success_criteria is not an array", "invalid_field": "success_criteria"}
            ),
            (
                {
                    "version": "2.0.0",
                    "target_state_description": "Move to serverless",
                    "success_criteria": ["100% traffic"],
                    "unknown_field": "error"
                },
                {"schema": "target-architecture", "expected_failure_reason": "Additional properties are not allowed", "invalid_field": "unknown_field"}
            )
        ]
    },
    "system-snapshot": {
        "valid": [
            {
                "snapshot_id": "123e4567-e89b-12d3-a456-426614174000",
                "timestamp": "2026-08-06T22:00:00Z",
                "trigger": "SCHEDULED",
                "health_status": "HEALTHY",
                "metrics": {"cpu": "50%"},
                "active_incidents": [],
                "infrastructure_state": {"nodes": 3}
            },
            {
                "snapshot_id": "123e4567-e89b-12d3-a456-426614174001",
                "timestamp": "2026-08-06T23:00:00Z",
                "trigger": "PRE_DEPLOY",
                "health_status": "DEGRADED"
            }
        ],
        "invalid": [
            (
                {
                    "snapshot_id": "123e4567-e89b-12d3-a456-426614174000",
                    "timestamp": "2026-08-06T22:00:00Z",
                    "trigger": "SCHEDULED"
                },
                {"schema": "system-snapshot", "expected_failure_reason": "Missing required field 'health_status'", "invalid_field": "health_status"}
            ),
            (
                {
                    "snapshot_id": "not-uuid",
                    "timestamp": "2026-08-06T22:00:00Z",
                    "trigger": "SCHEDULED",
                    "health_status": "HEALTHY"
                },
                {"schema": "system-snapshot", "expected_failure_reason": "snapshot_id is not a valid uuid", "invalid_field": "snapshot_id"}
            ),
            (
                {
                    "snapshot_id": "123e4567-e89b-12d3-a456-426614174000",
                    "timestamp": "2026-08-06T22:00:00Z",
                    "trigger": "UNKNOWN_TRIGGER",
                    "health_status": "HEALTHY"
                },
                {"schema": "system-snapshot", "expected_failure_reason": "trigger is not in ENUM", "invalid_field": "trigger"}
            )
        ]
    },
    "active-task": {
        "valid": [
            {
                "task_id": "TASK-1",
                "status": "IN_PROGRESS",
                "assignee": "agent-1",
                "description": "desc",
                "acceptance_criteria": ["crit 1"],
                "budget_ref": "123e4567-e89b-12d3-a456-426614174000"
            },
            {
                "task_id": "TASK-2",
                "status": "PENDING",
                "assignee": "system",
                "description": "Waiting for dependency",
                "acceptance_criteria": [],
                "budget_ref": "123e4567-e89b-12d3-a456-426614174001",
                "dependencies": ["TASK-1"]
            }
        ],
        "invalid": [
            (
                {
                    "task_id": "TASK-1",
                    "status": "IN_PROGRESS",
                    "assignee": "agent-1",
                    "description": "desc",
                    "acceptance_criteria": ["crit 1"]
                },
                {"schema": "active-task", "expected_failure_reason": "Missing required field 'budget_ref'", "invalid_field": "budget_ref"}
            ),
            (
                {
                    "task_id": "TASK-1",
                    "status": "INVALID_STATUS",
                    "assignee": "agent-1",
                    "description": "desc",
                    "acceptance_criteria": ["crit 1"],
                    "budget_ref": "123e4567-e89b-12d3-a456-426614174000"
                },
                {"schema": "active-task", "expected_failure_reason": "status is not in ENUM", "invalid_field": "status"}
            ),
            (
                {
                    "task_id": "TASK-1",
                    "status": "IN_PROGRESS",
                    "assignee": "agent-1",
                    "description": "desc",
                    "acceptance_criteria": ["crit 1"],
                    "budget_ref": "123e4567-e89b-12d3-a456-426614174000",
                    "extra": 123
                },
                {"schema": "active-task", "expected_failure_reason": "Additional properties are not allowed", "invalid_field": "extra"}
            )
        ]
    },
    "change-budget": {
        "valid": [
            {
                "budget_id": "123e4567-e89b-12d3-a456-426614174000",
                "max_files_modified": 10,
                "max_lines_modified": 500,
                "max_dependencies_added": 2,
                "max_migrations": 1,
                "max_model_calls": 50,
                "max_tokens": 100000,
                "max_cost_usd": 5.0,
                "max_execution_time_ms": 60000,
                "max_retries": 3
            },
            {
                "budget_id": "123e4567-e89b-12d3-a456-426614174001",
                "max_files_modified": 0,
                "max_lines_modified": 0,
                "max_dependencies_added": 0,
                "max_migrations": 0,
                "max_model_calls": 0,
                "max_tokens": 0,
                "max_cost_usd": 0.0,
                "max_execution_time_ms": 0,
                "max_retries": 0
            }
        ],
        "invalid": [
            (
                {
                    "budget_id": "123e4567-e89b-12d3-a456-426614174000",
                    "max_files_modified": 10,
                    "max_lines_modified": 500,
                    "max_dependencies_added": 2,
                    "max_migrations": 1,
                    "max_model_calls": 50,
                    "max_tokens": 100000,
                    "max_cost_usd": 5.0,
                    "max_execution_time_ms": 60000
                },
                {"schema": "change-budget", "expected_failure_reason": "Missing required field 'max_retries'", "invalid_field": "max_retries"}
            ),
            (
                {
                    "budget_id": "123e4567-e89b-12d3-a456-426614174000",
                    "max_files_modified": -5,
                    "max_lines_modified": 500,
                    "max_dependencies_added": 2,
                    "max_migrations": 1,
                    "max_model_calls": 50,
                    "max_tokens": 100000,
                    "max_cost_usd": 5.0,
                    "max_execution_time_ms": 60000,
                    "max_retries": 3
                },
                {"schema": "change-budget", "expected_failure_reason": "max_files_modified is less than minimum 0", "invalid_field": "max_files_modified"}
            ),
            (
                {
                    "budget_id": "123e4567-e89b-12d3-a456-426614174000",
                    "max_files_modified": 10,
                    "max_lines_modified": 500,
                    "max_dependencies_added": 2,
                    "max_migrations": 1,
                    "max_model_calls": 50,
                    "max_tokens": 100000,
                    "max_cost_usd": "5 dollars",
                    "max_execution_time_ms": 60000,
                    "max_retries": 3
                },
                {"schema": "change-budget", "expected_failure_reason": "max_cost_usd is not a number", "invalid_field": "max_cost_usd"}
            )
        ]
    }
}

for schema in schemas:
    valid_dir = os.path.join(base_dir, "valid", schema)
    invalid_dir = os.path.join(base_dir, "invalid", schema)
    
    ensure_dir(valid_dir)
    ensure_dir(invalid_dir)
    
    schema_data = fixtures.get(schema, {"valid": [], "invalid": []})
    
    # Write valid fixtures
    for idx, valid_obj in enumerate(schema_data["valid"]):
        idx_str = f"{(idx+1):02d}"
        file_path = os.path.join(valid_dir, f"valid-{idx_str}.json")
        with open(file_path, "w") as f:
            json.dump(valid_obj, f, indent=2)
            
    # Write invalid fixtures
    for idx, invalid_tuple in enumerate(schema_data["invalid"]):
        idx_str = f"{(idx+1):02d}"
        payload, meta = invalid_tuple
        payload_path = os.path.join(invalid_dir, f"invalid-{idx_str}.json")
        meta_path = os.path.join(invalid_dir, f"invalid-{idx_str}.meta.json")
        
        with open(payload_path, "w") as f:
            json.dump(payload, f, indent=2)
            
        with open(meta_path, "w") as f:
            json.dump(meta, f, indent=2)

print("Fixtures generated successfully.")
