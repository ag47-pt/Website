'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  MessageSquare,
  FileText,
  Volume2
} from 'lucide-react';
import { playClickSound } from '@/lib/audio/sound-fx';

interface SlideSpeakerNote {
  id: string;
  title: string;
  recommendedTime: string;
  pitchGoal: string;
  keyPoints: string[];
  technicalHighlights: string[];
  callToAction: string;
}

const SPEAKER_NOTES_DATA: Record<string, SlideSpeakerNote> = {
  overview: {
    id: 'overview',
    title: 'Visão Geral & Engenharia',
    recommendedTime: '1.5 min',
    pitchGoal: 'Apresentar a Agência 47 como parceiro estratégico de alta engenharia digital, não como agência comum.',
    keyPoints: [
      'Destacar que não usamos templates prontos: tudo é engenharia sob medida de altíssimo nível.',
      'Enfatizar o impacto direto de velocidade de carregamento na taxa de conversão do cliente.',
      'Chamar atenção para a estética premium, escura e futurista (OLED + Glow).'
    ],
    technicalHighlights: [
      'Next.js 15 App Router com Server Components.',
      'Tailwind CSS v4 CSS-first e design tokens dinâmicos.',
      'Pontuação 100/100 no Google Lighthouse (Performance, A11y, SEO).'
    ],
    callToAction: 'Convidar o cliente a acompanhar a apresentação e testar o comparador a seguir.'
  },
  manifesto: {
    id: 'manifesto',
    title: 'Quem Somos & Manifesto',
    recommendedTime: '2 min',
    pitchGoal: 'Construir autoridade mostrando o abismo técnico entre sites padrão lentos e a engenharia AG47.',
    keyPoints: [
      'Sites comuns perdem até 53% dos visitantes por lentidão acima de 3 segundos.',
      'Nossa missão é transformar aplicações web em ativos de investimento e máquinas de receita.',
      'Filosofia de código limpo (Clean Code) e ciclo de vida sustentável.'
    ],
    technicalHighlights: [
      'Zero dependências pesadas desnecessárias (Zero Bloatware).',
      'Arquitetura modular orientada a microsserviços e Serverless Cloud.',
      'Segurança corporativa com headers rígidos (CSP, HSTS).'
    ],
    callToAction: 'Transicionar para o comparador ao vivo de antes vs depois.'
  },
  vantagens: {
    id: 'vantagens',
    title: 'Vantagens & Comparador de Performance',
    recommendedTime: '2 min',
    pitchGoal: 'Mostrar visualmente a superioridade do produto com o slider interativo Antes / Depois.',
    keyPoints: [
      'Arrastar o slider ao vivo durante a reunião para prender a atenção do cliente.',
      'Comparar notas reais do Google Core Web Vitals (FCP, LCP, CLS).',
      'Explicar como cada 100ms a menos de latência aumenta o ROI em campanhas de tráfego pago.'
    ],
    technicalHighlights: [
      'FCP < 0.4s (First Contentful Paint) e LCP < 0.8s.',
      'Cumulative Layout Shift (CLS) travado em 0.00.',
      'Renderização Edge em CDNs globais da Cloudflare / Vercel.'
    ],
    callToAction: 'Apresentar a gama de serviços que constroem esse ecossistema.'
  },
  servicos: {
    id: 'servicos',
    title: 'Serviços Especializados',
    recommendedTime: '2.5 min',
    pitchGoal: 'Expor os 6 pilares de entrega da Agência 47 com clareza de escopo.',
    keyPoints: [
      'Landing Pages Labs: Conversão máxima para lançamentos e produtos tech.',
      'Webapps & SaaS: Plataformas complexas, painéis administrativos e dashboards.',
      'Agentes de IA & Automação: Integração nativa com LLMs e pipelines de dados.'
    ],
    technicalHighlights: [
      'Spotlight Cursor Follower com refração radial nos cards.',
      'Ecosistema integrado com APIs REST, gRPC e Webhooks.',
      'Design System corporativo consistente em todas as telas.'
    ],
    callToAction: 'Mostrar os produtos reais já desenvolvidos no slide seguinte.'
  },
  portfolio: {
    id: 'portfolio',
    title: 'Portfólio & Ecossistema Vivo',
    recommendedTime: '2 min',
    pitchGoal: 'Gerar prova tangível mostrando projetos reais em funcionamento no repositório.',
    keyPoints: [
      'Alt Radar: Radar cripto e inteligência descentralizada em tempo real.',
      'YouLearn: Plataforma de aprendizado dinâmico com IA a partir do YouTube.',
      'EvoPro: Protocolo técnico para landing pages de altíssima densidade.'
    ],
    technicalHighlights: [
      'Arquitetura Monorepo escalável.',
      'Pipelines de ingestão de dados em tempo real.',
      'Integração multi-cloud e balanceamento de carga.'
    ],
    callToAction: 'Abrir a demonstração interativa do motor tecnológico.'
  },
  'demo-engine': {
    id: 'demo-engine',
    title: 'Motor Labs Interativo',
    recommendedTime: '2.5 min',
    pitchGoal: 'Demonstrar o terminal interativo e a capacidade prática de prototipagem e engenharia.',
    keyPoints: [
      'Testar comandos no mini-terminal com áudio sintetizado para encantar o cliente.',
      'Explicar os nós de computação e arquitetura de inteligência artificial.',
      'Provar que construímos tecnologia proprietária, não apenas layouts.'
    ],
    technicalHighlights: [
      'Web Audio API pura com síntese senoidal para feedback acústico.',
      'Simulação de telemetria gRPC e streams em tempo real.',
      'Terminal com parsing de comandos de diagnóstico de rede.'
    ],
    callToAction: 'Passar para a tabela de investimento e planos flexíveis.'
  },
  precos: {
    id: 'precos',
    title: 'Planos & Investimento',
    recommendedTime: '2 min',
    pitchGoal: 'Apresentar os modelos de contratação com transparência e flexibilidade comercial.',
    keyPoints: [
      'Modelo Sprint / Landing Page: Ideal para entregas rápidas de alto impacto.',
      'Modelo Squad Dedicada: Engenharia contínua para empresas em escala.',
      'Enterprise Custom: Soluções complexas sob medida com SLA contratual.'
    ],
    technicalHighlights: [
      'CI/CD automatizado com testes pré-deploy em cada release.',
      'Garantia de código, documentação técnica completa e suporte.',
      'Código 100% pertencente ao cliente (sem aprisionamento tecnológico).'
    ],
    callToAction: 'Destacar as métricas e avaliações dos clientes no próximo slide.'
  },
  metricas: {
    id: 'metricas',
    title: 'Prova Social & Resultados',
    recommendedTime: '1.5 min',
    pitchGoal: 'Consolidar a decisão do cliente eliminando qualquer receio de risco.',
    keyPoints: [
      '+340% de taxa média de conversão em clientes que migraram para o AG47.',
      '99.99% de disponibilidade em produção com infraestrutura resiliente.',
      'Depoimentos reais de founders e CTOs que confiaram no nosso ecossistema.'
    ],
    technicalHighlights: [
      'Monitoramento contínuo de erros e telemetria em tempo real.',
      'Auditorias de segurança periódicas contra vulnerabilidades OWASP.'
    ],
    callToAction: 'Concluir a reunião convidando para o Quick Start e fechamento do briefing.'
  },
  faq: {
    id: 'faq',
    title: 'FAQ & Exportação de Especificações',
    recommendedTime: '2 min',
    pitchGoal: 'Sanar dúvidas finais sobre prazos, tecnologias e iniciar o onboarding imediatamente.',
    keyPoints: [
      'Prazos típicos: Sprints rápidas de 1 a 3 semanas para Landing Pages e MVPs.',
      'Como funciona o onboarding: briefing estratégico em 24h e prototipagem contínua.',
      'Opção de exportar a especificação técnica diretamente pelo botão da página.'
    ],
    technicalHighlights: [
      'Exportação de especificações técnicas em JSON/Markdown para equipe técnica.',
      'Canal de comunicação dedicado via Slack / Discord / WhatsApp corporativo.'
    ],
    callToAction: 'Abrir para perguntas finais e agendar o kickoff do projeto.'
  }
};

