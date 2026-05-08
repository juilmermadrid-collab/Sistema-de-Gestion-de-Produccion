const express = require("express");
const router = express.Router();

const selladorasController = require("../controllers/selladoras.controller");

router.get("/", selladorasController.listarSelladoras);
router.put("/:id", selladorasController.actualizarSelladora);

module.exports = router;