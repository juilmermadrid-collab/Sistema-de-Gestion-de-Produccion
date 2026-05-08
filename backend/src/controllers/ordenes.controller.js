const { supabase } = require('../config/supabase');

const listarOrdenes = async (req, res) => {
  try {
    const { estado_orden, pedido_id, referencia_id, page = 1, limit = 20 } = req.query;
    let query = supabase.from('ordenes_produccion').select(`id, numero_orden, cantidad_programada, proceso_controlado, estado_orden, creada_por, created_at, updated_at, referencia, referencia_corta, nombre_referencia, pedido_id, pedido_item_id, referencia_id, pedidos (id, numero_pedido, fecha_toma, fecha_entrega_pactada, estado_pedido), referencias (id, referencia, nombre, tipo_producto, materia_prima, ancho, alto, calibre, sellado, medida, color)`, { count: 'exact' });
    if (estado_orden) query = query.eq('estado_orden', estado_orden);
    if (pedido_id) query = query.eq('pedido_id', pedido_id);
    if (referencia_id) query = query.eq('referencia_id', referencia_id);
    const from = (parseInt(page) - 1) * parseInt(limit);
    query = query.range(from, from + parseInt(limit) - 1).order('created_at', { ascending: false });
    const { data, error, count } = await query;
    if (error) throw error;
    return res.status(200).json({ ok: true, total: count, page: parseInt(page), limit: parseInt(limit), data });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

const obtenerOrden = async (req, res) => {
  try {
    const { data, error } = await supabase.from('ordenes_produccion').select(`*, pedidos (id, numero_pedido, fecha_toma, fecha_entrega_pactada, estado_pedido, vendedor_id, total_pedido), pedido_items (id, cantidad_solicitada, valor_unitario, subtotal, destino, estado_produccion), referencias (*)`).eq('id', req.params.id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ ok: false, mensaje: 'Orden no encontrada.' });
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

const crearOrden = async (req, res) => {
  try {
    const { pedido_id, pedido_item_id, cantidad_programada, proceso_controlado = 'sellado' } = req.body;
    if (!pedido_id || !pedido_item_id || !cantidad_programada) return res.status(400).json({ ok: false, mensaje: 'pedido_id, pedido_item_id y cantidad_programada son obligatorios.' });
    const { data: pedido, error: errPedido } = await supabase.from('pedidos').select('id, numero_pedido, estado_pedido').eq('id', pedido_id).single();
    if (errPedido || !pedido) return res.status(404).json({ ok: false, mensaje: 'Pedido no encontrado.' });
    if (pedido.estado_pedido !== 'en_produccion') return res.status(400).json({ ok: false, mensaje: 'El pedido no está en estado en_produccion.' });
    const { data: item, error: errItem } = await supabase.from('pedido_items').select('id, referencia_id, referencia, referencia_corta, nombre_referencia, cantidad_solicitada').eq('id', pedido_item_id).eq('pedido_id', pedido_id).single();
    if (errItem || !item) return res.status(404).json({ ok: false, mensaje: 'Item del pedido no encontrado.' });
    const yyyymmdd = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const numero_orden = `OP-${yyyymmdd}-${Math.floor(1000 + Math.random() * 9000)}`;
    const { data: nuevaOrden, error: errOrden } = await supabase.from('ordenes_produccion').insert({ numero_orden, pedido_id, pedido_item_id, referencia_id: item.referencia_id, referencia: item.referencia, referencia_corta: item.referencia_corta, nombre_referencia: item.nombre_referencia, cantidad_programada, proceso_controlado, estado_orden: 'por_programar', creada_por: '98558932-daac-4a13-b368-923603a806d2' }).select().single();
    if (errOrden) throw errOrden;
    return res.status(201).json({ ok: true, mensaje: 'Orden creada exitosamente.', data: nuevaOrden });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

const cambiarEstadoOrden = async (req, res) => {
  try {
    const { estado_orden } = req.body;
    const validos = ['por_programar','pendiente_por_material','programada','en_proceso','finalizada'];
    if (!validos.includes(estado_orden)) return res.status(400).json({ ok: false, mensaje: 'Estado inválido.' });
    const { data, error } = await supabase.from('ordenes_produccion').update({ estado_orden }).eq('id', req.params.id).select('id, numero_orden, estado_orden, referencia, nombre_referencia').single();
    if (error) throw error;
    if (!data) return res.status(404).json({ ok: false, mensaje: 'Orden no encontrada.' });
    return res.status(200).json({ ok: true, mensaje: 'Estado actualizado.', data });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

const cambiarEstadoProduccionItem = async (req, res) => {
  try {
    const { estado_produccion } = req.body;
    const validos = ['pendiente_por_material','en_produccion','finalizada'];
    if (!validos.includes(estado_produccion)) return res.status(400).json({ ok: false, mensaje: 'Estado inválido.' });
    const { data, error } = await supabase.from('pedido_items').update({ estado_produccion }).eq('id', req.params.pedido_item_id).select('id, referencia, nombre_referencia, estado_produccion').single();
    if (error) throw error;
    if (!data) return res.status(404).json({ ok: false, mensaje: 'Item no encontrado.' });
    return res.status(200).json({ ok: true, mensaje: 'Estado actualizado.', data });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

module.exports = { listarOrdenes, obtenerOrden, crearOrden, cambiarEstadoOrden, cambiarEstadoProduccionItem };
