'use client';

import React,{useState} from 'react';
import {motion} from 'framer-motion';
import {BrainCircuit,Database,Route,Gauge,ArrowRight,Info} from 'lucide-react';
import {useTheme} from '@/context/ThemeContext';

const stages=[
  {n:1,label:'First contact',title:'Understand the host',copy:'Repository reconnaissance, canonical memory adoption, architecture, risks and current-state validation.',normal:62,evopro:92,icon:BrainCircuit},
  {n:2,label:'Next task',title:'Retrieve, don’t rebuild',copy:'The agent starts from persistent memory and routes only the context required by the new intent.',normal:62,evopro:42,icon:Database},
  {n:3,label:'Focused change',title:'Work inside the blast radius',copy:'Contracts, risks and source evidence narrow the investigation instead of reopening the whole repository.',normal:62,evopro:29,icon:Route},
  {n:4,label:'Continuation',title:'Reuse validated understanding',copy:'Validated knowledge survives the chat session, so continuity can compound instead of resetting.',normal:62,evopro:24,icon:Gauge},
];

export function CognitiveAmortization(){
  const{theme}=useTheme();
  const[index,setIndex]=useState(0);
  const stage=stages[index];
  return <section id="amortization" className="relative py-24 md:py-32 border-b border-white/5 bg-black">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="max-w-4xl mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase mb-4" style={{color:theme.colors.primary}}><Gauge className="w-4 h-4"/> Cognitive Amortization</div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-5">The first understanding can cost more.<br/><span className="text-zinc-500">The next decisions should cost less.</span></h2>
        <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-3xl">EvoPro is designed to move cognitive work forward instead of restarting it. The initial contact may inspect broadly. Once validated context becomes persistent memory, later tasks should retrieve, route and verify only what matters.</p>
      </div>

      <div className="grid lg:grid-cols-[340px_1fr] gap-6 lg:gap-8">
        <div className="space-y-2">
          {stages.map((s,i)=>{const Icon=s.icon;const active=i===index;return <button key={s.n} onClick={()=>setIndex(i)} className={`w-full text-left rounded-2xl border p-4 transition-all ${active?'bg-zinc-900 border-zinc-700':'bg-zinc-950/50 border-zinc-900 hover:border-zinc-800'}`}>
            <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl border border-white/10 bg-black flex items-center justify-center"><Icon className="w-4 h-4" style={{color:active?theme.colors.primary:'#71717a'}}/></div><div><div className="text-[10px] font-mono tracking-widest text-zinc-600">STEP {String(s.n).padStart(2,'0')} · {s.label.toUpperCase()}</div><div className={`text-sm font-bold mt-0.5 ${active?'text-white':'text-zinc-500'}`}>{s.title}</div></div></div>
          </button>})}
        </div>

        <motion.div key={stage.n} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="rounded-3xl border border-zinc-800 bg-zinc-950/70 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-zinc-800"><div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"><div><div className="text-[10px] font-mono tracking-widest text-zinc-600 mb-2">{stage.label.toUpperCase()}</div><h3 className="text-2xl font-black text-white">{stage.title}</h3></div><span className="self-start rounded-full border border-amber-500/20 bg-amber-500/[.05] px-3 py-1.5 text-[10px] font-mono font-bold tracking-widest text-amber-300">ILLUSTRATIVE · NOT BENCHMARK</span></div><p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-400 max-w-2xl">{stage.copy}</p></div>

          <div className="p-6 sm:p-8 space-y-7">
            <div><div className="flex justify-between text-xs font-mono mb-2"><span className="text-zinc-500">SESSION-ONLY AGENT</span><span className="text-zinc-600">REBUILDS CONTEXT</span></div><div className="h-3 rounded-full bg-zinc-900 overflow-hidden"><motion.div initial={{width:0}} animate={{width:`${stage.normal}%`}} transition={{duration:.45}} className="h-full rounded-full bg-zinc-700"/></div></div>
            <div><div className="flex justify-between text-xs font-mono mb-2"><span style={{color:theme.colors.primary}}>EVOPRO + PERSISTENT MEMORY</span><span className="text-zinc-500">{stage.n===1?'INITIAL INVESTMENT':'ROUTED CONTEXT'}</span></div><div className="h-3 rounded-full bg-zinc-900 overflow-hidden"><motion.div initial={{width:0}} animate={{width:`${stage.evopro}%`}} transition={{duration:.45}} className="h-full rounded-full" style={{backgroundColor:theme.colors.primary}}/></div></div>

            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl border border-zinc-800 bg-black/50 p-4"><div className="text-[10px] font-mono text-zinc-600 mb-1">01 · MEMORY</div><div className="text-sm font-bold text-zinc-300">Keep validated understanding</div></div>
              <div className="rounded-xl border border-zinc-800 bg-black/50 p-4"><div className="text-[10px] font-mono text-zinc-600 mb-1">02 · ROUTING</div><div className="text-sm font-bold text-zinc-300">Load only relevant context</div></div>
              <div className="rounded-xl border border-zinc-800 bg-black/50 p-4"><div className="text-[10px] font-mono text-zinc-600 mb-1">03 · VERIFY</div><div className="text-sm font-bold text-zinc-300">Recheck what could have changed</div></div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 grid md:grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-2xl border border-emerald-500/15 bg-emerald-500/[.03] p-5 sm:p-6"><div><div className="text-[10px] font-mono tracking-widest text-zinc-600 mb-1">DESIGN INTENT</div><div className="text-sm font-bold text-zinc-200">Spend cognition where uncertainty and blast radius are high.</div></div><ArrowRight className="hidden md:block w-5 h-5 text-zinc-700"/><div><div className="text-[10px] font-mono tracking-widest text-zinc-600 mb-1">EXPECTED EFFECT</div><div className="text-sm font-bold text-zinc-200">Reduce repeated discovery without reducing evidence quality.</div></div></div>

      <div className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-zinc-600"><Info className="w-4 h-4 shrink-0 mt-0.5"/><p>The bars explain the architecture, not measured performance. Real efficiency claims require repeated host measurements of time, tool calls, context read and result quality.</p></div>
    </div>
  </section>;
}
