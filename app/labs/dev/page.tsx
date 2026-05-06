'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Layers, Activity, Lock, ExternalLink, Cpu, Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/config/supabase';

import { Project } from '@/types/labs';

export default function DevShowcasePage() {
  const { theme } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('labs_projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setProjects(data);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs tracking-widest" style={{ color: theme.colors.primary }}>
            <Activity className="w-3 h-3" />
            <span>PROJECT_STREAM_V2.1</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase">Vitrini de <span style={{ color: theme.colors.primary }}>Desenvolvimento</span></h1>
        </div>
        <div className="flex gap-4 font-mono text-[10px] text-gray-500 uppercase">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Development</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Beta</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Restricted</span>
          </div>
        </div>
      </section>

      {/* Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-96 bg-zinc-900/50 border border-white/5 animate-pulse flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-800" />
            </div>
          ))
        ) : projects.length === 0 ? (
          <div className="col-span-full py-20 text-center border border-white/5 bg-zinc-900/10">
            <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest text-center">Nenhum projeto em exibição no momento.</p>
          </div>
        ) : projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-zinc-950 border border-white/5 overflow-hidden"
          >
            {/* Visual Preview */}
            <div className="h-56 relative overflow-hidden transition-all duration-700">
              <Image 
                src={project.thumbnail_url || 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop'} 
                alt={project.name}
                fill
                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
              />
              {/* Primary Glow Overlay */}
              <div 
                className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700"
                style={{ 
                  background: `linear-gradient(to top, ${theme.colors.primary}, transparent)` 
                }}
              ></div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
              
              {/* Overlay Tags */}
              <div className="absolute top-4 left-4 flex gap-2">
                {project.status === 'INTERNAL_ALPHA' && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-[8px] px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                    <Lock className="w-2 h-2" /> RESTRICTED
                  </div>
                )}
                <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[8px] px-2 py-0.5 rounded-full font-mono">
                  #{project.id.slice(0, 4).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{project.client}</div>
                <h3 
                  className="text-xl font-bold transition-colors duration-300"
                  style={{ color: 'inherit' }} // Default
                  onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                >
                  {project.name}
                </h3>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-[9px] text-gray-400">
                  <span>COMPLETION_PHASE</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-1 bg-white/5 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="absolute inset-0"
                    style={{ 
                      backgroundColor: theme.colors.primary,
                      boxShadow: `0 0 8px ${theme.colors.primary}CC`
                    }}
                  />
                </div>
              </div>

              {/* Specs */}
              <div className="flex flex-wrap gap-2">
                {project.specs?.map(spec => (
                  <span key={spec} className="text-[8px] font-mono bg-white/5 border border-white/10 px-2 py-1 text-gray-400">
                    {spec}
                  </span>
                ))}
              </div>

              {/* Action */}
              {(project.sandbox_url || project.sandbox_file_url) ? (
                <a 
                  href={`/labs/sandbox/${project.slug}`}
                  className="w-full py-3 border border-white/10 transition-all flex items-center justify-center gap-2 text-[10px] font-mono tracking-widest uppercase hover:bg-white/5"
                  style={{ borderColor: `${theme.colors.primary}40` }}
                >
                  Abrir Sandbox <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <button 
                  disabled
                  className="w-full py-3 border border-white/5 text-zinc-700 flex items-center justify-center gap-2 text-[10px] font-mono tracking-widest uppercase cursor-not-allowed"
                >
                  Sandbox Offline <Lock className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Tech Decoration */}
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-5 overflow-hidden">
               <Cpu className="w-full h-full rotate-45" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Box */}
      <section 
        className="border p-8 rounded-sm space-y-4"
        style={{ 
          backgroundColor: `${theme.colors.primary}0D`,
          borderColor: `${theme.colors.primary}33`
        }}
      >
        <h2 className="text-xl font-bold flex items-center gap-3">
          <Layers className="w-5 h-5" style={{ color: theme.colors.primary }} />
          Projetos Sob Demanda
        </h2>
        <p className="text-gray-400 text-sm max-w-3xl leading-relaxed">
          Nossa vitrine exibe apenas uma fração do que estamos construindo. Se você é um cliente da Agência 47, pode solicitar acesso ao seu sandbox privado para acompanhar cada commit e alteração visual do seu projeto em tempo real.
        </p>
      </section>
    </div>
  );
}
