import { useState, useEffect } from "react";
import { buscarReferencias } from "../../api/referenciasApi";

export default function BuscarReferencias({ onAgregarAlPedido }) {
  const [filtros, setFiltros] = useState({
    busqueda: "",
    tipo_producto: "",
    materia_prima: "",
    ancho: "",
    sellado: "",
  });
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [agregados, setAgregados] = useState([]);

  // ✅ Cargar todas las referencias al entrar a la pantalla
  useEffect(() => {
    const cargarTodas = async () => {
      try {
        setCargando(true);
        const data = await buscarReferencias({
          busqueda: "",
          tipo_producto: "",
          materia_prima: "",
          ancho: "",
          sellado: "",
        });
        setResultados(data);
      } catch {
        setError("Error al cargar referencias.");
      } finally {
        setCargando(false);
      }
    };
    cargarTodas();
  }, []);

  const handleBuscar = async () => {
    try {
      setCargando(true);
      setError("");
      const data = await buscarReferencias(filtros);
      setResultados(data);
      if (data.length === 0) setError("No se encontraron referencias con esos filtros.");
    } catch {
      setError("Error al buscar referencias.");
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleAgregar = (ref) => {
    if (onAgregarAlPedido) {
      onAgregarAlPedido(ref);
      setAgregados([...agregados, ref.id]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleBuscar();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🔍 Buscar Referencias</h2>
        <p className="text-gray-500 mt-1">Busca referencias existentes para agregar al pedido</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Filtros de búsqueda</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Código, nombre o descripción</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="busqueda"
              placeholder="Buscar..."
              value={filtros.busqueda}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de producto</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="tipo_producto"
              placeholder="Ej: B-Bolsa"
              value={filtros.tipo_producto}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Materia prima</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="materia_prima"
              placeholder="Ej: Polietileno"
              value={filtros.materia_prima}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ancho</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="ancho"
              placeholder="Ej: 10"
              value={filtros.ancho}
              onChange={handleChange}
              type="number"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Sellado</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="sellado"
              placeholder="Ej: F-Sellado Fondo"
              value={filtros.sellado}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleBuscar}
              disabled={cargando}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 cursor-pointer"
            >
              {cargando ? "🔄 Buscando..." : "🔍 Buscar"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* ✅ Tabla siempre visible */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">
            {cargando ? "Cargando..." : `Referencias disponibles (${resultados.length})`}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Referencia", "Nombre", "Tipo", "Materia Prima", "Ancho", "Sellado", "Valor Unit.", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cargando ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                    🔄 Cargando referencias...
                  </td>
                </tr>
              ) : resultados.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                    No hay referencias disponibles.
                  </td>
                </tr>
              ) : (
                resultados.map((ref) => (
                  <tr key={ref.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-blue-700">{ref.referencia_corta}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{ref.nombre}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                        {ref.tipo_producto}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{ref.materia_prima}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{ref.ancho}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{ref.sellado}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-700">${ref.valor_unitario}</td>
                    <td className="px-4 py-3">
                      {onAgregarAlPedido && (
                        <button
                          onClick={() => handleAgregar(ref)}
                          disabled={agregados.includes(ref.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            agregados.includes(ref.id)
                              ? "bg-green-100 text-green-700 cursor-default"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                        >
                          {agregados.includes(ref.id) ? "✓ Agregado" : "+ Agregar"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}