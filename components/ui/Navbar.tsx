import React from 'react'

export function Navbar({ 
  progressRef, 
  onChangeEarth 
}: { 
  progressRef: React.RefObject<HTMLDivElement | null>,
  onChangeEarth: () => void
}) {
  const scrollToPercent = (e: React.MouseEvent, percent: number) => {
    e.preventDefault()
    if (typeof window !== 'undefined') {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({ top: scrollHeight * percent, behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-white/5 backdrop-blur-xl border-b border-white/20 pointer-events-auto">
       <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
         <div className="flex items-center gap-3 md:gap-5">
           <div 
             className="text-white font-black text-2xl md:text-3xl tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent cursor-pointer"
             onClick={(e) => scrollToPercent(e, 0)}
           >
             AG47
           </div>

           {/* Botão de Alterar Terra - Agora ao lado do logo */}
           <button 
             onClick={onChangeEarth}
             className="w-9 h-9 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
             aria-label="Mudar Visão do Planeta"
           >
             <div className="w-4 h-4 rounded-full border border-white/30 group-hover:border-white/60 transition-colors relative z-10">
               <div className="absolute inset-[1px] rounded-full border border-white/10 group-hover:border-white/20" />
             </div>
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
           </button>
         </div>

         {/* Desktop Links */}
         <div className="hidden md:flex items-center gap-8 text-white/80 font-bold text-xs tracking-[0.2em] uppercase">
            <a href="#" onClick={(e) => scrollToPercent(e, 0.25)} className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">Sites</a>
            <a href="#" onClick={(e) => scrollToPercent(e, 0.45)} className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">APPs</a>
            <a href="#" onClick={(e) => scrollToPercent(e, 0.65)} className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">Social</a>
            <a href="#" onClick={(e) => scrollToPercent(e, 0.85)} className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">Ads</a>
            
            {/* Botão Lançar com efeito Cometa (Refinado - Branco) */}
            <button 
              onClick={(e) => scrollToPercent(e, 1)} 
              className="relative group px-5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 text-white font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-500 hover:scale-110 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">Lançar</span>
              
              {/* Núcleo do Cometa (Branco) */}
              <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-8 bg-white animate-pulse opacity-10 blur-xl" />
              
              {/* Luz Pulsante Branca Suave em Volta */}
              <div className="absolute -inset-[2px] rounded-full bg-white/5 blur-sm animate-pulse" />
              
              {/* Glow Externo Branco Refinado */}
              <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-500" />
            </button>
         </div>

         {/* Mobile Buttons (Sem texto) */}
         <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={(e) => scrollToPercent(e, 0.25)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-90"
              aria-label="Sites"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </button>
            <button 
              onClick={(e) => scrollToPercent(e, 0.45)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-90"
              aria-label="APPs"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            </button>
            <button 
              onClick={(e) => scrollToPercent(e, 0.65)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-90"
              aria-label="Social Media"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            </button>
            <button 
              onClick={(e) => scrollToPercent(e, 0.85)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-90"
              aria-label="Tráfego Pago"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            </button>
            
            {/* Botão Lançar Mobile com efeito Cometa (Branco) */}
            <button 
              onClick={(e) => scrollToPercent(e, 1)}
              className="relative group w-10 h-10 rounded-full bg-white/10 backdrop-blur-lg border border-white/30 flex items-center justify-center text-white transition-all active:scale-90 overflow-hidden"
              aria-label="Lançar"
            >
               {/* Ícone */}
               <svg className="relative z-10" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path></svg>
               
               {/* Luz Pulsante Branca Suave */}
               <div className="absolute inset-0 bg-white/5 animate-pulse" />
               
               {/* Glow de Status Branco */}
               <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
            </button>
         </div>
       </div>
       <div 
         className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-transparent via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)] transition-all duration-100 ease-out" 
         ref={progressRef} 
         style={{ width: '0%' }}
       >
         <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_4px_rgba(236,72,153,1),0_0_30px_8px_rgba(168,85,247,0.8)]">
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
         </div>
       </div>
    </nav>
  )
}
