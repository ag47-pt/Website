'use client';

import React,{useState}from'react';
import{useEvoProPublic}from'../EvoProPublicContext';
import{Terminal,Copy,Check,Info}from'lucide-react';

const DEMOS=[
  {id:'assess',label:'Assess',command:'evolution second-brain assess',output:`# AG47.pt 🧠 EvoPro • Repository Assessment\n\n**Health:** BUILDING\n**Phase:** CONTEXT_ROUTER\n\n## 🧭 Próxima ação recomendada\nConstruir contexto limitado para a intenção atual.`},
  {id:'adopt',label:'Adopt Memory',command:'evolution second-brain adopt-memory --memory evolution',output:`{\n  "status": "ADOPTABLE",\n  "ownership": "HOST_CANONICAL_READ_ONLY",\n  "mutation_policy": "HOST_MEMORY_UNCHANGED"\n}`},
  {id:'route',label:'Route',command:'evolution second-brain route "melhorar permissões de staff"',output:`# AG47.pt 🧭 EvoPro • Contexto preparado\n\nDomínios, contratos, riscos, decisões e evidências relevantes são recuperados antes da mutação.`},
  {id:'pilot',label:'Pilot',command:'evolution second-brain pilot-compare --gold evolution',output:`{\n  "status": "COMPARED",\n  "note": "coverage is evidence, not semantic equivalence"\n}`}
];

export function TerminalInteractive(){
  const{state}=useEvoProPublic();const[active,setActive]=useState(DEMOS[0].id);const[copied,setCopied]=useState(false);const demo=DEMOS.find(x=>x.id===active)||DEMOS[0];
  const copy=()=>{navigator.clipboard.writeText(demo.command);setCopied(true);setTimeout(()=>setCopied(false),1500)};
  return <section id="terminal-demo" className="py-20 md:py-28 border-t border-white/5 relative bg-zinc-950/60"><div className="max-w-7xl mx-auto px-4 sm:px-6">
    <div className="text-center max-w-3xl mx-auto mb-12"><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800 mb-4"><Terminal className="w-3.5 h-3.5"/>ADVANCED TERMINAL DEMO</div><h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">Veja o protocolo por baixo do Agent.</h2><p className="text-zinc-400 text-sm sm:text-base leading-relaxed">Esta seção é uma <strong className="text-zinc-200">demonstração ilustrativa</strong> da interface de operador. Não é um terminal conectado ao seu repositório e não substitui execução real do CLI.</p></div>
    <div className="max-w-4xl mx-auto rounded-3xl bg-black border border-zinc-800 overflow-hidden font-mono text-xs shadow-2xl"><div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 flex flex-wrap justify-between gap-3"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-500/80"/><span className="w-3 h-3 rounded-full bg-amber-500/80"/><span className="w-3 h-3 rounded-full bg-emerald-500/80"/><span className="ml-2 text-zinc-500">evopro v{state.version} · simulated operator surface</span></div><div className="flex gap-1">{DEMOS.map(x=><button key={x.id} onClick={()=>setActive(x.id)} className={`px-3 py-1 rounded-lg cursor-pointer ${active===x.id?'bg-zinc-800 text-emerald-400 font-bold':'text-zinc-500 hover:text-zinc-300'}`}>{x.label}</button>)}</div></div>
      <div className="p-5"><div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-zinc-950 border border-zinc-800"><code className="text-emerald-300 break-all">$ {demo.command}</code><button onClick={copy} className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">{copied?<Check className="w-3.5 h-3.5 text-emerald-400"/>:<Copy className="w-3.5 h-3.5"/>}</button></div><pre className="mt-4 min-h-48 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-300 whitespace-pre-wrap overflow-x-auto">{demo.output}</pre><div className="mt-4 flex items-start gap-2 text-[11px] text-zinc-500"><Info className="w-4 h-4 shrink-0"/><p>Outputs acima mostram formato e intenção operacional. Estado, paths, riscos e resultados reais dependem do host e devem ser obtidos pela execução real do EvoPro.</p></div></div>
    </div>
  </div></section>;
}
