"use client";

import React, { useState } from "react";
import { useTradesContext, Trade } from "../context/TradesContext";

/* ---------------------------------------------------
   UTILIDADES DE CÁLCULO
--------------------------------------------------- */

function getInstrumentConfig(instrumentRaw: string) {
  const instrument = instrumentRaw.replace(/\s+/g, "").toUpperCase();

  switch (instrument) {
    case "EURUSD":
    case "BTCUSD":
      return { pipSize: 0.0001, pipValuePerLot: 10 };
    case "GBPJPY":
    case "USDJPY":
      return { pipSize: 0.01, pipValuePerLot: 9 };
    case "XAUUSD":
      return { pipSize: 0.1, pipValuePerLot: 1 };
    case "DE40":
    case "US500":
    case "NAS100":
      return { pipSize: 1, pipValuePerLot: 1 };
    default:
      return { pipSize: 0.0001, pipValuePerLot: 10 };
  }
}

function calculatePipsAndProfit(trade: {
  instrument: string;
  direction: "long" | "short";
  entry: number;
  exitPrice: number;
  lotSize: number;
}) {
  const { pipSize, pipValuePerLot } = getInstrumentConfig(trade.instrument);
  const directionSign = trade.direction === "long" ? 1 : -1;

  const rawPips = (trade.exitPrice - trade.entry) / pipSize;
  const pips = rawPips * directionSign;
  const profit = pips * pipValuePerLot * trade.lotSize;

  return { pips, profit };
}

/* ---------------------------------------------------
   PÁGINA PRINCIPAL
--------------------------------------------------- */

export default function TradesPage() {
  const { trades, addTrade, deleteTrade, setTrades } = useTradesContext();

  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "wins" | "losses">("all");

  const filteredTrades = trades.filter((t: Trade) => {
    if (filter === "wins") return (t.profit ?? 0) > 0;
    if (filter === "losses") return (t.profit ?? 0) < 0;
    return true;
  });

  const getWeekday = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-ES", { weekday: "long" });
  };

  const handleDelete = (index: number) => {
    const ok = window.confirm("¿Seguro que quieres eliminar este trade?");
    if (ok) deleteTrade(index);
  };

