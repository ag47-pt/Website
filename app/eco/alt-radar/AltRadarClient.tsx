'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ALT_RADAR_CONFIG } from '@/data/alt-radar';
import { useAltRadarStream } from '@/hooks/useAltRadarStream';
import { TokenSparkline } from '@/components/ui/TokenSparkline';
import { TokenInspectionDrawer } from '@/components/ui/TokenInspectionDrawer';
import { LiveTokenItem } from '@/hooks/useAltRadarStream';
import {
  Radar,
  Search,
  ShieldCheck,
  TrendingUp,
  Cpu,
  ArrowRight,
  Check,
  Copy,
  Zap,
  Activity,
  Radio,
  Lock,
  Eye,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function AltRadarClient() {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'features' | 'security' | 'architecture'>('features');
  const [inspectedToken, setInspectedToken] = useState<LiveTokenItem | null>(null);
  const stream = useAltRadarStream();

  const copyPath = () => {
    navigator.clipboard.writeText(ALT_RADAR_CONFIG.repoPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050b10] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-cyan-500/10 via-emerald-500/5 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-emerald-500/5 blur-[160px] rounded-full" />
        <div className="absolute top-[70%] -left-[10%] w-[600px] h-[600px] bg-cyan-500/5 blur-[160px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-16">
        {/* Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AG47 ECOSYSTEM MODULE • {ALT_RADAR_CONFIG.status}
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
            {ALT_RADAR_CONFIG.name}
            <span className="block bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-200 bg-clip-text text-transparent mt-2">
              Intelligence & Discovery Engine
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl font-light leading-relaxed">
            {ALT_RADAR_CONFIG.tagline}. Integrado nativamente no ecossistema AG47 em{' '}
            <code className="text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded font-mono text-sm border border-cyan-800/40">
              /eco/alt-radar
            </code>
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={copyPath}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/50 text-slate-200 font-mono text-sm transition-all duration-200 shadow-lg hover:shadow-cyan-500/10 group"
            >
              <Zap className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>{ALT_RADAR_CONFIG.repoPath}</span>
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              )}
            </button>

            <a
              href="#metrics"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-semibold text-sm transition-all duration-200 shadow-lg shadow-cyan-500/20"
            >
              <span>Explorar Métricas</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          id="metrics"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {ALT_RADAR_CONFIG.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-300 space-y-3 group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>{metric.label}</span>
                {metric.change && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/40 font-mono text-[10px]">
                    {metric.change}
                  </span>
                )}
              </div>
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight group-hover:text-cyan-400 transition-colors">
                {metric.value}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{metric.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Live Stream Telemetry Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-slate-900/80 via-cyan-950/30 to-slate-900/80 border border-cyan-500/20 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Stream Proxy Telemetry</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    stream.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{stream.statusMessage}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {stream.lastPing && (
              <span className="text-slate-400">Último Ping: <code className="text-cyan-300">{stream.lastPing}</code></span>
            )}
            <button
              onClick={stream.reconnect}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 transition-colors"
            >
              Reconectar Stream
            </button>
          </div>
        </motion.div>

        {/* Live Token Signal Cards with Sparklines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Sinais Detetados em Tempo Real
            </h3>
            <span className="text-xs text-slate-500 font-mono">Real-time Feed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stream.liveFeed.map((token, idx) => {
              const sparkData =
                idx === 0
                  ? [10, 14, 18, 24, 22, 35, 48, 52, 60, 75, 84, 94]
                  : idx === 1
                  ? [20, 25, 30, 28, 40, 45, 55, 62, 70, 78, 82, 88]
                  : [15, 20, 18, 30, 25, 42, 38, 50, 60, 58, 65, 76];
              const colorTheme = idx === 0 ? 'emerald' : idx === 1 ? 'cyan' : 'amber';

              return (
                <div
                  key={token.id}
                  onClick={() => setInspectedToken(token)}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 backdrop-blur-xl space-y-3 group transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cyan-500/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                        {token.chain}
                      </span>
                      <h4 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                        {token.symbol}
                      </h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        token.riskLevel === 'LOW'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-800/40'
                      }`}
                    >
                      Score: {token.score}
                    </span>
                  </div>

                  <div className="flex items-end justify-between pt-1">
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono">Liquidez Pool</div>
                      <div className="text-sm font-bold text-slate-200 font-mono">{token.liquidity}</div>
                    </div>
                    <TokenSparkline data={sparkData} color={colorTheme} width={90} height={32} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex justify-center border-b border-slate-800 pb-4">
          <div className="flex p-1 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <button
              onClick={() => setSelectedTab('features')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                selectedTab === 'features'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Capacidades Principais
            </button>
            <button
              onClick={() => setSelectedTab('security')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                selectedTab === 'security'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Matriz de Risco & Auditoria
            </button>
            <button
              onClick={() => setSelectedTab('architecture')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                selectedTab === 'architecture'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Arquitetura & Integração
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        {selectedTab === 'features' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {ALT_RADAR_CONFIG.features.map((feat) => {
              const IconComp =
                feat.id === 'discovery'
                  ? Search
                  : feat.id === 'security-audit'
                  ? ShieldCheck
                  : feat.id === 'social-radar'
                  ? TrendingUp
                  : Cpu;

              return (
                <div
                  key={feat.id}
                  className="p-8 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 space-y-4 relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                      <IconComp className="w-6 h-6" />
                    </div>
                    {feat.badge && (
                      <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                        {feat.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </motion.div>
        )}

        {selectedTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {ALT_RADAR_CONFIG.securityCategories.map((cat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-white">{cat.category}</h4>
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-cyan-400 font-mono text-xs font-semibold">
                    Peso: {cat.weight}
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{cat.description}</p>
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  {cat.checks.map((chk, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{chk}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {selectedTab === 'architecture' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-6"
          >
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">Estrutura do Módulo em `eco/alt-radar`</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              O módulo foi totalmente integrado à estrutura corporativa AG47, isolado para execução determinística
              e interoperabilidade com microsserviços de inteligência artificial do Nexus.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="text-xs font-mono text-cyan-400">Backend API (`apps/api`)</div>
                <p className="text-xs text-slate-400">FastAPI, Python Async, Provedores DexScreener/Gecko/GoPlus.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="text-xs font-mono text-emerald-400">Frontend Web (`apps/web`)</div>
                <p className="text-xs text-slate-400">Next.js App Router, Tailwind CSS, TanStack Query & WebSockets.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="text-xs font-mono text-teal-400">Integração ECO (`/eco/alt-radar`)</div>
                <p className="text-xs text-slate-400">Rota ativa no ecossistema com SEO, OpenGraph e monitorização contínua.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Token Inspection Drawer Modal */}
        <TokenInspectionDrawer
          token={inspectedToken}
          onClose={() => setInspectedToken(null)}
        />
      </div>
    </div>
  );
}
