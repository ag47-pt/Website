'use client';

import React from'react';
import{CONTINUITY_QUESTIONS}from'@/data/evopro';
import{FileText,BrainCircuit,Database,Route,ShieldCheck}from'lucide-react';

export function ContinuityFlow(){const memory=[
{icon:Database,title:'Host-owned memory',copy:'Quando o repositório já possui uma memória madura, EvoPro pode adotá-la read-only em vez de reconstruir ou sobrescrever conhecimento canônico.'},
{icon:BrainCircuit,title:'Cognitive runtime',copy:'Observações, inferências, contexto, riscos e estado operacional do protocolo vivem em .evolution/ sem depender de uma conversa específica.'},
{icon:Route,title:'Task-aware retrieval',copy:'A próxima sessão não precisa ler tudo. O Context Router recupera apenas o conhecimento relevante à intenção atual.'},
{icon:ShieldCheck,title:'Evidence-linked continuity',copy:'Memória orienta continuidade, mas afirmações materiais continuam ligadas a evidência primária e ao seu status epistemológico.'}
];return <section id="continuity" className="py-20 md:py-28 border-t border-white/5 relative bg-zinc-950/40"><div className="max-w-7xl mx-auto px-4 sm:px-6"><div className="text-center max-w-4xl mx-auto mb-14"><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4"><FileText className="w-3.5 h-3.5"/>MEMORY & CONTINUITY</div><h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">A continuidade pertence ao repositório.<br/><span className="text-zinc-500">Não a uma janela de chat.</span></h2><p className="text-zinc-400 text-sm sm:text-base leading-relaxed">CONTINUITY.md continua podendo ser um artefato útil, mas já não representa sozinho o cérebro do sistema. EvoPro trabalha com memória cognitiva composta, evidência, riscos, decisões, contratos e contexto recuperável.</p></div>
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">{memory.map(({icon:Icon,title,copy})=><article key={title} className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800"><Icon className="w-5 h-5 text-emerald-400 mb-4"/><h3 className="text-sm font-bold text-white mb-2">{title}</h3><p className="text-xs leading-relaxed text-zinc-500">{copy}</p></article>)}</div>
<div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8"><div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-5 text-center">Perguntas que a memória deve permitir responder</div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{CONTINUITY_QUESTIONS.map((item,idx)=><div key={item.q} className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800"><div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-[11px] mb-2"><span className="text-zinc-600">{String(idx+1).padStart(2,'0')}</span>{item.q}</div><p className="text-xs text-zinc-400 leading-relaxed">{item.a}</p></div>)}</div></div>
</div></section>}
