/**
 * Dados do EvoPro (Evolution Protocol) para a landing page oficial.
 *
 * REGRA DESTE FICHEIRO: nenhum facto sobre o protocolo é escrito à mão aqui.
 *
 * Versão, comandos, flags, críticos, guardrails, modos de execução e caminhos de
 * artefactos vêm de `evopro-manifest.json`, que é gerado pelo próprio protocolo:
 *
 *     npm run sync:evopro        # corre `evolution manifest` e reescreve o JSON
 *
 * O que se escreve à mão são apenas as descrições em português (os "overlays"
 * abaixo). Se um comando novo aparecer no manifesto sem overlay, ele continua a
 * ser apresentado — com o texto de ajuda do próprio CLI — em vez de desaparecer
 * silenciosamente da página. Era exatamente esse desaparecimento que mantinha a
 * página uma versão inteira atrás do sistema.
 */
import manifestJson from './evopro-manifest.json';

// ---------------------------------------------------------------------------
// Forma do manifesto publicado por `evolution manifest`
// ---------------------------------------------------------------------------

interface ManifestArgument {
  name: string;
  positional: boolean;
  help: string;
  aliases?: string[];
  choices?: string[];
  required?: boolean;
  default?: unknown;
}

interface ManifestCommand {
  command: string;
  help?: string;
  arguments?: ManifestArgument[];
  subcommands?: ManifestCommand[];
}

interface ManifestCritic {
  name: string;
  status: 'implemented' | 'registered_unavailable';
  description: string;
  evidence_type: string;
  requires_context: string[];
  requires_capabilities: string[];
}

interface ManifestGuardrail {
  condition: string;
  trips_when: string;
  action: string;
  limit_key: string | null;
  configurable: boolean;
  enforced: boolean;
}

interface ManifestArtifact {
  stage: string;
  path: string;
  produced_by: string;
}

interface EvoProManifest {
  protocol: { name: string; package: string; cli: string; version: string };
  cli: ManifestCommand[];
  critics: ManifestCritic[];
  judge_verdicts: { verdict: string; next_action: string }[];
  guardrails: ManifestGuardrail[];
  execution_modes: string[];
  default_limits: Record<string, number>;
  goal: {
    criterion_kinds: string[];
    criterion_outcomes: string[];
    stop_conditions: string[];
  };
  capabilities: { discoverable: string[]; declaration_only: string[] };
  command_slots: string[];
  artifacts: ManifestArtifact[];
}

export const MANIFEST = manifestJson as unknown as EvoProManifest;

// ---------------------------------------------------------------------------
// Tipos consumidos pelos componentes
// ---------------------------------------------------------------------------

export type CliCategory =
  | 'bootstrap'
  | 'lifecycle'
  | 'goal_sprint'
  | 'verification'
  | 'runtime'
  | 'intelligence'
  | 'audit';

export interface CliCommand {
  command: string;
  category: CliCategory;
  description: string;
  flags?: string[];
  example?: string;
  outputExample?: string;
}

export interface CriticInfo {
  id: string;
  name: string;
  status: 'implemented' | 'registered_unavailable';
  description: string;
  evidenceType: string;
  details: string;
}

export interface LifecycleStage {
  id: string;
  number: string;
  name: string;
  module: string;
  responsibility: string;
  inputs: string;
  outputs: string;
  accent: string;
}

export interface GuardrailItem {
  condition: string;
  tripsWhen: string;
  action: string;
  configurable: boolean;
  enforced: boolean;
}

export interface ExecutionMode {
  id: string;
  name: string;
  flag: string;
  description: string;
  behavior: string;
  idealFor: string;
}

// ---------------------------------------------------------------------------
// Identidade
// ---------------------------------------------------------------------------

export const EVOPRO_CONFIG = {
  name: 'EvoPro — Evolution Protocol',
  shortName: 'EvoPro',
  package: MANIFEST.protocol.package,
  /** Nunca editar à mão: vem do pyproject.toml do protocolo via manifesto. */
  version: MANIFEST.protocol.version,
  cliCommand: MANIFEST.protocol.cli,
  license: 'MIT',
  copyright: '2026 Agência 47 Labs',
  author: 'Agência 47 Labs',
  email: 'dev@ag47.pt',
  canonicalUrl: 'https://ag47.pt/eco/evopro',
  gitHubUrl: 'https://github.com/ag47-pt/ag47-evolution-protocol',
  gitRemoteUrl: 'https://github.com/ag47-pt/ag47-evolution-protocol.git',
  documentationUrl: 'https://github.com/ag47-pt/ag47-evolution-protocol/tree/main/docs',
  installCommand: 'pip install git+https://github.com/ag47-pt/ag47-evolution-protocol.git',
  upgradeCommand: 'evolution upgrade',
  doctorCommand: 'evolution doctor',
  tagline: 'O protocolo determinístico para software que sabe como continuar a evoluir.',
  subtitle: 'The intelligence can change. The protocol stays with the project.',
  corePrinciples: [
    'Repository-native',
    'Harness-agnostic',
    'Model-agnostic',
    'Goal-driven',
    'Evidence-driven',
    'Graph-enhanced'
  ]
};

