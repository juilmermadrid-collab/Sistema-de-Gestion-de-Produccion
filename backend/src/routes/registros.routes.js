const express = require("express");
const router = express.Router();

const registrosController = require("../controllers/registros.controller");

router.get("/", registrosController.listarRegistros);

module.exports = router;