'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ROADMAP_ITEMS, KNOWN_LIMITATIONS_DATA } from '@/data/evopro';
import { 
  CheckCircle2, 
  FlaskConical, 
  Clock, 
  AlertTriangle, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  Search,
  Activity,
  GitBranch
} from 'lucide-react';

export function StatusAndRoadmap() {
  const { theme } = useTheme();
  const [tab, setTab] = useState<'status' | 'roadmap'>('status');

  return (
    <section id="status" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
            <CheckCircle2 className="w-3.5 h-3.5" />
            TRANSPARÊNCIA TOTAL & EVOLUÇÃO CONTÍNUA
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Maturidade Atual, Limitações & Roadmap
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Credibilidade exige rigor. Documentamos explicitamente o que está validado, as limitações conhecidas, os portões de validação ativos e as próximas etapas de engenharia.
          </p>

          {/* Toggle Tab */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800 mt-6 font-mono text-xs">
            <button
              onClick={() => setTab('status')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                tab === 'status' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Maturidade & Limitações Conhecidas
            </button>
            <button
              onClick={() => setTab('roadmap')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                tab === 'roadmap' ? 'bg-zinc-800 text-emerald-400 font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Roadmap de Engenharia & Portões
            </button>
          </div>
        </div>

        {tab === 'status' ? (
          <div className="space-y-8 font-mono text-xs">
            {/* Available vs Validation Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ready & Validated Now */}
              <div className="p-6 rounded-3xl bg-zinc-950 border border-emerald-500/30 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm pb-3 mb-4 border-b border-zinc-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>VALIDADO EM HOST REAL (v0.3.1)</span>
                </div>
                <ul className="space-y-2.5 text-zinc-300 font-sans text-xs">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold font-mono">✓</span>
                    <span><strong>Adoção de Memória Soberana:</strong> Indexação de <code className="text-emerald-300">evolution/</code> em modo leitura restrita sem mutação.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold font-mono">✓</span>
                    <span><strong>Context Router com Auto-Readiness:</strong> Preparação automática de índices e 5 modos explícitos de roteamento contextual.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold font-mono">✓</span>
                    <span><strong>Telemetria de Amortização Fail-Open:</strong> Registo de duração, tokens estimados e reuso cognitivo comprovado no disco.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold font-mono">✓</span>
                    <span><strong>Interação Agent-First:</strong> Execução conversacional onde o agente seleciona e opera ferramentas com segurança.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold font-mono">✓</span>
                    <span><strong>Gauntlet Adversarial & Judge:</strong> 9 críticos determinísticos e vereditos ordenados (ACCEPT, REVISE, ROLLBACK, BLOCKED).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold font-mono">✓</span>
                    <span><strong>Grafo AST sem Dependências Pesadas:</strong> Indexação em Python stdlib AST e cálculo de raio de impacto.</span>
                  </li>
                </ul>
              </div>

              {/* Active Validation Gate */}
              <div className="p-6 rounded-3xl bg-zinc-950 border border-cyan-500/30 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm pb-3 mb-4 border-b border-zinc-800">
                  <Activity className="w-4 h-4" />
                  <span>PORTÃO ATIVO: VALIDAÇÃO MULTI-HOST</span>
                </div>
                <ul className="space-y-2.5 text-zinc-300 font-sans text-xs">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold font-mono">⚡</span>
                    <span><strong>Telemetria a Nível de Interação:</strong> Evolução da instrumentação de fases internas para modelo de amortização de diálogos multi-turno completos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold font-mono">⚡</span>
                    <span><strong>Pilotos em Múltiplos Ecossistemas:</strong> Repetição dos ensaios empíricos em repositórios adicionais e diferentes harnesses de IA.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold font-mono">⚡</span>
                    <span><strong>Refinamento de AST Multi-Language:</strong> Expansão do parsing estrutural de TypeScript e Rust para confiança nativa 1.0.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Known Limitations Box */}
            <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm pb-3 mb-4 border-b border-zinc-800">
                <AlertTriangle className="w-4 h-4" />
                <span>LIMITAÇÕES DECLARADAS (Known Limitations do Manifesto)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {KNOWN_LIMITATIONS_DATA.map((limit, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                    <h4 className="font-bold text-white text-xs mb-1.5">{limit.title}</h4>
                    <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{limit.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Roadmap Tab */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
            {ROADMAP_ITEMS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 backdrop-blur-xl flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{item.tag}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      item.status === 'Available' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : item.status === 'In Validation'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-zinc-800/80 text-[10px] text-zinc-500 flex items-center justify-between">
                  <span>Maturidade:</span>
                  <span className="text-zinc-300 font-semibold">{item.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
