import api from "./axiosConfig";

export const crearPlanilla = async (datos) => {
  const response = await api.post("/planillas", datos);
  return response.data;
};

export const obtenerPlanillas = async (filtros = {}) => {
  const response = await api.get("/planillas", {
    params: filtros,
  });

  return response.data;
};

export const obtenerPlanillaPorId = async (id) => {
  const response = await api.get(`/planillas/${id}`);
  return response.data;
};

export const agregarTareaPlanilla = async (planillaId, datos) => {
  const response = await api.post(`/planillas/${planillaId}/tareas`, datos);
  return response.data;
};

export const actualizarTareaPlanilla = async (planillaId, tareaId, datos) => {
  const response = await api.put(
    `/planillas/${planillaId}/tareas/${tareaId}`,
    datos
  );

  return response.data;
};