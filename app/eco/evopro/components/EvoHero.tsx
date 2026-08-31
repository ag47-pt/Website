'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { EVOPRO_CONFIG } from '@/data/evopro';
import { 
  Terminal, 
  ArrowRight, 
  Check, 
  Copy, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  GitFork,
  Sparkles,
  BrainCircuit,
  Activity,
  Database
} from 'lucide-react';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function EvoHero() {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const copyInstall = () => {
    navigator.clipboard.writeText(EVOPRO_CONFIG.installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="overview" className="relative pt-28 pb-20 md:pt-36 lg:pt-40 md:pb-32 overflow-hidden">
      {/* Grid Pattern Backdrop */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Eyebrow & Version Pill */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-zinc-900/90 text-zinc-300 border border-zinc-800 shadow-sm">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.colors.primary }} />
              AG47 / ECO / EVOPRO
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <Sparkles className="w-3 h-3" />
              v{EVOPRO_CONFIG.version} • {EVOPRO_CONFIG.maturityLabel}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
              <BrainCircuit className="w-3 h-3" />
              Agent-First & Memory-Aware
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] mb-6"
          >
            Software that knows how to{' '}
            <span 
              className="bg-clip-text text-transparent"
              style={{ 
                backgroundImage: `linear-gradient(135deg, #ffffff 30%, ${theme.colors.primary} 100%)` 
              }}
            >
              keep evolving.
            </span>
          </motion.h1>

          {/* Core Mantra */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg font-mono text-zinc-300 font-medium tracking-tight mb-6 px-4 py-2 rounded-xl bg-zinc-900/40 border border-white/5 backdrop-blur-sm"
          >
            &ldquo;{EVOPRO_CONFIG.tagline}&rdquo;
          </motion.div>

          {/* Supporting Copy */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-zinc-400 font-sans max-w-3xl leading-relaxed mb-10"
          >
            O <strong>EvoPro</strong> é o protocolo operacional cognitivo que instala no próprio repositório uma arquitetura persistente de 
            <span className="text-zinc-200"> adoção de memória soberana, Context Routing delimitado, governança de agentes, telemetria de amortização fail-open e validação comportamental A/B</span>. 
            A inteligência dos modelos é intercambiável — o protocolo e o conhecimento durável pertencem ao projeto.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12"
          >
            <button
              onClick={() => scrollTo('cognitive-architecture')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-black transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Explorar Second Brain</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={EVOPRO_CONFIG.gitHubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-mono font-semibold text-xs uppercase tracking-wider bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700/80 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Ver no GitHub</span>
            </a>

            <button
              onClick={() => scrollTo('real-host')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-mono text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors cursor-pointer border border-cyan-500/30"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Evidência em Host Real</span>
            </button>
          </motion.div>

          {/* Quick Terminal Copy Snippet */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="w-full max-w-xl mx-auto rounded-2xl bg-zinc-950/90 border border-zinc-800 shadow-2xl p-3 sm:p-4 backdrop-blur-xl text-left font-mono"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] text-zinc-500 ml-2">pip install kernel</span>
              </div>
              <button
                onClick={copyInstall}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[11px] border border-zinc-700/60 transition-all cursor-pointer"
                title="Copiar comando de instalação"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <div className="text-xs sm:text-sm text-zinc-300 break-all leading-relaxed">
              <span className="text-emerald-400 select-none">$ </span>
              {EVOPRO_CONFIG.installCommand}
            </div>
            <div className="mt-2 text-[11px] text-zinc-500">
              <span className="text-zinc-600 select-none"># </span>
              Em seguida no chat da IDE: <code className="text-zinc-400">&ldquo;Analise este repositório e determine a próxima prioridade.&rdquo;</code>
            </div>
          </motion.div>

          {/* Pillars Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12 w-full max-w-4xl text-left font-mono"
          >
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-zinc-200 text-xs font-semibold mb-1">
                <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                <span>Agent-First</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">
                O humano dá intenção; o agente orquestra ferramentas com segurança.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-zinc-200 text-xs font-semibold mb-1">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>Memory-Aware</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">
                Adota memória soberana (evolution/) sem destruir documentação prévia.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-zinc-200 text-xs font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Evidence-Driven</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">
                Nenhum agente valida o seu código; vereditos requerem testes A/B.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-zinc-200 text-xs font-semibold mb-1">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span>Fail-Open Telemetry</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">
                Classificação epistêmica NATIVE/ESTIMATED sem bloquear o fluxo.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
