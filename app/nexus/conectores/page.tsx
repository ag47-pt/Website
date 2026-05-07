import type { Metadata } from 'next';
import { Search, Plus, Activity, Zap, Clock, AlertCircle, MoreVertical, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Conectores | NexusAI',
  description: 'Gerencie conectores e integrações do ecossistema de agentes.',
};

const activeConns = [
  {
    name: 'Slack Workspace',
    type: 'Chat / Notificações',
    icon: '💬', iconBg: 'bg-primary/10',
    status: 'saudável', statusCls: 'bg-success/10 text-success border-success/20',
    dotCls: 'bg-success',
    ratePct: 45, rateLbl: '450 / 1000 req/h',
    latency: '42ms', latencyCls: 'text-success',
    lastCheck: 'Há 30s',
  },
  {
    name: 'PostgreSQL Core',
    type: 'Banco de Dados',
    icon: '🐘', iconBg: 'bg-warning/10',
    status: 'saudável', statusCls: 'bg-success/10 text-success border-success/20',
    dotCls: 'bg-success',
    ratePct: 82, rateLbl: '820 / 1000 req/h',
    latency: '18ms', latencyCls: 'text-warning',
    lastCheck: 'Há 1 min',
    rateWarn: true,
  },
  {
    name: 'Google Drive Docs',
    type: 'Armazenamento',
    icon: '📂', iconBg: 'bg-danger/10',
    status: 'Erro Auth', statusCls: 'bg-danger/10 text-danger border-danger/20',
    dotCls: 'bg-danger',
    ratePct: 0, rateLbl: 'Auth inválido',
    latency: '—', latencyCls: 'text-text-light',
    lastCheck: 'Há 15 min',
    hasError: true,
  },
];

const marketplace = [
  { name: 'Slack',         cat: 'Comunicação',   icon: '💬', iconBg: 'bg-primary/10' },
  { name: 'PostgreSQL',    cat: 'Banco de Dados', icon: '🐘', iconBg: 'bg-warning/10' },
  { name: 'Google Drive',  cat: 'Armazenamento',  icon: '📂', iconBg: 'bg-info/10' },
  { name: 'REST API',      cat: 'HTTP',           icon: '🔗', iconBg: 'bg-text-muted/10' },
  { name: 'Salesforce',    cat: 'CRM',            icon: '☁️', iconBg: 'bg-primary/10' },
  { name: 'Zendesk',       cat: 'Suporte',        icon: '🎧', iconBg: 'bg-success/10' },
  { name: 'GitHub',        cat: 'Dev',            icon: '🐙', iconBg: 'bg-text-main/10' },
  { name: 'Jira',          cat: 'Projetos',       icon: '📋', iconBg: 'bg-info/10' },
];

export default function ConectoresPage() {
  return (
    <>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-surface border-b border-border py-4 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Conectores & Integrações</h1>
          <p className="text-sm text-text-muted mt-1">Gerencie as conexões do seu ecossistema de IA.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              placeholder="Buscar conectores..."
              className="w-56 pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium shadow-soft hover:shadow-glow transition-all text-sm">
            <Plus size={16} /> Novo Conector
          </button>
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 nexus-scrollbar">

        {/* Stats KPI */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Activity, iconBg: 'bg-success/10', iconTxt: 'text-success', label: 'Conectores Ativos', value: '24', sub: '+12% este mês', subCls: 'text-success' },
            { icon: Zap,      iconBg: 'bg-info/10',    iconTxt: 'text-info',    label: 'Taxa de Sucesso',   value: '99.8%', sub: 'Últimas 24h', subCls: 'text-text-muted' },
            { icon: Clock,    iconBg: 'bg-warning/10', iconTxt: 'text-warning', label: 'Latência API',      value: '124ms', sub: 'Média', subCls: 'text-text-muted' },
            { icon: AlertCircle, iconBg: 'bg-danger/10', iconTxt: 'text-danger', label: 'Erros de Conexão', value: '3', sub: 'Atenção requerida', subCls: 'text-danger' },
          ].map(({ icon: Icon, iconBg, iconTxt, label, value, sub, subCls }) => (
            <div key={label} className="bg-surface border border-border rounded-[20px] p-6 shadow-card">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-medium text-text-muted">{label}</p>
                <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center`}>
                  <Icon size={18} className={iconTxt} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-text-main mb-1">{value}</h2>
              <p className={`text-sm font-medium ${subCls}`}>{sub}</p>
            </div>
          ))}
        </section>

        {/* Active Connections */}
        <section className="bg-surface border border-border rounded-[24px] shadow-card overflow-hidden">
          <div className="p-6 border-b border-border/50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-main">Conexões Ativas</h3>
            <span className="text-sm text-text-muted">3 conexões</span>
          </div>
          <div className="overflow-x-auto nexus-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-background border-b border-border/50">
                  {['Conector','Status','Rate Limit','Latência','Última Verificação','Ações'].map((h) => (
                    <th key={h} className={`py-3 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider${h === 'Ações' ? ' text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {activeConns.map((c) => (
                  <tr key={c.name} className="hover:bg-background/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center text-lg`}>
                          {c.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-main">{c.name}</p>
                          <p className="text-xs text-text-muted">{c.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.statusCls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.dotCls}${c.dotCls === 'bg-success' ? ' nexus-pulse-dot' : ''}`} />
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1 min-w-[140px]">
                        <div className="flex justify-between text-xs text-text-muted mb-0.5">
                          <span>{c.rateLbl}</span>
                          <span className={c.rateWarn ? 'text-warning font-medium' : ''}>{c.ratePct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${c.rateWarn ? 'bg-warning' : c.ratePct === 0 ? 'bg-danger' : 'bg-success'}`}
                            style={{ width: `${c.ratePct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className={`py-4 px-6 text-sm font-semibold ${c.latencyCls}`}>{c.latency}</td>
                    <td className="py-4 px-6 text-sm text-text-muted">{c.lastCheck}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-muted hover:bg-background hover:text-text-main transition-colors">
                          <ExternalLink size={13} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-muted hover:bg-background hover:text-text-main transition-colors">
                          <MoreVertical size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Marketplace */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-main">Marketplace de Conectores</h3>
            <button className="text-sm text-primary font-medium hover:underline">Ver todos</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketplace.map((c) => (
              <div key={c.name} className="bg-surface border border-border rounded-[20px] p-5 shadow-card hover:shadow-soft hover:border-primary/30 transition-all flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center text-lg`}>
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-main">{c.name}</p>
                    <p className="text-xs text-text-muted">{c.cat}</p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/5 transition-colors mt-auto">
                  <Plus size={12} /> Adicionar
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
