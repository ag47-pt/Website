export interface HumanActionFlowStep {
  actor: string;
  action: string;
  detail: string;
}

/** Nenhuma ação humana entra na memória sem passar pelo Validador. */
export const humanActionFlow: HumanActionFlowStep[] = [
  {
    actor: "Observador ou Executor",
    action: "Detecta a dependência",
    detail:
      "Durante a análise ou a execução, um papel esbarra em algo que não tem autoridade ou acesso para resolver.",
  },
  {
    actor: "Proposta de ação humana",
    action: "Registra o pedido",
    detail:
      "A dependência vira um item estruturado: o que falta, o que ela bloqueia e como seria possível confirmar que foi resolvida.",
  },
  {
    actor: "Validador",
    action: "Confirma a necessidade",
    detail:
      "Verifica se a ação é mesmo necessária ou se havia caminho executável. Aprova, rejeita ou funde com um item existente.",
  },
  {
    actor: "Curador de Conhecimento",
    action: "Consolida no registro",
    detail:
      "Somente o que foi validado entra no Human Action Registry — a memória permanente não recebe suposição.",
  },
];

export type HumanActionStatus = "PENDING" | "BLOCKED" | "RESOLVED";
export type HumanActionPriority = "HIGH" | "MEDIUM" | "LOW";

export interface HumanAction {
  id: string;
  title: string;
  status: HumanActionStatus;
  priority: HumanActionPriority;
  category: string;
  blocks: string;
  owner: string;
  validation: string;
}

/**
 * Painel ilustrativo — os itens abaixo são exemplo de formato, não o registro
 * de um projeto real.
 */
export const humanActions: HumanAction[] = [
  {
    id: "HA-014",
    title: "Configurar TELEGRAM_BOT_TOKEN",
    status: "PENDING",
    priority: "HIGH",
    category: "CREDENTIALS",
    blocks: "alertas_telegram",
    owner: "Humano",
    validation: "workflow validate-telegram",
  },
  {
    id: "HA-011",
    title: "Apontar DNS do ambiente de staging",
    status: "PENDING",
    priority: "MEDIUM",
    category: "INFRA",
    blocks: "deploy_staging",
    owner: "Humano",
    validation: "resolução de DNS + handshake TLS",
  },
  {
    id: "HA-009",
    title: "Aprovar orçamento de infraestrutura",
    status: "BLOCKED",
    priority: "HIGH",
    category: "BUSINESS",
    blocks: "provisionamento_producao",
    owner: "Decisão externa",
    validation: "registro de aprovação assinado",
  },
  {
    id: "HA-007",
    title: "Ativar webhook do provedor de pagamento",
    status: "RESOLVED",
    priority: "HIGH",
    category: "INTEGRATION",
    blocks: "—",
    owner: "Humano",
    validation: "evento de teste recebido e persistido",
  },
  {
    id: "HA-003",
    title: "Definir política de retenção de dados",
    status: "PENDING",
    priority: "MEDIUM",
    category: "LEGAL",
    blocks: "rotina_de_expurgo",
    owner: "Decisão externa",
    validation: "política publicada no repositório",
  },
  {
    id: "HA-002",
    title: "Criar bucket de backup",
    status: "RESOLVED",
    priority: "MEDIUM",
    category: "INFRA",
    blocks: "—",
    owner: "Humano",
    validation: "escrita e leitura de objeto de teste",
  },
];

export const humanActionExample = `id: HA-014
titulo: Configurar TELEGRAM_BOT_TOKEN
status: PENDING
prioridade: HIGH
categoria: CREDENTIALS
bloqueia:
  - alertas_telegram
responsavel: HUMAN
detectado_por: executor
validado_por: validator
como_validar:
  - executar workflow validate-telegram`;
