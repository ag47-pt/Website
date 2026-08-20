"use client";

import { useEffect, useState } from "react";
import { Keyboard, Palette, Search, X } from "lucide-react";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";
import { useTheme } from "@/context/ThemeContext";
import {
  playThemeSwitchSound,
  playTokenSelectSound,
} from "@/eco/alt-radar/apps/web/lib/sonar-audio";

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
  const { primary } = useEcoTheme();
  const { toggleTheme, themeName } = useTheme();

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 1800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInput = tag === "input" || tag === "textarea" || tag === "select";

      // ⌘K ou Ctrl+K ou "/" -> Busca Global
      if ((isCmdOrCtrl && e.key.toLowerCase() === "k") || (!isInput && e.key === "/")) {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[data-testid="global-search"]',
        ) as HTMLInputElement | null;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
          setToastMessage("🔍 Foco na Busca Global [⌘K]");
        }
        return;
      }

      // Se o utilizador estiver num campo de texto, não dispara atalhos de navegação simples
      if (isInput) {
        if (e.key === "Escape") {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      // T -> Alternar Tema Global
      if (e.key.toLowerCase() === "t") {
        e.preventDefault();
        playThemeSwitchSound();
        toggleTheme();
        const nextThemes: Record<string, string> = {
          default: "LIME (#D1FF00)",
          lime: "ORANGE (#FFAA00)",
          orange: "BLUE (#0059FF)",
          blue: "TOMATE (#FF0000)",
          tomate: "DEFAULT (#EC4899)",
        };
        const next = nextThemes[themeName] ?? "TEMA ATUALIZADO";
        setToastMessage(`🎨 Alternando Tema [T] → ${next}`);
      } else if (e.key === "j" || e.key === "ArrowDown") {
        if (onNextRow) {
          e.preventDefault();
          playTokenSelectSound();
          onNextRow();
          setToastMessage("↓ Próximo Token [J]");
        }
      } else if (e.key === "k" || e.key === "ArrowUp") {
        if (onPrevRow) {
          e.preventDefault();
          playTokenSelectSound();
          onPrevRow();
          setToastMessage("↑ Token Anterior [K]");
        }
      } else if (e.key === "i" || e.key === "Enter") {
        if (onInspect) {
          e.preventDefault();
          playTokenSelectSound();
          onInspect();
          setToastMessage("🔍 Inspecionar Dossiê [I]");
        }
      } else if (e.key === "p") {
        if (onPaperTrade) {
          e.preventDefault();
          playTokenSelectSound();
          onPaperTrade();
          setToastMessage("💼 Simulação Paper Trading [P]");
        }
      } else if (e.key === "?") {
        e.preventDefault();
        playTokenSelectSound();
        setShowHelp((prev) => !prev);
      } else if (e.key === "Escape") {
        setShowHelp(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNextRow, onPrevRow, onInspect, onPaperTrade, toggleTheme, themeName]);

  return (
    <>
      {/* Quick floating indicator */}
      <button
        type="button"
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 z-40 hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[0.65rem] font-mono font-bold text-zinc-300 shadow-2xl backdrop-blur-xl hover:bg-white/10 hover:text-white transition-all cursor-pointer"
        title="Ver Atalhos Táticos do Teclado"
      >
        <Keyboard className="size-3.5" style={{ color: primary }} />
        <span>Atalhos [?]</span>
      </button>

      {/* Action Toast Feedback */}
      {toastMessage && (
        <div
          className="fixed bottom-14 right-4 z-50 rounded-2xl border bg-black/90 px-4 py-2.5 font-mono text-xs font-bold shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2"
          style={{
            borderColor: `${primary}60`,
            color: primary,
            boxShadow: `0 0 25px ${primary}30`,
          }}
        >
          <span className="size-2 rounded-full animate-ping" style={{ backgroundColor: primary }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Fechar painel de ajuda"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowHelp(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-black/95 p-5 font-mono text-white shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Keyboard className="size-4" style={{ color: primary }} />
                <h3 className="text-xs font-bold uppercase tracking-wider">Atalhos Táticos</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="grid size-6 place-items-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Search className="size-3 text-zinc-500" /> Busca Global
                </span>
                <kbd
                  className="rounded border border-white/20 bg-white/5 px-2 py-0.5 font-bold"
                  style={{ color: primary }}
                >
                  ⌘K ou /
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Palette className="size-3 text-zinc-500" /> Alternar Tema
                </span>
                <kbd
                  className="rounded border border-white/20 bg-white/5 px-2 py-0.5 font-bold"
                  style={{ color: primary }}
                >
                  T
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Navegar p/ Baixo</span>
                <kbd
                  className="rounded border border-white/20 bg-white/5 px-2 py-0.5 font-bold"
                  style={{ color: primary }}
                >
                  J ou ↓
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Navegar p/ Cima</span>
                <kbd
                  className="rounded border border-white/20 bg-white/5 px-2 py-0.5 font-bold"
                  style={{ color: primary }}
                >
                  K ou ↑
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Inspecionar Token</span>
                <kbd
                  className="rounded border border-white/20 bg-white/5 px-2 py-0.5 font-bold"
                  style={{ color: primary }}
                >
                  I ou Enter
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Paper Trading</span>
                <kbd
                  className="rounded border border-white/20 bg-white/5 px-2 py-0.5 font-bold"
                  style={{ color: primary }}
                >
                  P
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Exibir este menu</span>
                <kbd
                  className="rounded border border-white/20 bg-white/5 px-2 py-0.5 font-bold"
                  style={{ color: primary }}
                >
                  ?
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-zinc-400">Fechar Modal / Blur</span>
                <kbd className="rounded border border-white/20 bg-white/5 px-2 py-0.5 text-zinc-300">
                  Esc
                </kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
