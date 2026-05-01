'use client'

import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useRef, Suspense } from 'react'

// Hooks
import { usePageScroll } from '../hooks/usePageScroll'

// Data
import { servicesData } from '../data/content'

// UI Components
import { Navbar } from './ui/Navbar'
import { ScrollingCard } from './ui/ScrollingCard'

// 3D Components
import { Earth } from './3d/Earth'
import { ServiceHotspots } from './3d/ServiceHotspots'
import { ScrollManager } from './3d/ScrollManager'

export default function Basic3DScene() {
  const scrollOffsetRaw = usePageScroll()
  const lerpedScroll = useRef(0)
  
  // Refs para controle de animação da UI
  const progressRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const cardRef1 = useRef<HTMLDivElement>(null)
  const cardRef2 = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative bg-black min-h-screen overflow-x-hidden">
       {/* Background de Fundo Estático */}
       <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <img src="/imgs/Gemini_compressed.webp" alt="Background" className="w-full h-full object-cover scale-105 opacity-40 blur-[4px] grayscale-[0.3]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
       </div>

       {/* Camada 3D */}
       <div className="fixed inset-0 w-full h-full pointer-events-none z-10">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
             <ambientLight intensity={0.5} />
             <pointLight position={[10, 10, 10]} intensity={1.5} />
             <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
             <Suspense fallback={null}>
                <ScrollManager 
                  scrollOffsetRaw={scrollOffsetRaw} 
                  lerpedScroll={lerpedScroll} 
                  progressRef={progressRef} 
                  introRef={introRef}
                  cardRef1={cardRef1}
                  cardRef2={cardRef2}
                  indicatorRef={indicatorRef}
                />
                <Earth lerpedScroll={lerpedScroll} />
                <ServiceHotspots lerpedScroll={lerpedScroll} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
             </Suspense>
          </Canvas>
       </div>

       {/* Camada de UI Interativa */}
       <div className="fixed inset-0 pointer-events-none z-30">
          <Navbar progressRef={progressRef} />
          
          {/* Card 1: Websites */}
          <ScrollingCard 
            innerRef={cardRef1}
            {...servicesData.websites}
          />

          {/* Card 2: SaaS */}
          <ScrollingCard 
            innerRef={cardRef2}
            {...servicesData.saas}
          />

          <div ref={introRef} className="h-full flex items-center justify-center">
             <div className="text-center text-white px-4">
                <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent uppercase">Agência 47</h1>
                <p className="text-sm md:text-xl font-light uppercase tracking-[0.5em] opacity-50">Experiência Imersiva</p>
             </div>
          </div>

          <div ref={indicatorRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
            <span className="text-[9px] uppercase tracking-[0.4em] font-bold mb-1">Iniciar viagem astral</span>
            <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center p-1">
              <div className="w-1 h-1.5 bg-white/40 rounded-full animate-bounce" />
            </div>
            <div className="animate-bounce mt-1 text-lg">↓</div>
          </div>
       </div>

       {/* Corpo de rolagem para disparar o scroll (Invisível) */}
       <div className="relative z-20">
          <div className="h-[600vh]" />
          
          {/* Seção Final após o scroll 3D */}
          <div className="min-h-screen flex items-center justify-center p-8">
             <div className="max-w-4xl w-full bg-black/40 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] text-white shadow-2xl">
                <h2 className="text-5xl font-black mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Pronto para o Próximo Nível?</h2>
                <div className="grid md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <p className="text-lg opacity-80 leading-relaxed font-light">Combinamos a potência do **Three.js** com a leveza do **WebP** para criar interfaces que não apenas impressionam, mas também performam.</p>
                      <div className="flex flex-wrap gap-3">
                         <span className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-mono text-blue-300 uppercase tracking-widest">Hi-Fi 3D</span>
                         <span className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-mono text-purple-300 uppercase tracking-widest">Optimized</span>
                         <span className="px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-[10px] font-mono text-pink-300 uppercase tracking-widest">Responsive</span>
                      </div>
                   </div>
                   <div className="bg-gradient-to-br from-white/5 to-white/0 p-8 rounded-[2rem] border border-white/10">
                      <h3 className="text-xl font-bold mb-6 text-white/90">Nossa Expertise</h3>
                      <ul className="space-y-4">
                         {["Interfaces Fluidas", "Otimização de Assets", "Narrativa Visual 3D", "Next.js Avançado"].map((item, i) => (
                           <li key={i} className="flex items-center gap-3 text-sm opacity-60"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />{item}</li>
                         ))}
                      </ul>
                   </div>
                </div>
             </div>
          </div>
          <div className="h-40 flex items-center justify-center text-white/10 text-[10px] uppercase tracking-[0.5em] font-black">Inovação sem limites • 2026</div>
       </div>
    </div>
  )
}