# Sprint 4 (Invisível): O Motor de Conhecimento

## Objetivo

Construir o coração inteligente (e epistemológico) do projeto AG47 Altcoin Radar. Substituir a aplicação "Scanner Visual com Tabela" para um verdadeiro "Motor Observacional de Conhecimento", preparando o terreno para atuar como o **Lóbulo Especializado em Criptoativos** do Organismo Cognitivo.

## A Grande Decisão Arquitetural

Antes do Sprint 4, a aplicação observava o mercado, calculava `Eventos` e já desenhava uma `Timeline`, mas limitava-se a reportar o presente: _"Isso aconteceu"_. O problema central é que o Radar seria incapaz de saber se as suas inferências ou deduções provaram-se verdadeiras com o passar dos dias. Faltava a capacidade de aprender (acertar, errar, corrigir).

A estrutura epistemológica foi definida rigorosamente:
**`Snapshot -> Event -> Signal -> Hypothesis -> Validation -> Knowledge`**

## Ações Realizadas

### 1. Separação de Signal, Hypothesis e Knowledge

- **`TokenSignal`**: Observações factuais ("Houve um spike de Liquidez").
- **`TokenHypothesis`**: A interpretação da IA/Engine sobre o Signal ("Provável acumulação institucional" ou "Wash Trading").
- **`GlobalKnowledge`**: Uma entidade global transversal. Acumula estatísticas e Confidence Logarítmico sobre a validade geral de padrões observados (ex: Padrão A gera X% de sucesso histórico no protocolo).

### 2. O Motor de Validação (`validation.py`)

A maior inovação deste Sprint é a mecânica de validação em **T+24h**.
O script foi projetado para "voltar atrás" e consultar se a Hipótese levantada 24 horas antes _ganhou_, _perdeu_ ou gerou _erro_ (avaliando o PnL ou Posição do Token). Esse loop de retrospectiva calibra automaticamente a precisão (`confidence`) do Global Knowledge.

### 3. Padrões Matemáticos

- **Tolerância a Falsos Positivos**: Implementamos um decaimento estatístico (Logarithmic Confidence). Nenhuma Hipótese será considerada "99% Confiança" se existirem apenas 3 amostras na história. A matemática só habilita Confidence alto a partir de dezenas/centenas de instâncias observadas na mesma rede.

## Conclusão

Ao fim do Sprint 4, o Radar transformou-se oficialmente numa Máquina de Aprendizado Contínuo. Ele não gera Alertas estúpidos, mas gera Hipóteses que o tempo comprova ou destrói. O banco de dados agora está preparado para sustentar os "Alertas Determinísticos" que serão focados no usuário na Fase 5.
