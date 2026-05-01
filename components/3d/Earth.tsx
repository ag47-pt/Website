import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export function Earth({ lerpedScroll }: { lerpedScroll: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const earthTexture = useTexture('/imgs/mapa-mundi-real-optimized.webp')
  
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
      {/* Luz central para dar o efeito de sol iluminando de dentro/perto */}
      <pointLight position={[0, 0, 2]} intensity={2.5} color="#ffd8a8" distance={10} />
      
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          map={earthTexture} 
          metalness={0.1} 
          roughness={0.5} 
          transparent={true} 
          emissive="#ffffff" 
          emissiveMap={earthTexture} 
          emissiveIntensity={0.8} 
        />
      </mesh>
      
      {/* Atmosfera Brilhante / Aura */}
      <mesh scale={1.1}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          color="#ffaa44" 
          transparent 
          opacity={0.15} 
          side={THREE.BackSide} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
