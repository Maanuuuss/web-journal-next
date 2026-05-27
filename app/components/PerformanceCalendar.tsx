"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useTrades } from "../hooks/useTrades";

dayjs.locale("es");

export default function PerformanceCalendar() {
  const { trades } = useTrades(); // 🔥 Ahora usamos los trades reales

  const [month, setMonth] = useState(dayjs());
  const [animDirection, setAnimDirection] = useState<"left" | "right" | null>(null);
  const [heatmap, setHeatmap] = useState(false);

  const daysInMonth = month.daysInMonth();
  const startDay = month.startOf("month").day();

  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  // 🔥 Obtener trade por día
  const getTradeData = (day: number) => {
    const date = month.date(day).format("YYYY-MM-DD");
    return trades.find((t) => t.date === date);
  };

  // 🔥 Trades del mes actual
  const monthTrades = trades.filter((t) =>
    dayjs(t.date).isSame(month, "month")
  );

  const totalProfit = monthTrades.reduce((acc, t) => acc + t.profit, 0);
  const winTrades = monthTrades.filter((t) => t.profit > 0).length;
  const totalTrades = monthTrades.length;

  const winrate = totalTrades
    ? ((winTrades / totalTrades) * 100).toFixed(1)
    : "0";

  const avgPerDay = totalTrades
    ? (totalProfit / totalTrades).toFixed(2)
    : "0";

  const bestDay =
    totalTrades > 0
      ? monthTrades.reduce((a, b) => (a.profit > b.profit ? a : b))
      : null;

  const worstDay =
    totalTrades > 0
      ? monthTrades.reduce((a, b) => (a.profit < b.profit ? a : b))
      : null;

  const changeMonth = (direction: "left" | "right") => {
    setAnimDirection(direction);

    setTimeout(() => {
      setMonth(
        direction === "left"
          ? month.subtract(1, "month")
          : month.add(1, "month")
      );
      setAnimDirection(null);
    }, 250);
  };

  const goToToday = () => {
    setAnimDirection("right");
    setTimeout(() => {
      setMonth(dayjs());
      setAnimDirection(null);
    }, 250);
  };

  return (
    <div className="space-y-6 transition-all duration-300">

      {/* Toggle Heatmap + Ir a hoy */}
      <div className="flex justify-between items-center">

        <button
          onClick={() => setHeatmap(!heatmap)}
          className={`px-4 py-2 rounded-md border border-dark-accent transition-all duration-300 ${
            heatmap
              ? "bg-dark-accent text-black font-semibold"
              : "bg-dark-bg text-white hover:bg-dark-accent/20"
          }`}
        >
          {heatmap ? "Heatmap activado" : "Activar Heatmap"}
        </button>

        <button
          onClick={goToToday}
          className="px-4 py-2 bg-dark-bg text-white border border-dark-accent rounded-md hover:bg-dark-accent/20 transition-all duration-300"
        >
          Ir a hoy
        </button>
      </div>

      {/* Navegación */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <button
          onClick={() => changeMonth("left")}
          className="px-3 py-1 bg-dark-bg text-white border border-dark-accent rounded-md hover:bg-dark-accent/20 transition-all duration-200"
        >
          ← Mes anterior
        </button>

        <div className="flex items-center gap-3 justify-center">

          {/* Selector de mes */}
          <select
            value={month.month()}
            onChange={(e) => setMonth(month.month(parseInt(e.target.value)))}
            className="bg-dark-bg text-white border border-dark-accent rounded-lg px-3 py-1"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i} className="bg-dark-bg text-white">
                {dayjs().month(i).format("MMMM")}
              </option>
            ))}
          </select>

          {/* Selector de año */}
          <select
            value={month.year()}
            onChange={(e) => setMonth(month.year(parseInt(e.target.value)))}
            className="bg-dark-bg text-white border border-dark-accent rounded-lg px-3 py-1"
          >
            {Array.from({ length: 6 }).map((_, i) => {
              const year = 2024 + i;
              return (
                <option key={year} value={year} className="bg-dark-bg text-white">
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        <button
          onClick={() => changeMonth("right")}
          className="px-3 py-1 bg-dark-bg text-white border border-dark-accent rounded-md hover:bg-dark-accent/20 transition-all duration-200"
        >
          Mes siguiente →
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 text-center text-dark-text/70 font-semibold text-xs sm:text-sm">
        {weekDays.map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendario */}
      <div
        className={`
          grid grid-cols-7 gap-2 text-dark-text transition-all duration-300
          ${animDirection === "left" ? "-translate-x-5 opacity-0" : ""}
          ${animDirection === "right" ? "translate-x-5 opacity-0" : ""}
        `}
      >
        {/* Espacios vacíos */}
        {Array.from({ length: startDay === 0 ? 6 : startDay - 1 }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="h-16 sm:h-24 bg-dark-bg/40 border border-dark-accent/20 rounded-md"
          />
        ))}

        {/* Días */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const trade = getTradeData(day);

          let color = "bg-dark-bg/40";
          if (trade) {
            color = heatmap
              ? trade.profit > 0
                ? "bg-green-400/50"
                : "bg-red-400/50"
              : trade.profit > 0
              ? "bg-green-300/40"
              : "bg-red-300/40";
          }

          return (
            <div
              key={day}
              className={`relative h-16 sm:h-24 border border-dark-accent/20 rounded-md p-1 sm:p-2 ${color} group transition-all duration-300 hover:scale-[1.03] hover:shadow-lg`}
            >
              <div className="text-xs sm:text-sm font-semibold">
                {day}
                <span className="block text-[8px] sm:text-[10px] text-dark-text/60">
                  {month.format("MMM")}
                </span>
              </div>

              {trade ? (
                <div className="text-[10px] sm:text-xs mt-1 font-medium">
                  {trade.profit > 0 ? "+" : ""}
                  {trade.profit}€
                </div>
              ) : (
                <div className="text-[10px] sm:text-xs mt-1 text-dark-text/40">
                  Sin trades
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resumen mensual */}
      <div className="mt-6 p-4 bg-dark-bg border border-dark-accent rounded-lg text-dark-text">
        <h3 className="text-lg font-semibold mb-2">Resumen mensual</h3>

        <p>Total del mes: <span className="font-bold">{totalProfit.toFixed(2)}€</span></p>
        <p>Winrate del mes: <span className="font-bold">{winrate}%</span></p>
        <p>Total de trades: <span className="font-bold">{totalTrades}</span></p>
        <p>Promedio por día: <span className="font-bold">{avgPerDay}€</span></p>

        <p className="mt-2">
          Mejor día:{" "}
          {bestDay
            ? `${dayjs(bestDay.date).format("DD/MM/YYYY")} (${bestDay.profit}€)`
            : "—"}
        </p>

        <p>
          Peor día:{" "}
          {worstDay
            ? `${dayjs(worstDay.date).format("DD/MM/YYYY")} (${worstDay.profit}€)`
            : "—"}
        </p>
      </div>
    </div>
  );
}
