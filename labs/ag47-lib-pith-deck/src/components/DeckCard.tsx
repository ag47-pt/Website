"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Flame,
  Radio,
  Cpu,
  Sparkles,
  Layers,
  ShieldCheck,
  Activity,
  Globe,
  Compass,
  ShoppingBag,
  Box,
  Truck,
  Mic,
  Target,
  TrendingUp,
  Film,
  LucideIcon,
} from "lucide-react";
import { PitchDeck } from "@/types/deck";

interface DeckCardProps {
  deck: PitchDeck;
  onSelect: (deck: PitchDeck) => void;
  index: number;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Film,
  TrendingUp,
  Radio,
  Cpu,
  Sparkles,
  Layers,
  ShieldCheck,
  Activity,
  Globe,
  Compass,
  ShoppingBag,
  Box,
  Truck,
  Mic,
  Target,
};

export function DeckCard({ deck, onSelect, index }: DeckCardProps) {
  const IconComponent = ICON_MAP[deck.coverStyle.iconName] || Layers;

  // Grid spans for editorial asymmetry
  const spanClass =
    deck.gridSpan === "large"
      ? "md:col-span-2 md:row-span-2"
      : deck.gridSpan === "medium"
      ? "md:col-span-2 lg:col-span-1"
      : deck.gridSpan === "tall"
      ? "md:row-span-2"
      : "col-span-1";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.3) }}
      onClick={() => onSelect(deck)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(deck);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Abrir pitch deck de ${deck.title}`}
      className={`group relative flex flex-col justify-between overflow-hidden border border-[rgba(245,242,235,0.09)] bg-[#111318] p-5 sm:p-6 transition-all duration-400 hover:border-[#ff5722]/50 hover:bg-[#161820] hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)] cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#ff5722] ${spanClass}`}
    >
      {/* Top Left Number & Editorial Code */}
      <div className="flex items-center justify-between border-b border-[rgba(245,242,235,0.07)] pb-3.5 mb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#ff5722]">
            {deck.code}
          </span>
          <span className="text-[rgba(245,242,235,0.2)]">/</span>
          <span className="font-mono text-[11px] text-[#8c877d]">
            {deck.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {deck.featured && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(255,87,34,0.35)] bg-[#ff5722]/10 px-2 py-0.5 text-[10px] font-medium text-[#ff7043]">
              <Flame className="h-2.5 w-2.5" />
              Destaque
            </span>
          )}
          <span className="font-mono text-[11px] text-[#8c877d]">
            {deck.year}
          </span>
        </div>
      </div>

      {/* Abstract Bespoke Cover Canvas */}
      <div
        className="relative mb-5 flex h-44 sm:h-52 w-full items-center justify-center overflow-hidden border border-[rgba(245,242,235,0.06)] transition-all duration-500 group-hover:border-[rgba(245,242,235,0.15)]"
        style={{
          background: `radial-gradient(ellipse at center, ${deck.coverStyle.gradientFrom} 0%, ${deck.coverStyle.gradientTo} 100%)`,
        }}
      >
        {/* Subtle Geometric Background Overlay */}
        <svg
          className="absolute inset-0 h-full w-full opacity-25 transition-transform duration-700 group-hover:scale-110"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id={`pattern-${deck.id}`}
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="#f5f2eb" fillOpacity="0.3" />
              <path
                d="M 24 0 L 0 24 M 0 0 L 24 24"
                fill="none"
                stroke="#f5f2eb"
                strokeWidth="0.3"
                strokeOpacity="0.15"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#pattern-${deck.id})`} />
        </svg>

        {/* Central Graphic Symbol & Glow */}
        <div className="relative z-10 flex flex-col items-center gap-2 text-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-sm border border-[rgba(245,242,235,0.15)] bg-[#090a0d]/70 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-[#ff5722]"
            style={{ color: deck.coverStyle.accentColor }}
          >
            <IconComponent className="h-7 w-7 transition-transform duration-500 group-hover:rotate-6" />
          </div>
          <span className="font-mono text-[10px] tracking-widest text-[#8c877d] uppercase">
            ARCHIVE № {deck.coverStyle.badgeNumber}
          </span>
        </div>

        {/* Slide Count Stamp */}
        <div className="absolute bottom-2.5 right-2.5 border border-[rgba(245,242,235,0.1)] bg-[#090a0d]/80 px-2 py-0.5 font-mono text-[10px] text-[#c7c3ba] backdrop-blur-sm">
          {deck.slideCount} SLIDES
        </div>

        {/* Hover Gradient Shine */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-transparent opacity-60" />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Deck Title */}
          <h3 className="font-editorial-title text-xl sm:text-2xl font-normal text-[#f5f2eb] transition-colors duration-300 group-hover:text-[#ff7043] leading-snug">
            {deck.title}
          </h3>

          {/* Subtitle / Punchline */}
          <p className="mt-1 font-mono text-xs text-[#ff5722] font-medium">
            {deck.subtitle}
          </p>

          {/* Description */}
          <p className="mt-2.5 text-xs text-[#9e9a91] line-clamp-2 leading-relaxed">
            {deck.description}
          </p>
        </div>

        {/* Tags, Metrics & Open Action */}
        <div className="mt-5 pt-3.5 border-t border-[rgba(245,242,235,0.06)]">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {deck.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="border border-[rgba(245,242,235,0.07)] bg-[#090a0d] px-2 py-0.5 font-mono text-[10px] text-[#8c877d]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Bottom Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1e222b] text-[10px] font-bold text-[#c7c3ba]">
                {deck.author.avatarText}
              </div>
              <span className="text-[11px] text-[#8c877d] truncate max-w-[130px]">
                {deck.author.name}
              </span>
            </div>

            {/* Open Action Indicator */}
            <div className="flex items-center gap-1 font-mono text-xs font-semibold text-[#f5f2eb] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#ff5722]">
              <span>Explorar</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
