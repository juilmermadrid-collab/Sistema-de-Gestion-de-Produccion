import api from "./axiosConfig";

export const obtenerOrdenesPorProgramar = async () => {
  const response = await api.get("/ordenes/por-programar");
  return response.data;
};

export const programarOrden = async (id, datos) => {
  const response = await api.put(`/ordenes/${id}/programar`, datos);
  return response.data;
};