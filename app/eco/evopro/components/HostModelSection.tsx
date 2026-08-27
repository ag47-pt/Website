'use client';

import React,{useState}from'react';
import{FolderTree,Copy,Check,Folder,FileJson,Database,BrainCircuit,ShieldCheck}from'lucide-react';

export function HostModelSection(){const[copied,setCopied]=useState(false);const sample=`{
  "host_contract": {
    "commands": {
      "test": "<host test command>",
      "build": "<host build command>"
    },
    "protected_paths": [".git/**"],
    "limits": {
      "max_revision_cycles": 3,
      "max_sprints": 25
    }
  }
}`;const copy=()=>{navigator.clipboard.writeText(sample);setCopied(true);setTimeout(()=>setCopied(false),1500)};
return <section id="host-model" className="py-20 md:py-28 border-t border-white/5 relative bg-zinc-950/40"><div className="max-w-7xl mx-auto px-4 sm:px-6">
<div className="text-center max-w-4xl mx-auto mb-14"><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4"><FolderTree className="w-3.5 h-3.5"/>THE REPOSITORY IS THE HOST</div><h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">O EvoPro entra no organismo<br/><span className="text-zinc-500">sem apagar a memória que já existe.</span></h2><p className="text-zinc-400 text-sm sm:text-base leading-relaxed">Hosts novos podem construir memória cognitiva. Hosts maduros podem possuir documentação canônica própria. EvoPro distingue essas duas camadas em vez de fundi-las silenciosamente.</p></div>
<div className="grid lg:grid-cols-[1fr_1fr] gap-6"><div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 font-mono text-xs"><div className="text-[10px] tracking-widest text-zinc-600 mb-5">HOST LAYOUT · CONCEPTUAL</div><div className="space-y-2 text-zinc-400"><div className="flex items-center gap-2 text-white font-bold"><Folder className="w-4 h-4 text-amber-400"/>your-project/</div><div className="pl-5 flex items-center gap-2"><Folder className="w-3.5 h-3.5"/>src/</div><div className="pl-5 flex items-center gap-2"><Folder className="w-3.5 h-3.5"/>tests/</div><div className="pl-5 flex items-center gap-2 text-cyan-300"><FileJson className="w-3.5 h-3.5"/>evolution.config.json <span className="text-zinc-600">optional host contract</span></div><div className="pl-5 pt-2 flex items-center gap-2 text-purple-300 font-bold"><Database className="w-4 h-4"/>evolution/ <span className="text-zinc-600 font-normal">optional host-owned canonical memory</span></div><div className="pl-9 text-zinc-500">domains · contracts · risks · decisions · architecture...</div><div className="pl-5 pt-2 flex items-center gap-2 text-emerald-400 font-bold"><BrainCircuit className="w-4 h-4"/>.evolution/ <span className="text-zinc-600 font-normal">EvoPro runtime / governed state</span></div><div className="pl-9 text-zinc-500">runtime · second-brain · goals · cycles · evidence...</div></div><div className="mt-6 pt-4 border-t border-zinc-800 text-[11px] text-zinc-500"><strong className="text-zinc-300">Ownership:</strong> uma memória canônica preexistente é adotada read-only durante onboarding; `.evolution/` não deve virar uma segunda verdade concorrente.</div></div>
<div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8"><div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800"><div><div className="text-[10px] font-mono text-zinc-600">HOST CONTRACT · EXAMPLE</div><div className="text-sm font-bold text-white mt-1">evolution.config.json</div></div><button onClick={copy} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 cursor-pointer">{copied?<Check className="w-3.5 h-3.5 text-emerald-400"/>:<Copy className="w-3.5 h-3.5"/>}{copied?'Copiado':'Copiar'}</button></div><pre className="p-4 rounded-2xl bg-black border border-zinc-800 text-xs text-zinc-300 overflow-x-auto">{sample}</pre><div className="mt-5 flex items-start gap-2 text-xs text-zinc-500"><ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0"/><p>Comandos podem ser declarados ou inferidos de evidência do host. Inferência continua sendo inferência e deve preservar a fonte que a sustentou.</p></div></div></div>
</div></section>}
