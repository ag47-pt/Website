import json
import os

base_dir = r"c:\Users\moise\Desktop\Agencia47\DEV\DEVELOPING\SANDBOX\Ag47.pt\labs\ag47-altcoin-radar\.evolution\schemas\fixtures"

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

schemas = [
    "artifact-reference",
    "evidence-item",
    "evolution-hypothesis",
    "proposed-changeset",
    "execution-report",
    "evidence-bundle",
    "integrity-verdict",
    "approval-record"
]

fixtures = {
    "artifact-reference": {
        "valid": [
            {"ref_id": "ref-1", "hash": "abc123hash"},
            {"ref_id": "ref-2", "uri": "file://test", "hash": "def456hash"}
        ],
        "invalid": [
            (
                {"ref_id": "ref-1"}, 
                {"schema": "artifact-reference", "expected_failure_reason": "Missing hash"}
            ),
            (
                {"hash": "abc123hash"}, 
                {"schema": "artifact-reference", "expected_failure_reason": "Missing ref_id"}
            ),
            (
                {"ref_id": "ref-1", "hash": "abc123hash", "extra": "invalid"}, 
                {"schema": "artifact-reference", "expected_failure_reason": "Additional properties not allowed"}
            )
        ]
    },
    "evidence-item": {
        "valid": [
            {
                "evidence_id": "123e4567-e89b-12d3-a456-426614174001",
                "type": "UNIT_TEST",
                "source": "jest",
                "hash": "hash1",
                "timestamp": "2026-08-06T22:00:00Z",
                "result": "PASSED"
            },
            {
                "evidence_id": "123e4567-e89b-12d3-a456-426614174002",
                "type": "LINT",
                "source": "eslint",
                "artifact_ref": {"ref_id": "ref-1", "hash": "h1"},
                "hash": "hash2",
                "timestamp": "2026-08-06T22:00:00Z",
                "related_acceptance_criteria": ["crit-1"],
                "result": "0 errors",
                "confidence": 1.0,
                "validity_status": "VALID"
            }
        ],
        "invalid": [
            (
                {
                    "evidence_id": "123e4567-e89b-12d3-a456-426614174001",
                    "type": "UNKNOWN_TEST",
                    "source": "jest",
                    "hash": "hash1",
                    "timestamp": "2026-08-06T22:00:00Z",
                    "result": "PASSED"
                },
                {"schema": "evidence-item", "expected_failure_reason": "Invalid enum type"}
            ),
            (
                {
                    "evidence_id": "invalid-uuid",
                    "type": "UNIT_TEST",
                    "source": "jest",
                    "hash": "hash1",
                    "timestamp": "2026-08-06T22:00:00Z",
                    "result": "PASSED"
                },
                {"schema": "evidence-item", "expected_failure_reason": "Invalid UUID format"}
            ),
            (
                {
                    "evidence_id": "123e4567-e89b-12d3-a456-426614174001",
                    "type": "UNIT_TEST",
                    "source": "jest",
                    "hash": "hash1",
                    "timestamp": "invalid-date",
                    "result": "PASSED"
                },
                {"schema": "evidence-item", "expected_failure_reason": "Invalid date-time"}
            )
        ]
    },
    "evolution-hypothesis": {
        "valid": [
            {
                "hypothesis_id": "123e4567-e89b-12d3-a456-426614174001",
                "protocol_version": "1.0",
                "system_snapshot_ref": {"ref_id": "snap-1", "hash": "h1"},
                "problem_statement": "Slow DB",
                "proposed_outcome": "Fast DB",
                "success_metrics": ["query time < 10ms"],
                "falsification_criteria": ["query time > 20ms"],
                "status": "DRAFT"
            },
            {
                "hypothesis_id": "123e4567-e89b-12d3-a456-426614174002",
                "protocol_version": "1.0",
                "system_snapshot_ref": {"ref_id": "snap-2", "hash": "h2"},
                "problem_statement": "Bug X",
                "observed_gap": "Gap Y",
                "proposed_outcome": "Fixed Bug X",
                "expected_benefits": ["Happy users"],
                "assumptions": ["User is on chrome"],
                "risks": ["Might break safari"],
                "confidence": 0.75,
                "success_metrics": ["0 errors"],
                "falsification_criteria": [">0 errors"],
                "stop_conditions": ["too many errors"],
                "proposed_by": "agent-1",
                "created_at": "2026-08-06T22:00:00Z",
                "status": "APPROVED"
            }
        ],
        "invalid": [
            (
                {
                    "hypothesis_id": "123e4567-e89b-12d3-a456-426614174001",
                    "protocol_version": "1.0",
                    "system_snapshot_ref": {"ref_id": "snap-1", "hash": "h1"},
                    "problem_statement": "Slow DB",
                    "proposed_outcome": "Fast DB",
                    "success_metrics": ["query time < 10ms"],
                    "falsification_criteria": [],
                    "status": "DRAFT"
                },
                {"schema": "evolution-hypothesis", "expected_failure_reason": "falsification_criteria must have minItems 1"}
            ),
            (
                {
                    "hypothesis_id": "123e4567-e89b-12d3-a456-426614174001",
                    "protocol_version": "1.0",
                    "system_snapshot_ref": {"ref_id": "snap-1", "hash": "h1"},
                    "problem_statement": "Slow DB",
                    "proposed_outcome": "Fast DB",
                    "success_metrics": ["query time < 10ms"],
                    "status": "DRAFT"
                },
                {"schema": "evolution-hypothesis", "expected_failure_reason": "Missing required field falsification_criteria"}
            ),
            (
                {
                    "hypothesis_id": "123e4567-e89b-12d3-a456-426614174001",
                    "protocol_version": "1.0",
                    "system_snapshot_ref": {"ref_id": "snap-1", "hash": "h1"},
                    "problem_statement": "Slow DB",
                    "proposed_outcome": "Fast DB",
                    "success_metrics": ["query time < 10ms"],
                    "falsification_criteria": ["query time > 20ms"],
                    "status": "INVALID_STATUS"
                },
                {"schema": "evolution-hypothesis", "expected_failure_reason": "Invalid enum for status"}
            )
        ]
    },
    "proposed-changeset": {
        "valid": [
            {
                "changeset_id": "123e4567-e89b-12d3-a456-426614174001",
                "hypothesis_ref": {"ref_id": "hyp-1", "hash": "h1"},
                "allowed_paths": ["src/"],
                "prohibited_paths": ["secrets/"],
                "acceptance_criteria": ["All tests pass"],
                "rollback_plan": "git reset",
                "change_budget_ref": {"ref_id": "bud-1", "hash": "h2"},
                "status": "PROPOSED"
            },
            {
                "changeset_id": "123e4567-e89b-12d3-a456-426614174002",
                "hypothesis_ref": {"ref_id": "hyp-2", "hash": "h1"},
                "current_architecture_ref": {"ref_id": "arch-1", "hash": "h2"},
                "target_architecture_ref": {"ref_id": "arch-2", "hash": "h3"},
                "affected_modules": ["auth"],
                "allowed_paths": ["src/auth/"],
                "prohibited_paths": ["src/core/"],
                "planned_operations": ["Add file"],
                "acceptance_criteria": ["All tests pass"],
                "test_plan": "run tests",
                "rollback_plan": "git reset",
                "change_budget_ref": {"ref_id": "bud-2", "hash": "h4"},
                "expected_human_actions": ["approve PR"],
                "architecture_impact": "None",
                "dependencies": ["new_lib"],
                "migrations": ["1_init"],
                "risk_level": "LOW",
                "approvals": ["app-1"],
                "status": "APPROVED"
            }
        ],
        "invalid": [
            (
                {
                    "changeset_id": "123e4567-e89b-12d3-a456-426614174001",
                    "hypothesis_ref": {"ref_id": "hyp-1", "hash": "h1"},
                    "prohibited_paths": ["secrets/"],
                    "acceptance_criteria": ["All tests pass"],
                    "rollback_plan": "git reset",
                    "change_budget_ref": {"ref_id": "bud-1", "hash": "h2"},
                    "status": "PROPOSED"
                },
                {"schema": "proposed-changeset", "expected_failure_reason": "Missing allowed_paths"}
            ),
            (
                {
                    "changeset_id": "invalid-uuid",
                    "hypothesis_ref": {"ref_id": "hyp-1", "hash": "h1"},
                    "allowed_paths": ["src/"],
                    "prohibited_paths": ["secrets/"],
                    "acceptance_criteria": ["All tests pass"],
                    "rollback_plan": "git reset",
                    "change_budget_ref": {"ref_id": "bud-1", "hash": "h2"},
                    "status": "PROPOSED"
                },
                {"schema": "proposed-changeset", "expected_failure_reason": "Invalid UUID for changeset_id"}
            ),
            (
                {
                    "changeset_id": "123e4567-e89b-12d3-a456-426614174001",
                    "hypothesis_ref": {"ref_id": "hyp-1", "hash": "h1"},
                    "allowed_paths": ["src/"],
                    "prohibited_paths": ["secrets/"],
                    "acceptance_criteria": ["All tests pass"],
                    "rollback_plan": "git reset",
                    "change_budget_ref": {"ref_id": "bud-1", "hash": "h2"},
                    "risk_level": "SUPER_HIGH",
                    "status": "PROPOSED"
                },
                {"schema": "proposed-changeset", "expected_failure_reason": "Invalid enum for risk_level"}
            )
        ]
    },
    "execution-report": {
        "valid": [
            {
                "execution_id": "123e4567-e89b-12d3-a456-426614174001",
                "active_task_ref": {"ref_id": "t-1", "hash": "h1"},
                "changeset_ref": {"ref_id": "cs-1", "hash": "h2"},
                "executor_signature": {"ref_id": "sig-1", "hash": "h3"},
                "started_at": "2026-08-06T22:00:00Z",
                "budget_consumption": {"tokens": 100},
                "execution_status": "RUNNING"
            },
            {
                "execution_id": "123e4567-e89b-12d3-a456-426614174002",
                "active_task_ref": {"ref_id": "t-2", "hash": "h1"},
                "changeset_ref": {"ref_id": "cs-2", "hash": "h2"},
                "executor_signature": {"ref_id": "sig-2", "hash": "h3"},
                "started_at": "2026-08-06T22:00:00Z",
                "completed_at": "2026-08-06T23:00:00Z",
                "commands_executed": ["npm i"],
                "files_created": ["f1.js"],
                "files_modified": ["f2.js"],
                "files_deleted": ["f3.js"],
                "dependencies_added": ["pkg"],
                "migrations_applied": ["m1"],
                "tests_executed": ["t1"],
                "errors": ["err1"],
                "retries": 1,
                "human_actions_proposed": ["review"],
                "budget_consumption": {"tokens": 200},
                "deviations": ["dev1"],
                "produced_artifacts": [{"ref_id": "a-1", "hash": "h4"}],
                "execution_status": "COMPLETED"
            }
        ],
        "invalid": [
            (
                {
                    "execution_id": "123e4567-e89b-12d3-a456-426614174001",
                    "active_task_ref": {"ref_id": "t-1", "hash": "h1"},
                    "changeset_ref": {"ref_id": "cs-1", "hash": "h2"},
                    "executor_signature": {"ref_id": "sig-1", "hash": "h3"},
                    "started_at": "2026-08-06T22:00:00Z",
                    "execution_status": "RUNNING"
                },
                {"schema": "execution-report", "expected_failure_reason": "Missing budget_consumption"}
            ),
            (
                {
                    "execution_id": "123e4567-e89b-12d3-a456-426614174001",
                    "active_task_ref": {"ref_id": "t-1", "hash": "h1"},
                    "changeset_ref": {"ref_id": "cs-1", "hash": "h2"},
                    "executor_signature": {"ref_id": "sig-1", "hash": "h3"},
                    "started_at": "2026-08-06T22:00:00Z",
                    "budget_consumption": {"tokens": 100},
                    "retries": -1,
                    "execution_status": "RUNNING"
                },
                {"schema": "execution-report", "expected_failure_reason": "retries < 0"}
            ),
            (
                {
                    "execution_id": "123e4567-e89b-12d3-a456-426614174001",
                    "active_task_ref": {"ref_id": "t-1", "hash": "h1"},
                    "changeset_ref": {"ref_id": "cs-1", "hash": "h2"},
                    "executor_signature": {"ref_id": "sig-1", "hash": "h3"},
                    "started_at": "2026-08-06T22:00:00Z",
                    "budget_consumption": {"tokens": 100},
                    "execution_status": "DONE"
                },
                {"schema": "execution-report", "expected_failure_reason": "Invalid execution_status"}
            )
        ]
    },
    "evidence-bundle": {
        "valid": [
            {
                "bundle_id": "123e4567-e89b-12d3-a456-426614174001",
                "subject_refs": [{"ref_id": "s-1", "hash": "h1"}],
                "generated_at": "2026-08-06T22:00:00Z",
                "generated_by": "agent-1",
                "evidence_items": [
                    {
                        "evidence_id": "223e4567-e89b-12d3-a456-426614174001",
                        "type": "UNIT_TEST",
                        "source": "jest",
                        "hash": "h2",
                        "timestamp": "2026-08-06T22:00:00Z",
                        "result": "PASS"
                    }
                ],
                "integrity": "verified",
                "completeness": 1.0
            },
            {
                "bundle_id": "123e4567-e89b-12d3-a456-426614174002",
                "subject_refs": [{"ref_id": "s-1", "hash": "h1"}],
                "generated_at": "2026-08-06T22:00:00Z",
                "generated_by": "agent-2",
                "evidence_items": [],
                "integrity": "failed",
                "completeness": 0.5,
                "expiration": "2026-08-07T22:00:00Z",
                "confidence": 0.5
            }
        ],
        "invalid": [
            (
                {
                    "bundle_id": "123e4567-e89b-12d3-a456-426614174001",
                    "generated_at": "2026-08-06T22:00:00Z",
                    "generated_by": "agent-1",
                    "evidence_items": [],
                    "integrity": "verified",
                    "completeness": 1.0
                },
                {"schema": "evidence-bundle", "expected_failure_reason": "Missing subject_refs"}
            ),
            (
                {
                    "bundle_id": "123e4567-e89b-12d3-a456-426614174001",
                    "subject_refs": [{"ref_id": "s-1", "hash": "h1"}],
                    "generated_at": "2026-08-06T22:00:00Z",
                    "generated_by": "agent-1",
                    "evidence_items": [
                        {
                            "evidence_id": "223e4567-e89b-12d3-a456-426614174001",
                            "type": "UNIT_TEST",
                            "source": "jest"
                        }
                    ],
                    "integrity": "verified",
                    "completeness": 1.0
                },
                {"schema": "evidence-bundle", "expected_failure_reason": "evidence_item missing required fields"}
            ),
            (
                {
                    "bundle_id": "123e4567-e89b-12d3-a456-426614174001",
                    "subject_refs": [{"ref_id": "s-1", "hash": "h1"}],
                    "generated_at": "2026-08-06T22:00:00Z",
                    "generated_by": "agent-1",
                    "evidence_items": [],
                    "integrity": "verified",
                    "completeness": 2.0
                },
                {"schema": "evidence-bundle", "expected_failure_reason": "completeness > 1.0"}
            )
        ]
    },
    "integrity-verdict": {
        "valid": [
            {
                "verdict_id": "123e4567-e89b-12d3-a456-426614174001",
                "execution_report_ref": {"ref_id": "er-1", "hash": "h1"},
                "evidence_bundle_refs": [{"ref_id": "eb-1", "hash": "h2"}],
                "validator_signature": {"ref_id": "vs-1", "hash": "h3"},
                "evaluated_criteria": ["c1"],
                "result": "PASS",
                "issued_at": "2026-08-06T22:00:00Z"
            },
            {
                "verdict_id": "123e4567-e89b-12d3-a456-426614174002",
                "execution_report_ref": {"ref_id": "er-1", "hash": "h1"},
                "evidence_bundle_refs": [],
                "validator_signature": {"ref_id": "vs-1", "hash": "h3"},
                "evaluated_criteria": ["c1"],
                "passed_criteria": ["c1"],
                "failed_criteria": ["c2"],
                "missing_evidence": ["c2_evidence"],
                "policy_violations": ["pv1"],
                "architecture_findings": ["af1"],
                "human_actions": ["ha1"],
                "result": "FAIL",
                "confidence": 0.75,
                "allowed_next_transitions": ["RETRY"],
                "issued_at": "2026-08-06T22:00:00Z"
            }
        ],
        "invalid": [
            (
                {
                    "verdict_id": "123e4567-e89b-12d3-a456-426614174001",
                    "execution_report_ref": {"ref_id": "er-1", "hash": "h1"},
                    "evidence_bundle_refs": [{"ref_id": "eb-1", "hash": "h2"}],
                    "validator_signature": {"ref_id": "vs-1", "hash": "h3"},
                    "evaluated_criteria": ["c1"],
                    "issued_at": "2026-08-06T22:00:00Z"
                },
                {"schema": "integrity-verdict", "expected_failure_reason": "Missing result"}
            ),
            (
                {
                    "verdict_id": "123e4567-e89b-12d3-a456-426614174001",
                    "execution_report_ref": {"ref_id": "er-1", "hash": "h1"},
                    "evidence_bundle_refs": [{"ref_id": "eb-1", "hash": "h2"}],
                    "validator_signature": {"ref_id": "vs-1", "hash": "h3"},
                    "evaluated_criteria": ["c1"],
                    "result": "UNKNOWN_RESULT",
                    "issued_at": "2026-08-06T22:00:00Z"
                },
                {"schema": "integrity-verdict", "expected_failure_reason": "Invalid enum for result"}
            ),
            (
                {
                    "verdict_id": "123e4567-e89b-12d3-a456-426614174001",
                    "execution_report_ref": {"ref_id": "er-1", "hash": "h1"},
                    "evidence_bundle_refs": [{"ref_id": "eb-1", "hash": "h2"}],
                    "validator_signature": {"ref_id": "vs-1", "hash": "h3"},
                    "evaluated_criteria": ["c1"],
                    "result": "PASS",
                    "issued_at": "2026-08-06T22:00:00Z",
                    "extra": 1
                },
                {"schema": "integrity-verdict", "expected_failure_reason": "Additional properties not allowed"}
            )
        ]
    },
    "approval-record": {
        "valid": [
            {
                "approval_id": "123e4567-e89b-12d3-a456-426614174001",
                "subject_ref": {"ref_id": "s-1", "hash": "h1"},
                "approval_type": "PLAN_APPROVAL",
                "decision": "APPROVED",
                "actor_signature": {"ref_id": "as-1", "hash": "h2"},
                "issued_at": "2026-08-06T22:00:00Z",
                "status": "ACTIVE"
            },
            {
                "approval_id": "123e4567-e89b-12d3-a456-426614174002",
                "subject_ref": {"ref_id": "s-1", "hash": "h1"},
                "approval_type": "MERGE_APPROVAL",
                "decision": "APPROVED_WITH_CONDITIONS",
                "actor_signature": {"ref_id": "as-1", "hash": "h2"},
                "conditions": ["c1"],
                "comments": "good",
                "issued_at": "2026-08-06T22:00:00Z",
                "expires_at": "2026-08-07T22:00:00Z",
                "revoked_at": "2026-08-08T22:00:00Z",
                "supersedes": {"ref_id": "ar-0", "hash": "h0"},
                "status": "SUPERSEDED"
            }
        ],
        "invalid": [
            (
                {
                    "approval_id": "123e4567-e89b-12d3-a456-426614174001",
                    "subject_ref": {"ref_id": "s-1", "hash": "h1"},
                    "decision": "APPROVED",
                    "actor_signature": {"ref_id": "as-1", "hash": "h2"},
                    "issued_at": "2026-08-06T22:00:00Z",
                    "status": "ACTIVE"
                },
                {"schema": "approval-record", "expected_failure_reason": "Missing approval_type"}
            ),
            (
                {
                    "approval_id": "123e4567-e89b-12d3-a456-426614174001",
                    "subject_ref": {"ref_id": "s-1", "hash": "h1"},
                    "approval_type": "PLAN_APPROVAL",
                    "decision": "MAYBE",
                    "actor_signature": {"ref_id": "as-1", "hash": "h2"},
                    "issued_at": "2026-08-06T22:00:00Z",
                    "status": "ACTIVE"
                },
                {"schema": "approval-record", "expected_failure_reason": "Invalid enum for decision"}
            ),
            (
                {
                    "approval_id": "123e4567-e89b-12d3-a456-426614174001",
                    "subject_ref": {"ref_id": "s-1", "hash": "h1"},
                    "approval_type": "PLAN_APPROVAL",
                    "decision": "APPROVED",
                    "actor_signature": {"ref_id": "as-1"},
                    "issued_at": "2026-08-06T22:00:00Z",
                    "status": "ACTIVE"
                },
                {"schema": "approval-record", "expected_failure_reason": "Missing hash in actor_signature"}
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

print("Lote 2 fixtures generated successfully.")