/** Versão apresentada em badges e títulos. Uma única fonte para toda a página. */
export const EVOPRO_VERSION_LABEL = `v${MANIFEST.protocol.version}`;

// ---------------------------------------------------------------------------
// CLI — derivado da árvore real de parsers
// ---------------------------------------------------------------------------

/** Achata a árvore do manifesto: só folhas são comandos executáveis. */
function leafCommands(nodes: ManifestCommand[]): ManifestCommand[] {
  return nodes.flatMap((node) =>
    node.subcommands?.length ? leafCommands(node.subcommands) : [node]
  );
}

/** Converte um argumento real numa etiqueta legível para a UI. */
function formatArgument(arg: ManifestArgument): string {
  if (arg.positional) return `<${arg.name}>`;
  if (arg.choices?.length) return `${arg.name} ${arg.choices.join('|')}`;
  return arg.name;
}

interface CommandCopy {
  category: CliCategory;
  description: string;
  example?: string;
  outputExample?: string;
}

/**
 * Prosa em português por comando. A chave tem de existir no manifesto — se um
 * comando for renomeado no protocolo, o overlay deixa de casar e o comando passa
 * a mostrar o help oficial em inglês, o que é visível e corrigível.
 */
const COMMAND_COPY: Record<string, CommandCopy> = {
  'evolution init': {
    category: 'bootstrap',
    description: 'Instala o protocolo no host, cria a árvore .evolution/ e inicializa o host contract.',
    example: 'evolution init'
  },
  'evolution upgrade': {
    category: 'bootstrap',
    description:
      'Reconcilia um host já instalado com uma versão mais recente do protocolo, preservando todo o estado: goal, sprints, ciclos, conhecimento e ledger.',
    example: 'evolution upgrade --check'
  },
  'evolution doctor': {
    category: 'bootstrap',
    description: 'Verifica a integridade do pacote EvoPro, schemas vinculados e estado do host.',
    example: 'evolution doctor'
  },
  'evolution workspace': {
    category: 'bootstrap',
    description: 'Deteta o tipo de workspace (HOST, KERNEL, PLAYGROUND, UNKNOWN).'
  },
  'evolution version': {
    category: 'bootstrap',
    description: 'Apresenta a versão do EvoPro instalada e metadados de build.'
  },
  'evolution manifest': {
    category: 'bootstrap',
    description:
      'Publica a superfície do próprio protocolo em JSON: comandos, flags, críticos, guardrails e caminhos de artefactos. É a fonte desta página.',
    example: 'evolution manifest --section critics'
  },
  'evolution capabilities': {
    category: 'bootstrap',
    description: 'Descobre o que este harness consegue fazer e o que precisa de ser declarado.'
  },
  'evolution inspect': {
    category: 'lifecycle',
    description: 'Executa o Observer para mapear ficheiros, linguagens, comandos e scope real.'
  },
  'evolution spec': {
    category: 'lifecycle',
    description: 'Executa Analyst + Planner para diagnosticar identidade, gaps e gerar o roadmap.'
  },
  'evolution spec questions': {
    category: 'lifecycle',
    description: 'Lista as decisões humanas pendentes levantadas pelo diagnóstico.'
  },
  'evolution spec confirm': {
    category: 'lifecycle',
    description: 'Responde a uma decisão pendente para desbloquear o bootstrap.',
    example: 'evolution spec confirm --id DEC-001 --answer CONFIRM'
  },
  'evolution scope show': {
    category: 'lifecycle',
    description: 'Resume que ficheiros estão dentro e fora do scope governado.'
  },
  'evolution scope explain': {
    category: 'lifecycle',
    description: 'Explica por que razão um caminho específico foi incluído ou excluído.'
  },
  'evolution snapshot validate': {
    category: 'lifecycle',
    description: 'Valida um ficheiro de snapshot contra o schema.'
  },
  'evolution snapshot diff': {
    category: 'lifecycle',
    description: 'Compara snapshots recentes para ver o que mudou estruturalmente.'
  },
  'evolution human-actions': {
    category: 'lifecycle',
    description: 'Lista as ações que dependem de um developer humano antes do loop continuar.'
  },
  'evolution goal set': {
    category: 'goal_sprint',
    description: 'Define o Global Goal mensurável com critérios de sucesso verificáveis.',
    example: 'evolution goal set "Transformar este host num SaaS pronto para produção"'
  },
  'evolution goal show': {
    category: 'goal_sprint',
    description: 'Apresenta o objetivo global ativo e a avaliação mais recente dos critérios.'
  },
  'evolution goal evaluate': {
    category: 'goal_sprint',
    description: 'Reavalia os critérios de sucesso contra a realidade atual do host.',
    example: 'evolution goal evaluate --progress always'
  },
  'evolution goal confirm': {
    category: 'goal_sprint',
    description: 'Confirma humanamente um critério que o protocolo não consegue verificar sozinho.',
    example: 'evolution goal confirm --id CRIT-HUMAN-UX --answer CONFIRM'
  },
  'evolution sprint next': {
    category: 'goal_sprint',
    description: 'Deriva e gera o próximo sprint executável a partir dos gaps pendentes.'
  },
  'evolution sprint status': {
    category: 'goal_sprint',
    description: 'Exibe o sprint ativo, itens de trabalho e estado de execução.'
  },
  'evolution sprint list': {
    category: 'goal_sprint',
    description: 'Lista o histórico de todos os sprints gerados no host.'
  },
  'evolution baseline capture': {
    category: 'verification',
    description: 'Regista as métricas estruturais e comportamentais do host no momento.',
    example: 'evolution baseline capture --label before'
  },
  'evolution baseline compare': {
    category: 'verification',
    description: 'Compara os baselines State A e State B, classificando cada dimensão.'
  },
  'evolution gauntlet run': {
    category: 'verification',
    description: 'Dispara a revisão adversarial com os críticos selecionados.',
    example: 'evolution gauntlet run --critics scope,security,regression'
  },
  'evolution judge': {
    category: 'verification',
    description: 'Processa evidências e emite o veredito (ACCEPT / REVISE / ROLLBACK / BLOCKED).'
  },
  'evolution run': {
    category: 'runtime',
    description: 'Inicia o loop de evolução governada no modo especificado.',
    example: 'evolution run --mode goal-driven'
  },
  'evolution status': {
    category: 'runtime',
    description: 'Apresenta o estado global: progresso do objetivo, sprint ativo e ciclo em curso.'
  },
  'evolution next': {
    category: 'runtime',
    description: 'Recomenda a única próxima ação determinística necessária, com a sua razão.'
  },
  'evolution tick': {
    category: 'runtime',
    description: 'Avança um único passo na máquina de estados da tarefa ativa.'
  },
  'evolution pause': {
    category: 'runtime',
    description: 'Pausa o loop, preservando o estado para retomar depois.'
  },
  'evolution resume': {
    category: 'runtime',
    description: 'Retoma um loop pausado a partir de onde ficou.'
  },
  'evolution stop': {
    category: 'runtime',
    description: 'Interrompe o loop com um motivo registado no ledger.',
    example: 'evolution stop --reason "revisão humana"'
  },
  'evolution cycle create': {
    category: 'runtime',
    description: 'Cria um novo ciclo governado explicitamente.'
  },
  'evolution cycle status': {
    category: 'runtime',
    description: 'Verifica o estado do ciclo ativo na máquina de estados.'
  },
  'evolution cycle show': {
    category: 'runtime',
    description: 'Mostra os detalhes e artefactos de um ciclo específico.'
  },
  'evolution cycle pause': {
    category: 'runtime',
    description: 'Pausa o ciclo ativo sem o abortar.'
  },
  'evolution cycle resume': {
    category: 'runtime',
    description: 'Retoma um ciclo pausado.'
  },
  'evolution cycle abort': {
    category: 'runtime',
    description: 'Aborta o ciclo ativo e regista a interrupção.'
  },
  'evolution schedule install': {
    category: 'runtime',
    description: 'Instala o agendamento automático de ticks do protocolo.'
  },
  'evolution schedule status': {
    category: 'runtime',
    description: 'Verifica se o agendamento está ativo.'
  },
  'evolution schedule remove': {
    category: 'runtime',
    description: 'Remove o agendamento automático.'
  },
  'evolution graph status': {
    category: 'intelligence',
    description: 'Informa provedor de grafo, nós, arestas, ficheiros indexados e staleness.'
  },
  'evolution graph build': {
    category: 'intelligence',
    description: 'Constrói ou atualiza incrementalmente o Code Graph do host.'
  },
  'evolution graph impact': {
    category: 'intelligence',
    description: 'Analisa o raio de alcance e impacto de dependências de um ou mais ficheiros.',
    example: 'evolution graph impact src/evolution_kernel/core/host_contract.py --depth 3'
  },
  'evolution graph query': {
    category: 'intelligence',
    description: 'Inspeciona nós do grafo e as suas relações.'
  },
  'evolution graph why': {
    category: 'intelligence',
    description: 'Traça por que razão um nó do Evolution Graph existe.'
  },
  'evolution cognitive status': {
    category: 'intelligence',
    description: 'Exibe o pedido cognitivo pendente para agentes externos.'
  },
  'evolution cognitive validate': {
    category: 'intelligence',
    description: 'Valida a resposta de um agente contra o contrato do pedido cognitivo.'
  },
  'evolution context': {
    category: 'intelligence',
    description: 'Monta o contexto relevante ponderado para a tarefa ativa.'
  },
  'evolution benchmark graph': {
    category: 'intelligence',
    description: 'Mede A/B o contexto construído com e sem o Code Graph.'
  },
  'evolution continuity': {
    category: 'audit',
    description: 'Reconstrói o estado integral do repositório para novos agentes.',
    example: 'evolution continuity --markdown'
  },
  'evolution guardrails show': {
    category: 'audit',
    description: 'Exibe os limites de segurança ativos e contadores de tentativas.'
  },
  'evolution guardrails reset': {
    category: 'audit',
    description: 'Reinicia os contadores dos guardrails após uma intervenção humana.'
  },
  'evolution history': {
    category: 'audit',
    description: 'Lista o histórico ordenado de ciclos, sprints e decisões tomadas.'
  },
  'evolution audit': {
    category: 'audit',
    description: 'Audita a consistência do ledger, conhecimento adquirido e hashes.'
  }
};

