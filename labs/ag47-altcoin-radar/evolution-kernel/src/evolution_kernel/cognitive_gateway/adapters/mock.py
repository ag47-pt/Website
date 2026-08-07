import json
from typing import Dict, Any
from .base import LLMAdapter

class MockLLMAdapter(LLMAdapter):
    """
    A mock adapter used exclusively for the Gateway Verification Harness.
    It returns a pre-configured response string when `generate` is called,
    simulating various LLM outputs (valid, hallucinated, boundary violations).
    """

    def __init__(self, mock_response: str):
        self.mock_response = mock_response

    def generate(self, system_prompt: str, context: Dict[str, Any], **kwargs) -> tuple[str, Dict[str, Any]]:
        # In a real scenario, this would contact an API. 
        # Here we just return the deterministic mock string.
        metadata = {
            "model_id": "mock-llm-1.0",
            "parameters": {"temperature": 0.0},
            "token_usage": {"prompt_tokens": 100, "completion_tokens": 50, "total_tokens": 150}
        }
        return self.mock_response, metadata
