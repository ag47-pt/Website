import type { TreeNode } from "@/types/content";

/**
 * ATENÇÃO — as duas árvores abaixo são ESPECIFICAÇÃO, não um retrato de um
 * repositório existente. O protocolo ainda está em construção pública, e
 * apresentá-las como estado atual contradiria o princípio de evidência que a
 * própria §16 defende. A interface deve rotulá-las como tal.
 */

/** Estrutura especificada do repositório do protocolo. */
export const protocolTree: TreeNode[] = [
  {
    id: "root",
    name: "ag47-evolution-protocol/",
    kind: "dir",
    description: "Raiz do protocolo. Tudo aqui é versionado e revisável como código.",
    children: [
      {
        id: "readme",
        name: "README.md",
        kind: "file",
        description: "Porta de entrada: o que é o protocolo e como adotá-lo.",
      },
      {
        id: "license",
        name: "LICENSE",
        kind: "file",
        description: "Licença aberta — condição para o protocolo ser adotável fora da AG47.",
      },
      {
        id: "engine",
        name: "engine/",
        kind: "dir",
        description:
          "O motor. Não conhece linguagens nem frameworks: só orquestra papéis, estados e políticas.",
        children: [
          {
            id: "orchestrator",
            name: "orchestrator/",
            kind: "dir",
            description: "Decide qual papel age em cada momento, segundo o workflow ativo.",
          },
          {
            id: "state-machine",
            name: "state-machine/",
            kind: "dir",
            description: "Guarda as transições válidas e recusa as que violam contrato.",
          },
          {
            id: "policy-engine",
            name: "policy-engine/",
            kind: "dir",
            description: "Avalia políticas antes de permitir uma ação — o freio do sistema.",
          },
          {
            id: "skill-registry",
            name: "skill-registry/",
            kind: "dir",
            description: "Descobre, valida e versiona as skills disponíveis.",
          },
          {
            id: "evidence",
            name: "evidence/",
            kind: "dir",
            description: "Coleta e assina os artefatos que sustentam cada afirmação.",
          },
          {
            id: "gates",
            name: "gates/",
            kind: "dir",
            description: "Executa as verificações determinísticas e captura o código de saída.",
          },
          {
            id: "providers",
            name: "providers/",
            kind: "dir",
            description: "Adaptadores de modelo — é o que torna o protocolo independente de LLM.",
          },
        ],
      },
      {
        id: "roles",
        name: "roles/",
        kind: "dir",
        description:
          "Um diretório por papel, com autoridade, limites e prompts versionados separadamente.",
      },
      {
        id: "skills",
        name: "skills/",
        kind: "dir",
        description: "Capacidades reutilizáveis, agrupadas por domínio.",
      },
      {
        id: "workflows",
        name: "workflows/",
        kind: "dir",
        description: "Bootstrap, evolução, validação, recuperação e adoção — em YAML.",
      },
      {
        id: "policies",
        name: "policies/",
        kind: "dir",
        description:
          "Autonomia segura, acesso ao repositório, orçamento de mudança, gates de aprovação e ações proibidas.",
      },
      {
        id: "schemas",
        name: "schemas/",
        kind: "dir",
        description:
          "Contratos JSON de estado, plano, execução, validação, evidência e ação humana.",
      },
      {
        id: "cli",
        name: "cli/",
        kind: "dir",
        description: "Interface de linha de comando — o protocolo não depende de IDE.",
      },
      {
        id: "adapters",
        name: "adapters/",
        kind: "dir",
        description: "Integrações com Git, CI e ferramentas externas.",
      },
      {
        id: "examples",
        name: "examples/",
        kind: "dir",
        description: "Projetos de referência com o protocolo já em operação.",
      },
    ],
  },
];

/** Estrutura que o protocolo cria dentro de cada projeto adotante. */
export const evolutionTree: TreeNode[] = [
  {
    id: "evo-root",
    name: ".evolution/",
    kind: "dir",
    description:
      "A memória do projeto. Vive dentro do repositório, versionada junto do código — não em um serviço externo.",
    children: [
      {
        id: "evo-constitution",
        name: "constitution.md",
        kind: "file",
        description:
          "Princípios inegociáveis do projeto. Alterá-los exige decisão humana explícita.",
      },
      {
        id: "evo-state",
        name: "project-state.json",
        kind: "file",
        description: "Onde cada item de trabalho está agora, na máquina de estados.",
      },
      {
        id: "evo-baseline",
        name: "baseline.json",
        kind: "file",
        description:
          "Fotografia de qualidade usada para detectar regressão. Sem ela, não há como provar perda.",
      },
      {
        id: "evo-arch",
        name: "architecture/",
        kind: "dir",
        description: "Arquitetura atual, alvo e o gap entre elas — em três documentos separados.",
        children: [
          {
            id: "evo-arch-current",
            name: "current-architecture.md",
            kind: "file",
            description: "O que existe de fato, com grau de confiança por afirmação.",
          },
          {
            id: "evo-arch-target",
            name: "target-architecture.md",
            kind: "file",
            description: "O que se pretende atingir. Declarado por humano, nunca inferido.",
          },
          {
            id: "evo-arch-gap",
            name: "architecture-gap.md",
            kind: "file",
            description: "A distância entre os dois, priorizada e fatiada em incrementos.",
          },
        ],
      },
      {
        id: "evo-roadmap",
        name: "roadmap/",
        kind: "dir",
        description: "Planos de sprint propostos, aprovados e encerrados.",
      },
      {
        id: "evo-evidence",
        name: "evidence/",
        kind: "dir",
        description: "Relatórios de execução e validação com os artefatos que os sustentam.",
      },
      {
        id: "evo-policies",
        name: "policies/",
        kind: "dir",
        description: "Políticas locais, que restringem ainda mais as do protocolo.",
      },
      {
        id: "evo-history",
        name: "history/",
        kind: "dir",
        description:
          "O que já foi tentado, o que falhou e por quê. É o que impede repetir o mesmo erro.",
      },
      {
        id: "evo-human",
        name: "human-actions/",
        kind: "dir",
        description: "O Human Action Registry: tudo que depende de pessoa, com status e validação.",
      },
    ],
  },
];
