import axiosInstance from './axiosConfig';

// Persona 2 - Lider de produccion
export const getReferencias = (params = {}) => axiosInstance.get('/referencias', { params });
export const getReferenciaById = (id) => axiosInstance.get(`/referencias/${id}`);
export const crearReferencia = (payload) => axiosInstance.post('/referencias', payload);
export const editarReferencia = (id, payload) => axiosInstance.put(`/referencias/${id}`, payload);
export const cambiarEstadoReferencia = (id, estado) => axiosInstance.patch(`/referencias/${id}/estado`, { estado });

// Persona 1 - Vendedor (formato adaptado)
export const buscarReferencias = async (params = {}) => {
  const res = await axiosInstance.get('/referencias', { params });
  return res.data.data || res.data || [];
};

export const obtenerReferenciaPorId = async (id) => {
  const res = await axiosInstance.get(`/referencias/${id}`);
  return res.data.data || res.data;
};
