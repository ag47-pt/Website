'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronRight, Copy, Trash2, TestTube2, Save,
  Wrench, Database, Zap, Variable, Send, Bot, User, Loader2, AlertCircle,
  Play, TrendingUp, ShieldAlert, Activity, Network, Check,
  Plus, X, Eye, EyeOff, Key, Brain, Clock, RefreshCw,
} from 'lucide-react';
import { getAgent, type NexusAgent } from '@/data/nexus-agents';

const STATUS_MAP = {
  active:   { label: 'Ativo',   cls: 'bg-success/10 text-success border-success/20',  dot: 'bg-success' },
  inactive: { label: 'Inativo', cls: 'bg-border/40 text-text-muted border-border',     dot: 'bg-border'  },
  error:    { label: 'Erro',    cls: 'bg-danger/10 text-danger border-danger/20',      dot: 'bg-danger'  },
};

const PROVIDER_LABELS: Record<string, string> = {
  openai: 'OpenAI', google: 'Google AI', anthropic: 'Anthropic', local: 'Local (Ollama)',
};

interface AgentVariable { id: string; key: string; value: string; secret: boolean; }
interface AgentMemoryEntry { id: string; content: string; createdAt: string; }

interface ChatMessage { role: 'user' | 'assistant'; content: string; }

function LiveTestPanel({ endpoint }: { endpoint: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput(''); setError('');
    const history = messages;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply: string = data.response ?? data.message ?? '(sem resposta)';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-[900px] w-full">
      <div className="bg-surface border border-border rounded-[20px] shadow-card overflow-hidden flex flex-col" style={{ minHeight: '520px' }}>
        <div className="p-4 border-b border-border/50 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success nexus-pulse-dot" />
          <span className="text-sm font-semibold text-text-main">Chat ao Vivo</span>
          <span className="ml-auto text-xs text-text-muted bg-background border border-border px-2 py-0.5 rounded-md">{endpoint}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 nexus-scrollbar" style={{ minHeight: '380px', maxHeight: '480px' }}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center"><Bot size={22} className="text-primary" /></div>
              <p className="text-sm font-medium text-text-main">Inicia uma conversa</p>
              <p className="text-xs text-text-muted max-w-[280px]">Escreve uma mensagem para testar o agente em tempo real.</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                m.role === 'user' ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
              }`}>{m.role === 'user' ? <User size={14} /> : <Bot size={14} />}</div>
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-primary text-white rounded-tr-sm'
                  : 'bg-background border border-border text-text-main rounded-tl-sm'
              }`}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Bot size={14} className="text-primary" /></div>
              <div className="flex items-center gap-2 px-4 py-3 bg-background border border-border rounded-2xl rounded-tl-sm">
                <Loader2 size={14} className="text-primary animate-spin" />
                <span className="text-sm text-text-muted">A pensar...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/20 rounded-xl text-sm text-danger">
              <AlertCircle size={14} />{error}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="p-4 border-t border-border/50 flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Escreve uma mensagem..."
            className="flex-1 px-4 py-2.5 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <button onClick={send} disabled={!input.trim() || loading}
            className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-xl shadow-soft hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >{loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}</button>
        </div>
      </div>
      {messages.length > 0 && (
        <button onClick={() => { setMessages([]); setError(''); }} className="self-start text-sm text-text-muted hover:text-danger transition-colors">Limpar conversa</button>
      )}
    </div>
  );
}

/* ─── CyclePanel — for multi-agent cycle systems (crypto, etc.) ─────────── */
interface MacroSummary {
  phase?: string;
  btcDominance?: number;
  [key: string]: unknown;
}
interface CycleResult {
  timestamp: string;
  accountBalance: number;
  llmOutput: string;
  macroSummary: MacroSummary | null;
  proposals: unknown[];
  proposalCount: number;
  enterCount: number;
  scanBlocked: boolean;
  blockedReason: string | null;
}

