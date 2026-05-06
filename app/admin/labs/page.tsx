'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Edit3, ExternalLink, RefreshCw, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/config/supabase';

import { Project } from '@/types/labs';

export default function AdminLabsPage() {
  const { theme } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    client: '',
    slug: '',
    status: 'IN_DEVELOPMENT',
    progress: 0,
    sandbox_url: '',
    sandbox_file_url: '',
    specs: []
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase
      .from('labs_projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProjects(data);
    setLoading(false);
  }

  const handleFileUpload = async (file: File, projectId?: string, type: 'html' | 'image' = 'html') => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${type === 'html' ? 'sandboxes' : 'thumbnails'}/${fileName}`;

      const { error } = await supabase.storage
        .from('labs')
        .upload(filePath, file, {
          contentType: type === 'html' ? 'text/html' : file.type,
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('labs')
        .getPublicUrl(filePath);

      if (projectId || editingId) {
        const id = projectId || editingId;
        updateProjectLocal(id!, type === 'html' ? 'sandbox_file_url' : 'thumbnail_url', publicUrl);
      } else {
        setNewProject(prev => ({ 
          ...prev, 
          [type === 'html' ? 'sandbox_file_url' : 'thumbnail_url']: publicUrl 
        }));
      }
      alert(`${type === 'html' ? 'Arquivo' : 'Imagem'} carregada com sucesso!`);
    } catch (error: any) {
      alert('Erro no upload: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (project: Project) => {
    setIsSaving(true);
    const { error } = await supabase
      .from('labs_projects')
      .update({
        name: project.name,
        client: project.client,
        status: project.status,
        progress: project.progress,
        slug: project.slug,
        sandbox_url: project.sandbox_url,
        sandbox_file_url: project.sandbox_file_url,
        thumbnail_url: project.thumbnail_url
      })
      .eq('id', project.id);

    if (error) {
      console.error('Error saving project:', error);
      alert(`Erro ao salvar: ${error.message}${error.message.includes('column') ? ' (Provavelmente a coluna sandbox_url não existe na tabela)' : ''}`);
    } else {
      setEditingId(null);
      fetchProjects();
    }
    setIsSaving(false);
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
    const { error } = await supabase.from('labs_projects').delete().eq('id', id);
    if (error) alert('Erro ao excluir: ' + error.message);
    else fetchProjects();
  };

  const createProject = async () => {
    if (!newProject.name) return;
    setIsSaving(true);
    
    const { error } = await supabase.from('labs_projects').insert([
      { ...newProject }
    ]);

    if (error) {
      console.error('Error creating project:', error);
      alert(`Erro ao criar: ${error.message}${error.message.includes('column') ? ' (Provavelmente a coluna sandbox_url não existe na tabela)' : ''}`);
    } else {
      setIsCreating(false);
      setNewProject({ name: '', client: '', slug: '', status: 'IN_DEVELOPMENT', progress: 0, sandbox_url: '' });
      fetchProjects();
    }
    setIsSaving(false);
  };

  const updateProjectLocal = (id: string, field: string, value: any) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
            Gestão <span className="px-2" style={{ backgroundColor: theme.colors.primary, color: '#000', borderRadius: '4px' }}>Labs</span>
          </h1>
          <p className="text-sm text-zinc-500 font-mono uppercase tracking-[0.2em]">Controle de Showcase de Desenvolvimento</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="px-8 py-4 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 rounded-full shadow-lg hover:brightness-110"
          style={{ 
            backgroundColor: theme.colors.primary, 
            color: '#000',
            boxShadow: `0 8px 24px ${theme.colors.primary}40`
          }}
        >
          {isCreating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isCreating ? 'Cancelar' : 'Novo Projeto'}
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-white/5 bg-black/40">
              <th className="p-8 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Projeto</th>
              <th className="p-8 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Configuração & Status</th>
              <th className="p-8 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Entrega</th>
              <th className="p-8 text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-right">Controle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isCreating && (
              <tr className="bg-white/[0.03]" style={{ borderLeft: `4px solid ${theme.colors.primary}` }}>
                <td className="p-8">
                  <div className="flex gap-4 items-start">
                    <label className="shrink-0 w-20 h-20 rounded-xl bg-black/50 border-2 border-dashed border-white/10 hover:border-white/30 cursor-pointer flex flex-col items-center justify-center gap-1 transition-all overflow-hidden group relative">
                      {newProject.thumbnail_url ? (
                        <Image 
                          src={newProject.thumbnail_url} 
                          fill
                          className="object-cover" 
                          alt="Thumbnail Preview" 
                          unoptimized
                        />
                      ) : (
                        <>
                          <ImageIcon className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400" />
                          <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Capa</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], undefined, 'image')}
                      />
                    </label>
                    <div className="space-y-2 grow">
                      <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Título do Projeto</label>
                      <input 
                        placeholder="Ex: Neural Interface"
                        className="bg-black/50 border border-white/10 px-4 py-3 outline-none w-full text-white font-bold rounded-xl focus:border-white/30 transition-all"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Cliente</label>
                      <input 
                        placeholder="Nome do Cliente"
                        className="bg-black/50 border border-white/10 px-4 py-3 outline-none w-full text-xs rounded-xl focus:border-white/30 transition-all"
                        value={newProject.client}
                        onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Status</label>
                      <select 
                        className="bg-black/50 border border-white/10 px-4 py-3 outline-none w-full text-xs rounded-xl focus:border-white/30 transition-all appearance-none"
                        value={newProject.status}
                        onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                      >
                        <option value="IN_DEVELOPMENT">EM DESENVOLVIMENTO</option>
                        <option value="BETA_TESTING">BETA TEST</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Link Externo (Web)</label>
                      <input 
                        placeholder="https://exemplo.com"
                        className="bg-black/50 border border-white/10 px-4 py-3 outline-none w-full text-xs rounded-xl focus:border-white/30 transition-all"
                        value={newProject.sandbox_url}
                        onChange={(e) => setNewProject({ ...newProject, sandbox_url: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Protótipo HTML (Arquivo)</label>
                      <div className="flex gap-2">
                        <input 
                          placeholder="Link do arquivo carregado"
                          readOnly
                          className="bg-black/20 border border-white/5 px-4 py-3 outline-none w-full text-xs rounded-xl text-zinc-500 italic"
                          value={newProject.sandbox_file_url || 'Nenhum arquivo...'}
                        />
                        <label className="shrink-0 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 cursor-pointer transition-all">
                          <input 
                            type="file" 
                            className="hidden" 
                            accept=".html"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                          />
                          {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        </label>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Progresso (%)</label>
                    <input 
                      type="number"
                      className="bg-black/50 border border-white/10 px-4 py-3 outline-none w-24 text-xs rounded-xl focus:border-white/30 transition-all"
                      value={newProject.progress}
                      onChange={(e) => setNewProject({ ...newProject, progress: parseInt(e.target.value) })}
                    />
                  </div>
                </td>
                <td className="p-8 text-right">
                  <button 
                    onClick={createProject}
                    disabled={isSaving}
                    className="px-6 py-3 rounded-xl text-black font-black uppercase text-[10px] tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 ml-auto"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Confirmar
                  </button>
                </td>
              </tr>
            )}

            {loading ? (
              <tr>
                <td colSpan={4} className="p-32 text-center">
                  <div className="relative inline-block">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-zinc-800" />
                    <div className="absolute inset-0 blur-xl opacity-20" style={{ backgroundColor: theme.colors.primary }}></div>
                  </div>
                  <p className="mt-6 text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">Sincronizando Labs...</p>
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-32 text-center">
                  <div className="text-zinc-700 font-black text-6xl opacity-10 mb-4 uppercase">Vazio</div>
                  <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Nenhum projeto cadastrado no sistema.</p>
                </td>
              </tr>
            ) : projects.map((project) => (
              <tr key={project.id} className="group hover:bg-white/[0.01] transition-all duration-500">
                <td className="p-8">
                  <div className="flex gap-4 items-start">
                    <label className="shrink-0 w-20 h-20 rounded-xl bg-black/50 border-2 border-dashed border-white/10 hover:border-white/30 cursor-pointer flex flex-col items-center justify-center gap-1 transition-all overflow-hidden group/thumb relative">
                      {project.thumbnail_url ? (
                        <Image 
                          src={project.thumbnail_url} 
                          fill
                          className="object-cover" 
                          alt={project.name} 
                          unoptimized
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-1">
                          <ImageIcon className="w-5 h-5 text-zinc-600 group-hover/thumb:text-zinc-400" />
                          <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Capa</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], project.id, 'image')}
                      />
                    </label>
                    <div className="grow">
                      {editingId === project.id ? (
                        <input 
                          className="bg-black border-2 px-4 py-3 outline-none w-full text-white font-bold rounded-xl transition-all"
                          style={{ borderColor: theme.colors.primary + '40' }}
                          value={project.name}
                          onChange={(e) => updateProjectLocal(project.id, 'name', e.target.value)}
                        />
                      ) : (
                        <div className="flex flex-col">
                          <span 
                            className="text-white font-bold text-lg tracking-tight transition-colors"
                            onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
                          >
                            {project.name}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{project.slug}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  {editingId === project.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <input 
                          className="bg-black border border-white/10 px-4 py-2 outline-none w-full text-zinc-400 font-mono text-xs rounded-lg"
                          value={project.client}
                          onChange={(e) => updateProjectLocal(project.id, 'client', e.target.value)}
                        />
                        <select 
                          className="bg-black border border-white/10 px-2 py-2 outline-none w-full text-[10px] font-mono rounded-lg"
                          value={project.status}
                          onChange={(e) => updateProjectLocal(project.id, 'status', e.target.value)}
                        >
                          <option value="IN_DEVELOPMENT">IN_DEVELOPMENT</option>
                          <option value="BETA_TESTING">BETA_TESTING</option>
                        </select>
                        <input 
                          placeholder="Link Externo"
                          className="bg-black border border-white/10 px-4 py-2 outline-none w-full text-zinc-400 font-mono text-[10px] rounded-lg"
                          value={project.sandbox_url || ''}
                          onChange={(e) => updateProjectLocal(project.id, 'sandbox_url', e.target.value)}
                        />
                        <div className="flex gap-2">
                          <input 
                            placeholder="Arquivo Carregado"
                            readOnly
                            className="bg-black/20 border border-white/5 px-2 py-2 outline-none w-full text-zinc-600 font-mono text-[9px] rounded-lg truncate italic"
                            value={project.sandbox_file_url ? 'Arquivo OK' : 'Sem arquivo'}
                          />
                          <label className="shrink-0 p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 cursor-pointer transition-all">
                            <input 
                              type="file" 
                              className="hidden" 
                              accept=".html"
                              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], project.id)}
                            />
                            {isUploading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                          </label>
                        </div>
                      </div>
                      <textarea 
                        className="bg-black border border-white/10 px-4 py-3 outline-none w-full text-zinc-400 font-mono text-xs h-24 rounded-xl"
                        placeholder="Tecnologias (Separadas por vírgula)"
                        value={Array.isArray(project.specs) ? project.specs.join(', ') : ''}
                        onChange={(e) => updateProjectLocal(project.id, 'specs', e.target.value.split(',').map(s => s.trim()))}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter" style={{ backgroundColor: theme.colors.primary, color: '#000' }}>
                          {project.status.replace('_', ' ')}
                        </span>
                        <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">/ {project.client}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.specs?.map((spec: string) => (
                          <span key={spec} className="text-[9px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </td>
                <td className="p-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Progress</span>
                      <span className="text-xs font-bold text-white">{project.progress}%</span>
                    </div>
                    {editingId === project.id ? (
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          className="w-full h-1"
                          style={{ accentColor: theme.colors.primary }}
                          value={project.progress}
                          onChange={(e) => updateProjectLocal(project.id, 'progress', parseInt(e.target.value))}
                        />
                    ) : (
                      <div className="w-40 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          className="h-full rounded-full"
                          style={{ 
                            backgroundColor: theme.colors.primary,
                            boxShadow: `0 0 12px ${theme.colors.primary}60`
                          }}
                        />
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-8 text-right">
                    <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                      {editingId === project.id ? (
                        <button 
                          onClick={() => handleSave(project)}
                          className="w-10 h-10 flex items-center justify-center bg-green-500 text-black rounded-xl hover:brightness-110 active:scale-90 transition-all"
                          disabled={isSaving}
                        >
                          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        </button>
                      ) : (
                        <>
                          {project.sandbox_url && (
                            <a 
                              href={`/labs/sandbox/${project.slug}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl transition-all"
                              title="Ver Sandbox Profissional"
                            >
                              <ExternalLink className="w-4 h-4 text-zinc-400 hover:text-white" />
                            </a>
                          )}
                          <button 
                            onClick={() => setEditingId(project.id)}
                            className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl transition-all"
                            title="Editar Projeto"
                          >
                            <Edit3 className="w-4 h-4 text-zinc-400 hover:text-white" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => deleteProject(project.id)}
                        className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-xl transition-all group/del"
                        title="Excluir Projeto"
                      >
                        <Trash2 className="w-4 h-4 text-zinc-400 group-hover/del:text-red-500" />
                      </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between p-8 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Supabase Real-time Sync</h4>
            <p className="text-[10px] text-zinc-500 font-mono">Alterações refletidas instantaneamente no site público</p>
          </div>
        </div>
        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest border border-white/5 px-4 py-2 rounded-full">
          Admin Portal v2.0
        </div>
      </div>

    </div>
  );
}
