"use client";

import React, { useState } from "react";
import { calculatePipsAndProfit } from "../utils/tradeCalculations";
import { Trade } from "../types/Trade";

interface EditTradeModalProps {
  trade: Trade;
  onSave: (updatedTrade: Trade) => void;
  onClose: () => void;
}

export default function EditTradeModal({ trade, onSave, onClose }: EditTradeModalProps) {
  const [form, setForm] = useState<Trade>({ ...trade });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const baseTrade = {
      instrument: form.instrument,
      direction: form.direction,
      entry: parseFloat(form.entry.toString()),
      exitPrice: parseFloat(form.exitPrice.toString()),
      lotSize: parseFloat(form.lotSize.toString()),
    };

    const { pips, profit } = calculatePipsAndProfit(baseTrade);

    const updatedTrade: Trade = {
      ...form,
      pips2: pips,
      profit,
    };

    onSave(updatedTrade);
    onClose();
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

            <label className="block text-gray-400 mt-3 mb-1">Entrada</label>
            <input
              type="number"
              name="entry"
              value={form.entry}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Salida</label>
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

            <label className="block text-gray-400 mt-3 mb-1">Stop Loss</label>
            <input
              type="number"
              name="stop"
              value={form.stop}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-dark-bg border border-dark-accent text-white"
            />

            <label className="block text-gray-400 mt-3 mb-1">Take Profit</label>
            <input
              type="number"
              name="target"
              value={form.target}
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
            Guardar Cambios
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
