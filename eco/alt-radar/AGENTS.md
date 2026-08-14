# AG47 Altcoin Radar — regras de trabalho

As regras do `AGENTS.md` da raiz Git continuam válidas neste produto.

## Next.js 16

- Antes de alterar `apps/web`, leia o guia pertinente em `apps/web/node_modules/next/dist/docs/`.
- Use App Router, TypeScript estrito e fronteiras Client Component apenas onde houver estado, eventos ou APIs do navegador.
- `next lint` não existe no Next 16; use o ESLint CLI e execute lint separadamente do build.

## Limites do Sprint 1

- O sistema é estritamente read-only em relação às blockchains.
- Não criar carteira, execução de ordens, seed phrase, chave privada, sniper, front-running ou automação de trade.
- Dados `demo` e `live` devem ter procedência visível e nunca podem ser combinados silenciosamente na mesma entidade.
- Valor ausente é `null`/desconhecido, nunca zero por conveniência.
- Toda alteração fica confinada a este diretório, salvo uma integração mínima e explicitamente documentada na raiz Git.

## Qualidade

- Preserve UTC no backend e converta para o timezone do utilizador na UI.
- Regras de scoring devem permanecer determinísticas, versionadas e cobertas por testes.
- Providers externos ficam atrás de contratos normalizados e precisam de timeout, retry seletivo, cache e proteção de circuito.
- Não registrar headers de autenticação, variáveis de ambiente ou payloads que possam conter segredos.