function CyclePanel({ endpoint }: { endpoint: string }) {
  const [balance, setBalance] = useState('1000');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CycleResult | null>(null);
  const [error, setError] = useState('');

  const runCycle = async () => {
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountBalance: parseFloat(balance) || 1000 }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as Record<string, unknown>;
        throw new Error(String(err.error ?? `HTTP ${res.status}`));
      }
      const data = await res.json() as CycleResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[960px] w-full">
      {/* Run controls */}
      <div className="bg-surface border border-border rounded-[20px] shadow-card p-6 flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-text-main mb-1.5">Saldo da Conta (USDC)</label>
          <input
            type="number" value={balance} onChange={(e) => setBalance(e.target.value)}
            className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <button
          onClick={runCycle} disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium shadow-soft hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
          {loading ? 'A analisar mercado...' : 'Executar Ciclo'}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-danger/10 border border-danger/20 rounded-[16px] text-sm text-danger">
          <AlertCircle size={16} />{error}
        </div>
      )}

      {loading && (
        <div className="bg-surface border border-border rounded-[20px] shadow-card p-8 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center">
            <Activity size={24} className="text-warning animate-pulse" />
          </div>
          <p className="font-semibold text-text-main">Ciclo de análise em curso</p>
          <p className="text-sm text-text-muted max-w-[320px]">
            A consultar BTC.D, ETH/BTC, Top 50 altcoins e Fear & Greed Index…<br />
            Pode demorar 30–60 segundos.
          </p>
        </div>
      )}

      {result && (
        <>
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Fase Macro',     value: result.macroSummary?.phase ?? '—',             icon: TrendingUp,   cls: 'text-info' },
              { label: 'BTC Dominance',  value: result.macroSummary?.btcDominance != null ? `${Number(result.macroSummary.btcDominance).toFixed(1)}%` : '—', icon: Activity, cls: 'text-warning' },
              { label: 'Propostas',      value: String(result.proposalCount),                   icon: Network,      cls: 'text-primary' },
              { label: 'ENTER Verdicts', value: String(result.enterCount),                      icon: ShieldAlert,  cls: result.enterCount > 0 ? 'text-success' : 'text-text-muted' },
            ].map(({ label, value, icon: Icon, cls }) => (
              <div key={label} className="bg-surface border border-border rounded-[16px] shadow-card p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-background flex items-center justify-center shrink-0 ${cls}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-xs text-text-muted">{label}</p>
                  <p className="text-base font-bold text-text-main leading-tight">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {result.scanBlocked && (
            <div className="flex items-center gap-3 p-4 bg-danger/10 border border-danger/20 rounded-[16px] text-sm text-danger">
              <ShieldAlert size={16} className="shrink-0" />
              <span><strong>Correlation Guard activo</strong> — {result.blockedReason ?? 'Scan de altcoins bloqueado.'}</span>
            </div>
          )}

          {/* LLM Output */}
          <div className="bg-surface border border-border rounded-[20px] shadow-card overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="text-base font-bold text-text-main">Análise do Agente</h3>
              <span className="text-xs text-text-muted">{result.timestamp}</span>
            </div>
            <div className="bg-[#1E1E1E] p-5 max-h-[560px] overflow-y-auto nexus-scrollbar">
              <pre className="text-[#D4D4D4] text-sm font-mono whitespace-pre-wrap leading-6">{result.llmOutput || '(sem output de texto)'}</pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function AgenteDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug ?? '';

  // Agent: try static registry first, then DB
  const staticAgent = getAgent(slug);
  const [agent, setAgent] = useState<NexusAgent | null>(staticAgent ?? null);
  const [loadingAgent, setLoadingAgent] = useState(!staticAgent);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (staticAgent) return; // already found in static registry
    fetch(`/api/nexus/agents/${slug}`)
      .then((r) => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
      .then((d: unknown) => {
        if (!d) return;
        const row = (d as { agent: Record<string, unknown> }).agent;
        // Convert DB row to NexusAgent shape
        const a: NexusAgent = {
          id:            String(row.slug),
          name:          String(row.name),
          desc:          String(row.description ?? ''),
          iconBg:        String(row.icon_bg ?? 'bg-info/10'),
          iconTxt:       String(row.icon_txt ?? 'text-info'),
          model:         String(row.model_label ?? row.model),
          providerValue: String(row.provider),
          modelValue:    String(row.model),
          status:        (row.status as NexusAgent['status']) ?? 'active',
          agentType:     (row.agent_type as NexusAgent['agentType']) ?? 'chat',
          tools:         Array.isArray(row.tools) ? (row.tools as NexusAgent['tools']) : [],
          systemPrompt:  String(row.system_prompt ?? ''),
          lastExec:      '—',
          lastStatus:    'DB',
          lastStatusCls: 'text-text-muted',
          health:        ['bg-success', 'bg-success', 'bg-success'],
          isReal:        false,
          metadata:      row.metadata as Record<string, unknown> | undefined,
        };
        setAgent(a);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoadingAgent(false));
  }, [slug, staticAgent]);

  const [activeTab, setActiveTab] = useState('config');
  const [temperature, setTemperature] = useState(0.7);

  // Controlled config state (for editable DB agents)
  const [editName, setEditName]     = useState('');
  const [editDesc, setEditDesc]     = useState('');
  const [editModel, setEditModel]   = useState('');
  const [editPrompt, setEditPrompt] = useState('');
  const [saving, setSaving]         = useState(false);
  const [saveMsg, setSaveMsg]       = useState<'ok' | 'err' | ''>('');
  // Tools CRUD
  const [editTools, setEditTools]         = useState<NexusAgent['tools']>([]);
  const [showAddTool, setShowAddTool]     = useState(false);
  const [newToolLabel, setNewToolLabel]   = useState('');
  // Variables
  const [variables, setVariables]         = useState<AgentVariable[]>([]);
  const [showAddVar, setShowAddVar]       = useState(false);
  const [newVarKey, setNewVarKey]         = useState('');
  const [newVarVal, setNewVarVal]         = useState('');
  const [newVarSecret, setNewVarSecret]   = useState(false);
  const [showVarValues, setShowVarValues] = useState<Record<string, boolean>>({});
  // Memory
  const [memory, setMemory]     = useState<AgentMemoryEntry[]>([]);
  const [newMemory, setNewMemory] = useState('');
  // Delete
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!agent) return;
    setEditName(agent.name);
    setEditDesc(agent.desc);
    setEditModel(agent.modelValue);
    setEditPrompt(agent.systemPrompt);
    setTemperature(0.7);
    setEditTools(agent.tools ?? []);
    const meta = agent.metadata ?? {};
    setVariables(Array.isArray(meta.variables) ? (meta.variables as AgentVariable[]) : []);
    setMemory(Array.isArray(meta.memory) ? (meta.memory as AgentMemoryEntry[]) : []);
  }, [agent]);

  const isBuiltIn = Boolean(staticAgent);

  const handleDelete = useCallback(async () => {
    if (!agent || isBuiltIn) return;
    if (!confirm(`Eliminar o agente "${agent.name}"? Esta acção é irreversível.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/nexus/agents/${agent.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.push('/nexus/agentes');
    } catch {
      alert('Erro ao eliminar agente.');
      setDeleting(false);
    }
  }, [agent, isBuiltIn, router]);

  const handleSave = useCallback(async () => {
    if (!agent || isBuiltIn) return;
    setSaving(true); setSaveMsg('');
    try {
      const res = await fetch(`/api/nexus/agents/${agent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:          editName,
          description:   editDesc,
          model:         editModel,
          system_prompt: editPrompt,
          temperature,
          tools:         editTools,
          metadata:      { variables, memory },
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSaveMsg('ok');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch {
      setSaveMsg('err');
      setTimeout(() => setSaveMsg(''), 3000);
    } finally {
      setSaving(false);
    }
  }, [agent, isBuiltIn, editName, editDesc, editModel, editPrompt, temperature, editTools, variables, memory]);

  const TABS = [
    { id: 'config', label: 'Configuração', badge: null },
    { id: 'tools',  label: 'Ferramentas',  badge: editTools.length > 0 ? String(editTools.length) : null },
    { id: 'memory', label: 'Memória',      badge: memory.length > 0 ? String(memory.length) : null },
    { id: 'execs',  label: 'Execuções',    badge: null },
    { id: 'vars',   label: 'Variáveis',    badge: variables.length > 0 ? String(variables.length) : null },
    ...(agent?.isReal ? [{ id: 'test', label: agent.agentType === 'cycle' ? 'Executar Ciclo' : 'Testar ao Vivo', badge: null }] : []),
  ];

  if (loadingAgent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !agent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <Bot size={48} className="text-border" />
        <h2 className="text-xl font-bold text-text-main">Agente não encontrado</h2>
        <p className="text-text-muted text-sm">
          O agente <code className="font-mono bg-background px-1.5 py-0.5 rounded border border-border">{slug}</code> não existe no registry.
        </p>
        <Link href="/nexus/agentes" className="mt-2 text-sm font-medium text-primary hover:underline">
          ← Voltar aos Agentes
        </Link>
      </div>
    );
  }

  const status = STATUS_MAP[agent.status];

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-surface border-b border-border py-4 px-6 sm:px-8 sticky top-0 z-30">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-sm text-text-muted mb-2">
              <Link href="/nexus/agentes" className="hover:text-primary transition-colors">Agentes</Link>
              <ChevronRight size={12} />
              <span className="text-text-main font-medium">{agent.name}</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-text-main">{agent.name}</h1>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${agent.status === 'active' ? 'nexus-pulse-dot' : ''}`} />
                {status.label}
              </span>
              {agent.isReal && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide">
                  Live
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-surface border border-border text-text-muted rounded-xl font-medium hover:bg-background hover:text-text-main transition-colors text-sm">
              <Copy size={14} /> Clonar
            </button>
            {!isBuiltIn && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 px-4 py-2 bg-surface border border-danger/40 text-danger rounded-xl font-medium hover:bg-danger/5 transition-colors text-sm disabled:opacity-50"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {deleting ? 'A eliminar…' : 'Excluir'}
              </button>
            )}
            {agent.isReal ? (
              <button
                onClick={() => setActiveTab('test')}
                className="flex items-center gap-1.5 px-4 py-2 bg-surface border border-border text-text-main rounded-xl font-medium hover:bg-background transition-colors text-sm"
              >
                {agent.agentType === 'cycle' ? <Play size={14} /> : <TestTube2 size={14} />}
                {agent.agentType === 'cycle' ? 'Executar' : 'Testar'}
              </button>
            ) : (
              <button className="flex items-center gap-1.5 px-4 py-2 bg-surface border border-border text-text-main rounded-xl font-medium hover:bg-background transition-colors text-sm">
                <TestTube2 size={14} /> Testar
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving || isBuiltIn}
              title={isBuiltIn ? 'Agente integrado — configuração só de leitura' : 'Guardar alterações'}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl font-medium shadow-soft hover:shadow-glow transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 size={14} className="animate-spin" />
                : saveMsg === 'ok' ? <Check size={14} />
                : <Save size={14} />}
              {saving ? 'A guardar…' : saveMsg === 'ok' ? 'Guardado!' : 'Salvar'}
            </button>
            {saveMsg === 'err' && (
              <span className="text-xs text-danger flex items-center gap-1">
                <AlertCircle size={12} />Erro ao guardar
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ── Tabs ───────────────────────────────────────────────── */}
      <div className="bg-surface border-b border-border px-6 sm:px-8 sticky top-[73px] z-20">
        <nav className="flex items-center gap-1 -mb-px overflow-x-auto nexus-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-main hover:border-border'
              }`}
            >
              {tab.label}
              {tab.badge && tab.badge !== '0' && (
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 nexus-scrollbar">

        {/* Config tab */}
        {activeTab === 'config' && (
          <div className="flex flex-col xl:flex-row gap-6 max-w-[1200px] w-full">
            <div className="flex-1 flex flex-col gap-6 min-w-0">
              <div className="bg-surface border border-border rounded-[20px] shadow-card p-6 space-y-4">
                <h3 className="text-base font-bold text-text-main">Informações Básicas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5">Nome do Agente</label>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      readOnly={isBuiltIn}
                      className={`w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none transition-all ${isBuiltIn ? 'opacity-60 cursor-not-allowed' : 'focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5">ID / Slug</label>
                    <input value={agent.id} readOnly
                      className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm text-text-muted" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Descrição</label>
                  <textarea
                    rows={2}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    readOnly={isBuiltIn}
                    className={`w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none transition-all resize-none ${isBuiltIn ? 'opacity-60 cursor-not-allowed' : 'focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
                  />
                </div>
              </div>

              <div className="bg-surface border border-border rounded-[20px] shadow-card overflow-hidden">
                <div className="p-4 border-b border-border/50 flex items-center justify-between">
                  <h3 className="text-base font-bold text-text-main">System Prompt</h3>
                  <span className="text-xs text-text-muted bg-background px-2 py-1 rounded-md border border-border">
                    {agent.isReal ? 'Fonte: agent/config.ts' : 'Editável'}
                  </span>
                </div>
                <div className="bg-[#1E1E1E] p-4">
                  <textarea
                    className="w-full bg-transparent text-[#D4D4D4] text-sm font-mono resize-none outline-none leading-6 min-h-[400px]"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    readOnly={isBuiltIn}
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>

            <div className="w-full xl:w-[340px] shrink-0 flex flex-col gap-6">
              <div className="bg-surface border border-border rounded-[20px] shadow-card p-6 space-y-5">
                <h3 className="text-base font-bold text-text-main">Configurações do Modelo</h3>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Fornecedor</label>
                  <select defaultValue={agent.providerValue} className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    {Object.entries(PROVIDER_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Modelo</label>
                  <input
                    value={editModel}
                    onChange={(e) => setEditModel(e.target.value)}
                    readOnly={isBuiltIn}
                    className={`w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none transition-all ${isBuiltIn ? 'opacity-60 cursor-not-allowed' : 'focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-text-main">Temperature</label>
                    <span className="text-sm font-bold text-primary">{temperature.toFixed(1)}</span>
                  </div>
                  <input type="range" min={0} max={2} step={0.1} value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full accent-primary" />
                  <div className="flex justify-between text-xs text-text-light mt-1">
                    <span>Preciso (0)</span><span>Criativo (2)</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-text-main">Top P</label>
                    <span className="text-sm font-bold text-text-main">1.0</span>
                  </div>
                  <input type="range" min={0} max={1} step={0.05} defaultValue={1} className="w-full accent-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Max Tokens</label>
                  <input type="number" defaultValue={2048}
                    className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
              </div>

              <div className="bg-surface border border-border rounded-[20px] shadow-card p-6 space-y-4">
                <h3 className="text-base font-bold text-text-main">Configurações Avançadas</h3>
                {[
                  { label: 'Modo JSON', sub: 'Forçar saída estruturada em JSON' },
                  { label: 'Streaming', sub: 'Transmitir respostas em tempo real' },
                ].map(({ label, sub }) => (
                  <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/50">
                    <div>
                      <p className="text-sm font-medium text-text-main">{label}</p>
                      <p className="text-xs text-text-muted">{sub}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-primary transition-colors" />
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tools tab */}
        {activeTab === 'tools' && (
          <div className="max-w-[800px] w-full space-y-4">
            <div className="bg-surface border border-border rounded-[20px] shadow-card p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-text-main">Ferramentas Conectadas</h3>
                {!isBuiltIn && (
                  <button
                    onClick={() => setShowAddTool((v) => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                  >
                    <Plus size={12} /> Adicionar
                  </button>
                )}
              </div>

              {editTools.length === 0 && !showAddTool && (
                <p className="text-sm text-text-muted py-6 text-center">Nenhuma ferramenta conectada.</p>
              )}

              {editTools.map((t) => (
                <div key={t.label} className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border/50 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Wrench size={14} className="text-warning" />
                    </div>
                    <span className="text-sm font-medium text-text-main font-mono">{t.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${t.cls}`}>Activo</span>
                    {!isBuiltIn && (
                      <button
                        onClick={() => setEditTools((prev) => prev.filter((x) => x.label !== t.label))}
                        className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-danger/10 hover:text-danger text-text-muted transition-all"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {showAddTool && (
                <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                  <Wrench size={14} className="text-primary shrink-0" />
                  <input
                    autoFocus
                    value={newToolLabel}
                    onChange={(e) => setNewToolLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const label = newToolLabel.trim();
                        if (label && !editTools.find((t) => t.label === label)) {
                          setEditTools((prev) => [...prev, { label, cls: 'bg-success/10 text-success border-success/20' }]);
                          setNewToolLabel('');
                          setShowAddTool(false);
                        }
                      }
                      if (e.key === 'Escape') { setShowAddTool(false); setNewToolLabel(''); }
                    }}
                    placeholder="nome_da_ferramenta  (Enter para confirmar)"
                    className="flex-1 bg-transparent text-sm font-mono text-text-main outline-none placeholder:text-text-muted"
                  />
                  <button onClick={() => { setShowAddTool(false); setNewToolLabel(''); }} className="text-text-muted hover:text-danger transition-colors"><X size={14} /></button>
                </div>
              )}
            </div>

            {agent.subAgents && agent.subAgents.length > 0 && (
              <div className="bg-surface border border-border rounded-[20px] shadow-card p-6 space-y-3">
                <h3 className="text-base font-bold text-text-main">Sub-Agentes</h3>
                {agent.subAgents.map((sa) => (
                  <div key={sa.name} className="flex items-start gap-3 p-3.5 rounded-xl bg-background border border-border/50">
                    <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                      <Network size={14} className="text-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-main">{sa.name}</p>
                      <p className="text-xs text-text-muted mt-0.5">{sa.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isBuiltIn && (
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium shadow-soft hover:shadow-glow transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  Guardar Ferramentas
                </button>
              </div>
            )}
          </div>
        )}

        {/* Live test tab — chat agents */}
        {activeTab === 'test' && agent.isReal && agent.agentType !== 'cycle' && agent.apiEndpoint && (
          <LiveTestPanel endpoint={agent.apiEndpoint} />
        )}

        {/* Cycle tab — multi-agent systems */}
        {activeTab === 'test' && agent.isReal && agent.agentType === 'cycle' && agent.apiEndpoint && (
          <CyclePanel endpoint={agent.apiEndpoint} />
        )}

        {/* Memory tab */}
        {activeTab === 'memory' && (
          <div className="max-w-[800px] w-full space-y-4">
            <div className="bg-surface border border-border rounded-[20px] shadow-card overflow-hidden">
              <div className="p-5 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-text-main">Memória do Agente</h3>
                  <p className="text-xs text-text-muted mt-0.5">Fragmentos de contexto persistente injectados em cada sessão.</p>
                </div>
                {memory.length > 0 && !isBuiltIn && (
                  <button
                    onClick={() => { if (confirm('Limpar toda a memória?')) setMemory([]); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-danger/10 text-danger border border-danger/20 rounded-lg text-xs font-medium hover:bg-danger/20 transition-colors"
                  >
                    <X size={12} /> Limpar Tudo
                  </button>
                )}
              </div>
              {memory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
                  <Brain size={28} className="text-border" />
                  <p className="text-sm font-medium text-text-muted">Memória vazia</p>
                  <p className="text-xs text-text-muted max-w-[280px]">
                    {isBuiltIn ? 'Este agente não usa memória persistente configurável.' : 'Adiciona fragmentos de contexto que o agente lembrará em cada sessão.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {memory.map((m) => (
                    <div key={m.id} className="flex items-start gap-3 px-5 py-4 group hover:bg-background/50 transition-colors">
                      <Brain size={13} className="text-text-muted shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-main leading-relaxed whitespace-pre-wrap">{m.content}</p>
                        <p className="text-[11px] text-text-muted mt-1.5 flex items-center gap-1"><Clock size={10} />{m.createdAt}</p>
                      </div>
                      {!isBuiltIn && (
                        <button
                          onClick={() => setMemory((prev) => prev.filter((x) => x.id !== m.id))}
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-danger/10 hover:text-danger text-text-muted transition-all shrink-0"
                        ><X size={12} /></button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!isBuiltIn && (
              <div className="bg-surface border border-border rounded-[20px] shadow-card p-5 space-y-3">
                <label className="block text-sm font-medium text-text-main">Novo fragmento de memória</label>
                <textarea
                  rows={3}
                  value={newMemory}
                  onChange={(e) => setNewMemory(e.target.value)}
                  placeholder="Ex: O cliente prefere respostas curtas e directas..."
                  className="w-full px-3 py-2.5 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">{newMemory.length} / 1000</span>
                  <button
                    onClick={() => {
                      const content = newMemory.trim();
                      if (!content) return;
                      setMemory((prev) => [...prev, {
                        id: `${Date.now()}`,
                        content,
                        createdAt: new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                      }]);
                      setNewMemory('');
                    }}
                    disabled={!newMemory.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium shadow-soft hover:shadow-glow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus size={13} /> Adicionar à Memória
                  </button>
                </div>
              </div>
            )}

            {!isBuiltIn && memory.length > 0 && (
              <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium shadow-soft hover:shadow-glow transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  Guardar Memória
                </button>
              </div>
            )}
          </div>
        )}

        {/* Executions tab */}
        {activeTab === 'execs' && (
          <div className="max-w-[800px] w-full space-y-4">
            <div className="bg-surface border border-border rounded-[20px] shadow-card overflow-hidden">
              <div className="p-5 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-text-main">Histórico de Execuções</h3>
                  <p className="text-xs text-text-muted mt-0.5">Registo das últimas execuções e resultados.</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border text-text-muted rounded-lg text-xs font-medium hover:text-text-main transition-colors">
                  <RefreshCw size={12} /> Actualizar
                </button>
              </div>
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center">
                  <Zap size={20} className="text-border" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-muted">Sem execuções registadas</p>
                  <p className="text-xs text-text-muted mt-1 max-w-[300px]">
                    {agent.isReal
                      ? 'As execuções deste agente são registadas externamente. Consulta os logs da Vercel ou Supabase.'
                      : 'Executa o agente para ver o histórico aqui.'}
                  </p>
                </div>
                {agent.isReal && (
                  <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border text-text-muted rounded-lg text-xs hover:text-text-main transition-colors"
                  >Vercel Logs ↗</a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Variables tab */}
        {activeTab === 'vars' && (
          <div className="max-w-[800px] w-full space-y-4">
            {isBuiltIn && (
              <div className="p-3 bg-info/10 border border-info/20 rounded-xl text-xs text-info">
                Agente integrado — variáveis só de leitura.
              </div>
            )}
            <div className="bg-surface border border-border rounded-[20px] shadow-card overflow-hidden">
              <div className="p-5 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-text-main">Variáveis de Ambiente</h3>
                  <p className="text-xs text-text-muted mt-0.5">Valores injectados no contexto do agente em cada execução.</p>
                </div>
                {!isBuiltIn && (
                  <button
                    onClick={() => setShowAddVar((v) => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                  >
                    <Plus size={12} /> Adicionar
                  </button>
                )}
              </div>

              {variables.length === 0 && !showAddVar ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <Key size={28} className="text-border" />
                  <p className="text-sm font-medium text-text-muted">Nenhuma variável definida</p>
                  {!isBuiltIn && <p className="text-xs text-text-muted">Adiciona variáveis como API keys, tokens ou configs.</p>}
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {variables.map((v) => (
                    <div key={v.id} className="flex items-center gap-3 px-5 py-3 group hover:bg-background/50 transition-colors">
                      <Key size={13} className="text-text-muted shrink-0" />
                      <span className="text-sm font-mono text-text-main w-[180px] truncate">{v.key}</span>
                      <div className="flex-1 flex items-center gap-1.5">
                        <span className="text-sm font-mono text-text-muted truncate">
                          {showVarValues[v.id] ? v.value : '••••••••••••'}
                        </span>
                        <button
                          onClick={() => setShowVarValues((prev) => ({ ...prev, [v.id]: !prev[v.id] }))}
                          className="text-text-muted hover:text-text-main transition-colors p-0.5"
                        >
                          {showVarValues[v.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                      {v.secret && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-warning/10 text-warning border border-warning/20 rounded font-medium">SECRET</span>
                      )}
                      {!isBuiltIn && (
                        <button
                          onClick={() => setVariables((prev) => prev.filter((x) => x.id !== v.id))}
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-danger/10 hover:text-danger text-text-muted transition-all"
                        ><X size={12} /></button>
                      )}
                    </div>
                  ))}

                  {showAddVar && (
                    <div className="px-5 py-3 bg-primary/5 flex items-center gap-3">
                      <Key size={13} className="text-primary shrink-0" />
                      <input
                        autoFocus
                        value={newVarKey}
                        onChange={(e) => setNewVarKey(e.target.value)}
                        placeholder="CHAVE"
                        className="w-[150px] bg-transparent text-sm font-mono text-text-main outline-none border-b border-primary/40 pb-0.5 placeholder:text-text-muted"
                      />
                      <span className="text-text-muted text-sm">=</span>
                      <input
                        value={newVarVal}
                        onChange={(e) => setNewVarVal(e.target.value)}
                        placeholder="valor"
                        className="flex-1 bg-transparent text-sm font-mono text-text-main outline-none border-b border-primary/40 pb-0.5 placeholder:text-text-muted"
                      />
                      <label className="flex items-center gap-1.5 text-xs text-text-muted cursor-pointer select-none">
                        <input type="checkbox" checked={newVarSecret} onChange={(e) => setNewVarSecret(e.target.checked)} className="accent-warning" />
                        Secret
                      </label>
                      <button
                        onClick={() => {
                          const key = newVarKey.trim();
                          if (!key) return;
                          setVariables((prev) => [...prev, { id: `${Date.now()}`, key, value: newVarVal, secret: newVarSecret }]);
                          setNewVarKey(''); setNewVarVal(''); setNewVarSecret(false); setShowAddVar(false);
                        }}
                        className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-medium"
                      >Adicionar</button>
                      <button onClick={() => { setShowAddVar(false); setNewVarKey(''); setNewVarVal(''); }} className="text-text-muted hover:text-danger transition-colors"><X size={13} /></button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!isBuiltIn && variables.length > 0 && (
              <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium shadow-soft hover:shadow-glow transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  Guardar Variáveis
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
