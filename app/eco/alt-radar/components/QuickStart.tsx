'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ALT_RADAR_CONFIG } from '@/data/alt-radar';
import { 
  Play, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Cpu, 
  FileText, 
  Radio, 
  Server, 
  Sparkles 
} from 'lucide-react';

const playSynthSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Fallback
  }
};

export function QuickStart() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'cli' | 'docker' | 'api'>('cli');
  const [copied, setCopied] = useState(false);

  const snippets = {
    cli: `# 1. Clonar repositório e instalar dependências
${ALT_RADAR_CONFIG.installCommand}

# 2. Configurar variáveis de ambiente
cp .env.example .env.local

# 3. Executar scanner em tempo real na rede Solana
${ALT_RADAR_CONFIG.quickRunCommand}`,

    docker: `# 1. Baixar imagem e executar o Daemon via Docker Compose
docker compose up -d

# 2. Verificar telemetria e logs do scanner
docker compose logs -f alt-radar-daemon

# 3. Testar endpoint de saúde local
curl -X GET http://localhost:8080/api/v1/health`,

    api: `// Exemplo de integração WebSocket em TypeScript
import WebSocket from 'ws';

const ws = new WebSocket('wss://ag47.pt/api/eco/alt-radar/stream');

ws.on('open', () => {
  console.log('[ALT-RADAR] Conectado ao stream de oportunidades');
  ws.send(JSON.stringify({ action: 'subscribe', min_score: 85 }));
});

ws.on('message', (data) => {
  const event = JSON.parse(data.toString());
  console.log('[NEW OPPORTUNITY]', event.token, 'Score:', event.score);
});`
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    playSynthSound();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSpecs = () => {
    const markdownContent = `# AG47 Alt Radar — Especificação Canónica
Versão: ${ALT_RADAR_CONFIG.version}
Status: ${ALT_RADAR_CONFIG.status}
Tagline: ${ALT_RADAR_CONFIG.tagline}

## Arquitetura & Pipeline
1. Ingestão de Pools & RPC
2. Filtro Inicial de Liquidez
3. Auditoria de Bytecode & Honeypot
4. Clusterização de Smart Money
5. Motor de Score Explicável (0-100)
6. Despacho Multicanal em Tempo Real

## Comandos CLI Suportados
- scan: Varredura de novos pools com filtros de qualidade
- audit: Auditoria de bytecode e honeypot
- smart-money: Mapeamento de carteiras alfa e insiders
- score: Decomposição de score ponderado
- alert: Configuração de webhooks e Telegram
- telemetry: Verificação de latência de nós RPC

---
Gerado automaticamente pelo AG47 EvoPro.`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'AG47_ALT_RADAR_SPEC.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playSynthSound();
  };

  return (
    <section id="quickstart" className="relative py-20 md:py-32 overflow-hidden border-t border-zinc-900 bg-zinc-950/40">
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
            <Play className="w-3.5 h-3.5" />
            COMEÇAR EM 60 SEGUNDOS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Guia Rápido de Instalação & Uso
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Execute localmente na sua máquina, utilize nossos containers Docker ou conecte seus bots através de WebSockets e Webhooks.
          </p>
        </div>

        {/* QuickStart Box */}
        <div 
          className="max-w-4xl mx-auto rounded-3xl bg-zinc-950 border backdrop-blur-2xl shadow-2xl overflow-hidden"
          style={{ borderColor: `${theme.colors.primary}30` }}
        >
          {/* Tabs Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-zinc-900/90 border-b border-zinc-800">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setActiveTab('cli');
                  playSynthSound();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTab === 'cli' 
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' 
                    : 'text-zinc-400 hover:text-white'
                }`}
                style={{
                  borderColor: activeTab === 'cli' ? theme.colors.primary : undefined,
                  color: activeTab === 'cli' ? theme.colors.primary : undefined
                }}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>CLI Local</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('docker');
                  playSynthSound();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTab === 'docker' 
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' 
                    : 'text-zinc-400 hover:text-white'
                }`}
                style={{
                  borderColor: activeTab === 'docker' ? theme.colors.primary : undefined,
                  color: activeTab === 'docker' ? theme.colors.primary : undefined
                }}
              >
                <Server className="w-3.5 h-3.5" />
                <span>Docker Daemon</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('api');
                  playSynthSound();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTab === 'api' 
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' 
                    : 'text-zinc-400 hover:text-white'
                }`}
                style={{
                  borderColor: activeTab === 'api' ? theme.colors.primary : undefined,
                  color: activeTab === 'api' ? theme.colors.primary : undefined
                }}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>WebSocket / API</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copySnippet}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors cursor-pointer"
                title="Copiar código"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copiar</span>
                  </>
                )}
              </button>

              <button
                onClick={downloadSpecs}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono border border-zinc-700 transition-colors cursor-pointer"
                title="Descarregar especificações .md"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Exportar .md</span>
              </button>
            </div>
          </div>

          {/* Code Area */}
          <div className="p-6 bg-[#04080c] font-mono text-xs sm:text-sm text-zinc-300 overflow-x-auto min-h-[220px]">
            <pre className="whitespace-pre">
              {snippets[activeTab]}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
