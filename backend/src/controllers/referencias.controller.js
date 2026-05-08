const supabase = require('../config/supabase');

// =====================================================
// 1. OBTENER TODAS LAS REFERENCIAS
// =====================================================
exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('referencias')
      .select('*')
      .order('referencia', { ascending: true });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error('Error en getAll referencias:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 2. OBTENER REFERENCIA POR ID
// =====================================================
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('referencias')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Referencia no encontrada' });

    res.json(data);
  } catch (err) {
    console.error('Error en getById referencia:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 3. CREAR NUEVA REFERENCIA
// =====================================================
exports.create = async (req, res) => {
  try {
    const { 
      referencia, 
      referencia_corta, 
      nombre, 
      grupo, 
      descripcion, 
      codigo_barras,
      presentacion,
      unidad_medida,
      costo,
      impuesto,
      valor_unitario,
      tipo_producto,
      materia_prima,
      color,
      troquelado,
      ancho,
      fuelle_izquierdo,
      fuelle_derecho,
      alto,
      fuelle_superior,
      fuelle_fondo,
      calibre,
      impresion,
      colores,
      tipo_cliente,
      tipo_impresion,
      sellado,
      tratado_cara,
      medida,
      requiere_extrusion,
      requiere_impresion,
      requiere_refilado,
      requiere_sellado,
      creada_por
    } = req.body;

    const { data, error } = await supabase
      .from('referencias')
      .insert({
        referencia,
        referencia_corta,
        nombre,
        grupo: grupo || null,
        estado: 'activa',
        descripcion: descripcion || null,
        codigo_barras: codigo_barras || null,
        presentacion: presentacion || null,
        unidad_medida: unidad_medida || 'unidades',
        costo: costo || null,
        impuesto: impuesto || null,
        valor_unitario: valor_unitario || 0,
        tipo_producto,
        materia_prima,
        color: color || null,
        troquelado: troquelado || null,
        ancho,
        fuelle_izquierdo: fuelle_izquierdo || null,
        fuelle_derecho: fuelle_derecho || null,
        alto: alto || null,
        fuelle_superior: fuelle_superior || null,
        fuelle_fondo: fuelle_fondo || null,
        calibre: calibre || null,
        impresion: impresion !== undefined ? impresion : false,
        colores: colores || [],
        tipo_cliente: tipo_cliente || null,
        tipo_impresion: tipo_impresion || null,
        sellado,
        tratado_cara: tratado_cara || null,
        medida,
        requiere_extrusion: requiere_extrusion !== undefined ? requiere_extrusion : false,
        requiere_impresion: requiere_impresion !== undefined ? requiere_impresion : false,
        requiere_refilado: requiere_refilado !== undefined ? requiere_refilado : false,
        requiere_sellado: requiere_sellado !== undefined ? requiere_sellado : true,
        creada_por: creada_por || null
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error('Error en create referencia:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 4. ACTUALIZAR REFERENCIA
// =====================================================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const { data, error } = await supabase
      .from('referencias')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Referencia no encontrada' });

    res.json(data);
  } catch (err) {
    console.error('Error en update referencia:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 5. ELIMINAR REFERENCIA (SOFT DELETE)
// =====================================================
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('referencias')
      .update({ estado: 'inactiva' })
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Referencia desactivada correctamente' });
  } catch (err) {
    console.error('Error en delete referencia:', err);
    res.status(500).json({ error: err.message });
  }
};