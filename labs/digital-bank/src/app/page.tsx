"use client";

import React, { useState, useEffect } from "react";
import { 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Plus, 
  Clock, 
  ShieldCheck, 
  Bell,
  ChevronRight,
  LogOut,
  Building,
  PiggyBank,
  RefreshCw,
  Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FirebaseConnector, FirebaseTransaction } from "@/lib/firebase";

export default function Home() {
  const [balance, setBalance] = useState(12845.60);
  const [income, setIncome] = useState(4820.00);
  const [outcome, setOutcome] = useState(1432.40);
  const [transactions, setTransactions] = useState<FirebaseTransaction[]>([]);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixAmount, setPixAmount] = useState("");
  const [pixRecipient, setPixRecipient] = useState("");
  const [pixDescription, setPixDescription] = useState("");
  
  // Custom cloud logging HUD state
  const [cloudLogs, setCloudLogs] = useState<string[]>([
    "[Google Cloud] Connection initialized to projects/gbank-infinite-prod/databases/(default)",
    "[Google Cloud] Listening for live Firestore snapshots..."
  ]);
  const [gcpLatency, setGcpLatency] = useState(14);
  const [isSyncing, setIsSyncing] = useState(false);

  // Real-time dynamic clock
  const [time, setTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch from Firebase simulated database
  const loadData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const txs = FirebaseConnector.getTransactions();
      setTransactions(txs);
      
      // Re-calculate mock dynamic sums based on transactions
      let dynamicOutcome = 1432.40;
      let dynamicBalance = 12845.60;
      
      // Calculate custom transactions made in this session
      txs.forEach(t => {
        if (t.id.startsWith("gfirestore_")) {
          if (t.type === "out") {
            dynamicOutcome += t.amount;
            dynamicBalance -= t.amount;
          }
        }
      });
      
      setOutcome(dynamicOutcome);
      setBalance(dynamicBalance);
      setIsSyncing(false);
      
      setCloudLogs(prev => [
        `[Google Cloud] Fetching documents from Firestore: transactions (Found ${txs.length} records)`,
        ...prev
      ]);
    }, 400);
  };

  useEffect(() => {
    loadData();

    // Listen to updates from other triggers
    window.addEventListener("firestore_update", loadData);
    return () => {
      window.removeEventListener("firestore_update", loadData);
    };
  }, []);

  const handleSendPix = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(pixAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    setIsSyncing(true);
    setCloudLogs(prev => [
      `[Google Cloud] Calling HTTP microservice at https://gcp-run-pix-connector.a47.run/v1/transfer...`,
      ...prev
    ]);

    // Send transaction via simulated SDK
    const result = await FirebaseConnector.addTransaction({
      type: "out",
      title: `Pix enviado para ${pixRecipient}`,
      category: pixDescription || "Transferência",
      amount: amountNum,
      date: "Hoje, " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    });

    setGcpLatency(result.latency);
    setCloudLogs(prev => [result.log, ...prev]);
    
    setShowPixModal(false);
    setPixAmount("");
    setPixRecipient("");
    setPixDescription("");
  };

  const handleResetDb = () => {
    FirebaseConnector.resetDatabase();
    setCloudLogs(prev => [
      "[Google Cloud] Database reference reset command triggered successfully. Reloading...",
      ...prev
    ]);
  };

  return (
    <div className="flex min-h-screen bg-[#030712] font-sans antialiased text-gray-100">
      
      {/* Sidebar HUD */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-950/40 backdrop-blur-xl border-r border-white/5 p-6 justify-between select-none">
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Building className="h-5 w-5 text-gray-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                GBANK
              </h1>
              <span className="text-[10px] text-cyan-500/80 font-semibold tracking-widest uppercase">
                INFINITE
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {[
              { label: "Visão Geral", icon: Wallet, active: true },
              { label: "Cartões", icon: CreditCard, active: false },
              { label: "Investimentos", icon: TrendingUp, active: false },
              { label: "Cofrinho", icon: PiggyBank, active: false },
            ].map((item, idx) => (
              <button
                key={idx}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  item.active 
                    ? "bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 text-cyan-400 border border-cyan-500/20" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                <item.icon className="h-4 w-4 stroke-[2]" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* User profile footer info */}
        <div className="border-t border-white/5 pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 text-sm">
              MQ
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">Moises Q.</p>
              <span className="text-[10px] text-gray-400">Conta Infinite</span>
            </div>
          </div>
          <button 
            onClick={handleResetDb}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all"
          >
            <RefreshCw className="h-3 w-3" />
            Resetar Database
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#030712] relative overflow-y-auto">
        
        {/* Top Header Navigation */}
        <header className="flex items-center justify-between px-6 md:px-10 py-5 bg-gray-950/20 border-b border-white/5 sticky top-0 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            <div className="md:hidden h-9 w-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center">
              <Building className="h-4.5 w-4.5 text-gray-950" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold">Olá, Moises</h2>
              <p className="text-xs text-gray-400">Bem-vindo de volta ao seu painel financeiro.</p>
            </div>
          </div>

          {/* Right Accessories HUD */}
          <div className="flex items-center gap-4">
            {/* Real-time Clock */}
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-medium text-cyan-400">
              <Clock className="h-3.5 w-3.5" />
              {time}
            </div>
            
            {/* Sync loader indicator */}
            {isSyncing && (
              <span className="text-[10px] flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 animate-pulse">
                <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                SYNCING
              </span>
            )}

            {/* Notifications */}
            <button className="h-9 w-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-gray-300 transition-all relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500" />
            </button>
          </div>
        </header>

        {/* Dashboard Panels Grid */}
        <div className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1 & 2: Financial summary & Actions */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Financial Balance Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Balance Display */}
                <div className="bg-gradient-to-b from-gray-900/50 to-gray-950/50 border border-white/5 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl flex flex-col justify-between h-48">
                  <div>
                    <span className="text-xs font-semibold text-cyan-400/80 tracking-wider uppercase">Saldo Disponível</span>
                    <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                      R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </h3>
                  </div>
                  
                  {/* Minicharts indices */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <ArrowDownLeft className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase font-semibold">Entradas</span>
                        <p className="text-xs font-bold text-emerald-400">R$ {income.toLocaleString("pt-BR")}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase font-semibold">Saídas</span>
                        <p className="text-xs font-bold text-red-400">R$ {outcome.toLocaleString("pt-BR")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cyber Fintech Infinite Card Display */}
                <div className="bg-gradient-to-tr from-cyan-600 to-emerald-600 rounded-3xl p-6 flex flex-col justify-between h-48 text-gray-950 relative overflow-hidden shadow-2xl shadow-cyan-500/10 group cursor-pointer transition-all duration-500 hover:-translate-y-1">
                  {/* Subtle vector background overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.2),transparent)] pointer-events-none" />
                  
                  <div className="flex justify-between items-start z-10">
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-950/65">Infinite Membership</p>
                      <h4 className="text-lg font-black tracking-tight leading-none mt-0.5">GBANK</h4>
                    </div>
                    {/* Metallic simulated EMV chip */}
                    <div className="w-9 h-7 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 rounded-md border border-amber-400/30 flex items-center justify-center shadow-inner overflow-hidden">
                      <div className="w-full h-full opacity-35 bg-[linear-gradient(90deg,transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:4px_100%]" />
                    </div>
                  </div>

                  <div className="z-10 mt-4">
                    <p className="font-mono text-base tracking-widest font-bold">••••  ••••  ••••  4747</p>
                  </div>

                  <div className="flex justify-between items-end z-10">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-gray-950/60 font-semibold block">Cardholder</span>
                      <p className="text-xs font-bold uppercase tracking-tight">MOISES Q. BRAGA</p>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-gray-950/60 font-semibold block">Expires</span>
                      <p className="text-xs font-bold font-mono">08/32</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Portal */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Ações Rápidas</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Enviar Pix", icon: Plus, highlight: true, onClick: () => setShowPixModal(true) },
                    { label: "Pagar Boleto", icon: Clock, highlight: false },
                    { label: "Investir", icon: TrendingUp, highlight: false },
                    { label: "Cofrinho", icon: PiggyBank, highlight: false },
                  ].map((act, idx) => (
                    <button
                      key={idx}
                      onClick={act.onClick}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300 active:scale-95 ${
                        act.highlight
                          ? "bg-cyan-500 text-gray-950 border-cyan-400 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 font-bold"
                          : "bg-white/5 text-gray-300 border-white/5 hover:bg-white/10 hover:border-white/10"
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${act.highlight ? "bg-gray-950 text-cyan-400" : "bg-white/5"}`}>
                        <act.icon className="h-5 w-5 stroke-[2.5]" />
                      </div>
                      <span className="text-xs font-semibold">{act.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Financial line chart */}
              <div className="bg-gray-950/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider">Análise de Rendimentos</span>
                    <h4 className="text-lg font-bold">Patrimônio em Evolução</h4>
                  </div>
                  <span className="text-xs text-gray-400">Últimos 6 meses</span>
                </div>

                <div className="h-44 w-full relative pt-4">
                  {/* Decorative chart lines */}
                  <svg className="w-full h-full" viewBox="0 0 600 160">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Grid lines */}
                    <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                    {/* Gradient fill area */}
                    <path
                      d="M0,130 C100,120 150,80 250,90 C350,100 400,30 500,40 L600,10 L600,160 L0,160 Z"
                      fill="url(#chartGrad)"
                    />
                    
                    {/* Main glowing chart line */}
                    <path
                      d="M0,130 C100,120 150,80 250,90 C350,100 400,30 500,40 L600,10"
                      fill="none"
                      stroke="url(#lineGrad)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Linear gradient for stroke */}
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>

                    {/* Glowing nodes */}
                    <circle cx="250" cy="90" r="5" fill="#06b6d4" stroke="#030712" strokeWidth="2" />
                    <circle cx="500" cy="40" r="5" fill="#10b981" stroke="#030712" strokeWidth="2" />
                  </svg>
                </div>
              </div>

            </div>

            {/* Column 3: Ledger & Live telemetry console */}
            <div className="space-y-8 flex flex-col h-full">
              
              {/* Dynamic Transaction Ledger */}
              <div className="bg-gray-950/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col justify-between flex-1">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Histórico de Transações</h4>
                    <span className="text-[10px] text-gray-500 font-mono">FIRESTORE DB</span>
                  </div>

                  {/* Ledger list */}
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                            tx.type === "in" ? "bg-emerald-500/10 text-emerald-400" : "bg-cyan-500/10 text-cyan-400"
                          }`}>
                            {tx.type === "in" ? <ArrowDownLeft className="h-4.5 w-4.5" /> : <ArrowUpRight className="h-4.5 w-4.5" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold leading-snug">{tx.title}</p>
                            <span className="text-[10px] text-gray-400">{tx.category} • {tx.date}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`text-xs font-extrabold ${tx.type === "in" ? "text-emerald-400" : "text-gray-200"}`}>
                            {tx.type === "in" ? "+" : "-"} R$ {tx.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Seal Status */}
                <div className="mt-6 border-t border-white/5 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Conexão Segura Ativa</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-bold uppercase">
                    SSL 256
                  </span>
                </div>
              </div>

              {/* Immersive Terminal Console for Google Cloud Telemetry */}
              <div className="bg-gray-950 border border-white/10 rounded-3xl p-5 space-y-3 font-mono text-[10px] leading-relaxed text-gray-400 select-none shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <Terminal className="h-3.5 w-3.5" />
                    <span className="font-bold">GCP TELEMETRY CONSOLE</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                  </div>
                </div>
                
                <div className="h-28 overflow-y-auto space-y-1.5 pr-1 text-gray-300">
                  {cloudLogs.map((log, idx) => (
                    <div key={idx} className="border-l border-cyan-500/30 pl-2">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Dynamic Simulated Google Cloud Connector status HUD */}
        <footer className="mt-auto px-6 py-4 bg-gray-950/60 border-t border-white/5 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-gray-400">Google Cloud / Firebase Real-time Connector:</span>
            <span className="font-semibold text-cyan-400">Ativo ({gcpLatency}ms)</span>
          </div>
          
          <div className="flex items-center gap-4 text-gray-400">
            <span>Latência: <b className="text-gray-300">{gcpLatency}ms</b></span>
            <span>Versão IDE: <b className="text-cyan-400">AntiGravity v4.7</b></span>
          </div>
        </footer>

      </main>

      {/* Pix Simulation Modal */}
      <AnimatePresence>
        {showPixModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-950 border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-6 relative overflow-hidden"
            >
              {/* Glow effects */}
              <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Enviar Pix Instantâneo
                </h3>
                <button 
                  onClick={() => setShowPixModal(false)}
                  className="text-xs text-gray-400 hover:text-gray-200"
                >
                  Fechar
                </button>
              </div>

              <form onSubmit={handleSendPix} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Destinatário (Nome ou Chave)</label>
                  <input
                    type="text"
                    required
                    value={pixRecipient}
                    onChange={(e) => setPixRecipient(e.target.value)}
                    placeholder="Ex: Klebson Queiroz"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={pixAmount}
                    onChange={(e) => setPixAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Descrição / Categoria (Opcional)</label>
                  <input
                    type="text"
                    value={pixDescription}
                    onChange={(e) => setPixDescription(e.target.value)}
                    placeholder="Ex: Almoço de negócios"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-500 text-gray-950 font-bold py-3.5 rounded-xl hover:bg-cyan-400 transition-all duration-300 flex items-center justify-center gap-2 mt-6 active:scale-98"
                >
                  <ArrowUpRight className="h-4.5 w-4.5 stroke-[2.5]" />
                  Confirmar Envio
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
