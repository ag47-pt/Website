from __future__ import annotations

import argparse
import asyncio
import json
import sys
from collections.abc import Coroutine
from dataclasses import asdict
from typing import Any

from ag47_radar.config import get_settings
from ag47_radar.db import (
    close_database,
    create_schema,
    get_session_factory,
    run_transaction_with_retry,
)
from ag47_radar.providers.registry import ProviderRegistry
from ag47_radar.services.backtest import run_backtest
from ag47_radar.services.ingestion import run_ingestion_cycle
from ag47_radar.services.seed import seed_demo_data, seed_global_rules
from ag47_radar.worker import resolve_run_key, run_calibration_job, run_ingestion_job


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
        summary = await run_transaction_with_retry(
            get_session_factory(),
            run_ingestion_cycle,
            settings,
            providers,
            limit=limit,
        )
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


async def _worker_ingest(limit: int, run_key: str | None) -> None:
    settings = get_settings()
    resolved_run_key = resolve_run_key(run_key)
    providers = ProviderRegistry(settings)
    try:
        result = await run_ingestion_job(
            settings,
            providers,
            limit=limit,
            run_key=resolved_run_key,
        )
        print(json.dumps(asdict(result), ensure_ascii=False, sort_keys=True))
    finally:
        await providers.close()
        await close_database()


async def _worker_calibrate(run_key: str | None) -> None:
    settings = get_settings()
    resolved_run_key = resolve_run_key(run_key)
    try:
        result = await run_calibration_job(settings, run_key=resolved_run_key)
        print(json.dumps(asdict(result), ensure_ascii=False, sort_keys=True))
    finally:
        await close_database()


async def _backtest(horizon_hours: float, tolerance_hours: float, include_demo: bool) -> None:
    try:
        async with get_session_factory()() as session:
            report = await run_backtest(
                session,
                horizon_hours=horizon_hours,
                tolerance_hours=tolerance_hours,
                include_demo=include_demo,
            )
        print(
            json.dumps(
                {
                    "version": report.version,
                    "horizon_hours": report.horizon_hours,
                    "tolerance_hours": report.tolerance_hours,
                    "total_scores": report.total_scores,
                    "evaluated": report.evaluated,
                    "skipped_no_entry": report.skipped_no_entry,
                    "skipped_no_exit": report.skipped_no_exit,
                    "score_return_correlation": report.score_return_correlation,
                    "by_classification": {
                        name: {
                            "samples": summary.samples,
                            "hit_rate": summary.hit_rate,
                            "mean_return_pct": summary.mean_return_pct,
                            "median_return_pct": summary.median_return_pct,
                        }
                        for name, summary in report.by_classification.items()
                    },
                },
                ensure_ascii=False,
                sort_keys=True,
                indent=2,
            )
        )
    finally:
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
    worker = subcommands.add_parser("worker", help="Run a durable one-shot worker command")
    worker_commands = worker.add_subparsers(dest="worker_command", required=True)
    worker_ingest = worker_commands.add_parser(
        "ingest",
        help="Run one singleton, retry-idempotent real ingestion execution",
    )
    worker_ingest.add_argument("--limit", type=int, default=10)
    worker_ingest.add_argument("--run-key")
    worker_calibrate = worker_commands.add_parser(
        "calibrate",
        help="Run one singleton, retry-idempotent scoring calibration",
    )
    worker_calibrate.add_argument("--run-key")
    backtest = subcommands.add_parser(
        "backtest", help="Evaluate persisted scores against observed forward returns"
    )
    backtest.add_argument("--horizon-hours", type=float, default=24.0)
    backtest.add_argument("--tolerance-hours", type=float, default=6.0)
    backtest.add_argument("--include-demo", action="store_true")
    return parser


def _run_one_shot(command: Coroutine[Any, Any, None]) -> int:
    try:
        asyncio.run(command)
    except Exception as exc:
        print(
            json.dumps({"status": "failed", "error_type": type(exc).__name__}),
            file=sys.stderr,
        )
        return 1
    return 0


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
    if args.command == "worker" and args.worker_command == "ingest":
        return _run_one_shot(_worker_ingest(args.limit, args.run_key))
    if args.command == "worker" and args.worker_command == "calibrate":
        return _run_one_shot(_worker_calibrate(args.run_key))
    if args.command == "backtest":
        return asyncio.run(_backtest(args.horizon_hours, args.tolerance_hours, args.include_demo))
    raise RuntimeError("Unknown command")


if __name__ == "__main__":
    raise SystemExit(main())
