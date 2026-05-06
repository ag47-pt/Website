'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Terminal, Code2, Presentation, ChevronRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function LabsPage() {
  const { theme } = useTheme();
  const categories = [
    {
      id: 'dev',
      title: 'Dev Showcase',
      description: 'Acompanhe o desenvolvimento em tempo real dos nossos projetos ativos e MVPs em fase alfa.',
      icon: <Code2 className="w-8 h-8" />,
      path: '/labs/dev',
      status: 'ACTIVE_SECTOR',
      color: 'pink',
    },
    {
      id: 'slides',
      title: 'Sales Slides',
      description: 'Ferramenta interativa de apresentações para pitches de vendas e demonstração de conceitos.',
      icon: <Presentation className="w-8 h-8" />,
      path: '/labs/slides',
      status: 'STABLE_VERSION',
      color: 'blue',
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 font-mono text-sm tracking-[0.2em]" style={{ color: theme.colors.primary }}>
          <Terminal className="w-4 h-4" />
          <span>INITIALIZING_LABS_CORE</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-white">
          O Futuro é <span className="px-3" style={{ backgroundColor: theme.colors.primary, color: '#000' }}>Experimental</span>
        </h1>
        <p className="max-w-2xl text-gray-400 text-base md:text-lg leading-relaxed">
          Bem-vindo ao centro de inovação da Agência 47. Aqui, as fronteiras entre o design e o código se fundem para criar experiências digitais sem precedentes.
        </p>
      </section>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link 
              href={cat.path}
              className="group block relative p-6 md:p-8 border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-all duration-500 overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                {cat.icon}
              </div>
              
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div className={`p-3 bg-black/50 border border-white/10`} style={{ color: theme.colors.primary }}>
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1">
                    {cat.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight group-hover:text-white transition-colors" style={{ '--hover-color': theme.colors.primary } as any}>
                    <style jsx>{`
                      h3:hover { color: var(--hover-color); }
                    `}</style>
                    {cat.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest pt-4" style={{ color: theme.colors.primary }}>
                  Acessar Terminal <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Technical Corners */}
              <div 
                className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 transition-colors" 
                style={{ borderColor: `${theme.colors.primary}4D` }}
              ></div>
              <div 
                className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 transition-colors" 
                style={{ borderColor: `${theme.colors.primary}4D` }}
              ></div>
            </Link>
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
