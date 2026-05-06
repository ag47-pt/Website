import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Typewriter } from './Typewriter'
import { useTheme } from '@/context/ThemeContext'

export function ScrollingCard({ 
  innerRef, 
  title, 
  subtitle, 
  desc, 
  img, 
  badge = "Popular",
  tag = "Desenvolvimento Elite",
  slug,
  nextScrollTarget,
  prevScrollTarget
}: { 
  innerRef: React.RefObject<HTMLDivElement | null>,
  title: React.ReactNode,
  subtitle: string,
  desc: React.ReactNode,
  img: string,
  badge?: string,
  tag?: string,
  slug?: string,
  nextScrollTarget?: number,
  prevScrollTarget?: number
}) {
  const { theme } = useTheme();
  return (
    <div 
      ref={innerRef}
      style={{ animation: 'cardPulse 4s infinite alternate ease-in-out' }}
      className="absolute top-1/2 left-1/2 w-[95%] max-w-[850px] min-h-[400px] bg-white/5 backdrop-blur-xl border-2 rounded-3xl overflow-hidden shadow-2xl z-50 flex flex-col md:flex-row opacity-0 pointer-events-none"
    >
      <style jsx>{`
        @keyframes cardPulse {
          0% { border-color: ${theme.colors.secondary}80; box-shadow: 0 0 30px ${theme.colors.secondary}33, inset 0 0 15px ${theme.colors.secondary}1A; }
          50% { border-color: ${theme.colors.primary}CC; box-shadow: 0 0 60px ${theme.colors.primary}66, inset 0 0 25px ${theme.colors.primary}33; }
          100% { border-color: ${theme.colors.secondary}80; box-shadow: 0 0 30px ${theme.colors.secondary}33, inset 0 0 15px ${theme.colors.secondary}1A; }
        }
      `}</style>
      <div className="relative w-full md:w-[35%] h-48 md:h-auto overflow-hidden">
        <Image 
          src={img} 
          alt={subtitle} 
          fill
          sizes="(max-width: 768px) 100vw, 35vw"
          className="object-cover scale-110" 
          priority={badge === "Destaque"}
        />
        {badge && (
          <div 
            className="absolute top-6 left-6 text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg"
            style={{ 
              background: `linear-gradient(to right, ${theme.colors.secondary}, ${theme.colors.primary})`,
              boxShadow: `0 0 10px ${theme.colors.primary}33`
            }}
          >
            {badge}
          </div>
        )}
      </div>
      <div className="p-8 md:p-10 md:w-[65%] text-white flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-[1px]" style={{ backgroundColor: theme.colors.secondary }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: theme.colors.primary }}>{tag}</span>
        </div>
        <h3 className="text-3xl font-black mb-3 leading-tight tracking-tighter">
          <Typewriter text={subtitle} duration={2000} watchRef={innerRef} />
        </h3>
        <div className="text-sm opacity-95 mb-6 leading-relaxed font-light bg-black/60 p-6 md:p-8 backdrop-blur-xl border-y border-white/5 -mx-8 md:-mx-10 shadow-2xl">{desc}</div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (typeof window !== 'undefined' && nextScrollTarget !== undefined) {
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                window.scrollTo({ top: scrollHeight * nextScrollTarget, behavior: 'smooth' });
              }
            }}
            className="self-stretch px-2.5 bg-white/5 border border-white/20 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all shrink-0 group" 
            aria-label="Próximo"
          >
            <div className="w-5 h-8 border-2 border-white/20 group-hover:border-white/40 transition-colors rounded-full flex justify-center p-1">
              <div className="w-1 h-1.5 bg-white/40 group-hover:bg-white transition-colors rounded-full animate-bounce" />
            </div>
            <div className="animate-bounce text-lg text-white/40 group-hover:text-white transition-colors">↓</div>
          </button>
          
          {slug ? (
            <Link
              href={`/servicos/${slug}`}
              style={{ animation: 'cardPulse 4s infinite alternate ease-in-out' }}
              className="flex-1 py-5 bg-white/10 text-white border-2 font-black rounded-2xl hover:bg-white/20 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 uppercase tracking-widest text-[10px] group flex items-center justify-center gap-2 backdrop-blur-2xl border-white/10 pointer-events-auto"
            >
              Saiba mais<span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          ) : (
            <button style={{ animation: 'cardPulse 4s infinite alternate ease-in-out' }} className="flex-1 py-5 bg-white/10 text-white border-2 font-black rounded-2xl hover:bg-white/20 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 uppercase tracking-widest text-[10px] group flex items-center justify-center gap-2 backdrop-blur-2xl border-white/10">Saiba mais<span className="group-hover:translate-x-2 transition-transform duration-300">→</span></button>
          )}
          
          {prevScrollTarget !== undefined && (
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                  window.scrollTo({ top: scrollHeight * prevScrollTarget, behavior: 'smooth' });
                }
              }}
              className="self-stretch px-2.5 bg-white/5 border border-white/20 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all shrink-0 group" 
              aria-label="Anterior"
            >
              <div className="animate-bounce text-lg text-white/40 group-hover:text-white transition-colors">↑</div>
              <div className="w-5 h-8 border-2 border-white/20 group-hover:border-white/40 transition-colors rounded-full flex flex-col items-center justify-start p-1">
                <div className="w-1 h-1.5 bg-white/40 group-hover:bg-white transition-colors rounded-full animate-bounce mt-auto" />
              </div>
            </button>
          )}

          <div className="hidden xl:flex flex-col text-[8px] uppercase tracking-tighter opacity-20 leading-none shrink-0 ml-1"><span>Suporte</span><span>Ativo</span></div>
        </div>
      </div>
    </div>
  )
}