export const CLI_COMMANDS: CliCommand[] = leafCommands(MANIFEST.cli).map((node) => {
  const copy = COMMAND_COPY[node.command];
  const flags = (node.arguments ?? []).map(formatArgument);
  return {
    command: node.command,
    category: copy?.category ?? 'runtime',
    description: copy?.description ?? node.help ?? '',
    flags,
    example: copy?.example,
    outputExample: copy?.outputExample
  };
});

/** Comandos presentes no protocolo mas ainda sem tradução. Útil em revisão. */
export const CLI_COMMANDS_WITHOUT_COPY = leafCommands(MANIFEST.cli)
  .map((n) => n.command)
  .filter((command) => !COMMAND_COPY[command]);

// ---------------------------------------------------------------------------
// Críticos — estado vem do registry real do Gauntlet
// ---------------------------------------------------------------------------

const CRITIC_COPY: Record<string, { name: string; description: string; details: string }> = {
  scope: {
    name: 'Scope Critic',
    description:
      'Verifica se ficheiros protegidos ou fora de scope foram modificados e monitoriza o orçamento de alterações.',
    details: 'Impede mutações inadvertidas em ficheiros nucleares como .evolution/** ou .git/**.'
  },
  regression: {
    name: 'Regression Critic',
    description:
      'Analisa a comparação de baseline State A vs State B em busca de regressões comportamentais ou estruturais.',
    details: 'Uma baseline ausente é classificada de imediato como finding impeditivo.'
  },
  test: {
    name: 'Test Critic',
    description:
      'Valida se código alterado possui evidência de testes e se os critérios de aceitação foram comprovados.',
    details: 'Código de produção modificado sem execução de suites de teste gera alerta.'
  },
  security: {
    name: 'Security Critic',
    description:
      'Varredura estática contra padrões perigosos: secrets hardcoded, shell=True, eval/exec, TLS desativado.',
    details: 'Proteção determinística imediata sem necessidade de conexão externa.'
  },
  architecture: {
    name: 'Architecture Critic',
    description:
      'Garante conformidade com caminhos proibidos e limites arquiteturais declarados pelo host.',
    details: 'Valida se a mutação respeita boundaries e regras do evolution.config.json.'
  },
  goal_alignment: {
    name: 'Goal Alignment Critic',
    description: 'Deteta mutações órfãs, desvios de sprint e desconexão com o Global Goal.',
    details: 'Garante que o esforço do agente converge estritamente para os critérios do host.'
  },
  integrity: {
    name: 'Integrity Critic',
    description: 'Reavaliação independente do veredito do validador e consistência dos relatórios.',
    details: 'Nenhum ator valida as suas próprias mutações sem segunda verificação.'
  },
  dependency_impact: {
    name: 'Dependency Impact Critic',
    description:
      'Baseado no Code Graph: deteta se o raio de impacto da mudança excede o scope declarado e se componentes dependentes ficaram sem testes.',
    details: 'Alerta sobre IMPACT_EXCEEDS_DECLARED_SCOPE e AFFECTED_COMPONENTS_UNTESTED.'
  },
  historical_failure: {
    name: 'Historical Failure Critic',
    description:
      'Baseado no Evolution Graph: alerta se uma abordagem anteriormente rejeitada está a ser repetida ou se o componente é historicamente frágil.',
    details: 'Identifica PREVIOUSLY_REJECTED_APPROACH e HISTORICALLY_FRAGILE_COMPONENT.'
  },
  performance: {
    name: 'Performance Critic',
    description: 'Requer perfil de benchmark declarado pelo host.',
    details: 'Registado no kernel. Reporta UNAVAILABLE em vez de aprovação silenciosa.'
  },
  ux: {
    name: 'UX Critic',
    description: 'Requer capacidade de browser e perfil de interface.',
    details: 'Registado no kernel. Ativado condicionalmente com browser capability.'
  },
  code_quality: {
    name: 'Code Quality Critic',
    description: 'Requer comando de linter configurado no host contract.',
    details: 'Registado no kernel. Executa quando host_contract.commands.lint está configurado.'
  }
};

