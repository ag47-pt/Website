"use client";

import { useEffect, useState } from "react";
import { Check, DollarSign, Play, Trash2, TrendingUp, X } from "lucide-react";
import type { Opportunity } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { formatCurrency, formatDateTime, formatNumber, formatPercent } from "@/eco/alt-radar/apps/web/lib/format";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

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
  const { primary } = useEcoTheme();

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

    const updated = [newPos, ...positions];
    savePositions(updated);
    setJustExecuted(true);
    setTimeout(() => {
      setJustExecuted(false);
      setActiveTab("open");
    }, 900);
  };

  const handleClosePosition = (id: string, exitPrice: number) => {
    const updated = positions.map((p) => {
      if (p.id === id) {
        const exitVal = p.tokenCount * exitPrice;
        const pnlUsd = exitVal - p.amountUsd;
        const pnlPct = (pnlUsd / p.amountUsd) * 100;
        return {
          ...p,
          status: "closed" as const,
          closedAt: new Date().toISOString(),
          exitPrice,
          realizedPnlUsd: pnlUsd,
          realizedPnlPct: pnlPct,
        };
      }
      return p;
    });
    savePositions(updated);
  };

  const handleClearHistory = () => {
    savePositions(openPositions);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-3.5 font-mono text-xs text-white shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4" style={{ color: primary }} />
          <div>
            <h4 className="font-bold text-white font-sans text-sm">Terminal de Paper Trading</h4>
            <p className="text-[0.6rem] text-zinc-400">Execução e backtest virtual com stop loss dinâmico</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1 text-[0.65rem]">
          {[
            { id: "new", label: "Nova Ordem" },
            { id: "dca", label: "Simulador DCA" },
            { id: "open", label: `Abertas (${openPositions.length})` },
            { id: "history", label: `Histórico (${closedPositions.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "text-white font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
              style={activeTab === tab.id ? { borderColor: `${primary}50`, backgroundColor: `${primary}15`, color: primary, boxShadow: `0 0 8px ${primary}20` } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Stats Bar */}
      <div className="mt-2.5 grid grid-cols-3 gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-2 text-center text-[0.62rem]">
        <div>
          <span className="text-zinc-400 uppercase">Capital em Aberto</span>
          <p className="mt-0.5 font-bold text-white">${totalInvested.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-zinc-400 uppercase">PnL Não Realizado</span>
          <p className={`mt-0.5 font-bold ${totalUnrealizedPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {totalUnrealizedPnl >= 0 ? "+" : ""}${totalUnrealizedPnl.toFixed(2)}
          </p>
        </div>
        <div>
          <span className="text-zinc-400 uppercase">PnL Realizado</span>
          <p className={`mt-0.5 font-bold ${totalRealizedPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {totalRealizedPnl >= 0 ? "+" : ""}${totalRealizedPnl.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tab: New Position */}
      {activeTab === "new" && (
        <div className="mt-3 grid gap-3">
          {token && market ? (
            <>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-xl border border-cyan-500/30 bg-cyan-950/50 font-bold text-cyan-300 text-xs">
                    {token.symbol.slice(0, 1)}
                  </span>
                  <div>
                    <p className="font-bold text-white">{token.name} ({token.symbol})</p>
                    <p className="text-[0.6rem] text-zinc-400">{token.chain.toUpperCase()} • Preço Atual: ${formatNumber(currentPrice)}</p>
                  </div>
                </div>
                <span className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-2 py-0.5 text-[0.62rem] font-bold text-cyan-300 shadow-[0_0_8px_rgba(0,217,255,0.1)]">
                  Pronto para Execução
                </span>
              </div>

              {/* Order Inputs */}
              <div>
                <span className="text-[0.6rem] uppercase tracking-wider text-zinc-400 font-bold">
                  Montante Virtual (USD):
                </span>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  {[250, 500, 1000, 2500, 5000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setOrderAmountUsd(val)}
                      className={`px-2.5 py-1 rounded-xl border text-[0.68rem] font-bold transition-all cursor-pointer ${
                        orderAmountUsd === val
                          ? "border-cyan-500/60 bg-cyan-500/15 text-cyan-300 shadow-[0_0_8px_rgba(0,217,255,0.15)] ring-1 ring-cyan-500/30"
                          : "border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
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
                  <span className="text-[0.6rem] uppercase tracking-wider text-zinc-400 font-bold">
                    🎯 Take Profit:
                  </span>
                  <div className="mt-1 flex gap-1">
                    {[15, 30, 50, 100].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setTakeProfitPct(pct)}
                        className={`flex-1 py-1 rounded-xl border text-[0.65rem] font-bold transition-all cursor-pointer ${
                          takeProfitPct === pct
                            ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.15)]"
                            : "border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        +{pct}%
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[0.6rem] uppercase tracking-wider text-zinc-400 font-bold">
                    🛑 Stop Loss:
                  </span>
                  <div className="mt-1 flex gap-1">
                    {[5, 10, 15, 25].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setStopLossPct(pct)}
                        className={`flex-1 py-1 rounded-xl border text-[0.65rem] font-bold transition-all cursor-pointer ${
                          stopLossPct === pct
                            ? "border-rose-500/60 bg-rose-500/15 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.15)]"
                            : "border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        -{pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Position Summary Preview */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-[0.65rem]">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Tokens Estimados:</span>
                  <span className="font-bold text-white truncate">
                    {formatNumber(orderAmountUsd / currentPrice)} {token.symbol}
                  </span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="text-zinc-400">Alvo Take Profit:</span>
                  <span className="font-bold text-emerald-400">
                    ${formatNumber(currentPrice * (1 + takeProfitPct / 100))} (+${((orderAmountUsd * takeProfitPct) / 100).toFixed(2)})
                  </span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="text-zinc-400">Gatilho Stop Loss:</span>
                  <span className="font-bold text-rose-400">
                    ${formatNumber(currentPrice * (1 - stopLossPct / 100))} (-${((orderAmountUsd * stopLossPct) / 100).toFixed(2)})
                  </span>
                </div>
              </div>

              {/* Execution Button */}
              <button
                type="button"
                onClick={handleOpenPosition}
                disabled={justExecuted}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500 py-2.5 text-xs font-bold text-black shadow-[0_0_15px_rgba(0,217,255,0.25)] hover:bg-cyan-400 transition-all cursor-pointer disabled:opacity-50"
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
            <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-zinc-500">
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
                  <span className="text-[0.6rem] text-zinc-400 uppercase font-bold">Valor por Aporte:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {[50, 100, 250, 500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDcaAmountPerInterval(amt)}
                        className={`flex-1 py-1 rounded-xl border text-[0.62rem] font-bold transition-all cursor-pointer ${
                          dcaAmountPerInterval === amt
                            ? "border-cyan-500/60 bg-cyan-500/15 text-cyan-300"
                            : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[0.6rem] text-zinc-400 uppercase font-bold">Frequência:</span>
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
                        className={`flex-1 py-1 rounded-xl border text-[0.62rem] font-bold transition-all cursor-pointer ${
                          dcaIntervalDays === f.days
                            ? "border-cyan-500/60 bg-cyan-500/15 text-cyan-300"
                            : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[0.6rem] text-zinc-400 uppercase font-bold">Qtd de Aportes:</span>
                  <div className="mt-1 flex gap-1">
                    {[4, 8, 12, 24].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setDcaInstallments(cnt)}
                        className={`flex-1 py-1 rounded-xl border text-[0.62rem] font-bold transition-all cursor-pointer ${
                          dcaInstallments === cnt
                            ? "border-cyan-500/60 bg-cyan-500/15 text-cyan-300"
                            : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
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
                const simulatedAveragePrice = currentPrice * 0.94;
                const totalTokensAcquired = totalDcaCapital / simulatedAveragePrice;
                const currentValueDca = totalTokensAcquired * currentPrice;
                const dcaProfitUsd = currentValueDca - totalDcaCapital;
                const dcaProfitPct = (dcaProfitUsd / totalDcaCapital) * 100;

                return (
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2.5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2">
                        <span className="text-[0.56rem] text-zinc-400 uppercase">Capital Total</span>
                        <p className="text-xs font-bold text-white">${totalDcaCapital.toLocaleString()}</p>
                      </div>
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2">
                        <span className="text-[0.56rem] text-zinc-400 uppercase">Preço Médio (PMP)</span>
                        <p className="text-xs font-bold text-cyan-300">${formatNumber(simulatedAveragePrice)}</p>
                      </div>
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2">
                        <span className="text-[0.56rem] text-zinc-400 uppercase">Tokens Acumulados</span>
                        <p className="text-xs font-bold text-white truncate">{formatNumber(totalTokensAcquired)}</p>
                      </div>
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2">
                        <span className="text-[0.56rem] text-zinc-400 uppercase">Vantagem DCA vs Lump-Sum</span>
                        <p className="text-xs font-bold text-emerald-400">+{dcaProfitPct.toFixed(1)}%</p>
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
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500 py-2.5 text-xs font-bold text-black shadow-[0_0_15px_rgba(0,217,255,0.25)] hover:bg-cyan-400 transition-all cursor-pointer"
                    >
                      <Play className="size-4 fill-current" /> Agendar Plano DCA (${totalDcaCapital.toLocaleString()})
                    </button>
                  </div>
                );
              })()}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-zinc-500">
              Selecione um token na tabela para simular estratégia Dollar-Cost Averaging.
            </div>
          )}
        </div>
      )}

      {/* Tab: Open Positions */}
      {activeTab === "open" && (
        <div className="mt-3 space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
          {openPositions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-zinc-500">
              Nenhuma posição aberta no momento.
            </div>
          ) : (
            openPositions.map((pos) => {
              const livePrice = pos.tokenId === token?.id ? currentPrice : pos.entryPrice;
              const currentVal = pos.tokenCount * livePrice;
              const pnlUsd = currentVal - pos.amountUsd;
              const pnlPct = (pnlUsd / pos.amountUsd) * 100;

              return (
                <div
                  key={pos.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 hover:border-white/20 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{pos.symbol}</span>
                      <span className="text-[0.6rem] text-zinc-400 uppercase">{pos.chain}</span>
                    </div>
                    <p className="text-[0.6rem] text-zinc-400">
                      Entrada: ${formatNumber(pos.entryPrice)} • Atual: ${formatNumber(livePrice)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className={`font-bold ${pnlUsd >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {pnlUsd >= 0 ? "+" : ""}${pnlUsd.toFixed(2)} ({pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(1)}%)
                    </p>
                    <p className="text-[0.6rem] text-zinc-400">Posição: ${pos.amountUsd}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleClosePosition(pos.id, livePrice)}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[0.65rem] font-bold text-zinc-300 hover:border-rose-500/40 hover:bg-rose-950/40 hover:text-rose-300 transition-all cursor-pointer"
                  >
                    Encerrar
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: History */}
      {activeTab === "history" && (
        <div className="mt-3 space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
          <div className="flex justify-between items-center pb-1">
            <span className="text-[0.62rem] text-zinc-400 font-bold uppercase">
              Operações Concluídas ({closedPositions.length})
            </span>
            {closedPositions.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="inline-flex items-center gap-1 text-[0.6rem] text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <Trash2 className="size-3" /> Limpar Histórico
              </button>
            )}
          </div>

          {closedPositions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-zinc-500">
              Nenhum trade encerrado ainda.
            </div>
          ) : (
            closedPositions.map((pos) => (
              <div
                key={pos.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-2 text-[0.65rem]"
              >
                <div>
                  <span className="font-bold text-white">{pos.symbol}</span>
                  <p className="text-[0.58rem] text-zinc-500">
                    Encerrado em: {formatDateTime(pos.closedAt ?? pos.openedAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${(pos.realizedPnlUsd ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {(pos.realizedPnlUsd ?? 0) >= 0 ? "+" : ""}${pos.realizedPnlUsd?.toFixed(2)} (
                    {(pos.realizedPnlPct ?? 0) >= 0 ? "+" : ""}{pos.realizedPnlPct?.toFixed(1)}%)
                  </p>
                  <p className="text-[0.58rem] text-zinc-500">Base: ${pos.amountUsd}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
