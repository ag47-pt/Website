'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface Agent {
  id: string;
  name: string;
  description: string;
  skills: string[];
}

export default function AgentCard({ agent }: { agent: Agent }) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(`@[.agent/agents/${agent.id}] Aja como o agente ${agent.name} para resolver a seguinte tarefa: `);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderDescription = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <span key={i} className="text-white font-bold">{part.slice(2, -2)}</span>;
      }
      return part;
    });
  };

  return (
    <div 
      className="flex flex-col group relative rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl transition-all hover:bg-white/10"
      style={{ '--hover-color': theme.colors.primary, '--hover-shadow': `${theme.colors.primary}26` } as any}
    >
      <style jsx>{`
        div:hover { border-color: var(--hover-color); box-shadow: 0 0 30px -5px var(--hover-shadow); }
        h3.title:hover { color: var(--hover-color); }
      `}</style>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="title text-xl font-semibold text-white transition-colors capitalize">
          {agent.name.replace(/-/g, ' ')}
        </h3>
        <span className="inline-flex items-center rounded-lg bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/70 ring-1 ring-inset ring-white/20">
          Agent
        </span>
      </div>
      
      <p className="text-sm text-gray-400 mb-6 line-clamp-3 leading-relaxed">
        {renderDescription(agent.description)}
      </p>

      {agent.skills && agent.skills.length > 0 && (
        <div className="mb-6 flex-grow">
          <p className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider">Habilidades (Skills)</p>
          <div className="flex flex-wrap gap-2">
            {agent.skills.map((skill, i) => (
              <span 
                key={i} 
                className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                style={{ 
                  backgroundColor: `${theme.colors.primary}1A`, 
                  color: theme.colors.primary, 
                  boxShadow: `inset 0 0 0 1px ${theme.colors.primary}33` 
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-auto pt-6 border-t border-white/10">
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 active:bg-white/20"
        >
          {copied ? (
            <span className="flex items-center gap-2" style={{ color: theme.colors.primary }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Copiado!
            </span>
          ) : (
            <span className="flex items-center gap-2 text-white/90">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              Copiar Prompt do Agente
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
