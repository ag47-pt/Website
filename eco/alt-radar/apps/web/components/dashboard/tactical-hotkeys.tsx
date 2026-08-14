"use client";

import { useEffect, useState } from "react";
import { Command, Keyboard, Volume2, VolumeX, X } from "lucide-react";
import { playTacticalAlertSound, toggleAudioMuted } from "@/eco/alt-radar/apps/web/lib/sonar-audio";

interface TacticalHotkeysProps {
  onNextRow?: () => void;
  onPrevRow?: () => void;
  onInspect?: () => void;
  onPaperTrade?: () => void;
}

export function TacticalHotkeys({
  onNextRow,
  onPrevRow,
  onInspect,
  onPaperTrade,
}: TacticalHotkeysProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when user is actively typing in form inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === "j") {
        e.preventDefault();
        onNextRow?.();
        showToast("↓ Próximo Ativo [J]");
      } else if (key === "k") {
        e.preventDefault();
        onPrevRow?.();
        showToast("↑ Ativo Anterior [K]");
      } else if (key === " " || key === "i") {
        e.preventDefault();
        onInspect?.();
        showToast("🔍 Inspecionar Ativo [Espaço]");
      } else if (key === "b") {
        e.preventDefault();
        onPaperTrade?.();
        showToast("📈 Paper Trade Aberto [B]");
      } else if (key === "m") {
        e.preventDefault();
        const isMuted = toggleAudioMuted();
        if (!isMuted) {
          playTacticalAlertSound(440, 880, 0.15);
        }
        showToast(!isMuted ? "🔊 Sonar Ativado [M]" : "🔇 Sonar Mutado [M]");
      } else if (key === "?" || (e.shiftKey && key === "/")) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
      } else if (key === "escape") {
        setShowHelp(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNextRow, onPrevRow, onInspect, onPaperTrade]);

  return (
    <>
      {/* Quick floating indicator */}
      <button
        type="button"
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 z-40 hidden sm:inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-950/90 px-3 py-1.5 text-[0.65rem] font-mono font-bold text-zinc-400 shadow-xl backdrop-blur-md hover:border-[#d1ff00]/40 hover:text-white transition-all cursor-pointer"
        title="Ver Atalhos Táticos do Teclado"
      >
        <Keyboard className="size-3.5 text-[#d1ff00]" />
        <span>Atalhos [?]</span>
      </button>

      {/* Action Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-14 right-4 z-50 rounded-xl border border-[#d1ff00]/40 bg-zinc-950/95 px-3.5 py-2 font-mono text-xs font-bold text-[#d1ff00] shadow-2xl backdrop-blur-md animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowHelp(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-5 font-mono text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Command className="size-4 text-[#d1ff00]" />
                <h3 className="text-sm font-bold">Atalhos Táticos (Hotkeys)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="rounded-full border border-zinc-800 p-1 text-zinc-400 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-3.5 space-y-2 text-xs">
              {[
                { key: "J", action: "Navegar para o próximo token na tabela" },
                { key: "K", action: "Navegar para o token anterior" },
                { key: "Espaço / I", action: "Inspecionar ativo / abrir detalhes" },
                { key: "B", action: "Abrir ordem virtual (Paper Trade)" },
                { key: "M", action: "Ativar / Mutar áudio do Sonar" },
                { key: "ESC", action: "Fechar modais e painéis" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-1 border-b border-zinc-900 last:border-0">
                  <span className="text-zinc-400 text-[0.68rem]">{item.action}</span>
                  <kbd className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[0.65rem] font-bold text-[#d1ff00]">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2 text-xs font-bold text-white hover:border-zinc-700"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
