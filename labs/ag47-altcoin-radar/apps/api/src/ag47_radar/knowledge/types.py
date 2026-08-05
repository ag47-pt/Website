from __future__ import annotations

from collections.abc import Callable
from typing import Literal

from pydantic import BaseModel, Field

from ag47_radar.models import TokenSignal


class ExpectedOutcome(BaseModel):
    """
    Define what should happen in the future if this pattern is true.
    Example: type="price_change", target="+5%"
    """
    type: str = Field(..., description="The metric to validate, e.g. 'price_change', 'volume_change'")
    target_value: float = Field(..., description="The target threshold, e.g. 5.0 for +5%")
    target_operator: Literal[">", "<", ">=", "<=", "=="] = ">"
    timeframe_hours: int = Field(default=24)


class Pattern(BaseModel):
    """
    Represents a recognized market pattern that correlates Signals to a Hypothesis.
    """
    id: str = Field(..., description="Unique pattern ID, e.g., 'pattern-liquidity-expansion'")
    version: str = Field(default="1.0")
    description: str = Field(..., description="Human readable description")
    
    # In a real app, this might be a declarative JSON logic tree or a Python callable.
    # For Sprint 5, we'll use a function that takes a list of signals and returns a boolean.
    conditions: Callable[[list[TokenSignal]], bool] = Field(exclude=True)
    
    hypothesis_type: str = Field(..., description="The resulting hypothesis if conditions are met")
    expected_outcome: ExpectedOutcome
    base_confidence: float = Field(default=50.0, description="Base confidence (0-100) before historical adjustment")
