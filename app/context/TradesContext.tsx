"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface Trade {
  date: string;
  time2?: string;
  instrument: string;
  direction: "long" | "short";
  entry: number;
  stop: number;
  target: number;
  exitPrice: number;
  lotSize: number;
  profit?: number;
  pips2?: number;
  setup2?: string;
  emotions2?: string;
  notes2?: string;
}

interface TradesContextType {
  trades: Trade[];
  addTrade: (t: Trade) => void;
  deleteTrade: (index: number) => void;
  setTrades: (t: Trade[]) => void;
}

const TradesContext = createContext<TradesContextType | undefined>(undefined);

export const TradesProvider = ({ children }: { children: React.ReactNode }) => {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("trades");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setTrades(parsed);
      } catch {
        console.error("Error parsing trades from localStorage");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("trades", JSON.stringify(trades));
  }, [trades]);

  const addTrade = (t: Trade) => {
    setTrades((prev) => [...prev, t]);
  };

  const deleteTrade = (index: number) => {
    setTrades((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <TradesContext.Provider
      value={{
        trades,
        addTrade,
        deleteTrade,
        setTrades,
      }}
    >
      {children}
    </TradesContext.Provider>
  );
};

export const useTradesContext = () => {
  const ctx = useContext(TradesContext);
  if (!ctx) {
    throw new Error("useTradesContext must be used within TradesProvider");
  }
  return ctx;
};
