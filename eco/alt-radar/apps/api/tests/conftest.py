import pytest
import pytest_asyncio
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.config import Settings
from ag47_radar.main import create_app
from ag47_radar.services.seed import seed_demo_data


@pytest.fixture
def test_settings() -> Settings:
    return Settings(
        database_url="sqlite+aiosqlite:///file:testdb?mode=memory&cache=shared&uri=true",
        demo_mode=True,
        environment="test",
        auto_create_schema=True,
        auto_seed_demo=False,
    )


@pytest_asyncio.fixture
async def test_app(test_settings: Settings) -> FastAPI:
    app = create_app(test_settings)
    async with app.router.lifespan_context(app):
        yield app


@pytest_asyncio.fixture
async def db_engine(test_app: FastAPI):
    # test_app lifespan calls configure_database and create_schema already
    import ag47_radar.db as db

    yield db.engine


@pytest_asyncio.fixture
async def db_session(db_engine) -> AsyncSession:
    import ag47_radar.db as db

    async with db.SessionLocal() as session:
        yield session


@pytest_asyncio.fixture
async def api_client(test_app: FastAPI) -> AsyncClient:
    transport = ASGITransport(app=test_app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest_asyncio.fixture
async def seeded_db(test_app: FastAPI):
    # lifespan handles seeding if auto_seed_demo=True, but we have it as False
    # so we run it manually. Wait, test_settings has auto_seed_demo=False.
    # We can just call seed_demo_data.
    await seed_demo_data()
    return True
