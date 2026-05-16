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
  Menu as MenuIcon,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const [impersonateData, setImpersonateData] = React.useState<any>(null);

  React.useEffect(() => {
    const data = localStorage.getItem('restag_impersonate');
    if (data) {
      setImpersonateData(JSON.parse(data));
    }
  }, []);

  const stopImpersonation = () => {
    localStorage.removeItem('restag_impersonate');
    setImpersonateData(null);
    router.push('/restag/admin/restaurantes');
  };

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
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[190] md:hidden"
            />
            <motion.aside 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 w-full bg-black/95 backdrop-blur-3xl border-t border-white/10 z-[200] md:hidden flex flex-col h-[80vh] rounded-t-[40px] overflow-hidden"
            >
              {/* BottomSheet Handle */}
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-2 shrink-0" />
              
              <div className="absolute top-6 right-6 z-10">
                <button 
                  onClick={() => setIsMobileNavOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <SidebarContent />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 sticky top-0 h-[calc(100vh-73px)] border-r border-white/10 bg-black/40 backdrop-blur-xl hidden md:flex flex-col justify-between z-40">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {/* Impersonation Banner */}
        <AnimatePresence>
          {impersonateData && (
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-blue-600 text-white px-6 py-2 flex items-center justify-between z-50 sticky top-[73px] border-b border-blue-400/30"
            >
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Modo Concierge Ativo: Atuando como <span className="underline decoration-white/40">{impersonateData.name}</span></span>
              </div>
              <button 
                onClick={stopImpersonation}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-[10px] font-black transition-all border border-white/20"
              >
                FINALIZAR SESSÃO <ArrowRight className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Adiciona um padding e ajusta para que o conteúdo preencha o espaço da direita */}
        <div className="max-w-[1600px] mx-auto p-4 md:px-12 md:pb-12 pt-0 md:pt-0">
           {children}
        </div>
      </main>
    </div>
  );
}
