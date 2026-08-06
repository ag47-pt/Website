from __future__ import annotations

import math
from datetime import UTC, datetime, timedelta
from typing import Any, Literal, overload

from sqlalchemy import and_, func, literal, null, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased

from ag47_radar.config import Settings
from ag47_radar.enums import Chain, DataQuality, OpportunityClassification, SourceMode
from ag47_radar.errors import ResourceNotFoundError
from ag47_radar.models import (
    Alert,
    MarketSnapshot,
    OpportunityScore,
    RiskAssessment,
    ScoringWeights,
    SocialSnapshot,
    Token,
    TokenAlert,
    TokenEvent,
    TokenSignal,
    TradingPair,
    WatchlistEntry,
)
from ag47_radar.schemas import (
    CorrelationBucket,
    GlobalKnowledgeRead,
    MarketHistoryPoint,
    MarketHistoryResponse,
    MarketSnapshotRead,
    OperatorInboxResponse,
    OpportunityItem,
    OpportunityRiskSummary,
    OpportunityScoreRead,
    PaginatedResponse,
    RiskAssessmentRead,
    SocialResponse,
    SocialSnapshotRead,
    SystemMetrics,
    TimelineEventRead,
    TimelineItem,
    TimelineSignalRead,
    TokenAlertRead,
    TokenDetailResponse,
    TokenRead,
    TradingPairRead,
    WatchlistRead,
)

SortOrder = Literal["asc", "desc"]
OpportunitySort = Literal[
    "score",
    "risk",
    "price",
    "price_change_1h",
    "liquidity",
    "volume_1h",
    "volume_24h",
    "pair_age",
    "updated_at",
]


@overload
def ensure_utc(value: datetime) -> datetime: ...


@overload
def ensure_utc(value: None) -> None: ...


def ensure_utc(value: datetime | None) -> datetime | None:
    if value is None:
        return None
    if value.tzinfo is None:
        return value.replace(tzinfo=UTC)
    return value.astimezone(UTC)


def _pages(total: int, page_size: int) -> int:
    return math.ceil(total / page_size) if total else 0


def _latest_alias(model: type[Any], partition_column: Any, order_column: Any) -> tuple[Any, Any]:
    ranked = select(
        model,
        func.row_number()
        .over(partition_by=partition_column, order_by=order_column.desc())
        .label("rn"),
    ).subquery()
    return aliased(model, ranked), ranked


def risk_to_read(risk: RiskAssessment | None) -> RiskAssessmentRead | None:
    if risk is None:
        return None
    result = RiskAssessmentRead.model_validate(risk)
    return result.model_copy(update={"captured_at": ensure_utc(result.captured_at)})


def market_to_read(market: MarketSnapshot | None) -> MarketSnapshotRead | None:
    if market is None:
        return None
    result = MarketSnapshotRead.model_validate(market)
    return result.model_copy(update={"captured_at": ensure_utc(result.captured_at)})


def social_to_read(social: SocialSnapshot | None) -> SocialSnapshotRead | None:
    if social is None:
        return None
    result = SocialSnapshotRead.model_validate(social)
    return result.model_copy(update={"captured_at": ensure_utc(result.captured_at)})


def score_to_read(score: OpportunityScore | None) -> OpportunityScoreRead | None:
    if score is None:
        return None
    result = OpportunityScoreRead.model_validate(score)
    return result.model_copy(update={"calculated_at": ensure_utc(result.calculated_at)})


def token_to_read(token: Token) -> TokenRead:
    result = TokenRead.model_validate(token)
    return result.model_copy(
        update={
            "created_at": ensure_utc(result.created_at),
            "first_seen_at": ensure_utc(result.first_seen_at),
        }
    )


def pair_to_read(pair: TradingPair) -> TradingPairRead:
    result = TradingPairRead.model_validate(pair)
    return result.model_copy(
        update={
            "created_at": ensure_utc(result.created_at),
            "first_seen_at": ensure_utc(result.first_seen_at),
        }
    )


