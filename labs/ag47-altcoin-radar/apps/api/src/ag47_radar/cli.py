from __future__ import annotations

import argparse
import asyncio
import json
from typing import Any

from ag47_radar.config import get_settings
from ag47_radar.db import close_database, create_schema, get_session_factory
from ag47_radar.providers.registry import ProviderRegistry
from ag47_radar.services.ingestion import run_ingestion_cycle
from ag47_radar.services.seed import seed_demo_data, seed_global_rules


async def _init_db() -> None:
    await create_schema()
    await close_database()

async def _seed() -> None:
    counts = await seed_demo_data()
    rule_counts = await seed_global_rules()
    counts.update(rule_counts)
    print(json.dumps(counts, ensure_ascii=False, sort_keys=True))
    await close_database()


async def _ingest(limit: int) -> None:
    settings = get_settings()
    providers = ProviderRegistry(settings)
    try:
        async with get_session_factory()() as session:
            summary = await run_ingestion_cycle(session, settings, providers, limit=limit)
        print(
            json.dumps(
                {
                    "discovered": summary.discovered,
                    "persisted": summary.persisted,
                    "partial_failures": summary.partial_failures,
                },
                sort_keys=True,
            )
        )
    finally:
        await providers.close()
        await close_database()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="AG47 Altcoin Radar API operations")
    subcommands = parser.add_subparsers(dest="command", required=True)
    serve = subcommands.add_parser("serve", help="Run the FastAPI service")
    serve.add_argument("--host", default="127.0.0.1")
    serve.add_argument("--port", type=int, default=8000)
    serve.add_argument("--reload", action="store_true")
    subcommands.add_parser("init-db", help="Create schema directly for local fallback")
    subcommands.add_parser("seed", help="Idempotently seed explicit demo fixtures")
    ingest = subcommands.add_parser("ingest", help="Run one real provider ingestion cycle")
    ingest.add_argument("--limit", type=int, default=10)
    return parser


def main(argv: list[str] | None = None) -> Any:
    args = build_parser().parse_args(argv)
    if args.command == "serve":
        import uvicorn

        return uvicorn.run(
            "ag47_radar.main:app",
            host=args.host,
            port=args.port,
            reload=args.reload,
        )
    if args.command == "init-db":
        return asyncio.run(_init_db())
    if args.command == "seed":
        return asyncio.run(_seed())
    if args.command == "ingest":
        return asyncio.run(_ingest(args.limit))
    raise RuntimeError("Unknown command")


if __name__ == "__main__":
    main()
