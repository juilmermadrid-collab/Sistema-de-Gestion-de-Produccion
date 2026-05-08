import axiosInstance from './axiosConfig';

// Persona 2 - Lider de produccion
export const getPedidos = (params = {}) => axiosInstance.get('/pedidos', { params });
export const getPedidoById = (id) => axiosInstance.get(`/pedidos/${id}`);
export const getDocumentacionProduccion = (params = {}) => axiosInstance.get('/pedidos/documentacion', { params });

// Persona 1 - Vendedor
export const listarPedidos = (params = {}) => axiosInstance.get('/pedidos', { params });
export const listarPedido = (params = {}) => axiosInstance.get('/pedidos', { params });
export const crearPedido = (payload) => axiosInstance.post('/pedidos', payload);
export const obtenerPedidoPorId = (id) => axiosInstance.get(`/pedidos/${id}`);
export const confirmarPedido = (id) => axiosInstance.patch(`/pedidos/${id}/confirmar`);
