"use client";

import dayjs from "dayjs";
import "dayjs/locale/es";
import weekOfYear from "dayjs/plugin/weekOfYear";

import PerformanceCalendar from "../components/PerformanceCalendar";
import WeeklyChart from "../components/WeeklyChart";
import { useTradesContext } from "../context/TradesContext";

// Activar plugins
dayjs.extend(weekOfYear);
dayjs.locale("es");

export default function Dashboard() {
  const { trades } = useTradesContext();

  const currentMonth = dayjs();

  // Trades del mes actual
  const monthTrades = trades.filter((t: any) =>
    dayjs(t.date).isSame(currentMonth, "month")
  );

  const totalProfit = monthTrades.reduce((acc: number, t: any) => acc + t.profit, 0);
  const winTrades = monthTrades.filter((t: any) => t.profit > 0).length;
  const totalTrades = monthTrades.length;

  const winrate = totalTrades
    ? ((winTrades / totalTrades) * 100).toFixed(1)
    : "0";

  const bestDay =
    totalTrades > 0
      ? monthTrades.reduce((a: any, b: any) => (a.profit > b.profit ? a : b))
      : null;

  const worstDay =
    totalTrades > 0
      ? monthTrades.reduce((a: any, b: any) => (a.profit < b.profit ? a : b))
      : null;

  // Agrupar por semana
  const weeklySummary: Record<string, number> = {};

  trades.forEach((trade: any) => {
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

      {/* Tarjetas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Winrate */}
        <div className="p-6 rounded-lg bg-dark-bg border border-dark-accent">
          <h2 className="text-xl font-semibold mb-2">Winrate</h2>
          <p className="text-4xl font-bold text-dark-accent">{winrate}%</p>
        </div>

        {/* Rendimiento */}
        <div className="p-6 rounded-lg bg-dark-bg border border-dark-accent">
          <h2 className="text-xl font-semibold mb-2">Rendimiento</h2>
          <p
            className={`text-4xl font-bold ${
              totalProfit >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {totalProfit.toFixed(2)}€
          </p>
        </div>

        {/* Mejor día */}
        <div className="p-6 rounded-lg bg-dark-bg border border-dark-accent">
          <h2 className="text-xl font-semibold mb-2">Mejor día</h2>
          <p className="text-2xl font-bold text-green-400">
            {bestDay
              ? `${dayjs(bestDay.date).format("DD/MM")} (${bestDay.profit}€)`
              : "—"}
          </p>
        </div>

        {/* Peor día */}
        <div className="p-6 rounded-lg bg-dark-bg border border-dark-accent">
          <h2 className="text-xl font-semibold mb-2">Peor día</h2>
          <p className="text-2xl font-bold text-red-400">
            {worstDay
              ? `${dayjs(worstDay.date).format("DD/MM")} (${worstDay.profit}€)`
              : "—"}
          </p>
        </div>
      </div>

      {/* Calendario + Rendimiento semanal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">

        {/* Calendario */}
        <div className="lg:col-span-3 bg-dark-bg border border-dark-accent p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Calendario de rendimiento</h2>
          <PerformanceCalendar />
        </div>

        {/* Gráfico semanal */}
        <div className="bg-dark-bg border border-dark-accent p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Rendimiento semanal</h2>
          <WeeklyChart data={weeklyChartData} />
        </div>

      </div>
    </div>
  );
}
