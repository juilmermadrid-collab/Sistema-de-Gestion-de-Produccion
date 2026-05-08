const supabase = require('../config/supabase');

// =====================================================
// 1. OBTENER PLANILLAS POR FECHA Y TURNO
// =====================================================
exports.getByFechaTurno = async (req, res) => {
  try {
    const { fecha, turno } = req.query;

    let query = supabase
      .from('planillas_produccion')
      .select(`
        *,
        selladoras (nombre, codigo),
        usuarios:creada_por (nombre)
      `);

    if (fecha) {
      query = query.eq('fecha', fecha);
    }
    if (turno) {
      query = query.eq('turno', turno);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error('Error en getByFechaTurno:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 2. OBTENER PLANILLA ACTIVA POR SELLADORA Y TURNO
// =====================================================
exports.getPlanillaActiva = async (req, res) => {
  try {
    const { selladoraId, turno, fecha } = req.query;

    let query = supabase
      .from('planillas_produccion')
      .select(`
        *,
        tareas_planilla (
          *,
          ordenes_produccion (
            numero_orden,
            referencia,
            nombre_referencia,
            cantidad_programada
          )
        )
      `)
      .eq('selladora_id', selladoraId)
      .eq('turno', turno)
      .eq('estado_planilla', 'activa');

    if (fecha) {
      query = query.eq('fecha', fecha);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return res.status(404).json({ error: 'No hay planilla activa para esta configuración' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error en getPlanillaActiva:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 3. CREAR PLANILLA DE PRODUCCIÓN
// =====================================================
exports.create = async (req, res) => {
  try {
    const { 
      codigo_planilla, 
      fecha, 
      turno, 
      selladora_id, 
      creada_por, 
      tareas 
    } = req.body;

    // Insertar planilla
    const { data: planilla, error: planillaError } = await supabase
      .from('planillas_produccion')
      .insert({
        codigo_planilla,
        fecha,
        turno,
        selladora_id,
        creada_por,
        estado_planilla: 'activa',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (planillaError) throw planillaError;

    // Insertar tareas si existen
    if (tareas && tareas.length > 0) {
      const tareasData = tareas.map((tarea, index) => ({
        planilla_id: planilla.id,
        secuencia: index + 1,
        orden_produccion_id: tarea.orden_produccion_id,
        pedido_id: tarea.pedido_id,
        referencia_id: tarea.referencia_id,
        cantidad_programada: tarea.cantidad_programada,
        estado_tarea: 'pendiente'
      }));

      const { error: tareasError } = await supabase
        .from('tareas_planilla')
        .insert(tareasData);

      if (tareasError) throw tareasError;
    }

    res.status(201).json(planilla);

  } catch (err) {
    console.error('Error en create planilla:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 4. CERRAR PLANILLA
// =====================================================
exports.cerrarPlanilla = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('planillas_produccion')
      .update({ 
        estado_planilla: 'cerrada',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Planilla no encontrada' });

    res.json(data);
  } catch (err) {
    console.error('Error en cerrarPlanilla:', err);
    res.status(500).json({ error: err.message });
  }
};