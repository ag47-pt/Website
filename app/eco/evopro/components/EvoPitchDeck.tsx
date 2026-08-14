'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { EVOPRO_CONFIG } from '@/data/evopro';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  GitBranch, 
  Sparkles,
  Maximize2,
  Minimize2,
  Download,
  Printer
} from 'lucide-react';

interface Slide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  points: { title: string; desc: string }[];
  accentColor: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    tag: 'EVOPRO PITCH DECK • SLIDE 01',
    title: 'Software that knows how to keep evolving.',
    subtitle: '“The intelligence can change. The protocol stays with the project.”',
    points: [
      { title: 'Repository-Native', desc: 'Objetivos, baselines e memória residem no próprio repositório, não em chats voláteis.' },
      { title: 'Governança Determinística', desc: 'Nenhum agente de IA pode validar ou aprovar o seu próprio código.' },
      { title: 'Zero Bloat', desc: 'Construído em Python stdlib puro sem dependências pesadas de frameworks externos.' }
    ],
    accentColor: '#3b82f6'
  },
  {
    id: 2,
    tag: 'O PROBLEMA REAL • SLIDE 02',
    title: 'A Degradação Silenciosa por Agentes de IA',
    subtitle: 'LLMs geram mutações locais desconectadas que acumulam dívida técnica catastrófica.',
    points: [
      { title: 'Sem Baseline A/B', desc: 'Agentes não sabem o estado do sistema antes de aplicar alterações.' },
      { title: 'Alucinação de Sucesso', desc: 'O agente reporta que a tarefa foi concluída, mas suites de teste e tipos falham silenciosamente.' },
      { title: 'Amnésia de Sessão', desc: 'Cada novo contexto começa do zero, repetindo erros anteriormente descartados.' }
    ],
    accentColor: '#f43f5e'
  },
  {
    id: 3,
    tag: 'ARQUITETURA CANÓNICA • SLIDE 03',
    title: 'O Ciclo de 10 Etapas Governadas',
    subtitle: 'Da intenção humana à persistência no ledger de auditoria.',
    points: [
      { title: '01-03: Spec & Baseline A', desc: 'Congelamento do estado prévio e definição do Sprint Goal estrito.' },
      { title: '04-06: Build & Baseline B', desc: 'Execução isolada e medição diferencial de impacto.' },
      { title: '07-10: Gauntlet, Judge & Persist', desc: '12 critics adversariais, juiz determinístico e registo no histórico.' }
    ],
    accentColor: '#06b6d4'
  },
  {
    id: 4,
    tag: 'VERIFICAÇÃO ADVERSARIAL • SLIDE 04',
    title: 'Os 12 Gauntlet Critics',
    subtitle: 'Uma bateria de validação estática e dinâmica independente.',
    points: [
      { title: 'Scope & Boundary Critics', desc: 'Garantem que arquivos fora do escopo ou diretórios protegidos nunca são tocados.' },
      { title: 'Regression & Security Scan', desc: 'Comparam deltas de baseline e barram padrões vulneráveis ou hardcoded.' },
      { title: 'Historical Failure Critic', desc: 'Impede que o agente tente uma abordagem que já falhou no passado do repositório.' }
    ],
    accentColor: '#10b981'
  },
  {
    id: 5,
    tag: 'GRAPH INTELLIGENCE • SLIDE 05',
    title: 'Code Graph & Evolution Graph (AST)',
    subtitle: 'Graph-enhanced, not graph-dependent.',
    points: [
      { title: 'Indexação AST Relâmpago', desc: 'Mapeamento de 270 nós e 1.340 arestas em menos de 100ms via stdlib Python.' },
      { title: 'Blast Radius Cirúrgico', desc: 'Identifica exatamente quais arquivos e testes são afetados por uma mudança.' },
      { title: '72% Menos Context Bloat', desc: 'Injeta apenas o subgrafo relevante no contexto da LLM, poupando milhares de tokens.' }
    ],
    accentColor: '#a855f7'
  },
  {
    id: 6,
    tag: 'AGNOSTICISMO TOTAL • SLIDE 06',
    title: 'Harness-Agnostic & Model-Agnostic',
    subtitle: 'O protocolo funciona com qualquer harness, IDE ou modelo de IA.',
    points: [
      { title: 'Compatibilidade Ampla', desc: 'Suporta Claude Code, Codex, Antigravity, Cursor, VS Code ou CLI pura.' },
      { title: 'LLM Intercambiável', desc: 'Mude de Claude para Gemini ou GPT sem perder a governança do repositório.' },
      { title: 'Adote em 60 Segundos', desc: 'Basta executar `pip install` e `evolution init` na raiz de qualquer projeto.' }
    ],
    accentColor: '#f59e0b'
  }
];

