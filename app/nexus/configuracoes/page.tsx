'use client';

import { useState } from 'react';
import { Save, UserPlus, Key, RefreshCw, Trash2, Globe, Clock, CreditCard } from 'lucide-react';

const SIDEBAR_SECTIONS = [
  {
    group: 'Workspace',
    items: [
      { id: 'general',      label: 'Geral' },
      { id: 'users',        label: 'Usuários e Permissões' },
      { id: 'api',          label: 'API & Segredos' },
      { id: 'environments', label: 'Ambientes & Webhooks' },
      { id: 'billing',      label: 'Billing & Limites' },
      { id: 'integrations', label: 'Integrações Globais' },
      { id: 'audit',        label: 'Auditoria' },
    ],
  },
  {
    group: 'Minha Conta',
    items: [
      { id: 'profile',      label: 'Perfil' },
      { id: 'preferences',  label: 'Preferências' },
    ],
  },
];

const users = [
  { name: 'Admin User',   email: 'admin@nexusai.com', role: 'Owner',     roleCls: 'bg-primary/10 text-primary border-primary/20',   status: 'Ativo',    statusCls: 'bg-success/10 text-success border-success/20', lastAccess: 'Há 5 min' },
  { name: 'Jane Doe',     email: 'jane@nexusai.com',  role: 'Developer', roleCls: 'bg-info/10 text-info border-info/20',             status: 'Ativo',    statusCls: 'bg-success/10 text-success border-success/20', lastAccess: 'Há 2h' },
  { name: 'mark@nexusai.com', email: 'mark@nexusai.com', role: 'Viewer', roleCls: 'bg-text-muted/10 text-text-muted border-border', status: 'Pendente', statusCls: 'bg-warning/10 text-warning border-warning/20', lastAccess: '—' },
];

const auditRows = [
  { date: 'Hoje 14:30',    user: 'admin@nexusai.com', action: 'UPDATE',  actionCls: 'bg-info/10 text-info border-info/20',       resource: 'agent/suporte-tier-1' },
  { date: 'Hoje 12:15',    user: 'jane@nexusai.com',  action: 'CREATE',  actionCls: 'bg-success/10 text-success border-success/20', resource: 'connector/slack-v2' },
  { date: 'Ontem 18:02',   user: 'admin@nexusai.com', action: 'DELETE',  actionCls: 'bg-danger/10 text-danger border-danger/20', resource: 'mcp/old-web-searcher' },
];

