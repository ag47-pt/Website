'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, AlertCircle } from 'lucide-react';
import {
  LabHero,
  LabCallCard,
  LabListRow,
  SitemapSearchFilter,
  InteractiveStatsBar,
  SitemapQuickPreviewModal,
  SitemapStatusWidget,
  ScrollToTopButton,
  FilterCategory,
  SortOption,
  ViewDensityMode,
} from './components';
import { ALL_SITEMAP_ITEMS, SitemapItem } from '@/data/ecosystem-sitemap';

const SORT_STORAGE_KEY = 'ag47_sitemap_sort_preference';
const VIEW_STORAGE_KEY = 'ag47_sitemap_view_mode';

export function LabsClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<ViewDensityMode>('grid_2');
  const [previewItem, setPreviewItem] = useState<SitemapItem | null>(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedSort = localStorage.getItem(SORT_STORAGE_KEY) as SortOption | null;
      if (savedSort && ['default', 'name_asc', 'name_desc', 'status'].includes(savedSort)) {
        setSortBy(savedSort);
      }
      const savedView = localStorage.getItem(VIEW_STORAGE_KEY) as ViewDensityMode | null;
      if (savedView && ['grid_2', 'grid_3', 'list'].includes(savedView)) {
        setViewMode(savedView);
      }
    } catch {
      // Ignore localStorage access errors
    }
  }, []);

  // Save sort preference to localStorage
  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    try {
      localStorage.setItem(SORT_STORAGE_KEY, newSort);
    } catch {
      // Ignore localStorage write errors
    }
  };

  // Save view mode to localStorage
  const handleViewModeChange = (newMode: ViewDensityMode) => {
    setViewMode(newMode);
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, newMode);
    } catch {
      // Ignore localStorage write errors
    }
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matched = ALL_SITEMAP_ITEMS.filter((item) => {
      // Filter by Category/Tag
      if (selectedFilter === 'labs_core' && item.category !== 'labs_core') return false;
      if (selectedFilter === 'ecosystem' && item.category !== 'ecosystem') return false;
      if (selectedFilter === 'live' && !item.status.includes('LIVE')) return false;
      if (
        selectedFilter === 'beta' &&
        !item.status.includes('BETA') &&
        !item.status.includes('EXPERIMENT')
      )
        return false;

      // Filter by Search Query
      if (!q) return true;

      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchPath = item.path.toLowerCase().includes(q);
      const matchStatus = item.status.toLowerCase().includes(q);
      const matchShort = item.shortName ? item.shortName.toLowerCase().includes(q) : false;

      return matchTitle || matchDesc || matchPath || matchStatus || matchShort;
    });

    if (sortBy === 'name_asc') {
      return [...matched].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === 'name_desc') {
      return [...matched].sort((a, b) => b.title.localeCompare(a.title));
    }
    if (sortBy === 'status') {
      return [...matched].sort((a, b) => a.status.localeCompare(b.status));
    }

    return matched;
  }, [searchQuery, selectedFilter, sortBy]);

  const labsCoreItems = useMemo(
    () => filteredItems.filter((i) => i.category === 'labs_core'),
    [filteredItems]
  );

  const ecosystemItems = useMemo(
    () => filteredItems.filter((i) => i.category === 'ecosystem'),
    [filteredItems]
  );

  // Statistics counts
  const totalCount = ALL_SITEMAP_ITEMS.length;
  const labsCoreCount = useMemo(
    () => ALL_SITEMAP_ITEMS.filter((i) => i.category === 'labs_core').length,
    []
  );
  const ecosystemCount = useMemo(
    () => ALL_SITEMAP_ITEMS.filter((i) => i.category === 'ecosystem').length,
    []
  );
  const liveCount = useMemo(
    () => ALL_SITEMAP_ITEMS.filter((i) => i.status.includes('LIVE')).length,
    []
  );
  const betaCount = useMemo(
    () =>
      ALL_SITEMAP_ITEMS.filter(
        (i) => i.status.includes('BETA') || i.status.includes('EXPERIMENT')
      ).length,
    []
  );

  const getContainerClassName = () => {
    if (viewMode === 'grid_3') {
      return 'grid sm:grid-cols-2 lg:grid-cols-3 gap-5';
    }
    if (viewMode === 'list') {
      return 'flex flex-col gap-3';
    }
    return 'grid md:grid-cols-2 gap-8';
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      <LabHero
        overline="INITIALIZING_LABS_CORE"
        overlineIcon={Terminal}
        title="O Futuro é"
        highlight="Experimental"
        description="Bem-vindo ao centro de **inovação** da Agência 47. Aqui, as fronteiras entre o **design e o código** se fundem para criar **experiências digitais** sem precedentes."
        statusTags={[
          { label: "Experimental_v0.47", color: "orange", pulse: true },
          { label: "Sandbox_Mode", color: "blue", pulse: true },
          { label: "Decentralized_Dev", color: "lime" }
        ]}
      />

      {/* Interactive Search & Filter Controls */}
      <section id="sitemap-controls" className="pt-2 scroll-mt-28">
        <SitemapSearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          totalCount={totalCount}
          filteredCount={filteredItems.length}
        />
      </section>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 text-center rounded-2xl bg-white/5 border border-white/10 space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white tracking-tight">Nenhum módulo encontrado</h4>
            <p className="text-xs text-gray-400 font-mono">
              Não encontramos resultados para a busca &quot;{searchQuery}&quot; com os filtros atuais.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono tracking-wider uppercase transition-all"
          >
            Limpar Filtros
          </button>
        </motion.div>
      )}

      {/* Section: Labs Core */}
      {labsCoreItems.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-gray-500">
              Labs_Core // Módulos Internos ({labsCoreItems.length})
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
          </div>
          <div className={getContainerClassName()}>
            <AnimatePresence mode="popLayout">
              {labsCoreItems.map((cat, index) => {
                const Icon = cat.icon;
                return (
                  <motion.div
                    key={cat.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    {viewMode === 'list' ? (
                      <LabListRow
                        title={cat.title}
                        description={cat.description}
                        path={cat.path}
                        icon={<Icon className="w-5 h-5" />}
                        status={cat.status}
                        category={cat.category}
                        onOpenPreview={() => setPreviewItem(cat)}
                      />
                    ) : (
                      <LabCallCard
                        title={cat.title}
                        description={cat.description}
                        path={cat.path}
                        icon={<Icon className="w-8 h-8" />}
                        status={cat.status}
                        onOpenPreview={() => setPreviewItem(cat)}
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Section: Ecossistema */}
      {ecosystemItems.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-gray-500">
              Ecossistema // Apps & Produtos ({ecosystemItems.length})
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
          </div>
          <div className={getContainerClassName()}>
            <AnimatePresence mode="popLayout">
              {ecosystemItems.map((cat, index) => {
                const Icon = cat.icon;
                return (
                  <motion.div
                    key={cat.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    {viewMode === 'list' ? (
                      <LabListRow
                        title={cat.title}
                        description={cat.description}
                        path={cat.path}
                        icon={<Icon className="w-5 h-5" />}
                        status={cat.status}
                        category={cat.category}
                        onOpenPreview={() => setPreviewItem(cat)}
                      />
                    ) : (
                      <LabCallCard
                        title={cat.title}
                        description={cat.description}
                        path={cat.path}
                        icon={<Icon className="w-8 h-8" />}
                        status={cat.status}
                        onOpenPreview={() => setPreviewItem(cat)}
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Interactive Stats Section */}
      <InteractiveStatsBar
        totalCount={totalCount}
        labsCoreCount={labsCoreCount}
        ecosystemCount={ecosystemCount}
        liveCount={liveCount}
        betaCount={betaCount}
        activeFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
        buildVersion="0.47.0-BETA"
        uptime="99.9%"
        latency="14ms"
      />

      {/* Quick Preview Modal */}
      <SitemapQuickPreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />

      {/* Floating Scroll To Top Button with Circular Progress */}
      <ScrollToTopButton />

      {/* Floating Telemetry & Protocol Status Widget */}
      <SitemapStatusWidget hubName="LABS_CORE" totalNodes={totalCount} />
    </div>
  );
}