const EVIDENCE_LABELS: Record<string, string> = {
  changeset_and_host_contract: 'Changeset + Host Contract',
  baseline_comparison: 'Baseline Comparison (A/B)',
  execution_evidence: 'Execution Evidence',
  static_pattern_scan: 'Static Pattern Scan',
  structural_comparison: 'Structural Comparison',
  traceability: 'Traceability Matrix',
  integrity_verdict: 'Validator Artifacts',
  code_graph: 'Code Graph (AST / Imports)',
  evolution_graph: 'Evolution Graph (Ledger)',
  host_profile: 'Host Profile declarado'
};

export const GAUNTLET_CRITICS: CriticInfo[] = MANIFEST.critics.map((critic) => {
  const copy = CRITIC_COPY[critic.name];
  return {
    id: critic.name,
    name: copy?.name ?? critic.name,
    status: critic.status,
    description: copy?.description ?? critic.description,
    evidenceType: EVIDENCE_LABELS[critic.evidence_type] ?? critic.evidence_type,
    details: copy?.details ?? critic.description
  };
});

export const CRITICS_IMPLEMENTED_COUNT = MANIFEST.critics.filter(
  (c) => c.status === 'implemented'
).length;

export const CRITICS_REGISTERED_COUNT = MANIFEST.critics.length;

