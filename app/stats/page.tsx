"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Lun", equity: 100 },
  { day: "Mar", equity: 102 },
  { day: "Mié", equity: 101 },
  { day: "Jue", equity: 104 },
  { day: "Vie", equity: 103 },
];

export default function StatsPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Estadísticas</h1>

      {/* Tarjetas minimalistas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Winrate</span>
          <span className="text-4xl font-bold text-dark-accent">0%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Profit Factor</span>
          <span className="text-4xl font-bold text-green-400">0.00</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Mejor día</span>
          <span className="text-4xl font-bold text-blue-400">—</span>
        </div>
      </div>

      {/* Gráfico minimalista */}
      <div className="h-64 mt-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0d0d0d",
                border: "1px solid #6366f1",
                color: "#e5e7eb",
              }}
            />
            <Line
              type="monotone"
              dataKey="equity"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
