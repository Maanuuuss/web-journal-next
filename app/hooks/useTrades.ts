"use client";

import { useEffect, useState } from "react";
import { analyzeICT } from "../utils/ictAnalyzer";
import { getOHLC } from "../utils/getOHLC";

export function useTrades() {
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("trades");
    if (saved) setTrades(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("trades", JSON.stringify(trades));
  }, [trades]);

  const addTrade = async (trade: any) => {
    const candles = await getOHLC(trade.instrument, trade.date);

    const ict: any = analyzeICT(trade, candles);
    ict.candles = candles;

    setTrades((prev) => [...prev, { ...trade, ict }]);
  };

  return { trades, addTrade };
}
