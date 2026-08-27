/**
 * Dados tipados e canónicos do EvoPro (Evolution Protocol) v0.3.1
 * Fonte: Base de código e documentação oficial em ag47-evolution-protocol
 */

export interface CliCommand { command:string; category:'bootstrap'|'lifecycle'|'goal_sprint'|'verification'|'runtime'|'intelligence'|'audit'; description:string; flags?:string[]; example?:string; outputExample?:string; }
export interface CriticInfo { id:string; name:string; status:'implemented'|'registered_unavailable'|'planned'; description:string; evidenceType:string; details:string; }
export interface LifecycleStage { id:string; number:string; name:string; module:string; responsibility:string; inputs:string; outputs:string; accent:string; }
export interface GuardrailItem { condition:string; tripsWhen:string; action:string; configurable:boolean; }
export interface ExecutionMode { id:string; name:string; flag:string; description:string; behavior:string; idealFor:string; }

export const EVOPRO_CONFIG={name:'EvoPro — Evolution Protocol',shortName:'EvoPro',package:'ag47-evolution-protocol',version:'0.3.1',cliCommand:'evolution',license:'MIT',copyright:'2026 Agência 47 Labs',author:'Agência 47 Labs',email:'dev@ag47.pt',canonicalUrl:'https://ag47.pt/eco/evopro',gitHubUrl:'https://github.com/ag47-pt/ag47-evolution-protocol',gitRemoteUrl:'https://github.com/ag47-pt/ag47-evolution-protocol.git',documentationUrl:'https://github.com/ag47-pt/ag47-evolution-protocol/tree/main/docs',installCommand:'pip install git+https://github.com/ag47-pt/ag47-evolution-protocol.git',doctorCommand:'evolution doctor',tagline:'Understand before changing. Prove before remembering. Measure before claiming improvement.',subtitle:'You provide intent. EvoPro provides context, workflow and governance.',corePrinciples:['Repository-native','Harness-agnostic','Model-agnostic','Memory-aware','Evidence-driven','Goal-driven','Graph-enhanced']};

export const LIFECYCLE_STAGES:LifecycleStage[]=[
{id:'goal',number:'00',name:'Global Goal',module:'core/global_goal.py',responsibility:'Objetivo macro mensurável e critérios de sucesso estritamente verificáveis.',inputs:'Declaração humana ou spec de inicialização',outputs:'.evolution/goal/global-goal.json',accent:'#3b82f6'},
{id:'observe',number:'01',name:'Observe',module:'agents/observer_v0.py',responsibility:'Reconstrói a verdade estrutural, ficheiros, comandos do host e scope real.',inputs:'Diretório do host e regras de scope',outputs:'.evolution/runtime/snapshots/latest.json',accent:'#06b6d4'},
{id:'diagnose',number:'02',name:'Diagnose',module:'core/bootstrap_spec.py',responsibility:'Identifica identidade, afirmações, conflitos e gaps rastreáveis.',inputs:'Snapshot estrutural e docs de intenção',outputs:'.evolution/runtime/bootstrap_spec.json',accent:'#8b5cf6'},
{id:'plan',number:'03',name:'Plan Sprint',module:'engines/sprint.py',responsibility:'Deriva o próximo avanço delimitado a partir do estado atual e gaps.',inputs:'Gaps do diagnose e progresso do Global Goal',outputs:'.evolution/sprints/active-sprint.json',accent:'#ec4899'},
{id:'baseline_a',number:'04',name:'Baseline (State A)',module:'core/baseline.py',responsibility:'Mede métricas estruturais e comportamentais antes de qualquer mutação.',inputs:'Comandos do host e estado do filesystem',outputs:'.evolution/runtime/baselines/before.json',accent:'#f59e0b'},
{id:'build',number:'05',name:'Build (Mutation)',module:'agents/executor_v0.py',responsibility:'Executa a mutação no branch de isolamento. Único estágio que toca no código.',inputs:'Changeset proposto pelo agente/harness',outputs:'Mutação em evolution/<execution_id>',accent:'#10b981'},
{id:'baseline_b',number:'06',name:'Baseline (State B)',module:'core/baseline.py',responsibility:'Mede novamente o host pós-mutação e calcula a comparação A/B.',inputs:'Estado resultante da mutação',outputs:'.evolution/runtime/baselines/comparison.json',accent:'#f59e0b'},
{id:'gauntlet',number:'07',name:'Gauntlet',module:'engines/gauntlet.py',responsibility:'Críticos adversariais independentes avaliam a mutação sob evidências.',inputs:'Changeset, baseline comparison e host contract',outputs:'.evolution/runtime/gauntlet/report.json',accent:'#ef4444'},
{id:'judge',number:'08',name:'Judge',module:'engines/judge.py',responsibility:'Produz veredito ordenado: ACCEPT, REVISE, ROLLBACK ou BLOCKED.',inputs:'Relatórios do Gauntlet e baseline',outputs:'.evolution/runtime/judge/verdict.json',accent:'#6366f1'},
{id:'learn',number:'09',name:'Learn & Persist',module:'knowledge_curator & continuity',responsibility:'Regista decisões, lições evidenciadas e reconstrói continuidade.',inputs:'Veredito e evidências aprovadas',outputs:'.evolution/CONTINUITY.md & ledger',accent:'#10b981'}];

