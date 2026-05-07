import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Plus, Link2, Server, Terminal, Bot, Plug, Layers, TrendingUp,
  Bell, Search, AlertCircle, AlertTriangle, Info, CheckCircle,
  TrendingDown, MoreVertical, BarChart3,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard | NexusAI',
  description: 'Visão geral e monitoramento do ecossistema de agentes de IA.',
};

const recentExecutions = [
  { agent: 'Suporte Tier 1',      task: 'Análise de Ticket #482',      icon: '🎧', color: 'primary', status: 'success', duration: '2.4s' },
  { agent: 'Analista de Dados',   task: 'Query SQL Relatório Mensal',  icon: '📊', color: 'info',    status: 'running', duration: '14.1s' },
  { agent: 'Assistente Vendas',   task: 'Draft Email Follow-up',       icon: '✉️', color: 'warning', status: 'error',   duration: '0.8s' },
  { agent: 'Suporte Tier 1',      task: 'Resumo Documentação',         icon: '🎧', color: 'primary', status: 'success', duration: '3.2s' },
];

const statusBadge: Record<string, string> = {
  success: 'bg-success/10 text-success border border-success/20',
  running: 'bg-primary/10 text-primary border border-primary/20',
  error:   'bg-danger/10 text-danger border border-danger/20',
};
const statusLabel: Record<string, string> = {
  success: 'Sucesso',
  running: 'Processando',
  error:   'Falha',
};

