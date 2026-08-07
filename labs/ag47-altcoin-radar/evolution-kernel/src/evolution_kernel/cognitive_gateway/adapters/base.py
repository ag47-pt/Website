from abc import ABC, abstractmethod
from typing import Dict, Any

class LLMAdapter(ABC):
    """
    Abstract base class for all LLM adapters used in the Cognitive Gateway.
    The adapter is responsible for formatting the prompt, sending the request to the LLM,
    and returning the raw response object (typically JSON formatted text).
    """

    @abstractmethod
    def generate(self, system_prompt: str, context: Dict[str, Any], **kwargs) -> tuple[str, Dict[str, Any]]:
        """
        Generates a response from the LLM.
        
        Args:
            system_prompt: The strict instructions for the LLM.
            context: A dictionary representing the inputs (e.g., snapshot, target).
            
        Returns:
            A tuple containing:
              - A string with the LLM's response, ideally parseable JSON.
              - A dictionary with metadata (model_id, parameters, token_usage).
        """
        pass
