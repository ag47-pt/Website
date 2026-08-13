# AG47 Evolution Protocol — Landing Page

Landing page do **AG47 Evolution Protocol**, um protocolo aberto para evolução contínua de
software com agentes de IA, papéis especializados, skills, workflows, memória persistente e
validação baseada em evidências.

Este repositório contém **a página de apresentação** do protocolo, não a implementação do
protocolo em si.

---

## Stack

| Camada | Escolha |
|---|---|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| UI | React 19.2.4 |
| Estilo | Tailwind CSS v4 (CSS-first, sem `tailwind.config`) |
| Animação | Framer Motion 12 (via `LazyMotion` + `m.*`) |
| Ícones | Lucide React |
| Linguagem | TypeScript estrito |

## Executar localmente

Requer Node.js 22+ e npm.

```bash
npm install
```

```bash
npm run dev
```

A página fica disponível em `http://localhost:3000`. Para usar outra porta:

```bash
npm run dev -- -p 3005
```

## Scripts

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Serve o build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run evidence` | Executa lint, typecheck e build e grava `src/data/build-evidence.json` |

O script `evidence` alimenta a seção "Como esta página foi construída" com resultados reais
dos gates, em vez de uma lista estática de itens marcados como concluídos.

## Estrutura

```text
src/
├── app/          layout, página, estilos globais e rotas de metadata
├── components/
│   ├── layout/       header, rodapé, progresso de leitura
│   ├── sections/     uma seção por bloco do documento mestre
│   ├── diagrams/     diagramas vetoriais (sem imagens externas)
│   ├── interactive/  widgets com estado (máquina de estados, explorador)
│   └── ui/           primitivos reutilizáveis
├── data/         conteúdo tipado, separado do JSX
├── lib/          utilitários e orçamento de motion
└── types/        tipos compartilhados pelos módulos de data
```

### Convenções

- **Server Components por padrão.** `"use client"` só na folha interativa, nunca na seção
  inteira — a página inteira é prerenderizada estaticamente.
- **Conteúdo fora do JSX.** Textos vivem em `src/data/*.ts`, tipados por `src/types/content.ts`.
- **Ícones por chave.** Os dados carregam `icon: "workflow"` e `components/ui/Icon.tsx` resolve
  para o componente Lucide — os dados atravessam a fronteira servidor→cliente, então precisam
  ser serializáveis.
- **Motion centralizado.** Nenhum componente define animação ad-hoc; tudo vem de
  `src/lib/motion.ts`, que respeita `prefers-reduced-motion`.
- **Cor.** Âmbar e vermelho são reservados à semântica de estado (`BLOCKED`, `REGRESSION`,
  `REJECTED`) e nunca devem ser usados como cor decorativa.

## Processo

A página é construída pelo próprio ciclo que ela descreve. Cada sprint produz um relatório em
[`docs/sprints/`](./docs/sprints) com objetivos concluídos, arquivos alterados, decisões
arquiteturais, riscos e pendências, e para em um gate de validação humana.

## Configuração de URLs

`src/data/site.ts` é o ponto único de verdade para domínio canônico e URL do repositório.
Metadata, Open Graph, sitemap, robots e todos os CTAs derivam desse arquivo.
