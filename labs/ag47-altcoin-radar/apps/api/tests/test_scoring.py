from ag47_radar.enums import OpportunityClassification
from ag47_radar.schemas import ScoreComponentsInput
from ag47_radar.services.scoring import WEIGHTS, calculate_score, classify_score, safety_from_risk


def test_classify_score_strong():
    assert classify_score(8.5) == OpportunityClassification.STRONG
    assert classify_score(8.0) == OpportunityClassification.STRONG


def test_classify_score_watch():
    assert classify_score(7.9) == OpportunityClassification.WATCH
    assert classify_score(6.5) == OpportunityClassification.WATCH


def test_classify_score_speculative():
    assert classify_score(6.4) == OpportunityClassification.SPECULATIVE
    assert classify_score(5.0) == OpportunityClassification.SPECULATIVE


def test_classify_score_high_risk():
    assert classify_score(4.9) == OpportunityClassification.HIGH_RISK
    assert classify_score(0.0) == OpportunityClassification.HIGH_RISK


def test_safety_from_risk_inversion():
    assert safety_from_risk(10) == 0.0
    assert safety_from_risk(0) == 10.0
    assert safety_from_risk(5) == 5.0


def test_safety_from_risk_none():
    assert safety_from_risk(None) is None


def test_safety_from_risk_clamp():
    assert safety_from_risk(15) == 0.0
    assert safety_from_risk(-5) == 10.0


def test_perfect_score():
    components = ScoreComponentsInput(
        momentum_score=10.0,
        liquidity_score=10.0,
        community_score=10.0,
        distribution_score=10.0,
        safety_score=10.0,
        data_quality_score=10.0,
    )
    score = calculate_score(components)
    assert score.final_score == 10.0


def test_all_zeros():
    components = ScoreComponentsInput(
        momentum_score=0.0,
        liquidity_score=0.0,
        community_score=0.0,
        distribution_score=0.0,
        safety_score=0.0,
        data_quality_score=0.0,
    )
    score = calculate_score(components)
    assert score.final_score == 0.0


def test_missing_components_reduce_confidence():
    components = ScoreComponentsInput(
        momentum_score=10.0,
        liquidity_score=10.0,
        community_score=10.0,
        distribution_score=10.0,
        safety_score=10.0,
        data_quality_score=None,
    )
    score = calculate_score(components)
    assert score.confidence < 0.9


def test_critical_flag_forces_high_risk():
    components = ScoreComponentsInput(
        momentum_score=10.0,
        liquidity_score=10.0,
        community_score=10.0,
        distribution_score=10.0,
        safety_score=10.0,
        data_quality_score=10.0,
    )
    score = calculate_score(components, critical_flags=["scam_found"])
    assert score.classification == OpportunityClassification.HIGH_RISK


def test_scoring_version():
    components = ScoreComponentsInput()
    score = calculate_score(components)
    assert score.scoring_version == "v1.0.0"


def test_weights_sum_to_one():
    assert sum(WEIGHTS.values()) == 1.0


def test_explanation_mentions_blocked_when_critical_gate():
    components = ScoreComponentsInput(
        momentum_score=10.0,
    )
    score = calculate_score(components, critical_flags=["scam_found"])
    assert "bloqueada" in score.explanation.lower() or "crtico" in score.explanation.lower()


def test_positive_factors_include_high_scores():
    components = ScoreComponentsInput(
        momentum_score=10.0,
        liquidity_score=2.0,
    )
    score = calculate_score(components)
    assert len(score.positive_factors) > 0


def test_negative_factors_include_missing_data():
    components = ScoreComponentsInput(
        momentum_score=2.0,
    )
    score = calculate_score(components)
    assert len(score.negative_factors) > 0
