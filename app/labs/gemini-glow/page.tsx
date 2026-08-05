'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Cpu, Terminal, Copy, Check, ArrowLeft, 
  Play, Pause, Palette, Database, Activity, Code, Flame, ShieldAlert, Laptop,
  TrendingUp, RefreshCw, BarChart2, Plus, Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { GeminiCard, GeminiButton, GeminiInput, GeminiAvatar, BorderBeam } from '@/components/ui/GeminiBorder';
import { LabHero, LabInfoCard } from '../components';

const PALETTES = [
  { id: 'gemini', name: 'Gemini Aurora', colors: '#4285f4, #9b51e0, #e91e63, #3b82f6, #4285f4' },
  { id: 'cyberpunk', name: 'Cyberpunk 2077', colors: '#ff0055, #00ffcc, #9900ff, #ff0055' },
  { id: 'lime', name: 'Acid Lime', colors: '#d1ff00, #00ffaa, #00b3ff, #d1ff00' },
  { id: 'volcano', name: 'Hot Volcano', colors: '#ff3300, #ff0077, #ffaa00, #ff3300' },
];

const SUGGESTIONS = [
  "Iniciar análise preditiva quantitativa...",
  "Otimizar rotas de carregamento do Next.js",
  "Orquestrar subagentes em paralelo",
  "Gerar shader WebGL de partículas 3D"
];

