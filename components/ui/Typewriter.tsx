'use client'

import { useState, useEffect, useRef } from 'react'

interface TypewriterProps {
  text: string
  speed?: number // ms per character
  duration?: number // total duration in ms (overrides speed if provided)
  delay?: number // delay before starting in ms
  className?: string
  cursorColor?: string
  watchRef?: React.RefObject<HTMLElement | null>
}

export function Typewriter({ 
  text, 
  speed, 
  duration, 
  delay = 0, 
  className = "",
  cursorColor = "bg-blue-400",
  watchRef
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)

  // Use MutationObserver or IntersectionObserver to start animation
  useEffect(() => {
    if (watchRef && watchRef.current) {
      const target = watchRef.current
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const opacity = parseFloat(window.getComputedStyle(target).opacity)
            if (opacity > 0.1) {
              setIsVisible(true)
              observer.disconnect()
            }
          }
        })
      })

      observer.observe(target, { attributes: true, attributeFilter: ['style'] })
      
      // Check initial state
      const initialOpacity = parseFloat(window.getComputedStyle(target).opacity)
      if (initialOpacity > 0.1) {
        setIsVisible(true)
        observer.disconnect()
      }

      return () => observer.disconnect()
    } else {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        },
        { threshold: 0.1 }
      )

      if (containerRef.current) {
        observer.observe(containerRef.current)
      }

      return () => observer.disconnect()
    }
  }, [watchRef])

  useEffect(() => {
    if (!isVisible) return

    let currentText = ''
    let currentIndex = 0
    
    // Calculate character delay
    // If duration is provided, use it to calculate speed
    // "Pronto para o Próximo Nível?" has ~28 chars
    // 3000ms / 28 chars = ~107ms per char
    const charDelay = duration ? duration / text.length : (speed || 100)

    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        if (currentIndex < text.length) {
          currentText += text[currentIndex]
          setDisplayedText(currentText)
          currentIndex++
        } else {
          clearInterval(intervalId)
        }
      }, charDelay)

      return () => clearInterval(intervalId)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [text, speed, duration, delay, isVisible])

  return (
    <span 
      ref={containerRef} 
      className={`${className} inline-block min-h-[1.2em] whitespace-pre-wrap`}
    >
      {displayedText}
      <span className={`inline-block w-[3px] h-[0.8em] ${cursorColor} ml-1 align-middle animate-blink shadow-[0_0_8px_rgba(59,130,246,0.8)]`} />
    </span>
  )
}
