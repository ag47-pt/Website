# The Epistemology of AG47 Altcoin Radar

Este documento define o modelo mental e a arquitetura de construção de conhecimento do Radar.
Diferente de scanners comuns que apenas exibem dados estáticos, o AG47 Altcoin Radar possui um **Motor de Observação** desenhado para construir conhecimento estruturado, verificável e versionado.

## O Fluxo Epistemológico

O sistema observa o mercado e transforma dados brutos em conhecimento estatístico. Nada é descartado. Tudo evolui por uma "escada" de evidências.

```text
Snapshot -> Event -> Signal -> Hypothesis -> Truth -> Knowledge
```

### 1. Snapshot

_O que é:_ O estado absoluto de um ativo em um momento exato.
_Características:_ Retrato estático. Não contém interpretação.
_Exemplo:_ `Liquidez = $1M`, `Preço = $1.50`.

### 2. Event

_O que é:_ O delta (diferença) entre dois Snapshots. O registro de uma mudança.
_Características:_ Fato matemático. Não contém interpretação.
_Exemplo:_ `Liquidez subiu 30% em 5 minutos`.

### 3. Signal

_O que é:_ A tradução de um Evento (ou conjunto deles) em um fenômeno reconhecido no mercado, observacionalmente defensável.
_Características:_ Começa a ter domínio de negócio, mas não deve afirmar mais do que pode provar.
_Exemplo:_ `Liquidez e Volume Expandiram (liquidity_volume_expansion)`. (Não deve ser chamado de "Entrada de Whale", pois isso já seria uma inferência).

### 4. Hypothesis

_O que é:_ A inferência feita pelo sistema a partir de um ou mais Signals, aplicando um padrão do `PatternRegistry`.
_Características:_ É uma tentativa de adivinhar o motivo ou o futuro. Pode estar certa ou errada.
_Exemplo:_ `accumulation_suspected`. Acompanhada de um _Expected Outcome_ (Ex: "Preço subirá > 5% em 24h").

### 5. Truth

_O que é:_ O fato consolidado que julga a Hypothesis após o tempo decorrido.
_Características:_ Imutável. Registra o que era esperado vs. o que de fato foi observado.
_Exemplo:_ `Esperava > 5%. Observou -2%. Status: failure`.

### 6. Knowledge (GlobalKnowledge)

_O que é:_ A memória do sistema. O acúmulo de estatísticas sobre todos os Truths gerados por um Padrão, dividido por contexto.
_Características:_ Fluido (evolui). É o que o Organismo Cognitivo consome.
_Exemplo:_ `O padrão "liquidity_volume_expansion" tem 81% de precisão em mercados Bull na rede Solana, mas apenas 40% em mercados Bear.`

---

## O Princípio Fundamental

> **Nenhuma informação é descartada.**
> Todo dado observado deve, sempre que possível, evoluir para conhecimento reutilizável. O ativo principal do sistema não é o dashboard, é a **memória construída**.

## Integração com o Organismo Cognitivo

O Radar é um **lóbulo especializado** da inteligência maior (Organismo).
Quando o Organismo conversa com o Radar, ele **nunca** pergunta: _"O que você acha?"_
Ele pergunta: _"O que você sabe?"_

O Radar expõe o seu `Knowledge` contextualizado, permitindo que o Organismo tome decisões baseadas em experiência histórica comprovada (Truths consolidadas), não apenas em heurísticas hardcoded.
