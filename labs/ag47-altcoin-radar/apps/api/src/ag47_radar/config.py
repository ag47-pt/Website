from __future__ import annotations

from functools import lru_cache
from typing import Literal
from urllib.parse import urlparse

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Environment-backed application configuration.

    Secrets are intentionally absent in Sprint 1. Public providers require no credentials.
    """

    model_config = SettingsConfigDict(
        env_prefix="AG47_",
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "AG47 Altcoin Radar API"
    environment: Literal["development", "test", "production"] = "development"
    debug: bool = False
    demo_mode: bool = True
    log_level: str = "INFO"
    api_prefix: str = "/api/v1"

    telegram_bot_token: str | None = None
    telegram_chat_id: str | None = None
    helius_api_key: str | None = None

    database_url: str = "sqlite+aiosqlite:///./data/ag47_radar.db"
    database_pool_size: int = Field(default=20, ge=5, le=100)
    database_max_overflow: int = Field(default=10, ge=0, le=50)
    database_pool_timeout: float = Field(default=30.0, ge=1.0, le=120.0)
    auto_create_schema: bool = True
    auto_seed_demo: bool = True
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    provider_timeout_seconds: float = Field(default=8.0, gt=0, le=30)
    provider_max_retries: int = Field(default=2, ge=0, le=5)
    provider_backoff_seconds: float = Field(default=0.35, ge=0, le=5)
    provider_cache_ttl_seconds: int = Field(default=60, ge=1, le=3600)
    provider_circuit_failure_threshold: int = Field(default=3, ge=1, le=20)
    provider_circuit_cooldown_seconds: int = Field(default=45, ge=1, le=3600)

    scheduler_enabled: bool = False
    scheduler_interval_seconds: int = Field(default=300, ge=30, le=86400)

    mutation_rate_limit_requests: int = Field(default=20, ge=1, le=1000)
    mutation_rate_limit_window_seconds: int = Field(default=60, ge=1, le=3600)
    alert_deduplication_window_minutes: int = Field(default=30, ge=1, le=1440)

    @field_validator("database_url")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        value = value.strip()
        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+asyncpg://", 1)
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+asyncpg://", 1)
        return value

    @property
    def cors_origin_list(self) -> list[str]:
        origins: list[str] = []
        for raw_origin in self.cors_origins.split(","):
            origin = raw_origin.strip().rstrip("/")
            if not origin:
                continue
            parsed = urlparse(origin)
            if parsed.scheme not in {"http", "https"} or not parsed.netloc:
                raise ValueError(f"Invalid CORS origin: {origin}")
            origins.append(origin)
        if not origins:
            raise ValueError("At least one explicit CORS origin is required")
        return origins


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
