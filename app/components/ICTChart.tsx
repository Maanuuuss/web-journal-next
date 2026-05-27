"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Line,
  ReferenceArea,
} from "recharts";

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface FVG {
  type: string;   // "bullish" | "bearish"
  index: number;  // índice de la vela donde empieza el FVG
  gap: number[];  // [low, high] o similar
}

interface ICTData {
  fvg: FVG[];
  structure: string[];
  liquidity: string;
  premiumDiscount: string;
  session: string;
  candles?: Candle[];
}

export default function ICTChart({
  candles,
  ict,
}: {
  candles: Candle[];
  ict: ICTData;
}) {
  if (!candles || candles.length === 0) {
    return (
      <div className="p-6 border border-dark-accent rounded-lg bg-dark-bg/60">
        No hay velas disponibles para este trade.
      </div>
    );
  }

  // Añadimos un índice para poder usarlo en el eje X y en las zonas
  const data = candles.map((c, i) => ({
    ...c,
    index: i,
  }));

  // Línea del 50% (Premium / Discount)
  const high = Math.max(...candles.map((c) => c.high));
  const low = Math.min(...candles.map((c) => c.low));
  const mid = (high + low) / 2;

  return (
    <div className="p-6 border border-dark-accent rounded-lg bg-dark-bg/60">
      <h3 className="text-xl font-semibold mb-4">Mapa ICT del Trade</h3>

      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            {/* Eje X por índice (oculto) */}
            <XAxis dataKey="index" hide />

            {/* Eje Y */}
            <YAxis domain={["auto", "auto"]} stroke="#aaa" />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                color: "#fff",
              }}
              labelFormatter={(value: any) => {
                const idx = Number(value);
                const candle = data[idx];
                return candle?.time || "";
              }}
            />

            {/* Área del precio (close) */}
            <Area
              type="monotone"
              dataKey="close"
              stroke="#4ade80"
              fill="#4ade8033"
            />

            {/* Línea Premium/Discount */}
            <Line
              type="monotone"
              dataKey={() => mid}
              stroke="#f97316"
              strokeDasharray="4 4"
              dot={false}
            />

            {/* FVG dibujados como zonas */}
            {ict.fvg?.map((fvg, i) => (
              <ReferenceArea
                key={i}
                x1={fvg.index}
                x2={fvg.index + 1}
                y1={low}
                y2={high}
                fill={fvg.type === "bullish" ? "#22c55e33" : "#ef444433"}
                stroke={fvg.type === "bullish" ? "#22c55e" : "#ef4444"}
                strokeOpacity={0.6}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Info ICT */}
      <div className="mt-4 space-y-1 text-sm">
        <p><strong>Sesión:</strong> {ict.session}</p>
        <p><strong>Liquidez:</strong> {ict.liquidity}</p>
        <p><strong>Premium/Discount:</strong> {ict.premiumDiscount}</p>
        <p><strong>Estructura:</strong> {ict.structure?.join(", ")}</p>
        <p><strong>FVG detectados:</strong> {ict.fvg?.length}</p>
      </div>
    </div>
  );
}
