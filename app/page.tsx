"use client";

import { useState } from "react";
import { supabase } from "./lib/supabaseClient"




export default function Home() {
  const [activo, setActivo] = useState("");
  const [tipo, setTipo] = useState("long");
  const [entrada, setEntrada] = useState("");
  const [salida, setSalida] = useState("");
  const [resultado, setResultado] = useState("");
  const [notas, setNotas] = useState("");
  const [mensaje, setMensaje] = useState("");

  const guardarTrade = async (e: any) => {
    e.preventDefault();

    const { error } = await supabase.from("trades").insert([
      {
        activo,
        tipo,
        precio_entrada: Number(entrada),
        precio_salida: salida ? Number(salida) : null,
        resultado: resultado ? Number(resultado) : null,
        notas,
      },
    ]);

    if (error) {
      setMensaje("❌ Error guardando el trade");
      console.log(error);
    } else {
      setMensaje("✅ Trade guardado correctamente");
      setActivo("");
      setEntrada("");
      setSalida("");
      setResultado("");
      setNotas("");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">📈 Registrar Trade</h1>

      <form
        onSubmit={guardarTrade}
        className="flex flex-col gap-4 bg-slate-800 p-6 rounded-lg w-full max-w-md"
      >
        <input
          className="p-2 rounded text-black"
          placeholder="Activo (BTCUSD, EURUSD...)"
          value={activo}
          onChange={(e) => setActivo(e.target.value)}
          required
        />

        <select
          className="p-2 rounded text-black"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>

        <input
          className="p-2 rounded text-black"
          placeholder="Precio de entrada"
          type="number"
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          required
        />

        <input
          className="p-2 rounded text-black"
          placeholder="Precio de salida"
          type="number"
          value={salida}
          onChange={(e) => setSalida(e.target.value)}
        />

        <input
          className="p-2 rounded text-black"
          placeholder="Resultado"
          type="number"
          value={resultado}
          onChange={(e) => setResultado(e.target.value)}
        />

        <textarea
          className="p-2 rounded text-black"
          placeholder="Notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 rounded"
        >
          Guardar Trade
        </button>
      </form>

      {mensaje && <p className="mt-4">{mensaje}</p>}
    </main>
  );
}
