'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  GitFork, 
  Terminal, 
  Laptop, 
  Cpu, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { CompatibilityMatrixInteractive } from './CompatibilityMatrixInteractive';

export function HarnessIndependence() {
  const { theme } = useTheme();

  const harnesses = [
    { name: 'Codex / OpenAI', category: 'Cloud Agent', status: 'Compatível via Handoff & CLI', icon: Terminal },
    { name: 'Claude Code', category: 'CLI Agent', status: 'Compatível via Handoff & CLI', icon: Laptop },
    { name: 'Antigravity', category: 'IDE Assistant', status: 'Suportado / Adaptador Detectado', icon: Sparkles },
    { name: 'VS Code Copilot', category: 'IDE Extension', status: 'Compatível por Contrato', icon: Layers },
    { name: 'Modelos Locais (Ollama/vLLM)', category: 'Local Host', status: 'Zero Dependência Externa', icon: Cpu },
    { name: 'Harnesses Futuros', category: 'Future Engine', status: 'Compatível por Ficheiro de Handoff', icon: GitFork }
  ];

  return (
    <section id="harnesses" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
            <GitFork className="w-3.5 h-3.5" />
            HARNESS & MODEL AGNOSTIC
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Independência de Ferramentas
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            O EvoPro não depende da personalidade, do prompt de sistema ou da interface do agente. O projeto preserva o estado, o objetivo, o histórico e os contratos — o modelo atua como executor cognitivo intercambiável.
          </p>
        </div>

        {/* Matriz Interativa de Compatibilidade de Harnesses & Modelos */}
        <CompatibilityMatrixInteractive />

        {/* Central Core & Harness Spokes Visual */}
        <div className="rounded-3xl bg-zinc-950/80 border border-zinc-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl mb-12">
          <div className="text-center max-w-lg mx-auto mb-8 font-mono">
            <div className="inline-block p-4 rounded-2xl bg-zinc-900 border border-white/20 shadow-xl mb-2">
              <span className="text-xs text-zinc-400 uppercase tracking-widest block mb-1">Núcleo Central</span>
              <div className="text-xl font-black text-white">EVOPRO KERNEL</div>
              <span className="text-[11px] text-emerald-400">Contratos • Schemas • Continuidade</span>
            </div>
            <div className="h-6 w-[1px] bg-zinc-700 mx-auto" />
            <div className="text-xs text-zinc-500">Interface de Handoff Universal</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {harnesses.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.name}
                  className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-purple-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white tracking-tight">{item.name}</h4>
                      <span className="text-[10px] text-zinc-500">{item.category}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">{item.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Core Adapter Philosophy */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 font-mono text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
            <span>
              <strong>Arquitetura Extensível:</strong> O Core nunca contém regras do tipo <em>&ldquo;se for a ferramenta X faça Y&rdquo;</em>. Adicionar suporte a um novo agente requer apenas um adaptador sem alterar o Kernel.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
