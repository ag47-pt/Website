/**
 * Dados tipados e canónicos do EvoPro (Evolution Protocol) v0.3.0
 * Fonte: Base de código e documentação oficial em ag47-evolution-protocol
 */

export interface CliCommand {
  command: string;
  category: 'bootstrap' | 'lifecycle' | 'goal_sprint' | 'verification' | 'runtime' | 'intelligence' | 'audit';
  description: string;
  flags?: string[];
  example?: string;
  outputExample?: string;
}

export interface CriticInfo {
  id: string;
  name: string;
  status: 'implemented' | 'registered_unavailable' | 'planned';
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
}

export interface ExecutionMode {
  id: string;
  name: string;
  flag: string;
  description: string;
  behavior: string;
  idealFor: string;
}

export const EVOPRO_CONFIG = {
  name: 'EvoPro — Evolution Protocol',
  shortName: 'EvoPro',
  package: 'ag47-evolution-protocol',
  version: '0.3.0',
  cliCommand: 'evolution',
  license: 'MIT',
  copyright: '2026 Agência 47 Labs',
  author: 'Agência 47 Labs',
  email: 'dev@ag47.pt',
  canonicalUrl: 'https://ag47.pt/eco/evopro',
  gitHubUrl: 'https://github.com/ag47-pt/ag47-evolution-protocol',
  gitRemoteUrl: 'https://github.com/ag47-pt/ag47-evolution-protocol.git',
  documentationUrl: 'https://github.com/ag47-pt/ag47-evolution-protocol/tree/main/docs',
  installCommand: 'pip install git+https://github.com/ag47-pt/ag47-evolution-protocol.git',
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

export const LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    id: 'goal',
    number: '00',
    name: 'Global Goal',
    module: 'core/global_goal.py',
    responsibility: 'Objetivo macro mensurável e critérios de sucesso estritamente verificáveis.',
    inputs: 'Declaração humana ou spec de inicialização',
    outputs: '.evolution/goal/global-goal.json',
    accent: '#3b82f6'
  },
  {
    id: 'observe',
    number: '01',
    name: 'Observe',
    module: 'agents/observer_v0.py',
    responsibility: 'Reconstrói a verdade estrutural, ficheiros, comandos do host e scope real.',
    inputs: 'Diretório do host e regras de scope',
    outputs: '.evolution/runtime/snapshots/latest.json',
    accent: '#06b6d4'
  },
  {
    id: 'diagnose',
    number: '02',
    name: 'Diagnose',
    module: 'core/bootstrap_spec.py',
    responsibility: 'Identifica identidade, afirmações, conflitos e gaps rastreáveis.',
    inputs: 'Snapshot estrutural e docs de intenção',
    outputs: '.evolution/runtime/bootstrap_spec.json',
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
    outputs: '.evolution/runtime/baselines/before.json',
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
    outputs: '.evolution/runtime/baselines/comparison.json',
    accent: '#f59e0b'
  },
  {
    id: 'gauntlet',
    number: '07',
    name: 'Gauntlet',
    module: 'engines/gauntlet.py',
    responsibility: 'Críticos adversariais independentes avaliam a mutação sob evidências.',
    inputs: 'Changeset, baseline comparison e host contract',
    outputs: '.evolution/runtime/gauntlet/report.json',
    accent: '#ef4444'
  },
  {
    id: 'judge',
    number: '08',
    name: 'Judge',
    module: 'engines/judge.py',
    responsibility: 'Produz veredito ordenado: ACCEPT, REVISE, ROLLBACK ou BLOCKED.',
    inputs: 'Relatórios do Gauntlet e baseline',
    outputs: '.evolution/runtime/judge/verdict.json',
    accent: '#6366f1'
  },
  {
    id: 'learn',
    number: '09',
    name: 'Learn & Persist',
    module: 'knowledge_curator & continuity',
    responsibility: 'Regista decisões, lições evidenciadas e reconstrói o CONTINUITY.md.',
    inputs: 'Veredito e evidências aprovadas',
    outputs: '.evolution/CONTINUITY.md & ledger',
    accent: '#10b981'
  }
];

