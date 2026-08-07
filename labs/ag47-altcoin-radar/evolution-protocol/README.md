# AG47 Evolution Protocol Lab

Este diretório isola a documentação formal e teórica do **AG47 Evolution Protocol**.

## Organização do Laboratório

Atualmente, o **AG47 Altcoin Radar** serve como o útero e primeiro caso de uso prático deste protocolo. A divisão de responsabilidades é a seguinte:

1. **`.evolution/` (Raiz do Radar)**
   - É a instalação ativa (runtime environment) do laboratório. 
   - Contém os JSON Schemas, ferramentas de validação, fixtures de testes locais e, no futuro, o *Evolution Core Runtime*.

2. **`evolution-protocol/docs/` (Este diretório)**
   - É a biblioteca oficial do protocolo. Responde à pergunta *"Como qualquer software deveria evoluir sob as regras do AG47 Evolution Protocol?"*.
   - Contém o modelo conceitual, especificações de matrizes de estado, matriz de invariantes, mapeamentos relacionais e os relatórios de auditoria dos lotes de desenvolvimento.

3. **`docs/` (Raiz do Radar)**
   - Pertence exclusivamente ao domínio do Altcoin Radar.
   - Contém a arquitetura cripto, heurísticas, sprints do produto e contexto específico de trading.

## Roadmap de Extração
No futuro, após a implementação do CLI de Bootstrap, esta pasta `evolution-protocol/` se tornará um repositório autônomo, invertendo a dependência. O Altcoin Radar deixará de ser o host do protocolo e passará a ser apenas o seu primeiro "cliente" gerenciado.
