'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, UserPlus, ShieldAlert, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useRestagAuth } from '../hooks/useRestagAuth';
import { supabase } from '../lib/supabase';

export default function RestagLoginPage() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { profile, loading: authLoading } = useRestagAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Redirection guard: if session profile is detected, route them instantly
  useEffect(() => {
    if (profile) {
      if (profile.role === 'ag47_admin') {
        router.push('/restag/admin');
      } else if (profile.role === 'merchant' || profile.role === 'staff') {
        router.push('/restag/merchant');
      } else {
        router.push('/restag');
      }
    }
  }, [profile, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      setSuccessMessage('Acesso autorizado! Carregando painel...');
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação. Verifique suas credenciais.');
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/restag/login`,
        },
      });

      if (authError) {
        throw authError;
      }

      if (data.session) {
        setSuccessMessage('Conta criada com sucesso! Carregando painel...');
      } else {
        setSuccessMessage('Cadastro recebido! Verifique seu e-mail para confirmar a ativação da conta.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar conta de cliente.');
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/restag/login`,
        },
      });

      if (authError) {
        throw authError;
      }
    } catch (err: any) {
      setError(err.message || 'Não foi possível iniciar o login com o Google.');
      setIsSubmitting(false);
    }
  };

  // While checking auth states or performing redirect transitions, show cinematic HUD loader
  if (authLoading || (profile && !successMessage)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="relative p-10 max-w-md w-full bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center text-center space-y-6 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[2px]" style={{ backgroundColor: theme.colors.primary }} />
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: theme.colors.primary }} />
          <div className="space-y-2">
            <h2 className="text-sm font-mono tracking-[0.2em] text-white uppercase">SECURITY_PROTOCOL_ACTIVE</h2>
            <p className="text-xs text-gray-400 font-sans max-w-xs">
              Sincronizando malha de credenciais e permissões de nível de rede no Restag hospitality.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full relative bg-[#050505]/75 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden"
      >
        {/* Holographic Top Laser Line Accent */}
        <div 
          className="absolute top-0 left-0 w-full h-[2px] transition-colors duration-500" 
          style={{ 
            backgroundColor: theme.colors.primary,
            boxShadow: `0 0 12px 1px ${theme.colors.primary}cc`
          }} 
        />

        {/* Technical Corner HUD Decors */}
        <div className="absolute top-2 right-3 font-mono text-[7px] text-gray-500 tracking-widest select-none">
          SYS_AUTH_0x47
        </div>

        {/* Section Header */}
        <div className="text-center space-y-2 mb-8 mt-2">
          <h1 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
            RESTAG <span style={{ color: theme.colors.primary }}>//</span> AUTH
          </h1>
          <p className="text-xs text-gray-400 max-w-xs mx-auto font-sans leading-relaxed">
            Painel unificado de credenciais para Clientes, Proprietários e Funcionários.
          </p>
        </div>

        {/* Tab Toggle Switch (Sign In vs Sign Up) */}
        <div className="flex bg-white/[0.03] border border-white/5 p-1 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(null); setSuccessMessage(null); }}
            className={`flex-1 text-center py-2 text-xs font-mono tracking-wider uppercase rounded-md transition-all duration-300 ${
              !isSignUp 
                ? 'bg-white/10 text-white font-bold' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(null); setSuccessMessage(null); }}
            className={`flex-1 text-center py-2 text-xs font-mono tracking-wider uppercase rounded-md transition-all duration-300 ${
              isSignUp 
                ? 'bg-white/10 text-white font-bold' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Error and Success consoles */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 overflow-hidden"
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start space-x-2.5">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-wider">ERROR_CODE_0xAC</h4>
                  <p className="text-xs text-red-200/90 leading-tight font-sans">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 overflow-hidden"
            >
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" style={{ color: theme.colors.primary }} />
                <div className="space-y-0.5">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: theme.colors.primary }}>TRANSACTION_SUCCESS</h4>
                  <p className="text-xs text-emerald-200/90 leading-tight font-sans">{successMessage}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center space-x-3 bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 active:scale-[0.99] py-3 px-4 rounded-xl text-xs font-mono text-white transition-all duration-300 mb-6 group relative overflow-hidden"
        >
          {/* Subtle Google neon halo hover effect */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" 
            style={{ 
              background: `radial-gradient(circle at center, ${theme.colors.primary} 0%, transparent 70%)`
            }} 
          />
          
          <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.86-4.53-5.2-4.53z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="tracking-wide">Entrar com o Google</span>
        </button>

        {/* Technical Technical Section Divider */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">OU VIA CREDENCIAIS</span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        {/* Login/Signup Email-Password Form */}
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Endereço de E-mail</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-white transition-colors duration-300">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@restag.pt"
                disabled={isSubmitting}
                className="w-full bg-white/[0.02] border border-white/10 focus:border-white/30 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-gray-600 outline-none transition-all duration-300 font-sans"
                style={{
                  '--focus-ring': theme.colors.primary,
                } as any}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.colors.primary;
                  e.target.style.boxShadow = `0 0 0 1px ${theme.colors.primary}30`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '';
                  e.target.style.boxShadow = '';
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Chave Secreta (Senha)</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-white transition-colors duration-300">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isSubmitting}
                className="w-full bg-white/[0.02] border border-white/10 focus:border-white/30 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-gray-600 outline-none transition-all duration-300 font-sans"
                onFocus={(e) => {
                  e.target.style.borderColor = theme.colors.primary;
                  e.target.style.boxShadow = `0 0 0 1px ${theme.colors.primary}30`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '';
                  e.target.style.boxShadow = '';
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl text-xs font-mono text-black font-bold transition-all duration-300 cursor-pointer disabled:opacity-50 active:scale-[0.985] relative overflow-hidden"
            style={{
              backgroundColor: theme.colors.primary,
              boxShadow: `0 0 16px 2px ${theme.colors.primary}50`
            }}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSignUp ? (
              <>
                <span>Cadastrar Cliente</span>
                <UserPlus className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                <span>Autenticar Sessão</span>
                <LogIn className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Additional Sub-information Context */}
        <div className="mt-8 text-center text-[9px] font-mono text-gray-600 leading-tight">
          Proteção de rede: Criptografia fim-a-fim. Ao acessar a rede Restag, você concorda com nossos protocolos operacionais.
        </div>
      </motion.div>
    </div>
  );
}
