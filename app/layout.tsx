import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-dark-bg text-dark-text min-h-screen">
        <div className="flex flex-col md:flex-row min-h-screen">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 bg-dark-bg border-r border-dark-accent p-6">
            <h1 className="text-2xl font-bold mb-6">Journal</h1>

            <nav className="flex flex-col gap-3">
              <a href="/dashboard" className="hover:text-dark-accent">Dashboard</a>
              <a href="/trades" className="hover:text-dark-accent">Trades</a>
              <a href="/stats" className="hover:text-dark-accent">Estadísticas</a>
              <a href="/settings" className="hover:text-dark-accent">Configuración</a>

              {/* 🔥 Nuevo enlace al Dashboard ICT */}
              <a href="/ict-dashboard" className="hover:text-dark-accent">
                Dashboard ICT
              </a>
            </nav>
          </aside>

          {/* Contenido principal */}
          <main className="flex-1 p-8">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}
