import os
import json
import jsonschema

class ArtifactRegistry:
    def __init__(self, schemas_dir: str):
        self.schemas_dir = schemas_dir
        self.schemas = {}
        self._load_schemas()
        
    def _load_schemas(self):
        if not os.path.exists(self.schemas_dir):
            return
            
        for root, _, files in os.walk(self.schemas_dir):
            for file in files:
                if file.endswith('.schema.json'):
                    path = os.path.join(root, file)
                    try:
                        with open(path, 'r', encoding='utf-8') as f:
                            schema = json.load(f)
                            if '$id' in schema:
                                self.schemas[schema['$id']] = schema
                    except Exception:
                        pass
                        
    def validate_artifact(self, artifact_data: dict, expected_schema_id: str = None) -> bool:
        if not expected_schema_id:
            # We can't validate without knowing what it's supposed to be,
            # but for now, let's just return True if no schema is forced
            # and it doesn't match an internal ID logic yet.
            pass
            
        if expected_schema_id not in self.schemas:
            raise ValueError(f"Schema {expected_schema_id} not found in registry.")
            
        schema = self.schemas[expected_schema_id]
        
        try:
            # Note: We should ideally set up a registry for $ref resolution
            jsonschema.validate(instance=artifact_data, schema=schema)
            return True
        except jsonschema.exceptions.ValidationError as e:
            return False

    def load_artifact(self, filepath: str) -> dict:
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Artifact not found: {filepath}")
            
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
