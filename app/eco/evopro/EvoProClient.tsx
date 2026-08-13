'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { usePageScroll } from '@/hooks/usePageScroll';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';
import { EvoNavbar } from './components/EvoNavbar';
import { EvoHero } from './components/EvoHero';
import { ProblemComparison } from './components/ProblemComparison';
import { EvolutionCycle } from './components/EvolutionCycle';
import { ChangeVsEvolution } from './components/ChangeVsEvolution';
import { GauntletSection } from './components/GauntletSection';
import { JudgeSection } from './components/JudgeSection';
import { GlobalGoalSection } from './components/GlobalGoalSection';
import { DeterministicVsCognitive } from './components/DeterministicVsCognitive';
import { HostModelSection } from './components/HostModelSection';
import { HarnessIndependence } from './components/HarnessIndependence';
import { ContinuityFlow } from './components/ContinuityFlow';
import { ExecutionModes } from './components/ExecutionModes';
import { GraphIntelligence } from './components/GraphIntelligence';
import { QuickStart } from './components/QuickStart';
import { TerminalInteractive } from './components/TerminalInteractive';
import { IdeChatFlow } from './components/IdeChatFlow';
import { CliReference } from './components/CliReference';
import { CapabilityMatrix } from './components/CapabilityMatrix';
import { GuardrailsSection } from './components/GuardrailsSection';
import { ObservabilitySection } from './components/ObservabilitySection';
import { UseCasesSection } from './components/UseCasesSection';
import { StatusAndRoadmap } from './components/StatusAndRoadmap';
import { GitHubEcosystemCTA } from './components/GitHubEcosystemCTA';
import { EvoFooter } from './components/EvoFooter';

export default function EvoProClient() {
  const { theme } = useTheme();
  const scrollOffset = usePageScroll();
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isOledMode, setIsOledMode] = useState<boolean>(false);

  const displayPercent = Math.round(
    theme.branding.startingPercent + scrollOffset * (100 - theme.branding.startingPercent)
  );

  const sections = [
    'overview',
    'problem',
    'lifecycle',
    'baseline',
    'gauntlet',
    'judge',
    'goal',
    'architecture',
    'host-model',
    'harnesses',
    'continuity',
    'modes',
    'graph',
    'quickstart',
    'terminal-demo',
    'ide-chat',
    'cli',
    'capabilities',
    'guardrails',
    'observability',
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
      <style>{`
        :root {
          --primary-color: ${theme.colors.primary};
          --secondary-color: ${theme.colors.secondary};
          --accent-color: ${theme.colors.accent};
          --highlight-color: ${theme.colors.highlight};
        }
        /* EvoPro: html is the ONLY scroll container */
        html {
          height: auto !important;
          min-height: 0 !important;
          overflow-x: hidden !important;
          overflow-y: scroll !important;
          display: block !important;
          scroll-behavior: smooth;
        }
        /* Body must NEVER generate its own scrollbar */
        body {
          height: auto !important;
          min-height: auto !important;
          overflow: visible !important;
          display: block !important;
          margin: 0;
          padding: 0;
        }
        /* Kill body scrollbar explicitly in all browsers */
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
        /* Single Sleek Custom Scrollbar strictly for html */
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

      {/* Blueprint Grid Background (Desativado no modo OLED Pure) */}
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
          className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full opacity-15 blur-[150px] bg-purple-600 transition-transform duration-75 ease-out"
          style={{ 
            transform: `translateY(${scrollOffset * -40}px)`
          }}
        />
      </div>

      {/* Marcador Magnético de Posição Lateral (Desktop 2XL) */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden 2xl:flex flex-col items-center gap-2.5 bg-zinc-950/80 p-2.5 rounded-full border border-zinc-800/80 backdrop-blur-xl shadow-2xl">
        {sections.map((secId) => {
          const isActive = activeSection === secId;
          return (
            <button
              key={secId}
              onClick={() => {
                const el = document.getElementById(secId);
                if (el) {
                  const yOffset = -100;
                  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="group relative flex items-center cursor-pointer"
              title={`Ir para ${secId}`}
            >
              <div 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive ? 'scale-150 shadow-lg' : 'bg-zinc-700 hover:bg-zinc-400'
                }`}
                style={isActive ? { backgroundColor: theme.colors.primary, boxShadow: `0 0 10px ${theme.colors.primary}` } : {}}
              />
              <span className="absolute left-6 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                {secId}
              </span>
            </button>
          );
        })}
      </div>

      {/* Top Navbar & Progress Bar */}
      <EvoNavbar activeSection={activeSection} />
      <ScrollProgressBar />

      {/* Main Content Layers */}
      <main className="relative z-10">
        <EvoHero />
        <ProblemComparison />
        <EvolutionCycle />
        <ChangeVsEvolution />
        <GauntletSection />
        <JudgeSection />
        <GlobalGoalSection />
        <DeterministicVsCognitive />
        <HostModelSection />
        <HarnessIndependence />
        <ContinuityFlow />
        <ExecutionModes />
        <GraphIntelligence />
        <QuickStart />
        <TerminalInteractive />
        <IdeChatFlow />
        <CliReference />
        <CapabilityMatrix />
        <GuardrailsSection />
        <ObservabilitySection />
        <UseCasesSection />
        <StatusAndRoadmap />
        <GitHubEcosystemCTA />
      </main>

      {/* Footer */}
      <EvoFooter />

      {/* Controles Flutuantes: OLED Mode & Percentual de Scroll */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-3 bg-zinc-950/90 p-2 rounded-2xl border border-zinc-800/80 backdrop-blur-xl shadow-2xl font-mono text-xs">
        <button
          onClick={() => setIsOledMode(!isOledMode)}
          className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold border transition-all cursor-pointer ${
            isOledMode 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
          }`}
          title="Alternar entre modo Grid e OLED Preto Puro"
        >
          {isOledMode ? 'OLED PURE' : 'GRID BACKDROP'}
        </button>

        <div className="flex items-baseline gap-0.5 px-2 font-mono">
          <span className="text-xl font-black text-white tabular-nums">
            {displayPercent}
          </span>
          <span style={{ color: theme.colors.primary }} className="text-xs font-black">
            %
          </span>
        </div>
      </div>
    </div>
  );
}