async def list_opportunities(
    session: AsyncSession,
    settings: Settings,
    *,
    query: str | None,
    chains: list[Chain] | None,
    min_score: float | None,
    max_risk: float | None,
    max_pair_age_hours: int | None,
    min_liquidity: float | None,
    sort_by: OpportunitySort,
    sort_order: SortOrder,
    page: int,
    page_size: int,
) -> PaginatedResponse[OpportunityItem]:
    market, market_ranked = _latest_alias(
        MarketSnapshot, MarketSnapshot.pair_id, MarketSnapshot.captured_at
    )
    risk, risk_ranked = _latest_alias(
        RiskAssessment, RiskAssessment.token_id, RiskAssessment.captured_at
    )
    score, score_ranked = _latest_alias(
        OpportunityScore, OpportunityScore.token_id, OpportunityScore.calculated_at
    )
    statement = (
        select(Token, TradingPair, market, risk, score, WatchlistEntry.id)
        .join(TradingPair, TradingPair.token_id == Token.id)
        .outerjoin(
            market,
            and_(market.pair_id == TradingPair.id, market_ranked.c.rn == 1),
        )
        .outerjoin(risk, and_(risk.token_id == Token.id, risk_ranked.c.rn == 1))
        .outerjoin(score, and_(score.token_id == Token.id, score_ranked.c.rn == 1))
        .outerjoin(WatchlistEntry, WatchlistEntry.token_id == Token.id)
        .where(Token.is_demo.is_(settings.demo_mode))
    )
    if query:
        term = f"%{query.strip()}%"
        statement = statement.where(
            or_(
                Token.name.ilike(term),
                Token.symbol.ilike(term),
                Token.contract_address.ilike(term),
                TradingPair.pair_address.ilike(term),
            )
        )
    if chains:
        statement = statement.where(Token.chain.in_([chain.value for chain in chains]))
    if min_score is not None:
        statement = statement.where(score.final_score >= min_score)
    if max_risk is not None:
        statement = statement.where(risk.risk_score <= max_risk)
    if max_pair_age_hours is not None:
        statement = statement.where(
            TradingPair.created_at >= datetime.now(UTC) - timedelta(hours=max_pair_age_hours)
        )
    if min_liquidity is not None:
        statement = statement.where(market.liquidity_usd >= min_liquidity)

    sort_columns = {
        "score": score.final_score,
        "risk": risk.risk_score,
        "price": market.price_usd,
        "price_change_1h": market.price_change_1h,
        "liquidity": market.liquidity_usd,
        "volume_1h": market.volume_1h,
        "volume_24h": market.volume_24h,
        "pair_age": TradingPair.created_at,
        "updated_at": market.captured_at,
    }
    sort_column = sort_columns[sort_by]
    order_expression = sort_column.asc() if sort_order == "asc" else sort_column.desc()
    statement = statement.order_by(order_expression.nulls_last(), Token.symbol.asc())
    total = (
        await session.scalar(select(func.count()).select_from(statement.order_by(None).subquery()))
        or 0
    )
    rows = (await session.execute(statement.offset((page - 1) * page_size).limit(page_size))).all()

    items: list[OpportunityItem] = []
    partial = False
    stale = False
    now = datetime.now(UTC)
    for token, pair, market_row, risk_row, score_row, watchlist_id in rows:
        market_read = market_to_read(market_row)
        risk_read = risk_to_read(risk_row)
        score_read = score_to_read(score_row)
        partial = partial or market_read is None or risk_read is None or score_read is None
        timestamps = [
            value
            for value in [
                market_read.captured_at if market_read else None,
                risk_read.captured_at if risk_read else None,
                score_read.calculated_at if score_read else None,
                ensure_utc(pair.first_seen_at),
            ]
            if value is not None
        ]
        updated_at = max(timestamps) if timestamps else ensure_utc(token.first_seen_at) or now
        stale = stale or (not token.is_demo and now - updated_at > timedelta(minutes=15))
        risk_summary = None
        if risk_read:
            risk_summary = OpportunityRiskSummary(
                risk_score=risk_read.risk_score,
                critical_flags=risk_read.critical_flags,
                captured_at=risk_read.captured_at,
                source=risk_read.source,
                data_quality=risk_read.data_quality,
                is_demo=risk_read.is_demo,
            )
        items.append(
            OpportunityItem(
                token=token_to_read(token),
                pair=pair_to_read(pair),
                market=market_read,
                risk=risk_summary,
                score=score_read,
                holders_count=risk_read.holders_count if risk_read else None,
                watchlisted=watchlist_id is not None,
                updated_at=updated_at,
            )
        )
    return PaginatedResponse[OpportunityItem](
        items=items,
        page=page,
        page_size=page_size,
        total=total,
        pages=_pages(total, page_size),
        demo_mode=settings.demo_mode,
        partial=partial,
        stale=stale,
    )


