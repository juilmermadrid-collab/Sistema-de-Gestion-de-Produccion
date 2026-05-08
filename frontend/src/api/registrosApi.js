import api from "./axiosConfig";

export const obtenerRegistros = async (filtros = {}) => {
  const response = await api.get("/registros", {
    params: filtros,
  });

  return response.data;
};