export default function GeminiGlowDemoPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [promptText, setPromptText] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Customization States
  const [activePalette, setActivePalette] = useState(PALETTES[0]);
  const [duration, setDuration] = useState('4s');
  const [isPaused, setIsPaused] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(16); // px blur
  
  // Stats Telemetry Simulation
  const [cpuLoad, setCpuLoad] = useState(42);
  const [memoryUsage, setMemoryUsage] = useState(64.8);
  const [latency, setLatency] = useState(14);
  const [agentCount, setAgentCount] = useState(5);
  const [inferenceRate, setInferenceRate] = useState(1420);
  const [chartData, setChartData] = useState<number[]>([12, 18, 15, 22, 28, 20, 25, 30, 32, 28, 35, 30]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoad(prev => Math.min(Math.max(prev + (Math.random() * 12 - 6), 20), 95));
      setMemoryUsage(prev => Math.min(Math.max(prev + (Math.random() * 2 - 1), 60), 85));
      setLatency(prev => Math.min(Math.max(prev + (Math.random() * 4 - 2), 8), 35));
      setInferenceRate(prev => Math.min(Math.max(prev + Math.round(Math.random() * 200 - 100), 800), 2200));
      
      setChartData(prev => {
        const next = [...prev.slice(1)];
        next.push(Math.min(Math.max(prev[prev.length - 1] + (Math.random() * 16 - 8), 5), 45));
        return next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSuggestionClick = (text: string) => {
    setPromptText('');
    let current = '';
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        current += text[i];
        setPromptText(current);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  };

  // Convert comma separated hex list into array
  const colorArray = activePalette.colors.split(',').map(c => c.trim());

  // Generate dynamic CSS overrides based on state
  const cardStyle = {
    '--gemini-glow-colors': activePalette.colors,
    animationPlayState: isPaused ? 'paused' : 'running',
  } as React.CSSProperties;

  // Path coordinates for live SVG sparkline
  const points = chartData.map((val, idx) => `${idx * 24},${48 - val}`).join(' ');

  const cssCode = `@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

@keyframes spin {
  from { --angle: 0deg; }
  to { --angle: 360deg; }
}

.gemini-glow-container {
  position: relative;
  z-index: 1;
}

.gemini-glow-container::before {
  content: "";
  position: absolute;
  inset: -1.5px;
  z-index: -1;
  border-radius: inherit;
  background: conic-gradient(
    from var(--angle),
    var(--gemini-glow-colors, ${activePalette.colors})
  );
  animation: spin var(--glow-speed, ${duration}) linear infinite;
  opacity: 0.85;
}

.gemini-glow-container::after {
  content: "";
  position: absolute;
  inset: -1.5px;
  z-index: -2;
  border-radius: inherit;
  background: conic-gradient(
    from var(--angle),
    var(--gemini-glow-colors, ${activePalette.colors})
  );
  filter: blur(var(--glow-blur, ${glowIntensity}px));
  opacity: 0.6;
  animation: spin var(--glow-speed, ${duration}) linear infinite;
}`;

  const reactCode = `import React from 'react';
import { GeminiCard, GeminiInput, GeminiButton } from '@/components/ui/GeminiBorder';

export default function MyDashboard() {
  return (
    <GeminiCard duration="${duration}" style={{ '--gemini-glow-colors': '${activePalette.colors}' }}>
      <h3 className="text-white font-bold">Núcleo Quântico</h3>
      <GeminiInput placeholder="Digite uma diretriz..." />
      <GeminiButton>Ativar Módulo</GeminiButton>
    </GeminiCard>
  );
}`;

  // AI agents mock status data
  const AGENTS = [
    { id: 'AG47-01', name: 'Skeptic Quant', role: 'Análise Financeira', status: 'Processando', color: 'text-amber-400', val: `${cpuLoad.toFixed(0)}%` },
    { id: 'AG47-02', name: 'Oracle Cognition', role: 'Calibração de Edge', status: 'Pronto', color: 'text-emerald-400', val: '0ms' },
    { id: 'AG47-03', name: 'Veo Director', role: 'Visual Shader Render', status: 'Carregando', color: 'text-blue-400', val: '99%' },
  ];

  return (
    <div className="space-y-12">
      {/* Navigation and Title */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push('/labs')}
          className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> VOLTAR PARA O LABORATÓRIO
        </button>
        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">AG47 // EXPERIMENT_04</span>
      </div>

      {/* Lab Header banner */}
      <LabHero
        overline="CSS_HOUDINI_CONTROL_CENTER"
        overlineIcon={Sparkles}
        title="Painel de Controle"
        highlight="Gemini Glow"
        description="Experimente e altere o comportamento das **bordas com gradientes rotativos**. Modifique cores, velocidades e efeitos do neon ao vivo usando as ferramentas de customização abaixo."
        statusTags={[
          { label: "GPU_Accelerated", color: "lime", pulse: true },
          { label: "CSS_Houdini", color: "blue" },
          { label: "Interactive_Sandbox", color: "orange" }
        ]}
      />

      {/* Grid Dashboard */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Settings Control */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-zinc-950/60 border border-white/10 rounded-3xl backdrop-blur-md space-y-6 relative overflow-hidden">
            {/* Tech line decor */}
            <div className="absolute top-0 right-0 w-24 h-[1px] bg-gradient-to-r from-transparent to-pink-500/50" />
            
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-zinc-400 border-b border-white/5 pb-3">
              <Palette className="w-4 h-4 text-pink-500" /> 01 // CUSTOMIZADOR DE GRADIENTES
            </div>

            {/* Color Palette Selector */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-zinc-400 tracking-wider block">PALETA DE CORES ATIVA</label>
              <div className="grid grid-cols-2 gap-3">
                {PALETTES.map((pal) => (
                  <button
                    key={pal.id}
                    onClick={() => setActivePalette(pal)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all relative overflow-hidden group ${
                      activePalette.id === pal.id 
                        ? 'border-white bg-white/5 text-white' 
                        : 'border-white/5 bg-black/40 text-zinc-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span className="relative z-10 block">{pal.name}</span>
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r"
                      style={{ backgroundImage: `linear-gradient(to right, ${pal.colors})` }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Speed Controllers */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-zinc-400 tracking-wider block">VELOCIDADE DO FEIXE (BORDER BEAM)</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className={`p-3 rounded-xl border text-xs font-mono transition-colors flex items-center justify-center gap-2 ${
                    isPaused ? 'border-red-500 bg-red-950/20 text-red-500' : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
                  }`}
                  title={isPaused ? "Retomar Movimento" : "Pausar Movimento"}
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  {isPaused ? "PAUSADO" : "PAUSAR"}
                </button>
                
                {[
                  { label: "LENTO", val: "8s" },
                  { label: "PADRÃO", val: "4s" },
                  { label: "MÁXIMO", val: "1.5s" }
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => {
                      setDuration(s.val);
                      setIsPaused(false);
                    }}
                    className={`flex-1 p-3 rounded-xl border text-xs font-mono text-center transition-colors ${
                      duration === s.val && !isPaused
                        ? 'border-white bg-white/10 text-white'
                        : 'border-white/5 bg-black/40 text-zinc-500 hover:text-white hover:border-white/15'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Glow Intensity Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 tracking-wider">
                <span>INTENSIDADE DE BRILHO (BLUR)</span>
                <span className="text-white">{glowIntensity}px</span>
              </div>
              <input 
                type="range" 
                min="4" 
                max="32" 
                value={glowIntensity}
                onChange={(e) => setGlowIntensity(parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>
          </div>

          {/* Quick Info Tip */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md flex gap-4 items-start">
            <div className="p-2.5 bg-zinc-950 border border-white/10 rounded-xl text-yellow-500 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 block">DICA DO ARQUITETO</span>
              <p className="text-xs text-zinc-500 leading-relaxed uppercase">
                O gradiente usa transparências e camadas. O desfoque (`blur`) de 16px é o ponto ideal que emula a emissão física de luz em displays OLED.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Live Showcase Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Replica Prompt Box Section */}
          <div className="p-6 bg-zinc-950/60 border border-white/10 rounded-3xl backdrop-blur-md space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-zinc-400">
                <Terminal className="w-4 h-4 text-emerald-500" /> 02 // INPUT DE IA INTERATIVO
              </div>
              <span className="text-[8px] font-mono text-emerald-400 animate-pulse bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">MODO_PRONTO</span>
            </div>
            
            <div className="space-y-3">
              <GeminiInput 
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Clique em um atalho abaixo para autodeclarar comando..."
                duration={duration}
                style={{
                  '--gemini-glow-colors': activePalette.colors,
                  animationPlayState: isPaused ? 'paused' : 'running',
                } as React.CSSProperties}
                className="py-4 text-base bg-zinc-950/80"
              />
              
              {/* Typewriter Suggestions */}
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="text-[9px] font-mono bg-white/5 border border-white/5 hover:border-white/10 px-3 py-1.5 rounded-full transition-all text-zinc-400 hover:text-white"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bento Dashboard Statistics Panels */}
          <div className="grid sm:grid-cols-2 gap-6">
            
            {/* Live Card: Telemetry Sparkline (The Custom Glow Chart) */}
            <GeminiCard 
              duration={duration} 
              style={cardStyle}
              className="flex flex-col justify-between h-52 relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-white/5 border border-white/10 rounded-lg text-emerald-400">
                    <TrendingUp className="w-4 h-4 animate-bounce" />
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500">TELEMETRIA_IO</span>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Taxa de Inferência</div>
                  <div className="text-xl font-bold tracking-tight text-white font-mono">{inferenceRate} tokens/s</div>
                </div>
              </div>

              {/* Dynamic glowing sparkline SVG */}
              <div className="h-16 w-full flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 264 50">
                  <defs>
                    <linearGradient id="dynamicGlowGrad" x1="0" y1="0" x2="1" y2="0">
                      {colorArray.map((color, idx) => (
                        <stop key={idx} offset={`${(idx / (colorArray.length - 1)) * 100}%`} stopColor={color} />
                      ))}
                    </linearGradient>
                  </defs>
                  {/* Glowing background path */}
                  <path
                    d={`M ${points}`}
                    fill="none"
                    stroke="url(#dynamicGlowGrad)"
                    strokeWidth="3"
                    className="transition-all duration-1000 ease-in-out opacity-25"
                    style={{ filter: `blur(4px)` }}
                  />
                  {/* Sharp front path */}
                  <path
                    d={`M ${points}`}
                    fill="none"
                    stroke="url(#dynamicGlowGrad)"
                    strokeWidth="1.5"
                    className="transition-all duration-1000 ease-in-out"
                  />
                </svg>
              </div>
            </GeminiCard>

            {/* Live Card: CPU Telemetry */}
            <GeminiCard 
              duration={duration} 
              style={cardStyle}
              className="flex flex-col justify-between h-52 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-white/5 border border-white/10 rounded-lg text-pink-500">
                    <Activity className="w-4 h-4 animate-pulse" />
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500">NÚCLEO_CPU</span>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Processamento Ativo</div>
                  <div className="text-3xl font-black tracking-tight text-white font-mono mt-1">
                    {cpuLoad.toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-zinc-900/50 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 transition-all duration-1000"
                  style={{ width: `${cpuLoad}%` }}
                />
              </div>
            </GeminiCard>

            {/* Active AI Core Agents Table with hover glows */}
            <GeminiCard 
              duration={duration}
              style={cardStyle}
              className="sm:col-span-2 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                  Agentes de Processamento Ativos
                </div>
                <div className="text-[9px] font-mono text-zinc-500">SYS_THREAD: ACTIVE</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead>
                    <tr className="text-zinc-500 border-b border-white/5">
                      <th className="pb-2 font-normal">NODE_ID</th>
                      <th className="pb-2 font-normal">NOME</th>
                      <th className="pb-2 font-normal">FUNÇÃO</th>
                      <th className="pb-2 font-normal">LATENCY</th>
                      <th className="pb-2 text-right font-normal">TELEMETRIA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AGENTS.map((agent) => (
                      <tr 
                        key={agent.id} 
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      >
                        <td className="py-2.5 text-zinc-400 font-bold group-hover:text-white transition-colors">{agent.id}</td>
                        <td className="py-2.5 text-zinc-300 font-bold group-hover:text-white transition-colors">{agent.name}</td>
                        <td className="py-2.5 text-zinc-500">{agent.role}</td>
                        <td className="py-2.5 text-zinc-500">{agent.val}</td>
                        <td className="py-2.5 text-right font-bold">
                          <span className={`inline-flex items-center gap-1.5 ${agent.color}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                            {agent.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GeminiCard>

            {/* Live Card: Interactive Avatar Panel */}
            <GeminiCard 
              duration={duration} 
              style={cardStyle}
              className="sm:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <GeminiAvatar 
                  fallback="L47" 
                  duration={duration}
                  style={cardStyle}
                  className="w-16 h-16 shrink-0" 
                />
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white tracking-tight">Instancia Mestre IA-47</h4>
                    <span className="text-[8px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">ONLINE</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
                    Núcleo quântico ativo processando telemetria em tempo real a {latency.toFixed(0)}ms de latência.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <GeminiButton 
                  onClick={() => setAgentCount(prev => prev + 1)}
                  duration={duration}
                  style={cardStyle}
                  className="whitespace-nowrap px-4 py-2"
                >
                  Adicionar Node
                </GeminiButton>
                <div className="text-right shrink-0">
                  <div className="text-[9px] font-mono text-zinc-500">NODES_ATIVOS</div>
                  <div className="text-xl font-bold font-mono text-white">{agentCount}</div>
                </div>
              </div>
            </GeminiCard>

          </div>
        </div>

      </div>

      {/* Border Beam Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold font-mono tracking-wider text-white border-b border-white/10 pb-2">
          03 // EFEITO DE LINHAS CORRENDO EM VOLTA (BORDER BEAM)
        </h2>
        <div className="p-8 bg-zinc-950/40 border border-white/5 rounded-3xl backdrop-blur-md space-y-6">
          <p className="text-sm text-zinc-400">
            Diferente do efeito rotativo em que toda a borda fica colorida e gira, o **Border Beam** simula um único raio/laser brilhante (como uma linha) que &quot;anda&quot; em volta do contêiner.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Input com Linha Andando */}
            <div className="relative p-[1.5px] rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between overflow-hidden">
              <BorderBeam duration={duration} colors={activePalette.colors} isPaused={isPaused} size={25} />
              <input 
                type="text" 
                placeholder="Input com laser correndo..." 
                className="w-full px-4 py-3 rounded-lg bg-zinc-950 text-white text-xs outline-none relative z-10"
              />
            </div>

            {/* Card com Linha Andando */}
            <div className="relative p-6 rounded-2xl bg-zinc-950 border border-white/5 text-left h-44 flex flex-col justify-between overflow-hidden">
              <BorderBeam duration={duration} colors={activePalette.colors} isPaused={isPaused} size={15} borderWidth={2} />
              <div className="space-y-2 relative z-10">
                <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">BorderBeamCard</span>
                <h4 className="text-sm font-bold text-white">Laser Perimetral</h4>
                <p className="text-[11px] text-zinc-450 leading-relaxed uppercase">
                  Um feixe de luz preciso que percorre toda a borda do elemento de forma cíclica.
                </p>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 relative z-10 flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                ATIVO_LMT_2
              </span>
            </div>

            {/* Botão com Linha Andando */}
            <div className="flex items-center justify-center">
              <button className="relative px-8 py-4 rounded-xl bg-zinc-900 text-white font-mono text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all overflow-hidden">
                <BorderBeam duration="2.5s" colors={activePalette.colors} isPaused={isPaused} size={30} borderWidth={2} />
                <span className="relative z-10">Botão Laser</span>
              </button>
            </div>

          </div>

          {/* Border Beam Code snippet explanation */}
          <div className="bg-black/60 p-6 rounded-2xl border border-white/5 text-left">
            <h4 className="text-xs font-mono font-bold text-white mb-2 uppercase">Como funciona a matemática do Border Beam?</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Usamos uma máscara CSS inteligente baseada em gradients de exclusão. A máscara exclui o centro do componente e revela apenas a área do padding (a borda). Como o gradiente rotativo traseiro é configurado para ser 80% transparente e apenas 20% colorido, apenas a fatia colorida fica aparente na borda, criando a ilusão de que a linha está andando em volta do contêiner.
            </p>
            <pre className="p-4 bg-zinc-950 rounded-xl text-[10px] font-mono text-zinc-300 overflow-x-auto">
              <code>{`<BorderBeam duration="${duration}" colors="${activePalette.colors}" size={20} borderWidth={1.5} />`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Code Showcase & Documentation */}
      <section className="space-y-6 pt-6">
        <h2 className="text-xl font-bold font-mono tracking-wider text-white border-b border-white/10 pb-2">
          04 // CÓDIGO FONTE CONFIGURADO (DINÂMICO)
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* CSS Code */}
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-zinc-900 px-4 py-2 rounded-t-2xl border border-white/5">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-pink-500" />
                <span className="text-[10px] font-mono text-zinc-400">globals.css (Acoplamento Houdini)</span>
              </div>
              <button
                onClick={() => handleCopy(cssCode, 'css')}
                className="text-zinc-500 hover:text-white transition-colors"
                title="Copiar Código"
              >
                {copiedText === 'css' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="p-4 bg-black border border-t-0 border-white/5 rounded-b-2xl text-[10px] font-mono text-zinc-300 overflow-x-auto max-h-96">
              <code>{cssCode}</code>
            </pre>
          </div>

          {/* React Code */}
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-zinc-900 px-4 py-2 rounded-t-2xl border border-white/5">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] font-mono text-zinc-400">Next.js Implementation</span>
              </div>
              <button
                onClick={() => handleCopy(reactCode, 'react')}
                className="text-zinc-500 hover:text-white transition-colors"
                title="Copiar Código"
              >
                {copiedText === 'react' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="p-4 bg-black border border-t-0 border-white/5 rounded-b-2xl text-[10px] font-mono text-zinc-300 overflow-x-auto max-h-96">
              <code>{reactCode}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <LabInfoCard
        title="Benefícios de Performance da GPU"
        description="Ao contrário de usar loops de renderização de canvas ou animações com JavaScript (requestAnimationFrame), declarar a rotação da borda em CSS Houdini nativo permite que o motor do navegador delegue a rasterização do conic-gradient inteiramente para a GPU. Isso garante animações a 60-120fps sem consumo adicional na thread de execução do React."
        icon={<Terminal className="w-6 h-6" />}
      />
    </div>
  );
}
