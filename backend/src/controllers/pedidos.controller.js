const { supabase } = require('../config/supabase');

const listarPedidos = async (req, res) => {
  try {
    const { estado_pedido, vendedor_id, page = 1, limit = 20 } = req.query;
    let query = supabase.from('pedidos').select(`id, numero_pedido, fecha_toma, fecha_entrega_pactada, estado_pedido, total_pedido, created_at, vendedor_id, pedido_items (id, referencia_id, referencia, referencia_corta, nombre_referencia, descripcion_referencia, cantidad_solicitada, valor_unitario, subtotal, destino, estado_produccion)`, { count: 'exact' });
    if (estado_pedido) query = query.eq('estado_pedido', estado_pedido);
    else query = query.eq('estado_pedido', 'en_produccion');
    if (vendedor_id) query = query.eq('vendedor_id', vendedor_id);
    const from = (parseInt(page) - 1) * parseInt(limit);
    query = query.range(from, from + parseInt(limit) - 1).order('created_at', { ascending: false });
    const { data, error, count } = await query;
    if (error) throw error;
    return res.status(200).json({ ok: true, total: count, page: parseInt(page), limit: parseInt(limit), data });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

const obtenerPedido = async (req, res) => {
  try {
    const { data, error } = await supabase.from('pedidos').select(`*, pedido_items (id, referencia_id, referencia, referencia_corta, nombre_referencia, descripcion_referencia, cantidad_solicitada, valor_unitario, subtotal, destino, estado_produccion, created_at)`).eq('id', req.params.id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ ok: false, mensaje: 'Pedido no encontrado.' });
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

const consultarDocumentacion = async (req, res) => {
  try {
    const { fecha_desde, fecha_hasta } = req.query;
    let q = supabase.from('ordenes_produccion').select(`id, numero_orden, estado_orden, cantidad_programada, referencia, nombre_referencia, created_at, pedidos (numero_pedido, fecha_toma, fecha_entrega_pactada)`).order('created_at', { ascending: false }).limit(50);
    if (fecha_desde) q = q.gte('created_at', fecha_desde);
    if (fecha_hasta) q = q.lte('created_at', fecha_hasta + 'T23:59:59');
    const { data: ordenes, error } = await q;
    if (error) throw error;
    const resumen = ordenes.reduce((acc, o) => { acc[o.estado_orden] = (acc[o.estado_orden] || 0) + 1; return acc; }, {});
    return res.status(200).json({ ok: true, data: { resumen_estados_ordenes: resumen, ordenes } });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

module.exports = { listarPedidos, obtenerPedido, consultarDocumentacion };
