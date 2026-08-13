'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ROADMAP_ITEMS } from '@/data/evopro';
import { 
  CheckCircle2, 
  FlaskConical, 
  Clock, 
  AlertTriangle, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  Search
} from 'lucide-react';

export function StatusAndRoadmap() {
  const { theme } = useTheme();
  const [tab, setTab] = useState<'status' | 'roadmap'>('status');

  const knownLimits = [
    {
      title: 'O Kernel não escreve código por iniciativa própria',
      desc: 'O planeamento requer sempre um agente cognitivo externo (Claude Code, Codex, Antigravity, etc.). A autonomia total só ocorre quando o harness responde aos pedidos cognitivos (03_cognitive_request.json).'
    },
    {
      title: 'Críticos de Performance, UX e Code Quality estão Registados mas Indisponíveis',
      desc: 'Requerem profiles específicos do host ou browser capability. Reportam UNAVAILABLE em vez de aprovação silenciosa.'
    },
    {
      title: 'Apenas Python possui parsing AST completo e exato',
      desc: 'JS/TS utiliza inferência regex a confiança 0.5; outras linguagens ainda não são indexadas pelo Code Graph.'
    },
    {
      title: 'Despacho de Críticos Independentes ainda não fecha o ciclo cognitivo',
      desc: 'Os pedidos para críticos independentes são gerados para subagentes, mas os críticos determinísticos correm em modo sequencial estrito.'
    },
    {
      title: 'Rollback abandona o branch de isolamento sem destruir histórico',
      desc: 'O working tree permanece no branch original e a mutação é preservada em evolution/<id> para inspeção e auditoria humana.'
    }
  ];

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
            Status Atual & Roadmap
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Credibilidade é mais importante que promessas. Documentamos explicitamente o que está pronto, o que é experimental, as limitações conhecidas e onde o protocolo está a caminhar.
          </p>

          {/* Toggle Tab */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800 mt-6 font-mono text-xs">
            <button
              onClick={() => setTab('status')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                tab === 'status' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Status & Limitações Conhecidas
            </button>
            <button
              onClick={() => setTab('roadmap')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                tab === 'roadmap' ? 'bg-zinc-800 text-emerald-400 font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Roadmap de Engenharia
            </button>
          </div>
        </div>

        {tab === 'status' ? (
          <div className="space-y-8 font-mono text-xs">
            {/* Available vs Experimental Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ready Now */}
              <div className="p-6 rounded-3xl bg-zinc-950 border border-emerald-500/30 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm pb-3 mb-4 border-b border-zinc-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>DISPONÍVEL AGORA (v0.3.0)</span>
                </div>
                <ul className="space-y-2.5 text-zinc-300 font-sans text-xs">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold font-mono">✓</span>
                    <span>Global Goal com 4 tipos de critérios estritamente verificáveis.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold font-mono">✓</span>
                    <span>Medição de baseline State A/B com classificação dimensional e is_improvement tri-valorado.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold font-mono">✓</span>
                    <span>Gauntlet adversarial com 9 críticos determinísticos funcionais.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold font-mono">✓</span>
                    <span>Judge com 4 vereditos ordenados (ACCEPT, REVISE, ROLLBACK, BLOCKED).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold font-mono">✓</span>
                    <span>CONTINUITY.md e reconstrução de estado a frio entre agentes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold font-mono">✓</span>
                    <span>Code Graph AST sem dependências pesadas e cálculo de raio de impacto.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold font-mono">✓</span>
                    <span>8 guardrails e stop conditions configuráveis pelo host contract.</span>
                  </li>
                </ul>
              </div>

              {/* Experimental */}
              <div className="p-6 rounded-3xl bg-zinc-950 border border-purple-500/30 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm pb-3 mb-4 border-b border-zinc-800">
                  <FlaskConical className="w-4 h-4" />
                  <span>EXPERIMENTAL / LABORATÓRIO</span>
                </div>
                <ul className="space-y-2.5 text-zinc-300 font-sans text-xs">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold font-mono">⚡</span>
                    <span><strong>Self-Hosting Lab:</strong> O EvoPro governa uma cópia isolada de si mesmo em ambiente de teste controlado.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold font-mono">⚡</span>
                    <span><strong>Evolution Graph Histórico:</strong> Rastreamento de mutações passadas para detecção de abordagens anteriormente rejeitadas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold font-mono">⚡</span>
                    <span><strong>Inferência Regex para JS/TS:</strong> Cobertura de grafos em TypeScript com nível de confiança 0.5 (INFERRED).</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Known Limitations Box */}
            <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm pb-3 mb-4 border-b border-zinc-800">
                <AlertTriangle className="w-4 h-4" />
                <span>LIMITAÇÕES DECLARADAS (Known Limitations)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {knownLimits.map((limit, idx) => (
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
                        : item.status === 'Experimental'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : item.status === 'Planned'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
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
