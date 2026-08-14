# Modelo de scoring v1

## Fórmula

Todos os sub-scores variam de 0 a 10.

```text
final_score =
    momentum_score     * 0.25
  + liquidity_score    * 0.20
  + community_score    * 0.15
  + distribution_score * 0.15
  + safety_score       * 0.20
  + data_quality_score * 0.05
```

`risk_score` cresce com o risco. `safety_score` cresce com a segurança e, quando existe avaliação de risco suficiente, começa em `10 - risk_score`. As duas direções nunca são misturadas.

## Normalização inicial

- Momentum: combina variações de preço recentes e aceleração de volume com limites para outliers.
- Liquidez: usa faixas logarítmicas de liquidez USD e penaliza pools muito jovens sem confirmação.
- Comunidade: considera crescimento, autores, participação, repetição e bot ratio somente quando esses sinais existem.
- Distribuição: parte da concentração dos maiores holders/deployer; desconhecido não recebe nota segura.
- Segurança: inverte risco conhecido e aplica flags de permissões, honeypot, mint, blacklist, proxy e taxas.
- Qualidade: deriva da completude, atualidade e procedência dos providers.

Valores monetários usam `Decimal` no domínio. O arredondamento do score final acontece somente na saída/persistência definida pelo algoritmo.

## Classificação

|    Score | Classificação      |
| -------: | ------------------ |
| 8.0–10.0 | Oportunidade forte |
|  6.5–7.9 | Observar           |
|  5.0–6.4 | Especulativo       |
|  0.0–4.9 | Risco elevado      |

Uma flag crítica impede `Oportunidade forte`, independentemente do score numérico. O valor numérico permanece visível para auditoria; a classificação é rebaixada para `Observar` e a explicação identifica o bloqueio.

## Confiança e sinais ausentes

A confiança considera a razão entre sinais válidos e sinais esperados, a qualidade declarada pelas fontes e a atualidade. Ausência:

- reduz confiança;
- reduz o sub-score afetado para uma base conservadora ou o torna indisponível conforme o contrato;
- adiciona um fator negativo/pendência;
- nunca é interpretada como segurança.

O número de sinais disponíveis e a confiança são exibidos separadamente do score. Assim, `8.0 com confiança baixa` não aparenta equivaler a `8.0 com cobertura completa`.

## Explicabilidade

Cada cálculo armazena:

- seis sub-scores;
- score final e classificação derivada;
- confiança e quantidade de sinais;
- explicação curta;
- fatores positivos e negativos;
- flags críticas consideradas;
- `scoring_version`.

## Versionamento

O Sprint 1 usa `ag47-score-v1`. Mudanças de peso, normalização ou gates exigem nova versão; scores históricos não são recalculados silenciosamente. Backtesting e calibração ficam para sprint futuro.
