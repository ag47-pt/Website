from __future__ import annotations

from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.db import get_session
from ag47_radar.schemas import (
    EquityCurvePoint,
    EquityCurveResponse,
    VirtualPortfolioMetrics,
    VirtualPositionRead,
)
from ag47_radar.services.portfolio import get_open_positions, get_portfolio_metrics

router = APIRouter(prefix="/portfolio", tags=["portfolio"])


@router.get("/metrics", response_model=VirtualPortfolioMetrics)
async def get_metrics(session: AsyncSession = Depends(get_session)) -> Any:
    return await get_portfolio_metrics(session)


@router.get("/positions", response_model=list[VirtualPositionRead])
async def get_positions(session: AsyncSession = Depends(get_session)) -> Any:
    positions = await get_open_positions(session)
    return positions


@router.get("/equity-curve", response_model=EquityCurveResponse)
async def get_equity_curve(session: AsyncSession = Depends(get_session)) -> Any:
    # Retorna uma simulação simples da curva de equidade para o front-end (V1)
    return EquityCurveResponse(
        points=[EquityCurvePoint(timestamp=datetime.utcnow(), equity=10000.0)]
    )