interface EvoPitchDeckProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EvoPitchDeck({ isOpen, onClose }: EvoPitchDeckProps) {
  const { theme } = useTheme();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentSlide = SLIDES[currentSlideIndex];

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev < SLIDES.length - 1 ? prev + 1 : 0));
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : SLIDES.length - 1));
  };

  const exportPresentationHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8">
  <title>EvoPro — Evolution Protocol Pitch Deck</title>
  <style>
    body { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: #000; color: #fff; margin: 0; padding: 40px; }
    .slide { max-width: 900px; margin: 0 auto 80px auto; padding: 40px; border: 1px solid #27272a; border-radius: 24px; background: #09090b; page-break-after: always; }
    .tag { font-size: 11px; font-weight: bold; letter-spacing: 2px; color: #10b981; margin-bottom: 16px; }
    h1 { font-size: 32px; font-weight: 900; margin: 0 0 12px 0; }
    p.subtitle { font-size: 16px; color: #a1a1aa; font-family: system-ui, sans-serif; margin-bottom: 32px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .card { background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 20px; }
    .card h3 { font-size: 13px; font-weight: bold; color: #fff; margin: 0 0 8px 0; }
    .card p { font-size: 11px; color: #a1a1aa; font-family: system-ui, sans-serif; margin: 0; line-height: 1.5; }
    @media print { body { background: #fff; color: #000; padding: 0; } .slide { border: 1px solid #ccc; background: #fff; color: #000; } .card { background: #f4f4f5; border: 1px solid #e4e4e7; } }
  </style>
</head>
<body>
  <div style="text-align: center; margin-bottom: 40px;">
    <h2>EVOPRO — EVOLUTION PROTOCOL</h2>
    <p style="color: #71717a; font-size: 12px;">Executive Technical Slide Deck • AG47 Labs</p>
  </div>
  ${SLIDES.map(s => `
    <div class="slide">
      <div class="tag" style="color: ${s.accentColor}">${s.tag}</div>
      <h1>${s.title}</h1>
      <p class="subtitle">${s.subtitle}</p>
      <div class="grid">
        ${s.points.map(p => `
          <div class="card">
            <h3 style="color: ${s.accentColor}">• ${p.title}</h3>
            <p>${p.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('')}
  <script>
    window.onload = function() {
      // Pronto para leitura ou impressão
    };
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'evopro-pitch-deck.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlideIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col justify-between p-6 sm:p-12 font-mono select-none"
      >
        {/* Top Bar com Controles */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-black text-xs"
              style={{ backgroundColor: theme.colors.primary }}
            >
              AG
            </div>
            <div>
              <span className="text-white font-bold text-sm">EVOPRO PITCH DECK</span>
              <span className="text-[10px] text-zinc-500 block">MODO APRESENTAÇÃO TÉCNICA</span>
            </div>
          </div>

          {/* Slide Indicator, Export & Close Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={exportPresentationHTML}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-400 hover:text-cyan-300 text-xs border border-zinc-700/80 transition-colors cursor-pointer"
              title="Descarregar deck completo em HTML/PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Descarregar Slides</span>
            </button>

            <span className="text-xs text-zinc-400 font-bold bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
              SLIDE {String(currentSlideIndex + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </span>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
              title="Fechar (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Content Principal */}
        <div className="max-w-5xl mx-auto w-full my-auto py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Tag & Titulo */}
              <div>
                <span 
                  className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4"
                  style={{
                    color: currentSlide.accentColor,
                    borderColor: `${currentSlide.accentColor}40`,
                    backgroundColor: `${currentSlide.accentColor}10`
                  }}
                >
                  {currentSlide.tag}
                </span>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4">
                  {currentSlide.title}
                </h2>
                <p className="text-lg sm:text-xl text-zinc-300 font-sans leading-relaxed">
                  {currentSlide.subtitle}
                </p>
              </div>

              {/* Grid dos 3 Pontos Chave */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {currentSlide.points.map((pt, idx) => (
                  <div 
                    key={idx}
                    className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl space-y-2 hover:border-zinc-700 transition-all"
                  >
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <span 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: currentSlide.accentColor }}
                      />
                      <span>{pt.title}</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Bar com Navegação & Teclas */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-800 pt-4 gap-4">
          <div className="text-[11px] text-zinc-500 flex items-center gap-2">
            <span>Use as teclas</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">←</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">→</kbd>
            <span>ou</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">ESPAÇO</kbd>
            <span>para navegar</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <button
              onClick={nextSlide}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-black font-bold transition-all shadow-lg hover:scale-105 cursor-pointer"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <span>Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
