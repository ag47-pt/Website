"use client";

import { useTheme } from "@/context/ThemeContext";

/**
 * Hook que adapta o ThemeContext global do AG47 para os componentes do Alt-Radar.
 * Fornece as cores do tema ativo (lime, orange, blue, tomate, default) 
 * para que o alt-radar acompanhe o design system do /eco.
 */
export function useEcoTheme() {
  const { theme, themeName } = useTheme();

  return {
    /** Cor de acento principal do tema (ex: #D1FF00 para lime) */
    primary: theme.colors.primary,
    /** Cor secundária (ex: #3fe2ff para lime) */
    secondary: theme.colors.secondary,
    /** Cor de acento/destaque */
    accent: theme.colors.accent,
    /** Cor de texto destacado */
    textVoice: theme.colors.textVoice,
    /** Background glass */
    glassBg: theme.colors.glass.bg,
    /** Borda glass */
    glassBorder: theme.colors.glass.border,
    /** Nome do tema ativo */
    themeName,
    /** Tema completo para acesso direto */
    theme,
  };
}
