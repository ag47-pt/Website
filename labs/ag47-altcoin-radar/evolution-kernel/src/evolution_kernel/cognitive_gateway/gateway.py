import json
import hashlib
from datetime import datetime, timezone
from jsonschema import validate, ValidationError
from typing import Dict, Any, List
from .adapters.base import LLMAdapter

class GatewayError(Exception):
    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message
        super().__init__(f"DENY\n\n{code}")

class CognitiveGateway:
    def __init__(self, adapter: LLMAdapter, candidate_schema: Dict[str, Any], system_prompt: str, prompt_version: str, agent_role: str = "analyst"):
        self.adapter = adapter
        self.candidate_schema = candidate_schema
        self.system_prompt = system_prompt
        self.prompt_version = prompt_version
        self.agent_role = agent_role

    def execute_task(self, request: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes a cognitive task by orchestrating the LLM and validating its raw output.
        """
        # 1. Ask LLM to generate candidate analysis
        raw_response, metadata = self.adapter.generate(self.system_prompt, context)
        
        # Calculate hashes
        input_hash = hashlib.sha256(json.dumps(context, sort_keys=True).encode()).hexdigest()
        output_hash = hashlib.sha256(raw_response.encode()).hexdigest()

        # 2. Parse response
        try:
            candidate = json.loads(raw_response)
        except json.JSONDecodeError:
            raise GatewayError("INVALID_JSON", "The LLM did not return valid JSON.")

        # 3. Explicit Boundary Checks before full schema validation 
        if self.agent_role == "analyst":
            if "candidate_gaps" in candidate:
                for gap in candidate["candidate_gaps"]:
                    if "solution" in gap:
                        raise GatewayError("ROLE_BOUNDARY_VIOLATION", "The LLM attempted to propose a solution.")
                    if "evidence_refs" not in gap or not gap["evidence_refs"]:
                        raise GatewayError("MISSING_EVIDENCE_REFERENCE", "A candidate gap was proposed without evidence.")
        
        elif self.agent_role == "planner":
            if "proposed_changeset" in candidate:
                cs = candidate["proposed_changeset"]
                if "source_gap_refs" not in cs or not cs["source_gap_refs"]:
                    raise GatewayError("MISSING_EVIDENCE_REFERENCE", "Planner did not link changeset to source gaps.")
                
                if "changes" in cs:
                    for change in cs["changes"]:
                        if change.get("type") not in ["create", "modify", "delete", "add_dependency"]:
                            raise GatewayError("ROLE_BOUNDARY_VIOLATION", f"Planner attempted unauthorized execution: {change.get('type')}")
                            
                # Check for excessive scope / budget (simplified check)
                if "change_budget" in cs:
                    files_mod = cs["change_budget"].get("files_modified", 0)
                    if files_mod > 10:  # arbitrary static limit for now if context doesn't provide it
                        raise GatewayError("CHANGE_SCOPE_TOO_LARGE", f"Planner exceeded maximum allowed file modifications: {files_mod}")

        # 4. Schema Validation
        try:
            validate(instance=candidate, schema=self.candidate_schema)
        except ValidationError as e:
            raise GatewayError("SCHEMA_VIOLATION", f"Candidate output violates schema: {e.message}")

        # 5. Transform to Official Artifact
        official_artifact = None
        if self.agent_role == "analyst":
            official_gaps = []
            for gap in candidate["candidate_gaps"]:
                official_gaps.append({
                    "id": gap.get("id", "gap-unknown"),
                    "category": gap["category"],
                    "current_state": gap["current_state"],
                    "target_state": gap["target_state"],
                    "severity": gap["severity"],
                    "confidence": gap["confidence"],
                    "evidence_refs": gap["evidence_refs"]
                })
            official_artifact = {"gaps": official_gaps}
        elif self.agent_role == "planner":
            official_artifact = candidate["proposed_changeset"]
        
        # 6. Build Model Interaction Record
        interaction_record = {
            "$schema": "../../schemas/common/model-interaction-record.schema.json",
            "agent_role": self.agent_role,
            "agent_version": f"{self.agent_role}-v1",
            "model_id": metadata["model_id"],
            "prompt_version": self.prompt_version,
            "input_hash": input_hash,
            "output_hash": output_hash,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "parameters": metadata["parameters"],
            "token_usage": metadata["token_usage"]
        }
        return {
            "artifact": official_artifact,
            "interaction_record": interaction_record
        }
