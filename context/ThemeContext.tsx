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

  const adaptiveTheme = React.useMemo(() => {
    if (isDark) return currentTheme

    const overrides: Record<string, Partial<typeof defaultTheme['colors']>> = {
      lime: {
        primary: '#D1FF00', // Verde lima vibrante mantido no modo claro a pedido do utilizador
        secondary: '#00d9ff',
        accent: '#00d9ff',
        highlight: '#D1FF00',
        scrollPercentage: '#D1FF00',
        textVoice: '#D1FF00',
        textRestagMarked: '#000000',
        textRestagMarkedBG: '#D1FF00',
      },
      orange: {
        primary: '#ffaa00', // Laranja vibrante mantido no modo claro a pedido do utilizador
        secondary: '#ff4d00',
        accent: '#ffcc00',
        highlight: '#ffcc00',
        scrollPercentage: '#ffaa00',
        textVoice: '#ffaa00',
        textRestagMarked: '#000000',
        textRestagMarkedBG: '#ffaa00',
      },
      blue: {
        primary: '#0059ff', // Azul mantido no modo claro a pedido do utilizador
        secondary: '#00f2ff',
        accent: '#00d0ff',
        highlight: '#00f2ff',
        scrollPercentage: '#0059ff',
        textVoice: '#0059ff',
        textRestagMarked: '#ffffff',
        textRestagMarkedBG: '#0059ff',
      },
      tomate: {
        primary: '#d90000', // Vermelho tomate denso
        secondary: '#b83a00',
        accent: '#d90000',
        highlight: '#b83a00',
        scrollPercentage: '#d90000',
        textVoice: '#990000',
        textRestagMarked: '#ffffff',
        textRestagMarkedBG: '#d90000',
      },
      default: {
        primary: '#db2777', // Rosa clássico do Labs escurecido para excelente contraste
        secondary: '#6d28d9',
        accent: '#db2777',
        highlight: '#db2777',
        scrollPercentage: '#db2777',
        textVoice: '#be185d',
        textRestagMarked: '#ffffff',
        textRestagMarkedBG: '#db2777',
      }
    }

    const themeOverrides = overrides[themeName] || {}

    return {
      ...currentTheme,
      colors: {
        ...currentTheme.colors,
        ...themeOverrides,
        textPrimary: '#111827', // Slate-900 para contraste excelente no modo claro
        textSecondary: '#4b5563', // Slate-600 para descrições e textos de apoio
        textMuted: '#8892a0', // Slate-450 para metadados e badges secundários
        glass: {
          ...currentTheme.colors.glass,
          bg: 'rgba(255, 255, 255, 0.85)', // Vidro claro com desfoque elegante
          border: 'rgba(0, 0, 0, 0.08)', // Borda sutil para contornos claros
        }
      }
    }
  }, [currentTheme, isDark, themeName])

  return (
    <ThemeContext.Provider value={{ 
      theme: adaptiveTheme, 
      themeName, 
      toggleTheme, 
      setTheme,
      isDark, 
      toggleDark,
      themeContrast: getContrastColor(adaptiveTheme.colors.primary) 
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
