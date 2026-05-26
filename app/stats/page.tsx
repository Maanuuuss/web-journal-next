"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function StatsPage() {
  // Equity curve (balance acumulado)
  const equityData = [
    { day: "Lun", balance: 1000 },
    { day: "Mar", balance: 950 },
    { day: "Mié", balance: 1150 },
    { day: "Jue", balance: 1120 },
    { day: "Vie", balance: 1300 },
  ];

  // Winrate por día
  const winrateData = [
    { day: "Lun", wins: 3, losses: 1 },
    { day: "Mar", wins: 1, losses: 3 },
    { day: "Mié", wins: 4, losses: 0 },
    { day: "Jue", wins: 2, losses: 2 },
    { day: "Vie", wins: 3, losses: 1 },
  ];

  // Profit factor por día
  const profitFactorData = [
    { day: "Lun", pf: 1.5 },
    { day: "Mar", pf: 0.7 },
    { day: "Mié", pf: 2.8 },
    { day: "Jue", pf: 1.1 },
    { day: "Vie", pf: 2.2 },
  ];

  // Drawdown diario
  const drawdownData = [
    { day: "Lun", dd: 0 },
    { day: "Mar", dd: -5 },
    { day: "Mié", dd: -2 },
    { day: "Jue", dd: -8 },
    { day: "Vie", dd: -3 },
  ];

  // Volumen por sesión
  const volumeData = [
    { session: "Asia", volume: 120 },
    { session: "Londres", volume: 300 },
    { session: "NY", volume: 450 },
  ];

  return (
    <div className="p-8 text-dark-text">
      <h1 className="text-3xl font-bold mb-6">Estadísticas</h1>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Equity Curve */}
        <div className="bg-dark-bg border border-dark-accent p-4 rounded-lg h-80">
          <h2 className="text-xl mb-2">Equity Curve</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={equityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line type="monotone" dataKey="balance" stroke="#6d28d9" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Winrate */}
        <div className="bg-dark-bg border border-dark-accent p-4 rounded-lg h-80">
          <h2 className="text-xl mb-2">Winrate</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={winrateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Legend />
              <Bar dataKey="wins" fill="#22c55e" />
              <Bar dataKey="losses" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profit Factor */}
        <div className="bg-dark-bg border border-dark-accent p-4 rounded-lg h-80">
          <h2 className="text-xl mb-2">Profit Factor</h2>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={profitFactorData}>
              <defs>
                <linearGradient id="pfColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6d28d9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6d28d9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Area type="monotone" dataKey="pf" stroke="#6d28d9" fill="url(#pfColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Drawdown */}
        <div className="bg-dark-bg border border-dark-accent p-4 rounded-lg h-80">
          <h2 className="text-xl mb-2">Drawdown</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={drawdownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line type="monotone" dataKey="dd" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Volumen por sesión */}
        <div className="bg-dark-bg border border-dark-accent p-4 rounded-lg h-80 md:col-span-2">
          <h2 className="text-xl mb-2">Volumen por sesión</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="session" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Bar dataKey="volume" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
