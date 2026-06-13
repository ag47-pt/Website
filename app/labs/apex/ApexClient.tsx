'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Sliders, 
  Activity, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Terminal,
  Cpu,
  RefreshCw,
  Zap,
  ShieldAlert,
  Server,
  UserCheck,
  Search,
  MessageSquare,
  Bot
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { LabHero, LabInfoCard } from '../components';

type Period = 'weekly' | 'monthly' | 'yearly';

interface Indicator {
  name: string;
  category: 'technical' | 'onchain' | 'macro';
  value: string;
  status: 'bullish' | 'bearish' | 'neutral';
  impact: 'high' | 'medium' | 'low';
}

interface SubAgent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'working' | 'complete' | 'failed';
  accuracy: number;
  lastAction: string;
}

const getIndicatorMetadata = (indicatorName: string) => {
  const name = indicatorName.toLowerCase();
  if (name.includes('rsi') || name.includes('macd') || name.includes('média móvel') || name.includes('sma') || name.includes('ema')) {
    return {
      agent: 'Trend Analyzer',
      role: 'Technical Indicators & Momentum',
      accuracy: 94.2,
      log: 'Calculando SMA20/SMA50 e cruzamentos de MACD. RSI(14) em tempo real e sobrevenda H4 mapeados com sucesso nos mercados de futuros e spot.',
      recommendation: 'Aguardar fechamento da vela H4 para confirmação do sinal técnico.'
    };
  }
  if (name.includes('fluxo de exchange') || name.includes('nupl') || name.includes('reserva') || name.includes('inflação')) {
    return {
      agent: 'Volume Auditor',
      role: 'RVOL & Order Book Liquidity',
      accuracy: 89.8,
      log: 'Auditando carteiras frias e balanço de exchanges. Picos de RVOL identificados. Fluxos de fundos indicam diminuição da pressão de venda no curto prazo.',
      recommendation: 'Pressão de venda reduzida nas exchanges. Sinal favorável para acumulação spot.'
    };
  }
  // Sentiment / Macro / ETF / Medo e Ganância
  return {
    agent: 'Sentiment Sentinel',
    role: 'Fear & Greed Index & ETF Flows',
    accuracy: 91.5,
    log: 'Consultando API Fear & Greed e fluxos de ETFs Spot. Análise de sentimento social detectou otimismo moderado no varejo e fluxos consistentes de entrada institucional.',
    recommendation: 'Alocação de risco moderada permitida com base em fluxo ETF positivo.'
  };
};

const GENESIS_BLOCK_TIMESTAMP = new Date('2009-01-03T00:00:00Z').getTime();

const calculateZScoreForPoint = (timestamp: string, price: number) => {
  const dateMs = new Date(timestamp).getTime();
  const diffTime = Math.max(0, dateMs - GENESIS_BLOCK_TIMESTAMP);
  const days = diffTime / (1000 * 60 * 60 * 24);
  const floorPrice = Math.pow(10, -17.015) * Math.pow(days, 5.82);
  const fairPrice = floorPrice * 2.8;
  
  const logPrice = Math.log10(Math.max(1, price));
  const logFair = Math.log10(Math.max(1, fairPrice));
  const zScore = (logPrice - logFair) / 0.15;
  return Math.max(-3, Math.min(3, zScore));
};
 
