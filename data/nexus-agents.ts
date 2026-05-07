/**
 * Registry de agentes NexusAI.
 * Agentes reais (isReal: true) são totalmente funcionais e têm um endpoint de API.
 * Agentes mock são exemplos de UI sem backend activo.
 */
import { SYSTEM_INSTRUCTION } from '@/agent/config';

export type AgentStatus = 'active' | 'inactive' | 'error';
/** 'chat' → LiveTestPanel   |   'cycle' → CyclePanel (run once, structured output) */
export type AgentType = 'chat' | 'cycle';

export interface NexusAgentTool {
  label: string;
  cls: string;
}

export interface NexusAgent {
  id: string;
  name: string;
  desc: string;
  iconBg: string;
  iconTxt: string;
  /** Short label shown in the table badge */
  model: string;
  /** Provider slug for the detail form */
  providerValue: string;
  /** Model slug for the detail form */
  modelValue: string;
  status: AgentStatus;
  tools: NexusAgentTool[];
  systemPrompt: string;
  lastExec: string;
  lastStatus: string;
  lastStatusCls: string;
  /** Health sparkline dots: 'bg-success' | 'bg-warning' | 'bg-danger' | 'bg-border' */
  health: string[];
  /** When true, the test tab is enabled against apiEndpoint */
  isReal?: boolean;
  /** 'chat' = conversation panel | 'cycle' = one-shot run panel */
  agentType?: AgentType;
  apiEndpoint?: string;
  /** Sub-agents for multi-agent systems */
  subAgents?: { name: string; role: string }[];
  /** Persisted extra data (variables, memory, etc.) for DB agents */
  metadata?: Record<string, unknown>;
}

