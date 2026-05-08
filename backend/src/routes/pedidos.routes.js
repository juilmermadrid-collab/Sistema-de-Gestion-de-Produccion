const express = require("express");
const router = express.Router();
const {
  crearPedido,
  listarPedidos,
  obtenerPedidoPorId,
} = require("../controllers/pedidos.controller");

// GET /api/pedidos?vendedor_id=...
router.get("/", listarPedidos);

// GET /api/pedidos/:id
router.get("/:id", obtenerPedidoPorId);

// POST /api/pedidos
router.post("/", crearPedido);

module.exports = router;