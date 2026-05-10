'use client'

import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { Suspense, useRef, useState, useEffect } from 'react'
import { Earth } from './3d/Earth'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { Compass } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function NotFoundScene() {
  const { theme } = useTheme()
  const [isSucked, setIsSucked] = useState(false)
  const [isDescriptionSucked, setIsDescriptionSucked] = useState(false)
  // Dummy ref para o componente Earth não quebrar (ele espera um MutableRefObject<number>)
  const dummyScroll = useRef(0)

  useEffect(() => {
    const timerTitle = setTimeout(() => setIsSucked(true), 3000)
    const timerDesc = setTimeout(() => setIsDescriptionSucked(true), 9999)
    const timerChat = setTimeout(() => {
      // Dispatch event for global elements (like Chatbox)
      window.dispatchEvent(new CustomEvent('ag47-black-hole-suck'))
    }, 12000)
    
    return () => {
      clearTimeout(timerTitle)
      clearTimeout(timerDesc)
      clearTimeout(timerChat)
    }
  }, [])

  return (
    <div className="relative bg-black min-h-screen overflow-hidden">
      {/* Background estático para profundidade */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src="/imgs/universo-nebuloso.webp" 
          alt="Background" 
          className="w-full h-full object-cover scale-110 opacity-20 blur-[8px] grayscale" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* Camada 3D */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-10">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <Suspense fallback={null}>
            <Earth lerpedScroll={dummyScroll} texturePath="/imgs/Black_Hole.webp" />
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="max-w-3xl">
          <AnimatePresence>
            {!isSucked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ 
                  opacity: 0, 
                  scale: 0, 
                  rotate: 15,
                  y: 500, // Sucking down towards the center
                  filter: 'blur(20px)',
                  transition: { duration: 2, ease: "easeInOut" }
                }}
                className="relative"
              >
                <h1 className="text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter text-white opacity-5 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  404
                </h1>
                
                <h2 className="text-4xl md:text-6xl font-black mb-8 text-white tracking-tight uppercase">
                  Perdido no <span 
                    style={{ 
                      color: theme.colors.primary,
                      textShadow: `0 0 20px ${theme.colors.primary}80, 0 0 40px ${theme.colors.primary}40`
                    }} 
                    className="italic animate-pulse"
                  >
                    Buraco Negro
                  </span>
                </h2>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            {!isDescriptionSucked && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.1, 
                  rotate: -10,
                  filter: 'blur(40px)',
                  transition: { duration: 3, ease: "easeInOut" }
                }}
                className="relative mt-8 w-full"
              >
                <div className="relative group mx-auto max-w-2xl mb-12 p-10 md:p-14 rounded-[3rem] overflow-hidden">
                  {/* Mirror/Glass Background - Ultra Transparency */}
                  <div className="absolute inset-0 bg-white/[0.003] backdrop-blur-[40px] border border-white/5 rounded-[3rem]" />
                  
                  {/* Mirror Reflection/Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  
                  {/* Inner Glossy Border */}
                  <div className="absolute inset-[1px] rounded-[2.95rem] border border-white/[0.03] pointer-events-none" />

                  <div className="relative z-10 flex flex-col items-center gap-6">
                    <div 
                      className="p-4 rounded-full bg-white/[0.02] border border-white/10"
                      style={{ color: theme.colors.primary }}
                    >
                      <Compass size={32} className="animate-spin-slow" />
                    </div>

                    <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed">
                      O que procuras está em um buraco negro e não pode mais ser acessado.
                      <span className="block mt-4 opacity-60 text-lg md:text-xl">
                        Parece que as coordenadas deste link foram sugadas para outra dimensão.
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  <Link 
                    href="/"
                    className="group relative inline-flex items-center justify-center px-10 py-5 rounded-full font-black text-black uppercase tracking-[0.2em] text-sm transition-all hover:scale-105 active:scale-95 overflow-hidden"
                    style={{ 
                      backgroundColor: theme.colors.primary,
                      boxShadow: `0 0 30px ${theme.colors.primary}60, 0 0 60px ${theme.colors.primary}20`
                    }}
                  >
                    <span className="relative z-10">Regressar à Agência</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Link>
                  
                  <button 
                    onClick={() => window.history.back()}
                    className="px-10 py-5 rounded-full font-bold text-white/50 uppercase tracking-[0.2em] text-sm border border-white/10 hover:border-white/30 hover:text-white transition-all"
                  >
                    Voltar Atrás
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Elementos Decorativos */}
      <div className="absolute bottom-12 left-0 w-full flex flex-col items-center gap-4 z-30 pointer-events-none opacity-40">
        <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <p className="text-[9px] uppercase tracking-[0.6em] text-white/40 font-bold">
          Agência 47 • Sistema de Navegação Astral
        </p>
      </div>
    </div>
  )
}
