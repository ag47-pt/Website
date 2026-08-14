'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { usePageScroll } from '@/hooks/usePageScroll';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';
import { TokenInspectionDrawer } from '@/components/ui/TokenInspectionDrawer';
import { LiveTokenItem } from '@/hooks/useAltRadarStream';

import { AltRadarNavbar } from './components/AltRadarNavbar';
import { AltRadarHero } from './components/AltRadarHero';
import { ProblemComparison } from './components/ProblemComparison';
import { RadarPipelineCycle } from './components/RadarPipelineCycle';
import { SecurityAuditSection } from './components/SecurityAuditSection';
import { ScoringFormulaSection } from './components/ScoringFormulaSection';
import { TerminalInteractive } from './components/TerminalInteractive';
import { LiveStreamSection } from './components/LiveStreamSection';
import { CliReference } from './components/CliReference';
import { CapabilityMatrix } from './components/CapabilityMatrix';
import { ArchitectureSection } from './components/ArchitectureSection';
import { QuickStart } from './components/QuickStart';
import { UseCasesSection } from './components/UseCasesSection';
import { StatusAndRoadmap } from './components/StatusAndRoadmap';
import { GitHubEcosystemCTA } from './components/GitHubEcosystemCTA';
import { AltRadarFooter } from './components/AltRadarFooter';
import { AltRadarPitchDeck } from './components/AltRadarPitchDeck';

import { 
  Grid, 
  Eye, 
  Presentation, 
  Radio, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  ChevronUp,
  Gauge
} from 'lucide-react';

