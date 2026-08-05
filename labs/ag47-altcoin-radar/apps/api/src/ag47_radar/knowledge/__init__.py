"""
Knowledge Engine para o AG47 Altcoin Radar.

Este módulo é responsável por inferir Hipóteses a partir de Sinais, consolidar 
Estatísticas Globais, e construir o Grafo de Evidências (Evidence Graph) 
para consumo pelo Meta-Cognitive Operating System (MCOS).
"""

from .learning import process_signals_and_learn
from .registry import registry
from .validation import validate_historical_hypotheses

__all__ = [
    "process_signals_and_learn",
    "validate_historical_hypotheses",
]
