'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code2, Presentation, Cpu, TrendingUp, Brain, Sparkles } from 'lucide-react';
import { LabHero, LabCallCard } from './components';

export function LabsClient() {
  const categories = [
    {
      id: 'apex',
      title: 'APEX Predictor',
      description: 'Sinais e previsões semanais, mensais e anuais do mercado de BTC com IA proprietária.',
      icon: <TrendingUp className="w-8 h-8" />,
      path: '/labs/apex',
      status: 'BETA_LIVE',
    },
    {
      id: 'oracle-trader',
      title: 'Oracle Trader',
      description: 'Análise de mercado e trader quantitativo de futebol com cognição preditiva e calibração de edge.',
      icon: <Brain className="w-8 h-8" />,
      path: '/labs/oracle-trader',
      status: 'BETA_LIVE',
    },
    {
      id: 'dev',
      title: 'Dev Showcase',
      description: 'Acompanhe o desenvolvimento em tempo real dos nossos projetos ativos e MVPs em fase alfa.',
      icon: <Code2 className="w-8 h-8" />,
      path: '/labs/dev',
      status: 'ACTIVE_SECTOR',
    },
    {
      id: 'slides',
      title: 'Sales Slides',
      description: 'Ferramenta interativa de apresentações para pitches de vendas e demonstração de conceitos.',
      icon: <Presentation className="w-8 h-8" />,
      path: '/labs/slides',
      status: 'STABLE_VERSION',
    },
    {
      id: 'ia',
      title: 'I.A-47',
      description: 'Diretório mestre do Setor de Inteligência Artificial da Agência 47.',
      icon: <Cpu className="w-8 h-8" />,
      path: '/labs/ia',
      status: 'SYSTEM_ACTIVE',
    },
    {
      id: 'gemini-glow',
      title: 'Gemini Border Glow',
      description: 'Experimento com bordas animadas e brilhantes inspiradas no Google Gemini usando CSS Houdini.',
      icon: <Sparkles className="w-8 h-8" />,
      path: '/labs/gemini-glow',
      status: 'NEW_EXPERIMENT',
    },
    {
      id: 'agent-doc',
      title: 'Exemple I.A-47 Agent.md',
      description: 'Documentação e protótipo de agente autônomo especializado em processos Ag47.',
      icon: <Terminal className="w-8 h-8" />,
      path: '/labs/ia/agent/skills/ex',
      status: 'DOC_DRIVEN',
    }
  ];


  return (
    <div className="space-y-12">
      <LabHero 
        overline="INITIALIZING_LABS_CORE"
        overlineIcon={Terminal}
        title="O Futuro é"
        highlight="Experimental"
        description="Bem-vindo ao centro de **inovação** da Agência 47. Aqui, as fronteiras entre o **design e o código** se fundem para criar **experiências digitais** sem precedentes."
        statusTags={[
          { label: "Experimental_v0.47", color: "orange", pulse: true },
          { label: "Sandbox_Mode", color: "blue", pulse: true },
          { label: "Decentralized_Dev", color: "lime" }
        ]}
      />

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <LabCallCard 
              title={cat.title}
              description={cat.description}
              path={cat.path}
              icon={cat.icon}
              status={cat.status}
            />
          </motion.div>
        ))}
      </div>

      {/* Stats/Status Section */}
      <section className="pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: 'PROJETOS_ATIVOS', value: '12' },
          { label: 'UPTIME_SISTEMA', value: '99.9%' },
          { label: 'NODES_LATÊNCIA', value: '14ms' },
          { label: 'BUILD_VERSION', value: '0.47.0-BETA' }
        ].map((stat) => (
          <div key={stat.label} className="space-y-1">
            <div className="text-[10px] font-mono text-gray-600">{stat.label}</div>
            <div className="text-xl font-bold tracking-tighter text-gray-300">{stat.value}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
