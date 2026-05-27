"use client";

import { useTrades } from "../hooks/useTrades";
import dayjs from "dayjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";

export default function StatsPage() {
  const { trades } = useTrades();

  // Ordenar trades por fecha
  const sorted = [...trades].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const totalProfit = sorted.reduce((acc, t) => acc + t.profit, 0);
  const wins = sorted.filter((t) => t.profit > 0);
  const losses = sorted.filter((t) => t.profit < 0);

  const winrate = sorted.length
    ? ((wins.length / sorted.length) * 100).toFixed(1)
    : "0";

  const avgR = sorted.length
    ? (sorted.reduce((acc, t) => acc + t.r, 0) / sorted.length).toFixed(2)
    : "0";

  const expectancy = sorted.length
    ? (
        (wins.length / sorted.length) * (wins.reduce((a, b) => a + b.profit, 0) / wins.length || 0) -
        (losses.length / sorted.length) * (Math.abs(losses.reduce((a, b) => a + b.profit, 0)) / losses.length || 0)
      ).toFixed(2)
    : "0";

  const profitFactor =
    losses.length === 0
      ? "∞"
      : (
          wins.reduce((a, b) => a + b.profit, 0) /
          Math.abs(losses.reduce((a, b) => a + b.profit, 0))
        ).toFixed(2);

  // Equity curve
  let cumulative = 0;
  const equityCurve = sorted.map((t) => {
    cumulative += t.profit;
    return {
      date: dayjs(t.date).format("DD/MM"),
      equity: cumulative,
    };
  });

  // Drawdown
  let peak = 0;
  let maxDD = 0;
  cumulative = 0;

  sorted.forEach((t) => {
    cumulative += t.profit;
    if (cumulative > peak) peak = cumulative;
    const dd = peak - cumulative;
    if (dd > maxDD) maxDD = dd;
  });

  // Distribución de resultados
  const distribution = sorted.map((t) => ({
    profit: t.profit,
  }));

  // Rendimiento por día de la semana
  const weekdayMap: Record<string, number> = {
    Lun: 0,
    Mar: 0,
    Mié: 0,
    Jue: 0,
    Vie: 0,
  };

  sorted.forEach((t) => {
    const day = dayjs(t.date).format("ddd");
    if (weekdayMap[day] !== undefined) {
      weekdayMap[day] += t.profit;
    }
  });

  const weekdayData = Object.keys(weekdayMap).map((d) => ({
    day: d,
    profit: weekdayMap[d],
  }));

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Estadísticas avanzadas</h1>

      {/* Tarjetas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Rendimiento total" value={`${totalProfit.toFixed(2)}€`} />
        <StatCard title="Winrate" value={`${winrate}%`} />
        <StatCard title="R promedio" value={avgR} />
        <StatCard title="Expectativa" value={`${expectancy}€`} />
        <StatCard title="Profit Factor" value={profitFactor} />
        <StatCard title="Max Drawdown" value={`${maxDD.toFixed(2)}€`} />
      </div>

      {/* Equity Curve */}
      <Section title="Equity Curve">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={equityCurve}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="equity"
              stroke="#4ade80"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* Distribución de resultados */}
      <Section title="Distribución de resultados">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={distribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="profit" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                color: "#fff",
              }}
            />
            <Bar dataKey="profit">
              {distribution.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.profit >= 0 ? "#86efac" : "#f87171"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Rendimiento por día de la semana */}
      <Section title="Rendimiento por día de la semana">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weekdayData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="day" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                color: "#fff",
              }}
            />
            <Bar dataKey="profit">
              {weekdayData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.profit >= 0 ? "#86efac" : "#f87171"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Section>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-6 rounded-lg bg-dark-bg border border-dark-accent">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold text-dark-accent">{value}</p>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="bg-dark-bg border border-dark-accent p-6 rounded-lg space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}
