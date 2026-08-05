import math
from decimal import Decimal


def calculate_historical_confidence(
    success_count: int, failure_count: int, neutral_count: int = 0
) -> Decimal:
    """
    Calcula a confiança estatística de um padrão com base no seu histórico.
    
    A fórmula pode usar uma variação do Laplace Smoothing ou Wilson Score Interval 
    para não dar 100% de confiança a um padrão que só ocorreu 1 vez (1 sucesso / 0 falhas).
    
    Para o Sprint 4, implementaremos um modelo simplificado com penalidade por baixa amostragem.
    """
    total_valid = success_count + failure_count
    if total_valid == 0:
        return Decimal("0.0000")
        
    raw_win_rate = success_count / total_valid
    
    # Penalidade de amostragem (quanto menor o 'total_valid', maior a penalidade)
    # Usando uma curva logarítmica simples para estabilizar por volta de 50 ocorrências
    sample_penalty = max(0.0, 1.0 - (math.log(total_valid + 1) / math.log(50)))
    
    # Ajusta o win_rate em direção a 50% (moeda justa) se a amostra for pequena
    adjusted_win_rate = raw_win_rate * (1 - sample_penalty) + 0.5 * sample_penalty
    
    # Converte para base 100
    confidence = Decimal(str(round(adjusted_win_rate * 100, 4)))
    
    return confidence
