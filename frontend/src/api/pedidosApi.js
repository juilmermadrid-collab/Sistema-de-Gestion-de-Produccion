import api from "./axiosConfig";

// Crear un pedido nuevo
export const crearPedido = async (pedidoData) => {
  const { data } = await api.post("/pedidos", pedidoData);
  return data;
};

// Listar pedidos (filtrado por vendedor_id opcional)
export const listarPedidos = async (vendedor_id) => {
  const { data } = await api.get("/pedidos", {
    params: vendedor_id ? { vendedor_id } : {},
  });
  return data;
};

// Obtener un pedido por ID
export const obtenerPedidoPorId = async (id) => {
  const { data } = await api.get(`/pedidos/${id}`);
  return data;
};