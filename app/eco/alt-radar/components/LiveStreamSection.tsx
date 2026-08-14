'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useAltRadarStream, LiveTokenItem } from '@/hooks/useAltRadarStream';
import { TokenSparkline } from '@/components/ui/TokenSparkline';
import { 
  Radio, 
  Activity, 
  ExternalLink, 
  Eye, 
  ShieldCheck, 
  ShieldAlert, 
  TrendingUp, 
  Zap,
  RefreshCw
} from 'lucide-react';

interface LiveStreamSectionProps {
  onInspectToken: (token: LiveTokenItem) => void;
}

export function LiveStreamSection({ onInspectToken }: LiveStreamSectionProps) {
  const { theme } = useTheme();
  const stream = useAltRadarStream();

  return (
    <section id="stream-feed" className="relative py-20 md:py-32 overflow-hidden border-t border-zinc-900 bg-zinc-950/40">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold mb-4 border"
            style={{ 
              backgroundColor: `${theme.colors.primary}10`,
              borderColor: `${theme.colors.primary}30`,
              color: theme.colors.primary 
            }}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            TELEMETRIA WEBSOCKET EM TEMPO REAL
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Stream Contínuo de Descoberta
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Acompanhe o fluxo ao vivo de pools indexados pelo motor do Alt Radar, com métricas de volatilidade, sparklines e análise forense instantânea.
          </p>
        </div>

        {/* Telemetry Status Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400">
              <Activity className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">Proxy Telemetry Node</span>
                <span className={`w-2 h-2 rounded-full ${
                  stream.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-500'
                }`} />
              </div>
              <span className="text-zinc-400 text-[11px]">{stream.statusMessage}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <div className="hidden md:flex flex-col text-right text-[11px]">
              <span>Última Sincronização:</span>
              <span className="text-zinc-200 font-bold">{stream.lastPing || 'Agora'}</span>
            </div>
            <button
              onClick={stream.reconnect}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sincronizar</span>
            </button>
          </div>
        </div>

        {/* Live Token Feed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stream.liveFeed.map((token) => (
            <div 
              key={token.id}
              className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-xl hover:border-zinc-700 transition-all flex flex-col justify-between space-y-6 group"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-zinc-900 border border-zinc-800 text-white">
                      {token.symbol}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400 uppercase">
                      {token.chain}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                    token.riskLevel === 'LOW' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {token.riskLevel} RISK
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1 truncate">{token.name}</h3>
                <span className="text-xs font-mono text-zinc-400">Descoberto {token.timestamp}</span>
              </div>

              {/* Sparkline & Score */}
              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Liquidez Inicial:</span>
                  <span className="text-white font-bold">{token.liquidity}</span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Score Sintético:</span>
                  <span 
                    className="font-black text-sm"
                    style={{ color: token.score >= 80 ? theme.colors.primary : '#f59e0b' }}
                  >
                    {token.score}/100
                  </span>
                </div>

                {/* Live Sparkline Widget */}
                <div className="pt-2">
                  <TokenSparkline color={token.score >= 80 ? 'emerald' : 'amber'} />
                </div>
              </div>

              {/* Inspection CTA Button */}
              <button
                onClick={() => onInspectToken(token)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-mono text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 transition-all cursor-pointer group-hover:border-zinc-500"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Inspecionar Telemetria</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
