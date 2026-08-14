'use client';

import React, { useEffect, useRef } from 'react';
import {
  Search,
  X,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  Grid3X3,
  List,
  SlidersHorizontal,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { playClickSound } from '@/lib/audio/sound-fx';

export type FilterCategory = 'all' | 'labs_core' | 'ecosystem' | 'live' | 'beta';
export type SortOption = 'default' | 'name_asc' | 'name_desc' | 'status';
export type ViewDensityMode = 'grid_2' | 'grid_3' | 'list';

interface SitemapSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: FilterCategory;
  onFilterChange: (filter: FilterCategory) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewDensityMode;
  onViewModeChange: (mode: ViewDensityMode) => void;
  totalCount: number;
  filteredCount: number;
}

export function SitemapSearchFilter({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
}: SitemapSearchFilterProps) {
  const { theme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcut Listener (Cmd+K / Ctrl+K / '/')
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isInputActive =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      } else if (e.key === '/' && !isInputActive) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filterOptions: { id: FilterCategory; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'labs_core', label: 'Labs Core' },
    { id: 'ecosystem', label: 'Ecossistema' },
    { id: 'live', label: 'Ao Vivo' },
    { id: 'beta', label: 'Beta' },
  ];

  const sortOptions: { id: SortOption; label: string }[] = [
    { id: 'default', label: 'Padrão' },
    { id: 'name_asc', label: 'A-Z' },
    { id: 'name_desc', label: 'Z-A' },
    { id: 'status', label: 'Status' },
  ];

  const viewModes: { id: ViewDensityMode; label: string; icon: React.ReactNode }[] = [
    { id: 'grid_2', label: '2 Colunas', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { id: 'grid_3', label: '3 Colunas', icon: <Grid3X3 className="w-3.5 h-3.5" /> },
    { id: 'list', label: 'Lista Técnica', icon: <List className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquisar módulo, rota, status ou tecnologia..."
            className="w-full pl-11 pr-24 py-3 rounded-2xl bg-white/5 hover:bg-white/[0.08] focus:bg-black/80 border border-white/10 focus:border-white/30 text-white placeholder-gray-500 text-xs tracking-wider font-mono outline-none transition-all duration-300 backdrop-blur-md"
          />

          {/* Right Action Icons & KBD Shortcut Badge */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  inputRef.current?.focus();
                }}
                className="pointer-events-auto w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                aria-label="Limpar pesquisa"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-white/10 border border-white/10 text-[9px] font-mono text-gray-400 select-none">
                <span className="text-[10px]">⌘</span>K
              </kbd>
            )}
          </div>
        </div>

        {/* Right Controls: View Density + Counter Badge */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {/* Density Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
            {viewModes.map((mode) => {
              const isSelected = viewMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    playClickSound();
                    onViewModeChange(mode.id);
                  }}
                  title={`Visualização: ${mode.label}`}
                  className={`p-1.5 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {mode.icon}
                </button>
              );
            })}
          </div>

          {/* Counter Badge */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400 shrink-0">
            <span className="text-white font-bold">{filteredCount}</span>
            <span className="text-gray-600">/</span>
            <span>{totalCount} MÓDULOS</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Sort Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <div className="flex items-center gap-1.5 mr-1.5 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            <Filter className="w-3 h-3" />
            <span>Filtro:</span>
          </div>
          {filterOptions.map((opt) => {
            const isActive = selectedFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  playClickSound();
                  onFilterChange(opt.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold tracking-wider uppercase transition-all duration-300 border ${
                  isActive
                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105'
                    : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:border-white/15 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <div className="flex items-center gap-1.5 mr-1.5 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            <ArrowUpDown className="w-3 h-3" />
            <span>Ordem:</span>
          </div>
          {sortOptions.map((opt) => {
            const isActive = sortBy === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onSortChange(opt.id)}
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-medium tracking-wider uppercase transition-all duration-300 border ${
                  isActive
                    ? 'bg-white/20 text-white border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.15)] font-bold'
                    : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:border-white/15 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
