const express = require("express");
const router = express.Router();

const ordenesController = require("../controllers/ordenes.controller");

router.get("/por-programar", ordenesController.listarOrdenesPorProgramar);
router.put("/:id/programar", ordenesController.actualizarOrdenConProgramacion);

module.exports = router;