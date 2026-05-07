'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Cpu,
  TrendingUp,
  Bot,
  Plug,
  Server,
  Brain,
  Activity,
  Settings,
} from 'lucide-react';
import { NexusThemeSwitcher } from '@/components/nexus/ThemeSwitcher';

const navItems = [
  { href: '/nexus/dashboard',     icon: TrendingUp, label: 'Dashboard' },
  { href: '/nexus/agentes',       icon: Bot,        label: 'Agentes' },
  { href: '/nexus/conectores',    icon: Plug,       label: 'Conectores' },
  { href: '/nexus/mcps',          icon: Server,     label: 'MCPs' },
  { href: '/nexus/memoria',       icon: Brain,      label: 'Memória & Funções' },
  { href: '/nexus/monitoramento', icon: Activity,   label: 'Monitoramento & Logs' },
];

export function NexusSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside className="hidden md:flex flex-col w-[280px] bg-surface border-r border-border min-h-screen sticky top-0 z-40 shrink-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-border/50">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
          <Cpu className="text-white" size={20} />
        </div>
        <span className="text-xl font-bold text-text-main tracking-tight">NexusAI</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 nexus-scrollbar">
        <div className="text-xs font-semibold text-text-light uppercase tracking-wider mb-3 px-3">
          Menu Principal
        </div>

        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
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

      {/* Bottom: Settings + User */}
      <div className="p-4 border-t border-border/50">
        <NexusThemeSwitcher />

        <Link
          href="/nexus/configuracoes"
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
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-border flex items-center justify-center font-bold text-primary text-sm shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-main truncate">Admin User</p>
            <p className="text-xs text-text-light truncate">admin@nexusai.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
