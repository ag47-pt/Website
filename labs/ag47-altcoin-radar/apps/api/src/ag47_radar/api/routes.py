from __future__ import annotations

from datetime import UTC, datetime
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Path, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar import __version__
from ag47_radar.api.dependencies import enforce_mutation_rate_limit, get_provider_registry
from ag47_radar.config import Settings, get_settings
from ag47_radar.db import database_is_healthy, get_session
from ag47_radar.enums import Chain, ProviderStatus
from ag47_radar.providers.registry import ProviderRegistry
from ag47_radar.evolution import EVOLUTION_STATUS
from ag47_radar.schemas import (
    EvolutionStatusRead,
    GlobalKnowledgeRead,
    HealthResponse,
    MarketHistoryResponse,
    OpportunityItem,
    OpportunityScoreRead,
    PaginatedResponse,
    RiskAssessmentRead,
    SocialResponse,
    SystemMetrics,
    SystemStatusResponse,
    TimelineItem,
    TokenAlertRead,
    TokenAlertUpdate,
    TokenDetailResponse,
    WatchlistCreate,
    WatchlistRead,
)
from ag47_radar.services.queries import (
    OpportunitySort,
    get_market_history,
    get_risk,
    get_score,
    get_social,
    get_token_detail,
    get_token_timeline,
    list_alerts,
    list_opportunities,
    list_watchlist,
    system_metrics,
)
from ag47_radar.services.watchlist import add_to_watchlist, remove_from_watchlist

health_router = APIRouter(tags=["system"])
api_router = APIRouter()


@health_router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health probe",
    description="Read-only liveness and database readiness probe without internal error details.",
)
async def health(settings: Settings = Depends(get_settings)) -> HealthResponse:
    database_ok = await database_is_healthy()
    return HealthResponse(
        status="ok" if database_ok else "degraded",
        service="ag47-altcoin-radar-api",
        version=__version__,
        database="connected" if database_ok else "unavailable",
        demo_mode=settings.demo_mode,
        time=datetime.now(UTC),
    )


@api_router.get(
    "/system/status",
    response_model=SystemStatusResponse,
    tags=["system"],
    summary="Operational status and dashboard metrics",
)
async def system_status(
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_settings),
    providers: ProviderRegistry = Depends(get_provider_registry),
) -> SystemStatusResponse:
    database_ok = await database_is_healthy()
    statuses = providers.statuses()
    if database_ok:
        metrics, last_sync = await system_metrics(session, settings)
    else:
        metrics = SystemMetrics(
            tokens_monitored=0,
            alerts_today=0,
            strong_opportunities=0,
            average_score=None,
            active_providers=0,
        )
        last_sync = None
    active_count = sum(item.status == ProviderStatus.ACTIVE for item in statuses)
    metrics = metrics.model_copy(update={"active_providers": active_count})
    degraded = not database_ok or any(item.status == ProviderStatus.DEGRADED for item in statuses)
    return SystemStatusResponse(
        status="degraded" if degraded else "operational",
        demo_mode=settings.demo_mode,
        monitoring_active=settings.scheduler_enabled and not settings.demo_mode,
        database="connected" if database_ok else "unavailable",
        last_sync_at=last_sync,
        generated_at=datetime.now(UTC),
        metrics=metrics,
        providers=statuses,
    )


@api_router.get(
    "/system/evolution",
    response_model=EvolutionStatusRead,
    tags=["system"],
    summary="Evolution engine status",
    description="Fase atual do Motor de Evolução da plataforma: onde estamos, o que fazemos e o norte final.",
)
async def system_evolution() -> EvolutionStatusRead:
    return EVOLUTION_STATUS


