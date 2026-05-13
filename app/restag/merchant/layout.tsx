'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Store, 
  CalendarCheck, 
  UtensilsCrossed, 
  Users, 
  LogOut,
  Settings,
  X,
  Menu as MenuIcon
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/restag/merchant', icon: Store },
    { name: 'Reservas', path: '/restag/merchant/reservas', icon: CalendarCheck },
    { name: 'Menu', path: '/restag/merchant/menu', icon: UtensilsCrossed },
    { name: 'Equipe', path: '/restag/merchant/equipa', icon: Users },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white tracking-tighter">Terminal <span style={{ color: theme.colors.primary }}>Restag</span></h2>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">Merchant Node</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={() => setIsMobileNavOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                  isActive 
                    ? 'bg-white/10 text-white border border-white/10' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" style={{ color: isActive ? theme.colors.primary : 'inherit' }} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-white/10">
        <div className="flex items-center gap-3 mb-6 px-2">
           <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
             <Store className="w-5 h-5 text-gray-300" />
           </div>
           <div>
             <p className="text-sm font-bold text-white">Oeste Restaurante</p>
             <p className="text-[10px] font-mono text-green-400 uppercase tracking-widest">Online</p>
           </div>
        </div>
        
        <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all text-sm font-medium">
          <Settings className="w-4 h-4" /> Configurações
        </button>
        <button className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-sm font-medium mt-1">
          <LogOut className="w-4 h-4" /> Desconectar
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* Mobile Trigger - Gear Icon */}
      <button 
        onClick={() => setIsMobileNavOpen(true)}
        className="fixed bottom-8 right-8 z-[60] md:hidden w-14 h-14 rounded-full bg-black/60 border border-white/20 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all backdrop-blur-xl"
      >
        <Settings className="w-6 h-6 animate-spin-slow" style={{ color: theme.colors.primary }} />
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNavOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[70] md:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-black/90 backdrop-blur-2xl border-r border-white/10 z-[80] md:hidden flex flex-col justify-between"
            >
              <div className="absolute top-6 right-6">
                <button 
                  onClick={() => setIsMobileNavOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 sticky top-[73px] h-[calc(100vh-73px)] border-r border-white/10 bg-black/40 backdrop-blur-xl hidden md:flex flex-col justify-between z-40">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {/* Adiciona um padding e ajusta para que o conteúdo preencha o espaço da direita */}
        <div className="max-w-7xl mx-auto p-4 md:px-12 md:pb-12 md:pt-0">
           {children}
        </div>
      </main>
    </div>
  );
}
