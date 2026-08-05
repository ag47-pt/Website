from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from uuid import uuid4

import structlog
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from ag47_radar import __version__
from ag47_radar.api.routes import api_router, health_router
from ag47_radar.config import Settings, get_settings
from ag47_radar.db import close_database, configure_database, create_schema
from ag47_radar.errors import DomainError, RateLimitExceededError
from ag47_radar.logging import configure_logging, get_logger
from ag47_radar.providers.registry import ProviderRegistry
from ag47_radar.scheduler import start_scheduler, stop_scheduler
from ag47_radar.services.seed import seed_demo_data


def create_app(settings: Settings | None = None) -> FastAPI:
    resolved_settings = settings or get_settings()
    configure_logging(resolved_settings.log_level)
    log = get_logger(component="api")

    @asynccontextmanager
    async def lifespan(application: FastAPI) -> AsyncIterator[None]:
        providers = ProviderRegistry(resolved_settings)
        application.state.providers = providers
        application.state.settings = resolved_settings
        scheduler = None
        try:
            await configure_database(resolved_settings.database_url)
            if resolved_settings.auto_create_schema:
                await create_schema()
            if resolved_settings.demo_mode and resolved_settings.auto_seed_demo:
                counts = await seed_demo_data()
                log.info("demo_seed_ready", **counts)
            scheduler = start_scheduler(resolved_settings, providers)
            log.info(
                "application_started",
                environment=resolved_settings.environment,
                demo_mode=resolved_settings.demo_mode,
                read_only=True,
            )
            yield
        finally:
            stop_scheduler(scheduler)
            await providers.close()
            await close_database()
            log.info("application_stopped")

    application = FastAPI(
        title=resolved_settings.app_name,
        version=__version__,
        description=(
            "Read-only discovery, observation, deterministic scoring and alerts API. "
            "Sprint 1 performs no blockchain transaction and never accepts wallet secrets."
        ),
        debug=resolved_settings.debug and resolved_settings.environment != "production",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )
    application.add_middleware(
        CORSMiddleware,
        allow_origins=resolved_settings.cors_origin_list,
        allow_credentials=False,
        allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
        allow_headers=["Accept", "Content-Type"],
        expose_headers=[
            "X-Request-ID",
            "X-RateLimit-Limit",
            "X-RateLimit-Remaining",
            "X-RateLimit-Reset",
        ],
        max_age=600,
    )
    application.dependency_overrides[get_settings] = lambda: resolved_settings

    @application.middleware("http")
    async def request_context(request: Request, call_next):  # type: ignore[no-untyped-def]
        request_id = str(uuid4())
        request.state.request_id = request_id
        structlog.contextvars.bind_contextvars(request_id=request_id)
        try:
            response = await call_next(request)
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Content-Type-Options"] = "nosniff"
            response.headers["Referrer-Policy"] = "no-referrer"
            return response
        finally:
            structlog.contextvars.clear_contextvars()

    @application.exception_handler(DomainError)
    async def domain_error_handler(request: Request, exc: DomainError) -> JSONResponse:
        headers: dict[str, str] = {}
        if isinstance(exc, RateLimitExceededError):
            headers["Retry-After"] = str(exc.retry_after)
        return JSONResponse(
            status_code=exc.status_code,
            headers=headers,
            content={
                "error": {
                    "code": exc.code,
                    "message": str(exc),
                    "request_id": getattr(request.state, "request_id", "unknown"),
                    "details": None,
                }
            },
        )

    @application.exception_handler(RequestValidationError)
    async def validation_error_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        details = [
            {"location": list(item["loc"]), "message": item["msg"], "type": item["type"]}
            for item in exc.errors()
        ]
        return JSONResponse(
            status_code=422,
            content={
                "error": {
                    "code": "validation_error",
                    "message": "Request validation failed",
                    "request_id": getattr(request.state, "request_id", "unknown"),
                    "details": {"fields": details},
                }
            },
        )

    @application.exception_handler(Exception)
    async def unhandled_error_handler(request: Request, exc: Exception) -> JSONResponse:
        log.exception("unhandled_request_error", error_type=type(exc).__name__)
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "code": "internal_error",
                    "message": "Internal server error",
                    "request_id": getattr(request.state, "request_id", "unknown"),
                    "details": None,
                }
            },
        )

    application.include_router(health_router)
    application.include_router(api_router, prefix=resolved_settings.api_prefix)
    return application


app = create_app()
