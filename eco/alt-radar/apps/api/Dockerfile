FROM python:3.12-slim

# Install uv for fast dependency management
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Add standard dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
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
CMD ["sh", "-c", "uv run alembic upgrade head && uv run uvicorn ag47_radar.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
