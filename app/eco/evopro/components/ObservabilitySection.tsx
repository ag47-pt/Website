'use client';

import React from'react';
import{Activity,Database,Info,ShieldCheck}from'lucide-react';

export function ObservabilitySection(){
  return <section id="observability" className="py-20 md:py-28 border-t border-white/5 relative"><div className="max-w-7xl mx-auto px-4 sm:px-6"><div className="text-center max-w-4xl mx-auto mb-14"><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4"><Activity className="w-3.5 h-3.5"/>EVIDENCE-BASED AUDITABILITY</div><h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">Observabilidade, histórico e evidência.</h2><p className="text-zinc-400 text-sm sm:text-base leading-relaxed">EvoPro preserva trilhas estruturadas para explicar o que foi observado, decidido, executado e validado. O histórico serve à reconstrução e à auditoria; não transforma automaticamente um evento persistido em verdade absoluta.</p></div>
  <div className="grid md:grid-cols-3 gap-4 mb-8"><div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800"><Database className="w-5 h-5 text-cyan-400 mb-4"/><h3 className="text-sm font-bold text-white mb-2">Event & semantic history</h3><p className="text-xs text-zinc-500 leading-relaxed">Eventos, decisões e learnings mantêm proveniência suficiente para reconstruir por que o sistema chegou ao estado atual.</p></div><div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800"><ShieldCheck className="w-5 h-5 text-emerald-400 mb-4"/><h3 className="text-sm font-bold text-white mb-2">Evidence-linked validation</h3><p className="text-xs text-zinc-500 leading-relaxed">Judge, baselines e critics devem apontar para evidências produzidas pelo host, não apenas para declarações do agente.</p></div><div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800"><Activity className="w-5 h-5 text-purple-400 mb-4"/><h3 className="text-sm font-bold text-white mb-2">Cross-audit</h3><p className="text-xs text-zinc-500 leading-relaxed">Memória, riscos, contratos e estado podem ser auditados entre si para revelar inconsistências e drift.</p></div></div>
  <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 font-mono"><div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-zinc-800"><div><span className="text-[10px] text-zinc-500 tracking-widest">ILLUSTRATIVE TRACE</span><h3 className="text-white font-bold mt-1">Como uma evidência pode ser apresentada</h3></div><span className="text-[10px] px-3 py-1 rounded-full border border-amber-500/20 text-amber-400 bg-amber-500/[.04]">EXAMPLE · NOT LIVE HOST DATA</span></div><pre className="p-4 rounded-2xl bg-black border border-zinc-800 text-[11px] text-zinc-400 whitespace-pre-wrap overflow-x-auto">{`event: CHANGE_VALIDATED
status: VALIDATED
evidence:
  - host test command: exit 0
  - baseline comparison: no regression
  - risk findings: reviewed
next_action: persist approved learning`}</pre><div className="mt-4 flex items-start gap-2 text-[11px] text-zinc-500"><Info className="w-4 h-4 shrink-0"/><p>Paths e formatos concretos podem variar por subsistema e versão. A LP demonstra o princípio de auditabilidade; o repositório matriz e seus schemas são a autoridade técnica.</p></div></div>
  </div></section>;
}
