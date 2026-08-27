'use client';

import React from'react';
import{motion}from'framer-motion';
import{USE_CASES}from'@/data/evopro';
import{Layers,Sparkles,GitCompare,FlaskConical,Cpu,ShieldCheck}from'lucide-react';

export function UseCasesSection(){
  const getIcon=(title:string)=>{if(title.includes('Repositórios'))return Layers;if(title.includes('Troca'))return Sparkles;if(title.includes('arquiteturais'))return GitCompare;if(title.includes('Evolução'))return FlaskConical;if(title.includes('Auditoria'))return ShieldCheck;return Cpu};
  return <section id="use-cases" className="py-20 md:py-28 border-t border-white/5 relative bg-zinc-950/40"><div className="max-w-7xl mx-auto px-4 sm:px-6"><div className="text-center max-w-3xl mx-auto mb-14"><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4"><Layers className="w-3.5 h-3.5"/>APPLICATION PATTERNS</div><h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">Onde o EvoPro pode ser aplicado</h2><p className="text-zinc-400 text-sm sm:text-base leading-relaxed">Cenários de aplicação, não garantias automáticas de compatibilidade. A estratégia real depende do host, das evidências encontradas e das capacidades disponíveis no harness.</p></div>
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{USE_CASES.map((uc,idx)=>{const Icon=getIcon(uc.title);return <motion.article key={uc.title} initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:idx*.04}} className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800"><div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 mb-5"><Icon className="w-5 h-5"/></div><h3 className="text-base font-bold text-white mb-2">{uc.title}</h3><p className="text-xs text-zinc-400 leading-relaxed">{uc.desc}</p><div className="pt-4 mt-6 border-t border-zinc-800 text-[10px] font-mono text-zinc-600">REQUIRES HOST ASSESSMENT · CAPABILITY-AWARE</div></motion.article>})}</div>
  </div></section>;
}
