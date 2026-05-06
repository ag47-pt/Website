'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { theme as defaultTheme } from '@/config/design-system'
import { theme as limeTheme } from '@/config/design-system-lime'

type ThemeContextType = {
  theme: typeof defaultTheme
  themeName: string
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState(limeTheme)
  const [themeName, setThemeName] = useState('lime')

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ag47-theme')
    if (saved === 'default') {
      setCurrentTheme(prev => prev === defaultTheme ? prev : defaultTheme)
      setThemeName(prev => prev === 'default' ? prev : 'default')
    } else if (saved === 'lime') {
      setCurrentTheme(prev => prev === limeTheme ? prev : limeTheme)
      setThemeName(prev => prev === 'lime' ? prev : 'lime')
    }
  }, [])

  const toggleTheme = () => {
    const nextName = themeName === 'default' ? 'lime' : 'default'
    const nextTheme = nextName === 'lime' ? limeTheme : defaultTheme
    
    setCurrentTheme(nextTheme)
    setThemeName(nextName)
    localStorage.setItem('ag47-theme', nextName)
  }

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, themeName, toggleTheme }}>
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
