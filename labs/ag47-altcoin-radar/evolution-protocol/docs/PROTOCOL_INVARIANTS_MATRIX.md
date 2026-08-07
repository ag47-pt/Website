# Protocol Invariants Matrix

Esta matriz classifica as regras absolutas (Invariantes) do protocolo e determina se a garantia estrutural reside puramente no **JSON Schema** (validação estática) ou se requer checagem de estado/negócio via **Runtime Engine**.

| Invariante (Regra) | Schemas Envolvidos | O JSON Schema garante? | O Runtime precisa garantir? |
|--------------------|--------------------|-----------------------|-----------------------------|
| **Executor não pode validar o próprio trabalho** | `role-definition`, `execution-report`, `integrity-verdict` | ❌ Não | ✅ Sim (Policy Engine/Validation) |
| **Mudança fora do Changeset é proibida** | `proposed-changeset`, `execution-report`, `evidence-item` | ❌ Não | ✅ Sim (Evidence Manager compara diffs) |
| **Conhecimento exige Evidência validada** | `knowledge-entry`, `integrity-verdict`, `evidence-bundle` | ⚠️ Parcialmente (`source_verdict_ref` é obrigatório) | ✅ Sim (Runtime valida se o veredito foi `PASS` e possui confiança mínima) |
| **Ponto de não-retorno requer Humano** | `policy-definition`, `human-action-record`, `workflow-definition` | ❌ Não | ✅ Sim (State Machine trava transição sem assinatura humana válida) |
| **Formato de Chaves e Metadados Padrão** | (Todos os Schemas) | ✅ Sim (`type`, `enum`, `additionalProperties: false`) | ❌ Não (O Parser rejeita antes) |
| **Nível de confiança deve ser normalizado** | `evidence-item`, `integrity-verdict`, `evolution-hypothesis` | ✅ Sim (`enum: [0.0, 0.25, 0.5, 0.75, 1.0]`) | ❌ Não |
| **ID do Actor deve existir no registro** | `actor-signature`, `role-definition` | ❌ Não (Valida só ser UUID) | ✅ Sim (Registry verifica a PK/UUID ativa) |
| **Decisão baseada em Hipótese Rejeitada** | `decision-context`, `evolution-hypothesis` | ❌ Não | ✅ Sim (Policy Engine avalia status do ref) |
| **Apenas transições de estado permitidas** | `workflow-definition`, `active-task` | ⚠️ Parcial (Schemas exigem arrays de ENUM) | ✅ Sim (State Machine confere validade da transição) |
| **Uso de Skill dentro de Scope válido** | `capability-policy`, `skill-definition`, `execution-report` | ❌ Não | ✅ Sim (Runtime aborta execução se fora do glob match) |

## Conclusões da Matriz
O mapeamento das invariantes prova que:
1. **JSON Schema** é a barreira contra **Alucinações Formais** (IA não pode inventar chaves, omitir metadados, ou furar escalas de avaliação).
2. O **Evolution Core Runtime** (Fase 4) não precisa entender *o que* a IA escreveu. Ele apenas avalia **Identidade, Permissão e Consistência Criptográfica** cruzando as referências (ex: O ID do ator no report bate com quem tinha o lock no workflow? A policy permite que esse ator de o lock?).
