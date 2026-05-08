const supabase = require("../config/supabase");

// RF-V01 y RF-V02: Buscar referencias con filtros, sin lista masiva
const buscarReferencias = async (req, res) => {
  try {
    const { busqueda, tipo_producto, materia_prima, ancho, sellado } = req.query;

    // Si no hay ningún filtro, no devolver nada (evitar lista masiva RF-V02)
    if (!busqueda && !tipo_producto && !materia_prima && !ancho && !sellado) {
      return res.json([]);
    }

    let query = supabase
      .from("referencias")
      .select(
        "id, referencia, referencia_corta, nombre, descripcion, tipo_producto, materia_prima, ancho, sellado, valor_unitario, estado"
      )
      .eq("estado", "activa");

    if (busqueda) {
      query = query.or(
        `referencia.ilike.%${busqueda}%,referencia_corta.ilike.%${busqueda}%,nombre.ilike.%${busqueda}%,descripcion.ilike.%${busqueda}%`
      );
    }
    if (tipo_producto) query = query.eq("tipo_producto", tipo_producto);
    if (materia_prima) query = query.eq("materia_prima", materia_prima);
    if (ancho) query = query.eq("ancho", parseFloat(ancho));
    if (sellado) query = query.eq("sellado", sellado);

    query = query.limit(20);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener una referencia por ID (para mostrar detalle en el pedido)
const obtenerReferenciaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("referencias")
      .select(
        "id, referencia, referencia_corta, nombre, descripcion, tipo_producto, materia_prima, ancho, sellado, valor_unitario, estado"
      )
      .eq("id", id)
      .single();

    if (error) return res.status(404).json({ error: "Referencia no encontrada" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { buscarReferencias, obtenerReferenciaPorId };