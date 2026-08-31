'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { CONTEXT_ROUTING_MODES } from '@/data/evopro';
import { 
  GitBranch, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  FolderGit2,
  FileCode,
  Lock,
  Cpu,
  Search
} from 'lucide-react';

export function ContextRoutingSection() {
  const { theme } = useTheme();
  const [selectedMode, setSelectedMode] = useState<string>('ADOPTED_MEMORY');

  return (
    <section id="context-routing" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            <GitBranch className="w-3.5 h-3.5" />
            TASK-BOUNDED CONTEXT ROUTING
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Context Router & Readiness Automática
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Em vez de despejar todo o repositório no contexto da LLM, o <strong>Context Router</strong> verifica e prepara índices candidatos e extrai apenas o pacote delimitado e estritamente relevante para a intenção ativa.
          </p>
        </div>

        {/* Router Flow Diagram */}
        <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl mb-12 font-mono text-xs">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-white font-bold">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Pipeline de Roteamento Contextual Delimitado</span>
            </div>
            <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ensure_router_index_ready() Ativo
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch mb-8">
            {/* Step 1: Intent */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">01. Intenção do Usuário</span>
                <div className="text-white font-bold mb-2">User Intent / Task</div>
                <p className="text-zinc-400 text-[11px] font-sans">
                  &ldquo;Refatorar autorização RBAC e corrigir permissões em Firestore&rdquo;
                </p>
              </div>
              <div className="mt-3 text-[10px] text-cyan-400">
                Input em linguagem natural
              </div>
            </div>

            {/* Step 2: Readiness & Candidates */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-cyan-500/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase block mb-1 font-bold">02. Index Readiness</span>
                <div className="text-white font-bold mb-2">Auto-Index Preparation</div>
                <p className="text-zinc-400 text-[11px] font-sans">
                  Verifica e gera índices JSON candidatos (domínios, contratos, riscos, decisões) a partir do Second Brain ou memória adotada.
                </p>
              </div>
              <div className="mt-3 text-[10px] text-cyan-300">
                .evolution/runtime/second-brain/
              </div>
            </div>

            {/* Step 3: Scored Selection */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-purple-500/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-purple-400 uppercase block mb-1 font-bold">03. Bounded Filter</span>
                <div className="text-white font-bold mb-2">Seleção Ponderada</div>
                <p className="text-zinc-400 text-[11px] font-sans">
                  Filtra domínios afetados, contratos de interface, riscos associados e referências primárias de ficheiros.
                </p>
              </div>
              <div className="mt-3 text-[10px] text-purple-300">
                Reduz ~75% do context bloat
              </div>
            </div>

            {/* Step 4: Bounded Pack Delivery */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-emerald-400 uppercase block mb-1 font-bold">04. Context Pack</span>
                <div className="text-emerald-300 font-bold mb-2">Bounded Delivery</div>
                <p className="text-zinc-300 text-[11px] font-sans">
                  Entrega à LLM o pacote com referências exatas no disco, modo de routing e governança ativada.
                </p>
              </div>
              <div className="mt-3 text-[10px] text-emerald-400 font-bold">
                Pronto para ação segura
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/80 border border-zinc-800 text-[11px] text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              <strong>Regra de Ouro do Router:</strong> O Context Router é recuperação e foco, não validação. Mudanças no código continuam a exigir testes e o Gauntlet.
            </span>
            <code className="text-cyan-400 shrink-0">evolution second-brain route &quot;&lt;task&gt;&quot;</code>
          </div>
        </div>

        {/* 5 Explicit Routing Modes Showcase */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-mono">
              Os 5 Modos Explícitos de Routing
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans mt-1">
              O router nunca adivinha: ele opera sob modos formais e declara o seu estado com precisão epistemológica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {CONTEXT_ROUTING_MODES.map((item) => (
              <div 
                key={item.mode}
                className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 backdrop-blur-xl flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${item.badgeClass}`}>
                      {item.mode}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs mb-2">{item.title}</h4>
                  <p className="text-zinc-400 text-[11px] font-sans leading-relaxed mb-3">
                    {item.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-zinc-900 text-[10px] text-zinc-500">
                  <span className="text-zinc-400 font-semibold">Quando ativa:</span> {item.when}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
