'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

// Design System Color Mapping for Status Tags
const STATUS_COLORS = {
  blue: '#0059ff',   // design-system-blue
  lime: '#D1FF00',   // design-system-lime
  orange: '#ffaa00', // design-system-orange
  main: '#ec4899',   // design-system (pink)
  red: '#FF0000'     // design-system-tomate
};

interface StatusTagProps {
  label: string;
  color: keyof typeof STATUS_COLORS;
  pulse?: boolean;
}

const StatusTag = ({ label, color, pulse = false }: StatusTagProps) => {
  const { setTheme } = useTheme();
  
  const handleThemeSwitch = () => {
    const themeMap: Record<string, string> = {
      blue: 'blue',
      lime: 'lime',
      orange: 'orange',
      main: 'default',
      red: 'tomate'
    };
    
    if (themeMap[color]) {
      setTheme(themeMap[color] as any);
    }
  };

  return (
    <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10 select-none">
      <div 
        className={`w-2 h-2 rounded-full cursor-pointer transition-transform hover:scale-125 ${pulse ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: STATUS_COLORS[color] }}
        onClick={handleThemeSwitch}
        title={`Ativar tema ${color}`}
      ></div>
      <span className="text-gray-300">{label}</span>
    </div>
  );
};

export default function AgentHero() {
  const { theme, themeContrast } = useTheme();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`/api/download-agent-dir`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ag47-agent-dir.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed', error);
    } finally {
      setDownloading(false);
    }
  };
  
  return (
    <div className="relative mb-12">
      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-4xl space-y-4">
          <div className="flex items-center gap-2 font-mono text-sm tracking-[0.2em]" style={{ color: theme.colors.primary }}>
            <Bot className="w-4 h-4" />
            <span>AGENT_HUB_CORE</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-white md:text-7xl mb-6 leading-tight">
            Inteligência <span className="px-3 py-1 rounded-lg" style={{ color: '#000', backgroundColor: theme.colors.primary }}>Artificial</span>
          </h1>
          <p className="text-lg leading-relaxed text-gray-400 max-w-2xl">
            Este é o <span className="text-white">Diretório de Agentes</span> da Agência 47. Cada agente é um especialista treinado com <span className="text-white">regras comportamentais</span> estritas, carregando um conjunto exclusivo de <span className="text-white font-mono">skills</span> para automatizar tarefas e <span className="text-white">arquiteturas complexas</span>.
          </p>
          <div className="flex flex-wrap gap-4 font-mono text-[10px] text-gray-500 uppercase pt-4">
            <StatusTag label="Autonomous_Entity" color="main" pulse />
            <StatusTag label="Behavioral_Strict" color="blue" />
            <StatusTag label="Skill_Ready" color="orange" />
          </div>
          
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <Link 
                href="/labs/ia/agent/skills" 
                className="rounded-full px-6 py-3 text-sm font-semibold shadow-sm transition-colors flex items-center gap-2 group"
                style={{ backgroundColor: theme.colors.primary, color: themeContrast }}
              >
                <span className="group-hover:opacity-80 transition-opacity flex items-center gap-2">
                  Explorar Diretório de Skills
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
              </Link>
              
              <Link
                href="/labs/dev/sandbox/ag47-designer-labs"
                className="rounded-full px-6 py-3 text-sm font-semibold transition-colors flex items-center gap-2 group border border-white/20 bg-white/5 hover:bg-white/10 text-white"
              >
                <span className="group-hover:opacity-80 transition-opacity flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  Baixar Diretório (.zip)
                </span>
              </Link>
            </div>
            
            <div className="text-sm font-semibold leading-6 text-white/70 flex items-center">
              Pasta Raiz: <code className="bg-white/5 px-2 py-1 rounded ml-2 font-mono text-xs" style={{ color: theme.colors.primary }}>.agent/agents/</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
