'use client';

import React from 'react';

interface TokenSparklineProps {
  data?: number[];
  color?: 'cyan' | 'emerald' | 'amber' | 'rose';
  height?: number;
  width?: number;
  className?: string;
}

const COLOR_MAP = {
  cyan: {
    stroke: '#22d3ee',
    gradient: 'rgba(34, 211, 238, 0.25)',
  },
  emerald: {
    stroke: '#34d399',
    gradient: 'rgba(52, 211, 153, 0.25)',
  },
  amber: {
    stroke: '#fbbf24',
    gradient: 'rgba(251, 191, 36, 0.25)',
  },
  rose: {
    stroke: '#fb7185',
    gradient: 'rgba(251, 113, 133, 0.25)',
  },
};

const DEFAULT_DATA = [10, 15, 12, 22, 18, 30, 28, 42, 38, 55, 50, 68];

export function TokenSparkline({
  data = DEFAULT_DATA,
  color = 'cyan',
  height = 40,
  width = 120,
  className = '',
}: TokenSparklineProps) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;

  const themeColor = COLOR_MAP[color] || COLOR_MAP.cyan;
  const gradientId = `sparkline-gradient-${color}-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={themeColor.stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={themeColor.stroke} stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Area Fill */}
      <path d={areaD} fill={`url(#${gradientId})`} />

      {/* Line Path */}
      <path
        d={pathD}
        fill="none"
        stroke={themeColor.stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Current Point Dot */}
      {data.length > 0 && (
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * (height - 8) - 4}
          r="3"
          fill={themeColor.stroke}
          className="animate-ping"
        />
      )}
    </svg>
  );
}
