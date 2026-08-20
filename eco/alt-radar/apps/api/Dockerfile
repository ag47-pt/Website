FROM python:3.12-slim

# Install uv for fast dependency management
COPY --from=ghcr.io/astral-sh/uv:0.12.5 /uv /uvx /bin/

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
RUN uv sync --frozen --no-dev --no-install-project

# Copy the rest of the application
COPY . .

# Install the project itself (the source code)
RUN uv sync --frozen --no-dev

# Migrations run once in the dedicated release job before traffic promotion.
# Cloud SQL is attached by Cloud Run and AG47_DATABASE_URL is a Secret Manager binding.
CMD ["sh", "-c", "exec /app/.venv/bin/uvicorn ag47_radar.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
