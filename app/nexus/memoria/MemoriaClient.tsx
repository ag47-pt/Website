'use client';

import { useState } from 'react';
import { Download, Plus, Search, Database, Code2, GitFork, HardDrive } from 'lucide-react';

const TABS = ['Gestão de Memória', 'Biblioteca de Funções', 'Mapa de Dependências'];

const FUNCTION_SCHEMA = `{
  "name": "get_customer_data",
  "description": "Retrieves customer data from CRM by customer ID.",
  "parameters": {
    "type": "object",
    "properties": {
      "customer_id": {
        "type": "string",
        "description": "The unique customer identifier."
      },
      "fields": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Specific fields to return."
      }
    },
    "required": ["customer_id"]
  }
}`;

const namespaces = [
  { name: 'customer-support-kb', size: '45.2 MB',  models: ['SA','TB'], statusCls: 'bg-success/10 text-success border-success/20', status: 'Ativo' },
  { name: 'dev-docs-v2',         size: '128.5 MB', models: ['CA'],      statusCls: 'bg-info/10 text-info border-info/20',           status: 'Ativo' },
  { name: 'sales-playbook',      size: '12.1 MB',  models: [],          statusCls: 'bg-text-muted/10 text-text-muted border-border',status: 'Nenhum' },
];

const functionList = [
  { id: 'get_customer_data',   active: true },
  { id: 'create_jira_ticket',  active: false },
  { id: 'query_database',      active: false },
];

