"use client";

import { Activity, Eye, Radio, RefreshCw, WifiOff } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { LiveTokenItem, useAltRadarStream } from "@/hooks/useAltRadarStream";

interface LiveStreamSectionProps {
  onInspectToken: (token: LiveTokenItem) => void;
}

export function LiveStreamSection({ onInspectToken }: LiveStreamSectionProps) {
  const { theme } = useTheme();
  const stream = useAltRadarStream();

  return (
    <section
      id="stream-feed"
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
            <Radio className="h-3.5 w-3.5" />
            ESTADO DA TELEMETRIA PÚBLICA
          </span>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Feed em tempo real não disponibilizado
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
            O portal público consulta a API por HTTP GET. Ele não expõe
            atualmente um endpoint WebSocket nem apresenta descobertas simuladas
            como dados ao vivo.
          </p>
        </div>

        <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs shadow-xl sm:flex-row sm:p-5">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-xl border border-zinc-800 bg-zinc-900 p-2 ${
                stream.isApiReachable ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">API pública HTTP</span>
                <span
                  aria-label={
                    stream.isApiReachable
                      ? "API acessível"
                      : "API não confirmada"
                  }
                  className={`h-2 w-2 rounded-full ${
                    stream.isApiReachable ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                />
              </div>
              <span className="text-[11px] text-zinc-400">
                {stream.statusMessage}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <div className="hidden flex-col text-right text-[11px] md:flex">
              <span>Última verificação HTTP:</span>
              <span className="font-bold text-zinc-200">
                {stream.lastCheck ?? "Ainda não realizada"}
              </span>
            </div>
            <button
              onClick={stream.recheck}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-300 transition-colors hover:bg-zinc-800"
              type="button"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Verificar API</span>
            </button>
          </div>
        </div>

        {stream.liveFeed.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/80 px-6 py-12 text-center backdrop-blur-xl">
            <div className="mb-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-3 text-zinc-400">
              <WifiOff className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-base font-bold text-white">
              Nenhum feed público configurado
            </h3>
            <p className="max-w-xl text-sm leading-relaxed text-zinc-400">
              A disponibilidade da API indica apenas que consultas GET podem ser
              atendidas. Tokens, scores e sparklines não são inventados quando
              não existe uma fonte de streaming.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {stream.liveFeed.map((token) => (
              <div
                key={token.id}
                className="group flex flex-col justify-between space-y-6 rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 backdrop-blur-xl transition-all hover:border-zinc-700"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 font-mono text-xs font-bold text-white">
                        {token.symbol}
                      </span>
                      <span className="font-mono text-[11px] uppercase text-zinc-400">
                        {token.chain}
                      </span>
                    </div>
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold ${
                        token.riskLevel === "LOW"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {token.riskLevel} RISK
                    </span>
                  </div>
                  <h3 className="mb-1 truncate text-base font-bold text-white">
                    {token.name}
                  </h3>
                  <span className="font-mono text-xs text-zinc-400">
                    {token.timestamp}
                  </span>
                </div>

                <div className="space-y-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-zinc-400">Liquidez informada:</span>
                    <span className="font-bold text-white">
                      {token.liquidity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-zinc-400">Score informado:</span>
                    <span
                      className="text-sm font-black"
                      style={{
                        color:
                          token.score >= 80 ? theme.colors.primary : "#f59e0b",
                      }}
                    >
                      {token.score}/100
                    </span>
                  </div>
                  <p className="border-t border-zinc-800 pt-3 font-mono text-[10px] text-zinc-500">
                    Série histórica não disponibilizada.
                  </p>
                </div>

                <button
                  onClick={() => onInspectToken(token)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-700/60 bg-zinc-900 py-2.5 font-mono text-xs font-semibold text-zinc-200 transition-all hover:bg-zinc-800 group-hover:border-zinc-500"
                  type="button"
                >
                  <Eye className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Inspecionar dados informados</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
