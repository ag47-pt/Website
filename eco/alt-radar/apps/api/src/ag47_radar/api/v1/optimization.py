"""API endpoints for Grid Search parameter optimization and dynamic score weight calibration."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.api.dependencies import require_admin
from ag47_radar.config import get_settings
from ag47_radar.db import get_session
from ag47_radar.schemas import ApplyWeightsRequest, ApplyWeightsResponse, GridSearchResponse
from ag47_radar.services.optimization import run_grid_search_optimization
from ag47_radar.services.scoring import WEIGHTS

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
) -> ApplyWeightsResponse:
    """Manually apply recommended weights to active scoring engine (Operator Sign-off)."""
    # Normalize weights sum to 1.0 if valid
    total_w = sum(body.weights.values())
    if total_w <= 0:
        return ApplyWeightsResponse(
            status="ok",
            active_weights=WEIGHTS,
            applied_at=datetime.now(UTC),
        )

    for k, v in body.weights.items():
        if k in WEIGHTS:
            WEIGHTS[k] = round(v / total_w, 4) if total_w != 1.0 else round(v, 4)

    return ApplyWeightsResponse(
        status="ok",
        active_weights=WEIGHTS,
        applied_at=datetime.now(UTC),
    )
