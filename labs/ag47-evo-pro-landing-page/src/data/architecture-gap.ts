import type { IconName } from "@/types/content";

export interface ArchitectureColumn {
  id: string;
  title: string;
  icon: IconName;
  question: string;
  description: string;
  contents: string[];
  file: string;
  tone: "neutral" | "accent" | "info";
}

/**
 * Realidade, intenção e o caminho entre elas — em três documentos separados.
 * Misturar os três é como a deriva arquitetural começa.
 */
export const architectureColumns: ArchitectureColumn[] = [
  {
    id: "atual",
    title: "Arquitetura atual",
    icon: "architecture",
    question: "O que existe de fato?",
    description:
      "Reconstruída a partir do código, com grau de confiança por afirmação. Descreve o sistema como ele é hoje — inclusive as partes indefensáveis.",
    contents: [
      "Módulos e fronteiras reais",
      "Dependências efetivas",
      "Pontos sem cobertura de teste",
      "Lacunas de baixa confiança",
    ],
    file: ".evolution/architecture/current-architecture.md",
    tone: "neutral",
  },
  {
    id: "alvo",
    title: "Arquitetura alvo",
    icon: "target",
    question: "O que o produto pretende atingir?",
    description:
      "Declarada por decisão humana, nunca inferida do código. É intenção, e o protocolo a trata como tal até que vire realidade verificável.",
    contents: [
      "Fronteiras pretendidas",
      "Princípios inegociáveis",
      "Decisões registradas em ADR",
      "Restrições de negócio",
    ],
    file: ".evolution/architecture/target-architecture.md",
    tone: "accent",
  },
  {
    id: "gap",
    title: "Gap arquitetural",
    icon: "planning",
    question: "Qual o caminho entre os dois?",
    description:
      "A diferença explícita, priorizada e fatiada em incrementos. É daqui que o Observador tira a proposta do próximo ciclo.",
    contents: [
      "Distâncias mensuráveis",
      "Risco de cada movimento",
      "Ordem sugerida de ataque",
      "O que exige decisão humana",
    ],
    file: ".evolution/architecture/architecture-gap.md",
    tone: "info",
  },
];
