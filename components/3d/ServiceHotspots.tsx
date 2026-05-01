import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { hotspotsData } from '../../data/content'

export function ServiceHotspots({ lerpedScroll }: { lerpedScroll: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null)
  const [active, setActive] = useState<number | null>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = (lerpedScroll.current * Math.PI * 0.2) + (state.clock.elapsedTime * 0.1)
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {hotspotsData.map((s, i) => (
        <group key={i} position={s.pos as [number, number, number]}>
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
