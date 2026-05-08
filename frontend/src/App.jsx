import { useState } from "react";
import BuscarReferencias from "./pages/vendedor/BuscarReferencias";
import CrearPedido from "./pages/vendedor/CrearPedido";
import MisPedidos from "./pages/vendedor/MisPedidos";

export default function App() {
  const [paginaActual, setPaginaActual] = useState("crear");

  const renderPagina = () => {
    switch (paginaActual) {
      case "buscar": return <BuscarReferencias />;
      case "crear": return <CrearPedido />;
      case "pedidos": return <MisPedidos />;
      default: return <CrearPedido />;
    }
  };

  const navItems = [
    { key: "crear", label: "Crear Pedido", icon: "🛒" },
    { key: "buscar", label: "Buscar Referencias", icon: "🔍" },
    { key: "pedidos", label: "Mis Pedidos", icon: "📋" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header con gradiente igual al compañero */}
      <header className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Badge superior */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-white uppercase tracking-widest">
              Módulo Vendedor
            </span>
          </div>

          {/* Título */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-black text-white leading-tight">
                Gestión de{" "}
                <span className="text-blue-300">Pedidos</span>
              </h1>
              <p className="text-blue-200 mt-2 text-sm max-w-md">
                Busca referencias existentes, crea pedidos y envíalos directamente a producción.
              </p>

              {/* Tabs de navegación */}
              <div className="flex gap-2 mt-5">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setPaginaActual(item.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                      paginaActual === item.key
                        ? "bg-white text-blue-800 border-white shadow-md"
                        : "bg-transparent text-blue-200 border-blue-500 hover:border-white hover:text-white"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats cards del header */}
            <div className="flex flex-col gap-2 min-w-44">
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl px-4 py-3 flex items-center gap-3 border border-white border-opacity-20">
                <span className="text-xl">🛒</span>
                <div>
                  <p className="text-white text-xs uppercase tracking-wide font-semibold">Módulo</p>
                  <p className="text-white font-black text-lg leading-tight">Vendedor</p>
                </div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl px-4 py-3 flex items-center gap-3 border border-white border-opacity-20">
                <span className="text-xl">📦</span>
                <div>
                  <p className="text-white text-xs uppercase tracking-wide font-semibold">Función</p>
                  <p className="text-white font-black text-lg leading-tight">Pedidos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderPagina()}
      </main>
    </div>
  );
}