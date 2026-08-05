# Backtesting do score (backtest-v1)

Avalia os `OpportunityScore` persistidos contra retornos futuros observados nos `MarketSnapshot`s reais. Nenhum dado é fabricado: um score sem snapshot de entrada ou de saída dentro da tolerância é reportado como `skipped`, nunca interpolado.

## Método

1. Para cada score, o preço de entrada é o snapshot mais recente até `calculated_at` (tolerância padrão: 6h).
2. O preço de saída é o primeiro snapshot após `calculated_at + horizonte` (padrão: 24h), dentro da mesma tolerância.
3. O retorno futuro (`forward_return_pct`) é agregado por classificação: amostras, hit rate (retorno > 0), média e mediana.
4. Correlação de Pearson entre `final_score` e retorno (mínimo de 3 amostras).

Dados demo são excluídos por padrão (`--include-demo` para incluí-los explicitamente, útil apenas para validar o pipeline).

## Execução

```bash
python -m ag47_radar.cli backtest --horizon-hours 24 --tolerance-hours 6
```

Saída em JSON com versão do backtest, contagens de avaliados/pulados, correlação e resumo por classificação.

## Limitações conhecidas

- Requer histórico real de snapshots com o scheduler ativo; sem histórico, todos os scores são `skipped_no_entry`/`skipped_no_exit`.
- O retorno é medido no par com snapshot disponível, sem custo de execução, slippage ou taxas.
- A calibração de pesos a partir dos resultados permanece deliberadamente manual (sem ML prematuro).
