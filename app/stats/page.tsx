"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Lun", profit: 120 },
  { day: "Mar", profit: -50 },
  { day: "Mié", profit: 200 },
  { day: "Jue", profit: -30 },
  { day: "Vie", profit: 180 },
];

export default function StatsPage() {
  return (
    <div className="w-full h-full">
      <h1 className="text-3xl font-bold mb-6">Estadísticas</h1>

      <div className="w-full h-80 bg-dark-bg border border-dark-accent p-4 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="day" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#6d28d9"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