interface SpeakerNotesOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlideId: string;
  currentSlideIndex: number;
  totalSlides: number;
  onNextSlide: () => void;
  onPrevSlide: () => void;
}

export function SpeakerNotesOverlay({
  isOpen,
  onClose,
  currentSlideId,
  currentSlideIndex,
  totalSlides,
  onNextSlide,
  onPrevSlide
}: SpeakerNotesOverlayProps) {
  const { theme } = useTheme();
  
  // Timer de Apresentação
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleResetTimer = () => {
    playClickSound();
    setSeconds(0);
    setIsRunning(true);
  };

  const handleToggleTimer = () => {
    playClickSound();
    setIsRunning(!isRunning);
  };

  if (!isOpen) return null;

  const currentNote = SPEAKER_NOTES_DATA[currentSlideId] || {
    id: currentSlideId,
    title: `Slide ${currentSlideIndex + 1}`,
    recommendedTime: '2 min',
    pitchGoal: 'Apresentar a solução com foco em valor e engenharia de ponta.',
    keyPoints: ['Destacar a autoridade técnica da Agência 47.'],
    technicalHighlights: ['Next.js 15, Performance Máxima, TypeScript.'],
    callToAction: 'Direcionar para o próximo passo do funil de vendas.'
  };

  return (
    <div 
      aria-label="Painel de Notas do Apresentador"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-zinc-950/95 border-l border-white/10 backdrop-blur-2xl text-white font-mono flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
    >
      {/* HEADER DO APRESENTADOR COM TIMER */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div 
            className="w-2.5 h-2.5 rounded-full animate-pulse" 
            style={{ backgroundColor: theme.colors.primary }} 
          />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Modo Apresentador
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-zinc-400">
            Atalho: P
          </span>
        </div>

        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Fechar painel de anotações (P ou ESC)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* TIMER & CONTROLE DE TEMPO */}
      <div className="p-4 border-b border-white/10 bg-zinc-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-zinc-400" />
          <div>
            <div className="text-[10px] text-zinc-500 uppercase">Tempo Decorrido</div>
            <div className="text-xl font-bold text-white tracking-widest tabular-nums">
              {formatTime(seconds)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleToggleTimer}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all active:scale-95"
            title={isRunning ? 'Pausar Cronômetro' : 'Iniciar Cronômetro'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleResetTimer}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all active:scale-95"
            title="Zerar Cronômetro"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="ml-2 pl-2 border-l border-white/10 text-[10px] text-zinc-400">
            Sugerido: <span className="font-semibold text-zinc-200">{currentNote.recommendedTime}</span>
          </div>
        </div>
      </div>

      {/* CONTEÚDO DAS ANOTAÇÕES DO SLIDE ATIVO */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs no-scrollbar">
        {/* IDENTIFICAÇÃO DO SLIDE */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
            <span>SLIDE {currentSlideIndex + 1} DE {totalSlides}</span>
            <span style={{ color: theme.colors.primary }} className="font-bold">
              {Math.round(((currentSlideIndex + 1) / totalSlides) * 100)}% concluído
            </span>
          </div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span style={{ color: theme.colors.primary }}>#</span>
            {currentNote.title}
          </h2>
        </div>

        {/* OBJETIVO COMERCIAL / PITCH */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            <MessageSquare className="w-3 h-3 text-cyan-400" />
            <span>Objetivo do Pitch</span>
          </div>
          <p className="text-zinc-300 leading-relaxed font-sans text-xs">
            {currentNote.pitchGoal}
          </p>
        </div>

        {/* TALKING POINTS / PONTOS-CHAVE DE VENDA */}
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            <Sparkles className="w-3 h-3" style={{ color: theme.colors.primary }} />
            <span>Tópicos-Chave para Falar</span>
          </div>
          <ul className="space-y-2">
            {currentNote.keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-zinc-300 font-sans text-xs leading-snug">
                <span className="text-[10px] font-mono mt-0.5" style={{ color: theme.colors.primary }}>
                  0{idx + 1}.
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* DESTAQUES TÉCNICOS & ENGENHARIA */}
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Argumentos Técnicos (Autoridade)</span>
          </div>
          <div className="space-y-1.5">
            {currentNote.technicalHighlights.map((tech, idx) => (
              <div 
                key={idx} 
                className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[11px] text-zinc-300 font-mono"
              >
                ⚡ {tech}
              </div>
            ))}
          </div>
        </div>

        {/* CALL TO ACTION DO SLIDE */}
        <div className="p-3.5 rounded-xl border border-dashed border-white/15 bg-zinc-900/40">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">
            <ArrowRight className="w-3 h-3" />
            <span>Gatilho de Transição / CTA</span>
          </div>
          <p className="text-zinc-300 font-sans text-xs">
            {currentNote.callToAction}
          </p>
        </div>
      </div>

      {/* FOOTER DO DRAWER COM NAVEGAÇÃO DE SLIDES */}
      <div className="p-4 border-t border-white/10 bg-zinc-950 flex items-center justify-between">
        <button
          onClick={() => {
            playClickSound();
            onPrevSlide();
          }}
          disabled={currentSlideIndex === 0}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
            currentSlideIndex === 0 
              ? 'border-transparent text-zinc-600 cursor-not-allowed' 
              : 'border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200 active:scale-95'
          }`}
        >
          ← Slide Anterior
        </button>

        <button
          onClick={() => {
            playClickSound();
            onNextSlide();
          }}
          disabled={currentSlideIndex === totalSlides - 1}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
            currentSlideIndex === totalSlides - 1 
              ? 'border-transparent text-zinc-600 cursor-not-allowed' 
              : 'text-black active:scale-95'
          }`}
          style={{
            backgroundColor: currentSlideIndex === totalSlides - 1 ? '#27272a' : theme.colors.primary,
            borderColor: currentSlideIndex === totalSlides - 1 ? 'transparent' : theme.colors.primary
          }}
        >
          Próximo Slide →
        </button>
      </div>
    </div>
  );
}
