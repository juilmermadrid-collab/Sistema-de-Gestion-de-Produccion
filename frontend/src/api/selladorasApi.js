import api from "./axiosConfig";

export const obtenerSelladoras = async () => {
  const response = await api.get("/selladoras");
  return response.data;
};

export const actualizarSelladora = async (id, datos) => {
  const response = await api.put(`/selladoras/${id}`, datos);
  return response.data;
};