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
  const [currentTheme, setCurrentTheme] = useState(defaultTheme)
  const [themeName, setThemeName] = useState('default')

  const toggleTheme = () => {
    if (themeName === 'default') {
      setCurrentTheme(limeTheme)
      setThemeName('lime')
    } else {
      setCurrentTheme(defaultTheme)
      setThemeName('default')
    }
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
