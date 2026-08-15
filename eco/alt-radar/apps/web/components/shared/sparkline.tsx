"use client";

import React, { useMemo } from "react";

interface SparklineProps {
  change24h?: number | null;
  change1h?: number | null;
  change5m?: number | null;
  seed?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function Sparkline({
  change24h = 0,
  change1h = 0,
  change5m = 0,
  seed = "default",
  width = 84,
  height = 28,
  className = "",
}: SparklineProps) {
  const isPositive = (change24h ?? change1h ?? 0) >= 0;
  const strokeColor = isPositive ? "#10b981" : "#f43f5e";
  const glowColor = isPositive ? "rgba(16, 185, 129, 0.4)" : "rgba(244, 63, 94, 0.4)";
  const gradientId = useMemo(
    () => `sparkline-grad-${seed.replace(/[^a-zA-Z0-9]/g, "")}-${Math.abs(Math.round((change24h ?? 0) * 10))}`,
    [seed, change24h]
  );

  // Generate deterministic, realistic 12-point micro-series
  const points = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }

    const c24 = change24h ?? 0;
    const c1 = change1h ?? 0;
    const c5 = change5m ?? 0;

    const rawValues = [0];
    let current = 0;

    const pseudoRandom = (step: number) => {
      const x = Math.sin(hash + step * 9301 + 49297) * 233280;
      return x - Math.floor(x);
    };

    // 10 intermediate points simulating market noise converging to change24h
    for (let i = 1; i <= 9; i++) {
      const progress = i / 11;
      const trend = c24 * progress;
      const noise = (pseudoRandom(i) - 0.48) * (Math.abs(c24) * 0.4 + 4);
      current = trend + noise;
      rawValues.push(current);
    }

    // Point 10 (recent 1h dynamic)
    rawValues.push(c24 - c1 * 0.5);
    // Point 11 (recent 5m dynamic)
    rawValues.push(c24 - c5 * 0.2);
    // Final point
    rawValues.push(c24);

    const minVal = Math.min(...rawValues);
    const maxVal = Math.max(...rawValues);
    const range = maxVal - minVal || 1;

    const paddingY = 4;
    const usableHeight = height - paddingY * 2;

    return rawValues.map((val, idx) => {
      const x = (idx / (rawValues.length - 1)) * width;
      const normalized = (val - minVal) / range;
      // Invert Y because SVG 0 is top
      const y = height - paddingY - normalized * usableHeight;
      return { x, y };
    });
  }, [change24h, change1h, change5m, seed, width, height]);

  // Construct smooth SVG path using Catmull-Rom or cubic Bezier
  const pathD = useMemo(() => {
    if (points.length < 2) return "";
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(i - 1, 0)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(i + 2, points.length - 1)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  }, [points]);

  // Area fill path closing down to bottom
  const areaD = useMemo(() => {
    if (!pathD || points.length < 2) return "";
    const lastX = points[points.length - 1].x;
    return `${pathD} L ${lastX.toFixed(1)} ${height} L 0 ${height} Z`;
  }, [pathD, points, height]);

  const lastPoint = points[points.length - 1];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
            <stop offset="85%" stopColor={strokeColor} stopOpacity={0.02} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Gradient fill */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Line shadow */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={3}
          strokeOpacity={0.3}
          className="blur-[2px]"
        />

        {/* Crisp Line */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Live endpoint dot with pulse */}
        {lastPoint && (
          <>
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r={2.5}
              fill="#ffffff"
              style={{ filter: `drop-shadow(0 0 4px ${strokeColor})` }}
            />
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r={4.5}
              fill="none"
              stroke={strokeColor}
              strokeWidth={1}
              className="animate-ping opacity-60 origin-center"
            />
          </>
        )}
      </svg>
    </div>
  );
}
