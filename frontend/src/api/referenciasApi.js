import api from "./axiosConfig";

// Buscar referencias con filtros
export const buscarReferencias = async (filtros) => {
  const { data } = await api.get("/referencias", { params: filtros });
  return data;
};

// Obtener una referencia por ID
export const obtenerReferenciaPorId = async (id) => {
  const { data } = await api.get(`/referencias/${id}`);
  return data;
};