export function MemoriaClient() {
  const [tab, setTab]   = useState(0);
  const [selFn, setSelFn] = useState('get_customer_data');

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-surface border-b border-border py-4 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Memória & Funções</h1>
          <p className="text-sm text-text-muted mt-1">Gerencie bases de conhecimento, funções e dependências dos agentes.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-border text-text-main rounded-xl font-medium hover:bg-background transition-colors text-sm">
          <Download size={14} /> Exportar Backup
        </button>
      </header>

      {/* ── Tab Bar ───────────────────────────────────────────── */}
      <div className="bg-surface border-b border-border px-6 sm:px-8 sticky top-[73px] z-20">
        <nav className="flex items-center gap-1 -mb-px overflow-x-auto nexus-scrollbar">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                tab === i
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-main hover:border-border'
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 nexus-scrollbar">

        {/* ── Tab 0: Gestão de Memória ──────────────────────────── */}
        {tab === 0 && (
          <div className="space-y-6">
            {/* Providers */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-main">Provedores de Memória</h3>
                <button className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
                  <Plus size={14} /> Adicionar
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Pinecone */}
                <div className="bg-surface border border-border rounded-[20px] p-5 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Database size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-main">Pinecone</p>
                        <p className="text-xs text-text-muted">Embeddings vetoriais</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-success/10 text-success border border-success/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-success nexus-pulse-dot" /> Online
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-text-muted">
                    <p>Modelo: <span className="font-medium text-text-main">text-embedding-3-large</span></p>
                    <p>Dimensões: <span className="font-medium text-text-main">3072</span></p>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-muted">Uso</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="w-full h-1.5 bg-background rounded-full">
                      <div className="w-[45%] h-full bg-primary rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Redis */}
                <div className="bg-surface border border-border rounded-[20px] p-5 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
                        <HardDrive size={18} className="text-danger" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-main">Redis</p>
                        <p className="text-xs text-text-muted">Cache de conversas</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-success/10 text-success border border-success/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-success nexus-pulse-dot" /> Online
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-text-muted">
                    <p>Host: <span className="font-medium text-text-main font-mono">redis-prod.internal</span></p>
                    <p>Latência: <span className="font-medium text-text-main">2.4ms</span></p>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-muted">Uso</span>
                      <span className="font-medium text-warning">82%</span>
                    </div>
                    <div className="w-full h-1.5 bg-background rounded-full">
                      <div className="w-[82%] h-full bg-warning rounded-full" />
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-background border-2 border-dashed border-border rounded-[20px] p-5 flex flex-col items-center justify-center gap-2 hover:border-primary/40 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Plus size={18} className="text-primary" />
                  </div>
                  <p className="text-sm font-medium text-text-muted">Adicionar Provedor</p>
                </div>
              </div>
            </div>

            {/* Namespaces */}
            <div className="bg-surface border border-border rounded-[24px] shadow-card overflow-hidden">
              <div className="p-5 border-b border-border/50 flex items-center justify-between">
                <h3 className="text-base font-bold text-text-main">Namespaces</h3>
                <button className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
                  <Plus size={14} /> Novo
                </button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background border-b border-border/50">
                    {['Namespace','Tamanho','Agentes Vinculados','Status'].map((h) => (
                      <th key={h} className="py-3 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {namespaces.map((ns) => (
                    <tr key={ns.name} className="hover:bg-background/50 transition-colors">
                      <td className="py-4 px-6 text-sm font-mono font-medium text-text-main">{ns.name}</td>
                      <td className="py-4 px-6 text-sm text-text-muted">{ns.size}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-1">
                          {ns.models.length > 0
                            ? ns.models.map((m) => (
                                <span key={m} className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">{m}</span>
                              ))
                            : <span className="text-xs text-text-light">—</span>
                          }
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${ns.statusCls}`}>
                          {ns.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Retention Policies */}
            <div className="bg-surface border border-border rounded-[24px] shadow-card p-6 space-y-4">
              <h3 className="text-base font-bold text-text-main">Políticas de Retenção</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Expiração Padrão</label>
                  <select className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>7 dias</option>
                    <option>30 dias</option>
                    <option>Nunca</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Limite de Tokens</label>
                  <input type="number" defaultValue={16000} className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Auto-Sumarização</label>
                  <div className="flex items-center gap-3 h-[42px]">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-primary transition-colors" />
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                    </label>
                    <span className="text-sm text-text-muted">Ativada</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 1: Biblioteca de Funções ──────────────────────── */}
        {tab === 1 && (
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Left: Function List */}
            <div className="w-full lg:w-[260px] shrink-0 flex flex-col gap-3">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
                <input placeholder="Buscar funções..." className="w-full pl-9 pr-4 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <button className="flex items-center justify-center gap-2 py-2 px-4 bg-primary text-white rounded-xl text-sm font-medium shadow-soft hover:shadow-glow transition-all">
                <Plus size={14} /> Nova Função
              </button>
              <div className="bg-surface border border-border rounded-[16px] shadow-card overflow-hidden">
                {functionList.map((fn) => (
                  <button
                    key={fn.id}
                    onClick={() => setSelFn(fn.id)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-2 border-b border-border/50 last:border-0 transition-colors ${selFn === fn.id ? 'bg-primary/5 text-primary' : 'hover:bg-background text-text-main'}`}
                  >
                    <Code2 size={13} />
                    <span className="text-sm font-mono">{fn.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Editor + Permissions */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">
              <div className="bg-surface border border-border rounded-[20px] shadow-card overflow-hidden">
                <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
                  <span className="text-sm font-semibold font-mono text-text-main">{selFn}</span>
                  <span className="text-xs text-text-muted">OpenAPI Schema</span>
                </div>
                <div className="bg-[#1E1E1E] p-4">
                  <textarea
                    className="w-full bg-transparent text-[#D4D4D4] text-xs font-mono resize-none outline-none leading-5 min-h-[280px]"
                    defaultValue={FUNCTION_SCHEMA}
                    spellCheck={false}
                  />
                </div>
              </div>

              <div className="bg-surface border border-border rounded-[20px] shadow-card p-6 space-y-4">
                <h3 className="text-base font-bold text-text-main">Permissões & Limites</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5">Rate Limit (req/min)</label>
                    <input type="number" defaultValue={60} className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5">Requer Aprovação</label>
                    <select className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                      <option>Nunca</option>
                      <option>Sempre</option>
                      <option>Se $valor &gt; $100</option>
                    </select>
                  </div>
                </div>
                <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-white rounded-xl text-sm font-medium shadow-soft hover:shadow-glow transition-all">
                  Testar Função
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 2: Mapa de Dependências ───────────────────────── */}
        {tab === 2 && (
          <div className="bg-surface border border-border rounded-[24px] shadow-card overflow-hidden">
            <div className="p-5 border-b border-border/50">
              <h3 className="text-base font-bold text-text-main">Mapa de Dependências</h3>
              <p className="text-sm text-text-muted">Visualização das relações entre agentes, funções e memória.</p>
            </div>
            <div className="relative w-full min-h-[480px] bg-background rounded-b-[24px] overflow-hidden flex items-center justify-center"
              style={{ backgroundImage: 'radial-gradient(circle, #E5E7EB 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            >
              <svg viewBox="0 0 600 400" className="w-full max-w-2xl" style={{ minHeight: 360 }}>
                {/* Edges */}
                <path d="M 200 200 C 260 200 290 100 340 100" stroke="#E5E7EB" strokeWidth="1.5" fill="none" />
                <path d="M 200 200 C 260 200 290 200 340 200" stroke="#E5E7EB" strokeWidth="1.5" fill="none" />
                <path d="M 200 200 C 260 200 290 300 340 300" stroke="#E5E7EB" strokeWidth="1.5" fill="none" />
                <path d="M 200 200 C 130 200 100 260 80 280"  stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />

                {/* Support Bot node */}
                <circle cx="200" cy="200" r="44" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2" />
                <text x="200" y="196" textAnchor="middle" fill="#1D4ED8" fontSize="10" fontWeight="600">Support</text>
                <text x="200" y="208" textAnchor="middle" fill="#1D4ED8" fontSize="10" fontWeight="600">Bot</text>

                {/* Function nodes */}
                {[
                  { x: 340, y: 100, label: 'get_customer\n_data',    color: '#6EE7B7', stroke: '#10B981' },
                  { x: 340, y: 200, label: 'create\n_ticket',        color: '#FDE68A', stroke: '#F59E0B' },
                  { x: 340, y: 300, label: 'refund\n_order',         color: '#FECACA', stroke: '#EF4444' },
                ].map(({ x, y, label, color, stroke }) => (
                  <g key={label}>
                    <rect x={x - 52} y={y - 24} width="104" height="48" rx="10" fill={color} stroke={stroke} strokeWidth="1.5" />
                    {label.split('\n').map((line, i) => (
                      <text key={i} x={x} y={y + (i === 0 ? -6 : 8)} textAnchor="middle" fill="#111827" fontSize="9" fontWeight="600">{line}</text>
                    ))}
                  </g>
                ))}

                {/* Memory node */}
                <ellipse cx="80" cy="290" rx="54" ry="28" fill="#F3E8FF" stroke="#9333EA" strokeWidth="1.5" strokeDasharray="4 3" />
                <text x="80" y="286" textAnchor="middle" fill="#7E22CE" fontSize="9" fontWeight="600">customer</text>
                <text x="80" y="298" textAnchor="middle" fill="#7E22CE" fontSize="9" fontWeight="600">-kb (mem)</text>
              </svg>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
