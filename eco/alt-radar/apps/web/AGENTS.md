# AG47 Altcoin Radar Web

- Esta aplicação é isolada do Next.js da raiz e usa Next.js 16.2.6, App Router, React 19, TypeScript strict e Tailwind CSS 4.
- Antes de alterar APIs ou convenções do framework, leia o guia correspondente em `../../../../node_modules/next/dist/docs/` quando disponível.
- Preserve os contratos validados por Zod em `lib/api/schemas.ts`; alterações exigem coordenação com `apps/api`.
- Nunca introduza fixtures ou fallback silencioso no frontend. Dados demo devem vir identificados pela API.
- Métricas desconhecidas permanecem `null` e são exibidas como `N/D` ou `Desconhecido`, nunca como zero.
- O Sprint 1 é somente leitura em blockchain: sem carteira, seed, chave privada ou execução de transações.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
