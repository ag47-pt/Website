"""Estado do Motor de Evolução da plataforma.

Fonte de verdade única para a UI e integrações. Atualizar a cada virada
de sprint, em conjunto com docs/next-sprints.md.
"""

from __future__ import annotations

from ag47_radar.schemas import EvolutionStatusRead

EVOLUTION_STATUS = EvolutionStatusRead(
    phase="Sprint 11",
    phase_title="Webhook Outbound Assinado, Painel Multi-Chain e Exportação Epistemológica",
    now=(
        "Monitoramento de desempenho teórico, PNL simulado e métricas de "
        "Paper Trading sem exposição financeira real."
    ),
    completed_steps=10,
    total_steps=12,
    goal="Lóbulo Observacional do Organismo Cognitivo",
)
