from typing import Any

from ag47_radar.models import TokenSignal

from .types import ExpectedOutcome, Pattern


class PatternRegistry:
    """
    Manages all knowledge patterns. Eliminates the need for 4000 lines of if/else logic
    in the inference engine.
    """

    def __init__(self) -> None:
        self._patterns: dict[str, Pattern] = {}

    def register(self, pattern: Pattern) -> None:
        self._patterns[pattern.id] = pattern

    def disable(self, pattern_id: str) -> None:
        if pattern_id in self._patterns:
            del self._patterns[pattern_id]

    def get_all_patterns(self) -> list[Pattern]:
        return list(self._patterns.values())

    def infer_all(self, signals: list[TokenSignal]) -> list[dict[str, Any]]:
        """
        Runs all active patterns against a list of signals and returns matched Hypotheses data.
        """
        hypotheses = []
        for pattern in self._patterns.values():
            if pattern.conditions(signals):
                # Encontrou as evidências que causam esta hipótese
                caused_by = [
                    {
                        "kind": "signal",
                        "id": s.id,
                        "type": s.signal_type,
                        "timestamp": s.created_at.isoformat(),
                    }
                    for s in signals
                ]

                hypotheses.append(
                    {
                        "hypothesis_type": pattern.hypothesis_type,
                        "confidence": pattern.base_confidence,  # Será ajustado pelo histórico
                        "metadata_json": {
                            "pattern_id": pattern.id,
                            "pattern_version": pattern.version,
                            "expected_outcome": pattern.expected_outcome.model_dump(),
                        },
                        "caused_by": caused_by,
                        "rule_version": f"hypotheses-{pattern.version}",
                    }
                )
        return hypotheses


# Instância Global do Registry
registry = PatternRegistry()

# -------------------------------------------------------------------------
# Registrando os primeiros padrões baseados na arquitetura nova
# -------------------------------------------------------------------------


def check_liquidity_expansion(signals: list[TokenSignal]) -> bool:
    return any(s.signal_type == "liquidity_volume_expansion" for s in signals)


registry.register(
    Pattern(
        id="pattern-liquidity-expansion",
        version="1.0",
        description="Pico de liquidez isolado que indica possível acumulação.",
        conditions=check_liquidity_expansion,
        hypothesis_type="accumulation_suspected",
        expected_outcome=ExpectedOutcome(
            type="price_change",
            target_value=5.0,  # Esperamos +5%
            target_operator=">",
            timeframe_hours=24,
        ),
        base_confidence=65.0,
    )
)
