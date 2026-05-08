const { Router } = require('express');
const { listarPedidos, obtenerPedido, consultarDocumentacion } = require('../controllers/pedidos.controller');
const router = Router();
router.get('/', listarPedidos);
router.get('/documentacion', consultarDocumentacion);
router.get('/:id', obtenerPedido);
module.exports = router;
