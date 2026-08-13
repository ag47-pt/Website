'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  MessageSquare, 
  Copy, 
  Check, 
  Terminal, 
  ArrowRight, 
  Bot, 
  Sparkles,
  Layers,
  ShieldCheck
} from 'lucide-react';

export function IdeChatFlow() {
  const { theme } = useTheme();
  const [copiedPrompt, setCopiedPrompt] = useState<number | null>(null);

  const prompts = [
    {
      title: '01. Reconhecimento Inicial e Continuidade',
      desc: 'Instrução para um agente que acaba de abrir o repositório a frio.',
      prompt: `Lê o ficheiro .evolution/CONTINUITY.md e o .evolution/goal/global-goal.json neste repositório.
Reconstrói o estado atual do host, identifica o sprint ativo e explica qual é a única próxima ação recomendada pelo protocolo.`
    },
    {
      title: '02. Execução de Pedido Cognitivo (03_cognitive_request)',
      desc: 'Instrução para o agente inspecionar a demanda pendente do ciclo e propor código.',
      prompt: `Inspeciona o ficheiro .evolution/runtime/active-task/03_cognitive_request.json.
Formula a mutação necessária para satisfazer os critérios do sprint ativo e grava a proposta em .evolution/runtime/active-task/03_proposed_changeset.json.
Em seguida, executa "evolution tick" para avançar a validação determinística.`
    },
    {
      title: '03. Correção de Findings do Gauntlet',
      desc: 'Instrução após um veredito REVISE do Judge.',
      prompt: `O Judge emitiu um veredito REVISE. Lê o relatório em .evolution/runtime/gauntlet/report.json e a comparação de baseline em .evolution/runtime/baselines/comparison.json.
Corrige os findings pontados pelos críticos sem violar os caminhos protegidos do host_contract.`
    }
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(idx);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  return (
    <section id="ide-chat" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            INTEGRAÇÃO COM CODING AGENTS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Como Usar no Chat da sua IDE
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Abra o seu repositório no <strong>Claude Code, Codex, Antigravity, VS Code ou Cursor</strong> e utilize prompts padronizados para interagir com o kernel.
          </p>
        </div>

        {/* Prompts Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs mb-12">
          {prompts.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800 backdrop-blur-xl flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-white text-xs">{item.title}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(item.prompt, idx)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[11px] border border-zinc-700/60 transition-all cursor-pointer"
                  >
                    {copiedPrompt === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPrompt === idx ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed mb-4">
                  {item.desc}
                </p>

                <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap">
                  {item.prompt}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[10px] text-zinc-500 flex items-center justify-between">
                <span>Contrato: .evolution/runtime/</span>
                <span className="text-purple-400">Prompt validado</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Permissões Requeridas Callout */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 font-mono text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Requisitos de Execução:</strong> O agente de IA precisa de permissões de leitura/escrita no filesystem do host e acesso ao terminal para executar os comandos <code className="text-zinc-300">evolution</code>.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
