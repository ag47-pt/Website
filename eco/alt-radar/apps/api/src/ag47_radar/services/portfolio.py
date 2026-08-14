from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.models import VirtualPortfolio, VirtualPosition
from ag47_radar.schemas import VirtualPortfolioMetrics


async def get_or_create_portfolio(session: AsyncSession) -> VirtualPortfolio:
    portfolio = await session.scalar(select(VirtualPortfolio).limit(1))
    if not portfolio:
        portfolio = VirtualPortfolio(initial_balance=10000.0, current_balance=10000.0)
        session.add(portfolio)
        await session.flush()
    return portfolio


async def buy_virtual_position(
    session: AsyncSession,
    token_symbol: str,
    entry_price: float,
    simulated_size: float = 100.0,
    alert_id: str | None = None,
) -> VirtualPosition:
    portfolio = await get_or_create_portfolio(session)

    # Optional logic: Deduct from balance
    portfolio.current_balance -= simulated_size

    position = VirtualPosition(
        portfolio_id=portfolio.id,
        token_symbol=token_symbol,
        entry_price=entry_price,
        simulated_size=simulated_size,
        current_price=entry_price,
        status="OPEN",
        alert_id=alert_id,
    )
    session.add(position)
    await session.commit()
    await session.refresh(position)
    return position


async def get_portfolio_metrics(session: AsyncSession) -> VirtualPortfolioMetrics:
    portfolio = await get_or_create_portfolio(session)

    positions_result = await session.scalars(
        select(VirtualPosition).where(VirtualPosition.portfolio_id == portfolio.id)
    )
    positions = positions_result.all()

    total_trades = len(positions)
    total_pnl = sum([p.pnl for p in positions if p.pnl is not None])

    # Calculate win rate and profit factor
    wins = len([p for p in positions if p.pnl and p.pnl > 0])
    win_rate = (wins / total_trades) if total_trades > 0 else 0.0

    gross_profit = sum([p.pnl for p in positions if p.pnl and p.pnl > 0])
    gross_loss = abs(sum([p.pnl for p in positions if p.pnl and p.pnl < 0]))
    profit_factor = (
        (gross_profit / gross_loss)
        if gross_loss > 0
        else (float("inf") if gross_profit > 0 else 0.0)
    )

    max_drawdown = 0.0

    return VirtualPortfolioMetrics(
        total_pnl=total_pnl,
        profit_factor=profit_factor,
        win_rate=win_rate,
        max_drawdown=max_drawdown,
        total_trades=total_trades,
    )


async def get_open_positions(session: AsyncSession) -> list[VirtualPosition]:
    result = await session.scalars(
        select(VirtualPosition)
        .where(VirtualPosition.status == "OPEN")
        .order_by(VirtualPosition.opened_at.desc())
    )
    return list(result.all())