async def _get_token(session: AsyncSession, settings: Settings, token_id: str) -> Token:
    token = await session.scalar(
        select(Token).where(Token.id == token_id, Token.is_demo.is_(settings.demo_mode))
    )
    if token is None:
        raise ResourceNotFoundError("Token not found in the active data mode")
    return token


async def get_token_detail(
    session: AsyncSession, settings: Settings, token_id: str
) -> TokenDetailResponse:
    token = await _get_token(session, settings, token_id)
    pairs = list(
        (
            await session.scalars(
                select(TradingPair)
                .where(TradingPair.token_id == token.id)
                .order_by(TradingPair.first_seen_at.desc())
            )
        ).all()
    )
    latest_market = await session.scalar(
        select(MarketSnapshot)
        .join(TradingPair, TradingPair.id == MarketSnapshot.pair_id)
        .where(TradingPair.token_id == token.id, MarketSnapshot.is_demo.is_(settings.demo_mode))
        .order_by(MarketSnapshot.captured_at.desc())
        .limit(1)
    )
    latest_social = await session.scalar(
        select(SocialSnapshot)
        .where(SocialSnapshot.token_id == token.id, SocialSnapshot.is_demo.is_(settings.demo_mode))
        .order_by(SocialSnapshot.captured_at.desc())
        .limit(1)
    )
    latest_risk = await session.scalar(
        select(RiskAssessment)
        .where(RiskAssessment.token_id == token.id, RiskAssessment.is_demo.is_(settings.demo_mode))
        .order_by(RiskAssessment.captured_at.desc())
        .limit(1)
    )
    latest_score = await session.scalar(
        select(OpportunityScore)
        .where(
            OpportunityScore.token_id == token.id, OpportunityScore.is_demo.is_(settings.demo_mode)
        )
        .order_by(OpportunityScore.calculated_at.desc())
        .limit(1)
    )
    watchlisted = (
        await session.scalar(
            select(WatchlistEntry.id).where(WatchlistEntry.token_id == token.id).limit(1)
        )
        is not None
    )
    return TokenDetailResponse(
        token=token_to_read(token),
        pairs=[pair_to_read(pair) for pair in pairs],
        latest_market=market_to_read(latest_market),
        latest_social=social_to_read(latest_social),
        latest_risk=risk_to_read(latest_risk),
        latest_score=score_to_read(latest_score),
        watchlisted=watchlisted,
        data_mode=SourceMode.DEMO if settings.demo_mode else SourceMode.REAL,
    )


async def get_market_history(
    session: AsyncSession,
    settings: Settings,
    token_id: str,
    *,
    interval: Literal["1h", "6h", "24h", "7d", "30d"],
    limit: int,
) -> MarketHistoryResponse:
    await _get_token(session, settings, token_id)
    hours = {"1h": 1, "6h": 6, "24h": 24, "7d": 168, "30d": 720}[interval]
    statement = (
        select(MarketSnapshot)
        .join(TradingPair, TradingPair.id == MarketSnapshot.pair_id)
        .where(
            TradingPair.token_id == token_id,
            MarketSnapshot.is_demo.is_(settings.demo_mode),
            MarketSnapshot.captured_at >= datetime.now(UTC) - timedelta(hours=hours),
        )
        .order_by(MarketSnapshot.captured_at.desc())
        .limit(limit)
    )
    snapshots = list(reversed(list((await session.scalars(statement)).all())))
    pair_id = snapshots[-1].pair_id if snapshots else None
    return MarketHistoryResponse(
        token_id=token_id,
        pair_id=pair_id,
        interval=interval,
        points=[
            MarketHistoryPoint(
                captured_at=ensure_utc(item.captured_at),
                price_usd=float(item.price_usd) if item.price_usd is not None else None,
                volume_usd=float(item.volume_1h) if item.volume_1h is not None else None,
                liquidity_usd=float(item.liquidity_usd) if item.liquidity_usd is not None else None,
                source=item.source,
                data_quality=DataQuality(item.data_quality) if item.data_quality else DataQuality.UNKNOWN,
            )
            for item in snapshots
        ],
        demo_mode=settings.demo_mode,
    )


