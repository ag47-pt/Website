'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Bot, Terminal } from 'lucide-react';
import { LabHero, LabCallCard } from '../components';

export default function IAPage() {
  const categories = [
    {
      id: 'agents',
      title: '.Agents47',
      description: 'Diretório mestre de Agentes e repositório vivo de Skills de IA da Agência 47.',
      icon: <Bot className="w-8 h-8" />,
      path: '/labs/ia/agent',
      status: 'SYSTEM_ACTIVE',
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
        overline="I.A-47_CORE"
        overlineIcon={Cpu}
        title="Inteligência"
        highlight="Artificial"
        description="Centro de **processamento cognitivo**, automação e **orquestração** de **Agentes Autônomos** da Agência 47."
        statusTags={[
          { label: "Core_Engine", color: "lime", pulse: true },
          { label: "Neural_Sync", color: "blue", pulse: true },
          { label: "Alpha_Orchestrator", color: "main" }
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
          { label: 'AGENTES_ATIVOS', value: '8' },
          { label: 'SKILLS_CARREGADAS', value: '47' },
          { label: 'NEURAL_LATÊNCIA', value: '8ms' },
          { label: 'I.A_VERSION', value: 'v2.1.0' }
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
