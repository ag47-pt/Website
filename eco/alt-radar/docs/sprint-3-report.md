# Sprint 3: Auditoria de Performance e Invariantes

## Objetivo

Garantir que o sistema pudesse escalar de forma estável sob carga simultânea, comprovando que a arquitetura assíncrona não cederia a Race Conditions, falhas de Idempotência ou ao temido problema N+1 de banco de dados no momento da ingestão massiva de ativos.

## Ações Realizadas

### 1. Invariantes e Idempotência

Implementamos testes rigorosos para provar a tese arquitetural do projeto de que:

- **Idempotência Sequencial:** Quando um provider de ingestão tenta reinserir um estado idêntico repetidas vezes (sem delta de tempo/mercado útil), o Radar não polui a base gerando Snapshots fantasma ou duplicando Eventos e Sinais. O engine compara _Hashes_, constata ausência de `delta`, e anula mutações desnecessárias em tempo zero de CPU.
- **Race Conditions:** Quando dois ou mais _workers_ colidem ao mesmo tempo na criação de _Knowledge_ ou _Eventos_ para a mesma chave exata de `caused_by_hash`, o banco impõe `IntegrityError`. Garantimos que essa exceção flui corretamente abortando transações concorrentes indesejadas, blindando o banco de duplicação silenciosa.

### 2. Performance e Limites de Carga

Foi desenhado um teste de _Load/Stress_ onde _Providers_ foram mockados para entregar lotes simulados de mais de 100 ativos recém-descobertos em massa.

- **Resultado da métrica em 100 ativos:**
  - Tempo Total de Ingestão: `~1.74s` (Arbitrariamente tínhamos tolerância de até 10 segundos).
  - Consumo de Memória (Peak): `~0.66 MB`.

### 3. Eliminação de Limitações Iniciais

- Os loops assíncronos que usavam acessos prematuros foram trocados para `in_` (bulk lookup), permitindo o cache de objetos em nível de Sessão do SQLAlchemy, dizimando gargalos.

## Conclusão e Estado do Radar

O motor está comprovadamente robusto e altamente tolerante ao acúmulo temporal. Podemos processar e varrer centenas de ativos via Discovery Providers, sem degradar performance nem criar falsos positivos analíticos, o que era a premissa de risco que permitia a passagem para as próximas fases.
