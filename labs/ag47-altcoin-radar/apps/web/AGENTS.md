# AG47 Altcoin Radar Web

- Esta aplicação é isolada do Next.js da raiz e usa Next.js 16.2.6, App Router, React 19, TypeScript strict e Tailwind CSS 4.
- Antes de alterar APIs ou convenções do framework, leia o guia correspondente em `../../../../node_modules/next/dist/docs/` quando disponível.
- Preserve os contratos validados por Zod em `lib/api/schemas.ts`; alterações exigem coordenação com `apps/api`.
- Nunca introduza fixtures ou fallback silencioso no frontend. Dados demo devem vir identificados pela API.
- Métricas desconhecidas permanecem `null` e são exibidas como `N/D` ou `Desconhecido`, nunca como zero.
- O Sprint 1 é somente leitura em blockchain: sem carteira, seed, chave privada ou execução de transações.
