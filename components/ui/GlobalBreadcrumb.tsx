'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home, LayoutGrid, Network, Terminal, BookOpen, Layers, UtensilsCrossed, Sparkles, Globe2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface GlobalBreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

const ROUTE_NAME_MAP: Record<string, { label: string; icon?: React.ReactNode }> = {
  '': { label: 'HOME', icon: <Home className="w-3 h-3" /> },
  'labs': { label: 'LABS HUB', icon: <LayoutGrid className="w-3 h-3" /> },
  'eco': { label: 'ECO HUB', icon: <Network className="w-3 h-3" /> },
  'youlearn': { label: 'YOULEARN ACADEMY', icon: <BookOpen className="w-3 h-3" /> },
  'evopro': { label: 'EVOPRO PROTOCOL', icon: <Terminal className="w-3 h-3" /> },
  'servicos': { label: 'SERVIÇOS', icon: <Layers className="w-3 h-3" /> },
  'rest': { label: 'REST.AG', icon: <UtensilsCrossed className="w-3 h-3" /> },
  'nexus': { label: 'NEXUS MEMÓRIA', icon: <Sparkles className="w-3 h-3" /> },
  'universo-2d': { label: 'UNIVERSO 2D', icon: <Globe2 className="w-3 h-3" /> },
  'learn': { label: 'AULA', icon: <BookOpen className="w-3 h-3" /> },
};

export function GlobalBreadcrumb({ items: customItems, className = '', showHome = true }: GlobalBreadcrumbProps) {
  const pathname = usePathname();
  const { theme } = useTheme();

  // Se não forem passados itens customizados, calcula automaticamente da rota
  const breadcrumbItems: BreadcrumbItem[] = React.useMemo(() => {
    if (customItems && customItems.length > 0) return customItems;

    const segments = pathname.split('/').filter(Boolean);
    const result: BreadcrumbItem[] = [];

    if (showHome) {
      result.push({
        label: 'HOME',
        href: '/',
        icon: <Home className="w-3 h-3" />,
      });
    }

    let accumulatedPath = '';
    segments.forEach((seg, index) => {
      accumulatedPath += `/${seg}`;
      const isLast = index === segments.length - 1;
      const mapped = ROUTE_NAME_MAP[seg.toLowerCase()];
      const label = mapped ? mapped.label : seg.replace(/-/g, ' ').toUpperCase();
      const icon = mapped?.icon;

      result.push({
        label,
        href: isLast ? undefined : accumulatedPath,
        icon,
      });
    });

    return result;
  }, [pathname, customItems, showHome]);

  // Se estiver na Home e não houver itens específicos além da Home, oculta para não poluir a hero 3D
  if (breadcrumbItems.length <= 1 && pathname === '/') {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/10 text-[9px] font-mono tracking-widest uppercase transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${className}`}
    >
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-2.5 h-2.5 text-gray-600 shrink-0" />
            )}

            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors duration-200 shrink-0"
              >
                {item.icon && <span className="text-gray-500 shrink-0">{item.icon}</span>}
                <span className="hover:underline underline-offset-2 whitespace-nowrap">{item.label}</span>
              </Link>
            ) : (
              <div
                className="flex items-center gap-1.5 font-bold shrink-0 min-w-0"
                style={{ color: theme.colors.primary }}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span className="max-w-[140px] sm:max-w-[240px] md:max-w-[380px] lg:max-w-[500px] truncate" title={item.label}>
                  {item.label}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse ml-0.5 shrink-0"
                  style={{ backgroundColor: theme.colors.primary }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