export const GAUNTLET_CRITICS: CriticInfo[] = [
  {
    id: 'scope',
    name: 'Scope Critic',
    status: 'implemented',
    description: 'Verifica se ficheiros protegidos ou fora de scope foram modificados e monitoriza orçamento de alterações.',
    evidenceType: 'Changeset + Host Contract',
    details: 'Impede mutações inadvertidas em ficheiros nucleares como .evolution/** ou .git/**.'
  },
  {
    id: 'regression',
    name: 'Regression Critic',
    status: 'implemented',
    description: 'Analisa a comparação de baseline State A vs State B em busca de regressões comportamentais ou estruturais.',
    evidenceType: 'Baseline Comparison (A/B)',
    details: 'Uma baseline ausente é classificada de imediato como finding impeditivo.'
  },
  {
    id: 'test',
    name: 'Test Critic',
    status: 'implemented',
    description: 'Valida se código alterado possui evidência de testes e se os critérios de aceitação foram comprovados.',
    evidenceType: 'Execution Evidence',
    details: 'Código de produção modificado sem execução de suites de teste gera alerta.'
  },
  {
    id: 'security',
    name: 'Security Critic',
    status: 'implemented',
    description: 'Varredura estática contra padrões perigosos: secrets hardcoded, shell=True, eval/exec, TLS desativado.',
    evidenceType: 'Static Pattern Scan',
    details: 'Proteção determinística imediata sem necessidade de conexão externa.'
  },
  {
    id: 'architecture',
    name: 'Architecture Critic',
    status: 'implemented',
    description: 'Garante conformidade com caminhos proibidos e limites arquiteturais declarados pelo host.',
    evidenceType: 'Structural Comparison',
    details: 'Valida se a mutação respeita boundaries e regras do evolution.config.json.'
  },
  {
    id: 'goal_alignment',
    name: 'Goal Alignment Critic',
    status: 'implemented',
    description: 'Deteta mutações órfãs, desvios de sprint e desconexão com o Global Goal.',
    evidenceType: 'Traceability Matrix',
    details: 'Garante que o esforço do agente converge estritamente para os critérios do host.'
  },
  {
    id: 'integrity',
    name: 'Integrity Critic',
    status: 'implemented',
    description: 'Reavaliação independente do veredito do validador e consistência dos relatórios.',
    evidenceType: 'Validator Artifacts',
    details: 'Nenhum ator valida as suas próprias mutações sem segunda verificação.'
  },
  {
    id: 'dependency_impact',
    name: 'Dependency Impact Critic',
    status: 'implemented',
    description: 'Baseado no Code Graph: deteta se o raio de impacto da mudança excede o scope declarado e se componentes dependentes ficaram sem testes.',
    evidenceType: 'Code Graph (AST / Imports)',
    details: 'Alerta sobre IMPACT_EXCEEDS_DECLARED_SCOPE e AFFECTED_COMPONENTS_UNTESTED.'
  },
  {
    id: 'historical_failure',
    name: 'Historical Failure Critic',
    status: 'implemented',
    description: 'Baseado no Evolution Graph: alerta se uma abordagem anteriormente rejeitada está a ser repetida ou se o componente é historicamente frágil.',
    evidenceType: 'Evolution Graph (Ledger)',
    details: 'Identifica PREVIOUSLY_REJECTED_APPROACH e HISTORICALLY_FRAGILE_COMPONENT.'
  },
  {
    id: 'performance',
    name: 'Performance Critic',
    status: 'registered_unavailable',
    description: 'Requer perfil de benchmark declarado pelo host. Reporta indisponível em vez de aprovação silenciosa.',
    evidenceType: 'Host Performance Profile',
    details: 'Status oficial: Registado no Kernel. Requer declaração do host para ativação.'
  },
  {
    id: 'ux',
    name: 'UX Critic',
    status: 'registered_unavailable',
    description: 'Requer capacidade de browser e perfil de interface. Reporta indisponível se não houver harness visual.',
    evidenceType: 'Browser / Visual Harness',
    details: 'Status oficial: Registado no Kernel. Ativado condicionalmente com browser capability.'
  },
  {
    id: 'code_quality',
    name: 'Code Quality Critic',
    status: 'registered_unavailable',
    description: 'Requer comando de linter configurado no host contract.',
    evidenceType: 'Host Lint Command',
    details: 'Status oficial: Registado no Kernel. Executa quando host_contract.commands.lint está configurado.'
  }
];

