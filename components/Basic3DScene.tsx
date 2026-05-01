'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Html, useTexture, Stars } from '@react-three/drei'
import { useRef, useState, useEffect, Suspense } from 'react'
import * as THREE from 'three'

// Hook customizado para sincronizar o scroll da página com o R3F
function usePageScroll() {
  const [offset, setOffset] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        setOffset(window.scrollY / scrollHeight)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return offset
}

// Componente para gerenciar o Lerp e atualizar elementos DOM/3D
function ScrollManager({ 
  scrollOffsetRaw, 
  lerpedScroll,
  progressRef,
  introRef,
  cardRef1,
  cardRef2,
  indicatorRef
}: { 
  scrollOffsetRaw: number, 
  lerpedScroll: React.MutableRefObject<number>,
  progressRef: React.RefObject<HTMLDivElement | null>,
  introRef: React.RefObject<HTMLDivElement | null>,
  cardRef1: React.RefObject<HTMLDivElement | null>,
  cardRef2: React.RefObject<HTMLDivElement | null>,
  indicatorRef: React.RefObject<HTMLDivElement | null>
}) {
  useFrame((state, delta) => {
    const lerpFactor = 0.05
    lerpedScroll.current += (scrollOffsetRaw - lerpedScroll.current) * lerpFactor
    const cur = lerpedScroll.current
    
    // Atualiza Barra de Progresso
    if (progressRef.current) progressRef.current.style.width = `${cur * 100}%`
    
    // Atualiza Texto de Introdução
    if (introRef.current) {
       const opacity = Math.max(0, 1 - (cur * 6))
       introRef.current.style.opacity = opacity.toString()
       introRef.current.style.transform = `translateY(-${cur * 50}px)`
    }

    // Atualiza Indicador de Scroll
    if (indicatorRef.current) indicatorRef.current.style.opacity = Math.max(0, 1 - (cur * 10)).toString()

    // Função auxiliar para animar cards
    const animateCard = (ref: React.RefObject<HTMLDivElement | null>, s: number, e: number, ps: number, pe: number) => {
      if (!ref.current) return
      let op = 0
      if (cur >= s && cur <= e) {
        if (cur >= ps && cur <= pe) op = 1
        else if (cur < ps) op = (cur - s) / (ps - s)
        else op = 1 - (cur - pe) / (e - pe)
      }
      const center = (s + e) / 2
      const dist = cur - center
      const ty = (1 - op) * 120 * (dist > 0 ? -1 : 1)
      const rx = (1 - op) * 25
      const ry = dist * 40
      const sc = 0.85 + op * 0.15
      ref.current.style.opacity = Math.max(0, op).toString()
      ref.current.style.transform = `translate(-50%, calc(-50% + ${ty}px)) perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${sc})`
      ref.current.style.pointerEvents = op > 0.8 ? 'auto' : 'none'
    }

    // Card 1: Websites (15% - 48%)
    animateCard(cardRef1, 0.15, 0.48, 0.23, 0.40)
    
    // Card 2: SaaS (48% - 81%)
    animateCard(cardRef2, 0.48, 0.81, 0.56, 0.73)
  })
  return null
}

