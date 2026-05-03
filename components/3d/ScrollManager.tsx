import React from 'react'
import { useFrame } from '@react-three/fiber'

export function ScrollManager({ 
  scrollOffsetRaw, 
  lerpedScroll,
  progressRef,
  introRef,
  cardRef1,
  cardRef2,
  cardRef3,
  cardRef4,
  indicatorRef
}: { 
  scrollOffsetRaw: number, 
  lerpedScroll: React.MutableRefObject<number>,
  progressRef: React.RefObject<HTMLDivElement | null>,
  introRef: React.RefObject<HTMLDivElement | null>,
  cardRef1: React.RefObject<HTMLDivElement | null>,
  cardRef2: React.RefObject<HTMLDivElement | null>,
  cardRef3: React.RefObject<HTMLDivElement | null>,
  cardRef4: React.RefObject<HTMLDivElement | null>,
  indicatorRef: React.RefObject<HTMLDivElement | null>
}) {
  useFrame((state, delta) => {
    const lerpFactor = 0.05
    lerpedScroll.current += (scrollOffsetRaw - lerpedScroll.current) * lerpFactor
    const cur = lerpedScroll.current
    
    // Atualiza Barra de Progresso (começa em 18% para a bolinha flamejante ficar visível)
    if (progressRef.current) progressRef.current.style.width = `${18 + (cur * 82)}%`
    
    // Atualiza Texto de Introdução
    if (introRef.current) {
       const opacity = Math.max(0, 1 - (cur * 6))
       introRef.current.style.opacity = opacity.toString()
       introRef.current.style.transform = `translateY(-${cur * 47}px)`
       introRef.current.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none'
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
      const rx = (1 - op) * 45
      const ry = dist * 90
      const sc = 0.85 + op * 0.15
      ref.current.style.opacity = Math.max(0, op).toString()
      ref.current.style.transform = `translate(-50%, calc(-45% + ${ty}px)) perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${sc})`
      ref.current.style.pointerEvents = op > 0.8 ? 'auto' : 'none'
    }

    // Card 1: Websites
    animateCard(cardRef1, 0.12, 0.32, 0.20, 0.30)
    
    // Card 2: SaaS
    animateCard(cardRef2, 0.32, 0.52, 0.40, 0.50)

    // Card 3: Social Media
    animateCard(cardRef3, 0.52, 0.72, 0.60, 0.70)

    // Card 4: Tráfego Pago
    animateCard(cardRef4, 0.72, 0.92, 0.80, 0.90)
  })
  return null
}
