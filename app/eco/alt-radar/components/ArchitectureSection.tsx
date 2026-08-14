'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  GitBranch, 
  Cpu, 
  Server, 
  Database, 
  Radio, 
  ShieldCheck, 
  ArrowDown, 
  Layers,
  Network
} from 'lucide-react';

export function ArchitectureSection() {
  const { theme } = useTheme();

  const layers = [
    {
      title: '1. Ingestion & Node RPC Pool',
      icon: Server,
      tech: 'Jito MEV + Helius + Alchemy Nodes',
      desc: 'Pool de conexões WebSocket de baixa latência consumindo blocos e eventos de criação de pools AMM/CLMM diretamente na camada base.'
    },
    {
      title: '2. Sandbox Bytecode Execution Engine',
      icon: ShieldCheck,
      tech: 'Rust Core Microservice',
      desc: 'Mecanismo ultra-rápido isolado que executa simulação transacional de compra e venda contra o bytecode para detecção de honeypots.'
    },
    {
      title: '3. On-Chain Graph & Cluster Profiler',
      icon: Network,
      tech: 'Graph Intelligence & Wallet Indexer',
      desc: 'Mapeamento de carteiras sniper e histórico de funding para identificar conexões ocultas entre criadores de tokens e compradores iniciais.'
    },
    {
      title: '4. Scoring & Risk Synthesis Kernel',
      icon: Cpu,
      tech: 'Deterministic Python & Rust Engine',
      desc: 'Cálculo determinístico do Score AG47 (0-100) ponderando contratos, liquidez, holders e dinâmica orgânica de mercado.'
    },
    {
      title: '5. Event Bus & Real-Time Streaming',
      icon: Radio,
      tech: 'Redis Pub/Sub + WebSocket Daemon',
      desc: 'Despacho com latência sub-100ms para webhooks de usuários, bots de automação e interface Web Next.js.'
    }
  ];

  return (
    <section id="architecture" className="relative py-20 md:py-32 overflow-hidden border-t border-zinc-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold mb-4 border"
            style={{ 
              backgroundColor: `${theme.colors.primary}10`,
              borderColor: `${theme.colors.primary}30`,
              color: theme.colors.primary 
            }}
          >
            <GitBranch className="w-3.5 h-3.5" />
            ARQUITETURA CORE & ENGINE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Construído para ultra-baixa latência
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Uma pilha de engenharia distribuída e modular, pronta para processar milhares de eventos por segundo sem degradar a precisão da auditoria.
          </p>
        </div>

        {/* Stack Layers Architecture Cards */}
        <div className="max-w-4xl mx-auto space-y-4">
          {layers.map((layer, idx) => {
            const Icon = layer.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-xl hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="p-3 rounded-2xl border shrink-0 transition-transform group-hover:scale-105"
                    style={{ 
                      backgroundColor: `${theme.colors.primary}10`,
                      borderColor: `${theme.colors.primary}30`,
                      color: theme.colors.primary 
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{layer.title}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                        {layer.tech}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                      {layer.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 font-bold">
                    OPERACIONAL
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
