const { supabase } = require('../config/supabase');

const listarReferencias = async (req, res) => {
  try {
    const { q, tipo_producto, materia_prima, ancho, sellado, estado, page = 1, limit = 20 } = req.query;
    let query = supabase.from('referencias').select(`id, referencia, referencia_corta, nombre, grupo, estado, descripcion, codigo_barras, presentacion, unidad_medida, costo, impuesto, valor_unitario, tipo_producto, materia_prima, color, troquelado, ancho, fuelle_izquierdo, fuelle_derecho, alto, fuelle_superior, fuelle_fondo, calibre, impresion, colores, tipo_cliente, tipo_impresion, sellado, tratado_cara, medida, requiere_extrusion, requiere_impresion, requiere_refilado, requiere_sellado, creada_por, created_at, updated_at, referencia_precios (id, categoria, precio, incluye_impuesto)`, { count: 'exact' });
    if (q?.trim()) query = query.or(`referencia.ilike.%${q}%,referencia_corta.ilike.%${q}%,nombre.ilike.%${q}%,descripcion.ilike.%${q}%`);
    if (tipo_producto) query = query.eq('tipo_producto', tipo_producto);
    if (materia_prima) query = query.eq('materia_prima', materia_prima);
    if (ancho) query = query.eq('ancho', parseFloat(ancho));
    if (sellado) query = query.eq('sellado', sellado);
    if (estado && estado !== 'todas') query = query.eq('estado', estado);
    else if (!estado) query = query.eq('estado', 'activa');
    const from = (parseInt(page) - 1) * parseInt(limit);
    query = query.range(from, from + parseInt(limit) - 1).order('nombre', { ascending: true });
    const { data, error, count } = await query;
    if (error) throw error;
    return res.status(200).json({ ok: true, total: count, page: parseInt(page), limit: parseInt(limit), data });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

const obtenerReferencia = async (req, res) => {
  try {
    const { data, error } = await supabase.from('referencias').select(`*, referencia_precios (id, categoria, precio, incluye_impuesto)`).eq('id', req.params.id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ ok: false, mensaje: 'Referencia no encontrada' });
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

const crearReferencia = async (req, res) => {
  try {
    const { precios = [], ...campos } = req.body;
    const obligatorios = ['referencia','referencia_corta','nombre','tipo_producto','materia_prima','ancho','sellado','medida'];
    for (const c of obligatorios) {
      if (!campos[c]) return res.status(400).json({ ok: false, mensaje: `El campo '${c}' es obligatorio.` });
    }
    const { data: nuevaRef, error } = await supabase.from('referencias').insert({ ...campos }).select().single();
    if (error) {
      if (error.code === '23505') return res.status(409).json({ ok: false, mensaje: 'Ya existe una referencia con ese código.' });
      throw error;
    }
    if (precios.length > 0) {
      const { error: errP } = await supabase.from('referencia_precios').insert(precios.map(p => ({ referencia_id: nuevaRef.id, categoria: p.categoria, precio: p.precio, incluye_impuesto: p.incluye_impuesto ?? false })));
      if (errP) throw errP;
    }
    const { data: completa } = await supabase.from('referencias').select(`*, referencia_precios(*)`).eq('id', nuevaRef.id).single();
    return res.status(201).json({ ok: true, mensaje: 'Referencia creada exitosamente.', data: completa });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

const editarReferencia = async (req, res) => {
  try {
    const { precios, ...campos } = req.body;
    delete campos.id; delete campos.creada_por; delete campos.created_at;
    const { data, error } = await supabase.from('referencias').update(campos).eq('id', req.params.id).select().single();
    if (error) throw error;
    if (!data) return res.status(404).json({ ok: false, mensaje: 'Referencia no encontrada.' });
    if (precios && Array.isArray(precios)) {
      await supabase.from('referencia_precios').delete().eq('referencia_id', req.params.id);
      if (precios.length > 0) {
        const { error: errP } = await supabase.from('referencia_precios').insert(precios.map(p => ({ referencia_id: req.params.id, categoria: p.categoria, precio: p.precio, incluye_impuesto: p.incluye_impuesto ?? false })));
        if (errP) throw errP;
      }
    }
    const { data: completa } = await supabase.from('referencias').select(`*, referencia_precios(*)`).eq('id', req.params.id).single();
    return res.status(200).json({ ok: true, mensaje: 'Referencia actualizada.', data: completa });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

const cambiarEstadoReferencia = async (req, res) => {
  try {
    const { estado } = req.body;
    if (!['activa','inactiva'].includes(estado)) return res.status(400).json({ ok: false, mensaje: 'Estado inválido.' });
    const { data, error } = await supabase.from('referencias').update({ estado }).eq('id', req.params.id).select('id, referencia, nombre, estado').single();
    if (error) throw error;
    return res.status(200).json({ ok: true, mensaje: 'Estado actualizado.', data });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

module.exports = { listarReferencias, obtenerReferencia, crearReferencia, editarReferencia, cambiarEstadoReferencia };
