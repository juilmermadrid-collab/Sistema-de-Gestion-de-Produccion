const { Router } = require('express');
const { listarOrdenes, obtenerOrden, crearOrden, cambiarEstadoOrden, cambiarEstadoProduccionItem } = require('../controllers/ordenes.controller');
const router = Router();
router.get('/', listarOrdenes);
router.get('/:id', obtenerOrden);
router.post('/', crearOrden);
router.patch('/:id/estado', cambiarEstadoOrden);
router.patch('/pedido-item/:pedido_item_id/estado-produccion', cambiarEstadoProduccionItem);
module.exports = router;
