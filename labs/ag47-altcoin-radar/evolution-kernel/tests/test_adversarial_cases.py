import os
import json
import unittest
from evolution_kernel.validators.integrity_validator import IntegrityValidator
from evolution_kernel.engines.policy_engine import PolicyEngine

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXAMPLES_DIR = os.path.join(BASE_DIR, '..', 'evolution-protocol', 'examples', 'telegram-authentication')

def load_json(path):
    if not os.path.exists(path):
        return {}
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

class TestAdversarialCases(unittest.TestCase):
    
    def test_happy_path(self):
        happy_dir = os.path.join(EXAMPLES_DIR, 'happy-path')
        
        report = load_json(os.path.join(happy_dir, '05_report.json'))
        verdict = load_json(os.path.join(happy_dir, '07_verdict.json'))
        changeset = load_json(os.path.join(happy_dir, '03_changeset.json'))
        task = load_json(os.path.join(happy_dir, '04_task.json'))
        
        validator = IntegrityValidator()
        result = validator.validate(report, verdict, changeset)
        self.assertEqual(result['status'], 'ALLOW')
        
        policy = PolicyEngine()
        p_result = policy.evaluate(task, verdict)
        self.assertEqual(p_result['status'], 'ALLOW')

    def test_case_01_self_validation(self):
        case_dir = os.path.join(EXAMPLES_DIR, 'adversarial-cases', '01-self-validation')
        report = load_json(os.path.join(case_dir, '05_report.json'))
        verdict = load_json(os.path.join(case_dir, '07_verdict.json'))
        
        validator = IntegrityValidator()
        result = validator.validate(report, verdict)
        self.assertEqual(result['status'], 'DENY')
        self.assertEqual(result['reason'], 'SELF_VALIDATION_FORBIDDEN')

    def test_case_02_out_of_scope_mutation(self):
        case_dir = os.path.join(EXAMPLES_DIR, 'adversarial-cases', '02-out-of-scope-mutation')
        report = load_json(os.path.join(case_dir, '05_report.json'))
        changeset = load_json(os.path.join(case_dir, '03_changeset.json'))
        verdict = {"validator": {"actor_id": "different-id"}}
        
        validator = IntegrityValidator()
        result = validator.validate(report, verdict, changeset)
        self.assertEqual(result['status'], 'DENY')
        self.assertEqual(result['reason'], 'OUT_OF_SCOPE_MUTATION')

    def test_case_04_production_without_human(self):
        case_dir = os.path.join(EXAMPLES_DIR, 'adversarial-cases', '04-production-without-human')
        task = load_json(os.path.join(case_dir, '04_task.json'))
        verdict = load_json(os.path.join(case_dir, '07_verdict.json'))
        
        policy = PolicyEngine()
        result = policy.evaluate(task, verdict)
        self.assertEqual(result['status'], 'DENY')
        self.assertEqual(result['reason'], 'HUMAN_APPROVAL_REQUIRED')

if __name__ == '__main__':
    unittest.main()