export default function AltRadarClient() {
  const { theme } = useTheme();
  const scrollOffset = usePageScroll();
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isOledMode, setIsOledMode] = useState<boolean>(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState<boolean>(false);
  const [inspectedToken, setInspectedToken] = useState<LiveTokenItem | null>(null);

  const displayPercent = Math.round(
    theme.branding.startingPercent + scrollOffset * (100 - theme.branding.startingPercent)
  );

  const sections = [
    'overview',
    'problem',
    'pipeline',
    'security',
    'scoring',
    'terminal-demo',
    'stream-feed',
    'cli',
    'capabilities',
    'architecture',
    'quickstart',
    'use-cases',
    'status',
    'ecosystem'
  ];

  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  return (
    <div className="bg-black text-white selection:bg-emerald-500 selection:text-black font-sans relative">
      {/* Reset Canónico de Scrollbar Única EvoPro */}
      <style>{`
        :root {
          --primary-color: ${theme.colors.primary};
          --secondary-color: ${theme.colors.secondary};
          --accent-color: ${theme.colors.accent};
          --highlight-color: ${theme.colors.highlight};
        }
        /* Alt Radar EvoPro: html é o ÚNICO container de rolagem */
        html {
          height: auto !important;
          min-height: 0 !important;
          overflow-x: hidden !important;
          overflow-y: scroll !important;
          display: block !important;
          scroll-behavior: smooth;
        }
        /* Body nunca deve gerar barra de rolagem própria */
        body {
          height: auto !important;
          min-height: auto !important;
          overflow: visible !important;
          display: block !important;
          margin: 0;
          padding: 0;
        }
        body::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
        }
        body {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        ::selection {
          background-color: ${theme.colors.primary};
          color: black;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        /* Custom Scrollbar elegante estritamente no root */
        html::-webkit-scrollbar {
          width: 8px;
        }
        html::-webkit-scrollbar-track {
          background: #000000;
        }
        html::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 9999px;
          border: 2px solid #000000;
        }
        html::-webkit-scrollbar-thumb:hover {
          background: #52525b;
        }
      `}</style>

      {/* Blueprint Grid Background (Comutável no Tactical HUD) */}
      {!isOledMode && (
        <div className="fixed inset-0 z-0 opacity-15 pointer-events-none transition-opacity duration-500">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:200px_200px] border-l border-t border-zinc-900" />
        </div>
      )}

      {/* Ambient Nebula Background com Parallax */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[140px] transition-transform duration-75 ease-out"
          style={{ 
            backgroundColor: theme.colors.primary,
            transform: `translateY(${scrollOffset * -80}px)`
          }}
        />
        <div 
          className="absolute top-[40%] right-[-10%] w-[45%] h-[45%] rounded-full opacity-15 blur-[160px] bg-emerald-500 transition-transform duration-75 ease-out"
          style={{ 
            transform: `translateY(${scrollOffset * 60}px)`
          }}
        />
        <div 
          className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full opacity-15 blur-[150px] bg-cyan-600 transition-transform duration-75 ease-out"
          style={{ 
            transform: `translateY(${scrollOffset * -40}px)`
          }}
        />
      </div>

      {/* Marcador Magnético Lateral (Desktop 2XL) */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden 2xl:flex flex-col items-center gap-2.5 bg-zinc-950/80 p-2.5 rounded-full border border-zinc-800/80 backdrop-blur-xl shadow-2xl">
        {sections.map((secId) => {
          const isActive = activeSection === secId;
          return (
            <button
              key={secId}
              onClick={() => {
                const el = document.getElementById(secId);
                if (el) {
                  const yOffset = -90;
                  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="group relative flex items-center cursor-pointer"
              title={`Ir para ${secId}`}
            >
              <div 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'scale-150 shadow-lg' 
                    : 'bg-zinc-700 hover:bg-zinc-400'
                }`}
                style={{
                  backgroundColor: isActive ? theme.colors.primary : undefined,
                  boxShadow: isActive ? `0 0 10px ${theme.colors.primary}` : undefined
                }}
              />
              <span className="absolute left-6 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                {secId}
              </span>
            </button>
          );
        })}
      </div>

      {/* Top Navbar */}
      <AltRadarNavbar activeSection={activeSection} />

      {/* Main Page Layout Sections */}
      <main className="relative z-10">
        <AltRadarHero />
        <ProblemComparison />
        <RadarPipelineCycle />
        <SecurityAuditSection />
        <ScoringFormulaSection />
        <TerminalInteractive />
        <LiveStreamSection onInspectToken={(token) => setInspectedToken(token)} />
        <CliReference />
        <CapabilityMatrix />
        <ArchitectureSection />
        <QuickStart />
        <UseCasesSection />
        <StatusAndRoadmap />
        <GitHubEcosystemCTA />
      </main>

      {/* Footer */}
      <AltRadarFooter />

      {/* Tactical Bottom HUD */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-zinc-950/90 border border-zinc-800/80 p-2 rounded-2xl backdrop-blur-xl shadow-2xl font-mono text-xs">
        {/* Ir para Dashboard App */}
        <Link
          href="/eco/alt-radar?tab=dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold hover:bg-emerald-500/25 transition-all cursor-pointer shadow-md"
          title="Abrir Dashboard Operacional da Plataforma"
        >
          <Gauge className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Dashboard App</span>
        </Link>

        {/* OLED Pure / Grid Toggle */}
        <button
          onClick={() => setIsOledMode(!isOledMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
            isOledMode 
              ? 'bg-zinc-800 text-white font-bold border border-zinc-700' 
              : 'text-zinc-400 hover:text-white'
          }`}
          title={isOledMode ? 'Desativar Modo OLED Pure' : 'Ativar Modo OLED Pure (Preto Absoluto)'}
        >
          <Grid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isOledMode ? 'OLED' : 'Grid'}</span>
        </button>

        {/* Pitch Deck Presentation Toggle */}
        <button
          onClick={() => setIsPitchDeckOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all cursor-pointer"
          title="Abrir Pitch Deck"
        >
          <Presentation className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Deck</span>
        </button>

        {/* Reading Progress Counter */}
        <div className="px-3 py-1.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 flex items-center gap-1.5 tabular-nums">
          <span className="text-zinc-500">Progresso:</span>
          <span 
            className="font-bold text-white"
            style={{ color: theme.colors.primary }}
          >
            {displayPercent}%
          </span>
        </div>
      </div>

      {/* Pitch Deck Modal */}
      <AltRadarPitchDeck 
        isOpen={isPitchDeckOpen} 
        onClose={() => setIsPitchDeckOpen(false)} 
      />

      {/* Token Inspection Drawer */}
      {inspectedToken && (
        <TokenInspectionDrawer 
          token={inspectedToken} 
          onClose={() => setInspectedToken(null)} 
        />
      )}
    </div>
  );
}
