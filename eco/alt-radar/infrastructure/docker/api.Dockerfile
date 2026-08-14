FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY apps/api/pyproject.toml ./pyproject.toml
COPY apps/api/alembic.ini ./alembic.ini
COPY apps/api/alembic ./alembic
COPY apps/api/src ./src

RUN python -m pip install --upgrade pip && python -m pip install .

EXPOSE 8000

CMD ["sh", "-c", "python -m alembic upgrade head && python -m uvicorn ag47_radar.main:app --host 0.0.0.0 --port 8000"]

