'use client';

import React, { useState } from 'react';
import { NormalizedDesignSystem } from '@/lib/design-system/types';
import { Plus, ShoppingBag, BookOpen, Check, ArrowUpRight } from 'lucide-react';

interface RuntimeShowcaseGridProps {
  spec: NormalizedDesignSystem;
  themeMode: 'light' | 'dark';
}

export function RuntimeShowcaseGrid({ spec, themeMode }: RuntimeShowcaseGridProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const { presentation, colors, radius, typography, spacing } = spec;
  const isDark = themeMode === 'dark';

  const primaryColor = isDark ? (colors.primary.dark_value || colors.primary.value) : colors.primary.value;
  const secondaryColor = isDark ? (colors.secondary.dark_value || colors.secondary.value) : colors.secondary.value;
  const surfaceColor = isDark ? (colors.surface.dark_value || colors.surface.value) : colors.surface.value;
  const surfaceElevated = isDark ? (colors.surface_elevated.dark_value || colors.surface_elevated.value) : colors.surface_elevated.value;
  const textPrimary = isDark ? (colors.text_primary.dark_value || colors.text_primary.value) : colors.text_primary.value;
  const textSecondary = isDark ? (colors.text_secondary.dark_value || colors.text_secondary.value) : colors.text_secondary.value;
  const textMuted = isDark ? (colors.text_muted.dark_value || colors.text_muted.value) : colors.text_muted.value;
  const borderColor = isDark ? (colors.border.dark_value || colors.border.value) : colors.border.value;

  // 1. Restaurant Menu Data
  const restaurantItems = [
    {
      title: 'Bacalhau Confitado em Azeite de Ervas',
      desc: 'Lombo de bacalhau em baixa temperatura com emulsão de grão-de-bico e crocante de broa de milho.',
      price: '€ 26.00',
      tag: 'Assinatura',
      cat: 'Pratos Principais',
    },
    {
      title: 'Arroz de Lavagante & Açafrão',
      desc: 'Arroz cremoso com lavagante da nossa costa, caldo rico de crustáceos e açafrão tostado.',
      price: '€ 32.50',
      tag: 'Especial',
      cat: 'Pratos Principais',
    },
    {
      title: 'Tártaro de Atum com Lima & Abacate',
      desc: 'Atum fresco dos Açores cortado na ponta da faca com emulsão de lima e chips de mandioca.',
      price: '€ 18.00',
      tag: 'Entrada',
      cat: 'Entradas',
    },
    {
      title: 'Mousse de Chocolate 70% com Sal Maldon',
      desc: 'Cacau de origem com crumble de avelã e azeite virgem extra da Quinta do Crasto.',
      price: '€ 9.50',
      tag: 'Sobremesa',
      cat: 'Sobremesas',
    },
  ];

  // 2. Commerce Products Data
  const commerceItems = [
    {
      title: 'Mesa de Centro Nordic Ash',
      desc: 'Madeira maciça de freixo com encaixes tradicionais japoneses e acabamento mate.',
      price: '€ 340.00',
      oldPrice: '€ 410.00',
      tag: '-20% Off',
    },
    {
      title: 'Luminária de Mesa Oásis',
      desc: 'Vidro soprado artesanal com base em mármore de Estremoz e luz regulável.',
      price: '€ 145.00',
      tag: 'Destaque',
    },
    {
      title: 'Jarra Cerâmica Vulcanica',
      desc: 'Barro preto tradicional cozido a lenha com textura rústica e toque aveludado.',
      price: '€ 78.00',
      tag: 'Artesanal',
    },
  ];

  // 3. Editorial Articles Data
  const editorialItems = [
    {
      title: 'A Poética do Espaço Digital: Como a Arquitetura Molda a Atenção Humana',
      author: 'Helena Matos',
      readTime: '7 min de leitura',
      date: '14 Jun 2026',
      tag: 'Arquitetura',
    },
    {
      title: 'O Fim das Interfaces Genéricas e o Renascimento da Tipografia Expressiva',
      author: 'Diogo Alencastro',
      readTime: '5 min de leitura',
      date: '02 Jun 2026',
      tag: 'Design',
    },
    {
      title: 'Sistemas Determinísticos vs. Criatividade Artificial: Onde Reside a Intenção?',
      author: 'Mariana Fontes',
      readTime: '9 min de leitura',
      date: '28 Mai 2026',
      tag: 'Ensaio',
    },
  ];

  return (
    <section
      className="py-16 md:py-24 border-b"
      style={{
        borderColor: borderColor,
        paddingTop: spacing.section_spacing || '80px',
        paddingBottom: spacing.section_spacing || '80px',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 space-y-10">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider block"
              style={{ color: primaryColor }}
            >
              {presentation.archetype === 'restaurant'
                ? 'CARTA GASTRONÓMICA'
                : presentation.archetype === 'commerce'
                ? 'VITRINE DE PRODUTOS'
                : 'PUBLICAÇÕES & ARTIGOS'}
            </span>
            <h2
              className="text-2xl md:text-3xl font-bold tracking-tight"
              style={{
                color: textPrimary,
                fontFamily: typography.h2.font_family,
              }}
            >
              {presentation.archetype === 'restaurant'
                ? 'Seleção de Sabores & Criações do Chef'
                : presentation.archetype === 'commerce'
                ? 'Peças de Edição Limitada'
                : 'Ensaios em Destaque'}
            </h2>
          </div>
        </div>

        {/* 1. Restaurant Grid */}
        {presentation.archetype === 'restaurant' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {restaurantItems.map((item, idx) => (
              <div
                key={idx}
                className="p-6 border transition-all hover:border-lime-500/50 flex flex-col justify-between gap-4"
                style={{
                  backgroundColor: surfaceColor,
                  borderColor: borderColor,
                  borderRadius: radius.lg || '18px',
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 border"
                      style={{
                        backgroundColor: `${secondaryColor}15`,
                        borderColor: `${secondaryColor}30`,
                        color: secondaryColor,
                        borderRadius: radius.full || '999px',
                      }}
                    >
                      {item.tag}
                    </span>
                    <span className="text-lg font-bold font-mono" style={{ color: primaryColor }}>
                      {item.price}
                    </span>
                  </div>
                  <h3 className="text-base font-bold" style={{ color: textPrimary }}>
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: textSecondary }}>
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold transition-all"
                    style={{
                      backgroundColor: primaryColor,
                      color: '#0A0A0A',
                      borderRadius: radius.sm || '8px',
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Commerce Grid */}
        {presentation.archetype === 'commerce' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commerceItems.map((item, idx) => (
              <div
                key={idx}
                className="border overflow-hidden transition-all hover:-translate-y-1 flex flex-col justify-between"
                style={{
                  backgroundColor: surfaceColor,
                  borderColor: borderColor,
                  borderRadius: radius.lg || '18px',
                }}
              >
                <div
                  className="h-48 flex items-center justify-center p-6 border-b relative"
                  style={{ backgroundColor: surfaceElevated, borderColor: borderColor }}
                >
                  <span
                    className="absolute top-4 left-4 text-[10px] font-bold px-2.5 py-0.5"
                    style={{
                      backgroundColor: secondaryColor,
                      color: '#FFFFFF',
                      borderRadius: radius.full || '999px',
                    }}
                  >
                    {item.tag}
                  </span>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                    ★
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold" style={{ color: textPrimary }}>
                      {item.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: textSecondary }}>
                      {item.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: borderColor }}>
                    <div>
                      <span className="text-lg font-bold font-mono" style={{ color: primaryColor }}>
                        {item.price}
                      </span>
                      {item.oldPrice && (
                        <span className="text-xs line-through ml-2" style={{ color: textMuted }}>
                          {item.oldPrice}
                        </span>
                      )}
                    </div>

                    <button
                      className="p-2 border transition-all"
                      style={{
                        backgroundColor: primaryColor,
                        color: '#0A0A0A',
                        borderRadius: radius.full || '999px',
                      }}
                      title="Adicionar à sacola"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Editorial & Others */}
        {(presentation.archetype === 'editorial' || presentation.archetype === 'fintech' || presentation.archetype === 'service' || presentation.archetype === 'saas' || presentation.archetype === 'minimal' || presentation.archetype === 'generic') && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {editorialItems.map((item, idx) => (
              <div
                key={idx}
                className="p-6 border transition-all hover:border-primary flex flex-col justify-between gap-6"
                style={{
                  backgroundColor: surfaceColor,
                  borderColor: borderColor,
                  borderRadius: radius.lg || '18px',
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono" style={{ color: textMuted }}>
                    <span>{item.date}</span>
                    <span>{item.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold leading-snug" style={{ color: textPrimary, fontFamily: typography.h3?.font_family }}>
                    {item.title}
                  </h3>
                </div>

                <div className="pt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: borderColor }}>
                  <span className="font-semibold" style={{ color: textSecondary }}>
                    Por {item.author}
                  </span>
                  <div className="flex items-center gap-1 font-bold" style={{ color: primaryColor }}>
                    <span>Ler</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