@api_router.get(
    "/system/knowledge",
    response_model=list[GlobalKnowledgeRead],
    tags=["system", "mcos"],
    summary="MCOS Integration Endpoint - Global Knowledge Metrics",
    description="Exposes epistemological metrics (Global Knowledge) for the overarching Cognitive Organism.",
)
async def system_knowledge(
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_settings),
) -> list[GlobalKnowledgeRead]:
    from ag47_radar.services.queries import list_global_knowledge
    return await list_global_knowledge(session, settings)


@api_router.get(
    "/opportunities",
    response_model=PaginatedResponse[OpportunityItem],
    tags=["opportunities"],
    summary="Search, filter and sort current opportunities",
)
async def opportunities(
    q: Annotated[str | None, Query(min_length=1, max_length=160)] = None,
    chain: Annotated[list[Chain] | None, Query()] = None,
    min_score: Annotated[float | None, Query(ge=0, le=10)] = None,
    max_risk: Annotated[float | None, Query(ge=0, le=10)] = None,
    max_pair_age_hours: Annotated[int | None, Query(ge=1, le=100_000)] = None,
    min_liquidity: Annotated[float | None, Query(ge=0)] = None,
    sort_by: Annotated[OpportunitySort, Query()] = "score",
    sort_order: Annotated[Literal["asc", "desc"], Query()] = "desc",
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_settings),
) -> PaginatedResponse[OpportunityItem]:
    return await list_opportunities(
        session,
        settings,
        query=q,
        chains=chain,
        min_score=min_score,
        max_risk=max_risk,
        max_pair_age_hours=max_pair_age_hours,
        min_liquidity=min_liquidity,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        page_size=page_size,
    )


@api_router.get(
    "/tokens/{token_id}",
    response_model=TokenDetailResponse,
    tags=["tokens"],
    summary="Aggregated token detail",
)
async def token_detail(
    token_id: Annotated[str, Path(min_length=36, max_length=36)],
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_settings),
) -> TokenDetailResponse:
    return await get_token_detail(session, settings, token_id)


@api_router.get(
    "/tokens/{token_id}/market-history",
    response_model=MarketHistoryResponse,
    tags=["tokens"],
    summary="Basic persisted market history",
)
async def token_market_history(
    token_id: Annotated[str, Path(min_length=36, max_length=36)],
    interval: Annotated[Literal["1h", "6h", "24h", "7d", "30d"], Query()] = "24h",
    limit: Annotated[int, Query(ge=1, le=500)] = 200,
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_settings),
) -> MarketHistoryResponse:
    return await get_market_history(session, settings, token_id, interval=interval, limit=limit)


@api_router.get(
    "/tokens/{token_id}/social",
    response_model=SocialResponse,
    tags=["tokens"],
    summary="Social snapshot and timeline",
)
async def token_social(
    token_id: Annotated[str, Path(min_length=36, max_length=36)],
    limit: Annotated[int, Query(ge=1, le=200)] = 100,
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_settings),
) -> SocialResponse:
    return await get_social(session, settings, token_id, limit=limit)


@api_router.get(
    "/tokens/{token_id}/risk",
    response_model=RiskAssessmentRead,
    tags=["tokens"],
    summary="Latest risk assessment",
)
async def token_risk(
    token_id: Annotated[str, Path(min_length=36, max_length=36)],
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_settings),
) -> RiskAssessmentRead:
    return await get_risk(session, settings, token_id)


@api_router.get(
    "/tokens/{token_id}/score",
    response_model=OpportunityScoreRead,
    tags=["tokens"],
    summary="Latest explainable opportunity score",
)
async def token_score(
    token_id: Annotated[str, Path(min_length=36, max_length=36)],
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_settings),
) -> OpportunityScoreRead:
    return await get_score(session, settings, token_id)


@api_router.get(
    "/tokens/{token_id}/timeline",
    response_model=PaginatedResponse[TimelineItem],
    tags=["tokens"],
    summary="Merged timeline of events and signals",
)
async def token_timeline(
    token_id: Annotated[str, Path(min_length=36, max_length=36)],
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_settings),
) -> PaginatedResponse[TimelineItem]:
    return await get_token_timeline(
        session, settings, token_id, page=page, page_size=page_size
    )


