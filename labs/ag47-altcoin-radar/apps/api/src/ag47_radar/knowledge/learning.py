import hashlib
import json
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.models import TokenHypothesis, TokenSignal

from .registry import registry


def _generate_hash(caused_by: list[dict[str, Any]]) -> str:
    """Gera um hash determinístico da causa para idempotência."""
    # Ordena pelo ID para garantir estabilidade caso a ordem mude
    sorted_causes = sorted(caused_by, key=lambda x: x.get("id", ""))
    serialized = json.dumps(sorted_causes, sort_keys=True)
    return hashlib.sha256(serialized.encode()).hexdigest()


async def process_signals_and_learn(
    db: AsyncSession, token_id: str, signals: list[TokenSignal], is_demo: bool = False
) -> list[TokenHypothesis]:
    """
    Pipeline de Ingestão de Conhecimento:
    1. Inferir Hipóteses a partir dos Sinais.
    2. Verificar idempotência.
    3. Atualizar estatísticas globais (GlobalKnowledge).
    4. Persistir a TokenHypothesis.
    """
    hypotheses_data = registry.infer_all(signals)
    created_hypotheses = []

    # Get the latest OpportunityScore for the token
    from ag47_radar.models import OpportunityScore

    score_stmt = (
        select(OpportunityScore)
        .where(OpportunityScore.token_id == token_id, OpportunityScore.is_demo == is_demo)
        .order_by(OpportunityScore.calculated_at.desc())
        .limit(1)
    )
    score_obj = (await db.execute(score_stmt)).scalars().first()
    score_val = float(score_obj.final_score) if score_obj else 5.0

    for h_data in hypotheses_data:
        h_data["token_id"] = token_id
        h_data["is_demo"] = is_demo

        # Save score in metadata_json
        if "metadata_json" not in h_data:
            h_data["metadata_json"] = {}
        h_data["metadata_json"]["score"] = score_val

        # Gerar hash para evitar duplicação (idempotência)
        caused_by_hash = _generate_hash(h_data["caused_by"])
        h_data["caused_by_hash"] = caused_by_hash

        # Verificar se já existe
        stmt = select(TokenHypothesis).where(
            TokenHypothesis.token_id == token_id,
            TokenHypothesis.hypothesis_type == h_data["hypothesis_type"],
            TokenHypothesis.rule_version == h_data["rule_version"],
            TokenHypothesis.caused_by_hash == caused_by_hash,
        )
        existing = (await db.execute(stmt)).scalars().first()
        if existing:
            continue

        hypothesis = TokenHypothesis(**h_data)
        db.add(hypothesis)
        created_hypotheses.append(hypothesis)

    await db.commit()
    return created_hypotheses
