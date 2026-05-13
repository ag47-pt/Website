'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { theme as defaultTheme } from '@/config/design-system'
import { theme as limeTheme }    from '@/config/design-system-lime'
import { theme as orangeTheme }  from '@/config/design-system-orange'
import { theme as blueTheme }    from '@/config/design-system-blue'
import { theme as tomateTheme }  from '@/config/design-system-tomate'

const THEMES = {
  default: defaultTheme,
  lime:    limeTheme,
  orange:  orangeTheme,
  blue:    blueTheme,
  tomate:  tomateTheme,
} as const

export function getContrastColor(hexColor: string) {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
  return yiq >= 128 ? '#000000' : '#ffffff'
}

type ThemeName = keyof typeof THEMES
const CYCLE: ThemeName[] = ['default', 'lime', 'orange', 'blue', 'tomate']

type ThemeContextType = {
  theme: typeof defaultTheme
  themeName: string
  toggleTheme: () => void
  setTheme: (name: ThemeName) => void
  isDark: boolean
  toggleDark: () => void
  themeContrast: string
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<typeof defaultTheme>(limeTheme)
  const [themeName, setThemeName]       = useState<ThemeName>('lime')
  const [isDark, setIsDark]             = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('ag47-theme') as ThemeName | null
    const savedMode = localStorage.getItem('ag47_admin_darkmode')
    
    setTimeout(() => {
      if (savedTheme && savedTheme in THEMES) {
        setCurrentTheme(THEMES[savedTheme])
        setThemeName(savedTheme)
      }
      if (savedMode === 'light') setIsDark(false)
    }, 0)
  }, [])

  const toggleTheme = () => {
    const currentIndex = CYCLE.indexOf(themeName)
    const nextName = CYCLE[(currentIndex + 1) % CYCLE.length]
    setTheme(nextName)
  }

  const setTheme = (name: ThemeName) => {
    if (name in THEMES) {
      setCurrentTheme(THEMES[name])
      setThemeName(name)
      localStorage.setItem('ag47-theme', name)
    }
  }

  const toggleDark = () => {
    setIsDark((d) => {
      const next = !d
      localStorage.setItem('ag47_admin_darkmode', next ? 'dark' : 'light')
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ 
      theme: currentTheme, 
      themeName, 
      toggleTheme, 
      setTheme,
      isDark, 
      toggleDark,
      themeContrast: getContrastColor(currentTheme.colors.primary) 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
