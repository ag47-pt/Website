import os
import json
import jsonschema
from jsonschema import Draft202012Validator
import sys
from referencing import Registry, Resource

base_dir = r"c:\Users\moise\Desktop\Agencia47\DEV\DEVELOPING\SANDBOX\Ag47.pt\labs\ag47-altcoin-radar\.evolution"
schemas_base_dir = os.path.join(base_dir, "schemas")
fixtures_dir = os.path.join(schemas_base_dir, "fixtures")

# Subdirectories to search for schemas
schema_subdirs = ["core", "common", "evolution", "validation", "governance"]

# Load all schemas
schema_store = {}
schemas = {}

for subdir in schema_subdirs:
    dir_path = os.path.join(schemas_base_dir, subdir)
    if os.path.exists(dir_path):
        for filename in os.listdir(dir_path):
            if filename.endswith(".json") and not filename.endswith(".meta.json"):
                filepath = os.path.join(dir_path, filename)
                with open(filepath, 'r') as f:
                    schema = json.load(f)
                    if '$id' in schema:
                        schema_store[schema['$id']] = schema
                        schema_name = filename.replace('.schema.json', '')
                        schemas[schema_name] = schema

# Create a registry for resolving $refs across schemas
resources = [Resource.from_contents(s) for s in schema_store.values()]
registry = Registry().with_resources(
    (resource.id(), resource) for resource in resources if resource.id() is not None
)

results = {
    "total_schemas": len(schemas),
    "total_valid_fixtures": 0,
    "total_invalid_fixtures": 0,
    "passed": 0,
    "failed": 0,
    "details": []
}

has_failures = False

for schema_name, schema_obj in schemas.items():
    validator = Draft202012Validator(
        schema_obj, 
        registry=registry, 
        format_checker=Draft202012Validator.FORMAT_CHECKER
    )
    
    # Test valid fixtures
    valid_dir = os.path.join(fixtures_dir, "valid", schema_name)
    if os.path.exists(valid_dir):
        for filename in os.listdir(valid_dir):
            if filename.endswith(".json"):
                results["total_valid_fixtures"] += 1
                filepath = os.path.join(valid_dir, filename)
                with open(filepath, 'r') as f:
                    data = json.load(f)
                
                errors = list(validator.iter_errors(data))
                if not errors:
                    results["passed"] += 1
                else:
                    results["failed"] += 1
                    has_failures = True
                    results["details"].append({
                        "file": filepath,
                        "status": "FAILED",
                        "expected": "VALID",
                        "error": str(errors[0])
                    })

    # Test invalid fixtures
    invalid_dir = os.path.join(fixtures_dir, "invalid", schema_name)
    if os.path.exists(invalid_dir):
        for filename in os.listdir(invalid_dir):
            if filename.endswith(".json") and not filename.endswith(".meta.json"):
                results["total_invalid_fixtures"] += 1
                filepath = os.path.join(invalid_dir, filename)
                with open(filepath, 'r') as f:
                    data = json.load(f)
                
                errors = list(validator.iter_errors(data))
                if errors:
                    results["passed"] += 1
                else:
                    results["failed"] += 1
                    has_failures = True
                    results["details"].append({
                        "file": filepath,
                        "status": "FAILED",
                        "expected": "INVALID",
                        "error": "Validated successfully but was expected to fail."
                    })

report_path = os.path.join(base_dir, "schema-validation-results.json")
with open(report_path, 'w') as f:
    json.dump(results, f, indent=2)

print(f"Validation finished. Total schemas: {results['total_schemas']}")
print(f"Total valid fixtures tested: {results['total_valid_fixtures']}")
print(f"Total invalid fixtures tested: {results['total_invalid_fixtures']}")
print(f"Passed: {results['passed']}, Failed: {results['failed']}")

if has_failures:
    sys.exit(1)
else:
    sys.exit(0)
