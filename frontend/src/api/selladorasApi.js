import api from './axiosConfig';

export const getSelladoras = () => api.get('/selladoras');

export const getSelladoraById = (id) => api.get(`/selladoras/${id}`);

export const createSelladora = (data) => api.post('/selladoras', data);

export const updateSelladora = (id, data) => api.put(`/selladoras/${id}`, data);

export const deleteSelladora = (id) => api.delete(`/selladoras/${id}`);