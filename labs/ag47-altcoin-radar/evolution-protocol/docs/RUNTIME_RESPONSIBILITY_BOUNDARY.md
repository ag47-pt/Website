# Evolution Kernel: Runtime Responsibility Boundary

O **Evolution Kernel** (Fase Lote 4) é o "sistema nervoso central" do protocolo. Sua responsabilidade é puramente burocrática e jurídica. Ele não toma decisões cognitivas; ele apenas avalia fatos apresentados contra os contratos (schemas e policies) previamente firmados e assina a autorização (`ALLOW` ou `DENY`).

Para impedir o crescimento desordenado e a confusão entre Governo (Kernel) e Inteligência (Agentes/Cérebro), as seguintes delimitações são impostas e inegociáveis:

## O que o Kernel FAZ (Atribuições)

✅ **Validação Estrutural e Criptográfica:** O Kernel avalia se os objetos JSON seguem as regras do JSON Schema Draft 2020-12 e verifica a integridade de hashes.
✅ **Controle da Máquina de Estados:** O Kernel garante que um `active-task` só avance para o status seguinte caso todas as condições de transição exigidas pelo `workflow-definition` sejam atendidas.
✅ **Aplicação de Políticas e Permissões:** O Kernel avalia cruzamentos de `role-definition`, `capability-policy` e `policy-definition` para impedir transições e ações ilegais.
✅ **Cartório de Artefatos (Registry):** O Kernel emite as chaves `ref_id` (como UUIDs) para garantir unicidade e travar falsificações.
✅ **Geração de Eventos e Blocos de Status:** O Kernel processa as requisições de transição do mundo externo e devolve uma decisão determinística e imutável.

## O que o Kernel NÃO FAZ (Muros Intransponíveis)

❌ **Geração ou Interpretação de Código:** O Kernel não edita `.py`, `.js`, nem compila artefatos de lógica de negócios da aplicação host.
❌ **Decisões Arquiteturais ou Cognitivas:** O Kernel não decide se a escolha de adicionar *Telegram Auth* é boa ou ruim. Ele apenas verifica se quem propôs tinha autorização para propor.
❌ **Chamadas Obrigatórias para LLMs:** O Kernel é um motor de processamento lógico de chaves e grafos de estado. Um sistema sem IA deve ser capaz de operar o Kernel integralmente utilizando inputs manuais.
❌ **Substituição de Ação Humana:** O Kernel não sobrepõe a restrição de "Aprovação Humana" prevista numa política. O bloqueio é absoluto.
❌ **Geração de Evidências ou Conhecimento:** O Kernel não realiza testes E2E. Ele recebe o resultado do teste gerado pelo executor/validator e verifica se a formatação (Evidence Bundle) está intacta, delegando o mérito cognitivo às regras predefinidas ou agentes acoplados.