// ---------------------------------------------------------------------------
// Judge
// ---------------------------------------------------------------------------

const VERDICT_COPY: Record<string, { badgeClass: string; title: string; when: string }> = {
  ACCEPT: {
    badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    title: 'Mutação Aceite',
    when: 'Integridade ALLOW, zero regressões, zero findings bloqueantes no Gauntlet.'
  },
  REVISE: {
    badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    title: 'Revisão Solicitada',
    when: 'Findings corrigíveis e orçamento de revisões ainda disponível.'
  },
  ROLLBACK: {
    badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    title: 'Reversão Obrigatória',
    when: 'Violação de scope, falha de segurança, regressão comportamental ou orçamento esgotado.'
  },
  BLOCKED: {
    badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    title: 'Bloqueio / Espera Humana',
    when: 'Decisão humana pendente, ausência de relatório de execução ou revisão adversarial omissa.'
  }
};

export const JUDGE_VERDICTS = MANIFEST.judge_verdicts.map((entry) => ({
  verdict: entry.verdict,
  badgeClass: VERDICT_COPY[entry.verdict]?.badgeClass ?? 'bg-zinc-800 text-zinc-300 border-zinc-700',
  title: VERDICT_COPY[entry.verdict]?.title ?? entry.verdict,
  when: VERDICT_COPY[entry.verdict]?.when ?? '',
  /** Ação seguinte tal como o Judge a declara — não é paráfrase. */
  action: entry.next_action
}));

// ---------------------------------------------------------------------------
// Guardrails — incluindo os que ainda não são aplicados
// ---------------------------------------------------------------------------

const GUARDRAIL_COPY: Record<string, { tripsWhen: string; action: string }> = {
  HUMAN_STOP: {
    tripsWhen: 'Um operador humano executa "evolution stop" ou sinaliza interrupção.',
    action: 'Paragem imediata e persistência do estado atual.'
  },
  MAX_SPRINTS: {
    tripsWhen: 'O teto configurado de sprints no host_contract é atingido.',
    action: 'Interrupção para revisão de estratégia e orçamento.'
  },
  MAX_RUNTIME: {
    tripsWhen: 'O limite de tempo contínuo de relógio é ultrapassado.',
    action: 'Paragem segura para evitar loops infinitos.'
  },
  MAX_CONSECUTIVE_FAILURES: {
    tripsWhen: 'Falhas sucessivas repetidas sem recuperação no Gauntlet/Judge.',
    action: 'Transição para estado BLOCKED aguardando diagnóstico.'
  },
  NO_PROGRESS: {
    tripsWhen: 'Os critérios satisfeitos do Global Goal não avançam após N sprints.',
    action: 'Interrompe execução e sinaliza estagnação de hipótese.'
  },
  OSCILLATION: {
    tripsWhen: 'O loop alterna indefinidamente entre dois estados já vistos.',
    action: 'Deteta a oscilação pelo histórico de resultados e interrompe.'
  },
  RUNAWAY_GROWTH: {
    tripsWhen: 'O host cresce em volume de código além de um múltiplo tolerado.',
    action: 'Bloqueio de expansão descontrolada.'
  },
  REPEATED_ATTEMPT: {
    tripsWhen: 'Uma mutação já rejeitada é reproposta sob novo identificador.',
    action:
      'Registada por fingerprint no histórico de tentativas. Ainda não interrompe a execução — o protocolo declara-a como não aplicada.'
  }
};

