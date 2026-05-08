import { useState } from "react";
import { crearPedido } from "../../api/pedidosApi";
import BuscarReferencias from "./BuscarReferencias";

const VENDEDOR_ID = "b1516c68-0d7a-4193-bd07-129b079a8d6e";

export default function CrearPedido() {
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [items, setItems] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarBuscador, setMostrarBuscador] = useState(false);

  const handleAgregarAlPedido = (ref) => {
    const yaExiste = items.find((i) => i.referencia_id === ref.id);
    if (yaExiste) { setError("Esa referencia ya está en el pedido."); return; }
    setItems([...items, {
      referencia_id: ref.id,
      referencia: ref.referencia,
      referencia_corta: ref.referencia_corta,
      nombre_referencia: ref.nombre,
      descripcion_referencia: ref.descripcion,
      cantidad_solicitada: 1,
      valor_unitario: ref.valor_unitario,
      destino: "cliente_externo",
    }]);
    setError("");
    setMostrarBuscador(false);
  };

  const handleCambiarItem = (index, campo, valor) => {
    const nuevos = [...items];
    nuevos[index][campo] = valor;
    setItems(nuevos);
  };

  const handleEliminarItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleConfirmarPedido = async () => {
    setError(""); setMensaje("");
    if (!fechaEntrega) return setError("Debes ingresar la fecha de entrega.");
    if (items.length === 0) return setError("Agrega al menos una referencia al pedido.");
    for (const item of items) {
      if (!item.cantidad_solicitada || item.cantidad_solicitada <= 0)
        return setError("Todos los items deben tener cantidad mayor a 0.");
    }
    try {
      setCargando(true);
      const resultado = await crearPedido({ vendedor_id: VENDEDOR_ID, fecha_entrega_pactada: fechaEntrega, items });
      setMensaje(`Pedido ${resultado.pedido.numero_pedido} creado y enviado a producción correctamente.`);
      setItems([]);
      setFechaEntrega("");
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear el pedido.");
    } finally {
      setCargando(false);
    }
  };

  const total = items.reduce((acc, item) => acc + item.cantidad_solicitada * item.valor_unitario, 0);
  const fechaMinima = new Date();
  fechaMinima.setDate(fechaMinima.getDate() + 15);
  const fechaMinimaStr = fechaMinima.toISOString().split("T")[0];

  return (
    <div>
      {/* Mensaje éxito */}
      {mensaje && (
        <div className="bg-green-50 border border-green-300 text-green-800 px-5 py-4 rounded-xl mb-6 flex items-center gap-3 shadow-sm">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-bold">¡Pedido creado exitosamente!</p>
            <p className="text-sm">{mensaje}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda */}
        <div className="lg:col-span-1 space-y-4">
          {/* Card fecha */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-800 to-blue-700 px-5 py-4 flex items-center gap-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <span className="text-lg">📅</span>
              </div>
              <div>
                <p className="text-xs text-blue-200 uppercase tracking-wide font-semibold">Paso 1</p>
                <p className="text-white font-bold">Fecha de entrega</p>
              </div>
            </div>
            <div className="p-5">
              <label className="block text-xs text-gray-500 mb-2 font-medium">
                Mínimo <span className="text-orange-500 font-bold">15 días</span> desde hoy
              </label>
              <input
                type="date"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                value={fechaEntrega}
                min={fechaMinimaStr}
                onChange={(e) => setFechaEntrega(e.target.value)}
              />
              {fechaEntrega && (
                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-center">
                  <p className="text-xs text-blue-500">Fecha seleccionada</p>
                  <p className="text-blue-800 font-bold text-sm">{fechaEntrega}</p>
                </div>
              )}
            </div>
          </div>

          {/* Card buscar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-800 to-blue-700 px-5 py-4 flex items-center gap-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <span className="text-lg">🔍</span>
              </div>
              <div>
                <p className="text-xs text-blue-200 uppercase tracking-wide font-semibold">Paso 2</p>
                <p className="text-white font-bold">Agregar referencias</p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-500 mb-3">Busca y selecciona las referencias que necesitas</p>
              <button
                onClick={() => setMostrarBuscador(!mostrarBuscador)}
                className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 cursor-pointer text-sm"
              >
                {mostrarBuscador ? "▲ Cerrar buscador" : "⊕ Buscar referencias"}
              </button>
            </div>
          </div>

          {/* Resumen total */}
          {items.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-700 to-green-600 px-5 py-4 flex items-center gap-3">
                <div className="bg-green-500 rounded-lg p-2">
                  <span className="text-lg">💰</span>
                </div>
                <div>
                  <p className="text-xs text-green-200 uppercase tracking-wide font-semibold">Resumen</p>
                  <p className="text-white font-bold">Total del pedido</p>
                </div>
              </div>
              <div className="p-5 text-center">
                <p className="text-4xl font-black text-green-700">${total.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">{items.length} referencia(s)</p>
                <button
                  onClick={handleConfirmarPedido}
                  disabled={cargando}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 cursor-pointer shadow-md"
                >
                  {cargando ? "⏳ Enviando..." : "✅ Confirmar y enviar"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha */}
        <div className="lg:col-span-2 space-y-4">
          {/* Buscador */}
          {mostrarBuscador && (
            <div className="bg-white rounded-2xl shadow-sm border border-blue-200 overflow-hidden">
              <BuscarReferencias onAgregarAlPedido={handleAgregarAlPedido} />
            </div>
          )}

          {/* Tabla items */}
          {items.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="bg-blue-100 rounded-lg p-2">
                  <span className="text-lg">📦</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Referencias seleccionadas</p>
                  <p className="font-bold text-gray-800">{items.length} item(s) en el pedido</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Referencia", "Nombre", "Cantidad", "Valor Unit.", "Subtotal", "Destino", ""].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item, index) => (
                      <tr key={index} className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-xs font-mono text-blue-700 font-semibold">{item.referencia_corta}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.nombre_referencia}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number" min="1"
                            className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                            value={item.cantidad_solicitada}
                            onChange={(e) => handleCambiarItem(index, "cantidad_solicitada", Number(e.target.value))}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">${item.valor_unitario}</td>
                        <td className="px-4 py-3 text-sm font-bold text-green-700">
                          ${(item.cantidad_solicitada * item.valor_unitario).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                            value={item.destino}
                            onChange={(e) => handleCambiarItem(index, "destino", e.target.value)}
                          >
                            <option value="cliente_externo">Cliente externo</option>
                            <option value="consumo_interno">Consumo interno</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleEliminarItem(index)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer text-lg"
                          >✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            !mostrarBuscador && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-gray-500 text-lg font-medium">Tu pedido está vacío</p>
                <p className="text-gray-400 text-sm mt-1">Usa el buscador para agregar referencias</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}