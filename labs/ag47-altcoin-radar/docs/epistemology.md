# The Epistemology of AG47 Altcoin Radar

Este documento define o modelo mental e a arquitetura de construção de conhecimento do Radar.
Diferente de scanners comuns que apenas exibem dados estáticos, o AG47 Altcoin Radar possui um **Motor de Observação** desenhado para construir conhecimento estruturado, verificável e versionado.

## O Fluxo Epistemológico

O sistema observa o mercado e transforma dados brutos em conhecimento estatístico. Nada é descartado. Tudo evolui por uma "escada" de evidências.

```text
Snapshot -> Event -> Signal -> Hypothesis -> Truth -> Knowledge
```

### 1. Snapshot
*O que é:* O estado absoluto de um ativo em um momento exato.
*Características:* Retrato estático. Não contém interpretação.
*Exemplo:* `Liquidez = $1M`, `Preço = $1.50`.

### 2. Event
*O que é:* O delta (diferença) entre dois Snapshots. O registro de uma mudança.
*Características:* Fato matemático. Não contém interpretação.
*Exemplo:* `Liquidez subiu 30% em 5 minutos`.

### 3. Signal
*O que é:* A tradução de um Evento (ou conjunto deles) em um fenômeno reconhecido no mercado, observacionalmente defensável.
*Características:* Começa a ter domínio de negócio, mas não deve afirmar mais do que pode provar.
*Exemplo:* `Liquidez e Volume Expandiram (liquidity_volume_expansion)`. (Não deve ser chamado de "Entrada de Whale", pois isso já seria uma inferência).

### 4. Hypothesis
*O que é:* A inferência feita pelo sistema a partir de um ou mais Signals, aplicando um padrão do `PatternRegistry`.
*Características:* É uma tentativa de adivinhar o motivo ou o futuro. Pode estar certa ou errada.
*Exemplo:* `accumulation_suspected`. Acompanhada de um *Expected Outcome* (Ex: "Preço subirá > 5% em 24h").

### 5. Truth
*O que é:* O fato consolidado que julga a Hypothesis após o tempo decorrido.
*Características:* Imutável. Registra o que era esperado vs. o que de fato foi observado.
*Exemplo:* `Esperava > 5%. Observou -2%. Status: failure`.

### 6. Knowledge (GlobalKnowledge)
*O que é:* A memória do sistema. O acúmulo de estatísticas sobre todos os Truths gerados por um Padrão, dividido por contexto.
*Características:* Fluido (evolui). É o que o Organismo Cognitivo consome.
*Exemplo:* `O padrão "liquidity_volume_expansion" tem 81% de precisão em mercados Bull na rede Solana, mas apenas 40% em mercados Bear.`

---

## O Princípio Fundamental

> **Nenhuma informação é descartada.**
> Todo dado observado deve, sempre que possível, evoluir para conhecimento reutilizável. O ativo principal do sistema não é o dashboard, é a **memória construída**.

## Integração com o Organismo Cognitivo

O Radar é um **lóbulo especializado** da inteligência maior (Organismo). 
Quando o Organismo conversa com o Radar, ele **nunca** pergunta: *"O que você acha?"*
Ele pergunta: *"O que você sabe?"*

O Radar expõe o seu `Knowledge` contextualizado, permitindo que o Organismo tome decisões baseadas em experiência histórica comprovada (Truths consolidadas), não apenas em heurísticas hardcoded.