export const NEXUS_AGENTS: NexusAgent[] = [
  /* ────────────────────────────────────────────────────────
     REAL AGENTS
  ──────────────────────────────────────────────────────── */
  {
    id:           'ag47-assistant',
    name:         'AG47 — Assistente Comercial',
    desc:         'Assistente de vendas premium. Qualifica leads, responde sobre serviços e agenda diagnósticos gratuitos.',
    iconBg:       'bg-primary/10',
    iconTxt:      'text-primary',
    model:        'Gemini 2.5 Flash',
    providerValue: 'google',
    modelValue:   'gemini-2.5-flash',
    status:       'active',
    agentType:    'chat',
    tools: [
      { label: 'get_company_info',          cls: 'bg-info/10 text-info border-info/20' },
      { label: 'qualify_lead',              cls: 'bg-success/10 text-success border-success/20' },
      { label: 'schedule_free_consultation',cls: 'bg-warning/10 text-warning border-warning/20' },
    ],
    systemPrompt: SYSTEM_INSTRUCTION,
    lastExec:     'A correr',
    lastStatus:   'Online',
    lastStatusCls: 'text-success',
    health:       ['bg-success', 'bg-success', 'bg-success'],
    isReal:       true,
    apiEndpoint:  '/api/agent/chat',
  },
  {
    id:           'liquidity-flow-crypto',
    name:         'Liquidity-Flow Crypto Agent',
    desc:         'Sistema multi-agente de trading. Analisa BTC.D, escaneia Top 50 altcoins e dimensiona posições com Kelly Criterion.',
    iconBg:       'bg-warning/10',
    iconTxt:      'text-warning',
    model:        'Gemini 2.0 Flash',
    providerValue: 'google',
    modelValue:   'gemini-2.0-flash',
    status:       'active',
    agentType:    'cycle',
    tools: [
      { label: 'run_full_analysis',  cls: 'bg-warning/10 text-warning border-warning/20' },
      { label: 'Binance API',        cls: 'bg-info/10 text-info border-info/20' },
      { label: 'CoinGecko',          cls: 'bg-success/10 text-success border-success/20' },
      { label: 'Fear & Greed Index', cls: 'bg-danger/10 text-danger border-danger/20' },
    ],
    systemPrompt: `# Liquidity-Flow Crypto Rotation Agent

Strategy: BTC.D → ETH/BTC → Altcoin Rotation
Universe: Top 50 USDT pairs on Binance
Risk Cap: 1.5% max per trade (Kelly Criterion, half-Kelly multiplier)
Cycle:    Every 30 minutes

## Market Phases
- BTC_DOMINANCE  → Capital Preservation (BTC.D rising)
- ETH_ROTATION   → Aggressive Entry (ETH/BTC breakout)
- ALTSEASON      → Risk-On (BTC.D falling + sideways)
- UNCERTAINTY    → Hold / Reduce Exposure

## Sub-Agents
1. Decision Hub    — LLM orchestrator, generates TradeProposals with full reasoning
2. Dominance Monitor — Fetches BTC.D from CoinGecko, classifies macro phase
3. Market Scanner  — Scans Top 50 for RVOL spikes, applies Correlation Guard
4. Risk Engine     — Kelly Criterion sizing, stop-loss, TP1/TP2 levels`,
    lastExec:     'Via CLI',
    lastStatus:   'Standby',
    lastStatusCls: 'text-text-muted',
    health:       ['bg-success', 'bg-success', 'bg-success'],
    isReal:       true,
    apiEndpoint:  '/api/agent/crypto/cycle',
    subAgents: [
      { name: 'Decision Hub',       role: 'Orquestrador LLM — gera TradeProposals com raciocínio completo' },
      { name: 'Dominance Monitor',  role: 'Monitoriza BTC.D e ETH/BTC, classifica a fase macro' },
      { name: 'Market Scanner',     role: 'Escaneia Top 50 altcoins por spikes de RVOL (Correlation Guard activo)' },
      { name: 'Risk Engine',        role: 'Kelly Criterion: dimensionamento de posição, stop-loss, TP1/TP2' },
    ],
  },

  /* ────────────────────────────────────────────────────────
     MOCK AGENTS (demonstração de UI)
  ──────────────────────────────────────────────────────── */
  {
    id:           'suporte-tier-1',
    name:         'Suporte Tier 1',
    desc:         'Atendimento inicial e triagem de tickets de suporte ao cliente.',
    iconBg:       'bg-info/10',
    iconTxt:      'text-info',
    model:        'GPT-4',
    providerValue: 'openai',
    modelValue:   'gpt-4o',
    status:       'active',
    tools: [
      { label: 'Zendesk', cls: 'bg-info/10 text-info border-info/20' },
      { label: 'Slack',   cls: 'bg-success/10 text-success border-success/20' },
      { label: '+2',      cls: 'bg-background text-text-muted border-border' },
    ],
    systemPrompt: `Você é um assistente de suporte ao cliente especializado da Agência47.\n\nSuas responsabilidades incluem:\n- Responder perguntas de clientes com base na documentação disponível\n- Escalonar tickets complexos para nível 2 quando necessário\n- Registrar interações no sistema CRM Zendesk\n\nDiretrizes de comportamento:\n- Seja sempre cordial, claro e objetivo\n- Nunca invente informações\n- Use as ferramentas disponíveis para buscar contexto\n\nVariáveis disponíveis: {{ customer_name }}, {{ ticket_id }}, {{ product_name }}`,
    lastExec:     'Há 2 min',
    lastStatus:   'Sucesso',
    lastStatusCls: 'text-text-muted',
    health:       ['bg-success', 'bg-success', 'bg-success'],
  },
  {
    id:           'analista-dados',
    name:         'Analista de Dados',
    desc:         'Gera queries SQL e analisa relatórios de vendas.',
    iconBg:       'bg-warning/10',
    iconTxt:      'text-warning',
    model:        'Gemini Opus',
    providerValue: 'google',
    modelValue:   'gemini-2.5-pro',
    status:       'active',
    tools: [
      { label: 'PostgreSQL', cls: 'bg-warning/10 text-warning border-warning/20' },
      { label: 'Tableau',    cls: 'bg-info/10 text-info border-info/20' },
    ],
    systemPrompt: `Você é um analista de dados especializado. Analise os dados fornecidos e gere insights acionáveis.`,
    lastExec:     'Há 15 min',
    lastStatus:   'Sucesso',
    lastStatusCls: 'text-text-muted',
    health:       ['bg-success', 'bg-success', 'bg-warning'],
  },
  {
    id:           'assistente-vendas',
    name:         'Assistente de Vendas',
    desc:         'Qualificação de leads e draft de emails de follow-up.',
    iconBg:       'bg-text-muted/10',
    iconTxt:      'text-text-muted',
    model:        'GPT-3.5',
    providerValue: 'openai',
    modelValue:   'gpt-3.5-turbo',
    status:       'error',
    tools: [
      { label: 'Salesforce', cls: 'bg-primary/10 text-primary border-primary/20' },
      { label: 'Gmail API',  cls: 'bg-danger/10 text-danger border-danger/20' },
    ],
    systemPrompt: `Você é um assistente de vendas. Qualifique leads e redija emails de follow-up personalizados.`,
    lastExec:     'Há 1 hora',
    lastStatus:   'Falha API',
    lastStatusCls: 'text-danger',
    health:       ['bg-success', 'bg-danger', 'bg-danger'],
  },
  {
    id:           'revisor-documentos',
    name:         'Revisor de Documentos',
    desc:         'Analisa e formata documentação técnica.',
    iconBg:       'bg-text-muted/10',
    iconTxt:      'text-text-muted',
    model:        'Llama 3',
    providerValue: 'local',
    modelValue:   'llama3',
    status:       'inactive',
    tools: [
      { label: 'Local Files', cls: 'bg-text-muted/10 text-text-muted border-border' },
    ],
    systemPrompt: `Você é um revisor técnico. Analise e formate documentação técnica seguindo os padrões da empresa.`,
    lastExec:     '-',
    lastStatus:   'Inativo',
    lastStatusCls: 'text-text-light',
    health:       ['bg-border', 'bg-border', 'bg-border'],
  },
];

/** Returns the agent for a given slug, or undefined */
export function getAgent(slug: string): NexusAgent | undefined {
  return NEXUS_AGENTS.find((a) => a.id === slug);
}
