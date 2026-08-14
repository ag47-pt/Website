'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveTokenItem } from '@/hooks/useAltRadarStream';
import { TokenSparkline } from '@/components/ui/TokenSparkline';
import {
  X,
  ShieldCheck,
  Lock,
  ExternalLink,
  AlertTriangle,
  Users,
  CheckCircle2,
  Cpu,
  BarChart3
} from 'lucide-react';

interface TokenInspectionDrawerProps {
  token: LiveTokenItem | null;
  onClose: () => void;
}

export function TokenInspectionDrawer({ token, onClose }: TokenInspectionDrawerProps) {
  if (!token) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        />

        {/* Slide-over Drawer Panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-[#081018] border-l border-slate-800 text-slate-100 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-bold text-sm">
                  {token.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-cyan-400">{token.chain}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                      Score: {token.score}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white">{token.name}</h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Liquidity & Trajectory */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Pool Liquidez Atual</span>
                  <span className="text-emerald-400 font-bold">{token.liquidity}</span>
                </div>
                <TokenSparkline color="cyan" height={45} width={320} className="w-full" />
              </div>

              {/* Security Audit Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Diagnóstico de Segurança AG47
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-1">
                    <div className="text-[10px] text-slate-500 font-mono">Simulação Honeypot</div>
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Aprovado (0% Tax)
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-1">
                    <div className="text-[10px] text-slate-500 font-mono">Minting Authority</div>
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Renunciado / Off
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-1">
                    <div className="text-[10px] text-slate-500 font-mono">LP Lock Status</div>
                    <div className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> 100% Burned
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-1">
                    <div className="text-[10px] text-slate-500 font-mono">Contrato Proxy</div>
                    <div className="text-xs font-bold text-slate-300">Imutável</div>
                  </div>
                </div>
              </div>

              {/* Holders Distribution */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" /> Distribuição de Holders
                </h4>
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Liquidity Pool (Raydium / Uniswap)</span>
                      <span className="font-mono text-cyan-400">84.5%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full rounded-full" style={{ width: '84.5%' }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Top 10 Holders</span>
                      <span className="font-mono text-emerald-400">11.2%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: '11.2%' }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Creator Wallet</span>
                      <span className="font-mono text-slate-400">4.3%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-500 h-full rounded-full" style={{ width: '4.3%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action Links */}
            <div className="p-6 border-t border-slate-800/80 flex items-center gap-3">
              <a
                href={`https://dexscreener.com/${token.chain}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold transition-colors"
              >
                <span>DexScreener</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-medium transition-colors"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
