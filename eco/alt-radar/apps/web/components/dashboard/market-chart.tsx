"use client";

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MarketHistory } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { formatCurrency, formatNumber, formatTime } from "@/eco/alt-radar/apps/web/lib/format";
import { EmptyState } from "@/eco/alt-radar/apps/web/components/shared/query-state";

interface ChartDatum {
  capturedAt: string;
  label: string;
  price: number | null;
  volume: number | null;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ChartDatum }[];
}) {
  if (!active || !payload?.[0]) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-radar-border bg-[#07131c]/95 p-2.5 shadow-xl">
      <p className="text-[0.62rem] font-bold text-radar-muted">{formatTime(point.capturedAt)}</p>
      <p className="mono mt-1 text-xs font-bold text-radar-positive">
        {formatCurrency(point.price)}
      </p>
      <p className="mono mt-0.5 text-[0.64rem] text-radar-neutral">
        Volume {formatCurrency(point.volume, true)}
      </p>
    </div>
  );
}

export function MarketChart({ history }: { history: MarketHistory }) {
  const data: ChartDatum[] = history.points.map((point) => ({
    capturedAt: point.captured_at,
    label: formatTime(point.captured_at),
    price: point.price_usd,
    volume: point.volume_usd,
  }));

  if (!data.length || data.every((point) => point.price === null && point.volume === null)) {
    return (
      <EmptyState
        title="Sem histórico disponível"
        message="O provider ainda não entregou pontos reais para este intervalo."
      />
    );
  }

  return (
    <div className="h-52 w-full" aria-label="Histórico de preço e volume">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 3, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="priceArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#55df8a" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#55df8a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1a2b36" strokeDasharray="3 5" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="label"
            minTickGap={28}
            tick={{ fill: "#6f8492", fontSize: 9 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            domain={["auto", "auto"]}
            tick={{ fill: "#6f8492", fontSize: 9 }}
            tickFormatter={(value: number) => formatNumber(value, true)}
            tickLine={false}
            yAxisId="price"
          />
          <YAxis hide orientation="right" yAxisId="volume" />
          <Tooltip content={<ChartTooltip />} />
          <Bar
            dataKey="volume"
            fill="#315f91"
            opacity={0.26}
            radius={[2, 2, 0, 0]}
            yAxisId="volume"
          />
          <Area
            dataKey="price"
            fill="url(#priceArea)"
            isAnimationActive={false}
            stroke="#55df8a"
            strokeWidth={2}
            type="monotone"
            yAxisId="price"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