// Componente Planeta Terra
function Earth({ lerpedScroll }: { lerpedScroll: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const earthTexture = useTexture('/imgs/Earth-Planet-PNG-Background-Image.png')
  
  useFrame((state) => {
    if (!meshRef.current) return
    const cur = lerpedScroll.current
    meshRef.current.rotation.y = (cur * Math.PI * 2) + Math.PI
    meshRef.current.rotation.z = 0.2
    meshRef.current.scale.setScalar(1.0 + Math.sin(cur * Math.PI) * 0.15)
    meshRef.current.position.y = Math.sin(cur * Math.PI * 2) * 0.2
  })
  
  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={earthTexture} metalness={0.2} roughness={0.8} transparent={true} />
      </mesh>
      <mesh scale={1.02}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#44aaff" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

// Pontos brilhantes (Service Hotspots)
function ServiceHotspots({ lerpedScroll }: { lerpedScroll: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null)
  const [active, setActive] = useState<number | null>(null)
  const services = [
    { title: "Design 3D", desc: "Modelagem e renderização premium para marcas modernas.", pos: [1.6, 0.8, 0.4] },
    { title: "Animações", desc: "Movimento fluido e interativo que prende a atenção.", pos: [-1.8, -0.5, 0.8] },
    { title: "Performance", desc: "Otimizado para web com carregamento ultra-rápido.", pos: [0.4, 1.8, -1.0] },
    { title: "UX/UI", desc: "Interfaces intuitivas focadas na conversão do usuário.", pos: [0.9, -1.5, -1.2] },
    { title: "Inovação", desc: "Uso de tecnologias de ponta como R3F e Next.js.", pos: [-1.2, 1.2, -1.8] }
  ]

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = (lerpedScroll.current * Math.PI * 0.2) + (state.clock.elapsedTime * 0.1)
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {services.map((s, i) => (
        <group key={i} position={s.pos as any}>
          <mesh 
            onClick={(e) => { e.stopPropagation(); setActive(active === i ? null : i) }}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
          >
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#fff" emissive="#44aaff" emissiveIntensity={5} />
          </mesh>
          <mesh scale={2}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#44aaff" transparent opacity={0.1} />
          </mesh>
          {active === i && (
            <Html distanceFactor={8}>
              <div className="bg-black/95 text-white p-5 rounded-2xl backdrop-blur-xl border border-white/20 w-56 shadow-[0_0_30px_rgba(68,170,255,0.3)] pointer-events-auto">
                <h3 className="font-bold text-sm text-blue-300 uppercase mb-1">{s.title}</h3>
                <p className="text-xs opacity-80 leading-relaxed">{s.desc}</p>
                <button onClick={() => setActive(null)} className="mt-4 w-full py-2 text-[10px] uppercase font-bold tracking-widest bg-blue-500/20 rounded-lg">Fechar</button>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  )
}

// Componente Reutilizável de Card de Serviço
function ScrollingCard({ 
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
      className="absolute top-1/2 left-1/2 w-[95%] max-w-[850px] min-h-[400px] bg-black/60 backdrop-blur-3xl border-2 rounded-[3.5rem] overflow-hidden shadow-2xl z-50 flex flex-col md:flex-row opacity-0 pointer-events-none"
    >
      <style>{`
        @keyframes cardPulse {
          0% { border-color: rgba(59, 130, 246, 0.5); box-shadow: 0 0 30px rgba(59, 130, 246, 0.2), inset 0 0 15px rgba(59, 130, 246, 0.1); }
          50% { border-color: rgba(168, 85, 247, 0.8); box-shadow: 0 0 60px rgba(168, 85, 247, 0.4), inset 0 0 25px rgba(168, 85, 247, 0.2); }
          100% { border-color: rgba(236, 72, 153, 0.5); box-shadow: 0 0 30px rgba(236, 72, 153, 0.2), inset 0 0 15px rgba(236, 72, 153, 0.1); }
        }
      `}</style>
      <div className="relative w-full md:w-[35%] h-48 md:h-auto overflow-hidden">
        <img src={img} alt="Service" className="w-full h-full object-cover scale-110" />
        <div className="absolute top-6 left-6 bg-gradient-to-r from-blue-500 to-purple-600 text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">{badge}</div>
      </div>
      <div className="p-10 md:p-14 md:w-[65%] text-white flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4"><div className="w-12 h-[1px] bg-blue-500" /><span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400">{tag}</span></div>
        <h3 className="text-4xl font-black mb-4 leading-tight tracking-tighter">{title}</h3>
        <div className="text-sm opacity-90 mb-10 leading-relaxed font-light max-w-lg">{desc}</div>
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

function Navbar({ progressRef }: { progressRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/5 backdrop-blur-xl border-b border-white/20 pointer-events-auto">
       <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
         <div className="text-white font-black text-3xl tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">AG47</div>
         <div className="hidden md:flex items-center gap-8 text-white/80 font-bold text-xs tracking-[0.2em] uppercase">
            <a href="#" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">Sites</a>
            <a href="#" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">APPs</a>
            <button className="bg-white text-black px-6 py-2 rounded-full hover:scale-105 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]">Lançar</button>
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

export default function Basic3DScene() {
  const scrollOffsetRaw = usePageScroll()
  const lerpedScroll = useRef(0)
  const progressRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const cardRef1 = useRef<HTMLDivElement>(null)
  const cardRef2 = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative bg-black min-h-screen overflow-x-hidden">
       <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <img src="/imgs/Gemini_compressed.webp" alt="Background" className="w-full h-full object-cover scale-105 opacity-40 blur-[4px] grayscale-[0.3]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
       </div>

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

       <div className="fixed inset-0 pointer-events-none z-30">
          <Navbar progressRef={progressRef} />
          
          {/* Card 1: Websites */}
          <ScrollingCard 
            innerRef={cardRef1}
            tag="Desenvolvimento Elite"
            title={<>Websites &<br/>Landing Pages</>}
            subtitle="Websites & Landing Pages"
            img="/imgs/service_web_design.png"
            setup="150€"
            monthly="29€"
            desc={
              <>
                <span className="font-bold text-white">Quem manda AQUI é seu cliente! 🤣</span><br/><br/>
                Filosofia de quem pensa em solução com foco no <span className="text-blue-300 font-medium">SEU PÚBLICO</span>, é como escrever código com o <span className="text-purple-300 font-medium">DNA da SUA EMPRESA</span>.<br/><br/>
                <span className="font-medium text-white italic">Isso catapulta SEU NEGÓCIO para o espaço 🚀</span>
              </>
            }
          />

          {/* Card 2: SaaS */}
          <ScrollingCard 
            innerRef={cardRef2}
            tag="Desenvolvimento As Service"
            title={<>Saas, Micro-saas,<br/>WebApps</>}
            subtitle="Software as a Service"
            img="/imgs/service_saas.png"
            setup="A partir de 500€"
            monthly="Sob Consulta"
            badge="Inovação"
            desc={
              <>
                <span className="font-bold text-white">Sua ideia em escala global! 🌎</span><br/><br/>
                Desenvolvemos arquiteturas robustas e escaláveis para o seu modelo de negócio <span className="text-blue-300 font-medium">RECORRENTE</span>. Do MVP à plataforma final, código limpo com <span className="text-purple-300 font-medium">FOCO EM ROI</span>.<br/><br/>
                <span className="font-medium text-white italic">Construa o futuro do seu ecossistema digital ⚡</span>
              </>
            }
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

       <div className="relative z-20">
          <div className="h-[800vh]" />
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