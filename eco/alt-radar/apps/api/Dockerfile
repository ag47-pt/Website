FROM python:3.12-slim

# Install uv for fast dependency management
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Runtime dependencies: libpq for asyncpg + curl for health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the dependency files first to cache the uv sync layer
COPY pyproject.toml uv.lock ./

# Install dependencies (ignoring the project installation to just get packages)
RUN uv sync --no-install-project

# Copy the rest of the application
COPY . .

# Install the project itself (the source code)
RUN uv sync

# Run database migrations and start FastAPI on Cloud Run PORT
# Cloud SQL Auth Proxy is injected as a sidecar by Cloud Run — no proxy binary needed here.
# The DATABASE_URL is passed via environment variable (AG47_DATABASE_URL).
CMD ["sh", "-c", "uv run alembic upgrade head && uv run uvicorn ag47_radar.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
