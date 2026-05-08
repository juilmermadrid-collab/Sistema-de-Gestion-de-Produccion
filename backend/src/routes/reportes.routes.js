const express = require("express");
const router = express.Router();

const reportesController = require("../controllers/reportes.controller");

router.get("/turno", reportesController.reportePorTurno);

module.exports = router;