"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SocialResponse } from "@/lib/api/schemas";
import { formatTime } from "@/lib/format";

export function SocialChart({ social }: { social: SocialResponse }) {
  const data = social.timeline
    .filter((point) => point.messages_per_minute !== null)
    .map((point) => ({
      time: formatTime(point.captured_at),
      messages: point.messages_per_minute,
    }));

  if (data.length < 2) {
    return (
      <p className="grid h-20 place-items-center text-[0.68rem] text-radar-subtle">
        Sem série temporal
      </p>
    );
  }

  return (
    <div className="h-24 w-full" aria-label="Atividade social ao longo do tempo">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 2, bottom: 0, left: -32 }}>
          <XAxis
            axisLine={false}
            dataKey="time"
            minTickGap={22}
            tick={{ fill: "#627786", fontSize: 8 }}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "#627786", fontSize: 8 }} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "#07131c",
              border: "1px solid #203340",
              borderRadius: 8,
              fontSize: 10,
            }}
            itemStyle={{ color: "#62a4ff" }}
          />
          <Line
            dataKey="messages"
            dot={false}
            isAnimationActive={false}
            stroke="#62a4ff"
            strokeWidth={1.8}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
