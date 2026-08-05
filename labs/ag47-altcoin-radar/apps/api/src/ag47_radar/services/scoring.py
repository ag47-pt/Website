from __future__ import annotations

from collections.abc import Mapping

from ag47_radar.enums import OpportunityClassification
from ag47_radar.schemas import ScoreCalculationResult, ScoreComponentsInput

SCORING_VERSION = "v1.0.0"
WEIGHTS: dict[str, float] = {
    "momentum_score": 0.25,
    "liquidity_score": 0.20,
    "community_score": 0.15,
    "distribution_score": 0.15,
    "safety_score": 0.20,
    "data_quality_score": 0.05,
}
LABELS = {
    "momentum_score": "Momentum",
    "liquidity_score": "Liquidez",
    "community_score": "Comunidade",
    "distribution_score": "Distribuição",
    "safety_score": "Segurança",
    "data_quality_score": "Qualidade dos dados",
}


def safety_from_risk(risk_score: float | None) -> float | None:
    """Convert elevated-risk direction to elevated-safety direction without guessing."""

    if risk_score is None:
        return None
    return round(10 - min(10.0, max(0.0, risk_score)), 2)


def classify_score(final_score: float) -> OpportunityClassification:
    if final_score >= 8.0:
        return OpportunityClassification.STRONG
    if final_score >= 6.5:
        return OpportunityClassification.WATCH
    if final_score >= 5.0:
        return OpportunityClassification.SPECULATIVE
    return OpportunityClassification.HIGH_RISK


def calculate_score(
    components: ScoreComponentsInput | Mapping[str, float | None],
    *,
    critical_flags: list[str] | None = None,
) -> ScoreCalculationResult:
    """Calculate deterministic v1 score.

    Missing inputs contribute zero, remain explicit negative factors and lower confidence. The
    numeric score is retained for auditability even when a critical flag gates classification.
    """

    raw = (
        components.model_dump()
        if isinstance(components, ScoreComponentsInput)
        else dict(components)
    )
    available = {name: raw.get(name) for name in WEIGHTS if raw.get(name) is not None}
    normalized = {
        name: round(min(10.0, max(0.0, float(raw.get(name) or 0.0))), 2) for name in WEIGHTS
    }
    final_score = round(sum(normalized[name] * weight for name, weight in WEIGHTS.items()), 2)
    classification = classify_score(final_score)
    critical = sorted(set(critical_flags or []))
    critical_gate_applied = bool(critical)
    if critical_gate_applied:
        classification = OpportunityClassification.HIGH_RISK

    signals_available = len(available)
    completeness = signals_available / len(WEIGHTS)
    quality = float(available.get("data_quality_score") or 0.0) / 10
    confidence = round(completeness * (0.5 + 0.5 * quality), 4)

    positives = [
        f"{LABELS[name]}: {value:.1f}/10"
        for name, value in normalized.items()
        if name in available and value >= 7
    ]
    negatives = [f"{LABELS[name]}: aguardando dados" for name in WEIGHTS if name not in available]
    negatives.extend(
        f"{LABELS[name]}: {value:.1f}/10"
        for name, value in normalized.items()
        if name in available and value <= 4
    )
    if critical:
        negatives.append("Gate crítico: " + ", ".join(critical))

    if critical_gate_applied:
        explanation = (
            f"Score numérico {final_score:.2f}/10, mas a classificação foi bloqueada por "
            f"{len(critical)} sinal(is) crítico(s)."
        )
    elif signals_available < len(WEIGHTS):
        explanation = (
            f"Score {final_score:.2f}/10 com {signals_available}/{len(WEIGHTS)} componentes; "
            "dados ausentes contam como zero e reduzem a confiança."
        )
    else:
        explanation = (
            f"Score {final_score:.2f}/10 calculado pelos seis componentes ponderados da versão 1."
        )

    return ScoreCalculationResult(
        **normalized,
        final_score=final_score,
        classification=classification,
        confidence=confidence,
        signals_available=signals_available,
        explanation=explanation,
        positive_factors=positives,
        negative_factors=negatives,
        critical_gate_applied=critical_gate_applied,
        scoring_version=SCORING_VERSION,
    )
