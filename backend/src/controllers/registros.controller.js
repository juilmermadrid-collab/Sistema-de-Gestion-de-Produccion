const supabase = require("../config/supabase");

const listarRegistros = async (req, res) => {
  try {
    const { fecha, turno, selladora_id, operario_id } = req.query;

    let consulta = supabase
      .from("registros_sellado")
      .select(
        `
        *,
        selladoras (
          codigo,
          nombre
        ),
        usuarios (
          nombre,
          correo
        ),
        ordenes_produccion (
          numero_orden
        ),
        referencias (
          referencia,
          nombre
        )
      `
      )
      .order("fecha", { ascending: false });

    if (fecha) {
      consulta = consulta.eq("fecha", fecha);
    }

    if (turno) {
      consulta = consulta.eq("turno", turno);
    }

    if (selladora_id) {
      consulta = consulta.eq("selladora_id", selladora_id);
    }

    if (operario_id) {
      consulta = consulta.eq("operario_id", operario_id);
    }

    const { data, error } = await consulta;

    if (error) {
      return res.status(500).json({
        mensaje: "Error consultando registros de sellado",
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

module.exports = {
  listarRegistros,
};