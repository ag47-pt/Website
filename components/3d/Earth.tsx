import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const PI = Math.PI;
const PI2 = Math.PI * 2;

export function Earth({ 
  lerpedScrollRef, 
  texturePath 
}: { 
  lerpedScrollRef: React.MutableRefObject<number>,
  texturePath: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const earthTexture = useTexture(texturePath)
  
  useFrame((state) => {
    if (!meshRef.current) return
    const cur = lerpedScrollRef.current
    const time = state.clock.elapsedTime
    
    // Rotação: Scroll + Auto-rotação lenta
    meshRef.current.rotation.y = (cur * PI2) + PI + time * 0.05
    meshRef.current.rotation.z = 0.2 + Math.sin(time * 0.2) * 0.05
    
    // Efeito de pulsação e flutuação sutil
    meshRef.current.scale.setScalar(1.0 + Math.sin(cur * PI + time * 0.5) * 0.05)
    meshRef.current.position.y = Math.sin(cur * PI2 + time * 0.3) * 0.1

    // Animação da luz de passagem (Efeito de Brilho) - Velocidade Reduzida
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(time * 0.5) * 2.5
      lightRef.current.position.y = Math.cos(time * 0.2) * 1.5
      lightRef.current.position.z = Math.cos(time * 0.3) * 2.5
    }
  })
  
  return (
    <group scale={0.81}>
      {/* Luz central para dar o efeito de sol iluminando de dentro/perto */}
      <pointLight position={[0, 0, 2]} intensity={1.5} color="#f9fd93ff" distance={10} />
      
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          map={earthTexture} 
          metalness={0.6} 
          roughness={0.3} 
          transparent={true} 
          emissive="#ffffff" 
          emissiveMap={earthTexture} 
          emissiveIntensity={0.15} 
        />
      </mesh>
      
      {/* Luz de passagem dinâmica (Lens Flare effect logic) */}
      <pointLight 
        ref={lightRef} 
        intensity={2.5} 
        distance={8} 
        color="#ffffff" 
      />
      
      {/* Atmosfera Brilhante / Aura */}
      <mesh scale={1.1}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          color="#ffaa44" 
          transparent 
          opacity={0.1} 
          side={THREE.BackSide} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// Preload da nova textura de Buraco Negro
useTexture.preload('/imgs/Black_Hole.webp')
