import pytest

from ag47_radar.services.portfolio import (
    buy_virtual_position,
    get_or_create_portfolio,
    get_portfolio_metrics,
)

pytestmark = pytest.mark.asyncio


async def test_portfolio_creation(db_session):
    portfolio = await get_or_create_portfolio(db_session)
    assert portfolio is not None
    assert portfolio.initial_balance == 10000.0
    assert portfolio.current_balance == 10000.0


async def test_buy_virtual_position(db_session):
    position = await buy_virtual_position(
        session=db_session, token_symbol="TEST", entry_price=1.5, simulated_size=100.0
    )

    assert position.token_symbol == "TEST"
    assert position.entry_price == 1.5
    assert position.status == "OPEN"

    portfolio = await get_or_create_portfolio(db_session)
    assert portfolio.current_balance == 9900.0


async def test_portfolio_metrics(db_session):
    # Setup some positions with PNL
    pos1 = await buy_virtual_position(db_session, "A", 1.0, 100.0)
    pos2 = await buy_virtual_position(db_session, "B", 1.0, 100.0)

    pos1.pnl = 50.0  # Win
    pos2.pnl = -20.0  # Loss
    await db_session.commit()

    metrics = await get_portfolio_metrics(db_session)
    assert metrics.total_trades == 2
    assert metrics.total_pnl == 30.0
    assert metrics.win_rate == 0.5
    assert metrics.profit_factor == 2.5  # 50 / 20
