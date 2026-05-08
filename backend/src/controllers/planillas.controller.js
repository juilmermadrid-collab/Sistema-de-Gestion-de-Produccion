const supabase = require("../config/supabase");

const obtenerAuxiliarProduccion = async () => {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id")
    .eq("rol", "auxiliar_produccion")
    .eq("estado", true)
    .limit(1)
    .single();

  if (error) return null;
  return data;
};

const crearPlanilla = async (req, res) => {
  try {
    const { fecha, turno, selladora_id, creada_por } = req.body;

    if (!fecha || !turno || !selladora_id) {
      return res.status(400).json({
        mensaje: "Fecha, turno y selladora son obligatorios",
      });
    }

    const { data: selladora, error: selladoraError } = await supabase
      .from("selladoras")
      .select("id, codigo")
      .eq("id", selladora_id)
      .single();

    if (selladoraError) {
      return res.status(404).json({
        mensaje: "Selladora no encontrada",
        error: selladoraError.message,
      });
    }

    let usuarioCreador = creada_por;

    if (!usuarioCreador) {
      const auxiliar = await obtenerAuxiliarProduccion();

      if (!auxiliar) {
        return res.status(400).json({
          mensaje: "No existe un usuario auxiliar de producción activo",
        });
      }

      usuarioCreador = auxiliar.id;
    }

    const fechaCodigo = fecha.replaceAll("-", "");
    const codigoPlanilla = `PL-${fechaCodigo}-${turno}-${selladora.codigo}`;

    const { data, error } = await supabase
      .from("planillas_produccion")
      .insert({
        codigo_planilla: codigoPlanilla,
        fecha,
        turno,
        selladora_id,
        creada_por: usuarioCreador,
        estado_planilla: "activa",
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        mensaje:
          "Error creando planilla. Verifica si ya existe una planilla para esa fecha, turno y selladora.",
        error: error.message,
      });
    }

    return res.status(201).json({
      mensaje: "Planilla creada correctamente",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const listarPlanillas = async (req, res) => {
  try {
    const { fecha, turno, selladora_id } = req.query;

    let consulta = supabase
      .from("planillas_produccion")
      .select(
        `
        *,
        selladoras (
          codigo,
          nombre,
          numero
        ),
        usuarios (
          nombre,
          correo
        )
      `
      )
      .order("fecha", { ascending: false });

    if (fecha) consulta = consulta.eq("fecha", fecha);
    if (turno) consulta = consulta.eq("turno", turno);
    if (selladora_id) consulta = consulta.eq("selladora_id", selladora_id);

    const { data, error } = await consulta;

    if (error) {
      return res.status(500).json({
        mensaje: "Error consultando planillas",
        error: error.message,
      });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const obtenerPlanillaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: planilla, error: planillaError } = await supabase
      .from("planillas_produccion")
      .select(
        `
        *,
        selladoras (
          codigo,
          nombre,
          numero
        )
      `
      )
      .eq("id", id)
      .single();

    if (planillaError) {
      return res.status(404).json({
        mensaje: "Planilla no encontrada",
        error: planillaError.message,
      });
    }

    const { data: tareas, error: tareasError } = await supabase
      .from("planilla_tareas")
      .select(
        `
        *,
        ordenes_produccion (
          numero_orden,
          estado_orden
        ),
        referencias (
          referencia,
          nombre,
          tipo_producto,
          materia_prima,
          ancho,
          alto,
          calibre,
          sellado,
          medida
        )
      `
      )
      .eq("planilla_id", id)
      .order("secuencia", { ascending: true });

    if (tareasError) {
      return res.status(500).json({
        mensaje: "Error consultando tareas de la planilla",
        error: tareasError.message,
      });
    }

    return res.json({
      ...planilla,
      tareas,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const agregarTareaPlanilla = async (req, res) => {
  try {
    const { id } = req.params;
    const { orden_produccion_id, secuencia, grupo_similar } = req.body;

    if (!orden_produccion_id || !secuencia) {
      return res.status(400).json({
        mensaje: "Orden de producción y secuencia son obligatorias",
      });
    }

    const { data: planilla, error: planillaError } = await supabase
      .from("planillas_produccion")
      .select("*")
      .eq("id", id)
      .single();

    if (planillaError) {
      return res.status(404).json({
        mensaje: "Planilla no encontrada",
        error: planillaError.message,
      });
    }

    const { data: orden, error: ordenError } = await supabase
      .from("ordenes_produccion")
      .select("*")
      .eq("id", orden_produccion_id)
      .single();

    if (ordenError) {
      return res.status(404).json({
        mensaje: "Orden de producción no encontrada",
        error: ordenError.message,
      });
    }

    const { data: tarea, error: tareaError } = await supabase
      .from("planilla_tareas")
      .insert({
        planilla_id: id,
        secuencia,
        orden_produccion_id,
        pedido_id: orden.pedido_id,
        referencia_id: orden.referencia_id,
        referencia: orden.referencia,
        nombre_referencia: orden.nombre_referencia,
        cantidad_programada: orden.cantidad_programada,
        grupo_similar: grupo_similar || null,
        estado_tarea: "pendiente",
      })
      .select()
      .single();

    if (tareaError) {
      return res.status(500).json({
        mensaje:
          "Error agregando tarea a la planilla. Revisa que la secuencia no esté repetida.",
        error: tareaError.message,
      });
    }

    const { error: actualizarOrdenError } = await supabase
      .from("ordenes_produccion")
      .update({
        selladora_id: planilla.selladora_id,
        planilla_id: id,
        estado_orden: "programada",
      })
      .eq("id", orden_produccion_id);

    if (actualizarOrdenError) {
      return res.status(500).json({
        mensaje: "La tarea se creó, pero no se pudo actualizar la orden",
        error: actualizarOrdenError.message,
      });
    }

    return res.status(201).json({
      mensaje: "Tarea agregada a la planilla correctamente",
      data: tarea,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const actualizarTareaPlanilla = async (req, res) => {
  try {
    const { tareaId } = req.params;
    const { secuencia, grupo_similar, estado_tarea } = req.body;

    const { data, error } = await supabase
      .from("planilla_tareas")
      .update({
        secuencia,
        grupo_similar: grupo_similar || null,
        estado_tarea,
      })
      .eq("id", tareaId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        mensaje: "Error actualizando tarea de planilla",
        error: error.message,
      });
    }

    return res.json({
      mensaje: "Tarea actualizada correctamente",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

module.exports = {
  crearPlanilla,
  listarPlanillas,
  obtenerPlanillaPorId,
  agregarTareaPlanilla,
  actualizarTareaPlanilla,
};