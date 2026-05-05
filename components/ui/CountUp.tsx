'use client'

import { useMotionValue, useSpring, useTransform, motion, useInView, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface CountUpProps {
  value: string
  duration?: number
}

export function CountUp({ value, duration = 2 }: CountUpProps) {
  // Regex to separate prefix, number and suffix
  // Handles: "-42%", "3.8x", "7 dias", "100%", "+180%"
  const match = value.match(/^([^\d-]*)(-?\d+\.?\d*)(.*)$/)
  
  const prefix = match ? match[1] : ''
  const targetNumber = match ? parseFloat(match[2]) : 0
  const suffix = match ? match[3] : ''

  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => {
    // If target is integer, return integer. If float, return float with 1 decimal.
    const isFloat = !Number.isInteger(targetNumber)
    if (isFloat) {
      return latest.toFixed(1)
    }
    return Math.round(latest).toString()
  })

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, targetNumber, {
        duration: duration,
        ease: [0.33, 1, 0.68, 1], // easeOutQuart
      })
      return controls.stop
    }
  }, [isInView, targetNumber, duration, count])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}
