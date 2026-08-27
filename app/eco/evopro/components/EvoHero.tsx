'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { EVOPRO_CONFIG } from '@/data/evopro';
import { ArrowRight, BrainCircuit, Check, Copy, GitFork, ShieldCheck, Sparkles, Terminal, Workflow } from 'lucide-react';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>;
}

export function EvoHero() {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const copyInstall = () => { navigator.clipboard.writeText(EVOPRO_CONFIG.installCommand); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const scrollTo = (id:string) => { const element=document.getElementById(id); if(element){ const y=element.getBoundingClientRect().top+window.pageYOffset-90; window.scrollTo({top:y,behavior:'smooth'}); } };
  const pillars=[
    {icon:BrainCircuit,title:'Cognitive Memory',copy:'Entende o host, preserva contexto e adota memória existente sem criar uma segunda verdade.',color:'text-cyan-400'},
    {icon:Workflow,title:'Agent-First',copy:'Você fornece intenção. O agente escolhe contexto, ferramentas e workflow necessário.',color:'text-purple-400'},
    {icon:ShieldCheck,title:'Governed Evolution',copy:'Contratos, riscos, validação adversarial e autoridade humana limitam a autonomia.',color:'text-emerald-400'},
    {icon:GitFork,title:'Harness-Agnostic',copy:'Codex, Claude Code, Antigravity e futuros harnesses são motores intercambiáveis.',color:'text-amber-400'},
  ];
  return (
    <section id="overview" className="relative pt-28 pb-20 md:pt-36 lg:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none"><div className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:40px_40px]" /><div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/10 blur-[150px] rounded-full" /></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6"><div className="flex flex-col items-center text-center max-w-5xl mx-auto">
        <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-zinc-900/90 text-zinc-300 border border-zinc-800"><span className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor:theme.colors.primary}}/>AG47.pt / ECO / EVOPRO</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"><Sparkles className="w-3 h-3"/>v{EVOPRO_CONFIG.version} · Cognitive Architecture V1</span>
        </motion.div>
        <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.1}} className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.06] mb-6">Software evolution starts with{' '}<span className="bg-clip-text text-transparent" style={{backgroundImage:`linear-gradient(135deg,#ffffff 25%,${theme.colors.primary} 100%)`}}>understanding.</span></motion.h1>
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.2}} className="text-lg sm:text-xl font-mono text-zinc-300 mb-6 px-4 py-2 rounded-xl bg-zinc-900/40 border border-white/5">Understand before changing. Prove before remembering. Measure before claiming improvement.</motion.p>
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.3}} className="text-base sm:text-lg text-zinc-400 max-w-4xl leading-relaxed mb-9">O <strong className="text-white">EvoPro</strong> é um <span className="text-zinc-200">protocolo operacional cognitivo, repository-native, para evolução governada de software</span>. Ele compreende o host, recupera o contexto mínimo relevante, governa agentes e ferramentas, preserva memória e só então transforma intenção em evolução mensurável.</motion.p>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.35}} className="mb-10 px-5 py-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[.06] text-sm sm:text-base text-zinc-300"><span className="font-semibold text-white">Você fornece a intenção.</span> <span style={{color:theme.colors.primary}} className="font-semibold">O EvoPro fornece contexto, workflow e governança.</span></motion.div>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.4}} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
          <button onClick={()=>scrollTo('cognitive')} className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-black hover:scale-105 transition-all cursor-pointer" style={{backgroundColor:theme.colors.primary}}><BrainCircuit className="w-4 h-4"/><span>Explorar Cognitive Layer</span><ArrowRight className="w-4 h-4"/></button>
          <a href={EVOPRO_CONFIG.gitHubUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-mono font-semibold text-xs uppercase tracking-wider bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700/80 transition-all hover:scale-105"><GithubIcon/><span>Ver no GitHub</span></a>
          <button onClick={()=>scrollTo('quickstart')} className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-mono text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">Como usar</button>
        </motion.div>
        <motion.div initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{delay:.5}} className="w-full max-w-2xl rounded-2xl bg-zinc-950/90 border border-zinc-800 shadow-2xl p-4 text-left font-mono">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500/80"/><div className="w-3 h-3 rounded-full bg-amber-500/80"/><div className="w-3 h-3 rounded-full bg-emerald-500/80"/><span className="text-[11px] text-zinc-500 ml-2">install once · interact naturally</span></div><button onClick={copyInstall} className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] border border-zinc-700/60 cursor-pointer">{copied?<Check className="w-3 h-3 text-emerald-400"/>:<Copy className="w-3 h-3"/>}{copied?'Copiado':'Copiar'}</button></div>
          <div className="text-xs sm:text-sm text-zinc-300 break-all"><span className="text-emerald-400 select-none">$ </span>{EVOPRO_CONFIG.installCommand}</div>
          <div className="mt-4 pt-3 border-t border-zinc-800/60 text-xs text-zinc-400"><span className="text-purple-400">you › </span>“Analise este repositório e determine a próxima prioridade.”<br/><span className="text-emerald-400">EvoPro › </span><span className="text-zinc-500">assess → memory → context → governance → next action</span></div>
        </motion.div>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.6}} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-12 w-full text-left">{pillars.map(({icon:Icon,title,copy,color})=><div key={title} className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60"><div className="flex items-center gap-2 text-zinc-100 text-xs font-mono font-semibold mb-2"><Icon className={`w-4 h-4 ${color}`}/><span>{title}</span></div><p className="text-[12px] leading-relaxed text-zinc-400">{copy}</p></div>)}</motion.div>
      </div></div>
    </section>
  );
}
