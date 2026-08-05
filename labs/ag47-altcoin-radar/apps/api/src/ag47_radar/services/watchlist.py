from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.config import Settings
from ag47_radar.enums import AlertSeverity, AlertType
from ag47_radar.errors import ResourceNotFoundError
from ag47_radar.models import MarketSnapshot, OpportunityScore, Token, TradingPair, WatchlistEntry
from ag47_radar.schemas import WatchlistCreate, WatchlistRead
from ag47_radar.services.alerts import AlertCommand, create_alert_if_new
from ag47_radar.services.queries import ensure_utc, market_to_read, score_to_read, token_to_read


async def _serialize_entry(
    session: AsyncSession, settings: Settings, entry: WatchlistEntry, token: Token
) -> WatchlistRead:
    latest_score = await session.scalar(
        select(OpportunityScore)
        .where(
            OpportunityScore.token_id == token.id, OpportunityScore.is_demo.is_(settings.demo_mode)
        )
        .order_by(OpportunityScore.calculated_at.desc())
        .limit(1)
    )
    latest_market = await session.scalar(
        select(MarketSnapshot)
        .join(TradingPair, TradingPair.id == MarketSnapshot.pair_id)
        .where(TradingPair.token_id == token.id, MarketSnapshot.is_demo.is_(settings.demo_mode))
        .order_by(MarketSnapshot.captured_at.desc())
        .limit(1)
    )
    return WatchlistRead(
        id=entry.id,
        token_id=entry.token_id,
        notes=entry.notes,
        created_at=ensure_utc(entry.created_at),
        token=token_to_read(token),
        latest_score=score_to_read(latest_score),
        latest_market=market_to_read(latest_market),
    )


async def add_to_watchlist(
    session: AsyncSession, settings: Settings, command: WatchlistCreate
) -> tuple[WatchlistRead, bool]:
    token = await session.scalar(
        select(Token).where(Token.id == command.token_id, Token.is_demo.is_(settings.demo_mode))
    )
    if token is None:
        raise ResourceNotFoundError("Token not found in the active data mode")
    existing = await session.scalar(
        select(WatchlistEntry).where(WatchlistEntry.token_id == command.token_id)
    )
    created = existing is None
    entry = existing or WatchlistEntry(token_id=command.token_id, notes=command.notes)
    if existing is None:
        session.add(entry)
        await session.flush()
        await create_alert_if_new(
            session,
            AlertCommand(
                token_id=token.id,
                type=AlertType.WATCHLIST_ADDED,
                severity=AlertSeverity.INFO,
                title=f"{token.symbol} adicionado à watchlist",
                message="O token passou a ser acompanhado na watchlist.",
                payload={"notes": command.notes},
                deduplication_key="watchlist",
                is_demo=token.is_demo,
            ),
            deduplication_window_minutes=settings.alert_deduplication_window_minutes,
        )
    elif command.notes is not None and command.notes != existing.notes:
        existing.notes = command.notes
    await session.commit()
    await session.refresh(entry)
    return await _serialize_entry(session, settings, entry, token), created


async def remove_from_watchlist(session: AsyncSession, settings: Settings, token_id: str) -> None:
    entry = await session.scalar(
        select(WatchlistEntry)
        .join(Token, Token.id == WatchlistEntry.token_id)
        .where(WatchlistEntry.token_id == token_id, Token.is_demo.is_(settings.demo_mode))
    )
    if entry is None:
        raise ResourceNotFoundError("Watchlist entry not found")
    await session.delete(entry)
    await session.commit()
