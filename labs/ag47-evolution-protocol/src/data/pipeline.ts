import type { IconName } from "@/types/content";

export interface PipelineStage {
  id: string;
  label: string;
  icon: IconName;
  objective: string;
  inputs: string[];
  outputs: string[];
  /** Quem decide o quê nesta etapa — a fronteira que impede auto-validação. */
  authority: string;
  limits: string[];
  artifacts: string[];
}

/** O ciclo evolutivo completo, do bootstrap ao próximo incremento. */
export const pipeline: PipelineStage[] = [
  {
    id: "bootstrap",
    label: "Bootstrap",
    icon: "bootstrap",
    objective:
      "Construir uma representação confiável do projeto antes que qualquer mudança seja proposta.",
    inputs: [
      "Repositório",
      "Documentação existente",
      "Histórico de commits",
      "Configuração de build e testes",
    ],
    outputs: [
      "Arquitetura atual reconstruída",
      "Baseline de qualidade",
      "Lacunas e pontos de baixa confiança",
    ],
    authority: "Somente leitura. Não altera código de produção.",
    limits: [
      "Não infere intenção de produto — pergunta",
      "Não corrige o que encontra",
      "Não define arquitetura alvo sem validação humana",
    ],
    artifacts: [
      ".evolution/baseline.json",
      ".evolution/architecture/current-architecture.md",
      ".evolution/project-state.json",
    ],
  },
  {
    id: "observador",
    label: "Observador",
    icon: "observer",
    objective:
      "Comparar o que existe com o que foi prometido e propor o próximo incremento de maior valor.",
    inputs: [
      "Estado do projeto",
      "Arquitetura atual e alvo",
      "Roadmap",
      "Histórico dos ciclos anteriores",
    ],
    outputs: [
      "Proposta de sprint com escopo delimitado",
      "Estimativa de risco",
      "Critérios de aceite",
    ],
    authority: "Propõe. Não implementa e não aprova a própria proposta.",
    limits: [
      "Não modifica código de produção",
      "Não amplia o escopo durante a execução",
      "Não decide prioridade de negócio sozinho",
    ],
    artifacts: [".evolution/roadmap/sprint-plan.json"],
  },
  {
    id: "gate-planejamento",
    label: "Gate de Planejamento",
    icon: "planning-gate",
    objective:
      "Impedir que um plano entre em execução sem escopo, critérios de aceite e limites definidos.",
    inputs: ["Proposta de sprint", "Políticas ativas", "Orçamento de mudança"],
    outputs: ["Plano aprovado, rejeitado ou devolvido para revisão"],
    authority: "Bloqueia. Exige aprovação humana quando a política determina.",
    limits: [
      "Não reescreve o plano",
      "Não aprova o que excede o orçamento de mudança",
    ],
    artifacts: ["Registro de decisão do gate", "Transição PROPOSED → APPROVED"],
  },
  {
    id: "executor",
    label: "Executor",
    icon: "execution",
    objective:
      "Implementar exatamente o escopo aprovado, com testes e artefatos técnicos atualizados.",
    inputs: ["Plano aprovado", "Skills da stack", "Políticas de acesso ao repositório"],
    outputs: ["Alteração de código", "Testes", "Relatório de execução"],
    authority: "Escreve código apenas nas áreas permitidas pela política.",
    limits: [
      "Não altera missão, arquitetura ou escopo",
      "Não declara a própria entrega como validada",
      "Não excede o orçamento de mudança",
    ],
    artifacts: [".evolution/evidence/execution-report.json"],
  },
  {
    id: "testes",
    label: "Testes determinísticos",
    icon: "tests",
    objective: "Produzir um resultado reproduzível e independente de julgamento.",
    inputs: ["Código alterado", "Suíte de testes", "Configuração dos gates"],
    outputs: ["Saída de build, lint, typecheck e testes", "Código de saída por gate"],
    authority: "Nenhuma. É medição, não decisão.",
    limits: ["Não interpreta o resultado", "Não decide se a falha é aceitável"],
    artifacts: ["Logs de execução", "Relatórios de cobertura"],
  },
  {
    id: "validador",
    label: "Validador",
    icon: "validation",
    objective: "Tentar provar que a entrega está errada.",
    inputs: ["Plano aprovado", "Relatório de execução", "Saída dos gates"],
    outputs: ["Aprovação, reprovação ou aprovação parcial", "Regressões detectadas"],
    authority: "Aprova ou reprova a entrega.",
    limits: [
      "Não corrige silenciosamente o que encontra",
      "Não valida o próprio trabalho",
      "Não aceita afirmação sem evidência",
    ],
    artifacts: [".evolution/evidence/validation-report.json"],
  },
  {
    id: "curador",
    label: "Curador de Conhecimento",
    icon: "curator",
    objective: "Consolidar na memória permanente apenas aquilo que foi validado.",
    inputs: ["Relatório de validação aprovado", "Decisões arquiteturais do ciclo"],
    outputs: ["Documentação atualizada", "Changelog", "Registro de ações humanas"],
    authority: "Escreve memória. Não escreve código.",
    limits: [
      "Não consolida o que não foi validado",
      "Não valida a própria escrita",
      "Não reinterpreta o resultado do validador",
    ],
    artifacts: [
      ".evolution/history/",
      ".evolution/human-actions/",
      "Documentação do projeto",
    ],
  },
  {
    id: "integracao",
    label: "Integração",
    icon: "integration",
    objective: "Levar a mudança ao ramo principal sob os gates de release.",
    inputs: ["Entrega aprovada", "Política de integração"],
    outputs: ["Merge", "Versão", "Ponto de rollback"],
    authority: "Gerente de Release — o único papel que integra.",
    limits: ["Não integra entrega reprovada", "Não pula gates por urgência"],
    artifacts: ["Commit de merge", "Tag de versão"],
  },
  {
    id: "memoria",
    label: "Atualização da memória",
    icon: "memory",
    objective: "Deixar o estado do projeto consistente com a realidade pós-merge.",
    inputs: ["Resultado da integração", "Métricas do ciclo"],
    outputs: ["Estado atualizado", "Baseline recalculada"],
    authority: "Escrita restrita ao diretório .evolution/.",
    limits: ["Não altera código", "Não reescreve histórico"],
    artifacts: [".evolution/project-state.json", ".evolution/baseline.json"],
  },
  {
    id: "proximo-ciclo",
    label: "Próximo ciclo",
    icon: "evolution",
    objective:
      "Reabrir o ciclo com o contexto preservado e o próximo incremento já identificado.",
    inputs: ["Estado atualizado", "Observação do comportamento em produção"],
    outputs: ["Nova proposta de sprint"],
    authority: "Retorna ao Observador.",
    limits: [
      "Não inicia sem estado consistente",
      "Não acumula ciclos abertos em paralelo sem política que permita",
    ],
    artifacts: ["Transição OBSERVED → CLOSED e abertura do próximo item"],
  },
];
