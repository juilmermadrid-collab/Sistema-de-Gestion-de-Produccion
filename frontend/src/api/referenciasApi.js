import axiosInstance from './axiosConfig';
export const getReferencias = (params = {}) => axiosInstance.get('/referencias', { params });
export const getReferenciaById = (id) => axiosInstance.get(`/referencias/${id}`);
export const crearReferencia = (payload) => axiosInstance.post('/referencias', payload);
export const editarReferencia = (id, payload) => axiosInstance.put(`/referencias/${id}`, payload);
export const cambiarEstadoReferencia = (id, estado) => axiosInstance.patch(`/referencias/${id}/estado`, { estado });
export const buscarReferencias = (params = {}) => axiosInstance.get('/referencias', { params });