const handleUpdateTrade = (index: number, updated: Trade) => {
  const updatedTrades = trades.map((t, i) => (i === index ? updated : t));
  setTrades(updatedTrades);
};


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Trades</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-300 text-black font-semibold rounded-md hover:bg-blue-400 transition-all duration-200"
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

      {/* Lista de trades */}
      <div className="space-y-3">
        {filteredTrades.map((t: Trade, i: number) => {
          const weekday = getWeekday(t.date);
          const profit = t.profit ?? 0;
          const pips = t.pips2;

          return (
            <button
              key={i}
              onClick={() => setSelectedTrade(t)}
              className="w-full text-left p-4 border border-dark-accent rounded-lg bg-dark-bg/60 hover:border-blue-400 hover:bg-dark-bg/80 transition flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-400">
                  {t.date} — {weekday}
                </p>
                <p className="text-lg font-semibold">{t.instrument}</p>

                {typeof pips === "number" && !isNaN(pips) ? (
                  <p
                    className={`text-sm ${
                      pips > 0
                        ? "text-green-400"
                        : pips < 0
                        ? "text-red-400"
                        : "text-gray-300"
                    }`}
                  >
                    {pips > 0 ? "+" : ""}
                    {pips.toFixed(1)} pips
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">—</p>
                )}
              </div>

              <div className="text-right">
                {typeof profit === "number" && !isNaN(profit) ? (
                  <p
                    className={`text-lg font-bold ${
                      profit > 0
                        ? "text-green-400"
                        : profit < 0
                        ? "text-red-400"
                        : "text-gray-300"
                    }`}
                  >
                    {profit > 0 ? "+" : ""}
                    {profit.toFixed(2)}€
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">—</p>
                )}
              </div>
            </button>
          );
        })}

        {filteredTrades.length === 0 && (
          <p className="text-gray-400">No hay trades con este filtro.</p>
        )}
      </div>

      {/* Modal añadir trade */}
      {isAddModalOpen && (
        <AddTradeModal
          close={() => setIsAddModalOpen(false)}
          onSave={addTrade}
        />
      )}

      {/* Modal detalle */}
      {selectedTrade && (
        <TradeDetailModal
          trade={selectedTrade}
          trades={trades}
          onClose={() => setSelectedTrade(null)}
          onDelete={handleDelete}
          onUpdate={handleUpdateTrade}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------
   MODAL DETALLE (CON EDITAR)
--------------------------------------------------- */

function TradeDetailModal({
  trade,
  trades,
  onClose,
  onDelete,
  onUpdate,
}: {
  trade: Trade;
  trades: Trade[];
  onClose: () => void;
  onDelete: (index: number) => void;
  onUpdate: (index: number, updated: Trade) => void;
}) {
  const [editModalOpen, setEditModalOpen] = useState(false);

  const index = trades.indexOf(trade);
  const weekday = new Date(trade.date).toLocaleDateString("es-ES", {
    weekday: "long",
  });

  const { pipSize, pipValuePerLot } = getInstrumentConfig(trade.instrument);
  const directionSign = trade.direction === "long" ? 1 : -1;

  const computedPips =
    ((trade.exitPrice - trade.entry) / pipSize) * directionSign;
  const pips = typeof trade.pips2 === "number" ? trade.pips2 : computedPips;

  const computedProfit = pips * pipValuePerLot * (trade.lotSize || 1);
  const pnl =
    typeof trade.profit === "number" && !isNaN(trade.profit)
      ? trade.profit
      : computedProfit;

  const riskPerUnit = Math.abs(trade.entry - trade.stop);
  const rewardPerUnit = Math.abs(trade.target - trade.entry);
  const rr = riskPerUnit === 0 ? 0 : rewardPerUnit / riskPerUnit;

  const ddPips = (trade.entry - trade.stop) / pipSize;
  const ddMoney = ddPips * pipValuePerLot * (trade.lotSize || 1);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-dark-bg border border-dark-accent rounded-lg p-6 w-full max-w-xl space-y-4 relative">
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {trade.instrument} — {trade.date} ({weekday})
          </h2>
        </div>

        {/* Datos básicos */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p>
              <span className="text-gray-400">Dirección:</span> {trade.direction}
            </p>
            <p>
              <span className="text-gray-400">Setup:</span>{" "}
              {trade.setup2 || "—"}
            </p>
            <p>
              <span className="text-gray-400">Hora:</span>{" "}
              {trade.time2 || "—"}
            </p>
            <p>
              <span className="text-gray-400">Lotes:</span>{" "}
              {trade.lotSize ? trade.lotSize : "—"}
            </p>
          </div>
          <div>
            <p>
              <span className="text-gray-400">Entrada:</span> {trade.entry}
            </p>
            <p>
              <span className="text-gray-400">Stop Loss:</span> {trade.stop}
            </p>
            <p>
              <span className="text-gray-400">Take Profit:</span>{" "}
              {trade.target}
            </p>
            <p>
              <span className="text-gray-400">Salida:</span>{" "}
              {trade.exitPrice || "—"}
            </p>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-4 text-sm mt-2">
          <div className="p-3 rounded-md bg-dark-bg/80 border border-dark-accent/60">
            <p className="text-gray-400 text-xs">PNL (€)</p>
            <p
              className={`text-lg font-bold ${
                pnl > 0
                  ? "text-green-400"
                  : pnl < 0
                  ? "text-red-400"
                  : "text-gray-200"
              }`}
            >
              {pnl > 0 ? "+" : ""}
              {pnl.toFixed(2)}€
            </p>
          </div>
          <div className="p-3 rounded-md bg-dark-bg/80 border border-dark-accent/60">
            <p className="text-gray-400 text-xs">Pips</p>
            <p
              className={`text-lg font-bold ${
                pips > 0
                  ? "text-green-400"
                  : pips < 0
                  ? "text-red-400"
                  : "text-gray-200"
              }`}
            >
              {pips > 0 ? "+" : ""}
              {pips.toFixed(1)} pips
            </p>
          </div>
          <div className="p-3 rounded-md bg-dark-bg/80 border border-dark-accent/60">
            <p className="text-gray-400 text-xs">RR</p>
            <p className="text-lg font-bold">{rr.toFixed(2)} R</p>
          </div>
        </div>

        {/* Riesgo */}
        <div className="grid grid-cols-2 gap-4 text-sm mt-2">
          <div className="p-3 rounded-md bg-dark-bg/80 border border-dark-accent/60">
            <p className="text-gray-400 text-xs">Riesgo en pips</p>
            <p className="text-lg font-bold">{ddPips.toFixed(1)} pips</p>
          </div>
          <div className="p-3 rounded-md bg-dark-bg/80 border border-dark-accent/60">
            <p className="text-gray-400 text-xs">Riesgo en €</p>
            <p className="text-lg font-bold">{ddMoney.toFixed(2)}€</p>
          </div>
        </div>

        {/* Notas y emociones */}
        <div className="space-y-2 text-sm mt-2">
          <div>
            <p className="text-gray-400 text-xs">Notas</p>
            <p>{trade.notes2 || "—"}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Emociones</p>
            <p>{trade.emotions2 || "—"}</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-between items-center pt-4 gap-3">
          <button
            onClick={() => setEditModalOpen(true)}
            className="px-4 py-2 bg-blue-400 text-black rounded-md hover:bg-blue-500"
          >
            Editar
          </button>

          <button
            onClick={() => {
              onDelete(index);
              onClose();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Eliminar
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-dark-bg border border-dark-accent rounded-md hover:bg-dark-accent/40"
          >
            Cerrar
          </button>
        </div>

        {editModalOpen && (
          <EditTradeInlineModal
            trade={trade}
            onClose={() => setEditModalOpen(false)}
            onSave={(updated) => {
              onUpdate(index, updated);
              setEditModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   MODAL EDITAR INLINE
--------------------------------------------------- */

function EditTradeInlineModal({
  trade,
  onClose,
  onSave,
}: {
  trade: Trade;
  onClose: () => void;
  onSave: (t: Trade) => void;
}) {
  const [form, setForm] = useState({
    date: trade.date,
    time2: trade.time2 ?? "",
    instrument: trade.instrument,
    direction: trade.direction,
    entry: String(trade.entry ?? ""),
    stop: String(trade.stop ?? ""),
    target: String(trade.target ?? ""),
    exitPrice: String(trade.exitPrice ?? ""),
    lotSize: String(trade.lotSize ?? ""),
    setup2: trade.setup2 ?? "",
    emotions2: trade.emotions2 ?? "",
    notes2: trade.notes2 ?? "",
    profit: trade.profit !== undefined ? String(trade.profit) : "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const baseTrade = {
      instrument: form.instrument,
      direction: form.direction as "long" | "short",
      entry: parseFloat(form.entry),
      exitPrice: parseFloat(form.exitPrice),
      lotSize: parseFloat(form.lotSize),
    };

    const { pips, profit } = calculatePipsAndProfit(baseTrade);

    const updated: Trade = {
      date: form.date,
      time2: form.time2 || undefined,
      instrument: form.instrument,
      direction: form.direction as "long" | "short",
      entry: parseFloat(form.entry),
      stop: parseFloat(form.stop),
      target: parseFloat(form.target),
      exitPrice: parseFloat(form.exitPrice),
      lotSize: parseFloat(form.lotSize),
      profit: form.profit ? parseFloat(form.profit) : profit,
      pips2: pips,
      setup2: form.setup2 || undefined,
      emotions2: form.emotions2 || undefined,
      notes2: form.notes2 || undefined,
    };

    onSave(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-dark-bg border border-dark-accent p-6 rounded-lg w-full max-w-lg relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2">Editar Trade</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-gray-400 mb-1">Fecha</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />

            <label className="block text-gray-400 mt-3 mb-1">Hora</label>
            <input
              type="time"
              name="time2"
              value={form.time2}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />

            <label className="block text-gray-400 mt-3 mb-1">Instrumento</label>
            <input
              type="text"
              name="instrument"
              value={form.instrument}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />

            <label className="block text-gray-400 mt-3 mb-1">Dirección</label>
            <select
              name="direction"
              value={form.direction}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            >
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Entrada</label>
            <input
              type="number"
              name="entry"
              value={form.entry}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />

            <label className="block text-gray-400 mt-3 mb-1">Salida</label>
            <input
              type="number"
              name="exitPrice"
              value={form.exitPrice}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />

            <label className="block text-gray-400 mt-3 mb-1">Lotes</label>
            <input
              type="number"
              name="lotSize"
              value={form.lotSize}
              onChange={handleChange}
              step="0.01"
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />

            <label className="block text-gray-400 mt-3 mb-1">
              Ganancia/Pérdida (€)
            </label>
            <input
              type="number"
              name="profit"
              value={form.profit}
              onChange={handleChange}
              placeholder="Opcional (se calcula solo)"
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
          <div>
            <label className="block text-gray-400 mb-1">Stop Loss</label>
            <input
              type="number"
              name="stop"
              value={form.stop}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Take Profit</label>
            <input
              type="number"
              name="target"
              value={form.target}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
          <div>
            <label className="block text-gray-400 mb-1">Setup</label>
            <input
              type="text"
              name="setup2"
              value={form.setup2}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Emociones</label>
            <input
              type="text"
              name="emotions2"
              value={form.emotions2}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-400 mb-1">Notas</label>
          <textarea
            name="notes2"
            value={form.notes2}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-400 text-black rounded-md hover:bg-blue-500 font-semibold"
          >
            Guardar cambios
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-dark-bg border border-dark-accent rounded-md hover:bg-dark-accent/40 text-white"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   MODAL AÑADIR TRADE
--------------------------------------------------- */

function AddTradeModal({
  close,
  onSave,
}: {
  close: () => void;
  onSave: (t: Trade) => void;
}) {
  const [form, setForm] = useState({
    date: "",
    time2: "",
    instrument: "",
    direction: "long",
    entry: "",
    stop: "",
    target: "",
    exitPrice: "",
    lotSize: "",
    profit: "",
    setup2: "",
    emotions2: "",
    notes2: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (
      !form.date ||
      !form.instrument ||
      !form.entry ||
      !form.exitPrice ||
      !form.lotSize
    ) {
      alert(
        "Por favor completa los campos obligatorios: fecha, instrumento, entrada, salida y lotes."
      );
      return;
    }

    const baseTrade = {
      instrument: form.instrument,
      direction: form.direction as "long" | "short",
      entry: parseFloat(form.entry),
      exitPrice: parseFloat(form.exitPrice),
      lotSize: parseFloat(form.lotSize),
    };

    const { pips, profit: autoProfit } = calculatePipsAndProfit(baseTrade);

    const trade: Trade = {
      date: form.date,
      time2: form.time2 || undefined,
      instrument: form.instrument,
      direction: form.direction as "long" | "short",
      entry: parseFloat(form.entry),
      stop: form.stop ? parseFloat(form.stop) : 0,
      target: form.target ? parseFloat(form.target) : 0,
      exitPrice: parseFloat(form.exitPrice),
      lotSize: parseFloat(form.lotSize),
      profit: form.profit ? parseFloat(form.profit) : autoProfit,
      pips2: pips,
      setup2: form.setup2 || undefined,
      emotions2: form.emotions2 || undefined,
      notes2: form.notes2 || undefined,
    };

    onSave(trade);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-dark-bg border border-dark-accent p-6 rounded-lg w-full max-w-lg relative space-y-4">
        <button
          onClick={close}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2">Añadir nuevo trade</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-gray-400 mb-1">Fecha *</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />

            <label className="block text-gray-400 mt-3 mb-1">Hora</label>
            <input
              type="time"
              name="time2"
              value={form.time2}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />

            <label className="block text-gray-400 mt-3 mb-1">
              Instrumento *
            </label>
            <input
              type="text"
              name="instrument"
              value={form.instrument}
              onChange={handleChange}
              placeholder="Ej: EURUSD, XAUUSD..."
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />

            <label className="block text-gray-400 mt-3 mb-1">Dirección</label>
            <select
              name="direction"
              value={form.direction}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            >
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Entrada *</label>
            <input
              type="number"
              name="entry"
              value={form.entry}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />

            <label className="block text-gray-400 mt-3 mb-1">Salida *</label>
            <input
              type="number"
              name="exitPrice"
              value={form.exitPrice}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />

            <label className="block text-gray-400 mt-3 mb-1">Lotes *</label>
            <input
              type="number"
              name="lotSize"
              value={form.lotSize}
              onChange={handleChange}
              step="0.01"
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />

            <label className="block text-gray-400 mt-3 mb-1">
              Ganancia/Pérdida (€)
            </label>
            <input
              type="number"
              name="profit"
              value={form.profit}
              onChange={handleChange}
              placeholder="Opcional (se calcula solo)"
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
          <div>
            <label className="block text-gray-400 mb-1">Stop Loss</label>
            <input
              type="number"
              name="stop"
              value={form.stop}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Take Profit</label>
            <input
              type="number"
              name="target"
              value={form.target}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
          <div>
            <label className="block text-gray-400 mb-1">Setup</label>
            <input
              type="text"
              name="setup2"
              value={form.setup2}
              onChange={handleChange}
              placeholder="Ej: FVG, Breaker..."
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Emociones</label>
            <input
              type="text"
              name="emotions2"
              value={form.emotions2}
              onChange={handleChange}
              placeholder="Ej: Confianza, Duda..."
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-400 mb-1">Notas</label>
          <textarea
            name="notes2"
            value={form.notes2}
            onChange={handleChange}
            rows={3}
            placeholder="Detalles de la operación..."
            className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-400 text-black rounded-md hover:bg-blue-500 font-semibold"
          >
            Guardar Trade
          </button>

          <button
            onClick={close}
            className="px-4 py-2 bg-dark-bg border border-dark-accent rounded-md hover:bg-dark-accent/40 text-white"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
