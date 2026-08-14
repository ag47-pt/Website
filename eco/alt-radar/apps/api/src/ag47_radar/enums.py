from __future__ import annotations

from enum import StrEnum


class Chain(StrEnum):
    BSC = "bsc"
    SOLANA = "solana"
    ETHEREUM = "ethereum"


class DataQuality(StrEnum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    UNKNOWN = "unknown"


class SourceMode(StrEnum):
    REAL = "real"
    DEMO = "demo"


class ProviderStatus(StrEnum):
    ACTIVE = "active"
    DEGRADED = "degraded"
    DISABLED = "disabled"


class OpportunityClassification(StrEnum):
    STRONG = "oportunidade_forte"
    WATCH = "observar"
    SPECULATIVE = "especulativo"
    HIGH_RISK = "risco_elevado"


class AlertType(StrEnum):
    NEW_PAIR = "novo_par_detectado"
    SCORE_THRESHOLD = "score_ultrapassou_limite"
    VOLUME_ACCELERATION = "aceleracao_de_volume"
    SOCIAL_ACCELERATION = "aceleracao_social"
    LIQUIDITY_DROP = "queda_de_liquidez"
    HOLDER_CONCENTRATION = "concentracao_de_holders"
    RISK_CHANGE = "mudanca_de_risco"
    WATCHLIST_ADDED = "token_adicionado_watchlist"


class AlertSeverity(StrEnum):
    INFO = "informativo"
    ATTENTION = "atencao"
    HIGH = "alto_risco"
    CRITICAL = "critico"


class RiskSignalLevel(StrEnum):
    INFO = "informativo"
    ATTENTION = "atencao"
    HIGH = "alto_risco"
    CRITICAL = "critico"
    UNKNOWN = "desconhecido"


class LiquidityLockStatus(StrEnum):
    LOCKED = "locked"
    UNLOCKED = "unlocked"
    UNKNOWN = "unknown"
