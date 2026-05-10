'use client'

import dynamic from 'next/dynamic'

const NotFoundScene = dynamic(
  () => import('@/components/NotFoundScene'),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-full relative overflow-hidden bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-20 h-20 rounded-full border border-white/10 animate-ping" />
            <div className="w-14 h-14 rounded-full border-4 border-white/10 border-t-white animate-spin" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-white/50 animate-pulse">
            Rastreando Coordenadas
          </p>
        </div>
      </div>
    )
  }
)

export { NotFoundScene }