export const GAUNTLET_CRITICS:CriticInfo[]=[
{id:'scope',name:'Scope Critic',status:'implemented',description:'Verifica scope e ficheiros protegidos.',evidenceType:'Changeset + Host Contract',details:'Impede mutações fora dos boundaries.'},
{id:'regression',name:'Regression Critic',status:'implemented',description:'Analisa Baseline A/B por regressões.',evidenceType:'Baseline Comparison',details:'Baseline ausente é impeditiva.'},
{id:'test',name:'Test Critic',status:'implemented',description:'Valida evidência de testes.',evidenceType:'Execution Evidence',details:'Mudança sem teste gera finding.'},
{id:'security',name:'Security Critic',status:'implemented',description:'Varredura estática de padrões perigosos.',evidenceType:'Static Pattern Scan',details:'Secrets, shell perigoso, eval/exec e TLS inseguro.'},
{id:'architecture',name:'Architecture Critic',status:'implemented',description:'Valida boundaries arquiteturais.',evidenceType:'Structural Comparison',details:'Respeita host contract.'},
{id:'goal_alignment',name:'Goal Alignment Critic',status:'implemented',description:'Detecta mutações órfãs e desvio do objetivo.',evidenceType:'Traceability Matrix',details:'Mantém convergência.'},
{id:'integrity',name:'Integrity Critic',status:'implemented',description:'Reavalia integridade independentemente.',evidenceType:'Validator Artifacts',details:'Autor não é único juiz.'},
{id:'dependency_impact',name:'Dependency Impact Critic',status:'implemented',description:'Usa Code Graph para blast radius.',evidenceType:'Code Graph',details:'Detecta impacto fora do scope.'},
{id:'historical_failure',name:'Historical Failure Critic',status:'implemented',description:'Usa histórico para abordagens rejeitadas.',evidenceType:'Evolution Graph',details:'Evita repetição cega.'},
{id:'performance',name:'Performance Critic',status:'registered_unavailable',description:'Requer benchmark do host.',evidenceType:'Host Performance Profile',details:'Indisponível sem perfil.'},
{id:'ux',name:'UX Critic',status:'registered_unavailable',description:'Requer browser/visual harness.',evidenceType:'Browser / Visual Harness',details:'Indisponível sem capacidade.'},
{id:'code_quality',name:'Code Quality Critic',status:'registered_unavailable',description:'Requer lint configurado.',evidenceType:'Host Lint Command',details:'Condicional ao host.'}];

