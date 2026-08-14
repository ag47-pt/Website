"use client";

import React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { CATEGORIES, STATUS_OPTIONS } from "../data";
import { DeckCategory, DeckStatus } from "../types";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: DeckCategory;
  onCategoryChange: (category: DeckCategory) => void;
  selectedStatus: DeckStatus;
  onStatusChange: (status: DeckStatus) => void;
  totalFiltered: number;
  totalAll: number;
  onResetFilters: () => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  totalFiltered,
  totalAll,
  onResetFilters,
}: FilterBarProps) {
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "Todas" ||
    selectedStatus !== "Todos";

  return (
    <div
      id="mural-decks"
      className="sticky top-[61px] z-30 w-full border-b border-[rgba(245,242,235,0.08)] bg-[#090a0d]/95 backdrop-blur-md py-4"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3.5">
        {/* Row 1: Search Input & Status Selector */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8c877d]">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por título, tema, autor ou tag (ex: DODU, IA, Branding)..."
              className="w-full border border-[rgba(245,242,235,0.12)] bg-[#12141a] pl-10 pr-9 py-2.5 text-xs text-[#f5f2eb] placeholder-[#64615a] transition-all focus:border-[#ff5722] focus:bg-[#161922] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#8c877d] hover:text-[#f5f2eb]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8c877d] mr-1">
              <SlidersHorizontal className="h-3 w-3 text-[#ff5722]" />
              <span>STATUS:</span>
            </div>

            {STATUS_OPTIONS.map((status) => {
              const isSelected = selectedStatus === status.id;
              return (
                <button
                  key={status.id}
                  onClick={() => onStatusChange(status.id as DeckStatus)}
                  className={`px-3 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "border border-[#ff5722] bg-[#ff5722]/15 text-[#ff7043]"
                      : "border border-[rgba(245,242,235,0.08)] bg-[#12141a] text-[#9e9a91] hover:border-[rgba(245,242,235,0.18)] hover:text-[#f5f2eb]"
                  }`}
                >
                  {status.label}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 border border-dashed border-[rgba(245,242,235,0.2)] px-2.5 py-1.5 text-xs text-[#8c877d] hover:border-[#ff5722] hover:text-[#ff7043] transition-colors"
                title="Limpar todos os filtros"
              >
                <X className="h-3 w-3" />
                <span>Limpar</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Category Filters Tabs & Live Count */}
        <div className="flex flex-col gap-3 border-t border-[rgba(245,242,235,0.06)] pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-nowrap overflow-x-auto pb-1 sm:pb-0 gap-1.5 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.id as DeckCategory)}
                  className={`whitespace-nowrap px-3.5 py-1 text-xs transition-all ${
                    isSelected
                      ? "bg-[#f5f2eb] font-semibold text-[#090a0d] shadow-sm"
                      : "bg-transparent text-[#9e9a91] hover:bg-[#12141a] hover:text-[#f5f2eb]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#8c877d] shrink-0">
            <span>EXIBINDO:</span>
            <span className="text-[#f5f2eb] font-semibold">
              {totalFiltered} de {totalAll}
            </span>
            <span>PROJETOS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
