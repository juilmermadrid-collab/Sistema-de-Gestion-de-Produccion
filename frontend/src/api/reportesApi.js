import api from "./axiosConfig";

export const obtenerReporteTurno = async (filtros = {}) => {
  const response = await api.get("/reportes/turno", {
    params: filtros,
  });

  return response.data;
};