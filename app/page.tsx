'use client'

import dynamic from 'next/dynamic'

// Import dinâmico para evitar SSR (Three.js não funciona no servidor)
const Basic3DScene = dynamic(
  () => import('@/components/Basic3DScene'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-xs uppercase tracking-widest opacity-50">Inicializando Motor 3D...</p>
        </div>
      </div>
    )
  }
)

export default function Home() {
  return (
    <main className="bg-black">
      {/* Toda a experiência (3D + Conteúdo) agora está unificada no Basic3DScene */}
      <Basic3DScene />
    </main>
  )
}