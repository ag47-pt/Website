'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { UNIVERSO_2D_DATA } from '@/data/universo-2d';
import { Compass, Network, LayoutGrid, Layers, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

export function Universo2DFooter() {
  const { theme, themeContrast } = useTheme();
  const { brand } = UNIVERSO_2D_DATA;

  return (
    <footer className="py-16 px-4 sm:px-6 bg-black border-t border-white/10 text-zinc-400 font-mono text-xs relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs transition-colors duration-500"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: themeContrast || '#000000',
                }}
              >
                47
              </div>
              <span className="font-bold text-base text-white tracking-tight">AGÊNCIA 47</span>
            </div>
            <p className="text-zinc-500 text-xs font-light leading-relaxed mb-4">
              Estúdio de engenharia de software de elite, inteligência artificial proprietária e marketing de alta conversão.
            </p>
            <div 
              className="flex items-center gap-2 text-[11px] font-mono transition-colors duration-500"
              style={{ color: theme.colors.primary }}
            >
              <span 
                className="w-2 h-2 rounded-full animate-pulse transition-colors duration-500"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <span>{brand.status} ({brand.version})</span>
            </div>
          </div>

          {/* Col 2: Hubs & Universos */}
          <div>
            <h4 className="font-bold text-zinc-200 uppercase tracking-wider mb-3 text-[11px]">
              Universos & Hubs
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <Compass className="w-3 h-3 text-cyan-400" />
                  <span>Universo 3D Espacial (Home)</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/universo-2d" 
                  className="font-semibold flex items-center gap-1.5 transition-colors duration-500"
                  style={{ color: theme.colors.primary }}
                >
                  <span>Universo 2D Hub (Visão Direta)</span>
                </Link>
              </li>
              <li>
                <Link href="/eco" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <Network className="w-3 h-3 text-emerald-400" />
                  <span>Eco Hub (Sitemap & Ecossistema)</span>
                </Link>
              </li>
              <li>
                <Link href="/labs" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <LayoutGrid className="w-3 h-3 text-teal-400" />
                  <span>Labs Hub (Pesquisa & Alfas)</span>
                </Link>
              </li>
              <li>
                <Link href="/servicos" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <Layers className="w-3 h-3 text-cyan-400" />
                  <span>Catálogo de Serviços</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Produtos do Ecossistema */}
          <div>
            <h4 className="font-bold text-zinc-200 uppercase tracking-wider mb-3 text-[11px]">
              Produtos Ativos
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/eco/evopro" className="hover:text-white transition-colors">
                  EvoPro (Evolution Protocol)
                </Link>
              </li>
              <li>
                <Link href="/eco/alt-radar" className="hover:text-white transition-colors">
                  Alt Radar (Token Stream)
                </Link>
              </li>
              <li>
                <Link href="/eco/youlearn" className="hover:text-white transition-colors">
                  YouLearn (Video Knowledge)
                </Link>
              </li>
              <li>
                <Link href="/labs/apex" className="hover:text-white transition-colors">
                  APEX Predictor (BTC AI)
                </Link>
              </li>
              <li>
                <Link href="/labs/oracle-trader" className="hover:text-white transition-colors">
                  Oracle Trader (+EV Radar)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Infraestrutura & SLA */}
          <div>
            <h4 className="font-bold text-zinc-200 uppercase tracking-wider mb-3 text-[11px]">
              Infra & Conformidade
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[11px] text-zinc-300 font-semibold mb-1 flex items-center gap-1.5">
                  <ShieldCheck 
                    className="w-3.5 h-3.5 transition-colors duration-500" 
                    style={{ color: theme.colors.primary }}
                  />
                  <span>SLA 99.9% Uptime</span>
                </div>
                <p className="text-[10px] text-zinc-500 font-light">
                  Arquitetura distribuída em Edge com redundância multi-região no Google Cloud.
                </p>
              </div>

              <div className="text-[11px] text-zinc-500 flex flex-col gap-1">
                <span>E-mail: {brand.email}</span>
                <span>WhatsApp: {brand.whatsapp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} Agência 47 (ag47.pt). Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Home 3D
            </Link>
            <span>•</span>
            <Link href="/universo-2d" className="hover:text-zinc-300 transition-colors">
              Universo 2D
            </Link>
            <span>•</span>
            <Link href="/eco" className="hover:text-zinc-300 transition-colors">
              Ecossistema
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
