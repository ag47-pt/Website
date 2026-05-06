'use client'

import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useRef, Suspense, useState } from 'react'

// Hooks
import { usePageScroll } from '../hooks/usePageScroll'

// Data
import { servicesData } from '../data/content'
import { serviceKeyToSlug } from '../data/services'

// UI Components
import { Navbar } from './ui/Navbar'
import { ScrollingCard } from './ui/ScrollingCard'

// 3D Components
import { Earth } from './3d/Earth'
import { ServiceHotspots } from './3d/ServiceHotspots'
import { ScrollManager } from './3d/ScrollManager'

import { Typewriter } from './ui/Typewriter'
import { useTheme } from '@/context/ThemeContext'

export default function Basic3DScene() {
   const { theme } = useTheme();
   const scrollOffsetRaw = usePageScroll()
   const lerpedScroll = useRef(0)

   const [earthTexturePath, setEarthTexturePath] = useState('/imgs/universo-nebuloso.webp')

   const changeEarthTexture = () => {
      const images = [
         '/imgs/mapa-mundi-real-optimized.webp',
         '/imgs/mapamundi.webp',
         '/imgs/universo-nebuloso.webp'
      ]
      const currentIdx = images.indexOf(earthTexturePath)
      let nextIdx = currentIdx
      while (nextIdx === currentIdx) {
         nextIdx = Math.floor(Math.random() * images.length)
      }
      setEarthTexturePath(images[nextIdx])
   }

   // Refs para controle de animação da UI
   const progressRef = useRef<HTMLDivElement>(null)
   const introRef = useRef<HTMLDivElement>(null)
   const cardRef1 = useRef<HTMLDivElement>(null)
   const cardRef2 = useRef<HTMLDivElement>(null)
   const cardRef3 = useRef<HTMLDivElement>(null)
   const cardRef4 = useRef<HTMLDivElement>(null)
   const indicatorRef = useRef<HTMLDivElement>(null)

   return (
      <div className="relative bg-black min-h-screen overflow-x-hidden">
         {/* Background de Fundo Estático */}
         <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <img src="/imgs/universo-nebuloso.webp" alt="Background" className="w-full h-full object-cover scale-105 opacity-40 blur-[4px] grayscale-[0.3]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
         </div>

         {/* Camada 3D */}
         <div className="fixed inset-0 w-full h-full pointer-events-none z-10">
            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
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
                     cardRef3={cardRef3}
                     cardRef4={cardRef4}
                     indicatorRef={indicatorRef}
                  />
                  <Earth lerpedScroll={lerpedScroll} texturePath={earthTexturePath} />
                  <ServiceHotspots lerpedScroll={lerpedScroll} />
                  <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
               </Suspense>
            </Canvas>
         </div>

         {/* Camada de UI Interativa */}
         <div className="fixed inset-0 pointer-events-none z-30">
            <Navbar progressRef={progressRef} onChangeEarth={changeEarthTexture} />

            {/* Card 1: Websites */}
            <ScrollingCard 
               innerRef={cardRef1}
               nextScrollTarget={0.45}
               prevScrollTarget={0}
               slug={serviceKeyToSlug.websites}
               {...servicesData.websites}
            />

            {/* Card 2: SaaS */}
            <ScrollingCard 
               innerRef={cardRef2}
               nextScrollTarget={0.65}
               prevScrollTarget={0.25}
               slug={serviceKeyToSlug.saas}
               {...servicesData.saas}
            />

            {/* Card 3: Social Media */}
            <ScrollingCard 
               innerRef={cardRef3}
               nextScrollTarget={0.85}
               prevScrollTarget={0.45}
               slug={serviceKeyToSlug.socialMedia}
               {...servicesData.socialMedia}
            />

            {/* Card 4: Tráfego Pago */}
            <ScrollingCard 
               innerRef={cardRef4}
               nextScrollTarget={1}
               prevScrollTarget={0.65}
               slug={serviceKeyToSlug.trafegoPago}
               {...servicesData.trafegoPago}
            />

            <div
               ref={introRef}
               className="absolute inset-0 flex items-center justify-center cursor-pointer pointer-events-auto"
               onClick={() => {
                  if (typeof window !== 'undefined') {
                     const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                     window.scrollTo({ top: scrollHeight * 0.25, behavior: 'smooth' });
                  }
               }}
            >
               <div className="text-center text-white px-4 pointer-events-none">
                  <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white uppercase opacity-90">
                    Agência <span className="px-4" style={{ backgroundColor: theme.colors.primary, color: '#000', borderRadius: '8px' }}>47</span>
                  </h1>
                  <p className="text-sm md:text-xl font-light uppercase tracking-[0.5em] opacity-80 flex justify-center">
                     <span className="bg-black/20 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full">Experiência Imersiva</span>
                  </p>
               </div>
            </div>

            <div ref={indicatorRef} className="absolute top-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 pointer-events-none">
               <span className="text-[9px] uppercase tracking-[0.4em] font-bold mb-1">Iniciar viagem astral</span>
               <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center p-1">
                  <div className="w-1 h-1.5 bg-white/40 rounded-full animate-bounce" />
               </div>
               <div className="animate-bounce mt-1 text-lg">↓</div>
            </div>
         </div>

         {/* Corpo de rolagem para disparar o scroll (Invisível) */}
         <div className="relative z-20">
            <div className="h-[1600vh]" />

            {/* Seção Final após o scroll 3D */}
            <div className="py-1 flex items-center justify-center p-8">
               <div className="max-w-4xl w-full bg-white/[0.01] backdrop-blur-xl border border-white/5 p-16 rounded-[2.5rem] text-white shadow-2xl text-center">
                  <h2 
                    className="text-6xl font-black bg-clip-text text-transparent tracking-tighter"
                    style={{ backgroundImage: `linear-gradient(to right, #60a5fa, ${theme.colors.secondary}, ${theme.colors.primary})` }}
                  >
                     <Typewriter text="Pronto para o Próximo Nível?" duration={3000} delay={500} cursorColor={theme.colors.primary} />
                  </h2>
               </div>
            </div>
            <div className="h-40 flex items-center justify-center text-white/10 text-[10px] uppercase tracking-[0.5em] font-black">Inovação sem limites • 2026</div>
         </div>
      </div>
   )
}