export const GUARDRAILS_LIST: GuardrailItem[] = MANIFEST.guardrails.map((rail) => ({
  condition: rail.condition,
  tripsWhen: GUARDRAIL_COPY[rail.condition]?.tripsWhen ?? rail.trips_when,
  action: GUARDRAIL_COPY[rail.condition]?.action ?? rail.action,
  configurable: rail.configurable,
  enforced: rail.enforced
}));

export const GUARDRAILS_ENFORCED_COUNT = MANIFEST.guardrails.filter((g) => g.enforced).length;

export const HOST_DEFAULT_LIMITS = MANIFEST.default_limits;

// ---------------------------------------------------------------------------
// Modos de execução — a lista vem do run loop
// ---------------------------------------------------------------------------

const MODE_COPY: Record<string, Omit<ExecutionMode, 'id' | 'flag'>> = {
  'one-shot': {
    name: 'One-Shot Mode',
    description: 'Executa um único ciclo/sprint até ao veredito do Judge e encerra.',
    behavior:
      'Ideal para validações pontuais, testes de mutação controlados ou execuções passo a passo.',
    idealFor: 'Debug, inspeção de tarefas individuais e pipelines de CI/CD pontuais.'
  },
  continuous: {
    name: 'Continuous Mode',
    description:
      'Executa sprints consecutivamente até uma condição de paragem (guardrail) ou comando humano.',
    behavior: 'Sprint → Baseline → Gauntlet → Judge → Learn → Próximo Sprint em loop governado.',
    idealFor: 'Desenvolvimento prolongado supervisionado em segundo plano.'
  },
  'goal-driven': {
    name: 'Goal-Driven Mode',
    description:
      'Avança autonomamente enquanto o Global Goal não estiver completo e dentro dos guardrails.',
    behavior:
      'Avalia critérios verificáveis a cada iteração. Pára automaticamente quando o objetivo for atingido com evidências.',
    idealFor: 'Migrações arquiteturais completas, criação de produtos e evolução autónoma de hosts.'
  }
};

export const EXECUTION_MODES: ExecutionMode[] = MANIFEST.execution_modes.map((mode) => ({
  id: mode,
  flag: `--mode ${mode}`,
  name: MODE_COPY[mode]?.name ?? mode,
  description: MODE_COPY[mode]?.description ?? '',
  behavior: MODE_COPY[mode]?.behavior ?? '',
  idealFor: MODE_COPY[mode]?.idealFor ?? ''
}));

// ---------------------------------------------------------------------------
// Ciclo de vida — os caminhos de saída vêm do manifesto
// ---------------------------------------------------------------------------

/** Caminho real onde um estágio escreve, tal como o runtime o calcula. */
function artifactPath(stage: string): string {
  return MANIFEST.artifacts.find((a) => a.stage === stage)?.path ?? '—';
}

