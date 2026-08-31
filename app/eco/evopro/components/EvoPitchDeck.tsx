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
  Printer,
  BrainCircuit,
  Activity,
  Database
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
    subtitle: '“Understand before changing. Prove before remembering. Measure before claiming improvement.”',
    points: [
      { title: 'Repository-Native', desc: 'Objetivos, memória soberana e telemetria residem no repositório, não em janelas de chat efêmeras.' },
      { title: 'Agent-First Workflow', desc: 'O humano fornece intenção e autoridade; o agente coordena descoberta, ferramentas e recomendações.' },
      { title: 'Maturidade Comprovada', desc: 'v0.3.1 em Validação em Host Real com 425 testes e piloto empírico concluído.' }
    ],
    accentColor: '#3b82f6'
  },
  {
    id: 2,
    tag: 'O PROBLEMA REAL • SLIDE 02',
    title: 'Amnésia, Context Bloat e Auto-Validação',
    subtitle: 'Agentes operando sem protocolo degradam a arquitetura e acumulam riscos silenciosos.',
    points: [
      { title: 'Amnésia Entre Sessões', desc: 'Cada nova conversa recomeça do zero, esquecendo decisões passadas e repetindo falhas.' },
      { title: 'Context Bloat Cego', desc: 'Injetar o repositório inteiro desperdiça milhares de tokens e confunde os modelos.' },
      { title: 'Auto-Aprovação Ilusória', desc: 'Nenhum ator deve ser o juiz exclusivo das suas próprias alterações de código.' }
    ],
    accentColor: '#f43f5e'
  },
  {
    id: 3,
    tag: 'ARQUITETURA COGNITIVA • SLIDE 03',
    title: 'Second Brain & Separação de Memória',
    subtitle: 'Adoção de memória soberana sem destruir a documentação pré-existente do host.',
    points: [
      { title: 'Memória Soberana (evolution/)', desc: 'Indexada em modo leitura (HOST_CANONICAL_READ_ONLY) e nunca modificada durante a adoção.' },
      { title: 'Runtime Efêmero (.evolution/runtime/)', desc: 'Isolamento estrito de índices, baselines A/B, relatórios do Gauntlet e logs de telemetria.' },
      { title: 'Conhecimento Curado (.evolution/knowledge/)', desc: 'Decisões validadas (ADRs), lições do Judge e CONTINUITY.md para handoff sem fricção.' }
    ],
    accentColor: '#8b5cf6'
  },
  {
    id: 4,
    tag: 'ROTEAMENTO DELIMITADO • SLIDE 04',
    title: 'Context Router & Auto-Readiness',
    subtitle: 'Recuperação seletiva de contexto delimitado em 5 modos explícitos.',
    points: [
      { title: 'Auto-Index Preparation', desc: 'ensure_router_index_ready() verifica e gera candidatos a partir de fontes nativas ou adotadas.' },
      { title: '5 Modos de Routing', desc: 'NATIVE, ADOPTED_MEMORY, FALLBACK_CANONICAL_INDEX, COLD_BOOT e DEGRADED_OPERATION.' },
      { title: 'Redução de ~75% de Tokens', desc: 'Injeta apenas domínios, contratos, riscos e referências estritamente relevantes para a tarefa.' }
    ],
    accentColor: '#06b6d4'
  },
  {
    id: 5,
    tag: 'TELEMETRIA FAIL-OPEN • SLIDE 05',
    title: 'Amortização & Taxonomia Epistêmica',
    subtitle: 'Instrumentação no disco classificando cada dado como NATIVE, ESTIMATED ou UNKNOWN.',
    points: [
      { title: 'Classificação NATIVE vs ESTIMATED', desc: 'Fatos medidos são NATIVE; aproximações declaram a base de cálculo. O protocolo nunca inventa.' },
      { title: 'Instrumentação Fail-Open', desc: 'Registo de métricas não bloqueante: falhas de I/O nunca interrompem tarefas funcionais.' },
      { title: 'Reuso Cognitivo Real', desc: 'Sessões subsequentes reutilizam entendimento prévio com redução comprovada de re-leituras.' }
    ],
    accentColor: '#10b981'
  },
  {
    id: 6,
    tag: 'EVIDÊNCIA EMPÍRICA • SLIDE 06',
    title: 'Validação em Host Real (Piloto AG Menu)',
    subtitle: 'Comprovado em repositório real maduro com veredito PASS e 44/44 testes A/B.',
    points: [
      { title: 'Adoção Sem Mutação', desc: 'Adotou com sucesso documentação soberana e descobriu 14 domínios de negócio.' },
      { title: 'Validação A/B Comportamental', desc: '44/44 testes aprovados após remediação cirúrgica de RBAC (com 29 falhas pré-correção).' },
      { title: 'Transparência de Maturidade', desc: 'Validação em host real comprovada; certificação de produção universal em andamento.' }
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
  <title>EvoPro — Evolution Protocol Pitch Deck (v0.3.1)</title>
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
    <h2>EVOPRO — EVOLUTION PROTOCOL (v0.3.1)</h2>
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
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'evopro-pitch-deck-v0.3.1.html');
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
              <span className="text-white font-bold text-sm">EVOPRO PITCH DECK (v0.3.1)</span>
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
