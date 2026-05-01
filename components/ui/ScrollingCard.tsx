import React from 'react'

export function ScrollingCard({ 
  innerRef, 
  title, 
  subtitle, 
  desc, 
  img, 
  setup, 
  monthly, 
  badge = "Popular",
  tag = "Desenvolvimento Elite"
}: { 
  innerRef: React.RefObject<HTMLDivElement | null>,
  title: React.ReactNode,
  subtitle: string,
  desc: React.ReactNode,
  img: string,
  setup: string,
  monthly: string,
  badge?: string,
  tag?: string
}) {
  return (
    <div 
      ref={innerRef}
      style={{ animation: 'cardPulse 4s infinite alternate ease-in-out' }}
      className="absolute top-1/2 left-1/2 w-[95%] max-w-[850px] min-h-[400px] bg-white/5 backdrop-blur-xl border-2 rounded-[3.5rem] overflow-hidden shadow-2xl z-50 flex flex-col md:flex-row opacity-0 pointer-events-none"
    >
      <style>{`
        @keyframes cardPulse {
          0% { border-color: rgba(59, 130, 246, 0.5); box-shadow: 0 0 30px rgba(59, 130, 246, 0.2), inset 0 0 15px rgba(59, 130, 246, 0.1); }
          50% { border-color: rgba(168, 85, 247, 0.8); box-shadow: 0 0 60px rgba(168, 85, 247, 0.4), inset 0 0 25px rgba(168, 85, 247, 0.2); }
          100% { border-color: rgba(236, 72, 153, 0.5); box-shadow: 0 0 30px rgba(236, 72, 153, 0.2), inset 0 0 15px rgba(236, 72, 153, 0.1); }
        }
      `}</style>
      <div className="relative w-full md:w-[35%] h-48 md:h-auto overflow-hidden">
        <img src={img} alt={subtitle} className="w-full h-full object-cover scale-110" />
        {badge && <div className="absolute top-6 left-6 bg-gradient-to-r from-blue-500 to-purple-600 text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">{badge}</div>}
      </div>
      <div className="p-10 md:p-14 md:w-[65%] text-white flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4"><div className="w-12 h-[1px] bg-blue-500" /><span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400">{tag}</span></div>
        <h3 className="text-4xl font-black mb-4 leading-tight tracking-tighter">{title}</h3>
        <div className="text-sm opacity-90 mb-10 leading-relaxed font-light max-w-lg bg-black/30 p-5 rounded-2xl backdrop-blur-md">{desc}</div>
        <div className="flex gap-6 mb-10">
          <div className="flex-1 bg-white/5 p-6 rounded-3xl border border-white/5 group hover:border-blue-500/30 transition-colors"><span className="block text-[10px] uppercase tracking-widest opacity-40 mb-2">Taxa de Setup</span><span className="text-3xl font-black text-white">{setup}</span></div>
          <div className="flex-1 bg-blue-500/10 p-6 rounded-3xl border border-blue-500/10 group hover:border-blue-500/30 transition-colors"><span className="block text-[10px] uppercase tracking-widest opacity-40 mb-2">Hospedagem</span><span className="text-3xl font-black text-blue-400">{monthly}<span className="text-sm opacity-50 font-light ml-1">/mês</span></span></div>
        </div>
        <div className="flex items-center gap-4">
          <button style={{ animation: 'cardPulse 4s infinite alternate ease-in-out' }} className="flex-1 py-5 bg-white/10 text-white border-2 font-black rounded-2xl hover:bg-white/20 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 uppercase tracking-widest text-[10px] group flex items-center justify-center gap-2 backdrop-blur-2xl border-white/10">Saiba mais<span className="group-hover:translate-x-2 transition-transform duration-300">→</span></button>
          <div className="hidden md:flex flex-col text-[9px] uppercase tracking-tighter opacity-30 leading-none"><span>Suporte</span><span>24/7 Ativo</span></div>
        </div>
      </div>
    </div>
  )
}
