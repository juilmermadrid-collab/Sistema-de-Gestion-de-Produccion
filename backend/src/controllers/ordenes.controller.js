const supabase = require('../config/supabase');

// =====================================================
// 1. OBTENER TODAS LAS ÓRDENES DE PRODUCCIÓN
// =====================================================
exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ordenes_produccion')
      .select(`
        *,
        pedidos (numero_pedido),
        referencias (referencia, nombre)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error('Error en getAll ordenes:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 2. OBTENER ÓRDENES POR PEDIDO
// =====================================================
exports.getByPedido = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    
    const { data, error } = await supabase
      .from('ordenes_produccion')
      .select(`
        *,
        referencias (referencia, nombre)
      `)
      .eq('pedido_id', pedidoId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error('Error en getByPedido ordenes:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 3. CREAR ORDEN DE PRODUCCIÓN
// =====================================================
exports.create = async (req, res) => {
  try {
    const { 
      numero_orden, 
      pedido_id, 
      item_pedido_id, 
      referencia_id, 
      cantidad_programada, 
      proceso_controlado, 
      creada_por 
    } = req.body;

    const { data, error } = await supabase
      .from('ordenes_produccion')
      .insert({
        numero_orden,
        pedido_id,
        item_pedido_id,
        referencia_id,
        cantidad_programada,
        proceso_controlado,
        estado_orden: 'pendiente_por_material',
        creada_por,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);

  } catch (err) {
    console.error('Error en create orden:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 4. ACTUALIZAR ESTADO DE ORDEN
// =====================================================
exports.updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_orden, selladora_id, planilla_id } = req.body;
    
    const { data, error } = await supabase
      .from('ordenes_produccion')
      .update({ 
        estado_orden,
        selladora_id: selladora_id || null,
        planilla_id: planilla_id || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Orden no encontrada' });

    res.json(data);
  } catch (err) {
    console.error('Error en updateEstado orden:', err);
    res.status(500).json({ error: err.message });
  }
};