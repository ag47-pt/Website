import React from 'react'

export function Navbar({ progressRef }: { progressRef: React.RefObject<HTMLDivElement | null> }) {
  const scrollToPercent = (e: React.MouseEvent, percent: number) => {
    e.preventDefault()
    if (typeof window !== 'undefined') {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({ top: scrollHeight * percent, behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-white/5 backdrop-blur-xl border-b border-white/20 pointer-events-auto">
       <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
         <div 
           className="text-white font-black text-3xl tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent cursor-pointer"
           onClick={(e) => scrollToPercent(e, 0)}
         >
           AG47
         </div>
         <div className="hidden md:flex items-center gap-8 text-white/80 font-bold text-xs tracking-[0.2em] uppercase">
            <a href="#" onClick={(e) => scrollToPercent(e, 0.315)} className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">Sites</a>
            <a href="#" onClick={(e) => scrollToPercent(e, 0.645)} className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">APPs</a>
            <button onClick={(e) => scrollToPercent(e, 1)} className="bg-white text-black px-6 py-2 rounded-full hover:scale-105 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]">Lançar</button>
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
