'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, useGLTF, Environment, Html } from '@react-three/drei'
import { useRef, useState } from 'react'
import * as THREE from 'three'

// Componente com modelo 3D externo
function AnimatedModel({ modelPath = '/models/torus.glb' }: { modelPath?: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const scroll = useScroll()
  
  // Tenta carregar o modelo, fallback para geometria básica
  let gltf: any = { scene: null }
  let error = false
  try {
    gltf = useGLTF(modelPath)
  } catch (e) {
    if (e instanceof Promise) throw e
    error = true
  }
  const { scene } = gltf
  
  useFrame(() => {
    if (!groupRef.current) return
    
    const t = scroll.offset
    
    groupRef.current.rotation.y = t * Math.PI * 2
    groupRef.current.position.y = Math.sin(t * Math.PI) * 0.3
    groupRef.current.scale.setScalar(0.8 + t * 0.4)
  })
  
  if (error || !scene) {
    // Fallback: um torus knot bonito
    return (
      <group ref={groupRef}>
        <mesh>
          <torusKnotGeometry args={[0.8, 0.25, 128, 16]} />
          <meshStandardMaterial color="#ff44aa" metalness={0.7} roughness={0.2} />
        </mesh>
      </group>
    )
  }
  
  return <primitive ref={groupRef} object={scene} scale={1.5} />
}

// Câmera que se move com o scroll
function MovingCamera() {
  const scroll = useScroll()
  const { camera } = useThree()
  
  useFrame(() => {
    const t = scroll.offset
    // Movimento circular da câmera
    const radius = 4
    const angle = t * Math.PI * 2
    camera.position.x = Math.sin(angle) * radius
    camera.position.z = Math.cos(angle) * radius
    camera.position.y = Math.sin(angle * 2) * 1
    camera.lookAt(0, 0, 0)
  })
  
  return null
}

// UI dinâmica (Ref-based para performance e compatibilidade)
function DynamicUI() {
  const scroll = useScroll()
  const textRef = useRef<HTMLParagraphElement>(null)
  
  const messages = [
    { progress: 0.1, text: "🎬 Início da jornada..." },
    { progress: 0.3, text: "🔄 Olhando ao redor..." },
    { progress: 0.5, text: "✨ Meio do caminho!" },
    { progress: 0.7, text: "🚀 Quase lá..." },
    { progress: 0.9, text: "🎉 Final!" }
  ]
  
  useFrame(() => {
    if (textRef.current) {
      const progress = scroll.offset
      const currentMessage = messages.slice().reverse().find(m => progress >= m.progress)?.text || messages[0].text
      textRef.current.innerText = `Progresso: ${Math.round(progress * 100)}% - ${currentMessage}`
    }
  })
  
  return (
    <Html fullscreen portal={{ current: document.body }}>
      <div className="absolute bottom-20 left-0 right-0 text-center text-white pointer-events-none">
        <div className="bg-black/50 backdrop-blur-sm inline-block px-6 py-3 rounded-full">
          <p ref={textRef} className="text-sm font-mono">
            Progresso: 0% - {messages[0].text}
          </p>
        </div>
      </div>
    </Html>
  )
}

export default function Model3DScene() {
  return (
    <div className="relative w-full" style={{ height: '400vh' }}>
      <div className="sticky top-0 h-screen w-full">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-3, 2, 4]} intensity={0.5} color="#ff66aa" />
          <pointLight position={[3, 1, 2]} intensity={0.5} color="#44ffaa" />
          
          <Environment preset="sunset" />
          
          <ScrollControls pages={4} damping={0.08}>
            <AnimatedModel />
            <DynamicUI />
          </ScrollControls>
        </Canvas>
        
        <div className="absolute top-8 left-8 text-white/70 text-sm bg-black/50 p-3 rounded-lg backdrop-blur">
          <p className="font-mono">🎯 Modo Avançado</p>
          <p className="text-xs opacity-60">Câmera em movimento + Modelo 3D</p>
        </div>
      </div>
    </div>
  )
}