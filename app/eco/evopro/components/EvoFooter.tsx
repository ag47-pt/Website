'use client';

import React,{useEffect,useState}from'react';
import Link from'next/link';
import{useTheme}from'@/context/ThemeContext';
import{useEvoProPublic}from'../EvoProPublicContext';
import{EVOPRO_CONFIG}from'@/data/evopro';
import{ArrowUp,Volume2,VolumeX}from'lucide-react';

export function EvoFooter(){
  const{theme}=useTheme();const publicState=useEvoProPublic();const version=publicState?.manifest.version||EVOPRO_CONFIG.version;const maturity=publicState?.manifest.maturity||'unknown';const sourceKind=publicState?.sourceKind||'main';const sourceRef=publicState?.sourceRef||'local-fallback';const[muted,setMuted]=useState(false);
  useEffect(()=>setMuted(localStorage.getItem('evopro_sound_muted')==='true'),[]);
  const toggle=()=>{const n=!muted;setMuted(n);localStorage.setItem('evopro_sound_muted',String(n))};
  return <footer className="border-t border-white/10 bg-black pt-12 pb-16 relative z-10 text-zinc-400 font-mono text-xs"><div className="max-w-7xl mx-auto px-4 sm:px-6"><div className="grid md:grid-cols-4 gap-8 mb-12"><div className="md:col-span-2 space-y-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-xs" style={{backgroundColor:theme.colors.primary}}>AG</div><span className="font-bold text-white text-sm tracking-wider">EVOPRO — EVOLUTION PROTOCOL</span></div><p className="text-zinc-400 text-xs font-sans max-w-lg leading-relaxed">Protocolo operacional cognitivo, repository-native, para evolução governada de software. Entende o host, preserva memória, roteia contexto, governa agentes e só então conduz evolução mensurável.</p><div className="text-[11px] text-zinc-500">MIT License • {EVOPRO_CONFIG.copyright}</div></div>
    <div className="space-y-2"><span className="text-white font-bold text-[11px] uppercase tracking-wider block mb-3">Arquitetura</span><div><a href="#cognitive" className="hover:text-white">Cognitive Layer</a></div><div><a href="#ide-chat" className="hover:text-white">EvoPro Agent</a></div><div><a href="#lifecycle" className="hover:text-white">Evolution Engine</a></div><div><a href="#graph" className="hover:text-white">Graph Intelligence</a></div><div><a href="#status" className="hover:text-white">Maturidade</a></div></div>
    <div className="space-y-2"><span className="text-white font-bold text-[11px] uppercase tracking-wider block mb-3">AG47.pt</span><div><Link href="/" className="hover:text-white">Agência 47</Link></div><div><Link href="/labs" className="hover:text-white">Labs</Link></div><div><a href={EVOPRO_CONFIG.gitHubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub EvoPro</a></div><div><a href={EVOPRO_CONFIG.documentationUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">Documentação</a></div></div></div>
    <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-500"><div className="flex flex-wrap items-center gap-4"><span>EVOPRO_VERSION: v{version}</span><span>MATURITY: {maturity.toUpperCase()}</span><span>SOURCE: {sourceKind}/{sourceRef}</span></div><div className="flex items-center gap-4"><button onClick={toggle} className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 cursor-pointer">{muted?<VolumeX className="w-3 h-3 text-rose-400"/>:<Volume2 className="w-3 h-3 text-emerald-400"/>}<span>{muted?'SOUND: OFF':'SOUND: ON'}</span></button><button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} className="flex items-center gap-1.5 text-zinc-400 hover:text-white cursor-pointer"><span>Voltar ao topo</span><ArrowUp className="w-3 h-3"/></button></div></div>
  </div></footer>;
}
