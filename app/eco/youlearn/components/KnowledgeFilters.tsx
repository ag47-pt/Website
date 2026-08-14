'use client';

import React from 'react';
import { Filter, RotateCcw, Sparkles } from 'lucide-react';

interface KnowledgeFiltersProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedDifficulty: string;
  onSelectDifficulty: (diff: string) => void;
  selectedProgress: string;
  onSelectProgress: (progress: string) => void;
  featuredOnly: boolean;
  onToggleFeatured: () => void;
  onReset: () => void;
  resultCount: number;
}

export function KnowledgeFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedDifficulty,
  onSelectDifficulty,
  selectedProgress,
  onSelectProgress,
  featuredOnly,
  onToggleFeatured,
  onReset,
  resultCount,
}: KnowledgeFiltersProps) {
  const isFiltered = selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedProgress !== 'All' || featuredOnly;

  return (
    <div className="mb-8 space-y-4">
      {/* Category Pills Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#D1FF00] text-black shadow-[0_0_15px_rgba(209,255,0,0.25)]'
                    : 'border border-white/10 bg-zinc-900/60 text-zinc-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Secondary Toggles & Reset */}
        <div className="flex items-center gap-2">
          {/* Featured Toggle */}
          <button
            onClick={onToggleFeatured}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              featuredOnly
                ? 'border border-[#D1FF00]/40 bg-[#D1FF00]/15 text-[#D1FF00]'
                : 'border border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-3 w-3" />
            <span>Featured</span>
          </button>

          {/* Progress Status Filter */}
          <div className="flex items-center rounded-lg border border-white/10 bg-zinc-900/60 p-0.5 text-xs">
            {[
              { key: 'All', label: 'Todos' },
              { key: 'notStarted', label: 'Não Iniciados' },
              { key: 'inProgress', label: 'Em Progresso' },
              { key: 'completed', label: 'Concluídos' }
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => onSelectProgress(p.key)}
                className={`rounded px-2 py-1 text-[11px] transition-all ${
                  selectedProgress === p.key
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown / Selector */}
          <div className="flex items-center rounded-lg border border-white/10 bg-zinc-900/60 p-0.5 text-xs">
            {['All', 'beginner', 'intermediate', 'advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => onSelectDifficulty(diff)}
                className={`rounded px-2 py-1 text-[11px] capitalize transition-all ${
                  selectedDifficulty.toLowerCase() === diff.toLowerCase()
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {diff === 'All' ? 'Any Level' : diff}
              </button>
            ))}
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-[#D1FF00] transition-colors p-1"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Result Count and active filters notice */}
      <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
        <div>
          Showing <span className="font-bold text-zinc-300">{resultCount}</span> learning experience
          {resultCount === 1 ? '' : 's'}
        </div>
      </div>
    </div>
  );
}
