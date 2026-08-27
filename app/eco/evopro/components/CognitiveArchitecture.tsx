'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { BrainCircuit, Database, Eye, Route, ShieldCheck, TriangleAlert, Wrench, ArrowDown } from 'lucide-react';

const layers=[
  {icon:Eye,title:'Perception',tag:'OBSERVE',copy:'Inspeciona o host e coleta evidência antes de formular conclusões.'},
  {icon:Database,title:'Cognitive Memory',tag:'REMEMBER',copy:'Constrói ou adota memória persistente sem sobrescrever a verdade canônica do host.'},
  {icon:Route,title:'Context Router',tag:'ATTEND',copy:'Seleciona domínios, contratos, riscos, decisões e evidências relevantes para a intenção atual.'},
  {icon:ShieldCheck,title:'Agent Governance',tag:'GOVERN',copy:'Define boundaries, autoridade, epistemologia e quando uma decisão precisa voltar ao humano.'},
  {icon:TriangleAlert,title:'Risk Intelligence',tag:'WARN',copy:'Mantém fragilidades, dívidas e sinais de segurança visíveis em vez de deixá-los morrer no chat.'},
  {icon:Wrench,title:'Tool Orchestration',tag:'ACT',copy:'O agente escolhe terminal, Git, testes e comandos compatíveis quando o harness possui capacidade segura.'},
];

export function CognitiveArchitecture(){
  const {theme}=useTheme();
  return <section id="cognitive" className="relative py-24 md:py-32 border-y border-white/5 bg-zinc-950/35">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="max-w-4xl mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase mb-4" style={{color:theme.colors.primary}}><BrainCircuit className="w-4 h-4"/> Cognitive Architecture</div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-5">Antes de evoluir o sistema,<br/><span className="text-zinc-500">o EvoPro precisa entendê-lo.</span></h2>
        <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-3xl">A Cognitive Layer transforma um repositório em um ambiente legível por agentes: evidência vira modelo, modelo validado vira memória, intenção vira contexto e contexto é limitado por governança.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-8 items-stretch">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {layers.map(({icon:Icon,title,tag,copy},i)=><motion.article key={title} initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.25}} transition={{delay:i*.05}} className="group p-5 rounded-2xl bg-black/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-5"><div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-zinc-900"><Icon className="w-5 h-5" style={{color:theme.colors.primary}}/></div><span className="text-[10px] font-mono tracking-widest text-zinc-600">{tag}</span></div>
            <h3 className="text-white font-bold mb-2">{title}</h3><p className="text-sm leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors">{copy}</p>
          </motion.article>)}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-black/70 p-5 font-mono flex flex-col justify-between">
          <div><div className="text-[10px] tracking-widest text-zinc-600 mb-5">EPISTEMIC PIPELINE</div>{['OBSERVED','INFERRED','VALIDATED','CURATED','PERSISTENT MEMORY'].map((state,i)=><React.Fragment key={state}><div className={`rounded-lg border px-3 py-2.5 text-xs ${i>=2?'border-emerald-500/20 bg-emerald-500/[.04] text-emerald-300':'border-zinc-800 bg-zinc-900/50 text-zinc-400'}`}>{state}</div>{i<4&&<div className="flex justify-center py-1"><ArrowDown className="w-3 h-3 text-zinc-700"/></div>}</React.Fragment>)}</div>
          <div className="mt-6 pt-5 border-t border-zinc-800 text-[11px] leading-relaxed text-zinc-500"><span className="text-zinc-300">Regra:</span> aparência de verdade não é evidência. O agente não promove uma inferência apenas porque ela parece plausível.</div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-emerald-500/15 bg-emerald-500/[.035] px-5 py-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-6"><span className="font-mono text-xs font-bold" style={{color:theme.colors.primary}}>COGNITIVE CONTRACT</span><p className="text-sm text-zinc-400"><strong className="text-zinc-200">Contexto diz ao agente o que ele precisa saber.</strong> Governança define o que ele pode fazer com esse conhecimento.</p></div>
    </div>
  </section>;
}
