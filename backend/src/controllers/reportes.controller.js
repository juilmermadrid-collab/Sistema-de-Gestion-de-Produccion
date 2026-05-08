const supabase = require("../config/supabase");

const reportePorTurno = async (req, res) => {
  try {
    const { fecha, turno, selladora } = req.query;

    let consulta = supabase
      .from("vw_reporte_turno")
      .select("*")
      .order("hora_inicio", { ascending: true });

    if (fecha) consulta = consulta.eq("fecha", fecha);
    if (turno) consulta = consulta.eq("turno", turno);
    if (selladora) consulta = consulta.eq("codigo_selladora", selladora);

    const { data, error } = await consulta;

    if (error) {
      return res.status(500).json({
        mensaje: "Error generando reporte por turno",
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
  reportePorTurno,
};