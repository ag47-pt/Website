'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight, Save, Loader2, AlertCircle, Bot,
} from 'lucide-react';

const PROVIDERS = [
  { value: 'google',    label: 'Google AI',       models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'] },
  { value: 'openai',    label: 'OpenAI',           models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'] },
  { value: 'anthropic', label: 'Anthropic',        models: ['claude-3-5-sonnet', 'claude-3-haiku'] },
  { value: 'local',     label: 'Local (Ollama)',   models: ['llama3', 'mistral', 'phi3'] },
] as const;

const ICON_OPTIONS = [
  { bg: 'bg-primary/10', txt: 'text-primary',   label: 'Rosa / Default' },
  { bg: 'bg-info/10',    txt: 'text-info',       label: 'Azul' },
  { bg: 'bg-success/10', txt: 'text-success',    label: 'Verde' },
  { bg: 'bg-warning/10', txt: 'text-warning',    label: 'Laranja' },
  { bg: 'bg-danger/10',  txt: 'text-danger',     label: 'Vermelho' },
];

export default function NovoAgentePage() {
  const router = useRouter();

  const [name, setName]           = useState('');
  const [desc, setDesc]           = useState('');
  const [provider, setProvider]   = useState<string>('google');
  const [model, setModel]         = useState('gemini-2.5-flash');
  const [agentType, setAgentType] = useState<'chat' | 'cycle'>('chat');
  const [prompt, setPrompt]       = useState('');
  const [temperature, setTemp]    = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [iconIdx, setIconIdx]     = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const currentProvider = PROVIDERS.find((p) => p.value === provider) ?? PROVIDERS[0];
  const modelList = [...currentProvider.models] as string[];
  if (!modelList.includes(model)) setModel(modelList[0]);

  const handleProviderChange = (v: string) => {
    setProvider(v);
    const p = PROVIDERS.find((x) => x.value === v) ?? PROVIDERS[0];
    setModel(p.models[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Nome do agente é obrigatório.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/nexus/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: desc.trim(),
          provider,
          model,
          modelLabel: currentProvider.label + ' — ' + model,
          agentType,
          systemPrompt: prompt,
          temperature,
          maxTokens,
          iconBg:  ICON_OPTIONS[iconIdx].bg,
          iconTxt: ICON_OPTIONS[iconIdx].txt,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as Record<string, unknown>;
        throw new Error(String(data.error ?? `HTTP ${res.status}`));
      }
      const data = await res.json() as { agent: { id: string } };
      router.push(`/nexus/agentes/${data.agent.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-surface border-b border-border py-4 px-6 sm:px-8 sticky top-0 z-30">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-sm text-text-muted mb-2">
              <Link href="/nexus/agentes" className="hover:text-primary transition-colors">Agentes</Link>
              <ChevronRight size={12} />
              <span className="text-text-main font-medium">Criar Agente</span>
            </div>
            <h1 className="text-2xl font-bold text-text-main">Novo Agente</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/nexus/agentes"
              className="px-4 py-2 bg-surface border border-border text-text-muted rounded-xl text-sm font-medium hover:bg-background transition-colors"
            >
              Cancelar
            </Link>
            <button
              form="novo-form"
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium shadow-soft hover:shadow-glow transition-all disabled:opacity-50 text-sm"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Criar Agente
            </button>
          </div>
        </div>
      </header>

      {/* ── Form ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 nexus-scrollbar">
        <form id="novo-form" onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-6 max-w-[1200px] w-full">

          {/* Left column */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">

            {error && (
              <div className="flex items-center gap-3 p-4 bg-danger/10 border border-danger/20 rounded-[16px] text-sm text-danger">
                <AlertCircle size={16} className="shrink-0" />{error}
              </div>
            )}

            {/* Basic Info */}
            <div className="bg-surface border border-border rounded-[20px] shadow-card p-6 space-y-4">
              <h3 className="text-base font-bold text-text-main">Informações Básicas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-main mb-1.5">
                    Nome do Agente <span className="text-danger">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ex: Assistente de Suporte"
                    required
                    className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-main mb-1.5">Descrição</label>
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    rows={2}
                    placeholder="Descreve o que este agente faz..."
                    className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  />
                </div>
              </div>

              {/* Icon color */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Cor do Ícone</label>
                <div className="flex items-center gap-3 flex-wrap">
                  {ICON_OPTIONS.map(({ bg, txt, label }, i) => (
                    <button
                      key={i}
                      type="button"
                      title={label}
                      onClick={() => setIconIdx(i)}
                      className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center border-2 transition-all ${
                        iconIdx === i ? 'border-text-main scale-110' : 'border-transparent'
                      }`}
                    >
                      <Bot size={16} className={txt} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* System Prompt */}
            <div className="bg-surface border border-border rounded-[20px] shadow-card overflow-hidden">
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <h3 className="text-base font-bold text-text-main">System Prompt</h3>
                <span className="text-xs text-text-muted bg-background px-2 py-1 rounded-md border border-border">Editável</span>
              </div>
              <div className="bg-[#1E1E1E] p-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-transparent text-[#D4D4D4] text-sm font-mono resize-none outline-none leading-6 min-h-[320px]"
                  placeholder="# Nome do Agente&#10;&#10;Descrição e instruções do comportamento do agente..."
                  spellCheck={false}
                />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="w-full xl:w-[340px] shrink-0 flex flex-col gap-6">

            {/* Model config */}
            <div className="bg-surface border border-border rounded-[20px] shadow-card p-6 space-y-5">
              <h3 className="text-base font-bold text-text-main">Modelo de IA</h3>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Tipo de Agente</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['chat', 'cycle'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAgentType(t)}
                      className={`py-2 px-3 rounded-xl text-sm font-medium border transition-all ${
                        agentType === t
                          ? 'bg-primary text-white border-primary shadow-soft'
                          : 'bg-surface border-border text-text-muted hover:border-primary/40'
                      }`}
                    >
                      {t === 'chat' ? '💬 Chat' : '🔄 Ciclo'}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-text-muted mt-1.5">
                  {agentType === 'chat' ? 'Conversa contínua com o utilizador.' : 'Executa um ciclo de análise único.'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Fornecedor</label>
                <select
                  value={provider}
                  onChange={(e) => handleProviderChange(e.target.value)}
                  className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                >
                  {PROVIDERS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Modelo</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                >
                  {modelList.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-text-main">Temperature</label>
                  <span className="text-sm font-bold text-primary">{temperature.toFixed(1)}</span>
                </div>
                <input
                  type="range" min={0} max={2} step={0.1}
                  value={temperature}
                  onChange={(e) => setTemp(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-text-light mt-1">
                  <span>Preciso (0)</span><span>Criativo (2)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Max Tokens</label>
                <input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value) || 2048)}
                  min={256} max={32768}
                  className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="bg-surface border border-border rounded-[20px] shadow-card p-5">
              <h3 className="text-sm font-bold text-text-main mb-3">Pré-visualização</h3>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${ICON_OPTIONS[iconIdx].bg} flex items-center justify-center shrink-0`}>
                  <Bot size={18} className={ICON_OPTIONS[iconIdx].txt} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-main truncate">{name || 'Novo Agente'}</p>
                  <p className="text-xs text-text-muted truncate">{desc || 'Sem descrição'}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-background border border-border text-text-main">{model}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-success/10 text-success border border-success/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Ativo
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
