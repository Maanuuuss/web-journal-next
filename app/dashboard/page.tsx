export default function Dashboard() {
  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Tarjetas del dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="p-6 rounded-lg bg-dark-bg border border-dark-accent">
          <h2 className="text-xl font-semibold mb-2">Winrate</h2>
          <p className="text-4xl font-bold text-dark-accent">0%</p>
        </div>

        <div className="p-6 rounded-lg bg-dark-bg border border-dark-accent">
          <h2 className="text-xl font-semibold mb-2">Rendimiento</h2>
          <p className="text-4xl font-bold text-green-400">0€</p>
        </div>

        <div className="p-6 rounded-lg bg-dark-bg border border-dark-accent">
          <h2 className="text-xl font-semibold mb-2">Mejor día</h2>
          <p className="text-4xl font-bold text-blue-400">—</p>
        </div>

      </div>

    </div>
  );
}
