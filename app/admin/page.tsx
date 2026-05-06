'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, ChevronRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();
  const { theme, themeName, toggleTheme } = useTheme();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('ag47_admin_auth', 'true');
      router.push('/admin/dashboard');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full transition-colors duration-1000" 
          style={{ backgroundColor: `${theme.colors.primary}33` }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full transition-colors duration-1000" 
          style={{ backgroundColor: `${theme.colors.secondary}1A` }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* Floating Theme Switcher for Admin */}
        <div className="absolute -top-12 right-0">
          <ThemeSwitcher themeName={themeName} onToggle={toggleTheme} />
        </div>

        <div className="bg-zinc-950 border border-white/10 p-8 md:p-12 space-y-10 relative overflow-hidden">
          <div className="space-y-2 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center rounded-sm">
                <ShieldCheck className="w-8 h-8 transition-colors" style={{ color: theme.colors.primary }} />
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">
              <span className="px-2" style={{ backgroundColor: theme.colors.primary, color: '#000', borderRadius: '2px' }}>Admin</span> Access
            </h1>
            <p className="text-zinc-500 text-xs font-mono tracking-widest uppercase">Restricted Area // Agência 47</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block pl-1">
                Security Key
              </label>
              <div className="relative group">
                <div 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors"
                  style={{ '--active-color': theme.colors.primary } as any}
                >
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-black border ${error ? 'border-red-500' : 'border-white/10'} outline-none px-12 py-4 text-sm transition-all font-mono`}
                  style={{ '--focus-border': theme.colors.primary } as any}
                  required
                />
              </div>
              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] text-red-500 font-mono text-center pt-2"
                >
                  ERROR: ACCESS_DENIED_INVALID_KEY
                </motion.p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-white text-black py-4 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all active:scale-95 login-btn"
              style={{ '--hover-bg': theme.colors.primary } as any}
            >
              Authorize Access <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-8 flex justify-center gap-4 border-t border-white/5">
             <div className="flex items-center gap-2 opacity-30">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
               <span className="text-[8px] font-mono uppercase tracking-tighter">Security_Node_Active</span>
             </div>
             <div className="flex items-center gap-2 opacity-30 border-l border-white/10 pl-4">
               <span className="text-[8px] font-mono uppercase tracking-tighter">SSL_Encrypted_V3</span>
             </div>
          </div>
          <style jsx>{`
            .group:focus-within div { color: var(--active-color); }
            input:focus { border-color: var(--focus-border); }
            .login-btn:hover { background-color: var(--hover-bg) !important; color: white !important; }
          `}</style>
        </div>
      </motion.div>
    </div>
  );
}