export const LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    id: 'goal',
    number: '00',
    name: 'Global Goal',
    module: 'core/global_goal.py',
    responsibility: 'Objetivo macro mensurável e critérios de sucesso estritamente verificáveis.',
    inputs: 'Declaração humana ou spec de inicialização',
    outputs: artifactPath('Global Goal'),
    accent: '#3b82f6'
  },
  {
    id: 'observe',
    number: '01',
    name: 'Observe',
    module: 'agents/observer_v0.py',
    responsibility: 'Reconstrói a verdade estrutural, ficheiros, comandos do host e scope real.',
    inputs: 'Diretório do host e regras de scope',
    outputs: artifactPath('Observe'),
    accent: '#06b6d4'
  },
  {
    id: 'diagnose',
    number: '02',
    name: 'Diagnose',
    module: 'core/bootstrap_spec.py',
    responsibility: 'Identifica identidade, afirmações, conflitos e gaps rastreáveis.',
    inputs: 'Snapshot estrutural e docs de intenção',
    outputs: '.evolution/runtime/bootstrap/bootstrap-report.json',
    accent: '#8b5cf6'
  },
  {
    id: 'plan',
    number: '03',
    name: 'Plan Sprint',
    module: 'engines/sprint.py',
    responsibility: 'Deriva o próximo avanço delimitado a partir do estado atual e gaps.',
    inputs: 'Gaps do diagnose e progresso do Global Goal',
    outputs: '.evolution/sprints/active-sprint.json',
    accent: '#ec4899'
  },
  {
    id: 'baseline_a',
    number: '04',
    name: 'Baseline (State A)',
    module: 'core/baseline.py',
    responsibility: 'Mede métricas estruturais e comportamentais antes de qualquer mutação.',
    inputs: 'Comandos do host e estado do filesystem',
    outputs: artifactPath('Baseline (State A)'),
    accent: '#f59e0b'
  },
  {
    id: 'build',
    number: '05',
    name: 'Build (Mutation)',
    module: 'agents/executor_v0.py',
    responsibility: 'Executa a mutação no branch de isolamento. Único estágio que toca no código.',
    inputs: 'Changeset proposto pelo agente/harness',
    outputs: 'Mutação em evolution/<execution_id>',
    accent: '#10b981'
  },
  {
    id: 'baseline_b',
    number: '06',
    name: 'Baseline (State B)',
    module: 'core/baseline.py',
    responsibility: 'Mede novamente o host pós-mutação e calcula a comparação A/B.',
    inputs: 'Estado resultante da mutação',
    outputs: artifactPath('Baseline comparison'),
    accent: '#f59e0b'
  },
  {
    id: 'gauntlet',
    number: '07',
    name: 'Gauntlet',
    module: 'engines/gauntlet.py',
    responsibility: 'Críticos adversariais independentes avaliam a mutação sob evidências.',
    inputs: 'Changeset, baseline comparison e host contract',
    outputs: artifactPath('Gauntlet'),
    accent: '#ef4444'
  },
  {
    id: 'judge',
    number: '08',
    name: 'Judge',
    module: 'engines/judge.py',
    responsibility: 'Produz veredito ordenado: ACCEPT, REVISE, ROLLBACK ou BLOCKED.',
    inputs: 'Relatórios do Gauntlet e baseline',
    outputs: artifactPath('Judge'),
    accent: '#6366f1'
  },
  {
    id: 'learn',
    number: '09',
    name: 'Learn & Persist',
    module: 'knowledge_curator & continuity',
    responsibility: 'Regista decisões, lições evidenciadas e reconstrói o CONTINUITY.md.',
    inputs: 'Veredito e evidências aprovadas',
    outputs: artifactPath('Event ledger'),
    accent: '#10b981'
  }
];

/** Tabela de artefactos completa, tal como publicada pelo protocolo. */
export const ARTIFACT_PATHS = MANIFEST.artifacts;

// ---------------------------------------------------------------------------
// Capacidades e critérios — derivados
// ---------------------------------------------------------------------------

export const CAPABILITIES_DISCOVERABLE = MANIFEST.capabilities.discoverable;
export const CAPABILITIES_DECLARATION_ONLY = MANIFEST.capabilities.declaration_only;
export const GOAL_CRITERION_KINDS = MANIFEST.goal.criterion_kinds;
export const GOAL_CRITERION_OUTCOMES = MANIFEST.goal.criterion_outcomes;
export const HOST_COMMAND_SLOTS = MANIFEST.command_slots;

// ---------------------------------------------------------------------------
// Conteúdo editorial (não derivável do código)
// ---------------------------------------------------------------------------

export const CONTINUITY_QUESTIONS = [
  { q: 'WHO AM I?', a: 'Versão do protocolo, tipo de workspace e contrato ativo.' },
  { q: 'WHAT IS THIS HOST?', a: 'Identity Graph, stack tecnológica e raízes de código-fonte.' },
  { q: 'WHAT IS THE GLOBAL GOAL?', a: '.evolution/goal/global-goal.json e critérios de sucesso.' },
  { q: 'WHAT HAS ALREADY HAPPENED?', a: 'Histórico de sprints concluídos, ciclos e vereditos.' },
  { q: 'WHAT IS THE CURRENT STATE?', a: 'Estado do host e progresso medido do objetivo.' },
  { q: 'WHAT IS THE CURRENT SPRINT?', a: '.evolution/sprints/active-sprint.json e tarefas ativas.' },
  { q: 'WHAT IS BLOCKED?', a: 'Decisões humanas pendentes e guardrails acionados.' },
  { q: 'WHAT SHOULD HAPPEN NEXT?', a: 'Uma única ação derivada com justificação determinística.' },
  { q: 'HOW DO I VALIDATE IT?', a: 'Comandos do host contract e caminhos protegidos.' }
];

