const express = require("express");
const router = express.Router();

const planillasController = require("../controllers/planillas.controller");

router.post("/", planillasController.crearPlanilla);
router.get("/", planillasController.listarPlanillas);
router.get("/:id", planillasController.obtenerPlanillaPorId);
router.post("/:id/tareas", planillasController.agregarTareaPlanilla);
router.put("/:id/tareas/:tareaId", planillasController.actualizarTareaPlanilla);

module.exports = router;