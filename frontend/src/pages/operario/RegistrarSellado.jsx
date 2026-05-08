import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { iniciarRegistro, finalizarRegistro } from '../../api/registrosApi';

const RegistrarSellado = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { tareaId, selladoraId } = location.state || {};
  
  const [codigoRollo, setCodigoRollo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isNuevo = id === 'nuevo';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isNuevo) {
        if (!codigoRollo.trim()) {
          setError('El código de rollo es obligatorio');
          setLoading(false);
          return;
        }
        
        await iniciarRegistro({ 
          tareaId, 
          codigoRollo: codigoRollo.trim(), 
          selladoraId 
        });
        
        alert('✅ Registro iniciado correctamente.\n\nRecuerda finalizar el registro cuando completes el rollo.');
      } else {
        if (!cantidad || parseFloat(cantidad) <= 0) {
          setError('Ingrese una cantidad válida mayor a 0');
          setLoading(false);
          return;
        }
        
        await finalizarRegistro({ 
          registroId: id, 
          cantidadBolsasProducidas: parseFloat(cantidad) 
        });
        
        alert('✅ Registro finalizado exitosamente.\n\nProducción registrada: ' + cantidad + ' bolsas');
      }
      
      navigate('/operario/planilla');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error en la operación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isNuevo ? '🟢 Iniciar Nuevo Rollo' : '🔴 Finalizar Registro'}
        </h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isNuevo ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Rollo *
              </label>
              <input 
                type="text" 
                value={codigoRollo} 
                onChange={e => setCodigoRollo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: ROLLO-2024-089"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                Escanea o ingresa el código del rollo de materia prima
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad de Bolsas Producidas *
              </label>
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                value={cantidad} 
                onChange={e => setCantidad(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0.00"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                Ingresa la cantidad total producida en este rollo
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className={`flex-1 text-white py-3 rounded-lg font-medium transition ${
                isNuevo 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                isNuevo ? 'Iniciar Registro' : 'Finalizar Registro'
              )}
            </button>

            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
          </div>
        </form>

        {!isNuevo && location.state && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
            <p className="font-medium mb-2">Información del registro:</p>
            <p className="text-gray-600">Rollo: {location.state.codigoRollo}</p>
            <p className="text-gray-600">
              Orden: {location.state.ordenes_produccion?.numero_orden}
            </p>
            <p className="text-gray-600">
              Referencia: {location.state.ordenes_produccion?.nombre_referencia}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrarSellado;