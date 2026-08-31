'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { CAPABILITIES_MANIFEST } from '@/data/evopro';
import { 
  Cpu, 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  Sliders, 
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Layers,
  Sparkles
} from 'lucide-react';

export function CapabilityMatrix() {
  const { theme } = useTheme();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VALIDATED':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'IMPLEMENTED':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'OBSERVED':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'PARTIAL':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'UNKNOWN':
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <section id="capabilities" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            PUBLIC CAPABILITIES MANIFEST
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Matriz de Capacidades & Status de Evidência
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Transparência absoluta: cada capacidade é mapeada com o seu estado de evidência formal (<strong className="text-emerald-400 font-mono">VALIDATED</strong>, <strong className="text-cyan-400 font-mono">IMPLEMENTED</strong>, <strong className="text-purple-400 font-mono">OBSERVED</strong>, <strong className="text-amber-400 font-mono">PARTIAL</strong> ou <strong className="text-zinc-400 font-mono">UNKNOWN</strong>) derivado do <code className="text-zinc-300 font-mono">metadata/public-manifest.json</code>.
          </p>
        </div>

        {/* Capabilities Table Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs mb-12">
          {CAPABILITIES_MANIFEST.map((cap) => (
            <motion.div
              key={cap.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800/80 backdrop-blur-xl flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{cap.source}</span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold border ${getStatusBadge(cap.status)}`}>
                    {cap.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white tracking-tight mb-2">
                  {cap.label}
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                  {cap.description}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-900 text-[11px] text-zinc-500">
                <div className="text-zinc-400 font-sans">
                  <strong className="text-zinc-300 font-mono">Evidência:</strong> {cap.details}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Manifest Source Invariant */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 font-mono text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileCheck className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>
              <strong>Regra de Integridade:</strong> O Website não define fatos de produto. Todos os dados acima são sincronizados diretamente com o manifesto público do kernel EvoPro (<code className="text-zinc-300">metadata/public-manifest.json</code>).
            </span>
          </div>
          <span className="text-cyan-400 font-bold shrink-0">Source of Truth Verified</span>
        </div>
      </div>
    </section>
  );
}
