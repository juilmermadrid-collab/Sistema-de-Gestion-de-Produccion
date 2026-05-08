const supabase = require('../config/supabase');

// =====================================================
// 1. OBTENER TAREAS DE LA PLANILLA ACTIVA
// =====================================================
exports.getTareasPlanilla = async (req, res) => {
  try {
    const { selladoraId, turno, fecha } = req.query;

    console.log('🔍 Parámetros recibidos:', { selladoraId, turno, fecha });

    if (!selladoraId || !turno) {
      return res.status(400).json({ error: 'selladoraId y turno son requeridos' });
    }

    // Buscar planilla activa
    let query = supabase
      .from('planillas_produccion')
      .select('id, codigo_planilla, fecha, turno, selladora_id, estado_planilla')
      .eq('selladora_id', selladoraId)
      .eq('turno', turno)
      .eq('estado_planilla', 'activa');

    // ✅ SOLO filtra por fecha si se pasa explícitamente
    if (fecha) {
      query = query.eq('fecha', fecha);
      console.log('📅 Filtrando por fecha:', fecha);
    } else {
      console.log('📅 Sin filtro de fecha - buscando cualquier fecha');
    }

    const { data: planilla, error: pErr } = await query.single();

    console.log('📊 Resultado de búsqueda:', { planilla, error: pErr });

    if (pErr) {
      console.error('❌ Error de Supabase:', pErr);
      return res.status(500).json({ error: pErr.message });
    }

    if (!planilla) {
      return res.status(404).json({ 
        error: 'No hay una planilla activa para esta máquina en el turno seleccionado.',
        debug: { selladoraId, turno, fechaBuscada: fecha || 'ninguna (cualquier fecha)' }
      });
    }

    // Obtener tareas pendientes o en proceso
    const { data: tareas, error: tErr } = await supabase
      .from('planilla_tareas')
      .select(`
        id, 
        secuencia, 
        cantidad_programada, 
        estado_tarea,
        ordenes_produccion (
          numero_orden,
          referencia,
          nombre_referencia,
          cantidad_programada
        )
      `)
      .eq('planilla_id', planilla.id)
      .in('estado_tarea', ['pendiente', 'en_proceso'])
      .order('secuencia', { ascending: true });

    if (tErr) throw tErr;

    console.log('✅ Tareas encontradas:', tareas?.length || 0);

    res.json({ 
      planilla_id: planilla.id, 
      planilla_codigo: planilla.codigo_planilla, 
      planilla_fecha: planilla.fecha,  // ← Para debug
      tareas: tareas || [] 
    });

  } catch (err) {
    console.error('❌ Error en getTareasPlanilla:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 2. INICIAR REGISTRO DE SELLADO (Corregido)
// =====================================================
exports.iniciarRegistro = async (req, res) => {
  try {
    const { tareaId, codigoRollo, selladoraId } = req.body;
    // const operarioId = req.user?.id;  ← Comentado por ahora

    if (!tareaId || !codigoRollo || !selladoraId) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Obtener info de la tarea
    const { data: tarea, error: tErr } = await supabase
      .from('planilla_tareas')
      .select('planilla_id, orden_produccion_id, pedido_id, referencia_id')
      .eq('id', tareaId)
      .single();

    if (tErr) throw tErr;

    // Obtener info de la planilla
    const {  planilla } = await supabase
      .from('planillas_produccion')
      .select('fecha, turno')
      .eq('id', tarea.planilla_id)
      .single();

    const now = new Date().toISOString();

    // ✅ Construir registroData SIN operario_id si no está disponible
    const registroData = {
      planilla_id: tarea.planilla_id,
      tarea_id: tareaId,
      orden_produccion_id: tarea.orden_produccion_id,
      pedido_id: tarea.pedido_id,
      referencia_id: tarea.referencia_id,
      selladora_id: selladoraId,
      // operario_id: operarioId,  ← Comentado para evitar error
      codigo_rollo: codigoRollo,
      fecha: planilla.fecha,
      turno: planilla.turno,
      hora_inicio: now,
      estado_registro: 'en_proceso'
    };

    // Marcar tarea como en proceso
    await supabase
      .from('planilla_tareas')
      .update({ estado_tarea: 'en_proceso' })
      .eq('id', tareaId)
      .eq('estado_tarea', 'pendiente');

    const { data, error } = await supabase
      .from('registros_sellado')
      .insert(registroData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error al insertar registro:', error);
      throw error;
    }

    console.log('✅ Registro creado:', data?.id);
    res.status(201).json(data);

  } catch (err) {
    console.error('Error en iniciarRegistro:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// =====================================================
// =====================================================
// 3. FINALIZAR REGISTRO (CORREGIDO)
// =====================================================
exports.finalizarRegistro = async (req, res) => {
  try {
    const { registroId, tareaId, cantidadBolsasProducidas } = req.body;

    console.log('🔴 FINALIZAR - Datos recibidos:', { registroId, tareaId, cantidadBolsasProducidas });

    if (cantidadBolsasProducidas == null || cantidadBolsasProducidas <= 0) {
      return res.status(400).json({ error: 'Cantidad inválida' });
    }

    let targetRegistroId = registroId;

    // Si no tenemos registroId, buscamos por tareaId
    if (!targetRegistroId && tareaId) {
      console.log('🔍 Buscando registro activo para tarea:', tareaId);
      
      // ✅ CORRECCIÓN: Usar 'data' en lugar de 'registros'
      const { data: registros, error: searchErr } = await supabase
        .from('registros_sellado')
        .select('id, tarea_id, estado_registro, codigo_rollo')
        .eq('tarea_id', tareaId)
        .eq('estado_registro', 'en_proceso');

      console.log('📊 Resultado de búsqueda:', { registros, searchErr });

      if (searchErr) {
        console.error('❌ Error buscando registro:', searchErr);
        return res.status(500).json({ error: 'Error al buscar registro: ' + searchErr.message });
      }

      if (!registros || registros.length === 0) {
        // Buscar TODOS los registros de esa tarea para debug
        const { data: todos } = await supabase
          .from('registros_sellado')
          .select('id, tarea_id, estado_registro')
          .eq('tarea_id', tareaId);
        
        console.log('📋 Todos los registros de esta tarea:', todos);
        
        return res.status(404).json({ 
          error: 'No se encontró un registro activo para esta tarea.',
          debug: { 
            tareaId, 
            registrosEncontrados: registros?.length || 0,
            todosLosRegistros: todos 
          }
        });
      }
      
      targetRegistroId = registros[0].id;
      console.log('✅ Registro encontrado:', targetRegistroId);
    }

    if (!targetRegistroId) {
      return res.status(400).json({ error: 'Registro no especificado' });
    }

    const now = new Date().toISOString();

    const { error: rErr } = await supabase
      .from('registros_sellado')
      .update({
        hora_fin: now,
        cantidad_bolsas_producidas: parseFloat(cantidadBolsasProducidas),
        estado_registro: 'finalizado'
      })
      .eq('id', targetRegistroId)
      .eq('estado_registro', 'en_proceso');

    if (rErr) throw rErr;

    if (tareaId) {
      await supabase
        .from('planilla_tareas')
        .update({ estado_tarea: 'finalizada' })
        .eq('id', tareaId);
    }

    res.json({ message: 'Registro finalizado y producción contabilizada.' });

  } catch (err) {
    console.error('❌ Error en finalizarRegistro:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 4. OBTENER REGISTROS EN CURSO
// =====================================================
exports.getRegistrosEnCurso = async (req, res) => {
  try {
    // TEMPORAL: Sin autenticación - permite cualquier operario
    // const operarioId = req.user?.id;
    
    const { data, error } = await supabase
      .from('registros_sellado')
      .select(`
        id,
        codigo_rollo,
        hora_inicio,
        ordenes_produccion (
          numero_orden,
          referencia,
          nombre_referencia
        ),
        selladoras (
          nombre
        )
      `)
      .eq('estado_registro', 'en_proceso');
      // Sin filtrar por operario_id temporalmente

    if (error) throw error;

    const registrosEnriquecidos = (data || []).map(r => ({
      id: r.id,
      codigo_rollo: r.codigo_rollo,
      hora_inicio: r.hora_inicio,
      ordenes_produccion: r.ordenes_produccion,
      selladora_nombre: r.selladoras?.nombre || ''
    }));

    res.json(registrosEnriquecidos);

  } catch (err) {
    console.error('Error en getRegistrosEnCurso:', err);
    res.status(500).json({ error: err.message });
  }
};