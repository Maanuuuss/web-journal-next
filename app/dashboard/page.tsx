"use client";

import dayjs from "dayjs";
import "dayjs/locale/es";
import PerformanceCalendar from "../components/PerformanceCalendar";
import WeeklyChart from "../components/WeeklyChart";
import { useTrades } from "../hooks/useTrades";

dayjs.locale("es");

export default function Dashboard() {
  const { trades } = useTrades();

  const currentMonth = dayjs();

  const monthTrades = trades.filter((t) =>
    dayjs(t.date).isSame(currentMonth, "month")
  );

  const totalProfit = monthTrades.reduce((acc, t) => acc + t.profit, 0);
  const winTrades = monthTrades.filter((t) => t.profit > 0).length;
  const totalTrades = monthTrades.length;

  const winrate = totalTrades
    ? ((winTrades / totalTrades) * 100).toFixed(1)
    : "0";

  const bestDay =
    totalTrades > 0
      ? monthTrades.reduce((a, b) => (a.profit > b.profit ? a : b))
      : null;

  const worstDay =
    totalTrades > 0
      ? monthTrades.reduce((a, b) => (a.profit < b.profit ? a : b))
      : null;

  // Agrupar por semana
  const weeklySummary: Record<string, number> = {};

  trades.forEach((trade) => {
    const week = dayjs(trade.date).week();
    if (!weeklySummary[week]) weeklySummary[week] = 0;
    weeklySummary[week] += trade.profit;
  });

  const weeklyChartData = Object.keys(weeklySummary).map((week) => ({
    semana: `W${week}`,
    profit: weeklySummary[week],
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-lg bg-dark-bg border border-dark-accent">
          <h2 className="text-xl font-semibold mb-2">Winrate</h2>
          <p className="text-4xl font-bold text-dark-accent">{winrate}%</p>
        </div>

        <div className="p-6 rounded-lg bg-dark-bg border border-dark-accent">
          <h2 className="text-xl font-semibold mb-2">Rendimiento</h2>
          <p className={`text-4xl font-bold ${totalProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
            {totalProfit.toFixed(2)}€
          </p>
        </div>

        <div className="p-6 rounded-lg bg-dark-bg border border-dark-accent">
          <h2 className="text-xl font-semibold mb-2">Mejor día</h2>
          <p className="text-2xl font-bold text-green-400">
            {bestDay ? `${dayjs(bestDay.date).format("DD/MM")} (${bestDay.profit}€)` : "—"}
          </p>
        </div>

        <div className="p-6 rounded-lg bg-dark-bg border border-dark-accent">
          <h2 className="text-xl font-semibold mb-2">Peor día</h2>
          <p className="text-2xl font-bold text-red-400">
            {worstDay ? `${dayjs(worstDay.date).format("DD/MM")} (${worstDay.profit}€)` : "—"}
          </p>
        </div>
      </div>

      {/* Calendario + Panel lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">

        <div className="lg:col-span-3 bg-dark-bg border border-dark-accent p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Calendario de rendimiento</h2>
          <PerformanceCalendar />
        </div>

        <div className="bg-dark-bg border border-dark-accent p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Rendimiento semanal</h2>
          <WeeklyChart data={weeklyChartData} />
        </div>

      </div>
    </div>
  );
}