export default function ConfiguracoesPage() {
  const [active, setActive] = useState('general');

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-surface border-b border-border py-4 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Configurações</h1>
          <p className="text-sm text-text-muted mt-1">Gerencie o workspace, usuários e preferências do sistema.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium shadow-soft hover:shadow-glow transition-all text-sm">
          <Save size={14} /> Salvar Alterações
        </button>
      </header>

      {/* ── Split Layout ───────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Inner Sidebar */}
        <aside className="hidden md:flex w-[220px] shrink-0 flex-col border-r border-border bg-surface overflow-y-auto nexus-scrollbar p-4 gap-6">
          {SIDEBAR_SECTIONS.map(({ group, items }) => (
            <div key={group}>
              <p className="text-[10px] font-bold text-text-light uppercase tracking-widest px-3 mb-2">{group}</p>
              {items.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors mb-0.5 ${
                    active === id
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-muted hover:bg-background hover:text-text-main'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 nexus-scrollbar">

          {/* ── General ────────────────────────────────────────── */}
          {active === 'general' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-surface border border-border rounded-[20px] shadow-card p-6 space-y-4">
                <h3 className="text-base font-bold text-text-main">Informações do Workspace</h3>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Nome do Workspace</label>
                  <input defaultValue="NexusAI Production" className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">ID do Workspace</label>
                  <input readOnly defaultValue="ws_prod_f3a1b2c4" className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm text-text-muted font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Descrição</label>
                  <textarea rows={3} defaultValue="Workspace principal de produção para os agentes de IA da Agência47." className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" />
                </div>
              </div>
              <div className="bg-surface border border-border rounded-[20px] shadow-card p-6 space-y-4">
                <h3 className="text-base font-bold text-text-main">Preferências</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5 flex items-center gap-1.5"><Globe size={13} /> Idioma</label>
                    <select className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                      <option>Português (BR)</option>
                      <option>English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5 flex items-center gap-1.5"><Clock size={13} /> Fuso Horário</label>
                    <select className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                      <option>America/Sao_Paulo</option>
                      <option>UTC</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Usuários ───────────────────────────────────────── */}
          {active === 'users' && (
            <div className="max-w-4xl space-y-6">
              <div className="bg-surface border border-border rounded-[24px] shadow-card overflow-hidden">
                <div className="p-6 border-b border-border/50 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-text-main">Usuários e Permissões</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium text-sm shadow-soft hover:shadow-glow transition-all">
                    <UserPlus size={14} /> Convidar Usuário
                  </button>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background border-b border-border/50">
                      {['Usuário','Papel','Status','Último Acesso','Ações'].map((h) => (
                        <th key={h} className={`py-3 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider${h === 'Ações' ? ' text-right' : ''}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {users.map((u) => (
                      <tr key={u.email} className="hover:bg-background/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                              {u.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-text-main">{u.name}</p>
                              <p className="text-xs text-text-muted">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${u.roleCls}`}>{u.role}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${u.statusCls}`}>{u.status}</span>
                        </td>
                        <td className="py-4 px-6 text-sm text-text-muted">{u.lastAccess}</td>
                        <td className="py-4 px-6 text-right">
                          <button className="text-xs text-danger hover:underline font-medium">Remover</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── API ────────────────────────────────────────────── */}
          {active === 'api' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-surface border border-border rounded-[20px] shadow-card p-6 space-y-4">
                <h3 className="text-base font-bold text-text-main">Chaves de Acesso</h3>
                {[
                  { label: 'Chave de Produção', badge: 'PROD', badgeCls: 'bg-danger/10 text-danger border-danger/20', value: 'nxs_prod_••••••••••••••••••••••' },
                  { label: 'Chave de Desenvolvimento', badge: 'DEV', badgeCls: 'bg-success/10 text-success border-success/20', value: 'nxs_dev_••••••••••••••••••••••' },
                ].map(({ label, badge, badgeCls, value }) => (
                  <div key={badge} className="p-4 rounded-xl border border-border bg-background">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Key size={14} className="text-text-muted" />
                        <span className="text-sm font-medium text-text-main">{label}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeCls}`}>{badge}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs font-mono bg-surface border border-border rounded-lg px-3 py-2 text-text-muted">{value}</code>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-muted hover:bg-warning/10 hover:text-warning transition-colors" title="Rotacionar">
                        <RefreshCw size={13} />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-muted hover:bg-danger/10 hover:text-danger transition-colors" title="Deletar">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-surface border border-border rounded-[20px] shadow-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-text-main">Variáveis de Ambiente</h3>
                  <button className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
                    <UserPlus size={13} /> Adicionar
                  </button>
                </div>
                {[
                  { key: 'OPENAI_API_KEY',   val: '••••••••••••••••' },
                  { key: 'DATABASE_URL_PROD', val: 'postgresql://••••••••@db.internal:5432/nexus' },
                ].map(({ key, val }) => (
                  <div key={key} className="flex items-center gap-3">
                    <code className="text-xs font-mono font-bold text-text-main bg-background border border-border rounded-lg px-3 py-2 shrink-0">{key}</code>
                    <code className="flex-1 text-xs font-mono text-text-muted bg-background border border-border rounded-lg px-3 py-2 truncate">{val}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Billing ────────────────────────────────────────── */}
          {active === 'billing' && (
            <div className="max-w-3xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-surface border border-primary/30 rounded-[20px] p-5 shadow-card">
                  <p className="text-xs text-text-muted mb-1">Plano Atual</p>
                  <h2 className="text-xl font-bold text-primary mb-4">Pro</h2>
                  <div className="space-y-3 mb-4">
                    {[
                      { label: 'Tokens', used: '4.2M', total: '10M', pct: 42 },
                      { label: 'Agentes', used: '3', total: '5', pct: 60 },
                    ].map(({ label, used, total, pct }) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-muted">{label}</span>
                          <span className="font-medium">{used} / {total}</span>
                        </div>
                        <div className="w-full h-1.5 bg-background rounded-full">
                          <div className={`h-full rounded-full ${pct > 50 ? 'bg-warning' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-2xl font-bold text-text-main">$99<span className="text-sm font-normal text-text-muted">/mês</span></p>
                </div>
                <div className="sm:col-span-2 bg-surface border border-border rounded-[20px] p-5 shadow-card space-y-4">
                  <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                    <CreditCard size={16} className="text-text-muted" /> Método de Pagamento
                  </h3>
                  <div className="flex items-center gap-4 p-4 bg-background rounded-xl border border-border">
                    <div className="w-10 h-7 bg-primary rounded flex items-center justify-center text-white text-[10px] font-bold">VISA</div>
                    <div>
                      <p className="text-sm font-medium text-text-main">•••• •••• •••• 4242</p>
                      <p className="text-xs text-text-muted">Expira 12/27</p>
                    </div>
                    <button className="ml-auto text-xs text-primary font-medium hover:underline">Atualizar</button>
                  </div>
                  <button className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-medium shadow-soft hover:shadow-glow transition-all">
                    Fazer Upgrade para Enterprise
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Auditoria ──────────────────────────────────────── */}
          {active === 'audit' && (
            <div className="max-w-4xl">
              <div className="bg-surface border border-border rounded-[24px] shadow-card overflow-hidden">
                <div className="p-6 border-b border-border/50">
                  <h3 className="text-lg font-bold text-text-main">Log de Auditoria</h3>
                  <p className="text-sm text-text-muted">Histórico de ações realizadas no workspace.</p>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background border-b border-border/50">
                      {['Data','Usuário','Ação','Recurso'].map((h) => (
                        <th key={h} className="py-3 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {auditRows.map((r, i) => (
                      <tr key={i} className="hover:bg-background/50 transition-colors">
                        <td className="py-4 px-6 text-sm text-text-muted">{r.date}</td>
                        <td className="py-4 px-6 text-sm font-mono text-text-main">{r.user}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${r.actionCls}`}>{r.action}</span>
                        </td>
                        <td className="py-4 px-6 text-sm font-mono text-text-muted">{r.resource}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Environments / Integrations / Profile / Preferences ── */}
          {['environments','integrations','profile','preferences'].includes(active) && (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-center">
              <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center">
                <Save size={28} className="text-border" />
              </div>
              <p className="text-base font-semibold text-text-main">
                {SIDEBAR_SECTIONS.flatMap((s) => s.items).find((i) => i.id === active)?.label}
              </p>
              <p className="text-sm text-text-light">Esta secção está em desenvolvimento.</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
