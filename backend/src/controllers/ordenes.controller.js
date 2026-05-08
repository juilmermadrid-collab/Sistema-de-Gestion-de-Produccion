const supabase = require("../config/supabase");

const listarOrdenesPorProgramar = async (req, res) => {
  try {
    const { data: ordenes, error } = await supabase
      .from("ordenes_produccion")
      .select("*")
      .eq("estado_orden", "por_programar")
      .order("created_at", { ascending: true });

    if (error) {
      return res.status(500).json({
        mensaje: "Error consultando órdenes por programar",
        error: error.message,
      });
    }

    const referenciaIds = [...new Set(ordenes.map((o) => o.referencia_id))];

    let referencias = [];

    if (referenciaIds.length > 0) {
      const { data: refs, error: refsError } = await supabase
        .from("referencias")
        .select(
          "id, referencia, referencia_corta, nombre, tipo_producto, materia_prima, ancho, alto, calibre, sellado, medida"
        )
        .in("id", referenciaIds);

      if (refsError) {
        return res.status(500).json({
          mensaje: "Error consultando datos técnicos de referencias",
          error: refsError.message,
        });
      }

      referencias = refs;
    }

    const resultado = ordenes.map((orden) => {
      const referencia = referencias.find((r) => r.id === orden.referencia_id);

      return {
        ...orden,
        datos_tecnicos: referencia || null,
      };
    });

    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const actualizarOrdenConProgramacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { selladora_id, planilla_id } = req.body;

    const { data, error } = await supabase
      .from("ordenes_produccion")
      .update({
        selladora_id,
        planilla_id,
        estado_orden: "programada",
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        mensaje: "Error programando orden de producción",
        error: error.message,
      });
    }

    return res.json({
      mensaje: "Orden programada correctamente",
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
  listarOrdenesPorProgramar,
  actualizarOrdenConProgramacion,
};