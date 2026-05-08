'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { theme as defaultTheme } from '@/config/design-system'
import { theme as limeTheme }    from '@/config/design-system-lime'
import { theme as orangeTheme }  from '@/config/design-system-orange'
import { theme as blueTheme }    from '@/config/design-system-blue'

const THEMES = {
  default: defaultTheme,
  lime:    limeTheme,
  orange:  orangeTheme,
  blue:    blueTheme,
} as const

type ThemeName = keyof typeof THEMES
const CYCLE: ThemeName[] = ['default', 'lime', 'orange', 'blue']

type ThemeContextType = {
  theme: typeof defaultTheme
  themeName: string
  toggleTheme: () => void
  isDark: boolean
  toggleDark: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<typeof defaultTheme>(limeTheme)
  const [themeName, setThemeName]       = useState<ThemeName>('lime')
  const [isDark, setIsDark]             = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('ag47-theme') as ThemeName | null
    if (savedTheme && savedTheme in THEMES) {
      setCurrentTheme(THEMES[savedTheme])
      setThemeName(savedTheme)
    }
    const savedMode = localStorage.getItem('ag47_admin_darkmode')
    if (savedMode === 'light') setIsDark(false)
  }, [])

  const toggleTheme = () => {
    const currentIndex = CYCLE.indexOf(themeName)
    const nextName = CYCLE[(currentIndex + 1) % CYCLE.length]
    setCurrentTheme(THEMES[nextName])
    setThemeName(nextName)
    localStorage.setItem('ag47-theme', nextName)
  }

  const toggleDark = () => {
    setIsDark((d) => {
      const next = !d
      localStorage.setItem('ag47_admin_darkmode', next ? 'dark' : 'light')
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, themeName, toggleTheme, isDark, toggleDark }}>
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
