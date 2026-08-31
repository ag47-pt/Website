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
  ShieldCheck,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Flame,
  BrainCircuit
} from 'lucide-react';

export function IdeChatFlow() {
  const { theme } = useTheme();
  const [copiedPrompt, setCopiedPrompt] = useState<number | null>(null);

  const samplePrompts = [
    {
      title: '01. Intenção Inicial de Avaliação',
      desc: 'O utilizador solicita análise; o agente executa reconhecimento e Second Brain autonomamente.',
      intent: 'Analise este repositório e determine a próxima prioridade arquitetural.',
      agentOutputHeader: '# AG47.pt 🧠 EvoPro • Repository Assessment',
      agentOutputSnippet: `• Workspace: HOST (Python 3.13 / Next.js)
• Memória Soberana: evolution/ (Adotada: HOST_CANONICAL_READ_ONLY)
• Context Router: 14 domínios indexados em modo ADOPTED_MEMORY
• Riscos Ativos: 2 candidatos a revisão de permissões

🧭 Próxima Ação Recomendada:
Executar auditoria de contratos em src/auth/ e validar testes de RBAC.`
    },
    {
      title: '02. Intervenção de Segurança Delimitada',
      desc: 'O utilizador pede correção; o agente mapeia contratos, aplica mudança mínima e executa testes.',
      intent: 'Precisamos restringir a leitura de dados de funcionários no Firestore.',
      agentOutputHeader: '# AG47.pt ⚠️ EvoPro • Risk Remediation & Test Proof',
      agentOutputSnippet: `• Contrato Afetado: firestore.rules (Domain: Employees)
• Mutação Cirúrgica: 3 regras atualizadas com isolamento de tenant
• Validação de Regressão: 44/44 testes aprovados (29 falhas pré-correção resolvidas)

✅ Veredito: ACCEPT (Zero findings bloqueantes no Gauntlet)
🧭 Próxima Ação Recomendada:
Sincronizar a documentação canónica em evolution/architecture/security.md.`
    },
    {
      title: '03. Handoff e Continuidade a Frio',
      desc: 'Um novo modelo de IA assume a tarefa sem ler histórico de chat anterior.',
      intent: 'Qual é o estado atual do objetivo e o que está bloqueado?',
      agentOutputHeader: '# AG47.pt 🧭 EvoPro • Continuity State',
      agentOutputSnippet: `• Global Goal: "SaaS Production Readiness" (Critérios: 3/4 Aprovados)
• Sprint Ativo: SPRINT-014 (Idempotência de Webhooks)
• Bloqueios: 0 decisões humanas pendentes
• Telemetria: Sessão quente reutilizando memória prévia (-72% context load)

🧭 Próxima Ação Recomendada:
Executar evolution tick para fechar o ciclo do Sprint #014.`
    }
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(idx);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  return (
    <section id="agent-first" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            AGENT-FIRST INTENT MODEL & CHAT UX
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Experiência Conversacional Orientada à Intenção
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            No EvoPro, o utilizador <strong>não memoriza comandos de terminal nem caminhos internos</strong>. O humano fornece intenção e autoridade; o EvoPro Agent coordena contexto, memória, ferramentas seguras e recomenda a única próxima ação.
          </p>
        </div>

        {/* Workflow Comparison: Command-First vs Agent-First */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 font-mono text-xs">
          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
              <span className="font-bold text-zinc-400 uppercase text-xs">Paradigma Tradicional (Command-First)</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">Manual / Fricção</span>
            </div>
            <ul className="space-y-3 text-zinc-400 font-sans text-xs">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold font-mono">✕</span>
                <span>O humano precisa de saber comandos de shell e sintaxe de cada CLI.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold font-mono">✕</span>
                <span>O agente pede constantemente para o utilizador rodar comandos no terminal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold font-mono">✕</span>
                <span>Contexto perde-se a cada nova janela de chat, forçando re-leitura total.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-950 border border-purple-500/30 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
              <span className="font-bold text-purple-400 uppercase text-xs">Padrão EvoPro (Agent-First Intent Model)</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] border border-purple-500/20 font-bold">
                Autônomo & Seguro
              </span>
            </div>
            <ul className="space-y-3 text-zinc-300 font-sans text-xs">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold font-mono">✓</span>
                <span>O humano declara intenção em português ou inglês no chat da IDE.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold font-mono">✓</span>
                <span>O agente deteta o host, adota memória, roda ferramentas e valida com testes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold font-mono">✓</span>
                <span>A resposta é formatada com cabeçalho de ownership explícito e próxima ação recomendada.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Interactive Chat UX Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs mb-12">
          {samplePrompts.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 rounded-3xl bg-zinc-950/90 border border-zinc-800 backdrop-blur-xl flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                  <span className="font-bold text-white text-xs">{item.title}</span>
                  <button
                    onClick={() => handleCopy(item.intent, idx)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[11px] border border-zinc-700/60 transition-all cursor-pointer"
                    title="Copiar intenção de exemplo"
                  >
                    {copiedPrompt === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPrompt === idx ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-200 leading-relaxed font-sans text-xs mb-4">
                  <span className="text-[10px] text-zinc-500 font-mono block mb-1 uppercase">Prompt de Intenção do Usuário:</span>
                  &ldquo;{item.intent}&rdquo;
                </div>

                <div className="p-3.5 rounded-2xl bg-black/90 border border-zinc-800 text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap text-[11px]">
                  <div className="text-cyan-400 font-bold mb-2 pb-1 border-b border-zinc-900">
                    {item.agentOutputHeader}
                  </div>
                  {item.agentOutputSnippet}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[10px] text-zinc-500 flex items-center justify-between">
                <span>UX Contract: EVOPRO_AGENT_CHAT_UX.md</span>
                <span className="text-emerald-400">Ownership AG47.pt</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Severity Tokens Legend */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 font-mono text-xs text-zinc-400">
          <span className="text-[11px] text-zinc-500 uppercase block mb-3 font-bold">
            Semântica Visual Estável de Resposta (Chat UX Standard):
          </span>
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1 text-rose-400">🔴 Crítico</span>
            <span className="inline-flex items-center gap-1 text-amber-400">🟠 Alto</span>
            <span className="inline-flex items-center gap-1 text-yellow-400">🟡 Médio</span>
            <span className="inline-flex items-center gap-1 text-cyan-400">🔵 Baixo</span>
            <span className="inline-flex items-center gap-1 text-purple-400">🧠 Cognitivo / Inferred</span>
            <span className="inline-flex items-center gap-1 text-emerald-400">✅ Validado / Pass</span>
            <span className="inline-flex items-center gap-1 text-cyan-300">🧭 Próxima Ação</span>
          </div>
        </div>
      </div>
    </section>
  );
}
