'use client'

import dynamic from 'next/dynamic'

// Dynamic import com ssr:false deve estar num Client Component
// Este wrapper existe para isolar o Three.js do Server Component (page.tsx)
const Basic3DScene = dynamic(
  () => import('@/components/Basic3DScene'),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-full relative overflow-hidden bg-black">
        {/* Réplica da plataforma como fundo — cria continuidade visual */}
        <img
          src="/og-image.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          style={{ filter: 'blur(3px) brightness(0.55)', transition: 'filter 0.5s ease' }}
        />

        {/* Overlay gradiente para suavizar bordas e escurecer */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

        {/* Spinner + label centrados */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
          {/* Anel externo pulsante */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-20 h-20 rounded-full border border-white/10 animate-ping" />
            <div className="w-14 h-14 rounded-full border-4 border-white/10 border-t-white animate-spin" />
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-white/50">
              Inicializando Motor 3D
            </p>
            {/* Barra de progresso indeterminada */}
            <div className="w-32 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-transparent via-white to-transparent rounded-full"
                style={{ animation: 'loadingBar 1.4s ease-in-out infinite' }}
              />
            </div>
          </div>
        </div>

        <style>{`
          @keyframes loadingBar {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(400%); }
          }
        `}</style>
      </div>
    )
  }
)

export { Basic3DScene }
