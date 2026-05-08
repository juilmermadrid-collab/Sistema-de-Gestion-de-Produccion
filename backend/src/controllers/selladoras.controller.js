const supabase = require('../config/supabase');

// Debug (opcional, puedes borrarlo después)
console.log('✅ Cargando selladoras.controller.js CON SUPABASE');
console.log('✅ Supabase cargado:', typeof supabase);

// =====================================================
// 1. OBTENER TODAS LAS SELLADORAS ACTIVAS
// =====================================================
exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('selladoras')
      .select('*')
      .eq('estado', 'activa')
      .order('numero', { ascending: true });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error('Error en getAll selladoras:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 2. OBTENER SELLADORA POR ID
// =====================================================
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('selladoras')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Selladora no encontrada' });

    res.json(data);
  } catch (err) {
    console.error('Error en getById selladora:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 3. CREAR NUEVA SELLADORA
// =====================================================
exports.create = async (req, res) => {
  try {
    const { codigo, nombre, numero, sellado_fondo, sellado_lateral, tipos_referencia_permitidos, estado } = req.body;
    
    const { data, error } = await supabase
      .from('selladoras')
      .insert({
        codigo,
        nombre,
        numero,
        sellado_fondo: sellado_fondo !== undefined ? sellado_fondo : true,
        sellado_lateral: sellado_lateral !== undefined ? sellado_lateral : false,
        tipos_referencia_permitidos: tipos_referencia_permitidos || [],
        estado: estado || 'activa'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error('Error en create selladora:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 4. ACTUALIZAR SELLADORA
// =====================================================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const { data, error } = await supabase
      .from('selladoras')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Selladora no encontrada' });

    res.json(data);
  } catch (err) {
    console.error('Error en update selladora:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 5. ELIMINAR SELLADORA (SOFT DELETE)
// =====================================================
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('selladoras')
      .update({ estado: 'inactiva' })
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Selladora desactivada correctamente' });
  } catch (err) {
    console.error('Error en delete selladora:', err);
    res.status(500).json({ error: err.message });
  }
};