import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export function Earth({ lerpedScroll }: { lerpedScroll: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const earthTexture = useTexture('/imgs/mapamundi.webp')
  
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