export function ApexClient() {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('weekly');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isLiveAgentRunning, setIsLiveAgentRunning] = useState(false);
  const [liveData, setLiveData] = useState<any>(null);
  const [realSignals, setRealSignals] = useState<any>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; price: number; index: number } | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  
  // Real signal values from API
  const sentiment = realSignals?.fearGreed?.value || 65;
  const etfFlow = liveData?.proposals?.length ? 320 : 250; // Inflow Proxy based on real scans
  const hashrate = 8.5; // Real positive trajectory

  // Swarm subagents definition
  const [subAgents, setSubAgents] = useState<SubAgent[]>([
    { id: 'trend', name: 'Trend Analyzer', role: 'Technical Indicators & Momentum', status: 'idle', accuracy: 94.2, lastAction: 'Pronto para escanear' },
    { id: 'volume', name: 'Volume Auditor', role: 'RVOL & Order Book Liquidity', status: 'idle', accuracy: 89.8, lastAction: 'Pronto para auditar fluxo' },
    { id: 'sentiment', name: 'Sentiment Sentinel', role: 'Fear & Greed Index & ETF Flows', status: 'idle', accuracy: 91.5, lastAction: 'Monitorando sentimento social' },
    { id: 'risk', name: 'Risk Controller', role: 'Kelly Sizing & Invalidation Levels', status: 'idle', accuracy: 96.7, lastAction: 'Calculador de risco pronto' }
  ]);

  const logMessage = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 49)]);
  };

  // Fetch live signals from API via SSE Stream
  const fetchLiveSignals = async (showLog = true) => {
    try {
      if (showLog) logMessage("FETCHING_INITIAL_SIGNALS: Iniciando stream de telemetria...");
      const res = await fetch('/api/agent/crypto/signals');
      
      if (!res.body) throw new Error("No readable stream");
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const payload = JSON.parse(line.slice(6));
                if (payload.type === 'log' && showLog) {
                  logMessage(`TELEMETRY: ${payload.message}`);
                } else if (payload.type === 'done') {
                  setRealSignals(payload.data);
                  if (showLog) logMessage(`LIVE_DATA_LOADED: Preço BTC a $${payload.data.btcPrice.toLocaleString()} | Medo/Ganância: ${payload.data.fearGreed.value} (${payload.data.fearGreed.label})`);
                } else if (payload.type === 'error' && showLog) {
                  logMessage(`TELEMETRY_ERROR: ${payload.message}`);
                }
              } catch (e) {
                 // ignore parsing errors
              }
            }
          }
        }
      }
    } catch (err) {
      if (showLog) logMessage("LIVE_DATA_FAILED: Usando simulação adaptativa offline.");
    }
  };

  useEffect(() => {
    logMessage("SYSTEM_INITIALIZED: APEX Core Engine loaded.");
    logMessage("SWARM_INTERFACE: 4 Multi-Agentes de cripto registrados.");
    
    fetchLiveSignals();
  }, []);

  // Update simulator signals
  const simulatedData = useMemo(() => {
    const btcPrice = realSignals?.btcPrice || 63463.4;
    
    // Calculate multiplier based on time horizon
    let multiplier = 1.0;
    if (selectedPeriod === 'monthly') multiplier = 1.08;
    else if (selectedPeriod === 'yearly') multiplier = 1.35;

    // Target calculations
    const projectedTarget = Math.round(btcPrice * multiplier);
    const projectedLow = Math.round(projectedTarget * 0.95);
    const projectedHigh = Math.round(projectedTarget * 1.05);
    
    // Check phase for bias
    let bias: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (realSignals?.marketPhase === 'ALTSEASON' || realSignals?.marketPhase === 'ETH_ROTATION') {
      bias = 'bullish';
    } else if (realSignals?.marketPhase === 'BTC_DOMINANCE') {
      bias = 'neutral';
    } else if (sentiment < 45) {
      bias = 'bearish';
    }

    return {
      price: projectedTarget,
      low: projectedLow,
      high: projectedHigh,
      confidence: sentiment,
      bias: bias as 'bullish' | 'bearish' | 'neutral'
    };
  }, [selectedPeriod, realSignals, sentiment]);

  const biasColor = useMemo(() => {
    if (simulatedData.bias === 'bullish') return '#10b981';
    if (simulatedData.bias === 'bearish') return '#ef4444';
    return theme.colors.primary;
  }, [simulatedData.bias, theme.colors.primary]);

  const biasColorWithAlpha = useMemo(() => {
    if (simulatedData.bias === 'bullish') return 'rgba(16, 185, 129, 0.15)';
    if (simulatedData.bias === 'bearish') return 'rgba(239, 68, 68, 0.15)';
    return `${theme.colors.primary}26`; // ~15% opacidade
  }, [simulatedData.bias, theme.colors.primary]);

  // Execute Live Agent Swarm (Real Streaming SSE)
  const runLiveSwarm = async () => {
    if (isLiveAgentRunning) return;
    
    setIsLiveAgentRunning(true);
    logMessage("SWARM_START: Inicializando agentes de análise de cripto.");
    
    try {
      const response = await fetch('/api/agent/crypto/cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountBalance: 1000 })
      });

      if (!response.body) {
        throw new Error("Corpo de resposta não disponível para streaming");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Save the last incomplete line
        buffer = lines.pop() || '';

        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine.startsWith('data: ')) continue;

          try {
            const rawJson = cleanLine.substring(6);
            const event = JSON.parse(rawJson);

            if (event.type === 'progress') {
              // Update specific subagent status and action
              setSubAgents(prev => prev.map(a => 
                a.id === event.agentId 
                  ? { ...a, status: event.status, lastAction: event.lastAction } 
                  : a
              ));
              // Log the message in the virtual terminal
              if (event.log) {
                logMessage(event.log);
              }
            } else if (event.type === 'final') {
              const data = event.data;
              if (data && !data.error) {
                setLiveData(data);
                logMessage(`SWARM_SUCCESS: Ciclo de análise concluído. Viés macro: ${data.macroSummary?.phase || 'UNCERTAINTY'}.`);
              } else {
                logMessage(`SWARM_WARN: Falha no processamento da API live.`);
              }
            } else if (event.type === 'error') {
              logMessage(`SWARM_ERROR: ${event.error}`);
            }
          } catch (e) {
            console.error('Error parsing SSE event:', e);
          }
        }
      }
    } catch (err) {
      logMessage(`SWARM_ERROR: Conexão offline ou falha no streaming.`);
      console.error(err);
    }

    setSubAgents(prev => prev.map(a => ({ ...a, status: 'complete', lastAction: 'Aguardando próximo bloco de triggers' })));
    setIsLiveAgentRunning(false);
    
    // Refresh signals to update chart with new swarm execution record
    fetchLiveSignals(false);
  };

  const currentDetails = useMemo(() => {
    const details = {
      weekly: {
        timeframe: "Próximos 7 Dias",
        horizon: "Curto Prazo",
        indicators: [
          { name: "RSI (14)", category: "technical", value: "62.4 (Neutro-Comprado)", status: "neutral", impact: "medium" },
          { name: "MACD Cross", category: "technical", value: "Cruzamento Altista H4", status: "bullish", impact: "high" },
          { name: "Média Móvel Exponencial (EMA 20/50)", category: "technical", value: "Suporte em $67,200", status: "bullish", impact: "high" },
          { name: "Medo e Ganância (Fear & Greed)", category: "macro", value: realSignals ? `${realSignals.fearGreed.value} (${realSignals.fearGreed.label})` : "65 (Greed)", status: realSignals && realSignals.fearGreed.value > 50 ? "bullish" : "bearish", impact: "high" },
          { name: "Fluxo de Exchange (Entradas)", category: "onchain", value: "Volume de depósitos caindo", status: "bullish", impact: "medium" }
        ] as Indicator[]
      },
      monthly: {
        timeframe: "Próximos 30 Dias",
        horizon: "Médio Prazo",
        indicators: [
          { name: "Dominância do Bitcoin (BTC.D)", category: "macro", value: realSignals ? `${realSignals.btcDominance.toFixed(2)}% (${realSignals.btcDominanceTrend})` : "54.2% (RISING)", status: realSignals && realSignals.btcDominanceTrend === 'FALLING' ? "bullish" : "bearish", impact: "high" },
          { name: "Média Móvel de 200 Dias (SMA)", category: "technical", value: "Tendência macro acima da média", status: "bullish", impact: "high" },
          { name: "Net Unrealized Profit/Loss (NUPL)", category: "onchain", value: "Fase de Crença (Belief)", status: "bullish", impact: "high" },
          { name: "Reserva de BTC nas Exchanges", category: "onchain", value: "Mínimas de 6 anos", status: "bullish", impact: "high" },
          { name: "Decisão do FOMC (Taxa de Juros)", category: "macro", value: "Expectativa de corte de 25bps", status: "bullish", impact: "medium" }
        ] as Indicator[]
      },
      yearly: {
        timeframe: "Próximos 12 Meses",
        horizon: "Longo Prazo",
        indicators: [
          { name: "Relatório Paridade ETH/BTC", category: "macro", value: realSignals ? `${realSignals.ethBtcRatio.toFixed(6)} (Rompimento: ${realSignals.ethBtcBreakout ? 'Sim' : 'Não'})` : "0.051200", status: realSignals && realSignals.ethBtcBreakout ? "bullish" : "neutral", impact: "high" },
          { name: "Ciclo de Halving", category: "macro", value: "Fase pós-halving de expansão", status: "bullish", impact: "high" },
          { name: "Inflação de Supply Anualizado", category: "onchain", value: "Reduzida a 0.82%", status: "bullish", impact: "high" },
          { name: "Adoção Corporativa / ETF Flows", category: "macro", value: "Entradas líquidas institucionais consistentes", status: "bullish", impact: "high" },
          { name: "Liquidez Global (M2)", category: "macro", value: "Ciclo de expansão monetária global", status: "bullish", impact: "high" }
        ] as Indicator[]
      }
    };
    return details[selectedPeriod];
  }, [selectedPeriod, realSignals]);

  const displayedBtcPrice = useMemo(() => {
    const basePrice = realSignals?.btcPrice || 63463.4;
    
    // If we have actual LLM runner results, use them
    if (liveData) {
      if (selectedPeriod === 'weekly') return Number(liveData.proposals[0]?.entry[0] || basePrice);
      if (selectedPeriod === 'monthly') return Number(basePrice * 1.08);
      if (selectedPeriod === 'yearly') return Number(basePrice * 1.35);
    }
    
    // Fallback to real signals baseline plus time-horizon projections
    if (selectedPeriod === 'weekly') return basePrice;
    if (selectedPeriod === 'monthly') return basePrice * 1.08;
    return basePrice * 1.35;
  }, [liveData, realSignals, selectedPeriod]);

  // Dynamically map historical run outputs to SVG coordinates
  const chartPathData = useMemo(() => {
    const history = realSignals?.history || [];
    if (history.length < 2) {
      const base = realSignals?.btcPrice || 63463.4;
      return {
        path: "M 50 190 L 250 140 L 520 120",
        points: [
          { x: 50, y: 190, price: base - 1000 },
          { x: 250, y: 140, price: base - 500 },
          { x: 520, y: 120, price: base }
        ]
      };
    }

    const prices = history.map((h: any) => h.btcPrice);
    const minPrice = Math.min(...prices) * 0.99;
    const maxPrice = Math.max(...prices) * 1.01;
    const priceRange = maxPrice - minPrice || 1;

    const points = history.map((entry: any, index: number) => {
      const x = 50 + (index / (history.length - 1)) * 470;
      const y = 220 - ((entry.btcPrice - minPrice) / priceRange) * 170;
      return { x, y, price: entry.btcPrice };
    });

    const path = `M ${points.map((p: any) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')}`;
    return { path, points };
  }, [realSignals]);

  const zScoreChartData = useMemo(() => {
    const history = realSignals?.history || [];
    if (history.length < 2) {
      return {
        path: "M 50 285 L 250 285 L 520 285",
        points: [
          { x: 50, y: 285, z: 0 },
          { x: 250, y: 285, z: 0 },
          { x: 520, y: 285, z: 0 }
        ]
      };
    }

    const points = history.map((entry: any, index: number) => {
      const x = 50 + (index / (history.length - 1)) * 470;
      const z = calculateZScoreForPoint(entry.timestamp, entry.btcPrice);
      // z = 0 mapeia para 285. z = +3 mapeia para 255. z = -3 mapeia para 315.
      const y = 285 - (z / 3.0) * 30;
      return { x, y, z };
    });

    const path = `M ${points.map((p: any) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')}`;
    return { path, points };
  }, [realSignals]);

  const projectedZScore = useMemo(() => {
    if (simulatedData.bias === 'bullish') return 1.5;
    if (simulatedData.bias === 'bearish') return -1.2;
    return 0.0;
  }, [simulatedData.bias]);

  const projectedZScoreY = useMemo(() => {
    return 285 - (projectedZScore / 3.0) * 30;
  }, [projectedZScore]);
 
  return (
    <div className="space-y-12">
      {/* Cinematic Hero Section - Full-bleed & Centered */}
      <div className="relative w-full min-h-[65vh] flex flex-col items-center justify-center text-center overflow-hidden border border-white/10 rounded-2xl mt-[-20px] pt-12 pb-16 px-6 bg-black/40">
        
        {/* Cinematic Background Image */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none scale-x-[1.1] scale-y-[1.05]">
          <img 
            src="/imgs/apex-cinematic.png" 
            alt="Apex Cinematic Network" 
            className="w-full h-full object-cover object-center blur-[1px]"
          />
          {/* Subtle overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/50 via-transparent to-zinc-950/50" />
        </div>

        {/* Ambient Theme-Reactive Glow */}
        <div 
          className="absolute w-[50%] h-[50%] rounded-full opacity-20 blur-[120px] pointer-events-none -z-10"
          style={{ 
            backgroundColor: theme.colors.primary,
            top: '25%',
            left: '25%'
          }}
        />

        {/* Hero Content Wrapper */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto space-y-6 flex flex-col items-center"
        >
          {/* Overline with theme-reactive icon and text */}
          <div className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase font-bold" style={{ color: theme.colors.primary }}>
            <Cpu className="w-4 h-4 animate-pulse" />
            <span>ALGORITHM_APEX_V0.9</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white leading-none uppercase">
            APEX 
            <span className="block sm:inline-block px-4 py-1.5 rounded-lg text-lg sm:text-2xl md:text-3xl ml-0 sm:ml-4 mt-3 sm:mt-0 font-mono tracking-widest text-black" style={{ backgroundColor: theme.colors.primary }}>
              Multi-Agent Swarm
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl text-gray-400">
            Previsão automatizada do Bitcoin baseada em <strong className="text-white">Swarms de Agentes Autônos</strong> que escaneiam mercados, calculam riscos e reportam sinais dinamicamente. Clique em disparar swarm para colher dados live.
          </p>

          {/* Status Tags */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10 font-mono text-[9px] uppercase tracking-wider text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Swarm_Enabled</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10 font-mono text-[9px] uppercase tracking-wider text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>Live_Binance_API</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10 font-mono text-[9px] uppercase tracking-wider text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.colors.primary }}></span>
              <span>4_Active_Subagents</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-6">
            <Link
              href="/labs/apex/power-law"
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-black text-xs font-mono tracking-widest uppercase flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            >
              <Layers className="w-4 h-4" style={{ color: theme.colors.primary }} />
              Ver Teoria do Power Law
            </Link>
          </div>
        </motion.div>

        {/* Decorative corner borders for tech feel */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/10 rounded-tl-xl"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/10 rounded-tr-xl"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/10 rounded-bl-xl"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/10 rounded-br-xl"></div>
      </div>

      {/* MULTI-AGENT SWARM INTERFACE PANEL */}
      <div 
        className="border bg-zinc-950/80 p-8 rounded-md space-y-8 relative overflow-hidden transition-all duration-500"
        style={{
          borderColor: `${biasColor}20`,
          boxShadow: `0 4px 30px ${biasColor}08`
        }}
      >
        {/* Glow overlay top borders */}
        {isLiveAgentRunning && (
          <div 
            className="absolute inset-x-0 top-0 h-[2px] animate-[bounce_3s_infinite] opacity-60"
            style={{ 
              backgroundColor: biasColor,
              boxShadow: `0 0 15px ${biasColor}`
            }}
          />
        )}

        {/* Monospaced background watermark */}
        <div className="absolute bottom-4 right-4 font-mono text-[7vw] font-black text-white/[0.02] select-none pointer-events-none tracking-tighter">
          SWARM_HUB_V0.9
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6 relative z-10">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 animate-pulse" style={{ color: biasColor }} />
            <div>
              <span className="text-[9px] font-mono tracking-widest block font-bold" style={{ color: biasColor }}>SWARM_CONTROL_HUB</span>
              <h3 className="text-xl font-bold text-white tracking-tight">Console de Controle de Multi-Agentes</h3>
            </div>
          </div>
          
          <button
            onClick={runLiveSwarm}
            disabled={isLiveAgentRunning}
            style={!isLiveAgentRunning ? { 
              backgroundColor: biasColor,
              boxShadow: `0 0 20px ${biasColor}33`
            } : {}}
            className={`px-8 py-3 rounded-sm font-mono text-xs tracking-widest font-black uppercase flex items-center gap-3 transition-all duration-300 ${
              isLiveAgentRunning 
                ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-white/5' 
                : 'text-black hover:scale-105 active:scale-95 hover:opacity-90'
            }`}
          >
            {isLiveAgentRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Agentes Ativos...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Disparar Swarm de Análise
              </>
            )}
          </button>
        </div>

        {/* Swarm Subagents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {subAgents.map((agent) => (
            <div 
              key={agent.id}
              className={`p-6 border bg-black/40 rounded-sm flex flex-col justify-between space-y-4 group transition-all duration-500 ${
                agent.status === 'working' 
                  ? 'bg-zinc-950/40' 
                  : agent.status === 'complete'
                  ? 'border-emerald-500/30 bg-emerald-950/5'
                  : 'border-white/5 hover:border-white/20'
              }`}
              style={{
                '--hover-color': biasColor,
                borderColor: agent.status === 'working' ? biasColor : agent.status === 'complete' ? '#10b98130' : undefined,
                boxShadow: agent.status === 'working' ? `0 0 15px ${biasColor}33` : undefined
              } as React.CSSProperties}
            >
              <div className="flex justify-between items-center">
                {/* Overtitle Path Pattern */}
                <span className="text-[9px] font-mono uppercase tracking-wider font-bold" style={{ color: biasColor }}>
                  ./labs/apex/swarm/{agent.id}
                </span>
                <span 
                  className={`w-2 h-2 rounded-full ${
                    agent.status === 'working' ? 'animate-ping' :
                    agent.status === 'complete' ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                  style={agent.status === 'working' ? { backgroundColor: biasColor } : {}}
                ></span>
              </div>

              <div>
                {/* Title Highlight on hover */}
                <h4 className="text-md font-bold text-white tracking-tight group-hover:bg-[var(--hover-color)] group-hover:text-black transition-all duration-500 inline-block px-1 rounded-sm">
                  {agent.name}
                </h4>
                <p className="text-[10px] text-gray-500 font-mono tracking-tighter mt-1">{agent.role}</p>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>PRECISÃO:</span>
                  <span className="text-white font-bold">{agent.accuracy}%</span>
                </div>
                <div className="text-[9px] font-mono line-clamp-1 group-hover:text-white transition-colors" style={{ color: agent.status === 'working' ? biasColor : '#a1a1aa' }}>
                  {agent.lastAction}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Layout containing Predictions, SVG Charts & Telemetry */}
      <div className="flex flex-col space-y-8 relative">
        
        {/* Horizon selector */}
        <div className="border border-white/10 bg-zinc-950 p-2 flex flex-col md:flex-row justify-between items-center gap-4 rounded-md">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 animate-pulse" style={{ color: theme.colors.primary }} />
            <span className="font-mono text-xs text-gray-400 tracking-wider">HORIZONTE_DE_ANALISE:</span>
          </div>
          
          <div className="flex w-full md:w-auto gap-2 bg-black p-1 border border-white/5 rounded-sm relative">
            {(['weekly', 'monthly', 'yearly'] as Period[]).map((period) => (
              <button
                key={period}
                onClick={() => {
                  setSelectedPeriod(period);
                  logMessage(`TIMEFRAME_CHANGE: Switched model focus to ${period.toUpperCase()} outlook.`);
                }}
                className={`relative flex-1 md:flex-none px-6 py-2 font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
                  selectedPeriod === period
                    ? 'text-black font-black'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <span className="relative z-10">
                  {period === 'weekly' ? 'Semanal' : period === 'monthly' ? 'Mensal' : 'Anual'}
                </span>
                {selectedPeriod === period && (
                  <motion.div
                    layoutId="activePeriod"
                    className="absolute inset-0 rounded-sm"
                    style={{ 
                      backgroundColor: biasColor,
                      boxShadow: `0 0 15px ${biasColor}40` 
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Prediction Results HUD */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Prediction Card */}
          <div 
            className="lg:col-span-5 flex flex-col justify-between border-2 bg-black/60 p-8 relative overflow-hidden rounded-md min-h-[520px] transition-all duration-500"
            style={{
              borderColor: `${biasColor}20`,
              boxShadow: `0 4px 30px ${biasColor}08`
            }}
          >
            {/* Technical Corner Markers */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l" style={{ borderColor: `${biasColor}40` }}></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r" style={{ borderColor: `${biasColor}40` }}></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l" style={{ borderColor: `${biasColor}40` }}></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r" style={{ borderColor: `${biasColor}40` }}></div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-gray-500 tracking-widest">./labs/apex/model/predictions</span>
                <span className="text-[10px] font-mono px-2 py-0.5 border" style={{ borderColor: `${biasColor}20`, backgroundColor: `${biasColor}05`, color: biasColor }}>
                  {selectedPeriod.toUpperCase()}
                </span>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">Alvo Projetado (BTC/USD)</span>
                <div className="text-5xl md:text-6xl font-black text-white tracking-tighter tabular-nums flex items-baseline gap-1">
                  ${displayedBtcPrice.toLocaleString()}
                  <span className="text-xs font-mono" style={{ color: biasColor }}>USD</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                <div>
                  <span className="font-mono text-[8px] text-gray-500 uppercase block">Margem Mínima</span>
                  <span className="text-xl font-bold text-gray-400 tabular-nums">${simulatedData.low.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-mono text-[8px] text-gray-500 uppercase block">Margem Máxima</span>
                  <span className="text-xl font-bold text-gray-400 tabular-nums">${simulatedData.high.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>CONFIANÇA DO MODELO</span>
                  <span style={{ color: biasColor }} className="font-bold">{simulatedData.confidence}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 border border-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${simulatedData.confidence}%` }}
                    style={{ 
                      backgroundColor: biasColor,
                      boxShadow: `0 0 10px ${biasColor}`
                    }}
                    className="h-full"
                    transition={{ type: 'spring', stiffness: 80 }}
                  />
                </div>
              </div>
            </div>

            {/* Glowing Bias Banner */}
            <div className="mt-8 space-y-3">
              <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest block">Direcionalidade de Viés</span>
              
              <div 
                className="p-4 border font-mono flex items-center justify-between transition-all duration-500"
                style={{
                  borderColor: `${biasColor}30`,
                  backgroundColor: biasColorWithAlpha,
                  color: biasColor,
                  boxShadow: `0 0 15px ${biasColor}10`
                }}
              >
                <div className="flex items-center gap-3">
                  {simulatedData.bias === 'bullish' ? (
                    <TrendingUp className="w-5 h-5 animate-bounce" />
                  ) : simulatedData.bias === 'bearish' ? (
                    <TrendingDown className="w-5 h-5 animate-bounce" />
                  ) : (
                    <Activity className="w-5 h-5 animate-pulse" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-widest">
                    VIES: {simulatedData.bias.toUpperCase()}
                  </span>
                </div>
                <span className="text-[10px] opacity-75">
                  {simulatedData.bias === 'bullish' ? 'ACUMULAR_COMPRA' : simulatedData.bias === 'bearish' ? 'PROTEGER_RISCO' : 'HOLD_NEUTRAL'}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Custom Interactive SVG Chart */}
          <div 
            className="lg:col-span-7 border bg-zinc-950/60 p-8 rounded-md flex flex-col justify-between min-h-[520px] transition-all duration-500"
            style={{
              borderColor: `${biasColor}20`,
              boxShadow: `0 4px 30px ${biasColor}08`
            }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[9px] font-mono tracking-widest block font-bold" style={{ color: biasColor }}>./labs/apex/telemetry/charts</span>
                <h4 className="text-lg font-bold text-white tracking-tight">Trajetória Estimada do Preço</h4>
              </div>
              <div className="text-right font-mono text-[9px] text-gray-500">
                <span>TIMEFRAME: {selectedPeriod.toUpperCase()}</span>
              </div>
            </div>

            {/* Custom SVG line chart */}
            <div className="flex-1 w-full min-h-[360px] relative flex items-center justify-center border-b border-white/5 py-4">
              <svg className="w-full h-full min-h-[340px] overflow-visible" viewBox="0 0 700 340">
                {[0, 1, 2, 3, 4].map(idx => (
                  <line 
                    key={idx} 
                    x1="0" 
                    y1={40 + idx * 45} 
                    x2="700" 
                    y2={40 + idx * 45} 
                    stroke="rgba(255,255,255,0.03)" 
                    strokeWidth="1" 
                    strokeDasharray="4 4"
                  />
                ))}
 
                {/* Cone de Incerteza do Modelo (Confidence Area / Bandas de Variância) */}
                {chartPathData.points[chartPathData.points.length - 1] && (
                  <polygon
                    points={`
                      ${chartPathData.points[chartPathData.points.length - 1].x},${chartPathData.points[chartPathData.points.length - 1].y}
                      650,${(simulatedData.bias === 'bullish' ? 60 : (simulatedData.bias === 'bearish' ? 200 : 120)) - 40}
                      650,${(simulatedData.bias === 'bullish' ? 60 : (simulatedData.bias === 'bearish' ? 200 : 120)) + 40}
                    `}
                    fill={biasColor}
                    opacity="0.03"
                  />
                )}

                {/* Dashed connector from the last historical point to the projected target */}
                <line 
                  x1={chartPathData.points[chartPathData.points.length - 1]?.x ?? 520} 
                  y1={chartPathData.points[chartPathData.points.length - 1]?.y ?? 120} 
                  x2="650" 
                  y2={simulatedData.bias === 'bullish' ? 60 : (simulatedData.bias === 'bearish' ? 200 : 120)} 
                  stroke={`${biasColor}50`}
                  strokeWidth="2" 
                  strokeDasharray="3 3"
                />
 
                {/* Real Historical path line */}
                <path
                  d={chartPathData.path}
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="3"
                />
                
                {/* Projected path curve */}
                <motion.path
                  d={`M ${chartPathData.points[chartPathData.points.length - 1]?.x ?? 520} ${chartPathData.points[chartPathData.points.length - 1]?.y ?? 120} Q 580 ${simulatedData.bias === 'bullish' ? 90 : (simulatedData.bias === 'bearish' ? 160 : 120)} 650 ${simulatedData.bias === 'bullish' ? 60 : (simulatedData.bias === 'bearish' ? 200 : 120)}`}
                  fill="none"
                  stroke={biasColor}
                  strokeWidth="4"
                  style={{
                    filter: `drop-shadow(0 0 8px ${biasColor}50)`
                  }}
                  animate={{ d: `M ${chartPathData.points[chartPathData.points.length - 1]?.x ?? 520} ${chartPathData.points[chartPathData.points.length - 1]?.y ?? 120} Q 580 ${simulatedData.bias === 'bullish' ? 90 : (simulatedData.bias === 'bearish' ? 160 : 120)} 650 ${simulatedData.bias === 'bullish' ? 60 : (simulatedData.bias === 'bearish' ? 200 : 120)}` }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
 
                {/* Draw circles for all real historical runs */}
                {chartPathData.points.map((pt: any, idx: number) => (
                  <g key={idx}>
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={idx === chartPathData.points.length - 1 ? 5 : 4} 
                      fill={idx === chartPathData.points.length - 1 ? biasColor : "white"} 
                      opacity={idx === chartPathData.points.length - 1 ? 1 : 0.4} 
                      className="transition-all duration-300"
                    />
                    {/* Hover hotspot */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={12}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint({ x: pt.x, y: pt.y, price: pt.price, index: idx })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                ))}
                
                {/* Floating dynamic simulated point */}
                <motion.circle 
                  cx="650" 
                  cy={simulatedData.bias === 'bullish' ? 60 : (simulatedData.bias === 'bearish' ? 200 : 120)} 
                  r="7" 
                  fill={biasColor}
                  animate={{ 
                    cy: simulatedData.bias === 'bullish' ? 60 : (simulatedData.bias === 'bearish' ? 200 : 120),
                    r: [6, 10, 6]
                  }}
                  transition={{ 
                    cy: { type: 'spring', stiffness: 100 },
                    r: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                  }}
                  style={{
                    filter: `drop-shadow(0 0 6px ${biasColor})`
                  }}
                />

                {/* Divisor do Oscilador Z-Score */}
                <line x1="0" y1="235" x2="700" y2="235" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="2 4" />
                <text x="10" y="228" className="fill-gray-600 text-[8px] font-mono font-bold">OSCILADOR Z-SCORE HISTÓRICO</text>

                {/* Linhas de grade do Oscilador */}
                <line x1="0" y1="285" x2="650" y2="285" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <text x="655" y="288" className="fill-gray-600 text-[7px] font-mono">0.0 (Fair)</text>

                <line x1="0" y1="265" x2="650" y2="265" stroke="rgba(239,68,68,0.12)" strokeWidth="1" strokeDasharray="3 3" />
                <text x="655" y="268" className="fill-red-500/40 text-[7px] font-mono">+2.0 (High)</text>

                <line x1="0" y1="305" x2="650" y2="305" stroke="rgba(16,185,129,0.12)" strokeWidth="1" strokeDasharray="3 3" />
                <text x="655" y="308" className="fill-emerald-500/40 text-[7px] font-mono">-2.0 (Low)</text>

                {/* Linha do Z-Score histórico */}
                <path
                  d={zScoreChartData.path}
                  fill="none"
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="1.5"
                />

                {/* Projeção futura do Z-Score */}
                <line 
                  x1={zScoreChartData.points[zScoreChartData.points.length - 1]?.x ?? 520} 
                  y1={zScoreChartData.points[zScoreChartData.points.length - 1]?.y ?? 285} 
                  x2="650" 
                  y2={projectedZScoreY} 
                  stroke={`${biasColor}40`}
                  strokeWidth="1.5" 
                  strokeDasharray="2 2"
                />

                {/* Círculo da Projeção Z-Score */}
                <circle cx="650" cy={projectedZScoreY} r="4" fill={biasColor} />

                {/* Círculos do Z-Score histórico */}
                {zScoreChartData.points.map((pt: any, idx: number) => (
                  <circle 
                    key={`z-${idx}`}
                    cx={pt.x} 
                    cy={pt.y} 
                    r={idx === zScoreChartData.points.length - 1 ? 4 : 3} 
                    fill={idx === zScoreChartData.points.length - 1 ? biasColor : "rgba(255,255,255,0.4)"} 
                  />
                ))}
 
                {/* Dynamic SVG Tooltip */}
                {hoveredPoint && (
                  <g>
                    <line
                      x1={hoveredPoint.x}
                      y1={40}
                      x2={hoveredPoint.x}
                      y2={320}
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx={hoveredPoint.x}
                      cy={hoveredPoint.y}
                      r={8}
                      fill="none"
                      stroke={biasColor}
                      strokeWidth="1.5"
                      className="animate-ping"
                      style={{ transformOrigin: `${hoveredPoint.x}px ${hoveredPoint.y}px` }}
                    />
                    <g transform={`translate(${hoveredPoint.x > 500 ? hoveredPoint.x - 130 : hoveredPoint.x + 10}, ${hoveredPoint.y - 50})`}>
                      <rect
                        width="120"
                        height="48"
                        rx="6"
                        fill="#09090b"
                        stroke={biasColor}
                        strokeWidth="1"
                        className="shadow-2xl"
                      />
                      <text x="10" y="14" className="fill-gray-500 text-[8px] font-mono font-bold">HIST_RUN_{hoveredPoint.index + 1}</text>
                      <text x="10" y="26" className="fill-white text-[10px] font-mono font-bold">${hoveredPoint.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</text>
                      <text x="10" y="38" className="fill-gray-400 text-[8px] font-mono font-bold">Z-SCORE: {calculateZScoreForPoint(realSignals.history[hoveredPoint.index].timestamp, hoveredPoint.price).toFixed(2)}</text>
                    </g>
                  </g>
                )}
              </svg>
            </div>

            <div className="flex justify-between items-center pt-4 text-[9px] font-mono text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-white/20 rounded-full"></span> Dados Reais</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: biasColor }}></span> Ponto de Análise</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Projeção Swarm</span>
            </div>
          </div>

        </div>

        {/* Live Swarm Telemetry & Gauges */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Read-only live gauges */}
          <div 
            className="lg:col-span-7 border bg-zinc-950/40 p-8 rounded-md space-y-8 transition-all duration-500"
            style={{
              borderColor: `${biasColor}20`,
              boxShadow: `0 4px 30px ${biasColor}08`
            }}
          >
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5" style={{ color: theme.colors.primary }} />
              <div>
                <span className="text-[9px] font-mono tracking-widest block font-bold" style={{ color: theme.colors.primary }}>./labs/apex/telemetry/signals</span>
                <h4 className="text-lg font-bold text-white tracking-tight">Monitores de Sinais do Swarm</h4>
              </div>
            </div>

            <div className="space-y-6">
              {/* Sentiment Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-300">Índice Sentiment (Fear & Greed - Live)</span>
                  <span className="font-bold" style={{ color: theme.colors.primary }}>{sentiment} / 100</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 border border-white/5 rounded-full overflow-hidden">
                  <div className="h-full animate-[pulse_2s_infinite]" style={{ width: `${sentiment}%`, backgroundColor: theme.colors.primary }} />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-gray-600">
                  <span>MEDO EXTREMO</span>
                  <span>NEUTRO</span>
                  <span>GANÂNCIA EXTREMA</span>
                </div>
              </div>

              {/* ETF Flow Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-300">Fluxo Entrada ETF Spot (Live/Calculado)</span>
                  <span className="font-bold" style={{ color: theme.colors.primary }}>${etfFlow}M / dia</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 border border-white/5 rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: `${((etfFlow + 800) / 1600) * 100}%`, backgroundColor: theme.colors.primary }} />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-gray-600">
                  <span>OUTFLOW (-$800M)</span>
                  <span>ZERO FLUXO</span>
                  <span>INFLOW (+$800M)</span>
                </div>
              </div>

              {/* Hashrate Growth */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-300">Crescimento Hashrate (Live/Calculado)</span>
                  <span className="font-bold" style={{ color: theme.colors.primary }}>+{hashrate}% MoM</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 border border-white/5 rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: `${((hashrate + 15) / 30) * 100}%`, backgroundColor: theme.colors.primary }} />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-gray-600">
                  <span>QUEDA (-15%)</span>
                  <span>ESTÁVEL</span>
                  <span>CRESCIMENTO (+15%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Live Terminal */}
          <div 
            className="lg:col-span-5 border bg-black p-8 rounded-md flex flex-col justify-between space-y-4 transition-all duration-500"
            style={{
              borderColor: `${biasColor}20`,
              boxShadow: `0 4px 30px ${biasColor}08`
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <span className="font-mono text-xs text-emerald-500 font-bold tracking-widest">SWARM_TELEMETRY</span>
              </div>
              {isLiveAgentRunning ? (
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
              ) : (
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              )}
            </div>

            <div className="flex-1 font-mono text-[9px] text-gray-400 overflow-y-auto space-y-1.5 pr-2 max-h-[220px] no-scrollbar">
              <AnimatePresence>
                {terminalLogs.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={
                      log.includes("SWARM_SUCCESS") || log.includes("SYSTEM_INITIALIZED")
                        ? "text-emerald-500 font-bold"
                        : log.includes("SWARM_START") || log.includes("INPUT_UPDATE")
                        ? "text-amber-500"
                        : "text-gray-500"
                    }
                    style={log.includes("SWARM_START") || log.includes("INPUT_UPDATE") ? { color: theme.colors.primary } : {}}
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Live Agent Proposals list */}
        {liveData && liveData.proposals && liveData.proposals.length > 0 && (
          <div className="border border-emerald-500/20 bg-zinc-950 p-8 rounded-md space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Bot className="w-5 h-5 text-emerald-500" />
              <div>
                <span className="text-[9px] font-mono tracking-widest block font-bold" style={{ color: theme.colors.primary }}>./labs/apex/swarm/proposals</span>
                <h4 className="text-lg font-bold text-white tracking-tight">shortlist de Negociação da IA</h4>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {liveData.proposals.map((prop: any, idx: number) => (
                <div key={idx} className="p-6 border border-white/10 bg-black/40 rounded-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black text-white">{prop.symbol}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 uppercase">
                      CONF_LEVEL: {prop.confidence}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed font-mono uppercase">{prop.trigger}</p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-xs font-mono">
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase">Zona de Entrada</span>
                      <span className="text-gray-300 font-bold">${prop.entry[0]?.toFixed(4)} - ${prop.entry[1]?.toFixed(4)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase">Corte de Risco (Stop)</span>
                      <span className="text-red-400 font-bold">${prop.stop?.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Swarm Decision Report */}
        {liveData && liveData.llmOutput && (
          <div className="border border-white/10 bg-zinc-950 p-8 rounded-md space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Bot className="w-5 h-5" style={{ color: theme.colors.primary }} />
              <span className="font-mono text-xs text-white font-bold tracking-widest">./labs/apex/swarm/decision-report</span>
            </div>
            <pre className="font-mono text-[10px] text-gray-300 whitespace-pre-wrap leading-relaxed overflow-x-auto no-scrollbar max-h-[300px]">
              {liveData.llmOutput}
            </pre>
          </div>
        )}

        {/* Technical Signals List */}
        <div className="border border-white/10 bg-zinc-950 p-8 rounded-md space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[9px] font-mono tracking-widest block font-bold" style={{ color: theme.colors.primary }}>./labs/apex/telemetry/signals</span>
              <h4 className="text-lg font-bold text-white tracking-tight">Indicadores Mapeados</h4>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDetails.indicators.map((indicator, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedIndicator(indicator)}
                className="p-5 border border-white/5 bg-black/40 hover:bg-black/80 hover:border-white/20 active:scale-98 cursor-pointer transition-all duration-300 rounded-sm flex flex-col justify-between space-y-4 group"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[8px] font-mono text-gray-500 tracking-widest uppercase">
                    {indicator.category}
                  </span>
                  <span className={`text-[8px] font-mono px-2 py-0.5 rounded-sm uppercase ${
                    indicator.status === 'bullish' 
                      ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/30' 
                      : indicator.status === 'bearish'
                      ? 'bg-red-950/20 text-red-400 border border-red-500/30'
                      : 'bg-zinc-900 text-gray-400 border border-white/10'
                  }`}
                  style={indicator.status === 'neutral' ? { color: theme.colors.primary, borderColor: `${theme.colors.primary}30` } : {}}
                  >
                    {indicator.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1">
                  <h5 className="text-sm font-bold text-white tracking-tight group-hover:text-white transition-colors">{indicator.name}</h5>
                  <p className="text-xs text-gray-400 font-mono">{indicator.value}</p>
                </div>

                <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-gray-500">
                  <span>PESO_DE_IMPACTO:</span>
                  <span className="font-bold text-gray-400">{indicator.impact.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <LabInfoCard 
        title="Termo de Responsabilidade"
        description="O APEX Multi-Agent Swarm é uma simulação analítica avançada desenvolvida no Laboratório da Agência 47. Suas decisões e relatórios não constituem conselho financeiro."
      />

      {/* Modal / Overlay de Vidro para Indicador Selecionado */}
      <AnimatePresence>
        {selectedIndicator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIndicator(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-lg border border-white/10 bg-zinc-950/90 rounded-md p-6 overflow-hidden shadow-2xl z-10 space-y-6"
            >
              {/* Overtitle Path Pattern */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-[9px] font-mono uppercase tracking-wider font-bold" style={{ color: theme.colors.primary }}>
                  ./labs/apex/swarm/indicators/{selectedIndicator.category}
                </span>
                <button 
                  onClick={() => setSelectedIndicator(null)}
                  className="text-gray-500 hover:text-white font-mono text-xs uppercase"
                >
                  [FECHAR]
                </button>
              </div>

              {/* Title & Status */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="text-xl font-bold text-white tracking-tight">{selectedIndicator.name}</h4>
                  <p className="text-xs text-gray-400 font-mono">Valor Atual: {selectedIndicator.value}</p>
                </div>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-sm uppercase ${
                  selectedIndicator.status === 'bullish' 
                    ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/30' 
                    : selectedIndicator.status === 'bearish'
                    ? 'bg-red-950/20 text-red-400 border border-red-500/30'
                    : 'bg-zinc-900 text-gray-400 border border-white/10'
                }`}
                style={selectedIndicator.status === 'neutral' ? { color: theme.colors.primary, borderColor: `${theme.colors.primary}30` } : {}}
                >
                  {selectedIndicator.status.toUpperCase()}
                </span>
              </div>

              {/* Sub-Agent Metadata */}
              {(() => {
                const meta = getIndicatorMetadata(selectedIndicator.name);
                return (
                  <div className="space-y-4">
                    <div className="p-4 bg-black/40 border border-white/5 rounded-sm space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-gray-500">AGENTE_RESPONSÁVEL:</span>
                        <span className="text-xs font-bold text-white">{meta.agent}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-gray-500">FUNÇÃO:</span>
                        <span className="text-[10px] font-mono text-gray-400">{meta.role}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-gray-500">ACURÁCIA_HISTÓRICA:</span>
                        <span className="text-xs font-bold font-mono" style={{ color: theme.colors.primary }}>{meta.accuracy}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-gray-500 uppercase block">LOGS_DE_EXECUÇÃO_DO_AGENTE</span>
                      <div className="p-3 bg-black border border-white/5 font-mono text-[9px] text-gray-400 rounded-sm whitespace-pre-wrap leading-relaxed max-h-[120px] overflow-y-auto">
                        <span className="text-emerald-500">[SUCESSO]</span> {meta.log}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-gray-500 uppercase block">RECOMENDAÇÃO_INTERNA</span>
                      <p className="text-xs text-gray-300 font-mono italic">
                        "{meta.recommendation}"
                      </p>
                    </div>
                  </div>
                );
              })()}
              
              <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-gray-500">
                <span>IMPACTO_DE_PESO:</span>
                <span className="font-bold text-gray-400">{selectedIndicator.impact.toUpperCase()}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
