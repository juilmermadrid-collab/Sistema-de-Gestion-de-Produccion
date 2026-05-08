const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidos.controller');

router.get('/', pedidosController.getAll);
router.get('/:id', pedidosController.getById);
router.post('/', pedidosController.create);
router.put('/:id', pedidosController.update);

module.exports = router;