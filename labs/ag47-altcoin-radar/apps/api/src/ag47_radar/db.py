from __future__ import annotations

import asyncio
from collections.abc import AsyncGenerator
from datetime import UTC, datetime
from pathlib import Path

from sqlalchemy import MetaData, text
from sqlalchemy.exc import DBAPIError
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm.exc import StaleDataError

from ag47_radar.config import get_settings

NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=NAMING_CONVENTION)


def utc_now() -> datetime:
    return datetime.now(UTC)


def build_engine(database_url: str | None = None) -> AsyncEngine:
    settings = get_settings()
    url = database_url or settings.database_url
    kwargs: dict[str, object] = {"pool_pre_ping": True}
    if url.startswith("sqlite+"):
        kwargs["connect_args"] = {"check_same_thread": False}
        database_path = url.split("///", maxsplit=1)[-1]
        if database_path != ":memory:":
            Path(database_path).expanduser().resolve().parent.mkdir(parents=True, exist_ok=True)
    else:
        kwargs["pool_size"] = settings.database_pool_size
        kwargs["max_overflow"] = settings.database_max_overflow
        kwargs["pool_timeout"] = settings.database_pool_timeout
    return create_async_engine(url, **kwargs)


engine = build_engine()
SessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


def get_session_factory() -> async_sessionmaker[AsyncSession]:
    return SessionLocal


async def configure_database(database_url: str) -> None:
    """Rebind the runtime database, primarily for app factories and isolated tests."""

    global engine, SessionLocal
    await engine.dispose()
    engine = build_engine(database_url)
    SessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def get_session() -> AsyncGenerator[AsyncSession]:
    async with SessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise


async def create_schema() -> None:
    # Imported here so model metadata is populated before create_all.
    from ag47_radar import models

    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)


async def database_is_healthy() -> bool:
    try:
        async with engine.connect() as connection:
            await connection.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


async def close_database() -> None:
    await engine.dispose()


async def run_transaction_with_retry(
    session_factory,
    transactional_callable,
    *args,
    max_retries: int = 3,
    initial_backoff: float = 0.05,
    **kwargs,
):
    """Executes a callable inside a new session, with exponential backoff retries for serialization errors or deadlocks."""
    for attempt in range(max_retries):
        async with session_factory() as session:
            try:
                result = await transactional_callable(session, *args, **kwargs)
                return result
            except StaleDataError:
                if attempt < max_retries - 1:
                    await session.rollback()
                    backoff = initial_backoff * (2**attempt)
                    await asyncio.sleep(backoff)
                    continue
                raise
            except DBAPIError as e:
                # 40001 = Serialization Failure, 40P01 = Deadlock Detected, 23505 = Unique Violation
                sqlstate = getattr(e.orig, "sqlstate", None)
                is_concurrency_error = sqlstate in ("40001", "40P01", "23505")
                # SQLite equivalents of busy/locked or unique constraints can also be handled (e.g. database is locked, unique constraint failed)
                is_sqlite_lock = (
                    "locked" in str(e).lower()
                    or "busy" in str(e).lower()
                    or "unique constraint failed" in str(e).lower()
                )

                if (is_concurrency_error or is_sqlite_lock) and attempt < max_retries - 1:
                    await session.rollback()
                    backoff = initial_backoff * (2**attempt)
                    await asyncio.sleep(backoff)
                    continue
                raise
            except Exception:
                await session.rollback()
                raise
