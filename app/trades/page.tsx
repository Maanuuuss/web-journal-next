"use client";

import { useState } from "react";
import TradesTable from "../components/TradesTable";
import AddTradeModal from "../components/AddTradeModal";
import { useTrades } from "../hooks/useTrades";

export default function TradesPage() {
  const { trades, addTrade } = useTrades();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const filteredTrades =
    filter === "wins"
      ? trades.filter((t) => t.profit > 0)
      : filter === "losses"
      ? trades.filter((t) => t.profit < 0)
      : trades;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Trades</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-dark-accent text-black font-semibold rounded-md hover:bg-dark-accent/80 transition-all duration-200"
        >
          Añadir Trade
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-md border ${
            filter === "all"
              ? "bg-dark-accent text-black"
              : "bg-dark-bg text-white border-dark-accent"
          }`}
        >
          Todos
        </button>

        <button
          onClick={() => setFilter("wins")}
          className={`px-3 py-1 rounded-md border ${
            filter === "wins"
              ? "bg-green-400 text-black"
              : "bg-dark-bg text-white border-dark-accent"
          }`}
        >
          Ganadores
        </button>

        <button
          onClick={() => setFilter("losses")}
          className={`px-3 py-1 rounded-md border ${
            filter === "losses"
              ? "bg-red-400 text-black"
              : "bg-dark-bg text-white border-dark-accent"
          }`}
        >
          Perdedores
        </button>
      </div>

      {/* Tabla */}
      <TradesTable trades={filteredTrades} />

      {/* Modal */}
      {isModalOpen && (
        <AddTradeModal
          close={() => setIsModalOpen(false)}
          onSave={addTrade}
        />
      )}
    </div>
  );
}