async def get_social(
    session: AsyncSession, settings: Settings, token_id: str, *, limit: int
) -> SocialResponse:
    await _get_token(session, settings, token_id)
    snapshots = list(
        (
            await session.scalars(
                select(SocialSnapshot)
                .where(
                    SocialSnapshot.token_id == token_id,
                    SocialSnapshot.is_demo.is_(settings.demo_mode),
                )
                .order_by(SocialSnapshot.captured_at.desc())
                .limit(limit)
            )
        ).all()
    )
    timeline = [social_to_read(item) for item in reversed(snapshots)]
    typed_timeline = [item for item in timeline if item is not None]
    return SocialResponse(
        token_id=token_id,
        latest=typed_timeline[-1] if typed_timeline else None,
        timeline=typed_timeline,
        demo_mode=settings.demo_mode,
    )


async def get_risk(session: AsyncSession, settings: Settings, token_id: str) -> RiskAssessmentRead:
    await _get_token(session, settings, token_id)
    risk = await session.scalar(
        select(RiskAssessment)
        .where(RiskAssessment.token_id == token_id, RiskAssessment.is_demo.is_(settings.demo_mode))
        .order_by(RiskAssessment.captured_at.desc())
        .limit(1)
    )
    if risk is None:
        raise ResourceNotFoundError("Risk assessment is awaiting data")
    return risk_to_read(risk)  # type: ignore[return-value]


async def get_score(
    session: AsyncSession, settings: Settings, token_id: str
) -> OpportunityScoreRead:
    await _get_token(session, settings, token_id)
    score = await session.scalar(
        select(OpportunityScore)
        .where(
            OpportunityScore.token_id == token_id, OpportunityScore.is_demo.is_(settings.demo_mode)
        )
        .order_by(OpportunityScore.calculated_at.desc())
        .limit(1)
    )
    if score is None:
        raise ResourceNotFoundError("Opportunity score is awaiting data")
    return score_to_read(score)  # type: ignore[return-value]