@api_router.get(
    "/alerts",
    response_model=PaginatedResponse[TokenAlertRead],
    tags=["alerts"],
    summary="Recent deduplicated alerts",
)
async def alerts(
    token_id: Annotated[str | None, Query(min_length=36, max_length=36)] = None,
    status: Annotated[str | None, Query()] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_settings),
) -> PaginatedResponse[TokenAlertRead]:
    return await list_alerts(
        session,
        settings,
        token_id=token_id,
        status=status,
        page=page,
        page_size=page_size,
    )

@api_router.patch(
    "/alerts/{alert_id}",
    response_model=TokenAlertRead,
    tags=["alerts"],
    summary="Update alert status",
    dependencies=[Depends(enforce_mutation_rate_limit)],
)
async def update_alert(
    alert_id: Annotated[str, Path(min_length=36, max_length=36)],
    update_data: TokenAlertUpdate,
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_settings),
) -> TokenAlertRead:
    from sqlalchemy import select

    from ag47_radar.errors import ResourceNotFoundError
    from ag47_radar.models import Token, TokenAlert
    from ag47_radar.services.queries import ensure_utc

    alert = await session.scalar(
        select(TokenAlert).where(TokenAlert.id == alert_id, TokenAlert.is_demo.is_(settings.demo_mode))
    )
    if not alert:
        raise ResourceNotFoundError("Alert not found")
        
    now = datetime.now(UTC)
    if update_data.status == "read" and alert.status == "unread":
        alert.read_at = now
    elif update_data.status == "acknowledged":
        alert.acknowledged_at = now
    elif update_data.status == "dismissed":
        alert.dismissed_at = now
        
    alert.status = update_data.status
    await session.commit()
    await session.refresh(alert)
    
    token = await session.scalar(select(Token.symbol).where(Token.id == alert.token_id))
    
    return TokenAlertRead(
        id=alert.id,
        rule_id=alert.rule_id,
        token_id=alert.token_id,
        token_symbol=token,
        source_kind=alert.source_kind,
        source_id=alert.source_id,
        severity=alert.severity,
        confidence=alert.confidence,
        status=alert.status,
        triggered_at=ensure_utc(alert.triggered_at),
        read_at=ensure_utc(alert.read_at),
        acknowledged_at=ensure_utc(alert.acknowledged_at),
        dismissed_at=ensure_utc(alert.dismissed_at),
        deduplication_key=alert.deduplication_key,
        is_demo=alert.is_demo,
    )


@api_router.get(
    "/watchlist",
    response_model=PaginatedResponse[WatchlistRead],
    tags=["watchlist"],
    summary="Persisted token watchlist",
)
async def watchlist(
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_settings),
) -> PaginatedResponse[WatchlistRead]:
    return await list_watchlist(session, settings, page=page, page_size=page_size)


@api_router.post(
    "/watchlist",
    response_model=WatchlistRead,
    status_code=status.HTTP_201_CREATED,
    tags=["watchlist"],
    summary="Add or update a watchlist entry",
    dependencies=[Depends(enforce_mutation_rate_limit)],
)
async def create_watchlist_entry(
    command: WatchlistCreate,
    response: Response,
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_settings),
) -> WatchlistRead:
    item, created = await add_to_watchlist(session, settings, command)
    if not created:
        response.status_code = status.HTTP_200_OK
    return item


@api_router.delete(
    "/watchlist/{token_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_model=None,
    tags=["watchlist"],
    summary="Remove a token from the watchlist",
    dependencies=[Depends(enforce_mutation_rate_limit)],
)
async def delete_watchlist_entry(
    token_id: Annotated[str, Path(min_length=36, max_length=36)],
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_settings),
) -> None:
    await remove_from_watchlist(session, settings, token_id)
