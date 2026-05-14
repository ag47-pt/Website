'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, Loader2, Layers } from 'lucide-react';
import { supabase } from '@/config/supabase';
import { Project } from '@/types/labs';
import { LabHero, LabVisitCard, LabInfoCard } from '../components';

export function DevShowcaseClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('labs_projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data) setProjects(data);
      } catch (err) {
        console.error('Erro ao carregar projetos do Labs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div className="space-y-12">
      <LabHero 
        overline="PROJECT_STREAM_V2.1"
        overlineIcon={Activity}
        title="Vitrine de"
        highlight="Desenvolvimento"
        description="Acompanhe o desenvolvimento em **tempo real** dos nossos projetos ativos e **MVPs** em fase alfa. Aqui o **design e o código** se fundem para criar experiências digitais sem precedentes."
        statusTags={[
          { label: "Development", color: "orange", pulse: true },
          { label: "Beta", color: "blue" },
          { label: "Restricted", color: "red" }
        ]}
      />

      {/* Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-96 bg-zinc-900/50 border border-white/5 animate-pulse flex items-center justify-center rounded-2xl">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-800" />
            </div>
          ))
        ) : projects.length === 0 ? (
          <div className="col-span-full py-20 text-center border border-white/5 bg-zinc-900/10 rounded-2xl">
            <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest text-center">Nenhum projeto em exibição no momento.</p>
          </div>
        ) : projects.map((project) => (
          <LabVisitCard 
            key={project.id}
            title={project.name}
            client={project.client}
            description={project.description || "Projeto em desenvolvimento ativo no Labs."}
            thumbnail={project.thumbnail_url}
            progress={project.progress}
            specs={project.specs || []}
            slug={project.slug}
            hasSandbox={!!(project.sandbox_url || project.sandbox_file_url)}
            path={`/labs/dev/sandbox/${project.slug}`}
            actionLabel="Acessar Sandbox"
            icon={<Cpu className="w-8 h-8 rotate-45" />}
          />
        ))}
      </div>

      <LabInfoCard 
        title="Projetos Sob Demanda"
        description="Nossa vitrine exibe apenas uma fração do que estamos construindo. Se você é um cliente da Agência 47, pode solicitar acesso ao seu sandbox privado para acompanhar cada commit e alteração visual do seu projeto em tempo real."
        icon={<Layers className="w-6 h-6" />}
      />
    </div>
  );
}
