const supabase = require("../config/supabase");

// RF-V03: Crear pedido con validación de fecha mínima (RF-V06)
const crearPedido = async (req, res) => {
  try {
    const { vendedor_id, fecha_entrega_pactada, items } = req.body;

    // Validaciones básicas
    if (!vendedor_id || !fecha_entrega_pactada || !items || items.length === 0) {
      return res.status(400).json({ error: "Faltan datos obligatorios: vendedor_id, fecha_entrega_pactada, items" });
    }

    // RF-V06: Validar fecha mínima de 15 días
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaEntrega = new Date(fecha_entrega_pactada);
    const diffDias = Math.floor((fechaEntrega - hoy) / (1000 * 60 * 60 * 24));
    if (diffDias < 15) {
      return res.status(400).json({
        error: `La fecha de entrega debe ser mínimo 15 días después de hoy. Faltan ${15 - diffDias} días más.`,
      });
    }

    // Generar número de pedido único
    const numeroPedido = `PED-${Date.now()}`;

    // RF-V07: Crear pedido — al crearse ya pasa a producción (estado en_produccion)
    const { data: pedido, error: errorPedido } = await supabase
      .from("pedidos")
      .insert({
        numero_pedido: numeroPedido,
        vendedor_id,
        fecha_toma: hoy.toISOString().split("T")[0],
        fecha_entrega_pactada,
        estado_pedido: "en_produccion",
        total_pedido: 0,
      })
      .select()
      .single();

    if (errorPedido) return res.status(500).json({ error: errorPedido.message });

    // RF-V04 y RF-V05: Agregar items al pedido con destino y cantidad
    const itemsParaInsertar = items.map((item) => ({
      pedido_id: pedido.id,
      referencia_id: item.referencia_id,
      referencia: item.referencia,
      referencia_corta: item.referencia_corta,
      nombre_referencia: item.nombre_referencia,
      descripcion_referencia: item.descripcion_referencia,
      cantidad_solicitada: item.cantidad_solicitada,
      valor_unitario: item.valor_unitario,
      subtotal: item.cantidad_solicitada * item.valor_unitario,
      destino: item.destino, // cliente_externo o consumo_interno
      estado_produccion: "en_produccion",
    }));

    const { error: errorItems } = await supabase
      .from("pedido_items")
      .insert(itemsParaInsertar);

    if (errorItems) return res.status(500).json({ error: errorItems.message });

    res.status(201).json({
      mensaje: "Pedido creado y enviado a producción correctamente",
      pedido,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar pedidos del vendedor
const listarPedidos = async (req, res) => {
  try {
    const { vendedor_id } = req.query;

    let query = supabase
      .from("pedidos")
      .select(`
        id, numero_pedido, fecha_toma, fecha_entrega_pactada,
        estado_pedido, total_pedido, created_at,
        pedido_items (
          id, referencia, nombre_referencia, cantidad_solicitada,
          valor_unitario, subtotal, destino, estado_produccion
        )
      `)
      .order("created_at", { ascending: false });

    if (vendedor_id) query = query.eq("vendedor_id", vendedor_id);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un pedido por ID con sus items
const obtenerPedidoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("pedidos")
      .select(`
        id, numero_pedido, fecha_toma, fecha_entrega_pactada,
        estado_pedido, total_pedido, created_at,
        pedido_items (
          id, referencia, referencia_corta, nombre_referencia,
          descripcion_referencia, cantidad_solicitada, valor_unitario,
          subtotal, destino, estado_produccion
        )
      `)
      .eq("id", id)
      .single();

    if (error) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { crearPedido, listarPedidos, obtenerPedidoPorId };