export const JUDGE_VERDICTS=[
{verdict:'ACCEPT',badgeClass:'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',title:'Mutação Aceite',when:'Integridade ALLOW, zero regressões e zero findings bloqueantes.',action:'Aprende evidências, persiste estado e reavalia o Goal.'},
{verdict:'REVISE',badgeClass:'bg-amber-500/20 text-amber-400 border-amber-500/30',title:'Revisão Solicitada',when:'Findings corrigíveis e orçamento disponível.',action:'Retorna ao planeamento com findings.'},
{verdict:'ROLLBACK',badgeClass:'bg-rose-500/20 text-rose-400 border-rose-500/30',title:'Reversão Obrigatória',when:'Violação de scope, segurança ou regressão.',action:'Reverte/abandona mutação isolada e preserva evidência.'},
{verdict:'BLOCKED',badgeClass:'bg-blue-500/20 text-blue-400 border-blue-500/30',title:'Bloqueio / Espera Humana',when:'Decisão humana ou evidência indispensável pendente.',action:'Interrompe autonomia com segurança.'}];

export const GUARDRAILS_LIST:GuardrailItem[]=[
{condition:'HUMAN_STOP',tripsWhen:'Operador solicita interrupção.',action:'Paragem e persistência.',configurable:false},{condition:'MAX_SPRINTS',tripsWhen:'Teto de sprints atingido.',action:'Revisão de estratégia.',configurable:true},{condition:'MAX_RUNTIME',tripsWhen:'Limite de tempo ultrapassado.',action:'Paragem segura.',configurable:true},{condition:'MAX_CONSECUTIVE_FAILURES',tripsWhen:'Falhas sucessivas.',action:'BLOCKED.',configurable:true},{condition:'NO_PROGRESS',tripsWhen:'Goal não avança.',action:'Sinaliza estagnação.',configurable:true},{condition:'OSCILLATION',tripsWhen:'Alternância entre mutações antagónicas.',action:'Interrompe oscilação.',configurable:true},{condition:'REPEATED_ATTEMPT',tripsWhen:'Abordagem rejeitada reaparece.',action:'Bloqueia repetição.',configurable:true},{condition:'RUNAWAY_GROWTH',tripsWhen:'Blast radius cresce fora do orçamento.',action:'Interrompe expansão.',configurable:true}];

export const EXECUTION_MODES:ExecutionMode[]=[
{id:'safe',name:'Safe',flag:'--mode safe',description:'Máxima supervisão e gates.',behavior:'Escala cedo e exige evidência forte.',idealFor:'Hosts críticos e adoção inicial.'},{id:'balanced',name:'Balanced',flag:'--mode balanced',description:'Autonomia governada.',behavior:'Executa trabalho seguro e escala ambiguidade material.',idealFor:'Desenvolvimento normal.'},{id:'goal-driven',name:'Goal-Driven',flag:'--mode goal-driven',description:'Loop orientado ao Global Goal.',behavior:'Planeia sprints sucessivos sob guardrails.',idealFor:'Evolução contínua governada.'}];

export const ROADMAP_ITEMS=[
{tag:'COGNITIVE',title:'Cognitive Architecture V1',description:'Perception, memory, context routing, governance, risk intelligence e semantic continuity.',status:'Available',badge:'IMPLEMENTED'},
{tag:'AGENT UX',title:'Agent-first IDE Interaction',description:'Intenção humana é traduzida pelo agente em contexto, workflow e tool use.',status:'Experimental',badge:'REAL-HOST GATE'},
{tag:'PILOT',title:'AG Menu Real Host Pilot',description:'Primeiro teste end-to-end da experiência Agent-first numa IDE real.',status:'Planned',badge:'NEXT'},
{tag:'SELF AUDIT',title:'EvoPro Transversal Audit',description:'Auditar o próprio protocolo contra a nova Cognitive Architecture.',status:'Planned',badge:'AFTER PILOT'},
{tag:'GRAPH',title:'Cross-language Graph Coverage',description:'Aumentar parsing estrutural com confiança explícita por linguagem.',status:'Planned',badge:'PLANNED'},
{tag:'HARNESS',title:'Capability Adapters',description:'Expandir integrações sem acoplar o kernel a um fornecedor.',status:'Planned',badge:'PLANNED'}];

