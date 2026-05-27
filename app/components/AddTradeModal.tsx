"use client";

import { useState } from "react";

export default function AddTradeModal({
  close,
  onSave,
}: {
  close: () => void;
  onSave: (trade: any) => void;
}) {
  const [form, setForm] = useState({
    date: "",
    time: "",
    instrument: "",
    direction: "long",
    entry: "",
    stop: "",
    target: "",
    r: "",
    profit: "",
    notes: "",
  });

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validar y guardar el trade
  const saveTrade = () => {
    // Validación de campos obligatorios
    if (!form.date || !form.instrument || !form.entry) {
      alert("Completa los campos obligatorios (fecha, instrumento y precio de entrada).");
      return;
    }

    // Convertir valores numéricos
    const trade = {
      ...form,
      entry: parseFloat(form.entry),
      stop: parseFloat(form.stop),
      target: parseFloat(form.target),
      r: parseFloat(form.r),
      profit: parseFloat(form.profit),
    };

    // Validar formato de fecha (ISO)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(form.date)) {
      alert("Usa el formato de fecha correcto: YYYY-MM-DD (por ejemplo, 2026-05-27).");
      return;
    }

    // Enviar trade al hook principal
    onSave(trade);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-dark-bg border border-dark-accent p-6 rounded-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold">Añadir Trade</h2>

        {/* Fecha y hora */}
        <div className="flex gap-3">
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="input flex-1"
          />
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="input flex-1"
          />
        </div>

        {/* Instrumento */}
        <input
          type="text"
          name="instrument"
          placeholder="Instrumento (ej. EUR/USD)"
          value={form.instrument}
          onChange={handleChange}
          className="input w-full"
        />

        {/* Dirección */}
        <select
          name="direction"
          value={form.direction}
          onChange={handleChange}
          className="input w-full"
        >
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>

        {/* Precios */}
        <input
          type="number"
          name="entry"
          placeholder="Precio de entrada"
          value={form.entry}
          onChange={handleChange}
          className="input w-full"
        />
        <input
          type="number"
          name="stop"
          placeholder="Stop Loss"
          value={form.stop}
          onChange={handleChange}
          className="input w-full"
        />
        <input
          type="number"
          name="target"
          placeholder="Take Profit"
          value={form.target}
          onChange={handleChange}
          className="input w-full"
        />

        {/* R y resultado */}
        <div className="flex gap-3">
          <input
            type="number"
            name="r"
            placeholder="R"
            value={form.r}
            onChange={handleChange}
            className="input flex-1"
          />
          <input
            type="number"
            name="profit"
            placeholder="Resultado (€)"
            value={form.profit}
            onChange={handleChange}
            className="input flex-1"
          />
        </div>

        {/* Notas */}
        <textarea
          name="notes"
          placeholder="Notas (opcional)"
          value={form.notes}
          onChange={handleChange}
          className="input w-full"
        />

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <button
            onClick={close}
            className="px-4 py-2 bg-dark-bg border border-dark-accent rounded-md"
          >
            Cancelar
          </button>

          <button
            onClick={saveTrade}
            className="px-4 py-2 bg-dark-accent text-black font-semibold rounded-md"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
