"use client";

import React from "react";
import { ArrowUp, Sparkles, Layers } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[rgba(245,242,235,0.08)] bg-[#07080a] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start">
          {/* Brand & Manifesto */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center border border-[rgba(245,242,235,0.1)] bg-[#12141a] text-[#ff5722]">
                <Layers className="h-3.5 w-3.5" />
              </div>
              <span className="font-mono text-xs font-bold tracking-widest text-[#f5f2eb]">
                AGÊNCIA 47 // PITCH DECK ARCHIVE
              </span>
            </div>

            <p className="text-xs text-[#8c877d] max-w-md leading-relaxed">
              Uma iniciativa experimental do ecossistema AG47 Labs para documentar
              e expor teses de negócio, inteligência artificial aplicada,
              estratégias de marca e produtos que moldam o futuro digital.
            </p>

            <div className="flex items-center gap-3 text-xs font-mono text-[#8c877d]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#ff5722]" />
              <span>Edição 2026 • Curadoria Contínua</span>
            </div>
          </div>

          {/* Categories Quick Reference */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#f5f2eb]">
              Pilares da Curadoria
            </span>
            <ul className="space-y-1.5 text-[#8c877d]">
              <li>• Inteligência Artificial & Agentes</li>
              <li>• Startups & Modelos de Negócio</li>
              <li>• Narrativas de Alta Conversão</li>
              <li>• Computação Espacial & Web3</li>
            </ul>
          </div>

          {/* Back to top & Copyright */}
          <div className="md:col-span-3 flex flex-col items-start md:items-end justify-between space-y-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 border border-[rgba(245,242,235,0.1)] bg-[#12141a] px-4 py-2 text-xs font-mono text-[#f5f2eb] hover:border-[#ff5722] hover:text-[#ff7043] transition-colors"
            >
              <span>Voltar ao Topo</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>

            <p className="text-[11px] font-mono text-[#5a574f]">
              © 2026 Agência 47. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