export const JUDGE_VERDICTS = [
  {
    verdict: 'ACCEPT',
    badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    title: 'Mutação Aceite',
    when: 'Integridade ALLOW, zero regressões, zero findings bloqueantes no Gauntlet.',
    action: 'Aprende evidências, persiste estado no CONTINUITY.md e reavalia o Global Goal.'
  },
  {
    verdict: 'REVISE',
    badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    title: 'Revisão Solicitada',
    when: 'Findings corrigíveis e orçamento de revisões ainda disponível.',
    action: 'Retorna a fase de PLANEAMENTO com os findings do Gauntlet como input.'
  },
  {
    verdict: 'ROLLBACK',
    badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    title: 'Reversão Obrigatória',
    when: 'Violação de scope, falha de segurança, regressão comportamental ou orçamento esgotado.',
    action: 'Abandona o branch de isolamento e arquiva a hipótese falhada no ledger.'
  },
  {
    verdict: 'BLOCKED',
    badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    title: 'Bloqueio / Espera Humana',
    when: 'Decisão humana pendente, ausência de relatório de execução ou revisão adversarial omissa.',
    action: 'Interrompe a autonomia com segurança e solicita resolução a um operador humano.'
  }
];

export const GUARDRAILS_LIST: GuardrailItem[] = [
  {
    condition: 'HUMAN_STOP',
    tripsWhen: 'Um operador humano executa "evolution stop" ou sinaliza interrupção.',
    action: 'Paragem imediata e persistência do estado atual.',
    configurable: false
  },
  {
    condition: 'MAX_SPRINTS',
    tripsWhen: 'O teto configurado de sprints no host_contract é atingido (ex: 25).',
    action: 'Interrupção para revisão de estratégia e orçamento.',
    configurable: true
  },
  {
    condition: 'MAX_RUNTIME',
    tripsWhen: 'O limite de tempo contínuo de relógio é ultrapassado.',
    action: 'Paragem segura para evitar loops infinitos.',
    configurable: true
  },
  {
    condition: 'MAX_CONSECUTIVE_FAILURES',
    tripsWhen: 'Falhas sucessivas repetidas sem recuperação no Gauntlet/Judge.',
    action: 'Transição para estado BLOCKED aguardando diagnóstico.',
    configurable: true
  },
  {
    condition: 'NO_PROGRESS',
    tripsWhen: 'Os critérios satisfeitos do Global Goal não avançam após N sprints.',
    action: 'Interrompe execução e sinaliza estagnação de hipótese.',
    configurable: true
  },
  {
    condition: 'OSCILLATION',
    tripsWhen: 'O loop alterna indefinidamente entre duas mutações antagónicas.',
    action: 'Deteta oscilação por fingerprint de intenção e interrompe.',
    configurable: true
  },
  {
    condition: 'REPEATED_ATTEMPT',
    tripsWhen: 'Uma mutação já rejeitada é reproposta sob novo identificador.',
    action: 'Rejeição imediata por fingerprint de caminhos e intenção.',
    configurable: true
  },
  {
    condition: 'RUNAWAY_GROWTH',
    tripsWhen: 'O host cresce em volume de código além de um múltiplo tolerado.',
    action: 'Bloqueio de expansão descontrolada.',
    configurable: true
  }
];

export const EXECUTION_MODES: ExecutionMode[] = [
  {
    id: 'one-shot',
    name: 'One-Shot Mode',
    flag: '--mode one-shot',
    description: 'Executa um único ciclo/sprint até ao veredito do Judge e encerra.',
    behavior: 'Ideal para validações pontuais, testes de mutação controlados ou execuções passo a passo.',
    idealFor: 'Debug, inspeção de tarefas individuais e pipelines de CI/CD pontuais.'
  },
  {
    id: 'continuous',
    name: 'Continuous Mode',
    flag: '--mode continuous',
    description: 'Executa sprints consecutivamente até uma condição de paragem (guardrail) ou comando humano.',
    behavior: 'Sprint -> Baseline -> Gauntlet -> Judge -> Learn -> Próximo Sprint em loop governado.',
    idealFor: 'Desenvolvimento prolongado supervisionado em segundo plano.'
  },
  {
    id: 'goal-driven',
    name: 'Goal-Driven Mode',
    flag: '--mode goal-driven',
    description: 'Avança autonomamente enquanto o Global Goal não estiver completo e dentro dos guardrails.',
    behavior: 'Avalia critérios verificáveis após cada sprint. Pára automaticamente quando o objetivo for atingido com evidências.',
    idealFor: 'Migrações arquiteturais completas, criação de produtos e evolução autônoma de hosts.'
  }
];

