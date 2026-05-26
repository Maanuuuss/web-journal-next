export default function TradesPage() {
  return (
    <div className="space-y-8">

      {/* Título + botón */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trades</h1>
        <button className="px-4 py-2 bg-dark-accent text-dark-bg font-semibold rounded hover:opacity-80">
          Nuevo trade
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border border-dark-accent rounded-lg">
          <thead className="bg-dark-bg border-b border-dark-accent">
            <tr>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Par</th>
              <th className="p-3 text-left">Dirección</th>
              <th className="p-3 text-left">Resultado</th>
              <th className="p-3 text-left">Riesgo</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b border-dark-accent/40">
              <td className="p-3">—</td>
              <td className="p-3">—</td>
              <td className="p-3">—</td>
              <td className="p-3 text-green-400">—</td>
              <td className="p-3">—</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
