import type { IconName } from "@/types/content";

export interface Role {
  id: string;
  name: string;
  icon: IconName;
  mission: string;
  responsibilities: string[];
  authority: string;
  /** O que este papel não pode fazer — é o que torna a separação real. */
  prohibitions: string[];
}

export const roles: Role[] = [
  {
    id: "observador",
    name: "Observador",
    icon: "observer",
    mission: "Entende o estado real do projeto e propõe o próximo passo.",
    responsibilities: [
      "Analisar o repositório",
      "Comparar código e documentação",
      "Identificar lacunas",
      "Propor o próximo sprint",
      "Estimar risco",
      "Priorizar valor",
    ],
    authority: "Propõe o escopo do próximo ciclo.",
    prohibitions: [
      "Não modifica código de produção",
      "Não aprova a própria proposta",
      "Não executa o plano que escreveu",
    ],
  },
  {
    id: "executor",
    name: "Executor",
    icon: "execution",
    mission: "Implementa o escopo aprovado, e apenas ele.",
    responsibilities: [
      "Implementar o escopo aprovado",
      "Criar testes",
      "Atualizar artefatos técnicos",
      "Produzir evidências",
    ],
    authority: "Escreve código nas áreas liberadas pela política.",
    prohibitions: [
      "Não altera missão, arquitetura ou escopo",
      "Não declara a própria entrega como validada",
      "Não amplia o plano durante a execução",
    ],
  },
  {
    id: "validador",
    name: "Validador",
    icon: "validation",
    mission: "Tenta provar que a entrega está errada.",
    responsibilities: [
      "Executar testes",
      "Comparar plano e implementação",
      "Detectar regressão",
      "Validar critérios de aceite",
      "Confirmar ou rejeitar propostas de ações humanas",
    ],
    authority: "Aprova, reprova ou aprova parcialmente a entrega.",
    prohibitions: [
      "Não corrige silenciosamente os erros que encontra",
      "Não valida trabalho de que participou",
      "Não aceita afirmação sem evidência",
    ],
  },
  {
    id: "guardiao",
    name: "Guardião da Arquitetura",
    icon: "guardian",
    mission: "Impede que a soma de decisões locais destrua a arquitetura.",
    responsibilities: [
      "Proteger princípios arquiteturais",
      "Impedir deriva",
      "Validar decisões estruturais",
      "Exigir ADR quando necessário",
    ],
    authority: "Bloqueia mudanças estruturais e exige registro de decisão.",
    prohibitions: [
      "Não implementa a alternativa que defende",
      "Não decide prioridade de produto",
    ],
  },
  {
    id: "curador",
    name: "Curador de Conhecimento",
    icon: "curator",
    mission: "Transforma resultado validado em memória permanente.",
    responsibilities: [
      "Atualizar documentação",
      "Manter roadmap e changelog",
      "Registrar estado do projeto e métricas",
      "Manter o registro de ações humanas",
    ],
    authority: "Escreve na memória do projeto.",
    prohibitions: [
      "Não escreve código",
      "Não consolida o que não foi validado",
      "Não valida a própria escrita",
    ],
  },
  {
    id: "release",
    name: "Gerente de Release",
    icon: "release",
    mission: "Leva mudança aprovada à produção com caminho de volta.",
    responsibilities: [
      "Merge",
      "Release",
      "Rollback",
      "Versionamento",
      "Gates de integração",
    ],
    authority: "Único papel que integra ao ramo principal e reverte.",
    prohibitions: [
      "Não integra entrega reprovada",
      "Não pula gates por urgência",
      "Não altera o conteúdo da entrega",
    ],
  },
];

/**
 * Matriz de separação de autoridade.
 *
 * Cada papel detém exatamente uma autoridade primária — é essa exclusividade
 * que impede um agente de propor, executar e aprovar o próprio trabalho.
 */
export const capabilities = [
  "Propor escopo",
  "Escrever código",
  "Aprovar entrega",
  "Bloquear arquitetura",
  "Escrever memória",
  "Integrar e reverter",
];

/** Índice da capacidade que cada papel detém, na ordem de `capabilities`. */
export const authorityMatrix: Record<string, number> = {
  observador: 0,
  executor: 1,
  validador: 2,
  guardiao: 3,
  curador: 4,
  release: 5,
};