async def list_alerts(
    session: AsyncSession,
    settings: Settings,
    *,
    token_id: str | None,
    status: str | None = None,
    page: int,
    page_size: int,
) -> PaginatedResponse[TokenAlertRead]:
    statement = (
        select(TokenAlert, Token.symbol)
        .join(Token, Token.id == TokenAlert.token_id)
        .where(Token.is_demo.is_(settings.demo_mode), TokenAlert.is_demo.is_(settings.demo_mode))
    )
    if token_id:
        statement = statement.where(TokenAlert.token_id == token_id)
    if status:
        statement = statement.where(TokenAlert.status == status)

    total = await session.scalar(select(func.count()).select_from(statement.subquery())) or 0
    rows = (
        await session.execute(
            statement.order_by(TokenAlert.triggered_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
    ).all()

    # Batch load latest score components for the token IDs
    token_ids = {alert.token_id for alert, symbol in rows}
    latest_scores = {}
    if token_ids:
        from ag47_radar.models import OpportunityScore
        scores_stmt = (
            select(OpportunityScore)
            .where(
                OpportunityScore.token_id.in_(list(token_ids)),
                OpportunityScore.is_demo.is_(settings.demo_mode)
            )
            .order_by(OpportunityScore.token_id, OpportunityScore.calculated_at.desc())
        )
        scores_result = (await session.scalars(scores_stmt)).all()
        for sc in scores_result:
            if sc.token_id not in latest_scores:
                latest_scores[sc.token_id] = sc

    from ag47_radar.services.scoring import WEIGHTS
    active_weights = await get_latest_scoring_weights(session) or WEIGHTS

    items = []
    for alert, symbol in rows:
        sc = latest_scores.get(alert.token_id)
        score_components = None
        if sc:
            score_components = {
                "momentum_score": float(sc.momentum_score),
                "liquidity_score": float(sc.liquidity_score),
                "community_score": float(sc.community_score),
                "distribution_score": float(sc.distribution_score),
                "safety_score": float(sc.safety_score),
                "data_quality_score": float(sc.data_quality_score),
                "final_score": float(sc.final_score),
            }
        items.append(
            TokenAlertRead(
                id=alert.id,
                rule_id=alert.rule_id,
                token_id=alert.token_id,
                token_symbol=symbol,
                source_kind=alert.source_kind,
                source_id=alert.source_id,
                severity=float(alert.severity) if alert.severity is not None else None,
                confidence=float(alert.confidence) if alert.confidence is not None else None,
                status=alert.status,
                confidence_level=alert.confidence_level,
                triggered_at=ensure_utc(alert.triggered_at),
                read_at=ensure_utc(alert.read_at),
                acknowledged_at=ensure_utc(alert.acknowledged_at),
                dismissed_at=ensure_utc(alert.dismissed_at),
                deduplication_key=alert.deduplication_key,
                is_demo=alert.is_demo,
                score_components=score_components,
                score_weights={k: float(v) for k, v in active_weights.items()},
            )
        )
    return PaginatedResponse[TokenAlertRead](
        items=items,
        page=page,
        page_size=page_size,
        total=total,
        pages=_pages(total, page_size),
        demo_mode=settings.demo_mode,
    )



async def list_global_knowledge(
    session: AsyncSession,
    settings: Settings,
) -> list[GlobalKnowledgeRead]:
    from ag47_radar.models import GlobalKnowledge

    stmt = select(GlobalKnowledge).order_by(
        GlobalKnowledge.pattern_name.asc(), GlobalKnowledge.market_regime.asc()
    )
    results = (await session.execute(stmt)).scalars().all()

    return [GlobalKnowledgeRead.model_validate(r) for r in results]


async def list_watchlist(
    session: AsyncSession, settings: Settings, *, page: int, page_size: int
) -> PaginatedResponse[WatchlistRead]:
    base_statement = (
        select(WatchlistEntry, Token)
        .join(Token, Token.id == WatchlistEntry.token_id)
        .where(Token.is_demo.is_(settings.demo_mode))
    )
    total = await session.scalar(select(func.count()).select_from(base_statement.subquery())) or 0
    rows = (
        await session.execute(
            base_statement.order_by(WatchlistEntry.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
    ).all()
    items: list[WatchlistRead] = []
    for entry, token in rows:
        score = await session.scalar(
            select(OpportunityScore)
            .where(
                OpportunityScore.token_id == token.id,
                OpportunityScore.is_demo.is_(settings.demo_mode),
            )
            .order_by(OpportunityScore.calculated_at.desc())
            .limit(1)
        )
        market = await session.scalar(
            select(MarketSnapshot)
            .join(TradingPair, TradingPair.id == MarketSnapshot.pair_id)
            .where(TradingPair.token_id == token.id, MarketSnapshot.is_demo.is_(settings.demo_mode))
            .order_by(MarketSnapshot.captured_at.desc())
            .limit(1)
        )
        items.append(
            WatchlistRead(
                id=entry.id,
                token_id=entry.token_id,
                notes=entry.notes,
                created_at=ensure_utc(entry.created_at),
                token=token_to_read(token),
                latest_score=score_to_read(score),
                latest_market=market_to_read(market),
            )
        )
    return PaginatedResponse[WatchlistRead](
        items=items,
        page=page,
        page_size=page_size,
        total=total,
        pages=_pages(total, page_size),
        demo_mode=settings.demo_mode,
        partial=any(item.latest_score is None or item.latest_market is None for item in items),
    )


async def system_metrics(
    session: AsyncSession, settings: Settings
) -> tuple[SystemMetrics, datetime | None]:
    token_filter = Token.is_demo.is_(settings.demo_mode)
    tokens_monitored = await session.scalar(select(func.count(Token.id)).where(token_filter)) or 0
    start_today = datetime.now(UTC).replace(hour=0, minute=0, second=0, microsecond=0)
    alerts_today = (
        await session.scalar(
            select(func.count(Alert.id))
            .join(Token, Token.id == Alert.token_id)
            .where(
                token_filter, Alert.is_demo.is_(settings.demo_mode), Alert.created_at >= start_today
            )
        )
        or 0
    )
    score, ranked = _latest_alias(
        OpportunityScore, OpportunityScore.token_id, OpportunityScore.calculated_at
    )
    score_statement = (
        select(score.final_score, score.classification)
        .join(Token, Token.id == score.token_id)
        .where(token_filter, score.is_demo.is_(settings.demo_mode), ranked.c.rn == 1)
    )
    score_rows = (await session.execute(score_statement)).all()
    average_score = (
        round(sum(float(row.final_score) for row in score_rows) / len(score_rows), 2)
        if score_rows
        else None
    )
    strong = sum(
        1 for row in score_rows if row.classification == OpportunityClassification.STRONG.value
    )
    last_sync = await session.scalar(
        select(func.max(MarketSnapshot.captured_at))
        .join(TradingPair, TradingPair.id == MarketSnapshot.pair_id)
        .join(Token, Token.id == TradingPair.token_id)
        .where(token_filter, MarketSnapshot.is_demo.is_(settings.demo_mode))
    )
    return (
        SystemMetrics(
            tokens_monitored=tokens_monitored,
            alerts_today=alerts_today,
            strong_opportunities=strong,
            average_score=average_score,
            active_providers=0,
        ),
        ensure_utc(last_sync),
    )


async def get_token_timeline(
    session: AsyncSession, settings: Settings, token_id: str, *, page: int, page_size: int
) -> PaginatedResponse[TimelineItem]:
    await _get_token(session, settings, token_id)

    from sqlalchemy import Numeric, String

    event_stmt = select(
        TokenEvent.id,
        TokenEvent.event_type.label("type"),
        TokenEvent.created_at,
        TokenEvent.metadata_json,
        TokenEvent.rule_version,
        TokenEvent.caused_by,
        func.cast(null(), Numeric(4, 2)).label("strength"),
        func.cast(null(), Numeric(4, 2)).label("confidence"),
        func.cast(literal("event"), String).label("kind"),
    ).where(TokenEvent.token_id == token_id)

    signal_stmt = select(
        TokenSignal.id,
        TokenSignal.signal_type.label("type"),
        TokenSignal.created_at,
        TokenSignal.metadata_json,
        TokenSignal.rule_version,
        TokenSignal.caused_by,
        TokenSignal.strength,
        TokenSignal.confidence,
        func.cast(literal("signal"), String).label("kind"),
    ).where(TokenSignal.token_id == token_id)

    union_stmt = event_stmt.union_all(signal_stmt)
    subq = union_stmt.subquery()

    stmt = select(subq).order_by(subq.c.created_at.desc(), subq.c.id.desc())

    total = await session.scalar(select(func.count()).select_from(subq)) or 0
    rows = (await session.execute(stmt.offset((page - 1) * page_size).limit(page_size))).all()

    items: list[TimelineItem] = []
    for row in rows:
        meta = row.metadata_json or {}

        if row.kind == "event":
            title = ""
            desc = ""
            if row.type == "liquidity_spike":
                title = f"Liquidez aumentou {meta.get('spike_percentage', 0)}%"
                desc = f"A liquidez passou de US$ {meta.get('previous', 0):,.2f} para US$ {meta.get('new', 0):,.2f}."
            elif row.type == "liquidity_drop":
                title = f"Liquidez caiu {meta.get('drop_percentage', 0)}%"
                desc = f"A liquidez passou de US$ {meta.get('previous', 0):,.2f} para US$ {meta.get('new', 0):,.2f}."
            elif row.type == "volume_spike":
                title = f"Volume aumentou {meta.get('increase_percentage', 0)}%"
                desc = f"O volume passou de US$ {meta.get('previous', 0):,.2f} para US$ {meta.get('new', 0):,.2f}."

            items.append(
                TimelineEventRead(
                    id=row.id,
                    kind="event",
                    type=row.type,
                    occurred_at=ensure_utc(row.created_at),
                    title=title,
                    description=desc,
                    rule_version=row.rule_version,
                    caused_by=row.caused_by,
                    severity=None,
                    strength=None,
                    confidence=None,
                )
            )
        else:
            title = ""
            desc = ""
            if row.type == "liquidity_volume_expansion":
                title = "Expansão simultânea de liquidez e volume"
                desc = "Dois eventos convergentes foram detectados demonstrando forte expansão."
            elif row.type == "high_volume_liquidity_contraction":
                title = "Forte volume com contração de liquidez"
                desc = "A liquidez foi removida durante um pico de volume."

            items.append(
                TimelineSignalRead(
                    id=row.id,
                    kind="signal",
                    type=row.type,
                    occurred_at=ensure_utc(row.created_at),
                    title=title,
                    description=desc,
                    rule_version=row.rule_version,
                    caused_by=row.caused_by,
                    strength=float(row.strength) if row.strength is not None else 0.0,
                    confidence=float(row.confidence) if row.confidence is not None else 0.0,
                )
            )

    return PaginatedResponse[TimelineItem](
        items=items,
        page=page,
        page_size=page_size,
        total=total,
        pages=_pages(total, page_size),
        demo_mode=settings.demo_mode,
    )


async def list_edge_alerts(
    session: AsyncSession,
    settings: Settings,
    *,
    token_id: str | None = None,
    status: str | None = None,
    confidence_level: str | None = None,
    page: int = 1,
    page_size: int = 20,
) -> OperatorInboxResponse:
    # 1. Fetch paginated alerts
    statement = (
        select(TokenAlert, Token.symbol)
        .join(Token, Token.id == TokenAlert.token_id)
        .where(Token.is_demo.is_(settings.demo_mode), TokenAlert.is_demo.is_(settings.demo_mode))
    )
    if token_id:
        statement = statement.where(TokenAlert.token_id == token_id)
    if status:
        statement = statement.where(TokenAlert.status == status)
    if confidence_level:
        statement = statement.where(TokenAlert.confidence_level == confidence_level)

    total = await session.scalar(select(func.count()).select_from(statement.subquery())) or 0
    rows = (
        await session.execute(
            statement.order_by(TokenAlert.triggered_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
    ).all()

    # Batch load latest score components for the token IDs
    token_ids = {alert.token_id for alert, symbol in rows}
    latest_scores = {}
    if token_ids:
        from ag47_radar.models import OpportunityScore
        scores_stmt = (
            select(OpportunityScore)
            .where(
                OpportunityScore.token_id.in_(list(token_ids)),
                OpportunityScore.is_demo.is_(settings.demo_mode)
            )
            .order_by(OpportunityScore.token_id, OpportunityScore.calculated_at.desc())
        )
        scores_result = (await session.scalars(scores_stmt)).all()
        for sc in scores_result:
            if sc.token_id not in latest_scores:
                latest_scores[sc.token_id] = sc

    from ag47_radar.services.scoring import WEIGHTS
    active_weights = await get_latest_scoring_weights(session) or WEIGHTS

    alert_items = []
    for alert, symbol in rows:
        sc = latest_scores.get(alert.token_id)
        score_components = None
        if sc:
            score_components = {
                "momentum_score": float(sc.momentum_score),
                "liquidity_score": float(sc.liquidity_score),
                "community_score": float(sc.community_score),
                "distribution_score": float(sc.distribution_score),
                "safety_score": float(sc.safety_score),
                "data_quality_score": float(sc.data_quality_score),
                "final_score": float(sc.final_score),
            }
        alert_items.append(
            TokenAlertRead(
                id=alert.id,
                rule_id=alert.rule_id,
                token_id=alert.token_id,
                token_symbol=symbol,
                source_kind=alert.source_kind,
                source_id=alert.source_id,
                severity=float(alert.severity) if alert.severity is not None else None,
                confidence=float(alert.confidence) if alert.confidence is not None else None,
                status=alert.status,
                confidence_level=alert.confidence_level,
                triggered_at=ensure_utc(alert.triggered_at),
                read_at=ensure_utc(alert.read_at),
                acknowledged_at=ensure_utc(alert.acknowledged_at),
                dismissed_at=ensure_utc(alert.dismissed_at),
                deduplication_key=alert.deduplication_key,
                is_demo=alert.is_demo,
                score_components=score_components,
                score_weights={k: float(v) for k, v in active_weights.items()},
            )
        )

    paginated_alerts = PaginatedResponse[TokenAlertRead](
        items=alert_items,
        page=page,
        page_size=page_size,
        total=total,
        pages=_pages(total, page_size),
        demo_mode=settings.demo_mode,
    )

    # 2. Compute correlation matrix
    from ag47_radar.services.performance_analysis import fetch_truths_with_score_context

    records = await fetch_truths_with_score_context(session, is_demo=settings.demo_mode)

    SCORE_BUCKETS = [
        ("0.0 - 4.0 (Baixo)", 0.0, 4.0),
        ("4.0 - 6.0 (Neutro)", 4.0, 6.0),
        ("6.0 - 7.0 (Moderado)", 6.0, 7.0),
        ("7.0 - 8.0 (Promissor)", 7.0, 8.0),
        ("8.0 - 9.0 (Forte)", 8.0, 9.0),
        ("9.0 - 10.0 (Excepcional)", 9.0, 10.0),
    ]

    correlation_matrix = []
    for label, min_s, max_s in SCORE_BUCKETS:
        matching = [
            (t, score, conf)
            for t, score, conf in records
            if (min_s <= score < max_s if max_s < 10.0 else min_s <= score <= max_s)
        ]
        total_samples = len(matching)
        if total_samples == 0:
            correlation_matrix.append(
                CorrelationBucket(
                    score_range=label,
                    min_score=min_s,
                    max_score=max_s,
                    total_samples=0,
                    win_rate_pct=0.0,
                    avg_return_pct=0.0,
                    avg_drawdown_pct=0.0,
                    is_suspended=False,
                )
            )
            continue

        successes = sum(1 for t, _, _ in matching if t.status == "success")
        win_rate = (successes / total_samples) * 100.0

        returns = [
            float(t.observed_outcome.get("price_change_pct", 0.0))
            if isinstance(t.observed_outcome, dict)
            else 0.0
            for t, _, _ in matching
        ]
        drawdowns = [
            float(t.observed_outcome.get("max_drawdown_pct", 0.0))
            if isinstance(t.observed_outcome, dict)
            else 0.0
            for t, _, _ in matching
        ]

        avg_ret = sum(returns) / total_samples
        avg_dd = sum(drawdowns) / total_samples

        sorted_matching = sorted(matching, key=lambda x: x[0].created_at, reverse=True)
        is_suspended = False
        if len(sorted_matching) >= 3:
            if all(x[0].status == "failure" for x in sorted_matching[:3]):
                is_suspended = True

        correlation_matrix.append(
            CorrelationBucket(
                score_range=label,
                min_score=min_s,
                max_score=max_s,
                total_samples=total_samples,
                win_rate_pct=round(win_rate, 2),
                avg_return_pct=round(avg_ret, 2),
                avg_drawdown_pct=round(avg_dd, 2),
                is_suspended=is_suspended,
            )
        )

    return OperatorInboxResponse(
        alerts=paginated_alerts,
        correlation_matrix=correlation_matrix,
    )


async def get_latest_scoring_weights(session: AsyncSession) -> dict[str, float] | None:
    stmt = select(ScoringWeights).order_by(ScoringWeights.calibrated_at.desc()).limit(1)
    result = await session.scalar(stmt)
    if result:
        return result.weights_json
    return None

