'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  Target, 
  CheckCircle2, 
  Terminal, 
  FileText, 
  ShieldAlert, 
  UserCheck, 
  AlertOctagon,
  ArrowDown,
  Sparkles
} from 'lucide-react';

export function GlobalGoalSection() {
  const { theme } = useTheme();

  return (
    <section id="goal" className="py-16 md:py-24 border-t border-white/5 relative bg-zinc-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
            <Target className="w-3.5 h-3.5" />
            GOAL DECOMPOSITION & VERIFIABILITY
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Global Goal vs. Sprint Goal
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Nenhum agente de IA pode simplesmente declarar que o objetivo foi atingido. A conclusão baseia-se unicamente em critérios de sucesso verificáveis pelo ambiente.
          </p>
        </div>

        {/* Global Goal Tree Representation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Left: Global Goal Card */}
          <div className="lg:col-span-5 rounded-3xl bg-zinc-950 border border-blue-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">Objetivo Macro do Host</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-4">
                Global Goal
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed mb-6">
                O objetivo final que o projeto deve alcançar. Pode necessitar de dezenas de sprints e ciclos de mutação.
              </p>

              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 font-mono text-xs text-zinc-300 mb-4">
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Exemplo de Configuração:</div>
                <div className="text-emerald-400 font-semibold mb-2">
                  &ldquo;Transformar este host num SaaS pronto para produção&rdquo;
                </div>
                <div className="text-zinc-400 text-[11px] space-y-1">
                  <div>├── Testes unitários a 100% exit code 0</div>
                  <div>├── Build de produção sem erros</div>
                  <div>├── Zero vulnerabilidades críticas</div>
                  <div>└── Confirmação humana de UI/UX</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 font-mono text-xs text-zinc-500">
              Arquivo persistido em: <code className="text-zinc-300">.evolution/goal/global-goal.json</code>
            </div>
          </div>

          {/* Right: Sprints Breakdown Tree */}
          <div className="lg:col-span-7 rounded-3xl bg-zinc-950/80 border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                Decomposição em Avanços Concretos
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-4">
                Sprints Executáveis
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans mb-6">
                Cada Sprint Goal representa um avanço delimitado que fecha num único ciclo de execução.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-zinc-500 font-bold">#01</span>
                    <span className="text-zinc-200">Configurar infraestrutura de testes & contratos</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">ACCEPTED</span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-zinc-500 font-bold">#02</span>
                    <span className="text-zinc-200">Implementar autenticação e rotas protegidas</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">ACCEPTED</span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-blue-500/40 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-blue-400 font-bold">#03</span>
                    <span className="text-white font-semibold">Integrar gateway de pagamentos & webhooks</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold animate-pulse">ACTIVE SPRINT</span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-dashed border-zinc-800 flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-zinc-600 font-bold">#04</span>
                    <span className="text-zinc-500">Pipeline de deploy e observabilidade</span>
                  </div>
                  <span className="text-[10px] text-zinc-600">PENDING GAP</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-400">
              <span>Derivação Dinâmica</span>
              <span className="text-emerald-400">Sucesso comprovado apenas quando todos os critérios forem satisfeitos</span>
            </div>
          </div>
        </div>

        {/* 4 Verifiable Criteria Kinds Grid */}
        <div className="mt-8">
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4 text-center">
            Os 4 Tipos de Critérios de Sucesso (Avaliados Fora do Julgamento do Agente)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
                <Terminal className="w-4 h-4" />
                <span>command</span>
              </div>
              <p className="text-xs text-zinc-400 font-sans">
                Executa um comando real declarado no host (ex: <code className="text-zinc-300">pytest</code>, <code className="text-zinc-300">npm run build</code>) e valida o código de saída zero.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center gap-2 text-purple-400 font-bold mb-2">
                <FileText className="w-4 h-4" />
                <span>artifact_exists</span>
              </div>
              <p className="text-xs text-zinc-400 font-sans">
                Verifica fisicamente no disco a existência e integridade de um arquivo ou esquema exigido.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center gap-2 text-rose-400 font-bold mb-2">
                <ShieldAlert className="w-4 h-4" />
                <span>no_findings_above</span>
              </div>
              <p className="text-xs text-zinc-400 font-sans">
                Garante que a contagem de findings do Gauntlet em determinada severidade (ex: <code className="text-zinc-300">critical</code>) seja zero.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                <UserCheck className="w-4 h-4" />
                <span>human_confirmed</span>
              </div>
              <p className="text-xs text-zinc-400 font-sans">
                Exige uma confirmação explícita gravada no registo por um operador humano (<code className="text-zinc-300">evolution goal confirm</code>).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