export default function DashboardPage() {
  return (
    <>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-surface border-b border-border py-4 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Visão Geral</h1>
          <p className="text-sm text-text-muted mt-1">
            Monitore o status e a performance do seu ecossistema de IA.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              type="text"
              placeholder="Buscar agentes, logs..."
              className="w-64 pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <button className="relative w-10 h-10 rounded-xl border border-border flex items-center justify-center text-text-muted hover:bg-background hover:text-text-main transition-colors">
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-surface" />
          </button>
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 nexus-scrollbar">

        {/* Quick Actions */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: '/nexus/agentes/novo', icon: Plus,     label: 'Criar Agente',     sub: 'Novo assistente IA',   iconBg: 'bg-primary/10',  iconTxt: 'text-primary', hoverTxt: 'group-hover:text-primary' },
            { href: '/nexus/conectores',   icon: Link2,    label: 'Adicionar Conector', sub: 'Integração externa', iconBg: 'bg-info/10',     iconTxt: 'text-info',    hoverTxt: 'group-hover:text-info' },
            { href: '/nexus/mcps',         icon: Server,   label: 'Registrar MCP',    sub: 'Novo provedor',        iconBg: 'bg-warning/10',  iconTxt: 'text-warning', hoverTxt: 'group-hover:text-warning' },
            { href: '/nexus/monitoramento',icon: Terminal, label: 'Ver Logs',          sub: 'Histórico recente',   iconBg: 'bg-text-muted/10',iconTxt:'text-text-muted',hoverTxt:'' },
          ].map(({ href, icon: Icon, label, sub, iconBg, iconTxt, hoverTxt }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 p-4 bg-surface border border-border rounded-[16px] shadow-card hover:shadow-soft hover:border-primary/30 transition-all group text-left"
            >
              <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center group-hover:opacity-80 transition-colors`}>
                <Icon size={20} className={iconTxt} />
              </div>
              <div>
                <h3 className={`font-semibold text-text-main ${hoverTxt} transition-colors`}>{label}</h3>
                <p className="text-xs text-text-muted mt-0.5">{sub}</p>
              </div>
            </Link>
          ))}
        </section>

        {/* KPI Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Agentes */}
          <div className="bg-surface border border-border rounded-[20px] p-6 shadow-card relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm font-medium text-text-muted">Agentes</p>
                <h2 className="text-3xl font-bold text-text-main mt-1">24</h2>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot size={18} className="text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm relative z-10">
              <div className="flex items-center gap-1.5 text-success font-medium">
                <span className="w-2 h-2 rounded-full bg-success" /> 18 Ativos
              </div>
              <div className="flex items-center gap-1.5 text-text-muted">
                <span className="w-2 h-2 rounded-full bg-border" /> 6 Inativos
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
          </div>

          {/* Conectores */}
          <div className="bg-surface border border-border rounded-[20px] p-6 shadow-card relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm font-medium text-text-muted">Conectores</p>
                <h2 className="text-3xl font-bold text-text-main mt-1">12</h2>
              </div>
              <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center">
                <Plug size={18} className="text-info" />
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm relative z-10">
              <div className="flex items-center gap-1.5 text-success font-medium">
                <span className="w-2 h-2 rounded-full bg-success" /> 11 Saudáveis
              </div>
              <div className="flex items-center gap-1.5 text-danger font-medium">
                <span className="w-2 h-2 rounded-full bg-danger animate-pulse" /> 1 Falhando
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-info/5 rounded-full blur-xl" />
          </div>

          {/* MCPs */}
          <div className="bg-surface border border-border rounded-[20px] p-6 shadow-card relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm font-medium text-text-muted">MCPs</p>
                <h2 className="text-3xl font-bold text-text-main mt-1">5</h2>
              </div>
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <Server size={18} className="text-warning" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm relative z-10 text-text-muted">
              <CheckCircle size={14} className="text-success" /> Registrados
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-warning/5 rounded-full blur-xl" />
          </div>

          {/* Fila de Execução */}
          <div className="bg-surface border border-border rounded-[20px] p-6 shadow-card relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm font-medium text-text-muted">Fila de Execução</p>
                <h2 className="text-3xl font-bold text-text-main mt-1">142</h2>
              </div>
              <div className="w-10 h-10 rounded-full bg-text-muted/10 flex items-center justify-center">
                <Layers size={18} className="text-text-muted" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm relative z-10">
              <span className="flex items-center gap-1 text-success font-medium">
                <TrendingUp size={12} /> 12%
              </span>
              <span className="text-text-muted">vs última hora</span>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-text-muted/5 rounded-full blur-xl" />
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Token Consumption (2 cols) */}
          <div className="lg:col-span-2 bg-surface border border-border rounded-[24px] shadow-card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-text-main">Consumo de Tokens</h3>
                <p className="text-sm text-text-muted">Uso diário de tokens por modelo</p>
              </div>
              <div className="flex bg-background p-1 rounded-lg border border-border">
                <button className="px-3 py-1 text-xs font-medium bg-surface shadow-sm rounded-md text-text-main">7 Dias</button>
                <button className="px-3 py-1 text-xs font-medium text-text-muted hover:text-text-main">30 Dias</button>
              </div>
            </div>
            {/* Chart placeholder */}
            <div className="flex-1 min-h-[240px] bg-background rounded-xl flex items-end gap-1 p-4 overflow-hidden">
              {[12, 19, 15, 22, 28, 14, 11].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col-reverse gap-0.5">
                    <div
                      className="w-full bg-primary/60 rounded-sm transition-all"
                      style={{ height: `${v * 5}px` }}
                    />
                    <div
                      className="w-full bg-success/40 rounded-sm"
                      style={{ height: `${Math.round(v * 0.4 * 5)}px` }}
                    />
                  </div>
                  <span className="text-[10px] text-text-light">
                    {['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <span className="w-3 h-3 rounded bg-primary/60" /> GPT-4
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <span className="w-3 h-3 rounded bg-success/40" /> Gemini
              </div>
            </div>
          </div>

          {/* Costs Breakdown (1 col) */}
          <div className="bg-surface border border-border rounded-[24px] shadow-card p-6 flex flex-col">
            <h3 className="text-lg font-bold text-text-main mb-1">Custos Estimados</h3>
            <p className="text-sm text-text-muted mb-6">Distribuição por provedor</p>
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-center text-text-main mb-1">$482.50</h2>
              <p className="text-center text-sm text-text-muted mb-6">Total este mês</p>
              <div className="space-y-4">
                {[
                  { label: 'OpenAI (GPT-4)', value: '$320.00', pct: '66%', color: 'bg-primary' },
                  { label: 'Gemini',          value: '$110.50', pct: '23%', color: 'bg-info' },
                  { label: 'Outros',          value: '$52.00',  pct: '11%', color: 'bg-warning' },
                ].map(({ label, value, pct, color }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        <span className="text-sm font-medium text-text-main">{label}</span>
                      </div>
                      <span className="text-sm font-semibold">{value}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-1.5">
                      <div className={`${color} h-1.5 rounded-full`} style={{ width: pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom: Executions + Alerts */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Executions */}
          <div className="bg-surface border border-border rounded-[24px] shadow-card overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-main">Execuções Recentes</h3>
                <p className="text-sm text-text-muted">Últimas tarefas processadas pelos agentes</p>
              </div>
              <Link href="/nexus/monitoramento" className="text-sm text-primary font-medium hover:underline">
                Ver todas
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background border-b border-border/50">
                    <th className="py-3 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Agente / Tarefa</th>
                    <th className="py-3 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                    <th className="py-3 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Duração</th>
                    <th className="py-3 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {recentExecutions.map((row, i) => (
                    <tr key={i} className="hover:bg-background/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded bg-${row.color}/10 flex items-center justify-center`}>
                            <BarChart3 size={12} className={`text-${row.color}`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-main">{row.agent}</p>
                            <p className="text-xs text-text-muted">{row.task}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge[row.status]}`}>
                          {statusLabel[row.status]}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-text-muted">{row.duration}</td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-text-light hover:text-text-main transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alerts & Heartbeats */}
          <div className="bg-surface border border-border rounded-[24px] shadow-card overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-main">Alertas & Heartbeats</h3>
                <p className="text-sm text-text-muted">Monitoramento de saúde do sistema</p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-danger/10 text-danger text-xs font-semibold border border-danger/20">
                1 Crítico
              </span>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto max-h-[350px] nexus-scrollbar">
              {/* Critical */}
              <div className="p-4 rounded-xl border border-danger/30 bg-danger/5 flex items-start gap-4">
                <AlertCircle size={16} className="text-danger mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-text-main">Falha de Conexão: Salesforce API</h4>
                    <span className="text-xs text-text-muted">Há 5 min</span>
                  </div>
                  <p className="text-xs text-text-muted mb-2">
                    Conector 'CRM_Salesforce' falhou nos últimos 3 heartbeats consecutivos.
                  </p>
                  <div className="flex gap-2">
                    <button className="text-xs font-medium text-danger hover:underline">Ver Detalhes</button>
                    <span className="text-border">•</span>
                    <button className="text-xs font-medium text-text-muted hover:text-text-main">Ignorar</button>
                  </div>
                </div>
              </div>
              {/* Warning */}
              <div className="p-4 rounded-xl border border-warning/30 bg-warning/5 flex items-start gap-4">
                <AlertTriangle size={16} className="text-warning mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-text-main">Latência Alta: GPT-4</h4>
                    <span className="text-xs text-text-muted">Há 22 min</span>
                  </div>
                  <p className="text-xs text-text-muted">
                    Tempo médio de resposta do modelo excedeu 15s nas últimas 10 requisições.
                  </p>
                </div>
              </div>
              {/* Info */}
              <div className="p-4 rounded-xl border border-border bg-surface flex items-start gap-4">
                <Info size={16} className="text-info mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-text-main">Novo MCP Registrado</h4>
                    <span className="text-xs text-text-muted">Há 1 hora</span>
                  </div>
                  <p className="text-xs text-text-muted">
                    Servidor MCP 'Local_Docs_Search' conectado com sucesso.
                  </p>
                </div>
              </div>
              {/* Success */}
              <div className="p-4 rounded-xl border border-border bg-surface flex items-start gap-4">
                <CheckCircle size={16} className="text-success mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-text-main">Deploy de Agente Concluído</h4>
                    <span className="text-xs text-text-muted">Há 3 horas</span>
                  </div>
                  <p className="text-xs text-text-muted">
                    Agente 'Analista de Dados' atualizado para versão v1.2.0.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
