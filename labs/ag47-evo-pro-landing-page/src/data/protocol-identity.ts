import type { IconName } from "@/types/content";

export interface Negation {
  label: string;
  detail: string;
}

/** O que o protocolo não é — delimita o conceito antes de defini-lo. */
export const negations: Negation[] = [
  {
    label: "um agente",
    detail: "Agentes são executores dentro do protocolo, não o protocolo.",
  },
  {
    label: "um prompt",
    detail: "A inteligência fica em papéis, políticas e estados — não em um texto gigante.",
  },
  {
    label: "uma IDE",
    detail: "Roda em qualquer editor, ou em nenhum, sem depender de integração gráfica.",
  },
  {
    label: "um framework de automação",
    detail: "Não encadeia tarefas: define autoridade, evidência e condições de parada.",
  },
  {
    label: "um gerador de código",
    detail: "Gerar código é uma etapa. Preservar conhecimento validado é o objetivo.",
  },
];

export interface Attribute {
  id: string;
  title: string;
  icon: IconName;
  description: string;
}

export const attributes: Attribute[] = [
  {
    id: "ide",
    title: "Independente de IDE",
    icon: "ide",
    description:
      "O estado vive em arquivos versionados do repositório. Nenhuma funcionalidade depende de um editor específico estar aberto.",
  },
  {
    id: "llm",
    title: "Independente de LLM",
    icon: "llm",
    description:
      "Papéis e políticas definem o que pode ser feito. O modelo por trás de cada papel é substituível sem reescrever o processo.",
  },
  {
    id: "linguagem",
    title: "Independente de linguagem",
    icon: "language",
    description:
      "O núcleo não conhece linguagens. O conhecimento específico de stack vive em skills, que são adicionadas conforme a necessidade.",
  },
  {
    id: "evidencia",
    title: "Baseado em evidência",
    icon: "evidence",
    description:
      "Toda afirmação relevante aponta para artefatos verificáveis: arquivos, saídas de teste, resultados de gate.",
  },
  {
    id: "auditavel",
    title: "Auditável",
    icon: "auditable",
    description:
      "Cada transição de estado registra quem propôs, quem validou, com base em quê e quando — em histórico legível.",
  },
  {
    id: "extensivel",
    title: "Extensível",
    icon: "extensible",
    description:
      "Skills, workflows e políticas são declarativos. Estender o protocolo não exige alterar o motor.",
  },
  {
    id: "governado",
    title: "Governado",
    icon: "governed",
    description:
      "Limites operacionais são explícitos e verificáveis por máquina, não recomendações escritas em prosa.",
  },
  {
    id: "reutilizavel",
    title: "Reutilizável entre projetos",
    icon: "reusable",
    description:
      "O mesmo conjunto de papéis e workflows atende repositórios diferentes; só a memória e as políticas são locais.",
  },
];
