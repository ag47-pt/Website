'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Layers, 
  Presentation, 
  Settings, 
  LogOut, 
  User,
  Menu,
  X,
  Shield,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, themeName, toggleTheme, isDark, toggleDark } = useTheme();

  useEffect(() => {
    // Basic check for the login page
    if (pathname === '/admin') return;

    const auth = localStorage.getItem('ag47_admin_auth');
    if (auth !== 'true') {
      router.push('/admin');
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(prev => (prev === true ? prev : true));
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('ag47_admin_auth');
    router.push('/admin');
  };

  // If on login page, just render children
  if (pathname === '/admin') return <>{children}</>;

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.colors.primary }}></div>
    </div>
  );

  const navItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Labs Showcase', href: '/admin/labs', icon: Layers },
    { label: 'Sales Slides', href: '/admin/slides', icon: Presentation },
    { label: 'Leads', href: '/admin/leads', icon: User },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className={`flex min-h-screen font-sans selection:bg-primary/30 ${isDark ? 'admin-dark bg-black text-zinc-400' : 'admin-light bg-zinc-50 text-zinc-600'}`} style={{ '--primary': theme.colors.primary } as any}>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[70] w-72 border-r border-white/5 flex flex-col bg-zinc-950/90 backdrop-blur-3xl transition-transform duration-500 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-10 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
              <span className="text-black font-black text-xl italic">47</span>
            </div>
            <div>
              <h2 className="text-white font-black text-sm uppercase tracking-tighter leading-none group-hover:tracking-widest transition-all duration-500">Admin</h2>
              <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Portal v2.0</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative ${
                  isActive 
                    ? `text-white ${isDark ? 'bg-white/5' : 'bg-zinc-100'} shadow-inner` 
                    : `${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-zinc-100'} hover:text-zinc-200`
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute left-0 w-1 h-6 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                )}
                <Icon className={`w-5 h-5 transition-all duration-300 ${
                  isActive ? 'text-primary scale-110' : 'text-zinc-600 group-hover:text-zinc-400'
                }`} style={isActive ? { color: theme.colors.primary } : {}} />
                <span className={`text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                  isActive ? 'translate-x-1' : 'group-hover:translate-x-1'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-8">
          <div className={`p-6 rounded-2xl border space-y-4 ${
            isDark ? 'bg-gradient-to-br from-white/5 to-transparent border-white/5' : 'bg-zinc-100 border-zinc-200'
          }`}>
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                 <Settings className="w-4 h-4 text-zinc-500" />
               </div>
               <div className="flex flex-col">
                 <span className="text-white text-[10px] font-bold uppercase tracking-tight">System Core</span>
                 <span className="text-green-500 text-[8px] font-mono uppercase">Online</span>
               </div>
             </div>
             <button 
               onClick={handleLogout}
               className={`w-full py-2 border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all text-zinc-500 hover:text-white ${
                 isDark ? 'bg-white/5 hover:bg-white/10 border-white/5' : 'bg-zinc-200 hover:bg-zinc-300 border-zinc-300'
               }`}
             >
               Logout
             </button>
          </div>
        </div>
      </aside>

      <main 
        className="flex-1 lg:ml-72 min-h-screen flex flex-col transition-all duration-500"
      >
        {/* Top Header */}
        <header
          className="h-20 border-b backdrop-blur-md flex items-center justify-between px-6 md:px-8 sticky top-0 z-40"
          style={{
            borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#e4e4e7',
            background:  isDark ? 'rgba(9,9,11,0.5)'        : 'rgba(255,255,255,0.85)',
          }}
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 rounded-md transition-colors lg:hidden ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
            >
              <Menu className={`w-5 h-5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`} />
            </button>
            <h2 className={`text-[10px] font-mono uppercase tracking-widest hidden sm:block ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              System / {pathname.split('/').pop()}
            </h2>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <ThemeSwitcher themeName={themeName} onToggle={toggleTheme} />
            {/* Dark / Light toggle */}
            <button
              onClick={toggleDark}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-110 active:scale-95 ${
                isDark ? 'bg-white/5 border-white/10 hover:bg-white/15' : 'bg-black/5 border-black/10 hover:bg-black/10'
              }`}
              aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
              title={isDark ? 'Modo Claro' : 'Modo Escuro'}
            >
              {isDark
                ? <Sun  className="w-4 h-4 text-zinc-400" />
                : <Moon className="w-4 h-4 text-zinc-500" />
              }
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className={`text-[10px] font-bold uppercase tracking-tighter ${isDark ? 'text-white' : 'text-zinc-800'}`}>Administrador Principal</div>
                <div className="text-[8px] font-mono text-zinc-400">ID: 0x47_ROOT</div>
              </div>
              <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-zinc-100 border-zinc-300'}`}>
                <User className={`w-5 h-5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
