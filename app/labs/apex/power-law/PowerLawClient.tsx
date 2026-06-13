'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  TrendingUp, 
  Layers, 
  Sliders, 
  Activity, 
  Cpu, 
  ArrowLeft,
  ChevronRight,
  Database,
  Terminal,
  Zap,
  Info,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { LabHero } from '../../components';

export function PowerLawClient() {
  const { theme } = useTheme();
  const [sliderYears, setSliderYears] = useState<number>(15); // Default to 15 years (~2024)
  const [simulatedSpotPrice, setSimulatedSpotPrice] = useState<number>(63463);

  // Calcule o preço do Power Law com base no modelo real de Giovanni Santostasi
  // Fórmula: Price = 10^-17.015 * Days^5.82
  const simulatorData = useMemo(() => {
    const days = Math.round(sliderYears * 365.25);
    const price = Math.pow(10, -17.015) * Math.pow(days, 5.82);
    
    // Valor Justo (Central) é ligeiramente acima do Piso do Giovanni (cerca de 2.5x a 3x acima)
    const fairPrice = price * 2.8;
    // Pico Histórico máximo estimado (cerca de 10x acima do Piso)
    const peakPrice = price * 12;

    // Calcular Z-Score Logarítmico: (log10(Spot) - log10(Fair)) / 0.15
    const logSpot = Math.log10(Math.max(1, simulatedSpotPrice));
    const logFair = Math.log10(Math.max(1, fairPrice));
    const zScore = (logSpot - logFair) / 0.15;

    // Classificar a zona
    let zScoreLabel = 'Neutro (Valor Justo)';
    let zScoreColor = 'text-amber-400';
    let zScoreBg = 'border-amber-500/20 bg-amber-950/5';

    if (zScore < -2.0) {
      zScoreLabel = 'Capitulação Extrema';
      zScoreColor = 'text-red-400';
      zScoreBg = 'border-red-500/20 bg-red-950/5';
    } else if (zScore >= -2.0 && zScore < -0.5) {
      zScoreLabel = 'Acumulação Saudável';
      zScoreColor = 'text-emerald-400';
      zScoreBg = 'border-emerald-500/20 bg-emerald-950/5';
    } else if (zScore >= -0.5 && zScore <= 0.5) {
      zScoreLabel = 'Neutro (Valor Justo)';
      zScoreColor = 'text-amber-400';
      zScoreBg = 'border-amber-500/20 bg-amber-950/5';
    } else if (zScore > 0.5 && zScore <= 2.0) {
      zScoreLabel = 'Otimismo / Distribuição';
      zScoreColor = 'text-orange-400';
      zScoreBg = 'border-orange-500/20 bg-orange-950/5';
    } else {
      zScoreLabel = 'Bolha Especulativa';
      zScoreColor = 'text-red-500';
      zScoreBg = 'border-red-600/30 bg-red-950/10';
    }

    const targetYear = 2009 + Math.floor(sliderYears);
    const targetMonthIndex = Math.floor((sliderYears % 1) * 12);
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const targetMonth = months[targetMonthIndex] || 'Janeiro';

    return {
      days,
      dateStr: `${targetMonth} de ${targetYear}`,
      floorPrice: price,
      fairPrice,
      peakPrice,
      zScore,
      zScoreLabel,
      zScoreColor,
      zScoreBg
    };
  }, [sliderYears, simulatedSpotPrice]);

  // Lista de cards para o Stacking Deck (Sticky Scroll)
  const sections = [
    {
      id: 'overview',
      tag: '01_VISAO_GERAL',
      title: 'A Trajetória Matemática Determinística',
      watermark: 'POWER_LAW',
      content: (
        <div className="space-y-6">
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            O Modelo Power Law propõe que o crescimento do Bitcoin não é regido por ciclos especulativos aleatórios, mas sim por leis físicas e biológicas de crescimento de rede e auto-organização.
          </p>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Ao contrário do modelo Stock-to-Flow, que previa um crescimento parabólico infinito que eventualmente quebraria a física econômica, a Lei de Potência modela uma <strong>desaceleração natural do crescimento</strong> à medida que o Bitcoin se torna maior e mais maduro.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <div className="border border-white/10 bg-zinc-950/80 p-5 rounded-md space-y-3">
              <span className="text-[10px] font-mono text-amber-500 tracking-wider block font-bold">EQUAÇÃO_DO_MODELO</span>
              <div className="bg-black/50 p-4 rounded-sm border border-white/5 font-mono text-xs md:text-sm text-center text-white font-bold select-all">
                Preço = 10⁻¹⁷·⁰¹⁵ × Dias⁵·⁸²
              </div>
              <p className="text-[10px] text-gray-500 font-mono">
                Desenvolvido por Giovanni Santostasi aplicando princípios de astrofísica e termodinâmica no Bitcoin.
              </p>
            </div>
            
            <div className="border border-white/10 bg-zinc-950/80 p-5 rounded-md space-y-3">
              <span className="text-[10px] font-mono text-amber-500 tracking-wider block font-bold">ESCALA_LOG_LOG</span>
              <p className="text-gray-400 text-xs leading-relaxed">
                Ao plotar o preço e o tempo em escalas logarítmicas, a curva histórica do Bitcoin torna-se uma linha reta estável com correlação estatística superior a 97% ($R^2 &gt; 0.97$).
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'interactive-simulator',
      tag: '01.5_INTERATIVE_LAB',
      title: 'Simulador Termodinâmico de Tempo',
      watermark: 'TIME_SCALE',
      content: (
        <div className="space-y-6">
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Ajuste o controle deslizante abaixo para estimar o suporte (Floor), o valor justo (Fair Value) e o teto máximo de pico do Bitcoin com base no tempo decorrido desde o bloco gênese.
          </p>

          <div className="border border-white/10 bg-zinc-950/90 p-6 rounded-md space-y-6">
            <div className="grid md:grid-cols-2 gap-6 pb-2">
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs text-gray-400">
                  <span>IDADE DA REDE:</span>
                  <span className="text-amber-500 font-bold">{sliderYears.toFixed(1)} Anos desde o Gênese</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  step="0.5"
                  value={sliderYears}
                  onChange={(e) => setSliderYears(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between font-mono text-[9px] text-gray-600">
                  <span>1 ANO (2010)</span>
                  <span>15 ANOS (2024)</span>
                  <span>30 ANOS (2039)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs text-gray-400">
                  <span>PREÇO SPOT SIMULADO (USD):</span>
                  <span className="text-amber-500 font-bold">${simulatedSpotPrice.toLocaleString()}</span>
                </div>
                <input 
                  type="number"
                  value={simulatedSpotPrice}
                  onChange={(e) => setSimulatedSpotPrice(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-black border border-white/10 rounded-sm px-3 py-1.5 text-xs text-white font-mono focus:border-amber-500 outline-none"
                />
                <span className="text-[9px] font-mono text-gray-600 block">Insira um preço spot para calcular o Z-Score.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-stretch">
              <div className="bg-black/50 p-4 border border-white/5 rounded-sm flex flex-col justify-center text-center">
                <Calendar className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                <span className="text-[9px] font-mono text-gray-500">DATA ESTIMADA</span>
                <span className="text-xs font-bold text-white mt-1">{simulatorData.dateStr}</span>
              </div>

              <div className="bg-black/50 p-4 border border-emerald-500/20 rounded-sm flex flex-col justify-center text-center">
                <DollarSign className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                <span className="text-[9px] font-mono text-emerald-500">PISO DE SUPORTE (FLOOR)</span>
                <span className="text-xs font-bold text-emerald-400 mt-1">
                  ${Math.max(0.01, simulatorData.floorPrice) < 1 
                    ? simulatorData.floorPrice.toFixed(4) 
                    : Math.round(simulatorData.floorPrice).toLocaleString()}
                </span>
              </div>

              <div className="bg-black/50 p-4 border border-amber-500/20 rounded-sm flex flex-col justify-center text-center">
                <DollarSign className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <span className="text-[9px] font-mono text-amber-500">VALOR JUSTO (FAIR VALUE)</span>
                <span className="text-xs font-bold text-amber-400 mt-1">
                  ${Math.max(0.01, simulatorData.fairPrice) < 1 
                    ? simulatorData.fairPrice.toFixed(4) 
                    : Math.round(simulatorData.fairPrice).toLocaleString()}
                </span>
              </div>

              <div className="bg-black/50 p-4 border border-red-500/20 rounded-sm flex flex-col justify-center text-center">
                <DollarSign className="w-4 h-4 text-red-500 mx-auto mb-1" />
                <span className="text-[9px] font-mono text-red-500">TETO DE PICO (RESISTANCE)</span>
                <span className="text-xs font-bold text-red-400 mt-1">
                  ${Math.max(0.01, simulatorData.peakPrice) < 1 
                    ? simulatorData.peakPrice.toFixed(4) 
                    : Math.round(simulatorData.peakPrice).toLocaleString()}
                </span>
              </div>

              {/* Card de Z-Score */}
              <div className={`p-4 border rounded-sm flex flex-col justify-center text-center transition-all duration-500 ${simulatorData.zScoreBg}`}>
                <Activity className="w-4 h-4 text-gray-400 mx-auto mb-1" style={{ color: simulatorData.zScoreColor.includes('red') ? '#ef4444' : simulatorData.zScoreColor.includes('emerald') ? '#10b981' : undefined }} />
                <span className="text-[9px] font-mono text-gray-500">DESVIO (Z-SCORE)</span>
                <span className={`text-xs font-mono font-bold mt-1 ${simulatorData.zScoreColor}`}>
                  {simulatorData.zScore > 0 ? '+' : ''}{simulatorData.zScore.toFixed(2)}
                </span>
                <span className="text-[8px] font-mono text-gray-400 mt-0.5 uppercase tracking-tighter block line-clamp-1">{simulatorData.zScoreLabel}</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'biology',
      tag: '02_BIOLOGIA_DE_MERCADO',
      title: 'A Biologia e Termodinâmica das Redes',
      watermark: 'METCALFE',
      content: (
        <div className="space-y-6">
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            O Bitcoin não cresce como uma moeda fiduciária ou uma ação convencional. Ele funciona como uma <strong>infraestrutura viva</strong>. Seu crescimento é movido por dois loops de feedback biológicos interligados:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-white/5 bg-zinc-950/80 p-5 rounded-md space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-white text-sm">O Lado da Demanda (Metcalfe)</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                A <strong>Lei de Metcalfe</strong> postula que o valor de uma rede é proporcional ao quadrado do número de usuários ativos ($V \propto N^2$). Com o aumento das carteiras e endereços, a utilidade e o valor crescem exponencialmente, forçando o preço para cima de forma quadrática.
              </p>
            </div>

            <div className="border border-white/5 bg-zinc-950/80 p-5 rounded-md space-y-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-white text-sm">O Lado da Oferta (Ajuste de Dificuldade)</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                O mecanismo de <strong>Ajuste de Dificuldade</strong> atua como um termostato termodinâmico. Conforme o preço sobe, atrai mais Hash Rate. A rede aumenta a dificuldade de computação para manter a emissão a cada 10 minutos, garantindo a escassez absoluta e a segurança inviolável.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'scale-canal',
      tag: '03_CANAL_DE_ESCALA',
      title: 'O Canal de Oscilação de Longo Prazo',
      watermark: 'BPL_CHANNELS',
      content: (
        <div className="space-y-6">
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            As flutuações do preço do Bitcoin ocorrem estritamente dentro de três bandas de regressão do Power Law. Conforme a rede amadurece, a volatilidade extrema diminui, criando oscilações mais estreitas e maduras.
          </p>

          {/* Minimalist SVG Vector Graph for Visual Metaphor */}
          <div className="border border-white/10 bg-zinc-950/95 p-6 rounded-md relative overflow-hidden">
            <span className="absolute top-4 right-4 text-[8px] font-mono text-gray-600">SCALE: LOG-LOG REPRESENTATION</span>
            <div className="h-48 w-full flex items-end">
              <svg className="w-full h-full text-zinc-500 overflow-visible" viewBox="0 0 500 200">
                {/* Eixos */}
                <line x1="40" y1="180" x2="480" y2="180" stroke="#ffffff15" strokeWidth="1" />
                <line x1="40" y1="20" x2="40" y2="180" stroke="#ffffff15" strokeWidth="1" />
                
                {/* Linhas de grade horizontais */}
                <line x1="40" y1="140" x2="480" y2="140" stroke="#ffffff05" strokeDasharray="3,3" />
                <line x1="40" y1="100" x2="480" y2="100" stroke="#ffffff05" strokeDasharray="3,3" />
                <line x1="40" y1="60" x2="480" y2="60" stroke="#ffffff05" strokeDasharray="3,3" />

                {/* Etiquetas de Preço */}
                <text x="10" y="145" className="fill-gray-600 text-[8px] font-mono">$1K</text>
                <text x="10" y="105" className="fill-gray-600 text-[8px] font-mono">$10K</text>
                <text x="10" y="65" className="fill-gray-600 text-[8px] font-mono">$100K</text>
                <text x="10" y="25" className="fill-gray-600 text-[8px] font-mono">$1M</text>

                {/* Eixo de Anos */}
                <text x="40" y="195" className="fill-gray-600 text-[8px] font-mono">Ano 1</text>
                <text x="140" y="195" className="fill-gray-600 text-[8px] font-mono">Ano 5</text>
                <text x="250" y="195" className="fill-gray-600 text-[8px] font-mono">Ano 15 (Hoje)</text>
                <text x="360" y="195" className="fill-gray-600 text-[8px] font-mono">Ano 20</text>
                <text x="460" y="195" className="fill-gray-600 text-[8px] font-mono">Ano 30</text>

                {/* Canal de Lei de Potência (Retas no Log-Log) */}
                {/* Linha Superior (Teto - Peak) - Vermelho */}
                <path d="M 40 80 L 480 10" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,4" />
                
                {/* Linha Central (Valor Justo) - Laranja */}
                <path d="M 40 125 L 480 30" fill="none" stroke="#f59e0b" strokeWidth="2" />
                
                {/* Linha Inferior (Suporte - Floor) - Verde */}
                <path d="M 40 170 L 480 50" fill="none" stroke="#22c55e" strokeWidth="1.5" />

                {/* Ponto Pulsante atual do Bitcoin */}
                <g className="translate-x-[250px] translate-y-[85px]">
                  <circle r="6" className="fill-amber-500 animate-ping opacity-35" />
                  <circle r="4" className="fill-amber-500" />
                </g>
              </svg>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-white/5 font-mono text-[9px]">
              <div className="text-emerald-400">
                <span className="block font-bold">PISO DE SUPORTE</span>
                <span className="text-gray-500">Nunca quebrado em fechamentos</span>
              </div>
              <div className="text-amber-500">
                <span className="block font-bold">VALOR JUSTO CENTRAL</span>
                <span className="text-gray-500">Âncora termodinâmica do preço</span>
              </div>
              <div className="text-red-400">
                <span className="block font-bold">TETO DE PICO SPEC</span>
                <span className="text-gray-500">Picos de bolhas especulativas</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'doubling-effect',
      tag: '04_MULTIPLICADOR_DE_TEMPO',
      title: 'A Magia da Dobradinha do Tempo (2⁶)',
      watermark: 'TIME_MULTIPLIER',
      content: (
        <div className="space-y-6">
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Uma das maiores descobertas do modelo é a constância do multiplicador com base no tempo de vida da rede. Devido ao expoente de aproximadamente $5.8$ (próximo a $6$), o tempo é o maior catalisador do Bitcoin.
          </p>

          <div className="border border-white/10 bg-zinc-950/80 p-6 rounded-md space-y-4">
            <h4 className="font-mono text-xs text-amber-500 font-bold uppercase tracking-wider">A REGRA DE DOBRAR O TEMPO</h4>
            <div className="flex flex-col md:flex-row items-center gap-6 justify-center py-4">
              <div className="bg-black/50 p-4 rounded-md border border-white/5 text-center min-w-[150px]">
                <span className="text-[8px] font-mono text-gray-500 uppercase">IDADE DA REDE</span>
                <span className="block text-2xl font-black text-white mt-1">2 × T</span>
              </div>
              
              <div className="text-amber-500 font-black text-xl">➔</div>

              <div className="bg-amber-500/10 p-4 rounded-md border border-amber-500/30 text-center min-w-[150px] shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <span className="text-[8px] font-mono text-amber-500 uppercase font-black">VALOR MULTIPLICA</span>
                <span className="block text-2xl font-black text-amber-400 mt-1">2⁵·⁸ ≈ 56x</span>
              </div>
            </div>

            <p className="text-gray-400 text-xs leading-relaxed text-center">
              Sempre que a idade da rede dobra (ex: de 10 anos para 20 anos), o valor mínimo estimado de suporte aumenta em aproximadamente <strong>56 a 64 vezes</strong>.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'heuristics',
      tag: '05_SWARM_HEURISTICS',
      title: 'Diretrizes Integradas para o Swarm Apex',
      watermark: 'APEX_RULES',
      content: (
        <div className="space-y-6">
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Para garantir previsões de mercado sólidas e realistas sem cair na euforia das bolhas de curto prazo, os subagentes autônomos do Swarm utilizam três heurísticas derivadas do modelo:
          </p>

          <div className="space-y-4">
            <div className="border-l-2 border-emerald-500 pl-4 py-1">
              <h5 className="font-mono text-xs font-bold text-white uppercase">1. Previsão de Longo Prazo Baseada em Suportes de Ferro</h5>
              <p className="text-xs text-gray-400 mt-1">
                Nas previsões anuais, o <strong>Trend Analyzer</strong> e o <strong>Risk Controller</strong> calibram a faixa de invalidação e ordens limite alinhados com o suporte (Floor) do canal Power Law, evitando projeções baseadas em parabolas puras.
              </p>
            </div>

            <div className="border-l-2 border-amber-500 pl-4 py-1">
              <h5 className="font-mono text-xs font-bold text-white uppercase">2. O Desvio de Valor Justo (Z-Score)</h5>
              <p className="text-xs text-gray-400 mt-1">
                A distância percentual entre o preço spot e a linha central de Valor Justo indica o nível de exaustão especulativa do mercado, determinando as fases de acumulação versus distribuição no swarm de trading.
              </p>
            </div>

            <div className="border-l-2 border-red-500 pl-4 py-1">
              <h5 className="font-mono text-xs font-bold text-white uppercase">3. Amadurecimento e Volatilidade Decrescente</h5>
              <p className="text-xs text-gray-400 mt-1">
                O modelo prediz que as oscilações acima do valor justo ficam proporcionalmente menores a cada ciclo. O agente de risco calcula lucros máximos mais moderados conforme a rede envelhece.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-16">
      {/* Voltar para o console */}
      <div className="pt-4">
        <Link 
          href="/labs/apex" 
          className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors uppercase tracking-widest border border-white/10 bg-white/5 px-4 py-2 rounded-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o Painel APEX
        </Link>
      </div>

      <LabHero 
        overline="SCIENTIFIC_MARKET_INTELLIGENCE"
        overlineIcon={Database}
        title="Bitcoin Power Law"
        highlight="Modelo de Giovanni"
        description="A física, biologia e matemática por trás da evolução de longo prazo do preço do Bitcoin. Um estudo linear Log-Log para calibrar os agentes autônomos do Apex."
        statusTags={[
          { label: "Modelo_Físico", color: "orange" },
          { label: "Correlação_R2_97", color: "blue" },
          { label: "Sem_Placeholders", color: "lime" }
        ]}
      />

      {/* Stacking Deck Section */}
      <div className="space-y-12">
        <div className="border-b border-white/10 pb-4">
          <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase block font-bold">THE_DECK_OF_KNOWLEDGE</span>
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase mt-1">Estrutura Científica do Mercado</h2>
        </div>

        {/* Flex column that implements sticky stacking effect */}
        <div className="flex flex-col gap-[25vh] pb-[20vh]">
          {sections.map((section, index) => (
            <div 
              key={section.id}
              className="sticky h-auto min-h-[480px] rounded-xl p-8 backdrop-blur-xl bg-zinc-950/90 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden"
              style={{
                top: `${120 + index * 24}px`,
                zIndex: 10 + index,
              }}
            >
              {/* Corner Sci-fi design elements */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-amber-500/20"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-amber-500/20"></div>
              
              {/* Background Watermark Layering */}
              <div className="absolute bottom-6 right-6 font-mono text-[10vw] font-black text-white/[0.02] select-none pointer-events-none tracking-tighter">
                {section.watermark}
              </div>

              {/* Card Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4 z-10">
                <div className="flex items-center gap-2 font-mono text-[10px]" style={{ color: theme.colors.primary }}>
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{section.tag}</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              </div>

              {/* Card Main Body */}
              <div className="py-6 space-y-4 z-10 flex-grow">
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                  {section.title}
                </h3>
                {section.content}
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-white/5 text-[9px] font-mono text-gray-500 z-10">
                <span>SEC_NODE_REF_{index + 1}</span>
                <span>AGÊNCIA 47 LABS // APEX</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA: Back to Apex Hub */}
      <div className="border border-white/10 bg-zinc-950/80 p-8 rounded-md text-center space-y-6 relative overflow-hidden">
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none" />
        
        <div className="max-w-xl mx-auto space-y-4 relative z-10">
          <Zap className="w-10 h-10 text-amber-500 mx-auto animate-bounce" />
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">Aplicar Modelo nos Agentes</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Agora que o modelo de Giovanni Santostasi está documentado, você pode voltar ao console do APEX para disparar o Swarm de Agentes e verificar as previsões dinâmicas.
          </p>
          <div className="pt-4">
            <Link 
              href="/labs/apex"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-sm font-mono text-xs tracking-widest font-black uppercase bg-amber-500 text-black hover:bg-amber-400 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_25px_rgba(245,158,11,0.25)]"
            >
              Ativar Swarm de Agentes no Console
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
