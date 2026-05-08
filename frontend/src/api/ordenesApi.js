import axiosInstance from './axiosConfig';
export const getOrdenes = (params = {}) => axiosInstance.get('/ordenes', { params });
export const getOrdenById = (id) => axiosInstance.get(`/ordenes/${id}`);
export const crearOrden = (payload) => axiosInstance.post('/ordenes', payload);
export const cambiarEstadoOrden = (id, estado_orden) => axiosInstance.patch(`/ordenes/${id}/estado`, { estado_orden });
export const cambiarEstadoProduccionItem = (pedido_item_id, estado_produccion) => axiosInstance.patch(`/ordenes/pedido-item/${pedido_item_id}/estado-produccion`, { estado_produccion });
export const obtenerOrdenesPorProgramar = (params = {}) =>
  axiosInstance.get('/ordenes', { params: { estado_orden: 'por_programar', ...params } });
