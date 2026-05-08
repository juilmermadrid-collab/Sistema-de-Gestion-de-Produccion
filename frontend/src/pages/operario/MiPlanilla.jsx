import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const MiPlanilla = () => {
  const [selladora, setSelladora] = useState('');
  const [turno, setTurno] = useState('');
  const [tareas, setTareas] = useState([]);
  const [selladoras, setSelladoras] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Cargar selladoras
  useEffect(() => {
    const cargarSelladoras = async () => {
      try {
        const { data } = await api.get('/selladoras');
        setSelladoras(data || []);
      } catch (err) {
        console.error('Error cargando selladoras:', err);
      }
    };
    cargarSelladoras();
  }, []);

  // 2. Cargar Planilla
  const cargarPlanilla = async () => {
    if (!selladora || !turno) return;
    setLoading(true);
    try {
      const { data } = await api.get('/registros/tareas', {
        params: { selladoraId: selladora, turno }
      });
      setTareas(data.tareas || []);
    } catch (err) {
      console.error(err);
      setTareas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selladora && turno) cargarPlanilla();
  }, [selladora, turno]);

  // 3. FUNCIÓN: INICIAR ROLLO (Con Prompt simple)
  const handleIniciar = async (tarea) => {
    const codigoRollo = prompt('📝 Ingresa el Código del Rollo:');
    if (!codigoRollo) return;

    try {
      await api.post('/registros/iniciar', {
        tareaId: tarea.id,
        codigoRollo: codigoRollo,
        selladoraId: selladora
      });
      alert('✅ Rollo iniciado correctamente');
      cargarPlanilla(); // Recargar para ver el estado "En Proceso"
    } catch (err) {
      alert('❌ Error al iniciar: ' + (err.response?.data?.error || err.message));
    }
  };

  // 4. FUNCIÓN: FINALIZAR ROLLO
  const handleFinalizar = async (tareaId) => {
    const cantidad = prompt('📦 ¿Cuántas bolsas produjiste en este rollo?', '0');
    if (!cantidad || cantidad <= 0) return;

    try {
      // Aquí necesitaríamos el ID del registro activo, pero por simplicidad
      // asumiremos que el backend lo busca por tareaId o usamos un endpoint
      // Para este ejemplo, simulamos o usamos el ID de la tarea si el backend lo permite
      // NOTA: Lo ideal es tener el registroId, pero usaremos tareaId para probar
      
      // Si tu backend espera 'registroId', tendrías que guardarlo al iniciar.
      // Para simplificar AHORA, vamos a asumir que el backend busca el registro activo de esa tarea.
      
      await api.post('/registros/finalizar', {
         // Si tu backend requiere 'registroId', esto fallará. 
         // Si usa 'tareaId' para buscar el registro activo, funcionará.
         tareaId: tareaId, 
         cantidadBolsasProducidas: parseFloat(cantidad)
      });
      
      alert('✅ Producción finalizada y guardada');
      cargarPlanilla();
    } catch (err) {
      alert('❌ Error al finalizar: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">📋 Mi Planilla</h1>
      
      {/* Selectores */}
      <div className="grid grid-cols-2 gap-4 mb-6 bg-white p-4 rounded-lg">
        <select value={selladora} onChange={e => setSelladora(e.target.value)} className="border p-2 rounded w-full">
          <option value="">Seleccionar Selladora</option>
          {selladoras.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
        </select>
        <select value={turno} onChange={e => setTurno(e.target.value)} className="border p-2 rounded w-full">
          <option value="">Seleccionar Turno</option>
          <option value="turno_1">Turno 1</option>
          <option value="turno_2">Turno 2</option>
          <option value="turno_3">Turno 3</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">Tareas Asignadas</h2>
        {loading ? <p>Cargando...</p> : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Ref</th>
                <th className="py-2">Cant. Prog</th>
                <th className="py-2">Estado</th>
                <th className="py-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map(t => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{t.ordenes_produccion?.referencia}</td>
                  <td className="py-3">{t.cantidad_programada}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      t.estado_tarea === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {t.estado_tarea === 'pendiente' ? 'PENDIENTE' : 'EN PROCESO'}
                    </span>
                  </td>
                  <td className="py-3">
                    {/* Lógica de botones */}
                    {t.estado_tarea === 'pendiente' && (
                      <button 
                        onClick={() => handleIniciar(t)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        🚀 Iniciar Rollo
                      </button>
                    )}
                    
                    {t.estado_tarea === 'en_proceso' && (
                      <button 
                        onClick={() => handleFinalizar(t.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        🏁 Finalizar Rollo
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MiPlanilla;