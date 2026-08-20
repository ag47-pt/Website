"""API endpoints for Grid Search parameter optimization and dynamic score weight calibration."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.api.dependencies import require_admin
from ag47_radar.config import get_settings
from ag47_radar.db import get_session
from ag47_radar.models import ScoringWeights
from ag47_radar.schemas import ApplyWeightsRequest, ApplyWeightsResponse, GridSearchResponse
from ag47_radar.services.optimization import run_grid_search_optimization

router = APIRouter(prefix="/system", tags=["optimization"])


@router.post(
    "/optimize-weights", response_model=GridSearchResponse, dependencies=[Depends(require_admin)]
)
async def optimize_weights(
    session: Annotated[AsyncSession, Depends(get_session)],
    horizon_hours: float = Query(default=24.0, ge=1.0, le=168.0),
) -> GridSearchResponse:
    """Run an offline grid search optimization over historical observations."""
    settings = get_settings()
    return await run_grid_search_optimization(
        session,
        horizon_hours=horizon_hours,
        include_demo=settings.demo_mode,
    )


@router.post(
    "/apply-weights", response_model=ApplyWeightsResponse, dependencies=[Depends(require_admin)]
)
async def apply_weights(
    body: ApplyWeightsRequest,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> ApplyWeightsResponse:
    """Manually apply recommended weights to active scoring engine (Operator Sign-off)."""
    requested_weights = body.weights.model_dump()
    scale = max(requested_weights.values())
    scaled_weights = {name: value / scale for name, value in requested_weights.items()}
    total_weight = sum(scaled_weights.values())
    normalized_weights = {name: value / total_weight for name, value in scaled_weights.items()}
    applied_at = datetime.now(UTC)
    persisted_weights = ScoringWeights(
        calibrated_at=applied_at,
        weights_json=normalized_weights,
        sample_count=0,
        correlation=None,
    )
    session.add(persisted_weights)
    await session.commit()

    return ApplyWeightsResponse(
        status="ok",
        active_weights=normalized_weights,
        applied_at=applied_at,
    )
