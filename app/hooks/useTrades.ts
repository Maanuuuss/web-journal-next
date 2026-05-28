"use client";

import { useEffect, useState } from "react";
import { analyzeICT } from "../utils/ictAnalyzer";
import { getOHLC } from "../utils/getOHLC";

export function useTrades() {
  const [trades, setTrades] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Cargar trades desde localStorage solo en cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("trades");
      if (saved) setTrades(JSON.parse(saved));
      setLoaded(true);
    }
  }, []);

  // Guardar trades en localStorage cuando cambian
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("trades", JSON.stringify(trades));
    }
  }, [trades, loaded]);

  // Añadir trade con análisis ICT real
  const addTrade = async (trade: any) => {
    const candles = await getOHLC(trade.instrument, trade.date);
    const ict: any = analyzeICT(trade, candles);
    ict.candles = candles;

    setTrades((prev) => [...prev, { ...trade, ict }]);
  };

  // 🔥 Eliminar trade por índice
  const deleteTrade = (index: number) => {
    setTrades((prev) => prev.filter((_, i) => i !== index));
  };

  return { trades, addTrade, deleteTrade };
}
