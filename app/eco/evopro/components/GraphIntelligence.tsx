'use client';

import React from 'react';
import {useTheme} from '@/context/ThemeContext';
import {CODE_GRAPH_BENCHMARK} from '@/data/evopro';
import {Network,ShieldCheck,Info} from 'lucide-react';
import {GraphInteractiveVisualizer} from './GraphInteractiveVisualizer';

export function GraphIntelligence(){
  const{theme}=useTheme();
  const b=CODE_GRAPH_BENCHMARK;
  const rows=[
    ['Affected tests discovered',b.withoutGraph.affectedTests,b.withGraph.affectedTests],
    ['Dependent components discovered',b.withoutGraph.dependentComponents,b.withGraph.dependentComponents],
    ['Files ranked by import distance',b.withoutGraph.filesRanked,b.withGraph.filesRanked],
    ['Context tokens',b.withoutGraph.contextTokens,b.withGraph.contextTokens],
  ];
  return <section id="graph" className="py-20 md:py-28 border-t border-white/5 relative bg-zinc-950/40"><div className="max-w-7xl mx-auto px-4 sm:px-6">
    <div className="text-center max-w-3xl mx-auto mb-14"><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4"><Network className="w-3.5 h-3.5"/>GRAPH INTELLIGENCE</div><h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">Graph-enhanced, not graph-dependent.</h2><p className="text-zinc-400 text-sm sm:text-base leading-relaxed">Code Graph e Evolution Graph adicionam evidência estrutural para dependências, blast radius e histórico. O grafo melhora recuperação e validação quando disponível, mas não se torna uma fonte mágica ou obrigatória de verdade.</p></div>
    <div className="grid md:grid-cols-2 gap-5 mb-10 font-mono text-xs"><div className="p-6 rounded-3xl bg-zinc-950 border border-cyan-500/25"><div className="flex items-center gap-2 text-cyan-400 font-bold mb-3"><Network className="w-4 h-4"/>Evidence-enhanced</div><p className="text-zinc-400 font-sans leading-relaxed">A análise pode usar relações observadas e inferidas para priorizar arquivos e testes. Se o provider não estiver disponível, o protocolo degrada para evidência do filesystem e outras fontes do host.</p></div><div className="p-6 rounded-3xl bg-zinc-950 border border-purple-500/25"><div className="flex items-center gap-2 text-purple-400 font-bold mb-3"><ShieldCheck className="w-4 h-4"/>Epistemic status preserved</div><p className="text-zinc-400 font-sans leading-relaxed">AST observado, heurística ou inferência não recebem a mesma confiança. Proveniência e nível de evidência devem permanecer visíveis para o agente.</p></div></div>
    <GraphInteractiveVisualizer/>
    <div className="mt-10 rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-9"><div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-5 mb-5 border-b border-zinc-800"><div><span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Historical measured benchmark</span><h3 className="text-xl font-bold text-white mt-1">A/B Graph Context · {b.repository}</h3></div><span className="text-[10px] font-mono px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/[.05] text-amber-400">HISTORICAL EVIDENCE · NOT LIVE</span></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7 font-mono text-center"><div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800"><span className="text-[9px] text-zinc-500 block">FILES</span><b>{b.files}</b></div><div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800"><span className="text-[9px] text-zinc-500 block">NODES</span><b>{b.nodes}</b></div><div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800"><span className="text-[9px] text-zinc-500 block">EDGES</span><b>{b.edges}</b></div><div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800"><span className="text-[9px] text-zinc-500 block">PARSE ERRORS</span><b>{b.parseErrors}</b></div></div>
      <div className="overflow-x-auto"><table className="w-full text-left font-mono text-xs"><thead><tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase"><th className="pb-3">Métrica</th><th className="pb-3">Sem grafo</th><th className="pb-3 text-emerald-400">Com grafo</th></tr></thead><tbody>{rows.map(r=><tr key={String(r[0])} className="border-b border-zinc-800/60"><td className="py-3 text-zinc-300">{r[0]}</td><td className="py-3 text-zinc-500">{r[1]}</td><td className="py-3 text-emerald-400 font-bold">{r[2]}</td></tr>)}</tbody></table></div>
      <div className="mt-5 flex items-start gap-2 text-[11px] text-zinc-500 font-mono"><Info className="w-4 h-4 shrink-0 mt-0.5" style={{color:theme.colors.primary}}/><p>{b.note} Full index: {b.fullIndexTime}; incremental update: {b.incrementalUpdateTime}; storage: {b.storageSize}.</p></div>
    </div>
  </div></section>;
}
