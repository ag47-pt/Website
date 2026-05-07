'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu, Menu, X, TrendingUp, Bot, Plug, Server, Brain, Activity, Settings } from 'lucide-react';

const navItems = [
  { href: '/nexus/dashboard',     icon: TrendingUp, label: 'Dashboard' },
  { href: '/nexus/agentes',       icon: Bot,        label: 'Agentes' },
  { href: '/nexus/conectores',    icon: Plug,       label: 'Conectores' },
  { href: '/nexus/mcps',          icon: Server,     label: 'MCPs' },
  { href: '/nexus/memoria',       icon: Brain,      label: 'Memória & Funções' },
  { href: '/nexus/monitoramento', icon: Activity,   label: 'Monitoramento & Logs' },
];

export function NexusMobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow">
            <Cpu className="text-white" size={14} />
          </div>
          <span className="text-lg font-bold text-text-main">NexusAI</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="text-text-muted hover:text-text-main p-1"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-[280px] h-full bg-surface flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="p-6 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
                  <Cpu className="text-white" size={20} />
                </div>
                <span className="text-xl font-bold text-text-main tracking-tight">NexusAI</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-text-main"
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer nav */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
              <div className="text-xs font-semibold text-text-light uppercase tracking-wider mb-3 px-3">
                Menu Principal
              </div>
              {navItems.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                    isActive(href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-muted hover:bg-background hover:text-text-main'
                  }`}
                >
                  <Icon size={18} className="w-5 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Drawer bottom */}
            <div className="p-4 border-t border-border/50">
              <Link
                href="/nexus/configuracoes"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive('/nexus/configuracoes')
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:bg-background hover:text-text-main'
                }`}
              >
                <Settings size={18} className="w-5 shrink-0" />
                Configurações
              </Link>
              <div className="mt-4 flex items-center gap-3 px-3 py-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-border flex items-center justify-center font-bold text-primary text-sm">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-main">Admin User</p>
                  <p className="text-xs text-text-light">admin@nexusai.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
