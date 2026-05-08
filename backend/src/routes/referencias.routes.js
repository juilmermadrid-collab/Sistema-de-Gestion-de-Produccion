const express = require("express");
const router = express.Router();
const {
  buscarReferencias,
  obtenerReferenciaPorId,
} = require("../controllers/referencias.controller");

// GET /api/referencias?busqueda=...&tipo_producto=...&materia_prima=...&ancho=...&sellado=...
router.get("/", buscarReferencias);

// GET /api/referencias/:id
router.get("/:id", obtenerReferenciaPorId);

module.exports = router;