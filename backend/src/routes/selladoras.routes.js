const express = require('express');
const router = express.Router();
const selladorasController = require('../controllers/selladoras.controller');

// Rutas
router.get('/', selladorasController.getAll);
router.get('/:id', selladorasController.getById);
router.post('/', selladorasController.create);
router.put('/:id', selladorasController.update);
router.delete('/:id', selladorasController.delete);

// ← ESTO ES OBLIGATORIO:
module.exports = router;