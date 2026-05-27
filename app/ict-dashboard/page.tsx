"use client";

import { useTrades } from "../hooks/useTrades";
import ICTChart from "../components/ICTChart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ICTDashboard() {
  const { trades } = useTrades();

  const ratingData = buildRatingData(trades);
  const sessionData = buildSessionData(trades);
  const fvgData = buildFVGData(trades);

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Dashboard ICT Avanzado</h1>

      {/* Resumen global */}
      <section className="bg-dark-bg border border-dark-accent p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Resumen global ICT</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total FVG detectados" value={countFVG(trades)} />
          <StatCard title="Total BOS/CHoCH" value={countStructure(trades)} />
          <StatCard title="Trades en sesión óptima" value={countOptimalSessions(trades)} />
          <StatCard title="Trades en Premium (mal)" value={countBadPremium(trades)} />
          <StatCard title="Trades en Discount (bien)" value={countGoodDiscount(trades)} />
          <StatCard title="Rating promedio" value={averageRating(trades)} />
        </div>
      </section>

      {/* Últimos trades */}
      <section className="bg-dark-bg border border-dark-accent p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Últimos trades analizados</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trades.slice(-6).reverse().map((t, i) => (
            <div
              key={i}
              className="p-4 border border-dark-accent rounded-lg bg-dark-bg/60"
            >
              <h3 className="text-xl font-semibold mb-2">
                {t.instrument} — {t.date}
              </h3>

              <div className="space-y-1 text-sm">
                <p><strong>Sesión:</strong> {t.ict?.session}</p>
                <p><strong>Modelo:</strong> {t.ict?.model}</p>
                <p><strong>Premium/Discount:</strong> {t.ict?.premiumDiscount}</p>
                <p><strong>Liquidez:</strong> {t.ict?.liquidity}</p>
                <p><strong>FVG detectados:</strong> {t.ict?.fvg?.length || 0}</p>
                <p><strong>Estructura:</strong> {t.ict?.structure?.join(", ")}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gráfico ICT del último trade */}
      <section className="bg-dark-bg border border-dark-accent p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Mapa ICT del último trade</h2>

        {trades.length > 0 ? (
          <ICTChart
            candles={trades[trades.length - 1].ict.candles}
            ict={trades[trades.length - 1].ict}
          />
        ) : (
          <p>No hay trades aún.</p>
        )}
      </section>

      {/* Gráficos ICT */}
      <section className="bg-dark-bg border border-dark-accent p-6 rounded-lg space-y-8">
        <h2 className="text-2xl font-semibold mb-4">Visualización ICT</h2>

        <ChartBlock title="Rating por trade">
          <BarChart data={ratingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="index" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="score" fill="#4ade80" />
          </BarChart>
        </ChartBlock>

        <ChartBlock title="Trades por sesión">
          <BarChart data={sessionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="session" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" fill="#60a5fa" />
          </BarChart>
        </ChartBlock>

        <ChartBlock title="FVG por instrumento">
          <BarChart data={fvgData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="instrument" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="fvgCount" fill="#f97316" />
          </BarChart>
        </ChartBlock>
      </section>
    </div>
  );
}

function ChartBlock({ title, children }: any) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "#1a1a1a",
  border: "1px solid #333",
  color: "#fff",
};

function StatCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="p-6 rounded-lg bg-dark-bg border border-dark-accent">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold text-dark-accent">{value}</p>
    </div>
  );
}

// ----------------------
// Funciones de resumen
// ----------------------

function countFVG(trades: any[]) {
  return trades.reduce((acc, t) => acc + (t.ict?.fvg?.length || 0), 0);
}

function countStructure(trades: any[]) {
  return trades.reduce((acc, t) => acc + (t.ict?.structure?.length || 0), 0);
}

function countOptimalSessions(trades: any[]) {
  return trades.filter(
    (t) =>
      t.ict?.session === "London Open" ||
      t.ict?.session === "NY Open"
  ).length;
}

function countBadPremium(trades: any[]) {
  return trades.filter((t) =>
    t.ict?.premiumDiscount?.includes("malo")
  ).length;
}

function countGoodDiscount(trades: any[]) {
  return trades.filter((t) =>
    t.ict?.premiumDiscount === "Discount"
  ).length;
}

function averageRating(trades: any[]) {
  const map = { "A+": 4, A: 3, B: 2, C: 1 } as const;

  const values = trades.map((t) => {
    const rating = t.ict?.rating as keyof typeof map | undefined;
    return rating ? Number(map[rating]) : 0;
  });

  if (values.length === 0) return "—";

  const avg = values.reduce((a, b) => Number(a) + Number(b), 0) / values.length;

  if (avg >= 3.5) return "A+";
  if (avg >= 2.5) return "A";
  if (avg >= 1.5) return "B";
  return "C";
}

// ----------------------
// Datos para gráficos
// ----------------------

function buildRatingData(trades: any[]) {
  const map = { "A+": 4, A: 3, B: 2, C: 1 } as const;

  return trades.map((t, index) => {
    const rating = t.ict?.rating as keyof typeof map | undefined;
    return {
      index: index + 1,
      score: rating ? Number(map[rating]) : 0,
    };
  });
}

function buildSessionData(trades: any[]) {
  const counts: Record<string, number> = {};

  trades.forEach((t) => {
    const s = t.ict?.session || "Desconocida";
    counts[s] = (counts[s] || 0) + 1;
  });

  return Object.keys(counts).map((session) => ({
    session,
    count: counts[session],
  }));
}

function buildFVGData(trades: any[]) {
  const map: Record<string, number> = {};

  trades.forEach((t) => {
    const inst = t.instrument || "Desconocido";
    const fvgCount = t.ict?.fvg?.length || 0;
    map[inst] = (map[inst] || 0) + fvgCount;
  });

  return Object.keys(map).map((instrument) => ({
    instrument,
    fvgCount: map[instrument],
  }));
}