export const CODE_GRAPH_BENCHMARK={repository:'ag47-evolution-protocol',language:'Python',files:64,nodes:270,edges:1340,fullIndexTime:'< 1s',incrementalUpdateTime:'~0.10s',storageSize:'< 1 MB',parseErrors:0,withoutGraph:{affectedTests:1,dependentComponents:20,filesRanked:0,contextTokens:1497},withGraph:{affectedTests:14,dependentComponents:30,filesRanked:31,contextTokens:1576},note:'Benchmark deve ser tratado como evidência histórica do repositório medido; métricas não reexecutadas não devem ser apresentadas como atuais.'};

export const CLI_COMMANDS:CliCommand[]=[
{command:'evolution doctor',category:'verification',description:'Verifica instalação e ambiente.'},{command:'evolution second-brain init',category:'bootstrap',description:'Inicia ou retoma bootstrap cognitivo.'},{command:'evolution second-brain assess',category:'intelligence',description:'Avalia saúde e próxima ação cognitiva.'},{command:'evolution second-brain adopt-memory --memory evolution',category:'intelligence',description:'Adota memória canônica existente read-only.'},{command:'evolution second-brain route "<task intent>"',category:'intelligence',description:'Constrói contexto limitado para uma intenção.'},{command:'evolution second-brain pilot-compare --gold evolution',category:'audit',description:'Compara cognição gerada contra gold standard humano.'},{command:'evolution goal set "<objective>"',category:'goal_sprint',description:'Define Global Goal verificável.'},{command:'evolution run --mode goal-driven',category:'lifecycle',description:'Executa evolução orientada ao Goal.'},{command:'evolution audit',category:'audit',description:'Executa auditoria do estado governado.'}];

export const CONTINUITY_QUESTIONS=[
{q:'WHO AM I?',a:'Versão do protocolo, identidade AG47.pt / EvoPro e capacidades disponíveis.'},
{q:'WHAT IS THIS HOST?',a:'Arquitetura, stack, domínios, boundaries e fontes primárias do repositório.'},
{q:'WHAT MEMORY EXISTS?',a:'Memória cognitiva construída pelo EvoPro ou memória canônica existente adotada read-only.'},
{q:'WHAT HAS ALREADY HAPPENED?',a:'Decisões, riscos, histórico semântico, sprints, ciclos e evidências persistidas.'},
{q:'WHAT IS THE CURRENT STATE?',a:'CURRENT separado de TARGET, saúde, gates e limitações conhecidas.'},
{q:'WHAT IS RELEVANT NOW?',a:'Context Router seleciona domínios, contratos, riscos, decisões e evidências para a intenção atual.'},
{q:'WHAT IS BLOCKED?',a:'Guardrails, riscos, capacidade ausente e decisões que exigem autoridade humana.'},
{q:'WHAT SHOULD HAPPEN NEXT?',a:'Uma ação recomendada com razão, impacto esperado e forma de validação.'}
];

export const USE_CASES=[
{title:'Repositórios existentes',icon:'Layers',desc:'Adota memória existente, reconcilia documentação com código e orienta evolução sem recomeçar o contexto do zero.'},
{title:'Sessões longas com coding agents',icon:'Cpu',desc:'Mantém continuidade, riscos, contratos e decisões disponíveis entre LLMs e sessões.'},
{title:'Mudanças arquiteturais',icon:'GitCompare',desc:'Roteia contexto, estima impacto, preserva boundaries e exige validação proporcional ao blast radius.'},
{title:'Evolução governada',icon:'FlaskConical',desc:'Transforma objetivos verificáveis em sprints, baseline A/B, Gauntlet, Judge e aprendizagem persistente.'},
{title:'Troca de harness ou modelo',icon:'Sparkles',desc:'Permite substituir Codex, Claude, Gemini ou outras LLMs sem perder a memória operacional do projeto.'},
{title:'Auditoria e risco contínuo',icon:'ShieldCheck',desc:'Mantém fragilidades, dívida técnica, vulnerabilidades e gaps visíveis em vez de enterrados em chats.'}
];
