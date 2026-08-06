# Plano do Sprint 8: Alertas Determinísticos de Edge & Inbox do Operador

## Objetivo Principal

> **Entregar sinais acionáveis baseados estritamente em Edge provado (taxa de acerto estatística histórica $\ge 65\%$), com painel de Inbox do Operador e Matriz de Correlação Score vs Resultado Real.**

---

## 🎯 Pilares de Implementação

### Pilar 1: Filtro de Disparo por Edge Estatístico Auditado
1. **Regra de Disparo:**
   - Alertas serão emitidos **apenas** quando a hipótese pertencer a um bucket de score cuja win rate histórica (`historical_confidence`) no `GlobalKnowledge` seja $\ge 0.65$ com amostra mínima significativa.
2. **Back-end Integration:**
   - Atualizar `apps/api/src/ag47_radar/services/alerts.py` para consultar `GlobalKnowledge` antes de enviar notificações.

### Pilar 2: Inbox do Operador na UI
1. **Painel de Oportunidades com Edge:**
   - Criar visualização de Inbox centralizando alertas com tag de nível de confiança estatística.
2. **Matriz de Correlação:**
   - Gráfico/tabela comparando `OpportunityScore` projetado versus a taxa de retorno real auditada pelo `Truth Engine`.

---

## ⚖️ Decisões de Design & Regras de Negócio Consolidadas

1. **Amostra Mínima Significativa**: Exigido um volume de no mínimo **30 hipóteses resolvidas** em um bucket de score para que o cálculo estatístico seja válido.
2. **Tratamento de Cold Start**: Se o bucket de score possuir menos de 30 amostras, o alerta será enviado com classificação de confiança **"Indeterminada (Amostra Insuficiente)"** em vez de ser bloqueado.
3. **Métrica de Drawdown Aceitável**: Definida como o limite de no máximo **3 falhas consecutivas** de hipóteses no mesmo bucket. Exceder esse limite suspende temporariamente os alertas do bucket até a calibração do score.
4. **Matriz de Correlação na UI**: Exibida como uma **tabela matricial pura/customizada (CSS Grid/Heatmap)** que mapeia faixas de score (ex: 0-20, 21-40...) versus a taxa de acerto e retorno médio real, sem adicionar dependências externas de gráficos ao Next.js 16.

---

## 🛠️ Roteiro de Execução

1. **Modelos e Migrações (se aplicável)**:
   - Adicionar atributos necessários em `TokenAlert` se precisarmos rastrear a confiança no momento do disparo.
2. **Back-end**:
   - Ajustar `alerts.py` para calcular/consultar a confiança histórica e aplicar a lógica de bloqueio por drawdown e filtro de Edge de 65%.
   - Implementar o endpoint `/api/v1/alerts/edge-inbox` com paginação, filtros por nível de confiança e dados de correlação de score.
3. **Front-end (Next.js 16)**:
   - Criar a página de Inbox do Operador integrando os novos endpoints.
   - Criar componente de Matriz de Correlação (Heatmap customizado).
4. **Testes**:
   - Cobertura de testes unitários para a lógica de filtragem de alertas por Edge e comportamento de cold start.
