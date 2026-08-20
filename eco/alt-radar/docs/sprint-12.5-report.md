# Relatório do Sprint 12.5: Social Provider Pré-Produção

> **Registro histórico:** as instruções de scheduler abaixo foram substituídas no Hardening 1 por Cloud Run Jobs externos. Consulte `acoes-do-dev.md` para o procedimento atual.

Este relatório encerra a etapa de transição e pavimenta o caminho para a ativação do Radar de Altcoins em produção. A base de código está preparada para ingerir dados sociais no ambiente produtivo.

## Resumo das Modificações

1. **Implementação Híbrida (`TelegramPublicSocialProvider`)**
   - Criada a estrutura no arquivo `ag47_radar/providers/social.py`.
   - Utilizado o `ResilientJsonClient` para garantir resiliência e controle de fluxo através de Circuit Breakers no acesso a APIs externas.
   - Configurado *Graceful Degradation*: se não houver token mapeável para chat, a heurística registra qualidade `UNKNOWN` e continua o fluxo sem causar erros.

2. **Roteador Social (`RoutingSocialProvider`)**
   - Adicionada a fachada de roteamento do Social no `ag47_radar/providers/registry.py`.
   - Se `AG47_DEMO_MODE=false`, o sistema automaticamente levanta a classe de roteamento e avalia o provedor público.

3. **Status e Observabilidade (`ProviderRegistry`)**
   - Atualizadas as métricas e o reset no Circuit Breaker para contemplar o *Social Provider*, permitindo seu monitoramento no endpoint `/api/v1/system/status`.

4. **Testes Unitários**
   - Adicionadas validações automatizadas em `tests/test_real_providers.py` cobrindo o fallback gracioso para garantir a estabilidade contra anomalias na rede externa.

5. **Infraestrutura (`.env.example`)**
   - Explicitadas chaves necessárias para a subida real:
     - `AG47_TELEGRAM_BOT_TOKEN`
     - `AG47_TELEGRAM_CHAT_ID`
     - `AG47_HELIUS_API_KEY`

---

## Próximos Passos (Ops/Admin)

Para iniciar a esteira produtiva do motor de conhecimento, um operador deve:
1. Clonar o `.env.example` para `.env` no ambiente de produção.
2. Inserir o **Bot Token** do Telegram para ativar tanto os Alertas quanto a consulta de grupos públicos.
3. Trocar a chave **AG47_DEMO_MODE=false** e habilitar **AG47_SCHEDULER_ENABLED=true**.

---

> **Status Final:** Sprint 12.5 concluído com sucesso. A base de código está homologada para ingestão social em produção.
