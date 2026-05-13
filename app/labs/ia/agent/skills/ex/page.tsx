'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Terminal, 
  Code2, 
  Cpu, 
  Sparkles, 
  MousePointer2, 
  Zap,
  ArrowLeft,
  X,
  Play
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import { LabHero, LabInfoCard, LabCallCard, LabVisitCard } from '@/app/labs/components';
import AlgorithmicPlayground from '../components/AlgorithmicPlayground';

const SKILL_MD_CONTENT = `### Ag47 Labs Mini-Apps & Frontpages Designer

Skill focused on building immersive, technical, and high-end UI/UX for Agência 47's experimental sector (Labs). It provides the blueprint for creating mini-apps, landing pages, and interactive dashboards that follow the "Labs Blueprint" aesthetic.

> 🔴 **MANDATORY**: Before writing any Labs UI, read \`resources/DESIGN_TOKENS.md\` for all tokens, rules and patterns. Then check \`examples/LabTemplate.tsx\` as a starting reference.

### Visual Identity (Labs Blueprint)

The Labs aesthetic is characterized by:
- **Technical Atmosphere**: Blueprint grids, monospace fonts, and coordinate displays.
- **Glassmorphism**: Heavy use of \`backdrop-blur-xl\`, subtle borders (\`border-white/10\`), and glass-shine animations.
- **Dynamic Theming**: Real-time theme switching via interactive status indicators.
- **Glow & Atmosphere**: Deep ambient glows and nebula backgrounds.
- **Scroll Storytelling**: Visible progress indicators (Comet bar) and percentage counters.

### Core Components

#### 1. The Hero Section (Standardized)
Every Labs page starts with the \`<LabHero />\` component. It centralizes:
- **Overline (Mini-Título)**: Monospace text with an icon.
- **Main Title**: High-contrast \`tracking-tighter\` text with a highlight box.
- **Description**: Supports **Markdown-style** bolding for automatic white highlights.

#### 2. Lab Card System
Use the specialized cards from \`@/app/labs/components\`:
- **<LabVisitCard />**: For project showcases. Includes progress bars and specs.
- **<LabCallCard />**: For navigational links. Includes large watermarks and technical corners.
- **<LabInfoCard />**: For technical notifications or info boxes.

### Interaction Pattern
All cards include:
- **Glass-shine**: Automatic light reflection on hover.
- **Large Watermarks**: Top-right positioning with dynamic rotation.
- **Thematic Integration**: Uses \`ThemeContext\` colors automatically.
- **Entrance Animation**: Staggered fade-in with viewport tracking.

---
*Generated from SKILL.md documentation*`;

