"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Brain, Lock, Mail, Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function OracleLogin() {
  const { theme } = useTheme();
  const primaryColor = theme?.colors?.primary || 'var(--theme-primary)';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || "Erro de autenticação. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] p-4 text-zinc-300 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="relative group p-[1px] rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-950 overflow-hidden">
          {/* Fundo dinâmico com a cor primária */}
          <div 
            className="absolute inset-0 opacity-10 transition-opacity duration-1000"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${primaryColor} 0%, transparent 70%)`
            }}
          />
          
          <div className="relative bg-zinc-950/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5">
            
            <div className="flex flex-col items-center mb-8">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border"
                style={{ 
                  backgroundColor: `color-mix(in srgb, ${primaryColor} 10%, transparent)`,
                  borderColor: `color-mix(in srgb, ${primaryColor} 20%, transparent)`,
                  color: primaryColor 
                }}
              >
                <Brain className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Oracle Security</h1>
              <p className="text-sm text-zinc-500 mt-2 text-center uppercase tracking-widest font-mono">
                Terminal Restrito
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">⚠</span>
                  <span className="flex-1">{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-500 ml-1">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-zinc-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
                    placeholder="operador@ag47.pt"
                    style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-500 ml-1">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-zinc-500" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3 rounded-xl font-medium text-black transition-all flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <span>Acessar Painel</span>
                )}
              </button>
            </form>
            
          </div>
        </div>
      </motion.div>
    </div>
  );
}
