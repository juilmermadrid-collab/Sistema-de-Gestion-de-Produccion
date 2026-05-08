const supabase = require('../config/supabase');

// =====================================================
// 1. OBTENER TODOS LOS PEDIDOS
// =====================================================
exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        usuarios:vendedor_id (nombre, correo),
        items_pedido (
          *,
          referencias:referencia_id (referencia, nombre)
        )
      `)
      .order('fecha_toma', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error('Error en getAll pedidos:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 2. OBTENER PEDIDO POR ID
// =====================================================
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        usuarios:vendedor_id (nombre, correo),
        items_pedido (
          *,
          referencias:referencia_id (referencia, nombre, valor_unitario)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error en getById pedido:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 3. CREAR NUEVO PEDIDO
// =====================================================
exports.create = async (req, res) => {
  try {
    const { 
      numero_pedido, 
      vendedor_id, 
      fecha_toma, 
      fecha_entrega_pactada, 
      items, 
      total_pedido 
    } = req.body;

    // Insertar pedido
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .insert({
        numero_pedido,
        vendedor_id,
        fecha_toma,
        fecha_entrega_pactada,
        estado_pedido: 'en_produccion',
        total_pedido,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (pedidoError) throw pedidoError;

    // Insertar items del pedido
    if (items && items.length > 0) {
      const itemsData = items.map(item => ({
        pedido_id: pedido.id,
        referencia_id: item.referencia_id,
        cantidad_solicitada: item.cantidad_solicitada,
        valor_unitario: item.valor_unitario,
        subtotal: item.subtotal,
        destino: item.destino,
        estado_produccion: 'pendiente_por_material'
      }));

      const { error: itemsError } = await supabase
        .from('items_pedido')
        .insert(itemsData);

      if (itemsError) throw itemsError;
    }

    res.status(201).json(pedido);

  } catch (err) {
    console.error('Error en create pedido:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 4. ACTUALIZAR PEDIDO
// =====================================================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const { data, error } = await supabase
      .from('pedidos')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Pedido no encontrado' });

    res.json(data);
  } catch (err) {
    console.error('Error en update pedido:', err);
    res.status(500).json({ error: err.message });
  }
};