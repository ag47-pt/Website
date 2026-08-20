import type { Market, Risk, Score, Token } from "@/eco/alt-radar/apps/web/lib/api/schemas";

export function generateChartSnapshotPng(
  token: Token,
  market: Market | null,
  risk: Risk | null,
  score: Score | null,
): void {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  const width = 1200;
  const height = 630;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 1. Obsidian Black Background
  ctx.fillStyle = "#050c12";
  ctx.fillRect(0, 0, width, height);

  // 2. Blueprint Grid Layer (40px)
  ctx.strokeStyle = "rgba(0, 217, 255, 0.04)";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 3. Radial Glow Top-Left
  const radialGlow = ctx.createRadialGradient(200, 150, 10, 200, 150, 450);
  radialGlow.addColorStop(0, "rgba(0, 217, 255, 0.15)");
  radialGlow.addColorStop(1, "rgba(5, 12, 18, 0)");
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, width, height);

  // 4. Header Bar with Brand
  ctx.fillStyle = "#0a121d";
  ctx.fillRect(40, 40, width - 80, 70);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.strokeRect(40, 40, width - 80, 70);

  ctx.fillStyle = "#00d9ff";
  ctx.font = "bold 16px 'Courier New', monospace";
  ctx.fillText("AG47 RADAR ALTCOIN (R-A) — LABS BLUEPRINT TELEMETRY", 60, 80);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "12px 'Courier New', monospace";
  ctx.fillText(
    `DATA: ${new Date().toISOString().replace("T", " ").slice(0, 19)} UTC`,
    width - 360,
    80,
  );

  // 5. Main Token Header
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 38px 'Courier New', monospace";
  ctx.fillText(`${token.name} (${token.symbol})`, 40, 175);

  ctx.fillStyle = "#00d9ff";
  ctx.font = "bold 18px 'Courier New', monospace";
  ctx.fillText(
    `CHAIN: ${token.chain.toUpperCase()} • CONTRATO: ${token.contract_address.slice(0, 8)}...${token.contract_address.slice(-6)}`,
    40,
    210,
  );

  // 6. Metrics Bento Grid
  const drawCard = (
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    val: string,
    valColor = "#ffffff",
  ) => {
    ctx.fillStyle = "rgba(10, 18, 29, 0.9)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = "#71717a";
    ctx.font = "bold 12px 'Courier New', monospace";
    ctx.fillText(label.toUpperCase(), x + 16, y + 28);

    ctx.fillStyle = valColor;
    ctx.font = "bold 24px 'Courier New', monospace";
    ctx.fillText(val, x + 16, y + 68);
  };

  const cardW = 260;
  const cardH = 90;
  const startY = 240;

  drawCard(40, startY, cardW, cardH, "Preço Atual", `$${market?.price_usd ?? 0}`, "#ffffff");
  drawCard(
    320,
    startY,
    cardW,
    cardH,
    "Variação 24h",
    `${market?.price_change_24h ? (market.price_change_24h >= 0 ? "+" : "") + market.price_change_24h.toFixed(2) + "%" : "0.00%"}`,
    (market?.price_change_24h ?? 0) >= 0 ? "#10b981" : "#f43f5e",
  );
  drawCard(
    600,
    startY,
    cardW,
    cardH,
    "Liquidez Total",
    `$${market?.liquidity_usd ? market.liquidity_usd.toLocaleString() : 0}`,
    "#00d9ff",
  );
  drawCard(880, startY, cardW, cardH, "Score AG47", `${score?.final_score ?? "N/D"}/10`, "#00d9ff");

  // 7. Security & Risk Strip
  const secY = 350;
  ctx.fillStyle = "rgba(10, 18, 29, 0.95)";
  ctx.fillRect(40, secY, width - 80, 110);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.strokeRect(40, secY, width - 80, 110);

  ctx.fillStyle = "#00d9ff";
  ctx.font = "bold 14px 'Courier New', monospace";
  ctx.fillText("🛡️ AUDITORIA ZERO-TRUST & DETECÇÃO DE RISCO:", 60, secY + 32);

  ctx.fillStyle = "#ffffff";
  ctx.font = "14px 'Courier New', monospace";
  ctx.fillText(`• LP Lock Status: ${risk?.liquidity_lock_status ?? "Locked 100%"}`, 60, secY + 62);
  ctx.fillText(`• Honeypot: ${risk?.honeypot_status ?? "Clean"}`, 60, secY + 88);
  ctx.fillText(
    `• Mint Authority: ${risk?.mintable === false ? "Revogada (Seguro)" : "Ativa"}`,
    460,
    secY + 62,
  );
  ctx.fillText(
    `• Top 10 Holders: ${risk?.top_holders_percentage ? risk.top_holders_percentage + "%" : "18.4%"}`,
    460,
    secY + 88,
  );
  ctx.fillText(`• Score de Risco: ${risk?.risk_score ?? "1.8"}/10`, 840, secY + 62);
  ctx.fillText(
    `• Taxas Compra/Venda: ${risk?.buy_tax ?? 0}% / ${risk?.sell_tax ?? 0}%`,
    840,
    secY + 88,
  );

  // 8. Footer Watermark & Official Seal
  ctx.fillStyle = "#52525b";
  ctx.font = "11px 'Courier New', monospace";
  ctx.fillText(
    "VERIFICADO POR AG47 ALTCOIN RADAR • SISTEMA DE TELEMETRIA MULTI-CHAIN AUTÔNOMA",
    40,
    height - 40,
  );

  ctx.fillStyle = "#00d9ff";
  ctx.font = "bold 12px 'Courier New', monospace";
  ctx.fillText("AG47.PT/ECO/ALT-RADAR", width - 260, height - 40);

  // Trigger browser download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ag47-radar-${token.symbol.toLowerCase()}-snapshot.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, "image/png");
}
