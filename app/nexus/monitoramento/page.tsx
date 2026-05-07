'use client';

import { useState } from 'react';
import { Download, ChevronDown, ChevronRight, CheckCircle, XCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const TIME_RANGES = ['24h', '7d', '30d'];

type LogLevel = 'ERROR' | 'INFO' | 'WARN';
const levelCls: Record<LogLevel, string> = {
  ERROR: 'bg-danger/10 text-danger border-danger/20',
  INFO:  'bg-success/10 text-success border-success/20',
  WARN:  'bg-warning/10 text-warning border-warning/20',
};

const logs: Array<{ ts: string; level: LogLevel; comp: string; trace: string; msg: string; dur: string }> = [
  { ts: '14:32:10.842', level: 'ERROR', comp: 'Salesforce Sync',  trace: 'trc_7f3a...', msg: "Connection timeout after 3 retries on 'sf_prod'. Check OAuth token.",         dur: '30.1s' },
  { ts: '14:31:05.512', level: 'INFO',  comp: 'Support Bot',      trace: 'trc_2b8c...', msg: 'Task completed: Ticket #7782 resolved. Zendesk updated.',                     dur: '1.2s'  },
  { ts: '14:29:50.001', level: 'WARN',  comp: 'Vector DB Sync',   trace: 'trc_e4d1...', msg: "Embedding latency above threshold (4.5s). Model: text-embedding-3-large.",    dur: '4.5s'  },
  { ts: '14:28:30.177', level: 'INFO',  comp: 'Function Router',  trace: 'trc_9ac2...', msg: "Function 'get_customer_data' executed. Result cached for 60s.",               dur: '0.3s'  },
];

const healthAgents = [
  { name: 'Support Bot A',     ok: true,  note: '' },
  { name: 'Sales Assistant',   ok: true,  note: '' },
  { name: 'Data Analyst',      ok: false, note: '45s timeout' },
];
const healthConnectors = [
  { name: 'Zendesk',          ok: true,  note: '' },
  { name: 'Salesforce Sync',  ok: false, note: 'Auth failed' },
];
const healthMcps = [
  { name: 'Vector DB Sync',   ok: true, note: '' },
  { name: 'Function Router',  ok: true, note: '' },
];

export default function MonitoramentoPage() {
  const [range, setRange] = useState('24h');

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-surface border-b border-border py-4 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Monitoramento & Logs</h1>
          <p className="text-sm text-text-muted mt-1">Análise de performance e rastreamento de execuções.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-border text-text-main rounded-xl font-medium hover:bg-background transition-colors text-sm">
          <Download size={14} /> Exportar Relatório
        </button>
      </header>

      {/* ── Sticky Filter Bar ──────────────────────────────────── */}
      <div className="bg-surface/95 backdrop-blur border-b border-border px-6 sm:px-8 py-3 flex flex-wrap items-center gap-4 sticky top-[73px] z-20">
        <span className="text-sm font-semibold text-text-muted">Filtros</span>
        <div className="flex bg-background p-1 rounded-lg border border-border gap-0.5">
          {TIME_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${range === r ? 'bg-surface text-text-main shadow-card' : 'text-text-muted hover:text-text-main'}`}
            >
              {r}
            </button>
          ))}
        </div>
        <select className="px-3 py-1.5 bg-surface border border-border rounded-xl text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none text-xs">
          <option>Todos os Agentes</option>
          <option>Support Bot</option>
          <option>Data Analyst</option>
        </select>
        <select className="px-3 py-1.5 bg-surface border border-border rounded-xl text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none text-xs">
          <option>Todos os Conectores</option>
          <option>Zendesk</option>
          <option>Salesforce</option>
        </select>
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 nexus-scrollbar">

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Requisições',    value: '124.5k', delta: '+12%',     deltaCls: 'text-success', icon: TrendingUp, iconCls: 'text-success', bg: 'bg-success/10' },
            { label: 'Taxa de Erro',   value: '0.45%',  delta: '-0.1%',    deltaCls: 'text-success', icon: TrendingDown, iconCls: 'text-success', bg: 'bg-success/10' },
            { label: 'Latência Média', value: '842ms',  delta: '+45ms',    deltaCls: 'text-danger',  icon: TrendingUp, iconCls: 'text-danger',  bg: 'bg-danger/10' },
            { label: 'Tokens',         value: '4.2M',   delta: '$42.50',   deltaCls: 'text-info',    icon: TrendingUp, iconCls: 'text-info',    bg: 'bg-info/10' },
          ].map(({ label, value, delta, deltaCls, icon: Icon, iconCls, bg }) => (
            <div key={label} className="bg-surface border border-border rounded-[20px] p-6 shadow-card">
              <div className="flex justify-between items-start mb-3">
                <p className="text-sm font-medium text-text-muted">{label}</p>
                <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center`}>
                  <Icon size={14} className={iconCls} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-text-main mb-1">{value}</h2>
              <p className={`text-sm font-medium ${deltaCls}`}>{delta}</p>
            </div>
          ))}
        </section>

        {/* Health Grid */}
        <section className="bg-surface border border-border rounded-[24px] shadow-card overflow-hidden">
          <div className="p-5 border-b border-border/50">
            <h3 className="text-base font-bold text-text-main">Health Overview</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/50">
            {[
              { title: 'Agentes',     items: healthAgents },
              { title: 'Conectores',  items: healthConnectors },
              { title: 'MCPs',        items: healthMcps },
            ].map(({ title, items }) => (
              <div key={title} className="p-5">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">{title}</p>
                <div className="space-y-2.5">
                  {items.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      {item.ok
                        ? <CheckCircle size={14} className="text-success shrink-0" />
                        : item.note?.includes('timeout')
                          ? <AlertTriangle size={14} className="text-warning shrink-0" />
                          : <XCircle size={14} className="text-danger shrink-0" />
                      }
                      <span className="text-sm text-text-main">{item.name}</span>
                      {!item.ok && item.note && (
                        <span className="text-xs text-danger ml-auto">{item.note}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {['Latência por Agente', 'Consumo de Tokens'].map((title) => (
            <div key={title} className="bg-surface border border-border rounded-[24px] shadow-card p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-text-main">{title}</h3>
              </div>
              <div className="flex-1 min-h-[200px] bg-background rounded-xl flex items-end gap-1.5 p-4 overflow-hidden">
                {[40, 65, 30, 80, 55, 70, 45, 60, 35, 75].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary/40 rounded-sm hover:bg-primary/60 transition-colors"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Logs Table */}
        <section className="bg-surface border border-border rounded-[24px] shadow-card overflow-hidden">
          <div className="p-6 border-b border-border/50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-main">Log de Execuções</h3>
            <select className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
              <option>Todos os níveis</option>
              <option>ERROR</option>
              <option>WARN</option>
              <option>INFO</option>
            </select>
          </div>
          <div className="overflow-x-auto nexus-scrollbar">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-background border-b border-border/50">
                  {['Timestamp','Nível','Componente','Trace ID','Mensagem','Duração',''].map((h, i) => (
                    <th key={i} className="py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {logs.map((log, i) => (
                  <tr key={i} className="hover:bg-background/50 transition-colors group">
                    <td className="py-3 px-4 text-xs font-mono text-text-muted whitespace-nowrap">{log.ts}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${levelCls[log.level]}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-text-main whitespace-nowrap">{log.comp}</td>
                    <td className="py-3 px-4 text-xs font-mono text-text-muted">{log.trace}</td>
                    <td className="py-3 px-4 text-xs text-text-muted max-w-[300px] truncate">{log.msg}</td>
                    <td className={`py-3 px-4 text-xs font-mono ${log.level === 'ERROR' ? 'text-danger font-bold' : 'text-text-muted'}`}>
                      {log.dur}
                    </td>
                    <td className="py-3 px-4">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-text-light hover:text-primary">
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-border/50 flex items-center justify-between bg-surface">
            <p className="text-sm text-text-muted">
              Mostrando <span className="font-medium text-text-main">1–4</span> de{' '}
              <span className="font-medium text-text-main">2,451</span> logs
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs font-medium bg-surface border border-border rounded-lg text-text-muted hover:bg-background transition-colors">
                Anterior
              </button>
              <button className="px-3 py-1.5 text-xs font-medium bg-primary text-white border border-primary rounded-lg transition-colors">
                Próxima
              </button>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