export const GRAPH_BENCHMARK_DATA = {
  target: 'src/evolution_kernel/core/host_contract.py',
  nodes: 974,
  edges: 1469,
  buildTime: '0.36s',
  updateTime: '0.10s',
  storageSize: '787 KB',
  parseErrors: 0,
  metrics: [
    { label: 'Testes afetados descobertos', withoutGraph: 1, withGraph: 14, gain: '14× melhoria' },
    { label: 'Componentes dependentes mapeados', withoutGraph: 20, withGraph: 30, gain: '+50% cobertura' },
    { label: 'Ficheiros ordenados por distância de import', withoutGraph: 0, withGraph: 31, gain: '100% estruturado' },
    { label: 'Tokens de contexto consumidos', withoutGraph: '1497', withGraph: '1576', gain: '+5.3% (mínimo custo)' },
    { label: 'Confiança na análise de impacto', withoutGraph: 'Baixa (heurística)', withGraph: 'Alta (AST comprovado)', gain: 'Evidência real' }
  ]
};

export const ROADMAP_ITEMS = [
  {
    title: 'Goal-Driven Autonomous Cycles (v0.2.0)',
    status: 'Available',
    badge: 'Disponível',
    description:
      'Objetivos globais mensuráveis, comparação de baseline A/B, Gauntlet adversarial, Judge determinístico e continuidade entre agentes.',
    tag: 'Core Stable'
  },
  {
    title: 'Graph Intelligence & Code Graph (v0.3.0)',
    status: 'Available',
    badge: 'Disponível',
    description:
      'Indexação AST sem dependências externas, Evolution Graph histórico, análise de raio de impacto e critic de dependências.',
    tag: 'Graph Engine'
  },
  {
    title: 'Host Upgrade Path (v0.3.1)',
    status: 'Available',
    badge: 'Disponível',
    description:
      'evolution upgrade reconcilia um host instalado com uma versão mais recente do protocolo sem perder goal, sprints, ciclos, conhecimento ou ledger. --check reporta o inventário antes de tocar em qualquer coisa.',
    tag: 'Lifecycle'
  },
  {
    title: 'Self-Hosting Evolution Lab',
    status: 'Experimental',
    badge: 'Experimental / Lab',
    description:
      'Capacidade do EvoPro ser governado por si mesmo em ambiente controlado e isolado de laboratório.',
    tag: 'Research Lab'
  },
  {
    title: 'Rich Cognitive Gateway Ecosystem',
    status: 'Planned',
    badge: 'Planeado',
    description:
      'Expansão de adaptadores do Cognitive Gateway além de Gemini e mock para múltiplos provedores locais e remotos.',
    tag: 'Gateway'
  },
  {
    title: 'Call-Graph & Function-Level Impact',
    status: 'Planned',
    badge: 'Planeado',
    description:
      'Resolução de chamadas a nível de função em AST para granularidade ainda mais cirúrgica do raio de impacto.',
    tag: 'Graph Intelligence'
  },
  {
    title: 'Autonomous Multi-Agent Swarm Orchestration',
    status: 'Research',
    badge: 'Investigação',
    description:
      'Orquestração avançada em que múltiplos agentes de diferentes fornecedores atuam em papéis simultâneos no Gauntlet.',
    tag: 'Agent Swarm'
  }
];

export const USE_CASES = [
  {
    title: 'Projetos Existentes (Brownfield)',
    icon: 'Layers',
    desc: 'Instale o EvoPro num repositório ativo. O protocolo infere comandos de teste/build, mapeia o scope e permite evolução contínua sem quebrar código legado.'
  },
  {
    title: 'Novos Projetos (Greenfield)',
    icon: 'Sparkles',
    desc: 'Inicialize um repositório vazio, defina o Global Goal e permita que o loop guie a criação progressiva de arquitetura, testes e funcionalidades.'
  },
  {
    title: 'Agent Handoff Sem Fricção',
    icon: 'GitCompare',
    desc: 'Troque de Claude Code para Codex, Antigravity ou modelos locais a qualquer momento. O próximo agente reconstrói o contexto em segundos via CONTINUITY.md.'
  },
  {
    title: 'Laboratórios Experimentais',
    icon: 'FlaskConical',
    desc: 'Crie branches ou cópias isoladas de sistemas para permitir mutações adversariais intensivas e validar hipóteses de engenharia com métricas A/B.'
  },
  {
    title: 'Self-Hosting Research',
    icon: 'Cpu',
    desc: 'Investigação experimental de auto-evolução onde o EvoPro governa o seu próprio desenvolvimento dentro de guardrails estritos.'
  }
];
