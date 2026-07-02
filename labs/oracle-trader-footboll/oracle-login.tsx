"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Brain, Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function OracleLogin() {
  const { theme } = useTheme();
  const primaryColor = theme?.colors?.primary || 'var(--theme-primary)';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError("Erro de autenticação. Verifique seu e-mail e senha.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      setError("Não foi possível autenticar com o Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 text-zinc-300 font-sans relative z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="relative group p-[1px] rounded-2xl bg-gradient-to-b from-zinc-700/50 via-zinc-800/30 to-zinc-950/50 shadow-2xl overflow-hidden">
          {/* Fundo dinâmico com a cor primária */}
          <div 
            className="absolute inset-0 opacity-20 transition-opacity duration-1000 blur-3xl"
            style={{
              background: `radial-gradient(circle at 50% -20%, ${primaryColor} 0%, transparent 60%)`
            }}
          />
          
          <div className="relative bg-zinc-950/60 backdrop-blur-3xl rounded-2xl p-8 border border-white/5">
            
            <div className="flex flex-col items-center mb-8">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border shadow-inner"
                style={{ 
                  backgroundColor: `color-mix(in srgb, ${primaryColor} 15%, transparent)`,
                  borderColor: `color-mix(in srgb, ${primaryColor} 30%, transparent)`,
                  color: primaryColor,
                  boxShadow: `inset 0 2px 10px color-mix(in srgb, ${primaryColor} 20%, transparent)`
                }}
              >
                <Brain className="w-8 h-8 drop-shadow-md" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Oracle Security</h1>
              <p className="text-sm text-zinc-400 mt-2 text-center uppercase tracking-widest font-mono">
                Acesso Restrito
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-start gap-2 shadow-sm"
                >
                  <span className="shrink-0 mt-0.5 font-bold">⚠</span>
                  <span className="flex-1">{error}</span>
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 ml-1">E-mail de Operador</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within/input:text-white text-zinc-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all shadow-inner"
                    placeholder="operador@ag47.pt"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 ml-1">Senha de Acesso</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within/input:text-white text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all shadow-inner"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full mt-2 py-3 rounded-xl font-semibold text-black transition-all flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 shadow-lg shadow-black/20"
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

            <div className="mt-6 mb-6 flex items-center justify-center space-x-4">
              <div className="flex-1 h-px bg-zinc-800"></div>
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">OU</span>
              <div className="flex-1 h-px bg-zinc-800"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
              className="w-full py-3 rounded-xl font-medium text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-inner"
            >
              {googleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
              )}
              <span>Continuar com o Google</span>
            </button>
            
          </div>
        </div>
      </motion.div>
    </div>
  );
}
