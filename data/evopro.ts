/**
 * Dados tipados e canónicos do EvoPro (Evolution Protocol) v0.3.1
 * Fonte de Verdade: metadata/public-manifest.json, README.md e documentação arquitetural oficial.
 * O Website possui estritamente função de apresentação.
 */

export interface CliCommand {
  command: string;
  category: 'bootstrap' | 'second_brain' | 'telemetry' | 'lifecycle' | 'goal_sprint' | 'verification' | 'runtime' | 'intelligence' | 'audit';
  description: string;
  flags?: string[];
  example?: string;
  outputExample?: string;
}

export interface CapabilityItem {
  id: string;
  label: string;
  status: 'VALIDATED' | 'IMPLEMENTED' | 'OBSERVED' | 'PARTIAL' | 'UNKNOWN';
  source: string;
  description: string;
  epistemicTier: 'NATIVE' | 'ESTIMATED' | 'UNKNOWN';
  details: string;
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

export interface CognitivePhase {
  id: string;
  number: string;
  name: string;
  description: string;
  evidenceProduced: string;
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
  version: '0.3.1',
  maturity: 'real-host-validation',
  maturityLabel: 'Validação em Host Real',
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
  tagline: 'Understand before changing. Prove before remembering. Measure before claiming improvement.',
  subtitle: 'The intelligence can change. The protocol stays with the project.',
  interactionModel: 'agent-first',
  corePrinciples: [
    {
      id: 'agent-first',
      title: 'Agent-First Operation',
      description: 'O humano fornece intenção e decisões. O agente coordena descoberta, adoção, contexto, execução segura e recomendações sem exigir comando manual do terminal.'
    },
    {
      id: 'existing-memory',
      title: 'Existing-Memory Adoption',
      description: 'Documentação e memória canónica pré-existente (ex: evolution/) são indexadas em modo leitura (HOST_CANONICAL_READ_ONLY) e nunca destruídas.'
    },
    {
      id: 'memory-isolation',
      title: 'Strict Memory Isolation',
      description: 'A memória canónica soberana do host permanece estritamente separada do runtime efêmero (.evolution/runtime/) e do conhecimento curado (.evolution/knowledge/).'
    },
    {
      id: 'router-readiness',
      title: 'Context Router Readiness',
      description: 'Verificação e preparação automática de índices candidatos (ensure_router_index_ready) com modos explícitos: NATIVE, ADOPTED_MEMORY, FALLBACK e COLD_BOOT.'
    },
    {
      id: 'epistemology',
      title: 'Epistemological Classification',
      description: 'Cada facto é classificado como NATIVE (medido), ESTIMATED (calculado com base declarada) ou UNKNOWN (não exposto; nunca inventado).'
    },
    {
      id: 'fail-open',
      title: 'Fail-Open Instrumentation',
      description: 'A telemetria e observabilidade operam sem bloquear a execução: falhas de I/O ou registo de métricas nunca interrompem a tarefa funcional.'
    },
    {
      id: 'continuity',
      title: 'Cognitive Continuity',
      description: 'O estado cognitivo vive no disco, garantindo continuidade imediata entre turnos, sessões e diferentes modelos de IA sem recomeçar do zero.'
    },
    {
      id: 'cognitive-reuse',
      title: 'Cognitive Reuse & Empirical Telemetry',
      description: 'Reuso cognitivo qualitativo observado em host real. A amortização de interações humanas completas está em validação via modelo a nível de interação.'
    },
    {
      id: 'reference-isolation',
      title: 'Universal Reference Isolation',
      description: 'Hosts reais de validação (como o AG Menu) servem estritamente como evidência empírica, nunca como ontologia fixa ou conhecimento incorporado.'
    }
  ]
};

export const COGNITIVE_PHASES: CognitivePhase[] = [
  {
    id: 'p01',
    number: '01',
    name: 'Preflight & Reconnaissance',
    description: 'Deteção de tipo de workspace (HOST/KERNEL), shell, SO e capacidades de execução.',
    evidenceProduced: 'Runtime Environment Snapshot',
    accent: '#06b6d4'
  },
  {
    id: 'p02',
    number: '02',
    name: 'Source of Truth Discovery',
    description: 'Mapeamento de documentação existente, specs e adoção de memória soberana.',
    evidenceProduced: 'Adopted Memory Manifest (Read-Only)',
    accent: '#3b82f6'
  },
  {
    id: 'p03',
    number: '03',
    name: 'System & Architecture Model',
    description: 'Reconstrução de runtime, boundaries, módulos, camadas e fluxo de dados.',
    evidenceProduced: 'Inferred System & Architecture Graph',
    accent: '#8b5cf6'
  },
  {
    id: 'p04',
    number: '04',
    name: 'Domain Discovery & Contracts',
    description: 'Identificação de entidades de negócio, APIs, schemas e interfaces de integração.',
    evidenceProduced: 'Domain Candidates & Contract Map',
    accent: '#ec4899'
  },
  {
    id: 'p05',
    number: '05',
    name: 'Risk Audit & Decisions',
    description: 'Auditoria de fragilidades estruturais, hotspots e reconstrução de decisões arquiteturais.',
    evidenceProduced: 'Risk Candidates Ledger & ADR Timeline',
    accent: '#f59e0b'
  },
  {
    id: 'p06',
    number: '06',
    name: 'Context Router & Governance',
    description: 'Indexação automática de candidatos e aplicação de regras de contenção e autorização.',
    evidenceProduced: 'Router Indices & Agent Constraints Policy',
    accent: '#10b981'
  },
  {
    id: 'p07',
    number: '07',
    name: 'Semantic History & Certification',
    description: 'Sincronização de histórico, validação cruzada e certificação do estado cognitivo.',
    evidenceProduced: 'Certified Second Brain State Snapshot',
    accent: '#14b8a6'
  }
];

export const CONTEXT_ROUTING_MODES = [
  {
    mode: 'NATIVE',
    badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    title: 'Native Second Brain Index',
    description: 'Índices JSON estruturados existentes sob .evolution/runtime/second-brain/ ou .evolution/knowledge/.',
    when: 'Quando o Second Brain foi executado nativamente neste host.'
  },
  {
    mode: 'ADOPTED_MEMORY',
    badgeClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    title: 'Adopted Host Memory',
    description: 'Índices extraídos automaticamente a partir da memória canónica adotada (ex: evolution/).',
    when: 'Quando o host possui documentação soberana e os índices foram preparados sem mutação.'
  },
  {
    mode: 'FALLBACK_CANONICAL_INDEX',
    badgeClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    title: 'Fallback Canonical Index',
    description: 'Extração direta do INDEX.md canónico do host quando os índices estruturados ainda não estão prontos.',
    when: 'Fallback resiliente em hosts maduros recém-adotados.'
  },
  {
    mode: 'COLD_BOOT',
    badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    title: 'Cold Boot Discovery',
    description: 'Inspeção cirúrgica de ficheiros primários e AST quando não existe qualquer memória prévia.',
    when: 'Projetos greenfield ou primeira inicialização limpa.'
  },
  {
    mode: 'DEGRADED_OPERATION',
    badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    title: 'Degraded Operation',
    description: 'Operação mínima fail-open com declaração explícita de incerteza e contexto reduzido.',
    when: 'Corrupção de ficheiros ou permissões restritas de leitura.'
  }
];

export const TELEMETRY_EPISTEMIC_TAXONOMY = [
  {
    tier: 'NATIVE',
    badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    label: 'Medição Direta / Facto',
    examples: ['Duração em segundos', 'Arquivos lidos/modificados', 'Modo de routing ativo', 'Saída de testes'],
    description: 'Valores medidos diretamente pelo kernel ou sistema operativo. Certeza operacional 1.0.'
  },
  {
    tier: 'ESTIMATED',
    badgeClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    label: 'Estimativa com Base Declarada',
    examples: ['Tokens de contexto (char_count // 4)', 'Re-leituras de ficheiros evitadas', 'Custo monetário'],
    description: 'Aproximações calculadas explicitando a fórmula de derivação. Nunca apresentado como benchmark absoluto.'
  },
  {
    tier: 'UNKNOWN',
    badgeClass: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    label: 'Sinal Não Exposto',
    examples: ['Tokens reais faturados por harness opaco', 'Cache hit rate de provedor fechado'],
    description: 'Sinais não expostos pelo ambiente. O EvoPro reporta UNKNOWN e recusa fabricar números.'
  }
];

export const REAL_HOST_VALIDATION_DATA = {
  hostName: 'AG Menu',
  pilotDate: '2026-08-28',
  verdict: 'PASS',
  evidenceDocument: 'docs/REAL_HOST_PILOT_AGMENU_2026-08.md',
  keyFindings: [
    {
      title: 'Descoberta e Adoção de Memória Soberana',
      detail: 'Adotou o diretório evolution/ em modo HOST_CANONICAL_READ_ONLY sem sobrescrever a documentação do host.'
    },
    {
      title: 'Reuso Cognitivo Qualitativo',
      detail: 'A primeira tarefa pagou o custo de entendimento; as tarefas subsequentes reutilizaram o contexto e executaram intervenções cirúrgicas.'
    },
    {
      title: 'Validação Comportamental A/B',
      detail: '44/44 testes de regressão aprovados na correção de permissões, com 29 falhas pré-correção demonstrando baseline A/B real.'
    },
    {
      title: 'Fecho do Gate de Index Readiness',
      detail: 'A falha de roteamento nativo inicial foi corrigida com ensure_router_index_ready e validada com 100% de sucesso.'
    },
    {
      title: 'Não Alegação de Produção Universal',
      detail: 'O piloto comprova viabilidade em host real maduro; validação multi-host em produção segue em andamento controlado.'
    }
  ]
};

export const CAPABILITIES_MANIFEST: CapabilityItem[] = [
  {
    id: 'existing-memory-adoption',
    label: 'Existing Memory Adoption',
    status: 'VALIDATED',
    source: 'Second Brain Agent',
    epistemicTier: 'NATIVE',
    description: 'Indexação de memória pré-existente (evolution/) sob regime HOST_CANONICAL_READ_ONLY.',
    details: 'Validado em host real no piloto AG Menu sem mutação na documentação soberana.'
  },
  {
    id: 'context-router',
    label: 'Context Router (Auto-Readiness & ADOPTED_MEMORY)',
    status: 'VALIDATED',
    source: 'context_router.py',
    epistemicTier: 'NATIVE',
    description: 'Roteamento contextual delimitado por tarefa com preparação automática de índices.',
    details: 'Modos NATIVE, ADOPTED_MEMORY e fallbacks validados com suite de 425 testes.'
  },
  {
    id: 'cognitive-amortization-telemetry',
    label: 'Cognitive Amortization Telemetry (Operational Phase)',
    status: 'VALIDATED',
    source: 'cognitive_telemetry.py',
    epistemicTier: 'NATIVE',
    description: 'Instrumentação fail-open de duração, tokens estimados e economia por fases operacionais.',
    details: 'Comparações de sessão A ↔ B em JSON e Markdown geradas com segurança.'
  },
  {
    id: 'cognitive-reuse',
    label: 'Cross-turn Qualitative Cognitive Reuse',
    status: 'VALIDATED',
    source: 'Real Host Pilot',
    epistemicTier: 'NATIVE',
    description: 'Reutilização comprovada de contexto adquirido entre tarefas consecutivas no mesmo repositório.',
    details: 'Observado empiricamente na redução de leituras de ficheiros após a avaliação inicial.'
  },
  {
    id: 'agent-governance',
    label: 'Agent Governance & Risk Constraints',
    status: 'IMPLEMENTED',
    source: 'SecondBrainStructuralAgent',
    epistemicTier: 'NATIVE',
    description: 'Restrição de limites de autorização, caminhos protegidos e preferência por mudanças mínimas.',
    details: 'Implementado no Kernel e validado em cenários de isolamento adversarial.'
  },
  {
    id: 'risk-intelligence',
    label: 'Risk Intelligence & Vulnerability Audit',
    status: 'VALIDATED',
    source: 'second_brain_agent.py',
    epistemicTier: 'NATIVE',
    description: 'Auditoria e classificação de candidatos a risco sem perder contexto entre sessões.',
    details: 'Identificou vulnerabilidades de RBAC/Firestore e guiou a remediação no piloto real.'
  },
  {
    id: 'semantic-history',
    label: 'Semantic History & Decision Reconstruction',
    status: 'VALIDATED',
    source: 'Knowledge Curator',
    epistemicTier: 'NATIVE',
    description: 'Rastreabilidade de ADRs, decisões anteriores e causas raízes arquivadas no disco.',
    details: 'Preserva a razão de ser da arquitetura para novos agentes de IA.'
  },
  {
    id: 'agent-chat-ux',
    label: 'AG47.pt / EvoPro IDE Chat UX',
    status: 'VALIDATED',
    source: 'EVOPRO_AGENT_CHAT_UX.md',
    epistemicTier: 'NATIVE',
    description: 'Apresentação humana em Markdown com ownership explícito e tokens semânticos estáveis.',
    details: 'Cabeçalhos explícitos (# AG47.pt 🧠 EvoPro...) e única próxima ação recomendada.'
  },
  {
    id: 'real-host-agent-first',
    label: 'Agent-First Real-Host IDE Interaction',
    status: 'VALIDATED',
    source: 'AG Menu Pilot',
    epistemicTier: 'NATIVE',
    description: 'Operação orientada à intenção onde o agente seleciona e executa ferramentas sem ônus ao operador.',
    details: 'Validado em ambiente real com Antigravity / Gemini CLI.'
  },
  {
    id: 'evolution-engine',
    label: 'Goal / Sprint / Baseline / Gauntlet / Judge',
    status: 'IMPLEMENTED',
    source: 'engines/',
    epistemicTier: 'NATIVE',
    description: 'Kernel de governança para ciclos de mutação, baselines A/B e vereditos determinísticos.',
    details: '425 testes unitários e de integração cobrindo 100% dos fluxos de ciclo.'
  },
  {
    id: 'graph-intelligence',
    label: 'Code Graph AST & Impact Analysis',
    status: 'IMPLEMENTED',
    source: 'core/graph_provider.py',
    epistemicTier: 'NATIVE',
    description: 'Grafo estrutural em Python stdlib AST para cálculo determinístico de raio de impacto.',
    details: 'Mapeamento de dependências, nós e arestas com degradação segura.'
  }
];

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
    name: 'Observe & Adopt',
    module: 'agents/observer_v0.py',
    responsibility: 'Reconstrói a verdade estrutural, ficheiros, comandos do host e adota memória soberana.',
    inputs: 'Diretório do host e regras de scope',
    outputs: '.evolution/runtime/snapshots/latest.json',
    accent: '#06b6d4'
  },
  {
    id: 'diagnose',
    number: '02',
    name: 'Diagnose & Second Brain',
    module: 'agents/second_brain_agent.py',
    responsibility: 'Diagnostica identidade, domínios, contratos, riscos e prepara os índices do Router.',
    inputs: 'Snapshot estrutural e memória do host',
    outputs: '.evolution/runtime/second-brain/state.json',
    accent: '#8b5cf6'
  },
  {
    id: 'plan',
    number: '03',
    name: 'Plan Sprint',
    module: 'engines/sprint.py',
    responsibility: 'Deriva o próximo avanço delimitado a partir do estado atual e gaps prioritários.',
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
    name: 'Gauntlet Critics',
    module: 'engines/gauntlet.py',
    responsibility: 'Críticos adversariais independentes avaliam a mutação sob evidências rigorosas.',
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
    name: 'Learn & Telemetry',
    module: 'knowledge_curator & telemetry',
    responsibility: 'Regista decisões, lições evidenciadas, telemetria de amortização e reconstrói CONTINUITY.md.',
    inputs: 'Veredito e evidências aprovadas',
    outputs: '.evolution/CONTINUITY.md & telemetry ledger',
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
    tripsWhen: 'Um operador humano executa "evolution stop" ou sinaliza interrupção no chat.',
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
  // Second Brain & Cognitive Architecture
  {
    command: 'evolution second-brain init',
    category: 'second_brain',
    description: 'Inicializa o Second Brain no host e descobre fontes de verdade sem tocar no código de aplicação.',
    flags: [],
    example: 'evolution second-brain init',
    outputExample: 'Initializing Second Brain...\nDiscovered memory: evolution/ (HOST_CANONICAL_READ_ONLY)\nRouter readiness: Auto-indexed 14 domains, 8 contracts\nSecond Brain state initialized.'
  },
  {
    command: 'evolution second-brain assess',
    category: 'second_brain',
    description: 'Executa a avaliação cognitiva rápida do repositório, identificando gaps, riscos e próxima ação.',
    flags: ['--format markdown|json'],
    example: 'evolution second-brain assess'
  },
  {
    command: 'evolution second-brain route',
    category: 'second_brain',
    description: 'Gera um pacote de contexto delimitado para a intenção do utilizador (NATIVE / ADOPTED_MEMORY).',
    flags: ['"<intenção>"', '--mode native|adopted|fallback'],
    example: 'evolution second-brain route "melhorar autenticação de funcionários"'
  },
  {
    command: 'evolution second-brain adopt-memory',
    category: 'second_brain',
    description: 'Adota explicitamente um diretório de documentação soberana do host em modo leitura restrita.',
    flags: ['--memory <path>'],
    example: 'evolution second-brain adopt-memory --memory evolution'
  },
  // Telemetry & Amortization
  {
    command: 'evolution second-brain telemetry status',
    category: 'telemetry',
    description: 'Exibe o status dos registos de telemetria cognitiva e sessões rastreadas no host.',
    flags: []
  },
  {
    command: 'evolution second-brain telemetry list',
    category: 'telemetry',
    description: 'Lista todas as sessões operacionais registadas no ledger de telemetria (.evolution/runtime/telemetry/).',
    flags: ['--limit N']
  },
  {
    command: 'evolution second-brain telemetry compare',
    category: 'telemetry',
    description: 'Compara duas sessões operacionais (ex: Cold Boot vs Warm Session) e gera relatório de economia.',
    flags: ['--session-a <id>', '--session-b <id>', '--format markdown|json'],
    example: 'evolution second-brain telemetry compare --session-a sess_cold --session-b sess_warm --format markdown'
  },
  {
    command: 'evolution second-brain telemetry report',
    category: 'telemetry',
    description: 'Gera o relatório de telemetria cognitiva da sessão atual ou mais recente.',
    flags: ['--session latest']
  },
  // Bootstrap & Init
  {
    command: 'evolution init',
    category: 'bootstrap',
    description: 'Instala o protocolo no host, cria a árvore .evolution/ e inicializa o host contract.',
    flags: [],
    example: 'evolution init'
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
  // Goal & Sprint
  {
    command: 'evolution goal set',
    category: 'goal_sprint',
    description: 'Define o Global Goal mensurável com critérios de sucesso verificáveis.',
    flags: ['--force'],
    example: 'evolution goal set "Concluir auditoria de segurança e migrar permissões"'
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
  // Intelligence & Graph
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
  // Audit & Continuity
  {
    command: 'evolution continuity',
    category: 'audit',
    description: 'Reconstrói o estado integral do repositório para novos agentes.',
    flags: ['--markdown'],
    example: 'evolution continuity --markdown'
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
  { q: 'WHAT IS THIS HOST?', a: 'Identity Graph, stack tecnológica e memória canónica adotada.' },
  { q: 'WHAT IS THE GLOBAL GOAL?', a: '.evolution/goal/global-goal.json e critérios de sucesso.' },
  { q: 'WHAT HAS ALREADY HAPPENED?', a: 'Histórico de sprints concluídos, ciclos e vereditos.' },
  { q: 'WHAT IS THE CURRENT STATE?', a: 'Estado do host e progresso medido do objetivo.' },
  { q: 'WHAT IS THE CURRENT SPRINT?', a: '.evolution/sprints/active-sprint.json e tarefas ativas.' },
  { q: 'WHAT IS BLOCKED?', a: 'Decisões humanas pendentes e guardrails acionados.' },
  { q: 'WHAT SHOULD HAPPEN NEXT?', a: 'Uma única ação derivada com justificação determinística.' },
  { q: 'HOW DO I VALIDATE IT?', a: 'Comandos do host contract e caminhos protegidos.' }
];

export const ROADMAP_ITEMS = [
  {
    title: 'Cognitive Architecture & Second Brain V1 (v0.3.1)',
    status: 'Available',
    badge: 'Disponível',
    description: 'Adoção de memória soberana (HOST_CANONICAL_READ_ONLY), Context Router com auto-readiness, telemetria de amortização fail-open e operação agent-first.',
    tag: 'Cognitive Core'
  },
  {
    title: 'Goal-Driven Autonomous Cycles (v0.2.0)',
    status: 'Available',
    badge: 'Disponível',
    description: 'Objetivos globais mensuráveis, comparação de baseline A/B, Gauntlet adversarial com 9 críticos e Judge determinístico.',
    tag: 'Evolution Engine'
  },
  {
    title: 'Graph Intelligence & Code Graph AST (v0.3.0)',
    status: 'Available',
    badge: 'Disponível',
    description: 'Indexação AST em Python standard library sem dependências pesadas, cálculo de raio de impacto e critic de dependências.',
    tag: 'Graph Engine'
  },
  {
    title: 'Multi-Host Cross-Harness Validation',
    status: 'In Validation',
    badge: 'Em Validação / Gate Ativo',
    description: 'Evolução da telemetria de fases operacionais para modelo interativo completo e expansão de pilotos empíricos em múltiplos hosts e IDEs.',
    tag: 'Active Gate'
  },
  {
    title: 'Rich Cognitive Gateway Multi-Provider',
    status: 'Planned',
    badge: 'Planeado',
    description: 'Expansão dos adaptadores do Cognitive Gateway além de Gemini e mock para múltiplos provedores locais e remotos.',
    tag: 'Gateway'
  },
  {
    title: 'Call-Graph & Function-Level Impact',
    status: 'Planned',
    badge: 'Planeado',
    description: 'Resolução de chamadas a nível de função em AST para granularidade ainda mais cirúrgica do raio de impacto.',
    tag: 'Graph Intelligence'
  }
];

export const KNOWN_LIMITATIONS_DATA = [
  {
    title: 'Interação Agent-First em Validação Multi-Host',
    desc: 'Passou com sucesso no seu primeiro piloto maduro em host real (AG Menu), mas ainda não é declarada como universalmente certificada em produção em todos os ecossistemas.'
  },
  {
    title: 'Telemetria de Amortização por Fases Operacionais',
    desc: 'Mede nativamente duração e re-leituras evitadas em fases internas; a amortização quantitativa de conversas humanas completas está em evolução para modelo interaction-level.'
  },
  {
    title: 'Capacidades de Harness Tratam UNKNOWN com Rigor',
    desc: 'Se o harness não declarar ou expor uma capacidade (browser, subagentes), o EvoPro classifica como UNKNOWN e adota fallback seguro sem falsos positivos.'
  },
  {
    title: 'Memória Cognitiva Não Substitui Evidência Primária',
    desc: 'A memória orienta a recuperação de contexto, mas qualquer alteração deve sempre ser cruzada com os ficheiros de código reais no disco.'
  },
  {
    title: 'Confiança Estrutural Variável por Linguagem',
    desc: 'Python possui indexação AST completa (confiança 1.0); TypeScript/JavaScript utiliza inferência regex (confiança 0.5 declarada).'
  }
];

export const USE_CASES = [
  {
    title: 'Repositórios Existentes (Brownfield)',
    icon: 'Layers',
    desc: 'Instale o EvoPro num repositório ativo. O protocolo adota a documentação existente (evolution/) como memória soberana de leitura e infere comandos de teste e scope.'
  },
  {
    title: 'Novos Projetos (Greenfield)',
    icon: 'Sparkles',
    desc: 'Inicialize um repositório vazio, defina o Global Goal e permita que o Second Brain e o loop guiem a criação progressiva de arquitetura, testes e contratos.'
  },
  {
    title: 'Agent Handoff Sem Fricção',
    icon: 'GitCompare',
    desc: 'Troque de Claude Code para Codex, Antigravity ou modelos locais a qualquer momento. O próximo agente reconstrói o contexto em segundos via CONTINUITY.md e Second Brain.'
  },
  {
    title: 'Auditoria de Riscos e ADRs',
    icon: 'ShieldCheck',
    desc: 'Mantenha um registo persistente de fraquezas arquiteturais, decisões tomadas e regras de negócio sem que desapareçam ao fechar a janela do chat.'
  },
  {
    title: 'Laboratórios Experimentais de Evolução',
    icon: 'FlaskConical',
    desc: 'Valide hipóteses de engenharia com métricas A/B, Gauntlet adversarial de 9 críticos e vereditos determinísticos antes de qualquer merge no main.'
  }
];

export interface GraphBenchmarkMetric {
  label: string;
  withoutGraph: string | number;
  withGraph: string | number;
  gain: string;
}

export interface GraphBenchmark {
  target: string;
  nodes: number;
  edges: number;
  buildTime: string;
  updateTime: string;
  storageSize: string;
  parseErrors: number;
  metrics: GraphBenchmarkMetric[];
}

export const GRAPH_BENCHMARK_DATA: GraphBenchmark = {
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