export const CLI_COMMANDS: CliCommand[] = [
  // Bootstrap & Init
  {
    command: 'evolution init',
    category: 'bootstrap',
    description: 'Instala o protocolo no host, cria a árvore .evolution/ e inicializa o host contract.',
    flags: [],
    example: 'evolution init',
    outputExample: 'Scanning repository...\nHarness detected: antigravity\nCapabilities: filesystem, terminal, git, test_runner\nGauntlet strategy: sequential_role_separation\nEvolution initialized successfully.'
  },
  {
    command: 'evolution doctor',
    category: 'bootstrap',
    description: 'Verifica a integridade do pacote EvoPro, schemas vinculados e estado do host.',
    flags: [],
    example: 'evolution doctor'
  },
  {
    command: 'evolution workspace',
    category: 'bootstrap',
    description: 'Deteta o tipo de workspace (HOST, KERNEL, PLAYGROUND, UNKNOWN).',
    flags: []
  },
  {
    command: 'evolution version',
    category: 'bootstrap',
    description: 'Apresenta a versão do EvoPro instalada e metadados de build.',
    flags: []
  },
  // Diagnosis & Spec
  {
    command: 'evolution inspect',
    category: 'lifecycle',
    description: 'Executa o Observer para mapear ficheiros, linguagens, comandos e scope real.',
    flags: ['--dry-run']
  },
  {
    command: 'evolution spec',
    category: 'lifecycle',
    description: 'Executa Analyst + Planner para diagnosticar identidade, gaps e gerar o roadmap.',
    flags: ['--regenerate', '--json', '--verbose', 'questions', 'confirm --id DEC-001 --answer CONFIRM']
  },
  // Goal & Sprint
  {
    command: 'evolution goal set',
    category: 'goal_sprint',
    description: 'Define o Global Goal mensurável com critérios de sucesso verificáveis.',
    flags: ['--force'],
    example: 'evolution goal set "Transformar este host num SaaS pronto para produção"',
    outputExample: 'Global Goal established.\nObjective: Transformar este host num SaaS pronto para produção\nCriteria: 4 verifiable criteria derived from host contract.'
  },
  {
    command: 'evolution goal show',
    category: 'goal_sprint',
    description: 'Apresenta o objetivo global ativo e a avaliação mais recente dos critérios.',
    flags: []
  },
  {
    command: 'evolution goal evaluate',
    category: 'goal_sprint',
    description: 'Reavalia os critérios de sucesso contra a realidade atual do host.',
    flags: ['--no-commands']
  },
  {
    command: 'evolution sprint next',
    category: 'goal_sprint',
    description: 'Deriva e gera o próximo sprint executável a partir dos gaps pendentes.',
    flags: ['--no-commands']
  },
  {
    command: 'evolution sprint status',
    category: 'goal_sprint',
    description: 'Exibe o sprint ativo, itens de trabalho e estado de execução.',
    flags: []
  },
  {
    command: 'evolution sprint list',
    category: 'goal_sprint',
    description: 'Lista o histórico de todos os sprints gerados no host.',
    flags: []
  },
  // Verification: Baseline, Gauntlet & Judge
  {
    command: 'evolution baseline capture',
    category: 'verification',
    description: 'Regista as métricas estruturais e comportamentais do host no momento.',
    flags: ['--label before|after', '--no-commands']
  },
  {
    command: 'evolution baseline compare',
    category: 'verification',
    description: 'Compara os baselines State A e State B, classificando cada dimensão.',
    flags: ['--before before', '--after after']
  },
  {
    command: 'evolution gauntlet run',
    category: 'verification',
    description: 'Dispara a revisão adversarial com os críticos selecionados.',
    flags: ['--critics scope,security,regression']
  },
  {
    command: 'evolution judge',
    category: 'verification',
    description: 'Processa evidências e emite o veredito (ACCEPT / REVISE / ROLLBACK / BLOCKED).',
    flags: []
  },
  // Runtime Loop
  {
    command: 'evolution run',
    category: 'runtime',
    description: 'Inicia o loop de evolução governada no modo especificado.',
    flags: ['--mode one-shot|continuous|goal-driven', '--max-iterations N', '--no-commands'],
    example: 'evolution run --mode goal-driven'
  },
  {
    command: 'evolution status',
    category: 'runtime',
    description: 'Apresenta o estado global: progresso do objetivo, sprint ativo e guardrails.',
    flags: []
  },
  {
    command: 'evolution next',
    category: 'runtime',
    description: 'Recomenda a única próxima ação determinística necessária, com a sua razão.',
    flags: []
  },
  {
    command: 'evolution pause | resume | stop',
    category: 'runtime',
    description: 'Controla a execução do loop (pausa, retoma ou interrompe com motivo).',
    flags: ['--reason "motivo"']
  },
  {
    command: 'evolution tick',
    category: 'runtime',
    description: 'Avança um único passo na máquina de estados da tarefa ativa.',
    flags: []
  },
  // Intelligence & Graph
  {
    command: 'evolution graph status',
    category: 'intelligence',
    description: 'Informa provedor de grafo, nós, arestas, arquivos indexados e staleness.',
    flags: []
  },
  {
    command: 'evolution graph build',
    category: 'intelligence',
    description: 'Constrói ou atualiza incrementalmente o Code Graph do host.',
    flags: ['--provider ast|regex|null', '--incremental']
  },
  {
    command: 'evolution graph impact',
    category: 'intelligence',
    description: 'Analisa o raio de alcance e impacto de dependências de um ou mais ficheiros.',
    flags: ['<target>', '--depth N'],
    example: 'evolution graph impact src/evolution_kernel/core/host_contract.py --depth 3'
  },
  {
    command: 'evolution cognitive status',
    category: 'intelligence',
    description: 'Exibe o pedido cognitivo pendente para agentes externos.',
    flags: []
  },
  {
    command: 'evolution context',
    category: 'intelligence',
    description: 'Monta o contexto relevante ponderado para a tarefa ativa.',
    flags: ['"<tarefa>"', '--no-files']
  },
  // Audit & Continuity
  {
    command: 'evolution continuity',
    category: 'audit',
    description: 'Reconstrói o estado integral do repositório para novos agentes.',
    flags: ['--markdown'],
    example: 'evolution continuity --markdown'
  },
  {
    command: 'evolution guardrails show',
    category: 'audit',
    description: 'Exibe os limites de segurança ativos e contadores de tentativas.',
    flags: ['reset']
  },
  {
    command: 'evolution history',
    category: 'audit',
    description: 'Lista o histórico ordenado de ciclos, sprints e decisões tomadas.',
    flags: ['--limit N']
  },
  {
    command: 'evolution audit',
    category: 'audit',
    description: 'Audita a consistência do ledger, conhecimento adquirido e hashes.',
    flags: []
  }
];

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
    description: 'Objetivos globais mensuráveis, comparação de baseline A/B, Gauntlet adversarial, Judge determinístico e continuidade entre agentes.',
    tag: 'Core Stable'
  },
  {
    title: 'Graph Intelligence & Code Graph (v0.3.0)',
    status: 'Available',
    badge: 'Disponível',
    description: 'Indexação AST sem dependências externas, Evolution Graph histórico, análise de raio de impacto e critic de dependências.',
    tag: 'Graph Engine'
  },
  {
    title: 'Self-Hosting Evolution Lab',
    status: 'Experimental',
    badge: 'Experimental / Lab',
    description: 'Capacidade do EvoPro ser governado por si mesmo em ambiente controlado e isolado de laboratório.',
    tag: 'Research Lab'
  },
  {
    title: 'Rich Cognitive Gateway Ecosystem',
    status: 'Planned',
    badge: 'Planeado',
    description: 'Expansão de adaptadores do Cognitive Gateway além de Gemini e mock para múltiplos provedores locais e remotos.',
    tag: 'Gateway'
  },
  {
    title: 'Call-Graph & Function-Level Impact',
    status: 'Planned',
    badge: 'Planeado',
    description: 'Resolução de chamadas a nível de função em AST para granularidade ainda mais cirúrgica do raio de impacto.',
    tag: 'Graph Intelligence'
  },
  {
    title: 'Autonomous Multi-Agent Swarm Orchestration',
    status: 'Research',
    badge: 'Investigação',
    description: 'Orquestração avançada em que múltiplos agentes de diferentes fornecedores atuam em papéis simultâneos no Gauntlet.',
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
