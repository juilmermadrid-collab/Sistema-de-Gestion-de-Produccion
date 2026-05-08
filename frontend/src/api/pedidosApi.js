import axiosInstance from './axiosConfig';

// Persona 2 - Lider de produccion
export const getPedidos = (params = {}) => axiosInstance.get('/pedidos', { params });
export const getPedidoById = (id) => axiosInstance.get(`/pedidos/${id}`);
export const getDocumentacionProduccion = (params = {}) => axiosInstance.get('/pedidos/documentacion', { params });

// Persona 1 - Vendedor (formato adaptado)
export const listarPedidos = async (params = {}) => {
  const res = await axiosInstance.get('/pedidos', { params });
  return res.data.data || res.data || [];
};
export const listarPedido = async (params = {}) => {
  const res = await axiosInstance.get('/pedidos', { params });
  return res.data.data || res.data || [];
};
export const crearPedido = (payload) => axiosInstance.post('/pedidos', payload);
export const obtenerPedidoPorId = async (id) => {
  const res = await axiosInstance.get(`/pedidos/${id}`);
  return res.data.data || res.data;
};
export const confirmarPedido = (id) => axiosInstance.patch(`/pedidos/${id}/confirmar`);
