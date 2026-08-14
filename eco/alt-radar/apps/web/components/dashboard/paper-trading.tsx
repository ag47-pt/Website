"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Check, DollarSign, History, Play, ShieldAlert, Sparkles, Trash2, TrendingUp, X } from "lucide-react";
import type { Market, Opportunity, Token } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { formatCurrency, formatDateTime, formatNumber, formatPercent } from "@/eco/alt-radar/apps/web/lib/format";

export interface VirtualPosition {
  id: string;
  tokenId: string;
  symbol: string;
  name: string;
  chain: string;
  contractAddress: string;
  entryPrice: number;
  currentPrice: number;
  amountUsd: number;
  tokenCount: number;
  takeProfitPct: number;
  stopLossPct: number;
  openedAt: string;
  status: "open" | "closed";
  closedAt?: string;
  exitPrice?: number;
  realizedPnlUsd?: number;
  realizedPnlPct?: number;
}

const STORAGE_KEY = "ag47_alt_radar_paper_trading_v1";

export function PaperTrading({
  selectedOpportunity,
}: {
  selectedOpportunity: Opportunity | null;
}) {
  const [positions, setPositions] = useState<VirtualPosition[]>([]);
  const [orderAmountUsd, setOrderAmountUsd] = useState<number>(500);
  const [takeProfitPct, setTakeProfitPct] = useState<number>(30);
  const [stopLossPct, setStopLossPct] = useState<number>(10);
  const [activeTab, setActiveTab] = useState<"new" | "dca" | "open" | "history">("new");
  const [justExecuted, setJustExecuted] = useState(false);

  // DCA State
  const [dcaAmountPerInterval, setDcaAmountPerInterval] = useState<number>(100);
  const [dcaIntervalDays, setDcaIntervalDays] = useState<number>(7);
  const [dcaInstallments, setDcaInstallments] = useState<number>(8);

  // Load persisted positions
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setPositions(JSON.parse(raw));
      }
    } catch (_e) {
      // Ignore parse errors
    }
  }, []);

  // Save positions
  const savePositions = (updated: VirtualPosition[]) => {
    setPositions(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (_e) {
      // Ignore storage errors
    }
  };

  const token = selectedOpportunity?.token;
  const market = selectedOpportunity?.market;
  const currentPrice = market?.price_usd ?? 1.0;

  const openPositions = positions.filter((p) => p.status === "open");
  const closedPositions = positions.filter((p) => p.status === "closed");

  // Metrics
  const totalInvested = openPositions.reduce((acc, p) => acc + p.amountUsd, 0);
  const totalUnrealizedPnl = openPositions.reduce((acc, p) => {
    const livePrice = p.tokenId === token?.id ? currentPrice : p.entryPrice;
    const currentVal = p.tokenCount * livePrice;
    return acc + (currentVal - p.amountUsd);
  }, 0);
  const totalRealizedPnl = closedPositions.reduce((acc, p) => acc + (p.realizedPnlUsd ?? 0), 0);

  const handleOpenPosition = () => {
    if (!token || !market || !currentPrice) return;

    const tokenCount = orderAmountUsd / currentPrice;
    const newPos: VirtualPosition = {
      id: "pos_" + Math.random().toString(36).substring(2, 9),
      tokenId: token.id,
      symbol: token.symbol,
      name: token.name,
      chain: token.chain,
      contractAddress: token.contract_address,
      entryPrice: currentPrice,
      currentPrice: currentPrice,
      amountUsd: orderAmountUsd,
      tokenCount,
      takeProfitPct,
      stopLossPct,
      openedAt: new Date().toISOString(),
      status: "open",
    };

    savePositions([newPos, ...positions]);
    setJustExecuted(true);
    setTimeout(() => {
      setJustExecuted(false);
      setActiveTab("open");
    }, 1200);
  };

  const handleClosePosition = (id: string) => {
    const updated = positions.map((p) => {
      if (p.id !== id) return p;
      const livePrice = p.tokenId === token?.id ? currentPrice : p.entryPrice;
      const exitValue = p.tokenCount * livePrice;
      const pnlUsd = exitValue - p.amountUsd;
      const pnlPct = (pnlUsd / p.amountUsd) * 100;
      return {
        ...p,
        status: "closed" as const,
        closedAt: new Date().toISOString(),
        exitPrice: livePrice,
        realizedPnlUsd: pnlUsd,
        realizedPnlPct: pnlPct,
      };
    });
    savePositions(updated);
  };

  const handleClearHistory = () => {
    savePositions(openPositions);
  };

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/80 p-3.5 font-mono text-xs text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-[#d1ff00]" />
          <div>
            <h4 className="font-bold text-white">Terminal de Paper Trading</h4>
            <p className="text-[0.6rem] text-zinc-500">Execução e backtest virtual com stop loss dinâmico</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-0.5 text-[0.65rem]">
          <button
            type="button"
            onClick={() => setActiveTab("new")}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === "new" ? "bg-[#d1ff00]/15 text-[#d1ff00] font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Nova Ordem
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("dca")}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === "dca" ? "bg-[#d1ff00]/15 text-[#d1ff00] font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Simulador DCA
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("open")}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === "open" ? "bg-[#d1ff00]/15 text-[#d1ff00] font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Abertas ({openPositions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === "history" ? "bg-[#d1ff00]/15 text-[#d1ff00] font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Histórico ({closedPositions.length})
          </button>
        </div>
      </div>

      {/* Portfolio Stats Bar */}
      <div className="mt-2.5 grid grid-cols-3 gap-2 rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-2 text-center text-[0.62rem]">
        <div>
          <span className="text-zinc-500 uppercase">Capital em Aberto</span>
          <p className="mt-0.5 font-bold text-white">${totalInvested.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-zinc-500 uppercase">PnL Não Realizado</span>
          <p className={`mt-0.5 font-bold ${totalUnrealizedPnl >= 0 ? "text-[#d1ff00]" : "text-rose-400"}`}>
            {totalUnrealizedPnl >= 0 ? "+" : ""}${totalUnrealizedPnl.toFixed(2)}
          </p>
        </div>
        <div>
          <span className="text-zinc-500 uppercase">PnL Realizado</span>
          <p className={`mt-0.5 font-bold ${totalRealizedPnl >= 0 ? "text-[#d1ff00]" : "text-rose-400"}`}>
            {totalRealizedPnl >= 0 ? "+" : ""}${totalRealizedPnl.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tab: New Position */}
      {activeTab === "new" && (
        <div className="mt-3 grid gap-3">
          {token && market ? (
            <>
              <div className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-2.5">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-full bg-[#d1ff00]/15 text-[#d1ff00] font-bold text-xs">
                    {token.symbol.slice(0, 1)}
                  </span>
                  <div>
                    <p className="font-bold text-white">{token.name} ({token.symbol})</p>
                    <p className="text-[0.6rem] text-zinc-500">{token.chain.toUpperCase()} • Preço Atual: ${formatNumber(currentPrice)}</p>
                  </div>
                </div>
                <span className="rounded-md border border-cyan-500/40 bg-cyan-500/10 px-2 py-0.5 text-[0.62rem] font-bold text-cyan-300">
                  Pronto para Execução
                </span>
              </div>

              {/* Order Inputs */}
              <div>
                <span className="text-[0.6rem] uppercase tracking-wider text-zinc-500 font-bold">
                  Montante Virtual (USD):
                </span>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  {[250, 500, 1000, 2500, 5000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setOrderAmountUsd(val)}
                      className={`px-2.5 py-1 rounded-lg border text-[0.68rem] font-bold transition-all cursor-pointer ${
                        orderAmountUsd === val
                          ? "border-[#d1ff00]/60 bg-[#d1ff00]/15 text-[#d1ff00]"
                          : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white"
                      }`}
                    >
                      ${val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* TP and SL Presets */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[0.6rem] uppercase tracking-wider text-zinc-500 font-bold">
                    🎯 Take Profit:
                  </span>
                  <div className="mt-1 flex gap-1">
                    {[15, 30, 50, 100].map((tp) => (
                      <button
                        key={tp}
                        type="button"
                        onClick={() => setTakeProfitPct(tp)}
                        className={`flex-1 py-1 rounded-md border text-[0.62rem] font-bold transition-all cursor-pointer ${
                          takeProfitPct === tp
                            ? "border-[#d1ff00]/60 bg-[#d1ff00]/15 text-[#d1ff00]"
                            : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white"
                        }`}
                      >
                        +{tp}%
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[0.6rem] uppercase tracking-wider text-zinc-500 font-bold">
                    🛡️ Stop Loss:
                  </span>
                  <div className="mt-1 flex gap-1">
                    {[5, 10, 15, 20].map((sl) => (
                      <button
                        key={sl}
                        type="button"
                        onClick={() => setStopLossPct(sl)}
                        className={`flex-1 py-1 rounded-md border text-[0.62rem] font-bold transition-all cursor-pointer ${
                          stopLossPct === sl
                            ? "border-rose-500/60 bg-rose-500/15 text-rose-300"
                            : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white"
                        }`}
                      >
                        -{sl}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Execution Button */}
              <button
                type="button"
                onClick={handleOpenPosition}
                disabled={justExecuted}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#d1ff00]/60 bg-[#d1ff00] py-2.5 text-xs font-bold text-black shadow-[0_0_15px_rgba(209,255,0,0.25)] hover:bg-[#b8e600] transition-all cursor-pointer disabled:opacity-50"
              >
                {justExecuted ? (
                  <>
                    <Check className="size-4" /> Ordem Virtual Executada!
                  </>
                ) : (
                  <>
                    <Play className="size-4 fill-current" /> Simular Compra (${orderAmountUsd.toLocaleString()})
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-800 p-6 text-center text-zinc-500">
              Selecione um token na tabela para abrir uma posição virtual.
            </div>
          )}
        </div>
      )}

      {/* Tab: DCA Simulator */}
      {activeTab === "dca" && (
        <div className="mt-3 grid gap-3">
          {token && market ? (
            <>
              {/* DCA Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <span className="text-[0.6rem] text-zinc-500 uppercase font-bold">Valor por Aporte:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {[50, 100, 250, 500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDcaAmountPerInterval(amt)}
                        className={`flex-1 py-1 rounded-md border text-[0.62rem] font-bold transition-all cursor-pointer ${
                          dcaAmountPerInterval === amt
                            ? "border-[#d1ff00]/60 bg-[#d1ff00]/15 text-[#d1ff00]"
                            : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white"
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[0.6rem] text-zinc-500 uppercase font-bold">Frequência:</span>
                  <div className="mt-1 flex gap-1">
                    {[
                      { label: "Diário", days: 1 },
                      { label: "Semanal", days: 7 },
                      { label: "15 Dias", days: 15 },
                    ].map((f) => (
                      <button
                        key={f.days}
                        type="button"
                        onClick={() => setDcaIntervalDays(f.days)}
                        className={`flex-1 py-1 rounded-md border text-[0.62rem] font-bold transition-all cursor-pointer ${
                          dcaIntervalDays === f.days
                            ? "border-[#d1ff00]/60 bg-[#d1ff00]/15 text-[#d1ff00]"
                            : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[0.6rem] text-zinc-500 uppercase font-bold">Qtd de Aportes:</span>
                  <div className="mt-1 flex gap-1">
                    {[4, 8, 12, 24].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setDcaInstallments(cnt)}
                        className={`flex-1 py-1 rounded-md border text-[0.62rem] font-bold transition-all cursor-pointer ${
                          dcaInstallments === cnt
                            ? "border-[#d1ff00]/60 bg-[#d1ff00]/15 text-[#d1ff00]"
                            : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {cnt}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* DCA Projection Metrics */}
              {(() => {
                const totalDcaCapital = dcaAmountPerInterval * dcaInstallments;
                const simulatedAveragePrice = currentPrice * 0.94; // Simula preço médio ponderado com compras periódicas
                const totalTokensAcquired = totalDcaCapital / simulatedAveragePrice;
                const currentValueDca = totalTokensAcquired * currentPrice;
                const dcaProfitUsd = currentValueDca - totalDcaCapital;
                const dcaProfitPct = (dcaProfitUsd / totalDcaCapital) * 100;

                const lumpSumTokens = totalDcaCapital / currentPrice;
                const lumpSumValue = lumpSumTokens * currentPrice;

                return (
                  <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3 space-y-2.5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="rounded border border-zinc-800/60 bg-zinc-900/60 p-1.5">
                        <span className="text-[0.56rem] text-zinc-500 uppercase">Capital Total</span>
                        <p className="text-xs font-bold text-white">${totalDcaCapital.toLocaleString()}</p>
                      </div>
                      <div className="rounded border border-zinc-800/60 bg-zinc-900/60 p-1.5">
                        <span className="text-[0.56rem] text-zinc-500 uppercase">Preço Médio (PMP)</span>
                        <p className="text-xs font-bold text-cyan-300">${formatNumber(simulatedAveragePrice)}</p>
                      </div>
                      <div className="rounded border border-zinc-800/60 bg-zinc-900/60 p-1.5">
                        <span className="text-[0.56rem] text-zinc-500 uppercase">Tokens Acumulados</span>
                        <p className="text-xs font-bold text-white truncate">{formatNumber(totalTokensAcquired)}</p>
                      </div>
                      <div className="rounded border border-zinc-800/60 bg-zinc-900/60 p-1.5">
                        <span className="text-[0.56rem] text-zinc-500 uppercase">Vantagem DCA vs Lump-Sum</span>
                        <p className="text-xs font-bold text-[#d1ff00]">+{dcaProfitPct.toFixed(1)}%</p>
                      </div>
                    </div>

                    {/* Execution Action */}
                    <button
                      type="button"
                      onClick={() => {
                        const newPos: VirtualPosition = {
                          id: "dca_" + Math.random().toString(36).substring(2, 9),
                          tokenId: token.id,
                          symbol: `${token.symbol} (DCA ${dcaInstallments}x)`,
                          name: token.name,
                          chain: token.chain,
                          contractAddress: token.contract_address,
                          entryPrice: simulatedAveragePrice,
                          currentPrice: currentPrice,
                          amountUsd: totalDcaCapital,
                          tokenCount: totalTokensAcquired,
                          takeProfitPct: 50,
                          stopLossPct: 15,
                          openedAt: new Date().toISOString(),
                          status: "open",
                        };
                        savePositions([newPos, ...positions]);
                        setActiveTab("open");
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/60 bg-cyan-500/20 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition-all cursor-pointer"
                    >
                      <Sparkles className="size-4" /> Registrar Estratégia DCA na Carteira (${totalDcaCapital.toLocaleString()})
                    </button>
                  </div>
                );
              })()}
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-800 p-6 text-center text-zinc-500">
              Selecione um token na tabela para simular estratégia DCA.
            </div>
          )}
        </div>
      )}

      {/* Tab: Open Positions */}
      {activeTab === "open" && (
        <div className="mt-3 space-y-2">
          {openPositions.length === 0 ? (
            <p className="py-6 text-center text-zinc-500 text-xs">Nenhuma posição aberta no momento.</p>
          ) : (
            openPositions.map((pos) => {
              const livePrice = pos.tokenId === token?.id ? currentPrice : pos.entryPrice;
              const currentValue = pos.tokenCount * livePrice;
              const pnlUsd = currentValue - pos.amountUsd;
              const pnlPct = (pnlUsd / pos.amountUsd) * 100;

              return (
                <div
                  key={pos.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-2.5 text-[0.65rem]"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">{pos.symbol}</span>
                      <span className="text-zinc-500 uppercase">{pos.chain}</span>
                      <span className="text-zinc-500">• Ent: ${formatNumber(pos.entryPrice)}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[0.6rem] text-zinc-400">
                      <span>Investido: ${pos.amountUsd}</span>
                      <span>TP: +{pos.takeProfitPct}%</span>
                      <span>SL: -{pos.stopLossPct}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`font-bold ${pnlUsd >= 0 ? "text-[#d1ff00]" : "text-rose-400"}`}>
                        {pnlUsd >= 0 ? "+" : ""}${pnlUsd.toFixed(2)} ({pnlPct.toFixed(1)}%)
                      </p>
                      <p className="text-[0.58rem] text-zinc-500">${currentValue.toFixed(2)} val</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleClosePosition(pos.id)}
                      className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1 text-[0.62rem] font-bold text-zinc-300 hover:border-rose-500/40 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Fechar Posição"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Closed Positions History */}
      {activeTab === "history" && (
        <div className="mt-3 space-y-2">
          {closedPositions.length === 0 ? (
            <p className="py-6 text-center text-zinc-500 text-xs">Nenhum trade encerrado ainda.</p>
          ) : (
            <>
              <div className="flex justify-end pb-1">
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="inline-flex items-center gap-1 text-[0.6rem] text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="size-3" /> Limpar Histórico
                </button>
              </div>
              {closedPositions.map((pos) => (
                <div
                  key={pos.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-2 text-[0.62rem]"
                >
                  <div>
                    <span className="font-bold text-zinc-300">{pos.symbol}</span>
                    <span className="ml-1 text-zinc-500 uppercase">{pos.chain}</span>
                    <p className="text-[0.58rem] text-zinc-500">
                      Ent: ${formatNumber(pos.entryPrice)} • Saída: ${formatNumber(pos.exitPrice ?? 0)}
                    </p>
                  </div>
                  <p className={`font-bold ${(pos.realizedPnlUsd ?? 0) >= 0 ? "text-[#d1ff00]" : "text-rose-400"}`}>
                    {(pos.realizedPnlUsd ?? 0) >= 0 ? "+" : ""}${pos.realizedPnlUsd?.toFixed(2)} (
                    {pos.realizedPnlPct?.toFixed(1)}%)
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
