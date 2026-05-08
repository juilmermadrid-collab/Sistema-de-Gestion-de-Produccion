const supabase = require("../config/supabase");

const listarSelladoras = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("selladoras")
      .select("*")
      .order("numero", { ascending: true });

    if (error) {
      return res.status(500).json({
        mensaje: "Error consultando selladoras",
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

const actualizarSelladora = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre,
      sellado_fondo,
      sellado_lateral,
      tipos_referencia_permitidos,
      estado,
    } = req.body;

    const tiposNormalizados = Array.isArray(tipos_referencia_permitidos)
      ? tipos_referencia_permitidos
      : String(tipos_referencia_permitidos || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    const { data, error } = await supabase
      .from("selladoras")
      .update({
        nombre,
        sellado_fondo,
        sellado_lateral,
        tipos_referencia_permitidos: tiposNormalizados,
        estado,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        mensaje: "Error actualizando selladora",
        error: error.message,
      });
    }

    return res.json({
      mensaje: "Selladora actualizada correctamente",
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
  listarSelladoras,
  actualizarSelladora,
};