from __future__ import annotations

import asyncio
from typing import Any

import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.db import get_session_factory, run_transaction_with_retry
from ag47_radar.models import Token, TokenHypothesis, TokenTruth, utc_now


@pytest.mark.asyncio
async def test_concurrency_stress_50_parallel_writes(db_session: AsyncSession) -> None:
    session_factory = get_session_factory()

    # Create a base token
    async with session_factory() as session:
        token = Token(
            chain="solana",
            contract_address="StressToken1111111111111111111111111111111",
            symbol="STRESS",
            name="Stress Test Token",
            source="test",
            is_demo=True,
        )
        session.add(token)
        await session.commit()
        token_id = token.id

    async def worker_write_hypothesis_and_truth(worker_idx: int) -> dict[str, Any]:
        async def _transactional_work(session: AsyncSession) -> dict[str, Any]:
            hypothesis = TokenHypothesis(
                token_id=token_id,
                hypothesis_type=f"concurrency_type_{worker_idx % 5}",
                confidence=0.85,
                rule_version="stress-v1",
                caused_by_hash=f"hash_{worker_idx}_{utc_now().timestamp()}",
                is_demo=True,
            )
            session.add(hypothesis)
            await session.flush()

            truth = TokenTruth(
                token_id=token_id,
                hypothesis_id=hypothesis.id,
                expected_outcome={"target_price": 100},
                observed_outcome={"final_price": 110},
                gain=10.0,
                status="success" if worker_idx % 2 == 0 else "failure",
                is_demo=True,
            )
            session.add(truth)
            await session.commit()

            return {"hypothesis_id": hypothesis.id, "truth_id": truth.id}

        return await run_transaction_with_retry(
            session_factory,
            _transactional_work,
            max_retries=5,
            initial_backoff=0.01,
        )

    # Launch 50 concurrent tasks
    tasks = [worker_write_hypothesis_and_truth(i) for i in range(50)]
    results = await asyncio.gather(*tasks, return_exceptions=False)

    assert len(results) == 50

    # Verify all 50 hypotheses and truths were persisted correctly
    async with session_factory() as session:
        hypotheses_stmt = select(TokenHypothesis).where(TokenHypothesis.token_id == token_id)
        hypotheses = (await session.scalars(hypotheses_stmt)).all()

        truths_stmt = select(TokenTruth).where(TokenTruth.token_id == token_id)
        truths = (await session.scalars(truths_stmt)).all()

        assert len(hypotheses) == 50
        assert len(truths) == 50
