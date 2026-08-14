'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, Radio, Cpu, RefreshCw, Copy, Check, ChevronUp, ChevronDown, X, ShieldCheck, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ALL_SITEMAP_ITEMS } from '@/data/ecosystem-sitemap';
import { isSoundEnabled, setSoundEnabled, playPingSound, playClickSound } from '@/lib/audio/sound-fx';

interface SitemapStatusWidgetProps {
  hubName?: string;
  totalNodes?: number;
}

export function SitemapStatusWidget({
  hubName = 'ECO_MESH',
  totalNodes = ALL_SITEMAP_ITEMS.length,
}: SitemapStatusWidgetProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [latency, setLatency] = useState(12);
  const [isPinging, setIsPinging] = useState(false);
  const [memoryUsage, setMemoryUsage] = useState(42.4);
  const [copied, setCopied] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [uptimeSeconds, setUptimeSeconds] = useState(86400 * 3 + 1420);

  // Carrega preferência de áudio no mount
  useEffect(() => {
    setSoundActive(isSoundEnabled());
  }, []);

  const handleToggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    setSoundEnabled(next);
    if (next) {
      setTimeout(() => playPingSound(), 50);
    }
  };

  // Simula pequenas variações de telemetria em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(Math.max(prev + delta, 8), 24);
      });
      setMemoryUsage((prev) => {
        const delta = (Math.random() * 0.4 - 0.2);
        return parseFloat(Math.min(Math.max(prev + delta, 38.0), 48.0).toFixed(1));
      });
      setUptimeSeconds((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handlePing = () => {
    if (isPinging) return;
    setIsPinging(true);
    playPingSound();
    setTimeout(() => {
      const newLatency = Math.floor(Math.random() * 8) + 8; // 8ms a 16ms
      setLatency(newLatency);
      setIsPinging(false);
    }, 600);
  };

  const handleCopySpecs = () => {
    playClickSound();
    const specs = [
      `--- AG47 TELEMETRY REPORT ---`,
      `HUB: ${hubName}`,
      `STATUS: OPERATIONAL (99.98% SLA)`,
      `PROTOCOL_VERSION: v1.0.4-production`,
      `NETWORK_LATENCY: ${latency}ms`,
      `ACTIVE_NODES: ${totalNodes}`,
      `HEAP_ALLOCATION: ${memoryUsage} MB / 128 MB`,
      `UPTIME: 99.98%`,
      `TIMESTAMP: ${new Date().toISOString()}`,
    ].join('\n');

    navigator.clipboard.writeText(specs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatUptime = (secs: number) => {
    const d = Math.floor(secs / (3600 * 24));
    const h = Math.floor((secs % (3600 * 24)) / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 select-none">
      {/* Botão de Toggle Colapsado */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-zinc-950/85 backdrop-blur-xl border border-white/10 hover:border-white/25 text-white shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105"
          style={{
            borderColor: `${theme.colors.primary}30`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <Terminal className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
          </div>

          <div className="flex items-center gap-2 text-[9px] font-mono tracking-widest text-gray-300 uppercase">
            <span className="hidden sm:inline text-gray-500">PROT:</span>
            <span className="font-bold text-white">v1.0.4</span>
            <span className="text-gray-600">•</span>
            <span style={{ color: theme.colors.primary }}>{latency}ms</span>
          </div>

          <ChevronUp className="w-3 h-3 text-gray-500 group-hover:text-white transition-transform" />
        </motion.button>
      )}

      {/* Mini Terminal Expandido */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-80 sm:w-96 rounded-2xl bg-zinc-950/95 backdrop-blur-2xl border border-white/15 p-4 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-4"
            style={{
              borderColor: `${theme.colors.primary}40`,
            }}
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <span className="text-[10px] font-mono font-black tracking-widest text-white uppercase flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
                  HUD_TELEMETRIA // {hubName}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleToggleSound}
                  className={`px-2 py-1 rounded-lg border text-[8px] font-mono flex items-center gap-1 transition-all ${
                    soundActive
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'
                  }`}
                  title={soundActive ? 'Áudio Sintético Ativo' : 'Áudio Mudo'}
                >
                  {soundActive ? (
                    <Volume2 className="w-3 h-3 text-green-400" />
                  ) : (
                    <VolumeX className="w-3 h-3 text-gray-500" />
                  )}
                  <span className="hidden sm:inline">{soundActive ? 'SND: ON' : 'MUTE'}</span>
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Diagnostic Grid */}
            <div className="space-y-2.5 text-[9.5px] font-mono">
              {/* Status e Versão */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="text-[8px] text-gray-500 uppercase tracking-wider">Estado do Sistema</div>
                  <div className="flex items-center gap-1.5 font-bold text-green-400">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>OPERACIONAL</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="text-[8px] text-gray-500 uppercase tracking-wider">Versão Protocolo</div>
                  <div className="font-bold text-white">v1.0.4-prod</div>
                </div>
              </div>

              {/* Heap e Nós */}
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[8px] uppercase text-gray-500">
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-gray-400" />
                    Consumo Heap Simulado
                  </span>
                  <span className="text-white font-bold">{memoryUsage} MB / 128 MB</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${(memoryUsage / 128) * 100}%`,
                      backgroundColor: theme.colors.primary,
                    }}
                    animate={{ width: `${(memoryUsage / 128) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Latência e Uptime */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-[8px] text-gray-500 uppercase">Latência</div>
                    <div className="font-bold text-white text-xs" style={{ color: theme.colors.primary }}>
                      {latency} ms
                    </div>
                  </div>
                  <button
                    onClick={handlePing}
                    disabled={isPinging}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all disabled:opacity-50"
                    title="Disparar Ping"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-[8px] text-gray-500 uppercase">Nós Ativos</div>
                  <div className="font-bold text-white text-xs">{totalNodes} Módulos</div>
                </div>
              </div>
            </div>

            {/* Terminal Actions Footer */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={handleCopySpecs}
                className="flex-1 py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-1.5 text-[8.5px] font-mono text-gray-300 hover:text-white transition-all"
              >
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'SPECS COPIADAS!' : 'COPIAR DIAGNÓSTICO'}</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-[8.5px] font-mono text-gray-400 hover:text-white transition-all"
              >
                MINIMIZAR
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
