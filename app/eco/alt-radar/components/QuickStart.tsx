"use client";

import React, { useState } from "react";
import {
  Activity,
  Check,
  Code2,
  Copy,
  Download,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

type PublicApiTab = "fetch" | "endpoint" | "contract";

const snippets: Record<PublicApiTab, string> = {
  fetch: `// Consulta pública no mesmo domínio do site
const response = await fetch('/api/eco/alt-radar/health', {
  method: 'GET',
  cache: 'no-store',
  headers: { Accept: 'application/json' },
});

if (!response.ok) {
  throw new Error(\`API indisponível: HTTP \${response.status}\`);
}

const health = await response.json();
console.log(health);`,
  endpoint: `GET /api/eco/alt-radar/health

Origem: mesmo domínio desta página
Cache: no-store
Acesso público: somente leitura

Este endpoint verifica a disponibilidade HTTP da API.
Ele não comprova a existência de WebSocket ou feed em tempo real.`,
  contract: `CONTRATO DO PORTAL PÚBLICO

Permitido: GET /api/eco/alt-radar/{caminho}
Bloqueado: POST, PATCH e DELETE (HTTP 405)
Credenciais: não são solicitadas pela landing pública
WebSocket público: não disponibilizado
Webhooks públicos: não disponibilizados

As respostas vêm da API upstream ou retornam indisponibilidade explícita.
O portal não fabrica dados de fallback.`,
};

const playSynthSound = () => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Audio feedback is optional.
  }
};

export function QuickStart() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<PublicApiTab>("fetch");
  const [copied, setCopied] = useState(false);

  const selectTab = (tab: PublicApiTab) => {
    setActiveTab(tab);
    setCopied(false);
    playSynthSound();
  };

  const copySnippet = () => {
    void navigator.clipboard.writeText(snippets[activeTab]);
    playSynthSound();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadContract = () => {
    const markdownContent = `# AG47 Alt Radar — Contrato do portal público

## Acesso disponível

- Método: GET
- Endpoint de saúde: /api/eco/alt-radar/health
- Origem: mesmo domínio do portal
- Cache: no-store
- Modo: somente leitura

## Acesso não disponibilizado

- WebSocket público
- Webhooks públicos
- POST, PATCH ou DELETE pela interface pública

O proxy encaminha respostas reais da API upstream ou declara indisponibilidade. Não há fallback sintético.`;

    const blob = new Blob([markdownContent], {
      type: "text/markdown;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "AG47_ALT_RADAR_PUBLIC_API.md");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    playSynthSound();
  };

  const tabs: Array<{
    id: PublicApiTab;
    icon: typeof Activity;
    label: string;
  }> = [
    { id: "fetch", icon: Code2, label: "fetch() GET" },
    { id: "endpoint", icon: Activity, label: "Endpoint" },
    { id: "contract", icon: ShieldCheck, label: "Contrato read-only" },
  ];

  return (
    <section
      id="quickstart"
      className="relative overflow-hidden border-t border-zinc-900 bg-zinc-950/40 py-20 md:py-32"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-14 flex max-w-3xl flex-col items-center text-center">
          <span
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-semibold"
            style={{
              backgroundColor: `${theme.colors.primary}10`,
              borderColor: `${theme.colors.primary}30`,
              color: theme.colors.primary,
            }}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            API PÚBLICA SOMENTE LEITURA
          </span>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Integração GET no mesmo domínio
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
            Consulte a API através do proxy público desta página. A landing não
            oferece WebSocket, webhooks ou operações de escrita.
          </p>
        </div>

        <div
          className="mx-auto max-w-4xl overflow-hidden rounded-3xl border bg-zinc-950 shadow-2xl backdrop-blur-2xl"
          style={{ borderColor: `${theme.colors.primary}30` }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/90 p-4">
            <div className="flex items-center gap-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => selectTab(tab.id)}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                      isActive
                        ? "border border-zinc-700 bg-zinc-800 text-white shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                    style={{
                      borderColor: isActive ? theme.colors.primary : undefined,
                      color: isActive ? theme.colors.primary : undefined,
                    }}
                    type="button"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copySnippet}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 font-mono text-xs text-zinc-300 transition-colors hover:bg-zinc-700"
                title="Copiar contrato público"
                type="button"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Copiar</span>
                  </>
                )}
              </button>

              <button
                onClick={downloadContract}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-300 transition-colors hover:bg-zinc-800"
                title="Descarregar contrato público .md"
                type="button"
              >
                <Download className="h-3.5 w-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Exportar .md</span>
              </button>
            </div>
          </div>

          <div className="min-h-[220px] overflow-x-auto bg-[#04080c] p-6 font-mono text-xs text-zinc-300 sm:text-sm">
            <pre className="whitespace-pre">{snippets[activeTab]}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}
