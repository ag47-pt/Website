'use client';

import React, { useState } from 'react';
import { NormalizedDesignSystem } from '@/lib/design-system/types';
import { Menu, X, ArrowRight, ShieldCheck, ShoppingBag, Utensils } from 'lucide-react';

interface RuntimeNavbarProps {
  spec: NormalizedDesignSystem;
  themeMode: 'light' | 'dark';
}

export function RuntimeNavbar({ spec, themeMode }: RuntimeNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { presentation, demo_content, colors, radius, typography } = spec;

  const brandName = demo_content.brand_name || spec.meta.name;
  const isDark = themeMode === 'dark';

  const primaryColor = isDark ? (colors.primary.dark_value || colors.primary.value) : colors.primary.value;
  const secondaryColor = isDark ? (colors.secondary.dark_value || colors.secondary.value) : colors.secondary.value;
  const bgColor = isDark ? (colors.background.dark_value || colors.background.value) : colors.background.value;
  const surfaceColor = isDark ? (colors.surface.dark_value || colors.surface.value) : colors.surface.value;
  const textPrimary = isDark ? (colors.text_primary.dark_value || colors.text_primary.value) : colors.text_primary.value;
  const textMuted = isDark ? (colors.text_muted.dark_value || colors.text_muted.value) : colors.text_muted.value;
  const borderColor = isDark ? (colors.border.dark_value || colors.border.value) : colors.border.value;

  // Archetype-specific nav links
  const getNavLinks = () => {
    switch (presentation.archetype) {
      case 'editorial':
        return ['Edições', 'Ensaios', 'Críticas', 'Autores', 'Manifesto'];
      case 'restaurant':
        return ['Menu', 'Especiais', 'História', 'Vinhos', 'Reservas'];
      case 'commerce':
        return ['Novidades', 'Coleções', 'Artesãos', 'Sustentabilidade', 'Lojas'];
      case 'fintech':
        return ['Tesouraria', 'Custódia', 'Câmbio FX', 'Segurança', 'API'];
      case 'service':
        return ['Serviços', 'Casos', 'Método', 'Equipe', 'Contato'];
      case 'minimal':
        return ['Visão', 'Trabalhos', 'Sobre', 'Contato'];
      default:
        return ['Produto', 'Recursos', 'Soluções', 'Preços', 'Docs'];
    }
  };

  const navLinks = getNavLinks();

  const getActionIcon = () => {
    switch (presentation.archetype) {
      case 'restaurant':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'commerce':
        return <ShoppingBag className="w-3.5 h-3.5" />;
      case 'fintech':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      default:
        return <ArrowRight className="w-3.5 h-3.5" />;
    }
  };

  return (
    <header
      className="sticky top-0 z-40 w-full transition-colors border-b backdrop-blur-md"
      style={{
        backgroundColor: `${bgColor}F0`,
        borderColor: borderColor,
      }}
    >
      <div
        className="max-w-[1200px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between"
      >
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center font-bold text-sm select-none"
            style={{
              backgroundColor: primaryColor,
              color: '#0A0A0A',
              borderRadius: radius.sm || '8px',
              fontFamily: typography.display.font_family,
            }}
          >
            {brandName.charAt(0)}
          </div>
          <span
            className="font-bold text-base md:text-lg tracking-tight"
            style={{
              color: textPrimary,
              fontFamily: typography.display.font_family,
            }}
          >
            {brandName}
          </span>
        </div>

        {/* Desktop Navigation Links */}
        {presentation.navigation_style !== 'minimal' && (
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={`#${link.toLowerCase()}`}
                className="text-sm font-medium transition-opacity hover:opacity-100"
                style={{
                  color: idx === 0 ? textPrimary : textMuted,
                  fontFamily: typography.body.font_family,
                  opacity: idx === 0 ? 1 : 0.8,
                }}
              >
                {link}
              </a>
            ))}
          </nav>
        )}

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {presentation.archetype === 'commerce' && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border"
              style={{
                borderColor: borderColor,
                borderRadius: radius.full || '999px',
                color: textPrimary,
                backgroundColor: surfaceColor,
              }}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Sacola (0)</span>
            </div>
          )}

          <button
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold transition-transform active:scale-95 cursor-pointer shadow-sm"
            style={{
              backgroundColor: primaryColor,
              color: '#0A0A0A',
              padding: spec.components.button_primary?.padding || '10px 20px',
              borderRadius: radius.md || '12px',
              fontFamily: typography.button.font_family || typography.body.font_family,
            }}
          >
            <span>{demo_content.cta_primary || 'Começar'}</span>
            {getActionIcon()}
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white"
            style={{ color: textPrimary }}
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className="sm:hidden px-6 py-6 border-b space-y-4 animate-in fade-in slide-in-from-top-2"
          style={{
            backgroundColor: surfaceColor,
            borderColor: borderColor,
          }}
        >
          <nav className="flex flex-col gap-3">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={`#${link.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold py-1.5"
                style={{
                  color: textPrimary,
                  fontFamily: typography.body.font_family,
                }}
              >
                {link}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t" style={{ borderColor: borderColor }}>
            <button
              className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold py-3"
              style={{
                backgroundColor: primaryColor,
                color: '#0A0A0A',
                borderRadius: radius.md || '12px',
                fontFamily: typography.button.font_family,
              }}
            >
              <span>{demo_content.cta_primary || 'Começar Agora'}</span>
              {getActionIcon()}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
