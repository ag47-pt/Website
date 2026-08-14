'use client';

import React from 'react';
import { SearchX, RotateCcw, Sparkles } from 'lucide-react';

interface LibraryEmptyStateProps {
  query?: string;
  category?: string;
  onReset: () => void;
}

export function LibraryEmptyState({ query, category, onReset }: LibraryEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-zinc-950/60 p-12 text-center backdrop-blur-md my-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/80 text-zinc-400 mb-4">
        <SearchX className="h-8 w-8 text-zinc-500" />
      </div>

      <h3 className="text-xl font-bold text-white tracking-tight">No knowledge objects matched your criteria</h3>

      <p className="mt-2 max-w-md text-sm text-zinc-400">
        {query ? (
          <>
            No results found for <span className="text-[#D1FF00] font-mono">"{query}"</span>
            {category && category !== 'All' ? ` in category "${category}"` : ''}.
          </>
        ) : (
          `No content currently published in category "${category}".`
        )}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl bg-[#D1FF00] px-4 py-2 text-xs font-bold text-black hover:bg-[#b8e000] transition-all"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Search & Filters</span>
        </button>
      </div>
    </div>
  );
}
