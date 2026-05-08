const supabase = require('../config/supabase');

// =====================================================
// 1. REPORTE DE PRODUCCIÓN POR FECHA
// =====================================================
exports.produccionPorFecha = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    let query = supabase
      .from('registros_sellado')
      .select(`
        *,
        ordenes_produccion (numero_orden),
        referencias (referencia, nombre),
        selladoras (nombre)
      `);

    if (fechaInicio) {
      query = query.gte('fecha', fechaInicio);
    }
    if (fechaFin) {
      query = query.lte('fecha', fechaFin);
    }

    const { data, error } = await query.order('fecha', { ascending: false });

    if (error) throw error;

    const totalBolsas = data.reduce((sum, reg) => sum + (reg.cantidad_bolsas_producidas || 0), 0);

    res.json({
      registros: data,
      total_bolsas: totalBolsas,
      total_registros: data.length
    });

  } catch (err) {
    console.error('Error en produccionPorFecha:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 2. REPORTE DE PRODUCTIVIDAD POR OPERARIO
// =====================================================
exports.productividadPorOperario = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    let query = supabase
      .from('registros_sellado')
      .select(`
        operario_id,
        usuarios (nombre, correo),
        cantidad_bolsas_producidas,
        fecha
      `);

    if (fechaInicio) {
      query = query.gte('fecha', fechaInicio);
    }
    if (fechaFin) {
      query = query.lte('fecha', fechaFin);
    }

    const { data, error } = await query;

    if (error) throw error;

    const productividad = {};
    data.forEach(reg => {
      const operarioId = reg.operario_id;
      if (!productividad[operarioId]) {
        productividad[operarioId] = {
          operario: reg.usuarios,
          total_bolsas: 0,
          total_registros: 0
        };
      }
      productividad[operarioId].total_bolsas += reg.cantidad_bolsas_producidas || 0;
      productividad[operarioId].total_registros += 1;
    });

    res.json(Object.values(productividad));

  } catch (err) {
    console.error('Error en productividadPorOperario:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 3. REPORTE DE EFICIENCIA POR SELLADORA
// =====================================================
exports.eficienciaPorSelladora = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    let query = supabase
      .from('registros_sellado')
      .select(`
        selladora_id,
        selladoras (nombre, codigo),
        cantidad_bolsas_producidas,
        hora_inicio,
        hora_fin
      `);

    if (fechaInicio) {
      query = query.gte('fecha', fechaInicio);
    }
    if (fechaFin) {
      query = query.lte('fecha', fechaFin);
    }

    const { data, error } = await query;

    if (error) throw error;

    const eficiencia = {};
    data.forEach(reg => {
      const selladoraId = reg.selladora_id;
      if (!eficiencia[selladoraId]) {
        eficiencia[selladoraId] = {
          selladora: reg.selladoras,
          total_bolsas: 0,
          total_horas: 0,
          total_registros: 0
        };
      }
      eficiencia[selladoraId].total_bolsas += reg.cantidad_bolsas_producidas || 0;
      eficiencia[selladoraId].total_registros += 1;
      
      if (reg.hora_inicio && reg.hora_fin) {
        const horas = (new Date(reg.hora_fin) - new Date(reg.hora_inicio)) / (1000 * 60 * 60);
        eficiencia[selladoraId].total_horas += horas;
      }
    });

    res.json(Object.values(eficiencia));

  } catch (err) {
    console.error('Error en eficienciaPorSelladora:', err);
    res.status(500).json({ error: err.message });
  }
};