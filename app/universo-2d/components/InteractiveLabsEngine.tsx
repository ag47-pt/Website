'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { 
  Gauge, 
  Cpu, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Database,
  Globe2,
  Lock,
  Activity
} from 'lucide-react';

export function InteractiveLabsEngine() {
  const { theme, themeContrast } = useTheme();
  const [activeTab, setActiveTab] = useState<'speed' | 'ai' | 'conversion' | 'architecture'>('speed');
  const [trafficMonthly, setTrafficMonthly] = useState<number>(10000);
  const [averageTicket, setAverageTicket] = useState<number>(85);

  // Conversion calculator formulas
  const currentConversionRate = 0.012; // 1.2%
  const ag47ConversionRate = 0.034; // 3.4%
  const currentRevenue = trafficMonthly * currentConversionRate * averageTicket;
  const projectedRevenue = trafficMonthly * ag47ConversionRate * averageTicket;
  const monthlyGain = projectedRevenue - currentRevenue;
  const annualGain = monthlyGain * 12;

  return (
    <section id="demo-engine" className="py-20 px-4 sm:px-6 relative border-t border-white/10 bg-black/60">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-bold uppercase tracking-wider mb-3 transition-colors duration-500"
              style={{
                backgroundColor: `${theme.colors.primary}15`,
                borderColor: `${theme.colors.primary}40`,
                color: theme.colors.primary,
              }}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>06. MOTOR DE ENGENHARIA INTERATIVO</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Demonstração ao Vivo da Nossa Infraestrutura
            </h2>
          </div>
          <p className="text-sm sm:text-base text-zinc-400 max-w-md font-mono">
            Teste em tempo real os pilares técnicos que colocam os ecossistemas da AG47 anos à frente do mercado tradicional.
          </p>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-full sm:w-auto backdrop-blur-xl">
            <button
              onClick={() => setActiveTab('speed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono transition-all whitespace-nowrap ${
                activeTab === 'speed'
                  ? 'font-bold shadow-lg'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
              style={
                activeTab === 'speed'
                  ? {
                      backgroundColor: theme.colors.primary,
                      color: themeContrast || '#000000',
                      boxShadow: `0 0 16px ${theme.colors.primary}40`,
                    }
                  : {}
              }
            >
              <Gauge className="w-4 h-4" />
              <span>1. Speed & Core Web Vitals</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono transition-all whitespace-nowrap ${
                activeTab === 'ai'
                  ? 'font-bold shadow-lg'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
              style={
                activeTab === 'ai'
                  ? {
                      backgroundColor: theme.colors.primary,
                      color: themeContrast || '#000000',
                      boxShadow: `0 0 16px ${theme.colors.primary}40`,
                    }
                  : {}
              }
            >
              <Sparkles className="w-4 h-4" />
              <span>2. IA & Agentes Autônomos</span>
            </button>

            <button
              onClick={() => setActiveTab('conversion')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono transition-all whitespace-nowrap ${
                activeTab === 'conversion'
                  ? 'font-bold shadow-lg'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
              style={
                activeTab === 'conversion'
                  ? {
                      backgroundColor: theme.colors.primary,
                      color: themeContrast || '#000000',
                      boxShadow: `0 0 16px ${theme.colors.primary}40`,
                    }
                  : {}
              }
            >
              <TrendingUp className="w-4 h-4" />
              <span>3. Simulador de Retorno ROI</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono transition-all whitespace-nowrap ${
                activeTab === 'architecture'
                  ? 'font-bold shadow-lg'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
              style={
                activeTab === 'architecture'
                  ? {
                      backgroundColor: theme.colors.primary,
                      color: themeContrast || '#000000',
                      boxShadow: `0 0 16px ${theme.colors.primary}40`,
                    }
                  : {}
              }
            >
              <Layers className="w-4 h-4" />
              <span>4. Stack & Arquitetura Cloud</span>
            </button>
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* TAB 1: SPEED & CORE WEB VITALS */}
          {activeTab === 'speed' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Gauge 
                      className="w-5 h-5 transition-colors duration-500" 
                      style={{ color: theme.colors.primary }}
                    />
                    <span>Auditoria de Performance ao Vivo</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
                    Medição real baseada nos padrões do Google Lighthouse v12 e Core Web Vitals 2026.
                  </p>
                </div>
                <div 
                  className="px-4 py-2 rounded-xl border text-center shrink-0"
                  style={{
                    backgroundColor: `${theme.colors.primary}10`,
                    borderColor: `${theme.colors.primary}30`,
                  }}
                >
                  <div 
                    className="text-2xl sm:text-3xl font-black font-mono transition-colors duration-500"
                    style={{ color: theme.colors.primary }}
                  >
                    99/100
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">PageSpeed Score</div>
                </div>
              </div>

              {/* Vitals Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[11px] font-mono text-zinc-400 mb-1 flex items-center justify-between">
                    <span>TTFB (Time to First Byte)</span>
                    <span 
                      className="font-bold font-mono"
                      style={{ color: theme.colors.primary }}
                    >
                      BOM
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">18ms</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Cloudflare Edge + Next.js ISR</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[11px] font-mono text-zinc-400 mb-1 flex items-center justify-between">
                    <span>FCP (First Contentful Paint)</span>
                    <span 
                      className="font-bold font-mono"
                      style={{ color: theme.colors.primary }}
                    >
                      BOM
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">0.28s</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Critical CSS Inlining</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[11px] font-mono text-zinc-400 mb-1 flex items-center justify-between">
                    <span>LCP (Largest Contentful Paint)</span>
                    <span 
                      className="font-bold font-mono"
                      style={{ color: theme.colors.primary }}
                    >
                      BOM
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">0.65s</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Next/Image AVIF & WebP</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[11px] font-mono text-zinc-400 mb-1 flex items-center justify-between">
                    <span>CLS (Cumulative Layout Shift)</span>
                    <span 
                      className="font-bold font-mono"
                      style={{ color: theme.colors.primary }}
                    >
                      BOM
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">0.00</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Zero layout shifting</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI & AUTONOMOUS AGENTS */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles 
                      className="w-5 h-5 transition-colors duration-500" 
                      style={{ color: theme.colors.primary }}
                    />
                    <span>Pipeline de IA Proprietária & RAG</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
                    Integração de agentes autônomos para automação de atendimento, extração de dados e conversão 24/7.
                  </p>
                </div>
              </div>

              {/* Visual Workflow Illustration */}
              <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-black/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/imgs/service_ai_agent.jpg"
                  alt="AI Autonomous Agent Neural Graph"
                  className="w-full h-full object-cover object-center opacity-85 hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2 text-xs font-mono text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Google Cloud Vertex AI + RAG Vector Engine Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 text-xs font-mono font-bold"
                      style={{
                        backgroundColor: `${theme.colors.primary}20`,
                        color: theme.colors.primary,
                      }}
                    >
                      01
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">Ingestão & Vetorização</h4>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      Transformação automática de PDFs, vídeos e catálogos em embeddings no Google Cloud Vertex AI.
                    </p>
                  </div>
                  <div 
                    className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono"
                    style={{ color: theme.colors.primary }}
                  >
                    Latência: 45ms
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 text-xs font-mono font-bold">
                      02
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">RAG Contextual</h4>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      Respostas 100% blindadas sem alucinação com base estrita no conhecimento da sua empresa.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono text-cyan-400">
                    Acurácia: 99.4%
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 text-xs font-mono font-bold">
                      03
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">Tool Calling & Checkout</h4>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      O agente consulta disponibilidade em tempo real, gera links de pagamento e fecha vendas sozinho.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono text-emerald-400">
                    Disponibilidade: 24/7/365
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONVERSION CALCULATOR */}
          {activeTab === 'conversion' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp 
                      className="w-5 h-5 transition-colors duration-500" 
                      style={{ color: theme.colors.primary }}
                    />
                    <span>Calculadora de Impacto Financeiro (ROI)</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
                    Simule o retorno gerado pela elevação da sua taxa de conversão para o padrão da AG47.
                  </p>
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-white/5 border border-white/10">
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="text-zinc-300">Tráfego Mensal (Visitantes):</span>
                    <span 
                      className="font-bold text-sm"
                      style={{ color: theme.colors.primary }}
                    >
                      {trafficMonthly.toLocaleString('pt-PT')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={trafficMonthly}
                    onChange={(e) => setTrafficMonthly(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[var(--primary-color)]"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                    <span>1.000</span>
                    <span>50.000</span>
                    <span>100.000</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="text-zinc-300">Ticket Médio por Venda:</span>
                    <span 
                      className="font-bold text-sm"
                      style={{ color: theme.colors.primary }}
                    >
                      €{averageTicket}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="5"
                    value={averageTicket}
                    onChange={(e) => setAverageTicket(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[var(--primary-color)]"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                    <span>€10</span>
                    <span>€250</span>
                    <span>€500</span>
                  </div>
                </div>
              </div>

              {/* Results Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xs text-zinc-400 font-mono mb-1">Faturamento Atual (1.2% conv.)</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-300">
                    €{Math.round(currentRevenue).toLocaleString('pt-PT')} /mês
                  </div>
                </div>

                <div 
                  className="p-4 rounded-2xl border"
                  style={{
                    backgroundColor: `${theme.colors.primary}12`,
                    borderColor: `${theme.colors.primary}40`,
                  }}
                >
                  <div 
                    className="text-xs font-mono mb-1 font-semibold"
                    style={{ color: theme.colors.primary }}
                  >
                    Faturamento Padrão AG47 (3.4% conv.)
                  </div>
                  <div 
                    className="text-xl sm:text-2xl font-black font-mono"
                    style={{ color: theme.colors.primary }}
                  >
                    €{Math.round(projectedRevenue).toLocaleString('pt-PT')} /mês
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xs text-cyan-300 font-mono mb-1 font-semibold">Ganho Anual Adicional Estimado</div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-cyan-400">
                    +€{Math.round(annualGain).toLocaleString('pt-PT')} /ano
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ARCHITECTURE & CLOUD */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Layers 
                      className="w-5 h-5 transition-colors duration-500" 
                      style={{ color: theme.colors.primary }}
                    />
                    <span>Stack de Engenharia & Zero-Trust Cloud</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
                    Arquitetura desacoplada e distribuída globalmente para suporte a picos de tráfego sem queda de servidor.
                  </p>
                </div>
              </div>

              {/* Visual Global Infrastructure Banner */}
              <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-black/80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/imgs/mapa-mundi-real-optimized.webp"
                  alt="Global Edge Infrastructure Topology"
                  className="w-full h-full object-cover object-center opacity-70 hover:opacity-90 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>310+ Global Edge Locales Active</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Google Cloud Serverless + Edge CDN Cache: 99.98% Hit Rate
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xs font-bold text-white mb-1 flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-cyan-400" />
                    <span>Edge Network</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">
                    Renderização instantânea nos servidores mais próximos de cada utilizador (310+ nós no mundo).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xs font-bold text-white mb-1 flex items-center gap-2">
                    <Database 
                      className="w-4 h-4 transition-colors duration-500" 
                      style={{ color: theme.colors.primary }}
                    />
                    <span>Google Cloud / Firebase</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">
                    Bancos de dados NoSQL/PostgreSQL com replicação em tempo real e segurança Zero-Trust nativa.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xs font-bold text-white mb-1 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Segurança SSL / WAF</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">
                    Proteção DDoS automatizada, cabeçalhos de segurança estritos e conformidade com RGPD/LGPD.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xs font-bold text-white mb-1 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span>Observabilidade 24/7</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">
                    Rastreamento contínuo de logs, latência e conversão com alertas automáticos em tempo real.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
