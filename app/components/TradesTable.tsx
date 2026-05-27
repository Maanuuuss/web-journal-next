"use client";

export default function TradesTable({ trades }: { trades: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-dark-bg border-b border-dark-accent">
            <th className="p-3 text-left">Fecha</th>
            <th className="p-3 text-left">Instrumento</th>
            <th className="p-3 text-left">Dirección</th>
            <th className="p-3 text-left">R</th>
            <th className="p-3 text-left">Resultado</th>
            <th className="p-3 text-left">ICT</th>
            <th className="p-3 text-left">Notas</th>
          </tr>
        </thead>

        <tbody>
          {trades.map((trade, i) => (
            <tr
              key={i}
              className="border-b border-dark-accent/30 hover:bg-dark-accent/10 transition-all duration-200"
            >
              <td className="p-3">{trade.date}</td>
              <td className="p-3">{trade.instrument}</td>
              <td className="p-3 capitalize">{trade.direction}</td>
              <td className="p-3">{trade.r}</td>

              <td
                className={`p-3 font-semibold ${
                  trade.profit > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {trade.profit}€
              </td>

              <td className="p-3 font-semibold">
                {trade.ict?.rating || "—"}
              </td>

              <td className="p-3">{trade.notes || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
