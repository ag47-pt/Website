export interface ProtocolState {
  id: string;
  label: string;
  kind: "main" | "exception";
  definition: string;
  entry: string[];
  exit: string[];
  /** Quem tem autoridade para operar a transição. */
  agents: string[];
  evidence: string[];
}

/** Fluxo principal: o caminho feliz, do plano ao encerramento. */
export const mainStates: ProtocolState[] = [
  {
    id: "proposed",
    label: "PROPOSED",
    kind: "main",
    definition: "Existe um plano, mas nenhuma autorização para executá-lo.",
    entry: ["Observador concluiu a análise", "Escopo e critérios de aceite declarados"],
    exit: ["Gate de planejamento aprova ou rejeita"],
    agents: ["Observador"],
    evidence: ["sprint-plan.json"],
  },
  {
    id: "approved",
    label: "APPROVED",
    kind: "main",
    definition: "Plano autorizado e escopo congelado.",
    entry: ["Gate de planejamento aprovou", "Orçamento de mudança respeitado"],
    exit: ["Executor inicia a implementação"],
    agents: ["Gate de planejamento", "Humano, quando a política exige"],
    evidence: ["Registro de decisão do gate"],
  },
  {
    id: "in-progress",
    label: "IN_PROGRESS",
    kind: "main",
    definition: "Implementação em andamento, dentro do escopo congelado.",
    entry: ["Plano aprovado"],
    exit: ["Escopo implementado ou bloqueio identificado"],
    agents: ["Executor"],
    evidence: ["Diff restrito ao escopo aprovado"],
  },
  {
    id: "implemented",
    label: "IMPLEMENTED",
    kind: "main",
    definition: "Código escrito. Nada provado ainda.",
    entry: ["Executor concluiu o escopo"],
    exit: ["Gates determinísticos são executados"],
    agents: ["Executor"],
    evidence: ["execution-report.json"],
  },
  {
    id: "tested",
    label: "TESTED",
    kind: "main",
    definition: "Gates determinísticos executados e resultado capturado.",
    entry: ["Build, lint, typecheck e testes rodaram"],
    exit: ["Validador analisa o resultado"],
    agents: ["Ferramentas — sem autoridade de decisão"],
    evidence: ["Saída e código de saída de cada gate"],
  },
  {
    id: "verified",
    label: "VERIFIED",
    kind: "main",
    definition: "O Validador não conseguiu provar que a entrega está errada.",
    entry: ["Todos os gates passaram", "Plano e implementação conferem"],
    exit: ["Integração autorizada"],
    agents: ["Validador"],
    evidence: ["validation-report.json"],
  },
  {
    id: "merged",
    label: "MERGED",
    kind: "main",
    definition: "Mudança integrada ao ramo principal, com ponto de rollback conhecido.",
    entry: ["Entrega verificada", "Gates de integração aprovados"],
    exit: ["Observação em ambiente real"],
    agents: ["Gerente de Release"],
    evidence: ["Commit de merge", "Tag de versão"],
  },
  {
    id: "observed",
    label: "OBSERVED",
    kind: "main",
    definition: "Comportamento acompanhado depois da integração.",
    entry: ["Merge concluído"],
    exit: ["Nenhuma regressão no período definido"],
    agents: ["Observador"],
    evidence: ["Métricas do período de observação"],
  },
  {
    id: "closed",
    label: "CLOSED",
    kind: "main",
    definition: "Item encerrado e consolidado na memória permanente.",
    entry: ["Observação sem regressão", "Curador consolidou o conhecimento"],
    exit: ["Terminal — libera espaço para o próximo ciclo"],
    agents: ["Curador de Conhecimento"],
    evidence: ["Entrada em history/", "Documentação atualizada"],
  },
];

/** Estados de exceção: onde o ciclo real passa a maior parte do tempo difícil. */
export const exceptionStates: ProtocolState[] = [
  {
    id: "blocked",
    label: "BLOCKED",
    kind: "exception",
    definition: "Depende de algo que o protocolo não pode executar sozinho.",
    entry: ["Ação humana pendente", "Credencial, decisão ou acesso ausente"],
    exit: ["Ação humana resolvida e confirmada pelo Validador"],
    agents: ["Qualquer papel propõe", "Validador confirma a necessidade"],
    evidence: ["Registro em human-actions/"],
  },
  {
    id: "rejected",
    label: "REJECTED",
    kind: "exception",
    definition: "Proposta ou entrega recusada, com motivo registrado.",
    entry: ["Gate reprovou ou o Validador recusou"],
    exit: ["Nova proposta substitui a anterior"],
    agents: ["Gate de planejamento", "Validador"],
    evidence: ["Motivo da recusa, item a item"],
  },
  {
    id: "partial",
    label: "PARTIAL",
    kind: "exception",
    definition: "Parte do escopo foi entregue e provada; o restante não.",
    entry: ["Alguns critérios de aceite atendidos"],
    exit: ["Escopo restante replanejado"],
    agents: ["Validador"],
    evidence: ["Critérios atendidos e não atendidos, separados"],
  },
  {
    id: "regression",
    label: "REGRESSION",
    kind: "exception",
    definition: "Algo que funcionava parou de funcionar.",
    entry: ["Comparação com a baseline detectou perda"],
    exit: ["Correção verificada ou rollback executado"],
    agents: ["Validador"],
    evidence: ["Diferença contra a baseline"],
  },
  {
    id: "rolled-back",
    label: "ROLLED_BACK",
    kind: "exception",
    definition: "Estado revertido para o último ponto confiável.",
    entry: ["Recuperação acionada", "Aprovação humana registrada"],
    exit: ["Estado consistente restabelecido"],
    agents: ["Gerente de Release"],
    evidence: ["rollback-report", "Incidente em history/"],
  },
  {
    id: "human-review",
    label: "HUMAN_REVIEW",
    kind: "exception",
    definition: "Aguardando julgamento humano — o protocolo para e não simula.",
    entry: ["Política exige aprovação", "ou confiança abaixo do limite"],
    exit: ["Decisão humana registrada com autor e data"],
    agents: ["Humano"],
    evidence: ["Decisão assinada no histórico"],
  },
  {
    id: "release-candidate",
    label: "RELEASE_CANDIDATE",
    kind: "exception",
    definition: "Verificado e pronto para publicar, aguardando janela.",
    entry: ["Entrega verificada", "Gates de release aprovados"],
    exit: ["Publicação ou retorno para correção"],
    agents: ["Gerente de Release"],
    evidence: ["Checklist de release"],
  },
  {
    id: "complete",
    label: "COMPLETE",
    kind: "exception",
    definition: "Ciclo inteiro concluído, memória consolidada e baseline atualizada.",
    entry: ["Item fechado", "Baseline recalculada"],
    exit: ["Terminal"],
    agents: ["Curador de Conhecimento"],
    evidence: ["project-state.json atualizado"],
  },
];

/**
 * Tom semântico de cada estado de exceção.
 *
 * Sair do fluxo principal não significa falha: RELEASE_CANDIDATE e COMPLETE são
 * desfechos saudáveis, HUMAN_REVIEW é uma parada esperada. Só REJECTED e
 * REGRESSION são erro de fato — e é neles que o vermelho reservado se aplica.
 */
export type StateTone = "warn" | "danger" | "info" | "accent";

export const exceptionTones: Record<string, StateTone> = {
  blocked: "warn",
  rejected: "danger",
  partial: "warn",
  regression: "danger",
  "rolled-back": "warn",
  "human-review": "info",
  "release-candidate": "info",
  complete: "accent",
};

export const allStates: ProtocolState[] = [...mainStates, ...exceptionStates];
