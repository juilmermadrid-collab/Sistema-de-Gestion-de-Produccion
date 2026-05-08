import { useState, useEffect } from "react";
import { listarPedidos } from "../../api/pedidosApi";

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [pedidoAbierto, setPedidoAbierto] = useState(null);

  useEffect(() => { cargarPedidos(); }, []);

  const cargarPedidos = async () => {
    try {
      setCargando(true);
      const data = await listarPedidos();
      setPedidos(data);
    } catch {
      setError("Error al cargar los pedidos.");
    } finally {
      setCargando(false);
    }
  };

  const toggleDetalle = (id) => setPedidoAbierto(pedidoAbierto === id ? null : id);

  if (cargando) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-5xl mb-3">⏳</div>
        <p className="text-gray-500">Cargando pedidos...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">⚠️ {error}</div>
  );

  const enProduccion = pedidos.filter(p => p.estado_pedido === "en_produccion").length;
  const finalizados = pedidos.filter(p => p.estado_pedido === "finalizado").length;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Pedidos", valor: pedidos.length, icon: "📋", color: "from-blue-800 to-blue-700" },
          { label: "En Producción", valor: enProduccion, icon: "🔄", color: "from-orange-600 to-orange-500" },
          { label: "Finalizados", valor: finalizados, icon: "✅", color: "from-green-700 to-green-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={`bg-gradient-to-r ${stat.color} px-5 py-4 flex items-center gap-3`}>
              <div className="bg-white bg-opacity-20 rounded-lg p-2">
                <span className="text-xl">{stat.icon}</span>
              </div>
              <div>
                <p className="text-white text-opacity-80 text-xs uppercase tracking-wide font-semibold">{stat.label}</p>
                <p className="text-white font-black text-3xl leading-tight">{stat.valor}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-800 to-blue-700 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <span className="text-lg">📋</span>
            </div>
            <div>
              <p className="text-xs text-blue-200 uppercase tracking-wide font-semibold">Historial</p>
              <p className="text-white font-bold">Pedidos enviados a producción</p>
            </div>
          </div>
          <button
            onClick={cargarPedidos}
            className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-2 px-4 rounded-xl transition-all cursor-pointer text-sm border border-white border-opacity-30"
          >
            🔄 Recargar
          </button>
        </div>

        {pedidos.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg font-medium">No hay pedidos registrados aún</p>
            <p className="text-gray-400 text-sm mt-1">Crea tu primer pedido desde la pestaña "Crear Pedido"</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pedidos.map((pedido) => (
              <div key={pedido.id}>
                {/* Fila pedido */}
                <div className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 rounded-xl p-2.5">
                      <span className="text-xl">🧾</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{pedido.numero_pedido}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        📅 Tomado: <span className="font-medium">{pedido.fecha_toma}</span>
                        &nbsp;·&nbsp;
                        🚚 Entrega: <span className="font-medium">{pedido.fecha_entrega_pactada}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      pedido.estado_pedido === "finalizado"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}>
                      {pedido.estado_pedido === "en_produccion" ? "🔄 En producción" : "✅ Finalizado"}
                    </span>
                    <div className="text-right min-w-20">
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="font-black text-green-700">${Number(pedido.total_pedido).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => toggleDetalle(pedido.id)}
                      className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-blue-200"
                    >
                      {pedidoAbierto === pedido.id ? "▲ Ocultar" : "▼ Ver items"}
                    </button>
                  </div>
                </div>

                {/* Detalle items */}
                {pedidoAbierto === pedido.id && pedido.pedido_items && (
                  <div className="bg-gray-50 border-t border-gray-100">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            {["Referencia", "Nombre", "Cantidad", "Valor Unit.", "Subtotal", "Destino", "Estado producción"].map((h) => (
                              <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {pedido.pedido_items.map((item) => (
                            <tr key={item.id} className="hover:bg-white transition-colors">
                              <td className="px-4 py-3 text-xs font-mono text-blue-700 font-semibold">{item.referencia}</td>
                              <td className="px-4 py-3 text-sm text-gray-800">{item.nombre_referencia}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{item.cantidad_solicitada}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">${item.valor_unitario}</td>
                              <td className="px-4 py-3 text-sm font-bold text-green-700">${Number(item.subtotal).toFixed(2)}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  item.destino === "cliente_externo"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-gray-200 text-gray-700"
                                }`}>
                                  {item.destino === "cliente_externo" ? "Cliente externo" : "Consumo interno"}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  item.estado_produccion === "finalizada" ? "bg-green-100 text-green-700"
                                  : item.estado_produccion === "en_produccion" ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                                }`}>
                                  {item.estado_produccion === "en_produccion" ? "🔄 En producción"
                                    : item.estado_produccion === "finalizada" ? "✅ Finalizada"
                                    : "⏳ Pendiente"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}