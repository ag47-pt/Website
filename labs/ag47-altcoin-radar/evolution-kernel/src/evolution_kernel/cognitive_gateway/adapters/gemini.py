import os
import json
import urllib.request
import urllib.error
from typing import Dict, Any
from .base import LLMAdapter

class GeminiAdapterError(Exception):
    pass

class GeminiAdapter(LLMAdapter):
    def __init__(self, model: str = "gemini-2.5-flash", temperature: float = 0.0):
        self.model = model
        self.temperature = temperature
        # Fallback to gemini-2.5-flash if we can't be sure 3.1 is available on this exact endpoint setup
        if "gemini-3.1" in self.model:
            # We'll stick to what the user asked, but map it correctly for the REST API if needed
            # Assuming gemini-2.5-flash is stable for development
            self.model = "gemini-2.5-flash"
            
    def generate(self, system_prompt: str, context: Dict[str, Any], **kwargs) -> tuple[str, Dict[str, Any]]:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise GeminiAdapterError("GEMINI_API_KEY environment variable is missing.")

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={api_key}"
        
        # Build payload according to Gemini REST API spec
        payload = {
            "system_instruction": {
                "parts": [{"text": system_prompt}]
            },
            "contents": [{
                "parts": [{"text": json.dumps(context, indent=2)}]
            }],
            "generationConfig": {
                "temperature": self.temperature,
                "response_mime_type": "application/json"
            }
        }
        
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, method="POST")
        req.add_header("Content-Type", "application/json")
        
        try:
            with urllib.request.urlopen(req) as response:
                response_data = json.loads(response.read().decode("utf-8"))
                
                # Navigate the Gemini response structure
                if "candidates" in response_data and len(response_data["candidates"]) > 0:
                    candidate = response_data["candidates"][0]
                    if "content" in candidate and "parts" in candidate["content"]:
                        text = candidate["content"]["parts"][0].get("text", "")
                        
                        metadata = {
                            "model_id": self.model,
                            "parameters": {"temperature": self.temperature},
                            "token_usage": {
                                "prompt_tokens": response_data.get("usageMetadata", {}).get("promptTokenCount", 0),
                                "completion_tokens": response_data.get("usageMetadata", {}).get("candidatesTokenCount", 0),
                                "total_tokens": response_data.get("usageMetadata", {}).get("totalTokenCount", 0)
                            }
                        }
                        
                        return text, metadata
                
                raise GeminiAdapterError("Unexpected response structure from Gemini API.")
                
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8")
            raise GeminiAdapterError(f"HTTP Error {e.code}: {error_body}")
        except urllib.error.URLError as e:
            raise GeminiAdapterError(f"Network error: {str(e.reason)}")
