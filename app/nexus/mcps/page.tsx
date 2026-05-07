import type { Metadata } from 'next';
import { Search, Plus, TestTube2, RefreshCw, PowerOff, Trash2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MCPs | NexusAI',
  description: 'Gerencie servidores MCP do ecossistema de agentes.',
};

const mcpServers = [
  {
    name: 'Code Interpreter',
    slug: 'python-ast-v2',
    status: 'Online', statusCls: 'bg-success/10 text-success border-success/20', dotCls: 'bg-success',
    latency: '45ms', latencyCls: 'text-success',
    version: 'v1.2.0',
    caps: ['execute_code', 'read_file', 'write_file'],
  },
  {
    name: 'Web Searcher',
    slug: 'google-search-mcp',
    status: 'Degradado', statusCls: 'bg-warning/10 text-warning border-warning/20', dotCls: 'bg-warning',
    latency: '850ms', latencyCls: 'text-danger',
    version: 'v0.9.5',
    caps: ['search', 'extract_text'],
  },
];

const capabilities = [
  { name: 'execute_code',    desc: 'Executa snippets Python, JS e Shell de forma isolada.', mcp: 'Code Interpreter', icon: '⚙️', iconBg: 'bg-primary/10' },
  { name: 'google_search',   desc: 'Busca na web via Google Custom Search API.',           mcp: 'Web Searcher',     icon: '🔍', iconBg: 'bg-info/10' },
];

export default function MCPsPage() {
  return (
    <>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-surface border-b border-border py-4 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Gestão de MCPs</h1>
          <p className="text-sm text-text-muted mt-1">Registre e monitore seus servidores MCP (Model Context Protocol).</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              placeholder="Buscar MCPs..."
              className="w-56 pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium shadow-soft hover:shadow-glow transition-all text-sm">
            <Plus size={16} /> Novo MCP Server
          </button>
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 nexus-scrollbar">

        {/* Registration Form */}
        <section className="bg-surface border border-border rounded-[24px] shadow-card p-6">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-text-main">Registrar Novo MCP Server</h3>
            <p className="text-sm text-text-muted mt-1">Configure um novo endpoint MCP para uso pelos agentes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Nome</label>
              <input
                placeholder="Ex: Code Runner"
                className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-text-main mb-1.5">Endpoint URL</label>
              <input
                placeholder="https://mcp.exemplo.com/v1"
                className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Versão</label>
              <input
                placeholder="Ex: 1.0.0"
                className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Tipo de Auth</label>
              <select className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                <option>Bearer Token</option>
                <option>API Key</option>
                <option>Basic Auth</option>
                <option>Nenhum</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-text-main mb-1.5">Token / Key</label>
              <input
                type="password"
                placeholder="••••••••••••••"
                className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex items-end">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium shadow-soft hover:shadow-glow transition-all text-sm">
                <TestTube2 size={14} /> Validar & Salvar
              </button>
            </div>
          </div>
        </section>

        {/* Fleet Status */}
        <section className="bg-surface border border-border rounded-[24px] shadow-card overflow-hidden">
          <div className="p-6 border-b border-border/50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-text-main">Status da Frota</h3>
              <p className="text-sm text-text-muted">{mcpServers.length} servidores registados</p>
            </div>
          </div>
          <div className="overflow-x-auto nexus-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-background border-b border-border/50">
                  {['Servidor MCP','Status','Latência','Versão','Capacidades','Ações'].map((h) => (
                    <th key={h} className={`py-3 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider${h === 'Ações' ? ' text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {mcpServers.map((s) => (
                  <tr key={s.name} className="hover:bg-background/50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="text-sm font-semibold text-text-main">{s.name}</p>
                      <p className="text-xs text-text-muted font-mono">{s.slug}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.statusCls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dotCls} nexus-pulse-dot`} />
                        {s.status}
                      </span>
                    </td>
                    <td className={`py-4 px-6 text-sm font-semibold ${s.latencyCls}`}>{s.latency}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-background border border-border text-text-main">
                        {s.version}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5">
                        {s.caps.map((c) => (
                          <span key={c} className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {[
                          { icon: TestTube2, title: 'Testar',     cls: 'hover:bg-info/10 hover:text-info' },
                          { icon: RefreshCw, title: 'Atualizar',  cls: 'hover:bg-success/10 hover:text-success' },
                          { icon: PowerOff,  title: 'Desativar',  cls: 'hover:bg-warning/10 hover:text-warning' },
                          { icon: Trash2,    title: 'Remover',    cls: 'hover:bg-danger/10 hover:text-danger' },
                        ].map(({ icon: Icon, title, cls }) => (
                          <button
                            key={title}
                            title={title}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-muted transition-colors ${cls}`}
                          >
                            <Icon size={13} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Capabilities & Tools */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-main">Capacidades & Ferramentas Disponíveis</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((cap) => (
              <div key={cap.name} className="bg-surface border border-border rounded-[20px] p-5 shadow-card hover:shadow-soft transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${cap.iconBg} flex items-center justify-center text-lg`}>
                    {cap.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-main font-mono">{cap.name}</p>
                    <p className="text-xs text-text-muted">{cap.mcp}</p>
                  </div>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">{cap.desc}</p>
              </div>
            ))}

            {/* CTA */}
            <div className="bg-background border-2 border-dashed border-border rounded-[20px] p-5 flex flex-col items-center justify-center gap-3 hover:border-primary/40 transition-colors group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Search size={18} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-text-main">Descobrir Ferramentas</p>
                <p className="text-xs text-text-muted">Conecte um novo MCP para expandir as capacidades</p>
              </div>
              <button className="text-xs font-medium text-primary hover:underline">+ Registrar MCP</button>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