// Sub-component for BottomSheet Markdown details
const BottomSheet = ({ isOpen, onClose, title, content, showPlayground }: { isOpen: boolean, onClose: () => void, title: string, content: string, showPlayground?: boolean }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          {/* Sheet */}
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 h-[80vh] md:h-[70vh] bg-[#0A0A0A] border-t border-white/10 rounded-t-[32px] z-[70] shadow-2xl overflow-hidden"
          >
            <div className="w-full h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-950/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    <Terminal className="w-5 h-5 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-bold font-mono tracking-tight text-white uppercase"># LOG: {title}</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Content area with technical styling */}
              <div className="flex-1 overflow-y-auto p-8 nexus-scrollbar">
                {showPlayground ? (
                  <div className="max-w-5xl mx-auto">
                    <AlgorithmicPlayground />
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto space-y-8 font-mono text-sm leading-relaxed">
                  <div className="p-4 bg-zinc-950 border border-white/5 rounded-xl text-gray-500 text-xs flex justify-between items-center">
                    <span>--- BEGIN_TECHNICAL_SPEC ---</span>
                    <span>MD_V1.0</span>
                  </div>
                  
                  {/* Markdown-like rendering */}
                  <div className="space-y-6">
                    {content.split('\n\n').map((block, idx) => {
                      if (block.startsWith('### ')) {
                        return <h3 key={idx} className="text-xl font-bold text-white border-b border-white/10 pb-2 pt-4">{block.replace('### ', '')}</h3>;
                      }
                      if (block.startsWith('- ')) {
                        return (
                          <ul key={idx} className="space-y-2 pl-4">
                            {block.split('\n').map((line, lidx) => (
                              <li key={lidx} className="flex gap-3 text-gray-400">
                                <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-current" style={{ color: 'var(--primary)' }} />
                                <span>{line.replace('- ', '')}</span>
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      if (block.includes('```')) {
                        const code = block.replace(/```[a-z]*\n|```/g, '');
                        return (
                          <pre key={idx} className="p-6 bg-black border border-white/5 rounded-2xl overflow-x-auto text-lime-500/80">
                            <code>{code}</code>
                          </pre>
                        );
                      }
                      return <p key={idx} className="text-gray-400 leading-7">{block}</p>;
                    })}
                  </div>

                  <div className="p-4 bg-zinc-950 border border-white/5 rounded-xl text-gray-500 text-xs text-center">
                    --- END_OF_LOG ---
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </>
    )}
    </AnimatePresence>
  );
};

export default function SkillExamplePage() {
  const { theme, themeContrast } = useTheme();
  const [activeFeature, setActiveFeature] = useState<{title: string, content: string, showPlayground?: boolean} | null>(null);

  const features = [
    {
      title: "Arquitetura Visual",
      desc: "Uso de grids de precisão e tipografia técnica para criar uma atmosfera de cockpit de desenvolvimento.",
      icon: Cpu,
      details: `### DESIGN_CORE_PRINCIPLES
Este módulo utiliza a arquitetura **Labs_Grid_System**. 

- **Border Strategy**: Uso de 1px borders com opacity variável para profundidade.
- **Backdrop Filters**: Backdrop blur de 20px (xl) em todos os overlays.
- **Spacing**: Escala de 4px (units) para consistência absoluta.`
    },
    {
      id: "detail-2",
      title: "Centralização de Componentes",
      desc: "Aproveita o novo LabDesignSystem para garantir que mudanças globais reflitam em todo o ecossistema.",
      icon: Zap,
      details: `### COMPONENT_GOVERNANCE
O uso de **LabHero**, **LabVisitCard** e **LabCallCard** centraliza a manutenção.

- **Centralized Logic**: Estilos repetitivos são encapsulados.
- **Dynamic Props**: Suporte a overtitles, status tags e footers técnicos.
- **Theme Reactivity**: Totalmente integrado ao Context de Temas.`
    },
    {
      title: "Interaction Design",
      desc: "Uso de Framer Motion com curvas quintic [0.27, 1, 0.45, 1] para entradas suaves e efeitos de hover.",
      icon: MousePointer2,
      details: `### MOTION_GUIDELINES
Todas as animações seguem a física de **Material Design Refined**.

- **Easing**: [0.27, 1, 0.45, 1] (Quintic Out)
- **Duration**: 0.4s (Micro-interactions) | 0.8s (Layout transitions)
- **Physics**: Spring animations no BottomSheet para efeito tátil.`
    }
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="container mx-auto px-6 space-y-24">
        
        <LabHero 
          overline="AG47_SKILL_BLUEPRINT_V1.1"
          overlineIcon={Layers}
          title="Design"
          highlight="Autoritativo"
          description="Esta página é uma **demonstração viva** da skill **ag47-designer-labs-miniapps-frontpages**. Cada elemento aqui foi construído seguindo as **regras de padronização** visual do ecossistema Labs."
          statusTags={[
            { label: "Stable_v1.1", color: "lime", pulse: true },
            { label: "Component_Driven", color: "blue" },
            { label: "High_Fidelity", color: "main" }
          ]}
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/labs/ia/agent/skills"
                className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar para Skills
              </Link>
              
              <button 
                onClick={() => setActiveFeature({
                  title: "Testar Algorithmic Art",
                  content: "",
                  showPlayground: true
                })}
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition-all hover:scale-105 active:scale-95 group"
                style={{ backgroundColor: theme.colors.primary, color: themeContrast }}
              >
                <Play className="w-4 h-4 fill-current" /> Testar Algorithmic Art
              </button>
            </div>
          }
          footer={
            <div className="text-sm font-semibold leading-6 text-white/70 flex items-center">
              Diretório Físico: <code className="bg-white/5 px-2 py-1 rounded ml-2 font-mono text-xs" style={{ color: theme.colors.primary }}>app/labs/ia/agent/skills/ex/</code>
            </div>
          }
        />

        {/* Feature Showcase Grid */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <Sparkles className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Component Showcase</h2>
              <p className="text-sm text-gray-500 font-mono tracking-widest uppercase">Padrão: FeatureCard + BottomSheet</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <LabCallCard 
                key={idx}
                title={feature.title}
                description={feature.desc}
                icon={<feature.icon className="w-8 h-8" />}
                onClick={() => setActiveFeature({ title: feature.title, content: feature.details })}
                status="TECH_SPEC"
              />
            ))}
            
            <LabVisitCard 
              title="Design Labs Skill"
              description="Blueprint completo para construção de interfaces inovadoras com Vercel."
              client="AG47_BLUEPRINT"
              thumbnail="/labs/comet.png"
              progress={100}
              specs={["Blueprint", "UI/UX", "Vercel"]}
              slug="ag47-designer-labs"
              path="/labs/ia/agent/skills/ex"
              hasSandbox={true}
              icon={<Layers />}
              actionLabel="Baixar Skill"
            />
          </div>
        </section>

        <LabInfoCard 
          title="Consistência Absoluta"
          description="Ao utilizar componentes centralizados, garantimos que a **Agência 47** mantenha uma identidade visual coesa em todos os seus sub-sistemas experimentais."
        />

        {/* Technical Decor */}
        <div className="fixed bottom-12 left-12 pointer-events-none opacity-20 hidden lg:block">
          <div className="font-mono text-[10px] text-gray-500 space-y-1">
            <div>COORD_X: 47.001 // COORD_Y: 35.123 // ELEVATION: 1200M</div>
            <div>SECURITY_PROTOCOL: BK47_ALPHA // BITRATE: 256KBPS // MT: A547_V.1.0</div>
          </div>
        </div>

      </div>

      <BottomSheet 
        isOpen={!!activeFeature} 
        onClose={() => setActiveFeature(null)}
        title={activeFeature?.title || ''}
        content={activeFeature?.content || ''}
        showPlayground={activeFeature?.showPlayground}
      />
    </div>
  );
}
