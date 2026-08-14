# Plano do Sprint 3: Inteligência, Eventos e Explicabilidade

## Objetivo Principal

> **Transformar o Radar de um visualizador de dados em um sistema que registra, explica e conta a história dos acontecimentos.**

O Sprint 3 deixará o Radar de ser apenas um dashboard passivo. Em vez de focarmos precocemente em infraestrutura de alta escala (Redis, Celery, Workers isolados), nosso foco será na **geração de valor direto para o usuário**. Ninguém compra infraestrutura, as pessoas compram a capacidade de entender a linha do tempo e o porquê de um ativo estar em destaque.

## Princípio Fundamental

> **Nenhuma informação descartada. Todo dado observado deve evoluir para conhecimento reutilizável.**

- Nunca apagar nada (apenas arquivar/agregar).
- Rastreabilidade total: Todo Snapshot, Evento, Signal e Knowledge possui um UUID único. O Organismo Cognitivo deve ser capaz de auditar qualquer conclusão retroativamente até a observação primária.

## Novos Conceitos Core (A Escada do Conhecimento)

1. **Snapshot:** Registra o estado bruto em um instante temporal (Ex: _Liquidez = 82k_).
2. **Evento (Event):** Registra a mudança de estado entre dois snapshots (Ex: _Liquidez caiu 22%_).
3. **Sinal (Signal):** Registra a interpretação transitória de um ou mais eventos (Ex: _Perda de força institucional_).
4. **Conhecimento (Knowledge):** Registra a conclusão e o padrão persistente do mercado (Ex: _Nos últimos 18 meses, esse padrão ocorreu 143 vezes, 74% terminaram em queda. Confidence: 91%_). O Organismo Cognitivo consome esta camada, e não os snapshots brutos.

Além da Escada do Conhecimento, temos:

- **Confidence Engine:** O `Score` (ex: 83) não existe no vácuo. Ele é acompanhado da Confiança (Confidence). O frontend exibirá o breakdown (`+18 Momentum`, faltam dados do `Github`).
- **Causalidade:** Eventos, Signals e Knowledge possuem o campo `caused_by` mapeando os UUIDs de origem.

## Ordem de Execução (Orientada a Valor)

Toda a ingestão continuará rodando de forma **local e simplificada** (Background Scheduler -> Task Runner interno -> Banco) até que a escala exija o contrário.

### Fase 1: Camada de Observação

- Evoluir o `TokenMarketSnapshot` (e de Risco/Social) para consultas Time-Series, transformando-a na base fundamental onde toda a inteligência começa.
- Garantir a persistência imutável de todas as observações com UUIDs fixos.

### Fase 2: Motor de Eventos e Signals

- Criar as tabelas `TokenEvent` e `TokenSignal`, suportando o campo `caused_by`.
- Fazer a pipeline disparar e persistir eventos comparando deltas temporais da Camada de Observação.

### Fase 3: Explicabilidade (Confidence & Breakdown)

- Refatorar a pipeline de scoring para gerar o `Confidence Score` e persistir a matriz de pesos e ausências.

### Fase 4: A Revolução da UI (Timeline)

- Implementar a principal view de valor: **Timeline**.
- Mesclar cronologia de eventos, interpretações (Signals), e causas, apresentando o "filme causal" do ativo.

### Fase 5: Alertas Básicos e Estrutura Knowledge

- Baseado na malha causal, disparar alertas na UI ao encontrar Signals críticos.
- (Draft) Desenhar o modelo da Tabela `Knowledge` para acumulação estruturada.
