"""Estado do Motor de Evolução da plataforma.

Fonte de verdade única para a UI e integrações. Atualizar a cada virada
de sprint, em conjunto com docs/next-sprints.md.
"""

from __future__ import annotations

from ag47_radar.schemas import EvolutionStatusRead

EVOLUTION_STATUS = EvolutionStatusRead(
    phase="Sprint 7",
    phase_title="Infraestrutura de Produção e Ingestão Contínua",
    now=(
        "Configuração de suporte PostgreSQL, ativação do background scheduler e "
        "loop autônomo de ingestão/TruthEngine."
    ),
    completed_steps=6,
    total_steps=8,
    goal="Lóbulo Observacional do Organismo Cognitivo",
)
