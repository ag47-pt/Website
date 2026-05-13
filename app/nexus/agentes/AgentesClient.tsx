'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import {
  Search, Plus, Play, Pause, Download, Trash2,
  ChevronLeft, ChevronRight, MoreVertical, Loader2, AlertCircle,
} from 'lucide-react';
import { NEXUS_AGENTS, type NexusAgent } from '@/data/nexus-agents';

const PAGE_SIZE = 10;

const STATUS_OPTS = ['Todos', 'Ativo', 'Inativo', 'Erro'] as const;
const STATUS_MAP: Record<string, NexusAgent['status']> = {
  Ativo: 'active', Inativo: 'inactive', Erro: 'error',
};

export function AgentesClient() {
  const [allAgents, setAllAgents]     = useState<NexusAgent[]>(NEXUS_AGENTS);
  const [loadingDb, setLoadingDb]     = useState(true);
  const [dbError, setDbError]         = useState('');
  const [selected, setSelected]       = useState<string[]>([]);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatus]     = useState<string>('Todos');
  const [modelFilter, setModel]       = useState<string>('Todos');
  const [page, setPage]               = useState(1);
  const [deleting, setDeleting]       = useState<string | null>(null);

  /* ── Load merged agents (static + DB) ─────────────────────── */
  useEffect(() => {
    fetch('/api/nexus/agents')
      .then((r) => r.json())
      .then((d: unknown) => {
        if (d && typeof d === 'object' && 'agents' in d) {
          setAllAgents((d as { agents: NexusAgent[] }).agents);
        }
      })
      .catch(() => setDbError('Não foi possível carregar agentes da base de dados.'))
      .finally(() => setLoadingDb(false));
  }, []);

  /* ── Unique model labels for filter ───────────────────────── */
  const modelOptions = useMemo(() => {
    const set = new Set(allAgents.map((a) => a.model));
    return ['Todos', ...Array.from(set)];
  }, [allAgents]);

  /* ── Filtered + paginated list ────────────────────────────── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allAgents.filter((a) => {
      const matchSearch = !q ||
        a.name.toLowerCase().includes(q) ||
        a.desc.toLowerCase().includes(q) ||
        a.model.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'Todos' || a.status === STATUS_MAP[statusFilter];
      const matchModel  = modelFilter  === 'Todos' || a.model === modelFilter;
      return matchSearch && matchStatus && matchModel;
    });
  }, [allAgents, search, statusFilter, modelFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageAgents = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  /* ── Delete a DB (non-built-in) agent ─────────────────────── */
  const handleDelete = async (id: string) => {
    if (!confirm(`Eliminar agente "${id}"?`)) return;
    setDeleting(id);
    try {
      await fetch(`/api/nexus/agents/${id}`, { method: 'DELETE' });
      setAllAgents((prev) => prev.filter((a) => a.id !== id));
      setSelected((prev) => prev.filter((x) => x !== id));
    } finally {
      setDeleting(null);
    }
  };

  /* ── Static built-in agent ids ────────────────────────────── */
  const builtInIds = new Set(NEXUS_AGENTS.map((a) => a.id));

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-surface border-b border-border py-4 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Agentes</h1>
          <p className="text-sm text-text-muted mt-1">
            {loadingDb
              ? 'A carregar...'
              : `${allAgents.length} agente${allAgents.length !== 1 ? 's' : ''} no total`}
          </p>
        </div>
        <Link
          href="/nexus/agentes/novo"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium shadow-soft hover:shadow-glow transition-all"
        >
          <Plus size={16} />
          Criar Agente
        </Link>
      </header>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 nexus-scrollbar">

        {dbError && (
          <div className="flex items-center gap-3 p-4 bg-warning/10 border border-warning/20 rounded-[16px] text-sm text-warning">
            <AlertCircle size={16} className="shrink-0" />
            {dbError} A mostrar apenas agentes integrados.
          </div>
        )}

        {/* Filters Toolbar */}
        <section className="bg-surface border border-border rounded-[20px] p-4 shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
            <div className="relative w-full sm:w-72">
              <label htmlFor="agent_search" className="sr-only">Buscar agentes</label>
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
              <input
                id="agent_search"
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Buscar agentes..."
                className="w-full pl-9 pr-4 py-2 bg-input-bg border border-input-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto nexus-scrollbar pb-1 sm:pb-0">
              <select
                value={statusFilter}
                aria-label="Filtrar por status"
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                className="px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none min-w-[130px]"
              >
                {STATUS_OPTS.map((s) => <option key={s}>Status: {s}</option>)}
              </select>
              <select
                value={modelFilter}
                aria-label="Filtrar por modelo"
                onChange={(e) => { setModel(e.target.value); setPage(1); }}
                className="px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none min-w-[130px]"
              >
                {modelOptions.map((m) => <option key={m}>Modelo: {m === 'Todos' ? 'Todos' : m}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-4">
            <span className="text-sm text-text-muted mr-2">Ações:</span>
            {[
              { icon: Play,     cls: 'text-success hover:bg-success/10',  title: 'Ativar' },
              { icon: Pause,    cls: 'text-warning hover:bg-warning/10',  title: 'Desativar' },
              { icon: Download, cls: 'text-info hover:bg-info/10',        title: 'Exportar' },
            ].map(({ icon: Icon, cls, title }) => (
              <button
                key={title}
                title={title}
                className={`w-9 h-9 flex items-center justify-center rounded-lg border border-border ${cls} transition-colors`}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </section>

        {/* Agents Table */}
        <section className="bg-surface border border-border rounded-[24px] shadow-card overflow-hidden">
          <div className="overflow-x-auto nexus-scrollbar">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-background border-b border-border/50">
                  <th className="py-4 px-6 w-12 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border accent-primary"
                      onChange={(e) => setSelected(e.target.checked ? pageAgents.map((a) => a.id) : [])}
                      checked={pageAgents.length > 0 && pageAgents.every((a) => selected.includes(a.id))}
                    />
                  </th>
                  {['Agente','Modelo','Ferramentas','Última Execução','Saúde','Ações'].map((h) => (
                    <th key={h} className={`py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider${h === 'Saúde' ? ' text-center' : h === 'Ações' ? ' text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loadingDb && pageAgents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <Loader2 size={28} className="animate-spin text-primary mx-auto" />
                    </td>
                  </tr>
                ) : pageAgents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-text-muted text-sm">
                      Nenhum agente corresponde aos filtros actuais.
                    </td>
                  </tr>
                ) : pageAgents.map((a) => (
                  <tr key={a.id} className="hover:bg-background/50 transition-colors group">
                    <td className="py-4 px-6 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(a.id)}
                        onChange={() => toggle(a.id)}
                        className="w-4 h-4 rounded border-border accent-primary"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${a.iconBg} flex items-center justify-center shrink-0`}>
                          <span className={`text-sm font-bold ${a.iconTxt}`}>{a.name[0]}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors">{a.name}</p>
                            {a.isReal && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase">Live</span>
                            )}
                          </div>
                          <p className="text-xs text-text-muted max-w-[200px] truncate">{a.desc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-background border border-border text-text-main">
                        {a.model}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5">
                        {a.tools.slice(0, 3).map((t) => (
                          <span key={t.label} className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${t.cls}`}>
                            {t.label}
                          </span>
                        ))}
                        {a.tools.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border bg-background text-text-muted border-border">
                            +{a.tools.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-text-main">{a.lastExec}</p>
                      <p className={`text-xs ${a.lastStatusCls}`}>{a.lastStatus}</p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {a.health.map((c, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${c}`} />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/nexus/agentes/${a.id}`}
                          className="text-sm font-medium text-primary hover:underline px-2"
                        >
                          Detalhes
                        </Link>
                        {!builtInIds.has(a.id) && (
                          <button
                            title="Eliminar"
                            onClick={() => handleDelete(a.id)}
                            disabled={deleting === a.id}
                            className="text-text-light hover:text-danger transition-colors w-8 h-8 rounded-lg hover:bg-danger/10 border border-transparent hover:border-danger/20 flex items-center justify-center"
                          >
                            {deleting === a.id
                              ? <Loader2 size={13} className="animate-spin" />
                              : <Trash2 size={13} />}
                          </button>
                        )}
                        <button className="text-text-light hover:text-text-main transition-colors w-8 h-8 rounded-lg hover:bg-surface border border-transparent hover:border-border flex items-center justify-center">
                          <MoreVertical size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-border/50 flex items-center justify-between bg-surface">
            <p className="text-sm text-text-muted">
              {filtered.length === 0
                ? 'Sem resultados'
                : <>
                    Mostrando <span className="font-medium text-text-main">{(page - 1) * PAGE_SIZE + 1}</span> a{' '}
                    <span className="font-medium text-text-main">{Math.min(page * PAGE_SIZE, filtered.length)}</span> de{' '}
                    <span className="font-medium text-text-main">{filtered.length}</span> agentes
                  </>
              }
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-muted hover:bg-background disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).filter((n) => {
                return n === 1 || n === totalPages || Math.abs(n - page) <= 1;
              }).reduce<(number | '...')[]>((acc, n, i, arr) => {
                if (i > 0 && typeof arr[i - 1] === 'number' && (n as number) - (arr[i - 1] as number) > 1) acc.push('...');
                acc.push(n);
                return acc;
              }, []).map((n, i) =>
                n === '...'
                  ? <span key={`e${i}`} className="text-text-muted px-1">…</span>
                  : <button
                      key={n}
                      onClick={() => setPage(n as number)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-medium ${
                        n === page
                          ? 'border-primary bg-primary text-white'
                          : 'border-border text-text-main hover:bg-background'
                      }`}
                    >{n}</button>
              )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-muted hover:bg-background disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
