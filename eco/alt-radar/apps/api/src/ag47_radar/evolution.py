"""Estado do Motor de Evolução da plataforma.

Fonte de verdade única para a UI e integrações. Atualizar a cada virada
de sprint, em conjunto com docs/next-sprints.md.
"""

from __future__ import annotations

from ag47_radar.schemas import EvolutionStatusRead

EVOLUTION_STATUS = EvolutionStatusRead(
    phase="Hardening 1",
    phase_title="Estabilização operacional da beta pública",
    now=(
        "Verdade operacional, ingestão durável, gates de qualidade e entrega "
        "reprodutível sem ampliar o escopo observacional."
    ),
    completed_steps=4,
    total_steps=5,
    goal="Lóbulo Observacional do Organismo Cognitivo",
)
